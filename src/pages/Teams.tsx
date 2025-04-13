import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

const Teams = () => {
  const { teams, isLoading, error, createTeam, updateTeamScore, deleteTeam, isCreating } = useTeams();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPlayers, setNewTeamPlayers] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newTeamName.trim() || !newTeamPlayers.trim()) {
        toast.error('Team name and players are required');
        return;
      }
      
      const players = newTeamPlayers.split(',').map(player => player.trim()).filter(Boolean);
      if (players.length === 0) {
        toast.error('At least one player is required');
        return;
      }
      
      await createTeam({
        name: newTeamName,
        players: players,
      });
      setNewTeamName('');
      setNewTeamPlayers('');
      toast.success('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team. Please try again.');
    }
  };

  const handleUpdateScore = async (teamId: string, newScore: number) => {
    try {
      await updateTeamScore({ teamId, scoreData: { score: newScore } });
      toast.success('Score updated successfully');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Failed to update score. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      toast.success('Team deleted successfully');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teams</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        {userRole === "student" && (
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
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Team'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading teams...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading teams: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-8">No teams found. {userRole === "student" ? "Create your first team above." : "Teams will appear here once created."}</div>
        ) : (
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
                        disabled={userRole !== "admin" && userRole !== "teacher"}
                      />
                    </div>
                    {userRole === "admin" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTeam(team._id)}
                        className="w-full"
                      >
                        Delete Team
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Teams; 