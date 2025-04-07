
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Teacher } from "@/types";
import { toast } from "sonner";

const PanelForm = () => {
  const { teachers, addPanel } = useData();
  const [panelName, setPanelName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const handleTeacherToggle = (teacherId: string) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(selectedTeachers.filter((id) => id !== teacherId));
    } else {
      // Only allow selecting exactly 3 teachers
      if (selectedTeachers.length < 3) {
        setSelectedTeachers([...selectedTeachers, teacherId]);
      } else {
        toast.error("A panel can only have 3 teachers. Please deselect one first.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!panelName.trim()) {
      toast.error("Panel name is required");
      return;
    }
    
    if (selectedTeachers.length !== 3) {
      toast.error("Please select exactly 3 teachers for the panel");
      return;
    }

    // Check if any selected teacher is already in another panel
    const selectedTeacherObjects = teachers.filter(teacher => 
      selectedTeachers.includes(teacher.id)
    );
    
    const alreadyInPanelTeachers = selectedTeacherObjects.filter(teacher => 
      teacher.panelIds.length > 0
    );
    
    if (alreadyInPanelTeachers.length > 0) {
      const teacherNames = alreadyInPanelTeachers.map(t => t.name).join(', ');
      toast.error(`Teachers ${teacherNames} are already assigned to other panels`);
      return;
    }

    addPanel({
      name: panelName,
      teacherIds: selectedTeachers,
      teamIds: []
    });

    // Reset form
    setPanelName("");
    setSelectedTeachers([]);
    toast.success("Panel created successfully!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="panel-name">Panel Name</Label>
            <Input
              id="panel-name"
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
              placeholder="Enter panel name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Teachers (exactly 3)</Label>
            <div className="grid gap-2">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`teacher-${teacher.id}`}
                    checked={selectedTeachers.includes(teacher.id)}
                    onCheckedChange={() => handleTeacherToggle(teacher.id)}
                    disabled={
                      teacher.panelIds.length > 0 || // Already in a panel
                      (selectedTeachers.length >= 3 && !selectedTeachers.includes(teacher.id)) // Already selected 3 teachers
                    }
                  />
                  <Label
                    htmlFor={`teacher-${teacher.id}`}
                    className={`${
                      teacher.panelIds.length > 0
                        ? "text-muted-foreground"
                        : ""
                    }`}
                  >
                    {teacher.name}
                    {teacher.panelIds.length > 0 && " (Already assigned to a panel)"}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {selectedTeachers.length}/3 teachers
            </p>
          </div>

          <Button type="submit" disabled={selectedTeachers.length !== 3 || !panelName.trim()}>
            Create Panel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PanelForm;
