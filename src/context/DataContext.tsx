
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, Team, Teacher, Panel, Mark, RubricCriteria
} from '../types';
import { 
  students as initialStudents,
  teams as initialTeams,
  teachers as initialTeachers,
  panels as initialPanels,
  marks as initialMarks,
  rubricCriteria as initialRubricCriteria
} from '../lib/mockedData';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  students: Student[];
  teams: Team[];
  teachers: Teacher[];
  panels: Panel[];
  marks: Mark[];
  rubricCriteria: RubricCriteria[];
  addStudent: (student: Omit<Student, "id">) => string;
  updateStudent: (student: Student) => void;
  addTeam: (team: Omit<Team, "id" | "members">, memberIds: string[]) => string;
  updateTeam: (team: Team) => void;
  addTeacher: (teacher: Omit<Teacher, "id">) => string;
  updateTeacher: (teacher: Teacher) => void;
  addPanel: (panel: Omit<Panel, "id">) => string;
  updatePanel: (panel: Panel) => void;
  assignTeamToPanel: (teamId: string, panelId: string) => void;
  assignMentorToTeam: (teamId: string, teacherId: string) => void;
  addMark: (mark: Omit<Mark, "id">) => string;
  updateMark: (mark: Mark) => void;
  getTeamMarks: (teamId: string) => Mark[];
  getTeacherMarksForTeam: (teamId: string, teacherId: string) => Mark[];
  calculateTeamTotalMarks: (teamId: string) => { [criteriaId: string]: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [panels, setPanels] = useState<Panel[]>(initialPanels);
  const [marks, setMarks] = useState<Mark[]>(initialMarks);
  const [rubricCriteria] = useState<RubricCriteria[]>(initialRubricCriteria);
  
  const { toast } = useToast();
  
  // Update teams with student members
  useEffect(() => {
    setTeams(prevTeams => 
      prevTeams.map(team => ({
        ...team,
        members: students.filter(student => student.teamId === team.id)
      }))
    );
  }, [students]);

  // Add a new student
  const addStudent = (student: Omit<Student, "id">): string => {
    const id = `s${Date.now()}`;
    const newStudent = { ...student, id };
    setStudents([...students, newStudent]);
    toast({ title: "Success", description: "Student added successfully" });
    return id;
  };

  // Update an existing student
  const updateStudent = (student: Student): void => {
    setStudents(students.map(s => (s.id === student.id ? student : s)));
    toast({ title: "Success", description: "Student updated successfully" });
  };

  // Add a new team
  const addTeam = (team: Omit<Team, "id" | "members">, memberIds: string[]): string => {
    const id = `t${Date.now()}`;
    const newTeam = { ...team, id, members: [] };
    setTeams([...teams, newTeam]);
    
    // Update students to be part of this team
    setStudents(students.map(student => 
      memberIds.includes(student.id) ? { ...student, teamId: id } : student
    ));
    
    toast({ title: "Success", description: "Team created successfully" });
    return id;
  };

  // Update an existing team
  const updateTeam = (team: Team): void => {
    setTeams(teams.map(t => (t.id === team.id ? team : t)));
    toast({ title: "Success", description: "Team updated successfully" });
  };

  // Add a new teacher
  const addTeacher = (teacher: Omit<Teacher, "id">): string => {
    const id = `tech${Date.now()}`;
    const newTeacher = { ...teacher, id };
    setTeachers([...teachers, newTeacher]);
    toast({ title: "Success", description: "Teacher added successfully" });
    return id;
  };

  // Update an existing teacher
  const updateTeacher = (teacher: Teacher): void => {
    setTeachers(teachers.map(t => (t.id === teacher.id ? teacher : t)));
    toast({ title: "Success", description: "Teacher updated successfully" });
  };

  // Add a new panel
  const addPanel = (panel: Omit<Panel, "id">): string => {
    const id = `p${Date.now()}`;
    const newPanel = { ...panel, id };
    setPanels([...panels, newPanel]);
    
    // Update teachers to be part of this panel
    setTeachers(teachers.map(teacher => 
      panel.teacherIds.includes(teacher.id) 
        ? { ...teacher, panelIds: [...teacher.panelIds, id] } 
        : teacher
    ));
    
    toast({ title: "Success", description: "Panel created successfully" });
    return id;
  };

  // Update an existing panel
  const updatePanel = (panel: Panel): void => {
    setPanels(panels.map(p => (p.id === panel.id ? panel : p)));
    toast({ title: "Success", description: "Panel updated successfully" });
  };

  // Assign a team to a panel
  const assignTeamToPanel = (teamId: string, panelId: string): void => {
    // Update panel to include this team
    setPanels(panels.map(panel => 
      panel.id === panelId 
        ? { ...panel, teamIds: [...panel.teamIds, teamId] } 
        : panel
    ));
    
    // Update team to be associated with this panel
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, panelId } 
        : team
    ));
    
    toast({ title: "Success", description: "Team assigned to panel successfully" });
  };

  // Assign a mentor to a team
  const assignMentorToTeam = (teamId: string, teacherId: string): void => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, mentorId: teacherId } 
        : team
    ));
    
    toast({ title: "Success", description: "Mentor assigned to team successfully" });
  };

  // Add a new mark
  const addMark = (mark: Omit<Mark, "id">): string => {
    const id = `m${Date.now()}`;
    const newMark = { ...mark, id };
    
    // Check if this mark already exists (same team, teacher, criteria)
    const existingMarkIndex = marks.findIndex(
      m => m.teamId === mark.teamId && 
          m.teacherId === mark.teacherId && 
          m.criteriaId === mark.criteriaId
    );
    
    if (existingMarkIndex >= 0) {
      // Update the existing mark instead of adding a new one
      const updatedMarks = [...marks];
      updatedMarks[existingMarkIndex] = { ...marks[existingMarkIndex], value: mark.value };
      setMarks(updatedMarks);
    } else {
      setMarks([...marks, newMark]);
    }
    
    toast({ title: "Success", description: "Mark added successfully" });
    return id;
  };

  // Update an existing mark
  const updateMark = (mark: Mark): void => {
    setMarks(marks.map(m => (m.id === mark.id ? mark : m)));
    toast({ title: "Success", description: "Mark updated successfully" });
  };

  // Get all marks for a team
  const getTeamMarks = (teamId: string): Mark[] => {
    return marks.filter(mark => mark.teamId === teamId);
  };

  // Get marks given by a specific teacher for a team
  const getTeacherMarksForTeam = (teamId: string, teacherId: string): Mark[] => {
    return marks.filter(
      mark => mark.teamId === teamId && mark.teacherId === teacherId
    );
  };

  // Calculate total marks (average across teachers) for a team
  const calculateTeamTotalMarks = (teamId: string): { [criteriaId: string]: number } => {
    const teamMarks = getTeamMarks(teamId);
    const totalMarks: { [criteriaId: string]: { sum: number; count: number } } = {};
    
    // Group marks by criteria and calculate sums and counts
    teamMarks.forEach(mark => {
      if (!totalMarks[mark.criteriaId]) {
        totalMarks[mark.criteriaId] = { sum: 0, count: 0 };
      }
      totalMarks[mark.criteriaId].sum += mark.value;
      totalMarks[mark.criteriaId].count += 1;
    });
    
    // Calculate average for each criteria
    const averageMarks: { [criteriaId: string]: number } = {};
    Object.keys(totalMarks).forEach(criteriaId => {
      averageMarks[criteriaId] = 
        totalMarks[criteriaId].sum / totalMarks[criteriaId].count;
    });
    
    return averageMarks;
  };

  return (
    <DataContext.Provider value={{
      students,
      teams,
      teachers,
      panels,
      marks,
      rubricCriteria,
      addStudent,
      updateStudent,
      addTeam,
      updateTeam,
      addTeacher,
      updateTeacher,
      addPanel,
      updatePanel,
      assignTeamToPanel,
      assignMentorToTeam,
      addMark,
      updateMark,
      getTeamMarks,
      getTeacherMarksForTeam,
      calculateTeamTotalMarks,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
