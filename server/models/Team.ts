import { Schema, model, Document } from 'mongoose';

interface ITeamMember {
  name: string;
  sapId: string;
  class: string;
}

interface ITeam extends Document {
  name: string;
  members: ITeamMember[];
  createdAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sapId: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  }
});

const teamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [teamMemberSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Team = model<ITeam>('Team', teamSchema); 