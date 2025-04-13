import mongoose from 'mongoose';

const panelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Panel', panelSchema); 