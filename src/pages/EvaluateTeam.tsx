import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const EvaluateTeam = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/all-teams')}
            variant="default"
            size="lg"
            className="text-lg px-8 py-6"
          >
            View All Teams
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EvaluateTeam;