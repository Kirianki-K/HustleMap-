const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const { initSocket } = require('./socket');

dotenv.config();

const app = express();
// Create the HTTP server manually so we can attach Socket.io to it
const server = http.createServer(app);

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── REST Routes ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Skillspotter API is running...');
});

// ── Error Handler ───────────────────────────────────────────────────────────
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// ── Socket.io ───────────────────────────────────────────────────────────────
initSocket(server);

// ── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT} (HTTP + WebSocket)`));
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
