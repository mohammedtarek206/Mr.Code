import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  console.warn('MONGODB_URI is not defined in production environment');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongoose_cache: MongooseCache | undefined;
}

let cached: MongooseCache = global.__mongoose_cache || { conn: null, promise: null };

if (!global.__mongoose_cache) {
  global.__mongoose_cache = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of hanging
    };

    console.log('Initiating MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established.');
      return mongooseInstance;
    }).catch(err => {
      console.error('Initial MongoDB connection error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }

  // Force register all known models to prevent "Schema not registered" errors
  const User = require('../models/User').default;
  const AccessCode = require('../models/AccessCode').default;
  const Track = require('../models/Track').default;
  const Book = require('../models/Book').default;
  const FreeVideo = require('../models/FreeVideo').default;

  return cached.conn;
}

export default connectDB;
