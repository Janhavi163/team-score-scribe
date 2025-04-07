
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TeamAssignment = () => {
  const { teams, panels, teachers, assignTeamToPanel, assignMentorToTeam } = useData();
  
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedPanel, setSelectedPanel] = useState<string>("");
  const [selectedMentor, setSelectedMentor] = useState<string>("");

  const handleAssignTeamToPanel = () => {
    if (!selectedTeam || !selectedPanel) {
      toast.error("Please select both a team and a panel");
      return;
    }

    assignTeamToPanel(selectedTeam, selectedPanel);
    setSelectedTeam("");
    setSelectedPanel("");
    toast.success("Team assigned to panel successfully!");
  };

  const handleAssignMentor = () => {
    if (!selectedTeam || !selectedMentor) {
      toast.error("Please select both a team and a mentor");
      return;
    }

    assignMentorToTeam(selectedTeam, selectedMentor);
    setSelectedTeam("");
    setSelectedMentor("");
    toast.success("Mentor assigned to team successfully!");
  };

  // Filter unassigned teams (teams without a panel)
  const unassignedTeams = teams.filter(team => !team.panelId);
  
  // Filter unmentored teams (teams without a mentor)
  const unmentoredTeams = teams.filter(team => !team.mentorId);

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assign Team to Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-select">Select Team</Label>
              <Select
                value={selectedTeam}
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger id="team-select">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedTeams.length === 0 ? (
                    <SelectItem value="none" disabled>No unassigned teams</SelectItem>
                  ) : (
                    unassignedTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="panel-select">Select Panel</Label>
              <Select
                value={selectedPanel}
                onValueChange={setSelectedPanel}
              >
                <SelectTrigger id="panel-select">
                  <SelectValue placeholder="Select a panel" />
                </SelectTrigger>
                <SelectContent>
                  {panels.length === 0 ? (
                    <SelectItem value="none" disabled>No panels created</SelectItem>
                  ) : (
                    panels.map((panel) => (
                      <SelectItem key={panel.id} value={panel.id}>
                        {panel.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAssignTeamToPanel} 
              disabled={!selectedTeam || !selectedPanel}
            >
              Assign Team to Panel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assign Mentor to Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-mentor-select">Select Team</Label>
              <Select
                value={selectedTeam}
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger id="team-mentor-select">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {unmentoredTeams.length === 0 ? (
                    <SelectItem value="none" disabled>No unmentored teams</SelectItem>
                  ) : (
                    unmentoredTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentor-select">Select Mentor</Label>
              <Select
                value={selectedMentor}
                onValueChange={setSelectedMentor}
              >
                <SelectTrigger id="mentor-select">
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length === 0 ? (
                    <SelectItem value="none" disabled>No teachers available</SelectItem>
                  ) : (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAssignMentor} 
              disabled={!selectedTeam || !selectedMentor}
            >
              Assign Mentor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAssignment;
