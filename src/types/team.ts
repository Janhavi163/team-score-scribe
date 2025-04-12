export interface Team {
  _id: string;
  name: string;
  players: string[];
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  players: string[];
}

export interface UpdateTeamScoreDto {
  score: number;
} 