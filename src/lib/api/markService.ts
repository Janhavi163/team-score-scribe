import axios from 'axios';
import { Mark } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to validate and format ObjectId
const formatObjectId = (id: string, isTeamId: boolean = false): string => {
  // If it's a teamId, enforce ObjectId format
  if (isTeamId) {
    // Check if the id is already a valid 24-character hex string
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return id;
    }
    // If not, try to extract the id from a potential MongoDB ObjectId string
    const match = id.match(/^[0-9a-fA-F]{24}$/);
    if (match) {
      return match[0];
    }
    throw new Error('Invalid ObjectId format');
  }
  
  // For non-team IDs (like teacherId), return as is
  return id;
};

// Get all marks
export const getAllMarks = async (): Promise<Mark[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/marks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marks:', error);
    throw error;
  }
};

// Get marks for a specific team
export const getTeamMarks = async (teamId: string): Promise<Mark[]> => {
  try {
    const formattedTeamId = formatObjectId(teamId, true);
    const response = await axios.get(`${API_BASE_URL}/marks/team/${formattedTeamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team marks:', error);
    throw error;
  }
};

// Get marks for a specific teacher and team
export const getTeacherMarksForTeam = async (teamId: string, teacherId: string): Promise<Mark[]> => {
  try {
    const formattedTeamId = formatObjectId(teamId, true);
    const formattedTeacherId = formatObjectId(teacherId, false);
    const response = await axios.get(`${API_BASE_URL}/marks/team/${formattedTeamId}/teacher/${formattedTeacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher marks for team:', error);
    throw error;
  }
};

// Create or update a mark
export const saveMark = async (mark: Omit<Mark, 'id'>): Promise<Mark> => {
  try {
    const formattedMark = {
      ...mark,
      teamId: formatObjectId(mark.teamId, true),
      teacherId: formatObjectId(mark.teacherId, false)
    };
    const response = await axios.post(`${API_BASE_URL}/marks`, formattedMark);
    return response.data;
  } catch (error) {
    console.error('Error saving mark:', error);
    throw error;
  }
};

// Get average marks for a team
export const getTeamAverageMarks = async (teamId: string, termwork?: 'termwork1' | 'termwork2'): Promise<{ [criteriaId: string]: number }> => {
  try {
    const formattedTeamId = formatObjectId(teamId, true);
    const url = `${API_BASE_URL}/marks/team/${formattedTeamId}/average${termwork ? `?termwork=${termwork}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching team average marks:', error);
    throw error;
  }
}; 