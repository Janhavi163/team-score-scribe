
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import RubricForm from "@/components/teacher/RubricForm";
import { useData } from "@/context/DataContext";

const EvaluateTeam = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { teams } = useData();
  
  const team = teams.find(t => t.id === teamId);
  
  if (!teamId) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Missing Team ID</h1>
          <p className="text-muted-foreground">
            No team was specified for evaluation.
          </p>
        </div>
      </Layout>
    );
  }
  
  if (!team) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Team Not Found</h1>
          <p className="text-muted-foreground">
            The specified team could not be found.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Evaluate Team</h1>
        <RubricForm />
      </div>
    </Layout>
  );
};

export default EvaluateTeam;
