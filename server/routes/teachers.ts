import express, { RequestHandler } from 'express';
import Teacher from '../models/Teacher';

const router = express.Router();

// Get all teachers
router.get('/', (async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
}) as RequestHandler);

// Create a new teacher
router.post('/', (async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Name is required and must be a string' });
    }

    const teacher = new Teacher({ name });
    const savedTeacher = await teacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(400).json({ message: 'Error creating teacher' });
  }
}) as RequestHandler);

// Get a single teacher
router.get('/:id', (async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher' });
  }
}) as RequestHandler);

// Update a teacher
router.put('/:id', (async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Name is required and must be a string' });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(400).json({ message: 'Error updating teacher' });
  }
}) as RequestHandler);

// Delete a teacher
router.delete('/:id', (async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Error deleting teacher' });
  }
}) as RequestHandler);

export default router; 