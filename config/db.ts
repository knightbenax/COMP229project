import mongoose from 'mongoose';

export default async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  }
  if (!dbName) {
    throw new Error('DB_NAME is not set. Copy .env.example to .env and fill it in.');
  }
  await mongoose.connect(uri, { dbName });
  console.log(`[db] Connected to MongoDB: ${mongoose.connection.name}`);
}
