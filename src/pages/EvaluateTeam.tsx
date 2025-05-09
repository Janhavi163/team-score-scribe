import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useData } from "@/context/DataContext";

const EvaluateTeam = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { teams } = useData();
  const navigate = useNavigate();
  
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Evaluate Team: {team.name}</h1>
          <button
            onClick={() => navigate(`/rubric-form/${teamId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Evaluate Team
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EvaluateTeam;
