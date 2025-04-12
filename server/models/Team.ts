import { Schema, model, Document } from 'mongoose';

interface IPlayer {
  name: string;
  position: string;
}

interface ITeam extends Document {
  name: string;
  players: IPlayer[];
  score: number;
  createdAt: Date;
}

const teamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  players: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Team = model<ITeam>('Team', teamSchema); 