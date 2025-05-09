import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../lib/api/teamService';
import { Team, CreateTeamDto } from '../types/team';

export const useTeams = () => {
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, error, refetch } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      try {
        console.log('Fetching teams from API...');
        const result = await teamService.getAllTeams();
        console.log('Teams fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (teamData: CreateTeamDto) => {
      try {
        console.log('Creating team with data:', teamData);
        const result = await teamService.createTeam(teamData);
        console.log('Team created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error creating team:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      try {
        console.log('Deleting team:', teamId);
        await teamService.deleteTeam(teamId);
        console.log('Team deleted successfully');
      } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    teams,
    isLoading,
    error,
    refetch,
    createTeam: createTeamMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
    isCreating: createTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
}; 