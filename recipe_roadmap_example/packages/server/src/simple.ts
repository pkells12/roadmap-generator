import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Basic test route
app.get('/', (_req, res) => {
  res.status(200).json({ 
    message: 'Welcome to Pantry-to-Plate API',
    version: '1.0.0',
    mongodbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 