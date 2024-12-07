import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function dbConnect() {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    throw new Error('Error connecting to MongoDB');
  }
}

export default dbConnect; 