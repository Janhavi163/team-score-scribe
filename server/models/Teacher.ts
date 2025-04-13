import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Drop the existing collection
mongoose.connection.once('open', async () => {
  if (mongoose.connection.db) {
    try {
      await mongoose.connection.db.collection('teachers').drop();
      console.log('Dropped existing teachers collection');
    } catch (error) {
      console.log('No existing teachers collection to drop');
    }
  }
});

export default mongoose.model('Teacher', teacherSchema); 