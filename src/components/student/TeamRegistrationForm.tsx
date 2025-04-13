import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface TeamMember {
  name: string;
  sapId: string;
  className: string;
}

const TeamRegistrationForm = () => {
  const navigate = useNavigate();
  const { addStudent } = useData();
  const { userId, currentUser } = useAuth();
  const { createTeam } = useTeams();
  
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "", sapId: "", className: "" },
    { name: "", sapId: "", className: "" },
    { name: "", sapId: "", className: "" },
    { name: "", sapId: "", className: "" },
  ]);

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const validateForm = (): boolean => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return false;
    }

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.name.trim() || !member.sapId.trim() || !member.className.trim()) {
        toast.error(`All fields for member ${i + 1} are required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Add all students
      const studentIds = members.map(member => {
        return addStudent({
          userId: currentUser?.id || "",
          name: member.name,
          sapId: member.sapId,
          className: member.className,
          teamId: null
        });
      });

      // Create team with these students
      createTeam({
        name: teamName,
        members: members.map(member => ({
          name: member.name,
          sapId: member.sapId,
          class: member.className
        }))
      });

      toast.success("Team registered successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error registering team:", error);
      toast.error("Failed to register team. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register Your IPD Team</CardTitle>
        <CardDescription>
          Please fill in the details for all 4 team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                required
              />
            </div>

            <div className="space-y-6">
              {members.map((member, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Member {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor={`sapId-${index}`}>SAP ID</Label>
                      <Input
                        id={`sapId-${index}`}
                        value={member.sapId}
                        onChange={(e) => handleMemberChange(index, "sapId", e.target.value)}
                        placeholder="SAP ID"
                        required
                      />
                    </div>
                    
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor={`className-${index}`}>Class</Label>
                      <Input
                        id={`className-${index}`}
                        value={member.className}
                        onChange={(e) => handleMemberChange(index, "className", e.target.value)}
                        placeholder="Class (e.g., CSE-A)"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit">Register Team</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamRegistrationForm;
