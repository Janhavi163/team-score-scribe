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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download } from "lucide-react";
import { getTeamMarks, getTeamAverageMarks, saveMark } from '@/lib/api/markService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExtendedTeam extends Team {
  _id: string;
  mentor?: any;
  reviewer1?: any;
  reviewer2?: any;
}

const RubricForm = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { rubricCriteria, teams, getTeacherMarksForTeam, addMark, teachers, calculateTeamTotalMarks } = useData();
  const { userId } = useAuth();

  const [marks, setMarks] = useState<{ [key: string]: { [key: string]: number } }>({
    termwork1: {},
    termwork2: {}
  });
  const [team, setTeam] = useState<ExtendedTeam | null>(null);
  const [existingMarks, setExistingMarks] = useState<Mark[]>([]);
  const [allTeacherMarks, setAllTeacherMarks] = useState<{ [teacherId: string]: { [criteriaId: string]: number } }>({});
  const [averages, setAverages] = useState<{ [key: string]: { [key: string]: number } }>({
    termwork1: {},
    termwork2: {}
  });
  const [totalMark, setTotalMark] = useState<number>(0);
  const [isMentor, setIsMentor] = useState<boolean>(false);
  const [isReviewer, setIsReviewer] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"guide" | "reviewer1" | "reviewer2" | null>(null);

  useEffect(() => {
    if (!teamId || !userId) return;

    // Find the team
    const foundTeam = teams.find(t => t._id === teamId) as ExtendedTeam;
    if (foundTeam) {
      setTeam(foundTeam);

      // Check if the current user is the mentor/guide
      // Convert ObjectId to string for comparison
      const mentorIdStr = foundTeam.mentor ? foundTeam.mentor.toString() : null;
      const reviewer1IdStr = foundTeam.reviewer1 ? foundTeam.reviewer1.toString() : null;
      const reviewer2IdStr = foundTeam.reviewer2 ? foundTeam.reviewer2.toString() : null;
      const userIdStr = userId ? userId.toString() : null;

      const isUserMentor = mentorIdStr === userIdStr;
      setIsMentor(isUserMentor);

      // Check if the current user is a reviewer
      const isUserReviewer1 = reviewer1IdStr === userIdStr;
      const isUserReviewer2 = reviewer2IdStr === userIdStr;
      setIsReviewer(isUserReviewer1 || isUserReviewer2);

      // Set the user's role
      if (isUserMentor) {
        setUserRole("guide");
      } else if (isUserReviewer1) {
        setUserRole("reviewer1");
      } else if (isUserReviewer2) {
        setUserRole("reviewer2");
      }

      // Load marks for both termworks
      const loadMarks = async () => {
        try {
          // Get marks for termwork1
          const termwork1Marks = await getTeamMarks(teamId);
          const termwork1FilteredMarks = termwork1Marks.filter(mark => mark.termwork === 'termwork1');
          setExistingMarks(termwork1FilteredMarks);

      // Initialize marks state from existing marks
      const initialMarks: { [criteriaId: string]: number } = {};
          termwork1FilteredMarks.forEach(mark => {
        initialMarks[mark.criteriaId] = mark.value;
      });
          setMarks(prev => ({
            ...prev,
            termwork1: initialMarks
          }));

          // Get marks for termwork2
          const termwork2Marks = await getTeamMarks(teamId);
          const termwork2FilteredMarks = termwork2Marks.filter(mark => mark.termwork === 'termwork2');
          
          // Initialize marks state from existing marks for termwork2
          const initialMarks2: { [criteriaId: string]: number } = {};
          termwork2FilteredMarks.forEach(mark => {
            initialMarks2[mark.criteriaId] = mark.value;
          });
          setMarks(prev => ({
            ...prev,
            termwork2: initialMarks2
          }));

      // Get marks from all teachers in the panel
        const allMarks: { [teacherId: string]: { [criteriaId: string]: number } } = {};
        
          // Get mentor's marks
          if (foundTeam.mentorId) {
            const mentorMarks = await getTeacherMarksForTeam(teamId, foundTeam.mentorId);
            const mentorMarksMap: { [criteriaId: string]: number } = {};
            
            mentorMarks.forEach(mark => {
              mentorMarksMap[mark.criteriaId] = mark.value;
            });
            
            allMarks[foundTeam.mentorId] = mentorMarksMap;
          }
          
          // Get reviewer1's marks
          if (foundTeam.reviewer1) {
            const reviewer1Marks = await getTeacherMarksForTeam(teamId, foundTeam.reviewer1);
            const reviewer1MarksMap: { [criteriaId: string]: number } = {};
            
            reviewer1Marks.forEach(mark => {
              reviewer1MarksMap[mark.criteriaId] = mark.value;
            });
            
            allMarks[foundTeam.reviewer1] = reviewer1MarksMap;
          }
          
          // Get reviewer2's marks
          if (foundTeam.reviewer2) {
            const reviewer2Marks = await getTeacherMarksForTeam(teamId, foundTeam.reviewer2);
            const reviewer2MarksMap: { [criteriaId: string]: number } = {};
            
            reviewer2Marks.forEach(mark => {
              reviewer2MarksMap[mark.criteriaId] = mark.value;
            });
            
            allMarks[foundTeam.reviewer2] = reviewer2MarksMap;
          }
          
          setAllTeacherMarks(allMarks);

          // Calculate average marks for both termworks
          const [termwork1Averages, termwork2Averages] = await Promise.all([
            getTeamAverageMarks(teamId, 'termwork1'),
            getTeamAverageMarks(teamId, 'termwork2')
          ]);
          
          setAverages({
            termwork1: termwork1Averages,
            termwork2: termwork2Averages
          });

      // Calculate total mark
          const totalSum = Object.values(termwork1Averages).reduce((sum, value) => sum + value, 0);
          const avgTotal = Object.values(termwork1Averages).length > 0 
            ? totalSum / Object.values(termwork1Averages).length 
        : 0;
      setTotalMark(avgTotal);
        } catch (error) {
          console.error("Error loading marks:", error);
          toast.error("Failed to load marks");
        }
      };

      loadMarks();
    }
  }, [teamId, teams, getTeacherMarksForTeam, userId, teachers, calculateTeamTotalMarks]);

  const handleMarkChange = (criteriaId: string, value: number, termwork: 'termwork1' | 'termwork2') => {
    const criteria = rubricCriteria.find(c => c.id === criteriaId);
    if (!criteria) return;

    const maxMarks = criteria.maxMarks;
    const validValue = Math.min(Math.max(0, value), maxMarks);
    
      setMarks(prev => ({
        ...prev,
      [termwork]: {
        ...prev[termwork],
        [criteriaId]: validValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent, termwork: 'termwork1' | 'termwork2') => {
    e.preventDefault();
    
    console.log("Submitting marks with teamId:", teamId, "userId:", userId);
    
    if (!teamId || !userId) {
      toast.error("Missing required information");
      return;
    }
    
    // Validate ObjectId format (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(teamId)) {
      toast.error("Invalid teamId format");
      console.error("Invalid teamId format:", teamId);
      return;
    }
    if (!objectIdRegex.test(userId)) {
      toast.error("Invalid userId format");
      console.error("Invalid userId format:", userId);
      return;
    }
    
    // Check if all criteria have marks for the specific termwork
    const hasAllMarks = Object.keys(marks[termwork]).every(criterionId => 
      marks[termwork][criterionId] !== undefined && marks[termwork][criterionId] !== null
    );
    
    if (!hasAllMarks) {
      toast.error(`Please enter marks for all criteria in ${termwork}`);
      return;
    }
    
    try {
      // Submit marks for the specific termwork
      for (const [criterionId, mark] of Object.entries(marks[termwork])) {
        await saveMark({
          teamId,
          teacherId: userId,
          criteriaId: criterionId,
          value: mark,
          termwork
        });
      }
      
      // Update averages for the specific termwork
      const newAverages = await getTeamAverageMarks(teamId, termwork);
      setAverages(prev => ({
        ...prev,
        [termwork]: newAverages
      }));
      
      toast.success(`${termwork} marks saved successfully`);
    } catch (error) {
      console.error(`Error saving ${termwork} marks:`, error);
      toast.error(`Failed to save ${termwork} marks`);
    }
  };

  const exportToPDF = () => {
    if (!team) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Team Evaluation Report", 20, 20);
    
    // Add team info
    doc.setFontSize(14);
    doc.text(`Team: ${team.name}`, 20, 30);
    
    // Add team members
    doc.setFontSize(12);
    doc.text("Team Members:", 20, 40);
    
    let yPos = 50;
    if (team.members && team.members.length > 0) {
      team.members.forEach((member, index) => {
        doc.text(`${index + 1}. ${member.name} (${member.sapId})`, 30, yPos);
        yPos += 10;
      });
    } else {
      doc.text("No members found", 30, yPos);
      yPos += 10;
    }
    
    // Add termwork1 table
    yPos += 10;
    doc.setFontSize(14);
    doc.text("Termwork 1 Evaluation", 20, yPos);
    yPos += 10;
    
    const termwork1Data = rubricCriteria.map(criteria => [
      criteria.name,
      criteria.maxMarks.toString(),
      marks.termwork1[criteria.id]?.toString() || "-",
      averages.termwork1[criteria.id]?.toFixed(2) || "-"
    ]);
    
    (doc as any).autoTable({
      startY: yPos,
      head: [["Criteria", "Max Marks", "Your Marks", "Average"]],
      body: termwork1Data,
      theme: "grid"
    });
    
    // Add termwork2 table
    const termwork2YPos = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text("Termwork 2 Evaluation", 20, termwork2YPos);
    
    const termwork2Data = rubricCriteria.map(criteria => [
      criteria.name,
      criteria.maxMarks.toString(),
      marks.termwork2[criteria.id]?.toString() || "-",
      averages.termwork2[criteria.id]?.toFixed(2) || "-"
    ]);
    
    (doc as any).autoTable({
      startY: termwork2YPos + 10,
      head: [["Criteria", "Max Marks", "Your Marks", "Average"]],
      body: termwork2Data,
      theme: "grid"
    });
    
    // Add totals
    const totalsYPos = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text("Totals", 20, totalsYPos);
    
    const totalTermwork1 = Object.values(marks.termwork1).reduce((sum, value) => sum + value, 0);
    const totalTermwork2 = Object.values(marks.termwork2).reduce((sum, value) => sum + value, 0);
    const totalMaxMarks = rubricCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
    
    (doc as any).autoTable({
      startY: totalsYPos + 10,
      head: [["Termwork", "Your Total", "Max Total", "Percentage"]],
      body: [
        ["Termwork 1", totalTermwork1.toString(), totalMaxMarks.toString(), ((totalTermwork1 / totalMaxMarks) * 100).toFixed(2) + "%"],
        ["Termwork 2", totalTermwork2.toString(), totalMaxMarks.toString(), ((totalTermwork2 / totalMaxMarks) * 100).toFixed(2) + "%"]
      ],
      theme: "grid"
    });
    
    // Save the PDF
    doc.save(`${team.name.replace(/\s+/g, '_')}_evaluation.pdf`);
  };

  if (!team) {
    return <div>Team not found</div>;
  }

  {/* Removed access control check to allow all users to access the form for testing */}
  {/* if (!isMentor && !isReviewer) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to evaluate this team. Only the assigned guide or reviewers can evaluate this team.
          </AlertDescription>
        </Alert>
      </div>
    );
  } */}

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="w-full">
      <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">Evaluate Team: {team.name}</CardTitle>
              <CardDescription className="text-lg">
                {isMentor 
                  ? "As the Guide, you can evaluate the team in the Guide column." 
                  : "As a Reviewer, you can evaluate the team in your assigned Reviewer column."}
        </CardDescription>
            </div>
            <Button 
              onClick={exportToPDF}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export to PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-lg">
                  <thead>
                <tr className="bg-muted">
                  <th className="text-left py-4 px-6 border text-xl">Criteria</th>
                  <th className="px-6 py-4 text-center border text-xl">Max Marks</th>
                  <th className="px-6 py-4 text-center border text-xl" colSpan={3}>Termwork 1</th>
                  <th className="px-6 py-4 text-center border text-xl" colSpan={3}>Termwork 2</th>
                </tr>
                <tr className="bg-muted">
                  <th className="text-left py-4 px-6 border text-xl"></th>
                  <th className="px-6 py-4 text-center border text-xl"></th>
                  <th className="px-6 py-4 text-center border text-xl">Guide</th>
                  <th className="px-6 py-4 text-center border text-xl">Reviewer 1</th>
                  <th className="px-6 py-4 text-center border text-xl">Reviewer 2</th>
                  <th className="px-6 py-4 text-center border text-xl">Guide</th>
                  <th className="px-6 py-4 text-center border text-xl">Reviewer 1</th>
                  <th className="px-6 py-4 text-center border text-xl">Reviewer 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubricCriteria.map(criteria => (
                  <tr key={criteria.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-6 border text-lg">{criteria.name}</td>
                    <td className="px-6 py-4 text-center border text-lg">{criteria.maxMarks}</td>
                    
                    {/* Termwork 1 Guide */}
                    <td className="px-6 py-4 border">
                      <Input
                        type="number"
                        min={0}
                        max={criteria.maxMarks}
                        value={marks.termwork1[criteria.id] || ""}
                        onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork1')}
                        className="w-24 mx-auto text-center text-lg"
                        required
                      />
                    </td>
                    
                    {/* Termwork 1 Reviewer 1 */}
                    <td className="px-6 py-4 border">
                      {isReviewer && userRole === "reviewer1" ? (
                        <Input
                          type="number"
                          min={0}
                          max={criteria.maxMarks}
                          value={marks.termwork1[criteria.id] || ""}
                          onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork1')}
                          className="w-24 mx-auto text-center text-lg"
                          required
                        />
                      ) : (
                        <div className="text-center text-lg">
                          {team.reviewer1 && allTeacherMarks[team.reviewer1]?.[criteria.id] !== undefined 
                            ? allTeacherMarks[team.reviewer1][criteria.id] 
                            : "-"}
                        </div>
                      )}
                    </td>
                    
                    {/* Termwork 1 Reviewer 2 */}
                    <td className="px-6 py-4 border">
                      {isReviewer && userRole === "reviewer2" ? (
                        <Input
                          type="number"
                          min={0}
                          max={criteria.maxMarks}
                          value={marks.termwork1[criteria.id] || ""}
                          onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork1')}
                          className="w-24 mx-auto text-center text-lg"
                          required
                        />
                      ) : (
                        <div className="text-center text-lg">
                          {team.reviewer2 && allTeacherMarks[team.reviewer2]?.[criteria.id] !== undefined 
                            ? allTeacherMarks[team.reviewer2][criteria.id] 
                            : "-"}
                        </div>
                      )}
                    </td>
                    
                    {/* Termwork 2 Guide */}
                    <td className="px-6 py-4 border">
                      {isMentor ? (
                          <Input
                            type="number"
                            min={0}
                            max={criteria.maxMarks}
                          value={marks.termwork2[criteria.id] || ""}
                          onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork2')}
                          className="w-24 mx-auto text-center text-lg"
                            required
                          />
                      ) : (
                        <div className="text-center text-lg">
                          {team.mentorId && allTeacherMarks[team.mentorId]?.[criteria.id] !== undefined 
                            ? allTeacherMarks[team.mentorId][criteria.id] 
                            : "-"}
                        </div>
                      )}
                        </td>
                    
                    {/* Termwork 2 Reviewer 1 */}
                    <td className="px-6 py-4 border">
                      {isReviewer && userRole === "reviewer1" ? (
                        <Input
                          type="number"
                          min={0}
                          max={criteria.maxMarks}
                          value={marks.termwork2[criteria.id] || ""}
                          onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork2')}
                          className="w-24 mx-auto text-center text-lg"
                          required
                        />
                      ) : (
                        <div className="text-center text-lg">
                          {team.reviewer1 && allTeacherMarks[team.reviewer1]?.[criteria.id] !== undefined 
                            ? allTeacherMarks[team.reviewer1][criteria.id] 
                                : "-"}
                        </div>
                      )}
                            </td>
                    
                    {/* Termwork 2 Reviewer 2 */}
                    <td className="px-6 py-4 border">
                      {isReviewer && userRole === "reviewer2" ? (
                        <Input
                          type="number"
                          min={0}
                          max={criteria.maxMarks}
                          value={marks.termwork2[criteria.id] || ""}
                          onChange={(e) => handleMarkChange(criteria.id, Number(e.target.value), 'termwork2')}
                          className="w-24 mx-auto text-center text-lg"
                          required
                        />
                      ) : (
                        <div className="text-center text-lg">
                          {team.reviewer2 && allTeacherMarks[team.reviewer2]?.[criteria.id] !== undefined 
                            ? allTeacherMarks[team.reviewer2][criteria.id] 
                            : "-"}
                        </div>
                      )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                <tr className="bg-muted font-semibold">
                  <td className="py-4 px-6 border text-xl">Total</td>
                  <td className="px-6 py-4 text-center border text-xl">
                        {rubricCriteria.reduce((sum, c) => sum + c.maxMarks, 0)}
                      </td>
                  <td className="px-6 py-4 text-center border text-xl" colSpan={3}>
                    {Object.values(marks.termwork1).reduce((sum, value) => sum + value, 0)}
                      </td>
                  <td className="px-6 py-4 text-center border text-xl" colSpan={3}>
                    {Object.values(marks.termwork2).reduce((sum, value) => sum + value, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={(e) => handleSubmit(e, 'termwork1')}
              className="text-lg px-8"
            >
              Submit Termwork 1 Marks
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, 'termwork2')}
              className="text-lg px-8 ml-2"
            >
              Submit Termwork 2 Marks
            </Button>
          </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default RubricForm;
