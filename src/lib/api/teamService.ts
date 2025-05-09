import { Team, CreateTeamDto } from '../../types/team';

const API_BASE_URL = 'http://localhost:3000/api';

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    try {
      console.log('Starting to fetch teams...');
      console.log('API URL:', `${API_BASE_URL}/teams`);
      
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials if needed
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch teams:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: `${API_BASE_URL}/teams`
        });
        throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Validate the response data
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('Invalid API response: expected an array of teams');
      }
      
      // Log each team's data
      data.forEach((team, index) => {
        console.log(`Team ${index + 1}:`, {
          id: team._id,
          name: team.name,
          panel: team.panel,
          members: team.members
        });
      });

      // If no teams are found, log a warning
      if (data.length === 0) {
        console.warn('No teams found in the database');
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAllTeams:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  },

  async createTeam(teamData: CreateTeamDto): Promise<Team> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create team:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to create team: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in createTeam:', error);
      throw error;
    }
  },

  async deleteTeam(teamId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete team:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to delete team: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error in deleteTeam:', error);
      throw error;
    }
  },
}; 