import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Teacher {
  _id: string;
  name: string;
}

interface Panel {
  _id: string;
  name: string;
  teachers: Teacher[];
}

const PanelForm = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [newPanel, setNewPanel] = useState({
    name: '',
    teacherIds: ['', '', ''] as string[],
  });

  useEffect(() => {
    fetchTeachers();
    fetchPanels();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchPanels = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/panels');
      const data = await response.json();
      setPanels(data);
    } catch (error) {
      toast.error('Failed to fetch panels');
    }
  };

  const handleAddPanel = async () => {
    if (!newPanel.name.trim()) {
      toast.error('Please enter a panel name');
      return;
    }

    if (newPanel.teacherIds.some(id => !id)) {
      toast.error('Please select all three teachers');
      return;
    }

    if (new Set(newPanel.teacherIds).size !== 3) {
      toast.error('Please select three different teachers');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/panels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPanel.name,
          teacherIds: newPanel.teacherIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add panel');
      }

      const addedPanel = await response.json();
      setPanels([...panels, addedPanel]);
      toast.success('Panel added successfully');
      setNewPanel({
        name: '',
        teacherIds: ['', '', ''],
      });
    } catch (error) {
      toast.error('Failed to add panel');
    }
  };

  const handleTeacherSelect = (index: number, teacherId: string) => {
    const newTeacherIds = [...newPanel.teacherIds];
    newTeacherIds[index] = teacherId;
    setNewPanel({ ...newPanel, teacherIds: newTeacherIds });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panels</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Panel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Panel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Panel Name</Label>
                <Input
                  id="name"
                  value={newPanel.name}
                  onChange={(e) => setNewPanel({ ...newPanel, name: e.target.value })}
                  placeholder="Enter panel name"
                />
              </div>
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <Label>Teacher {index + 1}</Label>
                  <Select
                    value={newPanel.teacherIds[index]}
                    onValueChange={(value) => handleTeacherSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem
                          key={teacher._id}
                          value={teacher._id}
                          disabled={newPanel.teacherIds.includes(teacher._id) && newPanel.teacherIds[index] !== teacher._id}
                        >
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button onClick={handleAddPanel}>Add Panel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {panels.map((panel) => (
          <div
            key={panel._id}
            className="p-4 border rounded-lg shadow-sm"
          >
            <h3 className="font-semibold">{panel.name}</h3>
            <div className="mt-2 space-y-1">
              {panel.teachers.map((teacher) => (
                <p key={teacher._id} className="text-sm text-gray-600">
                  {teacher.name}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelForm;
