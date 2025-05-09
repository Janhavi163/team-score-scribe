import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TeamRegistrationForm from "@/components/student/TeamRegistrationForm";
import TeacherList from "@/components/admin/TeacherList";
import PanelForm from "@/components/admin/PanelForm";
import TeamAssignment from "@/components/admin/TeamAssignment";
import PanelDetails from "@/components/teacher/PanelDetails";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          
          <div className="flex space-x-4 mb-6">
            <Button onClick={() => navigate("/teams")}>
              View All Teams
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Assigned Teams</CardTitle>
              <CardDescription>
                Click on a team to evaluate their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PanelDetails />
            </CardContent>
          </Card>
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
