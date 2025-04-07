
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mark, Team } from "@/types";
import { toast } from "sonner";

const RubricForm = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { rubricCriteria, teams, getTeacherMarksForTeam, addMark, teachers, calculateTeamTotalMarks } = useData();
  const { userId } = useAuth();

  const [marks, setMarks] = useState<{ [criteriaId: string]: number }>({});
  const [team, setTeam] = useState<Team | null>(null);
  const [existingMarks, setExistingMarks] = useState<Mark[]>([]);
  const [allTeacherMarks, setAllTeacherMarks] = useState<{ [teacherId: string]: { [criteriaId: string]: number } }>({});
  const [averageMarks, setAverageMarks] = useState<{ [criteriaId: string]: number }>({});
  const [totalMark, setTotalMark] = useState<number>(0);

  useEffect(() => {
    if (!teamId) return;

    // Find the team
    const foundTeam = teams.find(t => t.id === teamId);
    if (foundTeam) {
      setTeam(foundTeam);

      // Get existing marks for this teacher and team
      const teacherMarks = getTeacherMarksForTeam(teamId, userId || "");
      setExistingMarks(teacherMarks);

      // Initialize marks state from existing marks
      const initialMarks: { [criteriaId: string]: number } = {};
      teacherMarks.forEach(mark => {
        initialMarks[mark.criteriaId] = mark.value;
      });
      setMarks(initialMarks);

      // Get marks from all teachers in the panel
      if (foundTeam.panelId) {
        const allMarks: { [teacherId: string]: { [criteriaId: string]: number } } = {};
        
        teachers.forEach(teacher => {
          const teacherRubricMarks = getTeacherMarksForTeam(teamId, teacher.id);
          const teacherMarksMap: { [criteriaId: string]: number } = {};
          
          teacherRubricMarks.forEach(mark => {
            teacherMarksMap[mark.criteriaId] = mark.value;
          });
          
          allMarks[teacher.id] = teacherMarksMap;
        });
        
        setAllTeacherMarks(allMarks);
      }

      // Get average marks
      const avg = calculateTeamTotalMarks(teamId);
      setAverageMarks(avg);

      // Calculate total mark
      const totalSum = Object.values(avg).reduce((sum, value) => sum + value, 0);
      const avgTotal = Object.values(avg).length > 0 
        ? totalSum / Object.values(avg).length 
        : 0;
      setTotalMark(avgTotal);
    }
  }, [teamId, teams, getTeacherMarksForTeam, userId, teachers, calculateTeamTotalMarks]);

  const handleMarkChange = (criteriaId: string, value: string) => {
    const numValue = Number(value);
    const criteria = rubricCriteria.find(c => c.id === criteriaId);
    
    if (criteria && numValue >= 0 && numValue <= criteria.maxMarks) {
      setMarks(prev => ({
        ...prev,
        [criteriaId]: numValue
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamId || !userId) {
      toast.error("Missing required information");
      return;
    }

    try {
      // Submit marks for each criteria
      rubricCriteria.forEach(criteria => {
        if (marks[criteria.id] !== undefined) {
          addMark({
            teamId,
            teacherId: userId,
            criteriaId: criteria.id,
            value: marks[criteria.id]
          });
        }
      });

      toast.success("Marks submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting marks:", error);
      toast.error("Failed to submit marks. Please try again.");
    }
  };

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Evaluate Team: {team?.name}</CardTitle>
        <CardDescription>
          Assign marks to each criterion (out of maximum marks)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="rubric-form">
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Team Members</h3>
              <div className="space-y-2">
                {team.members.map((member, index) => (
                  <div key={member.id} className="text-sm">
                    <span className="font-medium">{index + 1}. {member.name}</span> - 
                    <span className="text-muted-foreground ml-1">
                      SAP ID: {member.sapId}, Class: {member.className}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Rubric Criteria</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Criteria</th>
                      <th className="px-4 py-2 text-center">Max Marks</th>
                      <th className="px-4 py-2 text-center">Your Mark</th>
                      {Object.keys(allTeacherMarks)
                        .filter(teacherId => teacherId !== userId)
                        .map(teacherId => {
                          const teacher = teachers.find(t => t.id === teacherId);
                          return (
                            <th key={teacherId} className="px-4 py-2 text-center">
                              {teacher?.name || "Other Teacher"}
                            </th>
                          );
                        })}
                      <th className="px-4 py-2 text-center font-semibold">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubricCriteria.map(criteria => (
                      <tr key={criteria.id} className="border-b">
                        <td className="py-3">{criteria.name}</td>
                        <td className="px-4 py-3 text-center">{criteria.maxMarks}</td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min={0}
                            max={criteria.maxMarks}
                            value={marks[criteria.id] || ""}
                            onChange={(e) => handleMarkChange(criteria.id, e.target.value)}
                            className="w-20 mx-auto text-center"
                            required
                          />
                        </td>
                        {Object.keys(allTeacherMarks)
                          .filter(teacherId => teacherId !== userId)
                          .map(teacherId => (
                            <td key={teacherId} className="px-4 py-3 text-center">
                              {allTeacherMarks[teacherId][criteria.id] !== undefined 
                                ? allTeacherMarks[teacherId][criteria.id] 
                                : "-"}
                            </td>
                          ))}
                        <td className="px-4 py-3 text-center font-semibold">
                          {averageMarks[criteria.id] !== undefined 
                            ? averageMarks[criteria.id].toFixed(1) 
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted">
                      <td className="py-3 font-semibold">Total</td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {rubricCriteria.reduce((sum, c) => sum + c.maxMarks, 0)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {Object.values(marks).reduce((sum, value) => sum + value, 0)}
                      </td>
                      {Object.keys(allTeacherMarks)
                        .filter(teacherId => teacherId !== userId)
                        .map(teacherId => {
                          const teacherTotal = Object.values(allTeacherMarks[teacherId])
                            .reduce((sum, value) => sum + value, 0);
                          return (
                            <td key={teacherId} className="px-4 py-3 text-center font-semibold">
                              {teacherTotal || "-"}
                            </td>
                          );
                        })}
                      <td className="px-4 py-3 text-center font-semibold">
                        {totalMark.toFixed(1)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="mr-2">
          Cancel
        </Button>
        <Button type="submit" form="rubric-form">
          Submit Evaluation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RubricForm;
