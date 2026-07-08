import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, ArrowLeft, Search, Building2, Video, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import api from '../api/api';
import toast from 'react-hot-toast';
import './StudentJobs.css';

export default function StudentJobs() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinLink, setJoinLink] = useState('');
    const [applyJob, setApplyJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/roadmap/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleJoinInterview = () => {
        // Accept either full URL or just the roomId
        let roomId = joinLink.trim();
        // Extract roomId from a full URL like http://localhost:5173/video-call/UUID
        const match = roomId.match(/video-call\/([a-f0-9-]{36})/);
        if (match) roomId = match[1];
        if (!roomId || roomId.length < 10) {
            toast.error('Please paste a valid interview link.');
            return;
        }
        setShowJoinModal(false);
        navigate(`/video-call/${roomId}`);
    };

    const submitApplication = async () => {
        setIsApplying(true);
        try {
            await api.post(`/roadmap/jobs/${applyJob._id}/apply`);
            toast.success(`Successfully applied to ${applyJob.companyName}!`);
            setApplyJob(null);
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to apply');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <>
        <AnimatedPage className="student-jobs-page">
            <div className="jobs-search-container container" style={{ marginTop: '2rem' }}>
                <div className="search-bar-wrapper glass-panel">
                    <Search size={22} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for roles, skills, or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="job-search-input-modern"
                    />
                </div>
            </div>

            <div className="jobs-content container">
                <header className="jobs-header">
                    <h1 className="hero-title">Job <span className="highlight">Marketplace</span></h1>
                    <p className="hero-subtitle">Opportunities tailored for your skill level and roadmap progress.</p>
                </header>

                {loading ? (
                    <div className="jobs-loading">
                        <div className="spinner"></div>
                        <p>Loading opportunities...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="jobs-grid">
                        {filteredJobs.map((job) => (
                            <Motion.div
                                key={job._id}
                                className="job-card glass-panel"
                                whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="job-card-header">
                                    <div className="company-logo">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="job-title-area">
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.companyName}</p>
                                    </div>
                                </div>

                                <div className="job-details">
                                    <div className="job-detail">
                                        <MapPin size={16} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="job-detail">
                                        <DollarSign size={16} />
                                        <span>{job.salaryRange}</span>
                                    </div>
                                    <div className="job-detail">
                                        <Clock size={16} />
                                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="job-requirements">
                                    {job.requirements?.slice(0, 3).map((req, i) => (
                                        <span key={i} className="req-tag">{req}</span>
                                    ))}
                                    {job.requirements?.length > 3 && <span>+{job.requirements.length - 3} more</span>}
                                </div>

                                <div className="job-actions">
                                    <button 
                                        className="apply-btn neon-btn" 
                                        onClick={() => setApplyJob(job)}
                                        disabled={job.applicants?.some(a => a.userId === user._id)}
                                        style={job.applicants?.some(a => a.userId === user._id) ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                                    >
                                        {job.applicants?.some(a => a.userId === user._id) ? 'Applied ✅' : 'Apply Now'}
                                    </button>
                                    <button className="msg-btn outline-btn" onClick={() => navigate('/messages', { state: { recipient: { id: job.recruiterId, name: job.companyName, role: 'recruiter' } } })}>
                                        Ask Recruiter
                                    </button>
                                    <button
                                        className="join-interview-card-btn"
                                        onClick={() => { setJoinLink(''); setShowJoinModal(job._id); }}
                                    >
                                        <Video size={14} />
                                        Join Interview
                                    </button>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="no-jobs glass-panel">
                        <Briefcase size={48} opacity={0.2} />
                        <h3>No jobs found matching your search.</h3>
                        <p>Check back later or explore new roadmaps to unlock more opportunities!</p>
                    </div>
                )}
            </div>
        </AnimatedPage>

        {/* Join Interview Modal — opens per job card */}
        <AnimatePresence>
            {showJoinModal && (
                <Motion.div
                    className="join-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowJoinModal(false)}
                >
                    <Motion.div
                        className="join-modal glass-panel"
                        initial={{ scale: 0.85, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="join-modal-close" onClick={() => setShowJoinModal(false)}><X size={20} /></button>
                        <div className="join-modal-icon">
                            <Video size={36} color="#00f3ff" />
                        </div>
                        <h3 className="join-modal-title">Join Interview Call</h3>
                        <p className="join-modal-sub">
                            Recruiter ne jo link share kiya hai woh yahan paste karein.
                        </p>
                        <input
                            className="join-modal-input"
                            type="text"
                            placeholder="Interview link ya Room ID paste karein..."
                            value={joinLink}
                            onChange={e => setJoinLink(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleJoinInterview()}
                            autoFocus
                        />
                        <button className="neon-btn join-modal-btn" onClick={handleJoinInterview}>
                            <Video size={18} /> Join Now
                        </button>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>

        {/* Apply Confirmation Modal */}
        <AnimatePresence>
            {applyJob && (
                <Motion.div
                    className="join-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setApplyJob(null)}
                >
                    <Motion.div
                        className="join-modal glass-panel"
                        initial={{ scale: 0.85, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="join-modal-close" onClick={() => setApplyJob(null)}><X size={20} /></button>
                        <div className="join-modal-icon">
                            <Briefcase size={36} color="var(--primary)" />
                        </div>
                        <h3 className="join-modal-title">Confirm Application</h3>
                        <p className="join-modal-sub" style={{ marginBottom: '20px' }}>
                            You are about to apply for the <strong>{applyJob.title}</strong> role at <strong>{applyJob.companyName}</strong>. 
                            Your CareerLens AI profile data and verified skills will be shared with the recruiter.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="outline-btn" 
                                style={{ flex: 1 }} 
                                onClick={() => setApplyJob(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="neon-btn" 
                                style={{ flex: 1, border: 'none' }} 
                                onClick={submitApplication}
                                disabled={isApplying}
                            >
                                {isApplying ? 'Applying...' : 'Confirm Apply'}
                            </button>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
