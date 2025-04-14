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
    
    if (!teamId || !teacherId || !criteriaId || value === undefined || !termwork) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if the team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if the teacher is assigned to this team (as mentor or reviewer)
    const isMentor = team.mentor && team.mentor.toString() === teacherId;
    const isReviewer1 = team.reviewer1 && team.reviewer1.toString() === teacherId;
    const isReviewer2 = team.reviewer2 && team.reviewer2.toString() === teacherId;
    
    if (!isMentor && !isReviewer1 && !isReviewer2) {
      return res.status(403).json({ message: 'Teacher is not assigned to this team' });
    }
    
    // Try to find an existing mark
    const existingMark = await Mark.findOne({ teamId, teacherId, criteriaId, termwork });
    
    if (existingMark) {
      // Update the existing mark
      existingMark.value = value;
      await existingMark.save();
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
      res.status(201).json(newMark);
    }
  } catch (error) {
    console.error('Error saving mark:', error);
    res.status(400).json({ message: 'Error saving mark' });
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