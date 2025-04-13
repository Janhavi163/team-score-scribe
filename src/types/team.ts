export interface TeamMember {
  name: string;
  sapId: string;
  class: string;
}

export interface Team {
  _id: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  members: TeamMember[];
} 