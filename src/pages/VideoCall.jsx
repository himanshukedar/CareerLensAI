import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
    Mic, MicOff, Video, VideoOff, Phone, PhoneOff,
    Maximize2, Minimize2, Users, Clock, Copy, CheckCircle,
    AlertCircle, Wifi, WifiOff, Loader2, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './VideoCall.css';

const SOCKET_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000' 
    : window.location.origin.replace(/:\d+$/, ':5000');

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
};

export default function VideoCall() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isRecruiter = user?.role === 'recruiter';

    // Refs
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const callDurationRef = useRef(null);
    const iceCandidatesQueue = useRef([]);

    // State
    const [callStatus, setCallStatus] = useState('connecting'); // connecting | waiting | in-call | ended | error
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [remoteMicEnabled, setRemoteMicEnabled] = useState(true);
    const [remoteCameraEnabled, setRemoteCameraEnabled] = useState(true);
    const [isPiP, setIsPiP] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [copied, setCopied] = useState(false);
    const [networkQuality, setNetworkQuality] = useState('good'); // good | poor | lost
    const [remoteUserName, setRemoteUserName] = useState('');
    const [showControls, setShowControls] = useState(true);
    const [modalType, setModalType] = useState(null); // 'end-confirm'
    const [iceServers, setIceServers] = useState(null);

    const callLink = `${window.location.origin}/video-call/${roomId}`;

    // ─── Fetch ICE Servers ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchIce = async () => {
            try {
                const response = await fetch(`${SOCKET_URL}/api/videocall/ice-servers`);
                const data = await response.json();
                setIceServers(data.iceServers);
            } catch (err) {
                console.warn("Failed to fetch ICE servers, using defaults:", err);
                setIceServers([
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]);
            }
        };
        fetchIce();
    }, []);

    // ─── Timer ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (callStatus === 'in-call') {
            callDurationRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(callDurationRef.current);
    }, [callStatus]);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ─── Setup Media + Socket + WebRTC ────────────────────────────────────────
    useEffect(() => {
        if (!iceServers) return; // Wait for ICE servers

        let mounted = true;

        const setup = async () => {
            try {
                // 1. Check for Secure Context
                if (!window.isSecureContext && window.location.hostname !== 'localhost') {
                    const msg = "Security Error: Camera/Mic access requires HTTPS.";
                    toast.error(msg);
                    if (mounted) setCallStatus('error');
                    return;
                }

                // 2. Get local media
                let stream = null;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { 
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                            facingMode: 'user' 
                        },
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true
                        }
                    });
                } catch (err) {
                    console.warn("Primary media attempt failed:", err.name);
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    } catch (fallbackErr) {
                        if (err.name === 'NotAllowedError') throw new Error("PERMISSION_DENIED");
                        throw new Error("HARDWARE_ERROR");
                    }
                }
                
                localStreamRef.current = stream;
                setCameraEnabled(!!stream.getVideoTracks().length);
                setMicEnabled(!!stream.getAudioTracks().length);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play().catch(console.error);
                }

                // 3. Connect socket
                socketRef.current = io(SOCKET_URL, { 
                    transports: ['websocket', 'polling'],
                    reconnectionAttempts: 10,
                    timeout: 20000
                });

                socketRef.current.on('connect', () => {
                    console.log('📡 Connected to Signaling Server:', socketRef.current.id);
                    if (isRecruiter) {
                        socketRef.current.emit('create-room', { roomId, userName: user?.name });
                    } else {
                        socketRef.current.emit('join-room', { roomId, userName: user?.name });
                    }
                });

                socketRef.current.on('room-created', () => {
                    if (mounted) setCallStatus('waiting');
                });

                socketRef.current.on('room-joined', () => {
                    if (mounted) setCallStatus('waiting');
                });

                socketRef.current.on('user-joined', async ({ userName }) => {
                    if (!mounted) return;
                    setRemoteUserName(userName);
                    toast.success(`${userName} joined! Initializing connection...`);
                    if (isRecruiter) {
                        await createAndSendOffer();
                    }
                });

                socketRef.current.on('offer', async ({ offer }) => {
                    if (!mounted) return;
                    console.log("📥 Received Offer");
                    await handleOffer(offer);
                });

                socketRef.current.on('answer', async ({ answer }) => {
                    if (!mounted) return;
                    console.log("📥 Received Answer");
                    if (peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                        processQueuedCandidates();
                    }
                });

                socketRef.current.on('ice-candidate', async ({ candidate }) => {
                    if (!mounted || !candidate) return;
                    const pc = peerConnectionRef.current;
                    if (pc && pc.remoteDescription && pc.remoteDescription.type) {
                        try {
                            await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        } catch (e) {
                            console.error("Error adding received ICE candidate:", e);
                        }
                    } else {
                        iceCandidatesQueue.current.push(candidate);
                    }
                });

                socketRef.current.on('peer-media-toggle', ({ type, enabled }) => {
                    if (type === 'audio') setRemoteMicEnabled(enabled);
                    if (type === 'video') setRemoteCameraEnabled(enabled);
                });

                socketRef.current.on('call-ended', () => {
                    if (mounted) {
                        setCallStatus('ended');
                        toast('Interview session ended.');
                        cleanup();
                    }
                });

                socketRef.current.on('error', ({ msg }) => {
                    toast.error(msg);
                    if (mounted) setCallStatus('error');
                });

            } catch (err) {
                console.error('Signaling Setup Error:', err);
                const msg = err.message === "PERMISSION_DENIED" 
                    ? "Camera/Mic access denied. Please allow them in your browser settings."
                    : "No camera/mic found. Please connect them and refresh.";
                toast.error(msg);
                if (mounted) setCallStatus('error');
            }
        };

        setup();

        return () => {
            mounted = false;
            cleanup();
        };
    }, [roomId, iceServers]);

    const processQueuedCandidates = async () => {
        const pc = peerConnectionRef.current;
        if (!pc || !pc.remoteDescription) return;
        
        while (iceCandidatesQueue.current.length > 0) {
            const cand = iceCandidatesQueue.current.shift();
            try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (e) {
                console.warn("Failed to add queued candidate:", e);
            }
        }
    };

    const createPeerConnection = useCallback(() => {
        console.log("🛠️ Creating Peer Connection...");
        const pc = new RTCPeerConnection({ iceServers });

        // Add local tracks
        localStreamRef.current?.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });

        // Receive remote tracks
        pc.ontrack = (event) => {
            console.log("🎞️ Remote track received:", event.track.kind);
            if (remoteVideoRef.current) {
                // Ensure we use the correct stream object
                const remoteStream = event.streams[0] || new MediaStream([event.track]);
                
                if (remoteVideoRef.current.srcObject !== remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    console.log("✅ Attached remote stream to video element");
                }
                
                // Force video start
                remoteVideoRef.current.play().catch(err => {
                    console.warn("Play attempt failed, waiting for user interaction:", err);
                });

                if (event.track.kind === 'video') {
                    setCallStatus('in-call');
                }
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', { roomId, candidate: event.candidate });
            }
        };

        pc.onconnectionstatechange = () => {
            console.log("📡 Connection State:", pc.connectionState);
            const state = pc.connectionState;
            if (state === 'connected') {
                setCallStatus('in-call');
                setNetworkQuality('good');
            } else if (state === 'disconnected' || state === 'failed') {
                setNetworkQuality(state === 'failed' ? 'lost' : 'poor');
            }
        };

        // Handle negotiation needed (e.g. tracks added later)
        pc.onnegotiationneeded = async () => {
            try {
                if (isRecruiter) {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socketRef.current?.emit('offer', { roomId, offer });
                }
            } catch (err) {
                console.error("Negotiation error:", err);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [roomId, iceServers, isRecruiter]);

    const createAndSendOffer = useCallback(async () => {
        try {
            const pc = createPeerConnection();
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketRef.current?.emit('offer', { roomId, offer });
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    }, [createPeerConnection, roomId]);

    const handleOffer = useCallback(async (offer) => {
        try {
            const pc = createPeerConnection();
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            
            processQueuedCandidates();

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current?.emit('answer', { roomId, answer });
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    }, [createPeerConnection, roomId]);

    const cleanup = () => {
        clearInterval(callDurationRef.current);
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        if (peerConnectionRef.current) {
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.onconnectionstatechange = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    // ─── Controls ─────────────────────────────────────────────────────────────
    const toggleMic = async () => {
        let track = localStreamRef.current?.getAudioTracks()[0];
        if (!track) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const newTrack = newStream.getAudioTracks()[0];
                localStreamRef.current.addTrack(newTrack);
                track = newTrack;
                
                // Add to peer connection
                if (peerConnectionRef.current) {
                    const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'audio');
                    if (sender) sender.replaceTrack(newTrack);
                    else peerConnectionRef.current.addTrack(newTrack, localStreamRef.current);
                }
            } catch (err) {
                toast.error("Microphone access still denied.");
                return;
            }
        }
        
        track.enabled = !track.enabled;
        setMicEnabled(track.enabled);
        socketRef.current?.emit('media-toggle', { roomId, type: 'audio', enabled: track.enabled });
    };

    const toggleCamera = async () => {
        let track = localStreamRef.current?.getVideoTracks()[0];
        if (!track) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const newTrack = newStream.getVideoTracks()[0];
                localStreamRef.current.addTrack(newTrack);
                track = newTrack;
                
                // Update local video element
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStreamRef.current;
                }

                // Add to peer connection
                if (peerConnectionRef.current) {
                    const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
                    if (sender) sender.replaceTrack(newTrack);
                    else peerConnectionRef.current.addTrack(newTrack, localStreamRef.current);
                }
            } catch (err) {
                toast.error("Camera access still denied. Check browser settings.");
                return;
            }
        }
        
        track.enabled = !track.enabled;
        setCameraEnabled(track.enabled);
        socketRef.current?.emit('media-toggle', { roomId, type: 'video', enabled: track.enabled });
    };

    const endCall = () => {
        socketRef.current?.emit('end-call', { roomId });
        setCallStatus('ended');
        cleanup();
    };

    const copyLink = () => {
        navigator.clipboard.writeText(callLink);
        setCopied(true);
        toast.success('Interview link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Auto-hide controls ───────────────────────────────────────────────────
    useEffect(() => {
        let timer;
        const show = () => {
            setShowControls(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (callStatus === 'in-call') setShowControls(false);
            }, 4000);
        };
        window.addEventListener('mousemove', show);
        window.addEventListener('touchstart', show);
        return () => { 
            window.removeEventListener('mousemove', show); 
            window.removeEventListener('touchstart', show);
            clearTimeout(timer); 
        };
    }, [callStatus]);

    // Force play on remote video when status changes to in-call
    useEffect(() => {
        if (callStatus === 'in-call' && remoteVideoRef.current && remoteVideoRef.current.srcObject) {
            remoteVideoRef.current.play().catch(e => console.error("Final play attempt failed:", e));
        }
    }, [callStatus]);

    // ─── Render: ended / error ────────────────────────────────────────────────
    if (callStatus === 'ended' || callStatus === 'error') {
        return (
            <div className="vc-ended-screen">
                <Motion.div
                    className="vc-ended-card glass-panel"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className={`vc-ended-icon ${callStatus === 'error' ? 'error' : ''}`}>
                        {callStatus === 'error' ? <AlertCircle size={56} /> : <PhoneOff size={56} />}
                    </div>
                    <h2>{callStatus === 'error' ? 'Connection Failed' : 'Call Ended'}</h2>
                    {callStatus === 'ended' && (
                        <p className="vc-ended-duration">
                            <Clock size={16} /> Duration: {formatDuration(callDuration)}
                        </p>
                    )}
                    <p className="vc-ended-sub">
                        {callStatus === 'error'
                            ? 'Please check your camera/mic permissions and try again.'
                            : 'The interview session has concluded.'}
                    </p>
                    <div className="vc-ended-actions">
                        <button
                            className="neon-btn"
                            onClick={() => navigate(isRecruiter ? '/recruiter-jobs' : '/jobs')}
                        >
                            Back to {isRecruiter ? 'Jobs' : 'Job Board'}
                        </button>
                        {callStatus === 'error' && (
                            <button className="outline-btn" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        )}
                    </div>
                </Motion.div>
            </div>
        );
    }

    return (
        <div className="vc-room">
            {/* ── Header ── */}
            <AnimatePresence>
                {(showControls || callStatus !== 'in-call') && (
                    <Motion.header
                        className="vc-header glass-panel"
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                    >
                        <div className="vc-header-left">
                            <div className="vc-logo-badge">
                                <span className="vc-logo-dot" />
                                CareerLens AI
                            </div>
                            {callStatus === 'in-call' && (
                                <div className="vc-timer">
                                    <Clock size={14} />
                                    {formatDuration(callDuration)}
                                </div>
                            )}
                        </div>
                        <div className="vc-header-right">
                            <div className={`vc-network-badge ${networkQuality}`}>
                                {networkQuality === 'good' ? <Wifi size={14} /> : <WifiOff size={14} />}
                                {networkQuality === 'good' ? 'Connected' : networkQuality === 'poor' ? 'Unstable' : 'Lost'}
                            </div>
                            <div className="vc-room-id">
                                Room: {roomId?.slice(0, 8)}...
                            </div>
                        </div>
                    </Motion.header>
                )}
            </AnimatePresence>

            {/* ── Video Grid ── */}
            <div className={`vc-video-grid ${callStatus === 'in-call' ? 'active' : ''}`}>
                {/* Remote Video (main) */}
                <div className="vc-remote-wrapper">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="vc-remote-video"
                        onLoadedMetadata={(e) => e.target.play().catch(console.error)}
                    />
                    {callStatus !== 'in-call' && (
                        <div className="vc-waiting-overlay">
                            {callStatus === 'connecting' ? (
                                <>
                                    <Loader2 size={48} className="vc-spin" />
                                    <p>Connecting to interview room...</p>
                                </>
                            ) : (
                                <>
                                    <div className="vc-waiting-avatar">
                                        <Users size={48} />
                                    </div>
                                    <h3 className="vc-waiting-title">
                                        {isRecruiter ? 'Waiting for candidate...' : 'Waiting for recruiter...'}
                                    </h3>
                                    <p className="vc-waiting-sub">
                                        Share this link with {isRecruiter ? 'the candidate' : 'your recruiter'}
                                    </p>
                                    {isRecruiter && (
                                        <button className="vc-copy-btn" onClick={copyLink}>
                                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied!' : 'Copy Interview Link'}
                                        </button>
                                    )}
                                    <div className="vc-link-box">
                                        <span>{callLink}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {callStatus === 'in-call' && remoteUserName && (
                        <div className="vc-remote-name-tag">
                            {remoteUserName}
                            {!remoteMicEnabled && <MicOff size={14} color="#ef4444" />}
                            {!remoteCameraEnabled && <VideoOff size={14} color="#ef4444" />}
                        </div>
                    )}
                </div>

                {/* Local Video (PiP) */}
                <div className={`vc-local-wrapper ${isPiP ? 'pip-mode' : ''}`}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="vc-local-video"
                    />
                    {!cameraEnabled && (
                        <div className="vc-camera-off-overlay">
                            <VideoOff size={32} />
                        </div>
                    )}
                    <div className="vc-local-name-tag">
                        You ({user?.name})
                        {!micEnabled && <MicOff size={12} color="#ef4444" />}
                    </div>
                    <button className="vc-pip-toggle" onClick={() => setIsPiP(!isPiP)}>
                        {isPiP ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* ── Controls Bar ── */}
            <AnimatePresence>
                {(showControls || callStatus !== 'in-call') && (
                    <Motion.div
                        className="vc-controls glass-panel"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                    >
                        {/* Mic */}
                        <button
                            className={`vc-ctrl-btn ${!micEnabled ? 'active-off' : ''}`}
                            onClick={toggleMic}
                            title={micEnabled ? 'Mute mic' : 'Unmute mic'}
                        >
                            {micEnabled ? <Mic size={22} /> : <MicOff size={22} />}
                            <span>{micEnabled ? 'Mute' : 'Unmute'}</span>
                        </button>

                        {/* Camera */}
                        <button
                            className={`vc-ctrl-btn ${!cameraEnabled ? 'active-off' : ''}`}
                            onClick={toggleCamera}
                            title={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {cameraEnabled ? <Video size={22} /> : <VideoOff size={22} />}
                            <span>{cameraEnabled ? 'Camera' : 'Cam Off'}</span>
                        </button>

                        {/* End Call */}
                        <button className="vc-ctrl-btn end-call-btn" onClick={() => setModalType('end-confirm')}>
                            <PhoneOff size={22} />
                            <span>End Call</span>
                        </button>

                        {/* Copy Link (recruiter in-call) */}
                        {isRecruiter && callStatus === 'in-call' && (
                            <button className="vc-ctrl-btn" onClick={copyLink}>
                                {copied ? <CheckCircle size={22} /> : <Copy size={22} />}
                                <span>Copy Link</span>
                            </button>
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* ── End Call Confirmation Modal ── */}
            <AnimatePresence>
                {modalType === 'end-confirm' && (
                    <Motion.div
                        className="vc-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalType(null)}
                    >
                        <Motion.div
                            className="vc-modal glass-panel"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <PhoneOff size={40} color="#ef4444" />
                            <h3>End Interview?</h3>
                            <p>This will disconnect both parties from the session.</p>
                            <div className="vc-modal-actions">
                                <button className="outline-btn" onClick={() => setModalType(null)}>
                                    Continue Call
                                </button>
                                <button className="vc-end-confirm-btn" onClick={endCall}>
                                    Yes, End Call
                                </button>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
