import express, { RequestHandler } from 'express';
import Team from '../models/Team';
import Panel from '../models/Panel';

const router = express.Router();

// Get all teams with populated panel and teacher details
router.get('/', (async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('panel')
      .populate('mentor', 'name')
      .populate('reviewer1', 'name')
      .populate('reviewer2', 'name');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
}) as RequestHandler);

// Create a new team
router.post('/', (async (req, res) => {
  try {
    const team = new Team(req.body);
    const savedTeam = await team.save();
    const populatedTeam = await Team.findById(savedTeam._id)
      .populate('panel')
      .populate('mentor', 'name')
      .populate('reviewer1', 'name')
      .populate('reviewer2', 'name');
    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: 'Error creating team' });
  }
}) as RequestHandler);

// Assign panel and mentor to a team
router.put('/:id/assign', (async (req, res) => {
  try {
    const { panelId, mentorId } = req.body;
    
    if (!panelId || !mentorId) {
      return res.status(400).json({ message: 'Panel ID and mentor ID are required' });
    }

    // Get the panel to verify the mentor is part of it
    const panel = await Panel.findById(panelId).populate('teachers');
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    // Verify the mentor is part of the panel
    const mentorInPanel = panel.teachers.some(teacher => teacher._id.toString() === mentorId);
    if (!mentorInPanel) {
      return res.status(400).json({ message: 'Selected mentor must be part of the panel' });
    }

    // Get the other teachers from the panel for reviewers
    const otherTeachers = panel.teachers.filter(teacher => teacher._id.toString() !== mentorId);
    if (otherTeachers.length !== 2) {
      return res.status(400).json({ message: 'Panel must have exactly 3 teachers' });
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        panel: panelId,
        mentor: mentorId,
        reviewer1: otherTeachers[0]._id,
        reviewer2: otherTeachers[1]._id,
      },
      { new: true }
    )
      .populate('panel')
      .populate('mentor', 'name')
      .populate('reviewer1', 'name')
      .populate('reviewer2', 'name');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error assigning panel:', error);
    res.status(400).json({ message: 'Error assigning panel' });
  }
}) as RequestHandler);

// Get a single team
router.get('/:id', (async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('panel')
      .populate('mentor', 'name')
      .populate('reviewer1', 'name')
      .populate('reviewer2', 'name');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Error fetching team' });
  }
}) as RequestHandler);

// Update a team
router.put('/:id', (async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('panel')
      .populate('mentor', 'name')
      .populate('reviewer1', 'name')
      .populate('reviewer2', 'name');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(400).json({ message: 'Error updating team' });
  }
}) as RequestHandler);

// Delete a team
router.delete('/:id', (async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Error deleting team' });
  }
}) as RequestHandler);

export default router; 