import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import teamRoutes from './routes/teams';
import teacherRoutes from './routes/teachers';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/teachers', teacherRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 