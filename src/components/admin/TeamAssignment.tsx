import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Member {
  name: string;
  sapId: string;
  class: string;
  _id: string;
}

interface Team {
  _id: string;
  name: string;
  members: Member[];
  panel?: {
    _id: string;
    name: string;
  };
  mentor?: {
    _id: string;
    name: string;
  };
  reviewer1?: {
    _id: string;
    name: string;
  };
  reviewer2?: {
    _id: string;
    name: string;
  };
}

interface Panel {
  _id: string;
  name: string;
  teachers: Array<{
    _id: string;
    name: string;
  }>;
}

const API_BASE_URL = 'http://localhost:3000';

export default function TeamAssignment() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    console.log("Fetching teams and panels...");
    fetchTeamsInternal();
    fetchPanelsInternal();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  };

  const incrementLoading = () => setLoadingCount(count => count + 1);
  const decrementLoading = () => setLoadingCount(count => Math.max(0, count - 1));

  useEffect(() => {
    setIsLoading(loadingCount > 0);
  }, [loadingCount]);

  const fetchTeamsInternal = async () => {
    try {
      incrementLoading();
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      console.log("Teams API response status:", response.status);

      if (response.status === 401) {
        navigate('/login');
        decrementLoading();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Teams API Error Response:', errorText);
        throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Teams data:', data);
      console.log('Teams data JSON:', JSON.stringify(data, null, 2));
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams. Please check if the server is running.');
    } finally {
      decrementLoading();
    }
  };

  const fetchPanelsInternal = async () => {
    try {
      incrementLoading();
      const response = await fetch(`${API_BASE_URL}/api/panels`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      console.log("Panels API response status:", response.status);

      if (response.status === 401) {
        navigate('/login');
        decrementLoading();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Panels API Error Response:', errorText);
        throw new Error(`Failed to fetch panels: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Panels data:', data);
      setPanels(data);
    } catch (error) {
      console.error('Error fetching panels:', error);
      toast.error('Failed to fetch panels. Please check if the server is running.');
    } finally {
      decrementLoading();
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Teams API Error Response:', errorText);
        throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Teams data:', data);
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPanels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/panels`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Panels API Error Response:', errorText);
        throw new Error(`Failed to fetch panels: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Panels data:', data);
      setPanels(data);
    } catch (error) {
      console.error('Error fetching panels:', error);
      toast.error('Failed to fetch panels. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignPanel = async () => {
    if (!selectedTeam || !selectedPanel || !selectedMentor) {
      toast.error('Please select a team, panel, and mentor');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/teams/${selectedTeam._id}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          panelId: selectedPanel,
          mentorId: selectedMentor,
        }),
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign panel');
      }

      const updatedTeam = await response.json();
      setTeams(teams.map(team => 
        team._id === updatedTeam._id ? updatedTeam : team
      ));
      
      toast.success('Panel assigned successfully');
      setSelectedTeam(null);
      setSelectedPanel('');
      setSelectedMentor('');
    } catch (error) {
      console.error('Error assigning panel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign panel');
    }
  };

  const getPanelTeachers = (panelId: string) => {
    const panel = panels.find(p => p._id === panelId);
    return panel?.teachers || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Assignments</h2>
        <div className="flex space-x-2">
          <Button onClick={fetchTeams} disabled={isLoading}>
            View Teams
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>Assign Panel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Panel to Team</DialogTitle>
                <DialogDescription>
                  Select a team, panel, and mentor to assign them together.
                </DialogDescription>
              </DialogHeader>
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <p>Loading data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Team</Label>
                    <Select
                      value={selectedTeam?._id || ''}
                      onValueChange={(value) => {
                        const team = teams.find(t => t._id === value);
                        setSelectedTeam(team || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team._id} value={team._id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Panel</Label>
                    <Select
                      value={selectedPanel}
                      onValueChange={setSelectedPanel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a panel" />
                      </SelectTrigger>
                      <SelectContent>
                        {panels.map(panel => (
                          <SelectItem key={panel._id} value={panel._id}>
                            {panel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPanel && (
                    <div className="space-y-2">
                      <Label>Select Mentor</Label>
                      <Select
                        value={selectedMentor}
                        onValueChange={setSelectedMentor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mentor" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPanelTeachers(selectedPanel).map(teacher => (
                            <SelectItem key={teacher._id} value={teacher._id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button 
                    onClick={handleAssignPanel}
                    disabled={!selectedTeam || !selectedPanel || !selectedMentor}
                  >
                    Assign Panel
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <p>Loading teams and panels...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {teams.map(team => (
            <div key={team._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{team.name}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Members:</p>
                <ul className="list-disc list-inside">
                  {team.members && team.members.map(member => (
                    <li key={member._id}>{member.name}</li>
                  ))}
                </ul>
              </div>
              {team.panel && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Panel: {team.panel.name}</p>
                  {team.mentor && <p className="text-sm text-gray-500">Mentor: {team.mentor.name}</p>}
                  {team.reviewer1 && <p className="text-sm text-gray-500">Reviewer 1: {team.reviewer1.name}</p>}
                  {team.reviewer2 && <p className="text-sm text-gray-500">Reviewer 2: {team.reviewer2.name}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
