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
import { toast } from 'sonner';

interface Teacher {
  _id: string;
  name: string;
}

const TeacherList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacherName, setNewTeacherName] = useState('');

  useEffect(() => {
    fetchTeachers();
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

  const handleAddTeacher = async () => {
    if (!newTeacherName.trim()) {
      toast.error('Please enter a teacher name');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTeacherName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add teacher');
      }

      const addedTeacher = await response.json();
      setTeachers([...teachers, addedTeacher]);
      toast.success('Teacher added successfully');
      setNewTeacherName('');
    } catch (error) {
      toast.error('Failed to add teacher');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Teacher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Enter teacher name"
                />
              </div>
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="p-4 border rounded-lg shadow-sm"
          >
            <h3 className="font-semibold">{teacher.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherList;
