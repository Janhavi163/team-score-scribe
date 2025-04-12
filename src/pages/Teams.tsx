import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Teams = () => {
  const { teams, isLoading, error, createTeam, updateTeamScore, deleteTeam } = useTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPlayers, setNewTeamPlayers] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam({
        name: newTeamName,
        players: newTeamPlayers.split(',').map(player => player.trim()),
      });
      setNewTeamName('');
      setNewTeamPlayers('');
      toast.success('Team created successfully');
    } catch (error) {
      toast.error('Failed to create team');
    }
  };

  const handleUpdateScore = async (teamId: string, newScore: number) => {
    try {
      await updateTeamScore({ teamId, scoreData: { score: newScore } });
      toast.success('Score updated successfully');
    } catch (error) {
      toast.error('Failed to update score');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <Input
              placeholder="Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
            <Input
              placeholder="Players (comma-separated)"
              value={newTeamPlayers}
              onChange={(e) => setNewTeamPlayers(e.target.value)}
              required
            />
            <Button type="submit">Create Team</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team._id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">Players:</p>
                <ul className="list-disc list-inside">
                  {team.players.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))}
                </ul>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">Score:</p>
                  <Input
                    type="number"
                    value={team.score}
                    onChange={(e) => handleUpdateScore(team._id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTeam(team._id)}
                  className="w-full"
                >
                  Delete Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teams; 