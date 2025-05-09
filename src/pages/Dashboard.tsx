import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TeamRegistrationForm from "@/components/student/TeamRegistrationForm";
import TeacherList from "@/components/admin/TeacherList";
import PanelForm from "@/components/admin/PanelForm";
import TeamAssignment from "@/components/admin/TeamAssignment";
import PanelDetails from "@/components/teacher/PanelDetails";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  name: string;
  sapId?: string;
  class?: string;
  _id: string;
}

interface Panel {
  _id: string;
  name: string;
  teachers: string[];
  createdAt: string;
  __v: number;
}

interface Team {
  _id: string;
  name?: string;
  teamName?: string;
  members?: TeamMember[];
  member1?: TeamMember;
  member2?: TeamMember;
  member3?: TeamMember;
  member4?: TeamMember;
  panel?: Panel;
  createdAt: string;
  __v: number;
  mentor?: null;
  reviewer1?: null;
  reviewer2?: null;
}

const Dashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get team name
  const getTeamName = (team: Team) => {
    return team.name || team.teamName || 'Unnamed Team';
  };

  // Helper function to get team members with SAP IDs
  const getTeamMembers = (team: Team) => {
    if (team.members) {
      return team.members.map(member => 
        `${member.name} (${member.sapId || 'No SAP ID'})`
      ).join(", ");
    }
    
    const members = [
      team.member1 ? `${team.member1.name} (${team.member1.sapId || 'No SAP ID'})` : null,
      team.member2 ? `${team.member2.name} (${team.member2.sapId || 'No SAP ID'})` : null,
      team.member3 ? `${team.member3.name} (${team.member3.sapId || 'No SAP ID'})` : null,
      team.member4 ? `${team.member4.name} (${team.member4.sapId || 'No SAP ID'})` : null
    ].filter(Boolean);
    
    return members.join(", ") || "No Members";
  };

  // Helper function to get panel name or "No Panel"
  const getPanelName = (team: Team) => {
    return team.panel?.name || "No Panel Assigned";
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log("Fetching teams from API...");
        const response = await fetch('http://localhost:3000/api/teams', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Teams data received:", data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole === "teacher") {
      fetchTeams();
    }
  }, [userRole]);

  useEffect(() => {
    toast({
      title: "Dashboard Loaded",
      description: `Welcome to the ${userRole || ""} dashboard`,
    });
  }, [userRole, toast]);

  if (userRole === "student") {
    return (
      <Layout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Register your IPD team of 4 students. All team members must be registered.
          </p>
          
          <div className="flex space-x-4 mb-6">
            <Button onClick={() => navigate("/teams")}>
              View All Teams
            </Button>
          </div>
          
          <TeamRegistrationForm />
        </div>
      </Layout>
    );
  }

  if (userRole === "admin") {
    return (
      <Layout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage teachers, create panels, and assign teams to panels.
          </p>
          
          <div className="flex space-x-4 mb-6">
            <Button onClick={() => navigate("/teams")}>
              View All Teams
            </Button>
          </div>
          
          <Tabs defaultValue="teachers" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="panels">Panels</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>
            <TabsContent value="teachers" className="mt-6">
              <TeacherList />
            </TabsContent>
            <TabsContent value="panels" className="mt-6">
              <PanelForm />
            </TabsContent>
            <TabsContent value="assignments" className="mt-6">
              <TeamAssignment />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  if (userRole === "teacher") {
    return (
      <Layout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assigned teams and evaluate their performance.
          </p>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-red-500">
                Error loading teams: {error}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Teams</CardTitle>
                <CardDescription>
                  Click on a team to evaluate their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teams.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No teams found in the system.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Panel</TableHead>
                        <TableHead>Members (with SAP IDs)</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams.map((team) => (
                        <TableRow key={team._id}>
                          <TableCell className="font-medium">
                            {getTeamName(team)}
                          </TableCell>
                          <TableCell>
                            {getPanelName(team)}
                          </TableCell>
                          <TableCell>
                            {getTeamMembers(team)}
                          </TableCell>
                          <TableCell>
                            {new Date(team.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => navigate(`/RubricForm/${team._id}`)}
                              variant="default"
                            >
                              Evaluate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unknown User Role</CardTitle>
            <CardDescription>
              Your user role could not be determined.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in again to access your dashboard.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
