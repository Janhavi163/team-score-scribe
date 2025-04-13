import express, { RequestHandler } from 'express';
import Panel from '../models/Panel';
import Teacher from '../models/Teacher';

const router = express.Router();

// Get all panels with teacher details
router.get('/', (async (req, res) => {
  try {
    const panels = await Panel.find().populate('teachers', 'name');
    res.json(panels);
  } catch (error) {
    console.error('Error fetching panels:', error);
    res.status(500).json({ message: 'Error fetching panels' });
  }
}) as RequestHandler);

// Create a new panel
router.post('/', (async (req, res) => {
  try {
    const { name, teacherIds } = req.body;
    
    if (!name || !teacherIds || !Array.isArray(teacherIds) || teacherIds.length !== 3) {
      return res.status(400).json({ message: 'Panel name and exactly 3 teacher IDs are required' });
    }

    // Verify all teachers exist
    const teachers = await Teacher.find({ _id: { $in: teacherIds } });
    if (teachers.length !== 3) {
      return res.status(400).json({ message: 'One or more teachers not found' });
    }

    const panel = new Panel({ name, teachers: teacherIds });
    const savedPanel = await panel.save();
    const populatedPanel = await Panel.findById(savedPanel._id).populate('teachers', 'name');
    res.status(201).json(populatedPanel);
  } catch (error) {
    console.error('Error creating panel:', error);
    res.status(400).json({ message: 'Error creating panel' });
  }
}) as RequestHandler);

// Get a single panel
router.get('/:id', (async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id).populate('teachers', 'name');
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }
    res.json(panel);
  } catch (error) {
    console.error('Error fetching panel:', error);
    res.status(500).json({ message: 'Error fetching panel' });
  }
}) as RequestHandler);

// Update a panel
router.put('/:id', (async (req, res) => {
  try {
    const { name, teacherIds } = req.body;
    
    if (!name || !teacherIds || !Array.isArray(teacherIds) || teacherIds.length !== 3) {
      return res.status(400).json({ message: 'Panel name and exactly 3 teacher IDs are required' });
    }

    // Verify all teachers exist
    const teachers = await Teacher.find({ _id: { $in: teacherIds } });
    if (teachers.length !== 3) {
      return res.status(400).json({ message: 'One or more teachers not found' });
    }

    const panel = await Panel.findByIdAndUpdate(
      req.params.id,
      { name, teachers: teacherIds },
      { new: true }
    ).populate('teachers', 'name');
    
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }
    res.json(panel);
  } catch (error) {
    console.error('Error updating panel:', error);
    res.status(400).json({ message: 'Error updating panel' });
  }
}) as RequestHandler);

// Delete a panel
router.delete('/:id', (async (req, res) => {
  try {
    const panel = await Panel.findByIdAndDelete(req.params.id);
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }
    res.json({ message: 'Panel deleted successfully' });
  } catch (error) {
    console.error('Error deleting panel:', error);
    res.status(500).json({ message: 'Error deleting panel' });
  }
}) as RequestHandler);

export default router; 