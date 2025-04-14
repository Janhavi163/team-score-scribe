import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Label } from "@/components/ui/label";
import { Trash2, Download } from "lucide-react";
import { Team, TeamMember, CreateTeamDto } from "@/types/team";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getTeamMarks, getTeamAverageMarks } from '@/lib/api/markService';

const Teams = () => {
  const { teams, isLoading, error, createTeam, deleteTeam, isCreating, isDeleting } = useTeams();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberSapId, setMemberSapId] = useState("");
  const [memberClass, setMemberClass] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    if (members.length === 0) {
      toast.error("At least one team member is required");
      return;
    }
    
    try {
      const teamData: CreateTeamDto = {
        name: teamName.trim(),
        members: members.map(member => ({
          name: member.name.trim(),
          sapId: member.sapId.trim(),
          class: member.class.trim()
        }))
      };
      
      await createTeam(teamData);
      
      // Reset form
      setTeamName("");
      setMembers([]);
      toast.success("Team created successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create team";
      toast.error(errorMessage);
    }
  };

  const handleAddMember = () => {
    if (!memberName.trim() || !memberSapId.trim() || !memberClass.trim()) {
      toast.error("All member fields are required");
      return;
    }
    
    setMembers([...members, {
      name: memberName.trim(),
      sapId: memberSapId.trim(),
      class: memberClass.trim()
    }]);
    
    // Reset member form
    setMemberName("");
    setMemberSapId("");
    setMemberClass("");
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!teamId) {
      toast.error("Invalid team ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(teamId);
        toast.success("Team deleted successfully");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete team";
        toast.error(errorMessage);
      }
    }
  };

  const handleExportToPDF = async () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Team Members and Average Marks Report", 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Add table
    const tableData = [];
    
    // Process each team
    for (const team of teams) {
      // Get all members for this team
      const membersInfo = team.members.map(m => `${m.name} (${m.sapId}) - ${m.class}`).join("\n");
      
      // Get average marks for this team
      let averageMarks = "-";
      
      try {
        // Get average marks for termwork1
        const termwork1Averages = await getTeamAverageMarks(team._id, 'termwork1');
        const termwork1Total = Object.values(termwork1Averages).reduce((sum, value) => sum + value, 0);
        
        // Get average marks for termwork2
        const termwork2Averages = await getTeamAverageMarks(team._id, 'termwork2');
        const termwork2Total = Object.values(termwork2Averages).reduce((sum, value) => sum + value, 0);
        
        // Calculate overall average
        const overallAverage = (termwork1Total + termwork2Total) / 2;
        averageMarks = overallAverage.toFixed(2);
      } catch (error) {
        console.error(`Error fetching marks for team ${team._id}:`, error);
      }
      
      // Add team data to table
      tableData.push([
        team.name,
        membersInfo,
        averageMarks
      ]);
    }
    
    (doc as any).autoTable({
      head: [["Team Name", "Members", "Average Marks"]],
      body: tableData,
      startY: 35,
      theme: "grid",
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 100 },
        2: { cellWidth: 30 }
      },
      didParseCell: function(data) {
        // Add line breaks for member information
        if (data.column.index === 1 && data.cell.raw) {
          const text = data.cell.raw;
          const lines = text.split('\n');
          data.cell.text = lines;
        }
      }
    });
    
    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    doc.save("team-members-and-average-marks-report.pdf");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teams</h1>
          <Button onClick={handleExportToPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to PDF
          </Button>
        </div>

        {/* Create Team Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>

              <div className="space-y-4">
                <Label>Team Members</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Member Name"
                  />
                  <Input
                    value={memberSapId}
                    onChange={(e) => setMemberSapId(e.target.value)}
                    placeholder="SAP ID"
                  />
                  <Input
                    value={memberClass}
                    onChange={(e) => setMemberClass(e.target.value)}
                    placeholder="Class"
                  />
                </div>
                <Button type="button" onClick={handleAddMember}>
                  Add Member
                </Button>

                {members.length > 0 && (
                  <div className="mt-4">
                    <Label>Added Members</Label>
                    <div className="space-y-2">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span>{member.name} ({member.sapId}) - {member.class}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Panel</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Reviewer 1</TableHead>
                  <TableHead>Reviewer 2</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      {team.members.map((member, index) => (
                        <div key={index}>
                          {member.name} ({member.sapId}) - {member.class}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{team.panel?.name || "Not Assigned"}</TableCell>
                    <TableCell>{team.mentor?.name || "Not Assigned"}</TableCell>
                    <TableCell>{team.reviewer1?.name || "Not Assigned"}</TableCell>
                    <TableCell>{team.reviewer2?.name || "Not Assigned"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTeam(team._id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Teams; 