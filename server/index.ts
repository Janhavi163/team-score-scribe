import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import teamRoutes from './routes/teams';
import teacherRoutes from './routes/teachers';
import panelRoutes from './routes/panels';
import markRoutes from './routes/marks';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
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
app.use('/api/panels', panelRoutes);
app.use('/api/marks', markRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 