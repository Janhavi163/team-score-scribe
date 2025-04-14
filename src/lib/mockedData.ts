import { User, Team, Student, Teacher, Panel, RubricCriteria, Mark } from '../types';

// Mock data for users
export const users: User[] = [
  { id: "u1", email: "admin@college.edu", password: "admin123", role: "admin" },
  { id: "u2", email: "teacher1@college.edu", password: "teacher1", role: "teacher" },
  { id: "u3", email: "teacher2@college.edu", password: "teacher2", role: "teacher" },
  { id: "u4", email: "teacher3@college.edu", password: "teacher3", role: "teacher" },
  { id: "u5", email: "teacher4@college.edu", password: "teacher4", role: "teacher" },
  { id: "u6", email: "teacher5@college.edu", password: "teacher5", role: "teacher" },
  { id: "u7", email: "student1@college.edu", password: "student1", role: "student" },
];

// Mock data for students
export const students: Student[] = [
  { id: "s1", userId: "u7", name: "Alex Johnson", sapId: "SAP001", className: "CSE-A", teamId: "t1" },
];

// Mock data for teams
export const teams: Team[] = [
  { 
    id: "t1", 
    name: "Team Innovation", 
    members: [], 
    panelId: "p1",
    mentorId: "tech1" 
  },
];

// Mock data for teachers
export const teachers: Teacher[] = [
  { id: "tech1", userId: "u2", name: "Dr. Lisa Brown", panelIds: ["p1"] },
  { id: "tech2", userId: "u3", name: "Prof. Michael Clark", panelIds: ["p1"] },
  { id: "tech3", userId: "u4", name: "Dr. Sarah Wilson", panelIds: ["p1"] },
  { id: "tech4", userId: "u5", name: "Prof. David Miller", panelIds: [] },
  { id: "tech5", userId: "u6", name: "Dr. Jessica Taylor", panelIds: [] },
];

// Mock data for panels
export const panels: Panel[] = [
  { id: "p1", name: "Panel A", teacherIds: ["tech1", "tech2", "tech3"], teamIds: ["t1"] },
];

// Mock data for rubric criteria
export const rubricCriteria: RubricCriteria[] = [
  { id: "rc1", name: "Proposed Methodology", maxMarks: 4 },
  { id: "rc2", name: "Implementation", maxMarks: 15 },
  { id: "rc3", name: "Presentation Quality", maxMarks: 3 },
  { id: "rc4", name: "Contribution as a Team Member and Punctuality", maxMarks: 3 },
];

// Mock data for marks
export const marks: Mark[] = [
  { id: "m1", teamId: "t1", teacherId: "tech1", criteriaId: "rc1", value: 8 },
  { id: "m2", teamId: "t1", teacherId: "tech1", criteriaId: "rc2", value: 9 },
  { id: "m3", teamId: "t1", teacherId: "tech1", criteriaId: "rc3", value: 7 },
  { id: "m4", teamId: "t1", teacherId: "tech1", criteriaId: "rc4", value: 8 },
  { id: "m5", teamId: "t1", teacherId: "tech1", criteriaId: "rc5", value: 9 },
];
