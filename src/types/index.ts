export type UserRole = "student" | "admin" | "teacher";

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  sapId: string;
  className: string;
  teamId: string | null;
}

export interface Team {
  id: string;
  name: string;
  members: Student[];
  panelId: string | null;
  mentorId: string | null;
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  panelIds: string[];
}

export interface Panel {
  id: string;
  name: string;
  teacherIds: string[];
  teamIds: string[];
}

export interface RubricCriteria {
  id: string;
  name: string;
  maxMarks: number;
}

export interface Mark {
  id: string;
  teamId: string;
  teacherId: string;
  criteriaId: string;
  value: number;
  termwork: "termwork1" | "termwork2";
}
