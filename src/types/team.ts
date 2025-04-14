export interface TeamMember {
  name: string;
  sapId: string;
  class: string;
}

export interface Team {
  _id: string;
  name: string;
  members: TeamMember[];
  panel?: {
    _id: string;
    name: string;
  };
  mentor?: {
    _id: string;
    name: string;
  };
  reviewer1?: {
    _id: string;
    name: string;
  };
  reviewer2?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  members: TeamMember[];
} 