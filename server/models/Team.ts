import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sapId: { type: String, required: true },
  class: { type: String, required: true },
}, { _id: true });

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  member1: { type: memberSchema, required: true },
  member2: { type: memberSchema, required: true },
  member3: { type: memberSchema, required: true },
  member4: { type: memberSchema, required: true },
  panel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Panel',
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  reviewer1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  reviewer2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Team', teamSchema); 