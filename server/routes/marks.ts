import express, { RequestHandler } from 'express';
import Mark from '../models/Mark';
import Team from '../models/Team';

const router = express.Router();

// Get all marks
router.get('/', (async (req, res) => {
  try {
    const marks = await Mark.find();
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks' });
  }
}) as RequestHandler);

// Get marks for a specific team
router.get('/team/:teamId', (async (req, res) => {
  try {
    const { teamId } = req.params;
    const marks = await Mark.find({ teamId });
    res.json(marks);
  } catch (error) {
    console.error('Error fetching team marks:', error);
    res.status(500).json({ message: 'Error fetching team marks' });
  }
}) as RequestHandler);

// Get marks for a specific teacher and team
router.get('/team/:teamId/teacher/:teacherId', (async (req, res) => {
  try {
    const { teamId, teacherId } = req.params;
    const marks = await Mark.find({ teamId, teacherId });
    res.json(marks);
  } catch (error) {
    console.error('Error fetching teacher marks for team:', error);
    res.status(500).json({ message: 'Error fetching teacher marks for team' });
  }
}) as RequestHandler);

// Create or update a mark
router.post('/', (async (req, res) => {
  try {
    const { teamId, teacherId, criteriaId, value, termwork } = req.body;
    
    console.log('Received mark submission:', { teamId, teacherId, criteriaId, value, termwork });
    
    if (!teamId || !teacherId || !criteriaId || value === undefined || !termwork) {
      console.log('Missing required fields:', { teamId, teacherId, criteriaId, value, termwork });
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if the team exists
    const team = await Team.findById(teamId);
    console.log('Found team:', team);
    
    if (!team) {
      console.log('Team not found for ID:', teamId);
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Try to find an existing mark
    const existingMark = await Mark.findOne({ teamId, teacherId, criteriaId, termwork });
    console.log('Existing mark:', existingMark);
    
    if (existingMark) {
      // Update the existing mark
      existingMark.value = value;
      await existingMark.save();
      console.log('Updated existing mark:', existingMark);
      res.json(existingMark);
    } else {
      // Create a new mark
      const newMark = new Mark({
        teamId,
        teacherId,
        criteriaId,
        value,
        termwork
      });
      await newMark.save();
      console.log('Created new mark:', newMark);
      res.status(201).json(newMark);
    }
  } catch (error: any) {
    console.error('Error saving mark:', error);
    res.status(500).json({ message: 'Error saving mark', error: error.message });
  }
}) as RequestHandler);

// Get average marks for a team
router.get('/team/:teamId/average', (async (req, res) => {
  try {
    const { teamId } = req.params;
    const { termwork } = req.query;
    
    // Get all marks for this team
    const query: any = { teamId };
    if (termwork) {
      query.termwork = termwork;
    }
    
    const marks = await Mark.find(query);
    
    // Group marks by criteria
    const marksByCriteria: { [criteriaId: string]: { sum: number; count: number } } = {};
    
    marks.forEach(mark => {
      if (!marksByCriteria[mark.criteriaId]) {
        marksByCriteria[mark.criteriaId] = { sum: 0, count: 0 };
      }
      marksByCriteria[mark.criteriaId].sum += mark.value;
      marksByCriteria[mark.criteriaId].count += 1;
    });
    
    // Calculate average for each criteria
    const averageMarks: { [criteriaId: string]: number } = {};
    Object.keys(marksByCriteria).forEach(criteriaId => {
      averageMarks[criteriaId] = marksByCriteria[criteriaId].sum / marksByCriteria[criteriaId].count;
    });
    
    res.json(averageMarks);
  } catch (error) {
    console.error('Error calculating average marks:', error);
    res.status(500).json({ message: 'Error calculating average marks' });
  }
}) as RequestHandler);

export default router; 