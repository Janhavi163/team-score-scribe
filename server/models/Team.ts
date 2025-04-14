import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{
    name: String,
    rollNo: String,
    email: String,
  }],
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