import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { initializeSocket } from './services/socketService';
import authRoutes from './routes/authRoutes';
import queueRoutes from './routes/queueRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize WebSocket Server
initializeSocket(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
