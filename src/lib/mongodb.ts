import mongoose from 'mongoose';

// This file is responsible for connecting to the MongoDB database.
declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

// Check if the environment variable is defined
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Check if the connection is already cached
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB
async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("Creating new MongoDB connection");
    cached.promise = mongoose.connect(MONGODB_URI!);
  }
  cached.conn = await cached.promise;
  console.log("Connected to MongoDB successfully");
  return cached.conn;
}

export default connectToDatabase;
