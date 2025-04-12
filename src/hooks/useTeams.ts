import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../lib/api/teamService';
import { Team, CreateTeamDto, UpdateTeamScoreDto } from '../types/team';

export const useTeams = () => {
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, error } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: teamService.getAllTeams,
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData: CreateTeamDto) => teamService.createTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateTeamScoreMutation = useMutation({
    mutationFn: ({ teamId, scoreData }: { teamId: string; scoreData: UpdateTeamScoreDto }) =>
      teamService.updateTeamScore(teamId, scoreData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: string) => teamService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    teams,
    isLoading,
    error,
    createTeam: createTeamMutation.mutate,
    updateTeamScore: updateTeamScoreMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamScoreMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
}; 