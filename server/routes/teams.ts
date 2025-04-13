import { Router, Request, Response, RequestHandler } from 'express';
import { Team } from '../models/Team';

const router = Router();

// Get all teams
const getAllTeams: RequestHandler = async (_req, res) => {
  try {
    console.log('Fetching all teams from database...');
    const teams = await Team.find();
    console.log(`Found ${teams.length} teams:`, teams);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a team
const createTeam: RequestHandler = async (req, res) => {
  try {
    console.log('Received create team request:', req.body);
    const { name, members } = req.body;
    
    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      console.error('Invalid team data:', { name, members });
      res.status(400).json({ message: 'Invalid team data. Name and members array are required.' });
      return;
    }
    
    // Validate each member has the required fields
    for (const member of members) {
      if (!member.name || !member.sapId || !member.class) {
        console.error('Invalid member data:', member);
        res.status(400).json({ message: 'Invalid member data. Each member must have name, sapId, and class.' });
        return;
      }
    }
    
    console.log('Creating team with name:', name, 'and members:', members);
    const team = new Team({
      name,
      members
    });
    
    console.log('Saving team to database...');
    const savedTeam = await team.save();
    console.log('Team saved successfully:', savedTeam);
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: 'Error creating team', error: error instanceof Error ? error.message : String(error) });
  }
};

// Delete a team
const deleteTeam: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    console.log(`Deleting team with ID: ${req.params.id}`);
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      console.error(`Team not found with ID: ${req.params.id}`);
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    console.log('Team deleted successfully:', team);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(400).json({ message: 'Error deleting team' });
  }
};

router.get('/', getAllTeams);
router.post('/', createTeam);
router.delete('/:id', deleteTeam);

export default router; 