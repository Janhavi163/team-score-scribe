import { Team, CreateTeamDto } from '../../types/team';

const API_BASE_URL = 'http://localhost:3000/api';

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }
    return response.json();
  },

  async createTeam(teamData: CreateTeamDto): Promise<Team> {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      throw new Error('Failed to create team');
    }
    return response.json();
  },

  async deleteTeam(teamId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete team');
    }
  },
}; 