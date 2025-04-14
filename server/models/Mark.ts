import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  criteriaId: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  termwork: {
    type: String,
    enum: ['termwork1', 'termwork2'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a teacher can only have one mark per criteria per team per termwork
markSchema.index({ teamId: 1, teacherId: 1, criteriaId: 1, termwork: 1 }, { unique: true });

export default mongoose.model('Mark', markSchema); 