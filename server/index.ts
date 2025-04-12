import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import teamRoutes from './routes/teams';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/teams', teamRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 