
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            IPD Team Evaluation System
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive platform for registering, managing, and evaluating 
            Integrated Product Development teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
              <h2 className="text-xl font-semibold mb-2">For Students</h2>
              <p className="text-muted-foreground mb-4">
                Register your IPD team, view assignments and track evaluations.
              </p>
            </div>
            <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
              <h2 className="text-xl font-semibold mb-2">For Teachers</h2>
              <p className="text-muted-foreground mb-4">
                Evaluate assigned teams using structured rubrics and provide feedback.
              </p>
            </div>
            <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
              <h2 className="text-xl font-semibold mb-2">For Admins</h2>
              <p className="text-muted-foreground mb-4">
                Create panels, assign teachers and manage the entire evaluation process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
