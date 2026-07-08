const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/error');

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS Options
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// ─── WebRTC Signaling ─────────────────────────────────────────────────────────
const rooms = {};

io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('create-room', ({ roomId, userName }) => {
        rooms[roomId] = { recruiter: socket.id, student: null };
        socket.join(roomId);
        socket.emit('room-created', { roomId });
        console.log(`📞 Room created: ${roomId} by ${userName}`);
    });

    socket.on('join-room', ({ roomId, userName }) => {
        if (!rooms[roomId]) {
            socket.emit('error', { msg: 'Room does not exist or has expired.' });
            return;
        }
        rooms[roomId].student = socket.id;
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { userName });
        socket.emit('room-joined', { roomId });
        console.log(`👋 ${userName} joined room: ${roomId}`);
    });

    socket.on('offer', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer', { offer });
    });

    socket.on('answer', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer', { answer });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate', { candidate });
    });

    socket.on('end-call', ({ roomId }) => {
        socket.to(roomId).emit('call-ended');
        delete rooms[roomId];
        console.log(`📴 Room ended: ${roomId}`);
    });

    socket.on('media-toggle', ({ roomId, type, enabled }) => {
        socket.to(roomId).emit('peer-media-toggle', { type, enabled });
    });

    socket.on('disconnect', () => {
        // We no longer automatically delete rooms on disconnect to prevent
        // accidental call cancellations due to network glitches.
        // The call only ends when a user explicitly clicks "End Call".
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests from this IP, please try again after 15 minutes' },
    skip: (req) => {
        return req.path === '/api/auth/me';
    }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/', apiLimiter);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/recruiter', require('./routes/recruiter'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/message', require('./routes/message'));
app.use('/api/videocall', require('./routes/videocall'));
app.use('/api/groq', require('./routes/groq'));

// Generate a unique interview room
app.post('/api/videocall/create-room', (req, res) => {
    const roomId = uuidv4();
    res.json({ roomId });
});

// ICE Servers for better WebRTC connectivity
app.get('/api/videocall/ice-servers', async (req, res) => {
    try {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        try {
            const token = await client.tokens.create();
            res.json({ iceServers: token.iceServers });
        } catch (twilioErr) {
            console.warn('Twilio ICE token creation failed, using fallback STUN:', twilioErr.message);
            res.json({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            });
        }
    } catch (err) {
        res.json({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
    }
});

app.get('/', (req, res) => {
    res.send('CareerLens AI API is running secure...');
});

// Error Handler
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready for WebRTC signaling`);
});
