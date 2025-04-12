import { Router } from 'express';
import { Team } from '../models/Team';

const router = Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ score: -1 });
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a team
router.post('/', async (req, res) => {
  try {
    const { name, players } = req.body;
    const team = new Team({
      name,
      players
    });
    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: 'Error creating team' });
  }
});

// Update team score
router.put('/:id/score', async (req, res) => {
  try {
    const { score } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    );
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Error updating team score:', error);
    res.status(400).json({ message: 'Error updating score' });
  }
});

// Delete a team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(400).json({ message: 'Error deleting team' });
  }
});

export default router; 