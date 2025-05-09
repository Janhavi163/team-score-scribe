
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PanelDetails = () => {
  const { userId } = useAuth();
  const { teachers, panels, teams } = useData();
  const navigate = useNavigate();

  console.log("Teachers:", teachers);
  console.log("Panels:", panels);
  console.log("Teams:", teams);

  // Find the current teacher
  const currentTeacher = teachers.find(teacher => teacher.id === userId);
  console.log("Current Teacher:", currentTeacher);
  
  if (!currentTeacher) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Panel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Teacher information not found
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get the panels this teacher is part of
  const teacherPanels = panels.filter(panel => 
    panel.teacherIds.includes(currentTeacher.id)
  );
  console.log("Teacher Panels:", teacherPanels);

  // Get all teams assigned to these panels
  const assignedTeams = teams.filter(team => 
    teacherPanels.some(panel => panel.teamIds.includes(team._id))
  );
  console.log("Assigned Teams:", assignedTeams);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Panel Information</CardTitle>
        <CardDescription>
          Teams assigned to your panels for evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teacherPanels.length === 0 ? (
          <p className="text-center text-muted-foreground">
            You are not assigned to any panels yet
          </p>
        ) : (
          <div className="space-y-6">
            {teacherPanels.map(panel => (
              <div key={panel.id} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">{panel.name}</h3>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Panel Members:
                  </h4>
                  <div className="space-y-1">
                    {panel.teacherIds.map(teacherId => {
                      const teacher = teachers.find(t => t.id === teacherId);
                      return (
                        <p key={teacherId} className="text-sm">
                          {teacher?.name || "Unknown Teacher"}
                          {teacherId === currentTeacher.id && " (You)"}
                        </p>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Assigned Teams:
                  </h4>
                  {panel.teamIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No teams assigned yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {panel.teamIds.map(teamId => {
                        const team = teams.find(t => t._id === teamId);
                        return team ? (
                          <div key={teamId} className="border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{team.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/evaluate-team/${teamId}`)}
                              >
                                Evaluate
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {team.members.length} members
                            </p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanelDetails;
