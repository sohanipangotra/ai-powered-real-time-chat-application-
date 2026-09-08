const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chat-app';
  try {
    mongoose.set('strictQuery', false);
    // Try connecting with a 3-second timeout so it fails fast and falls back cleanly if no mongo daemon is running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnectedToMongo = true;
    console.log(`✅ MongoDB Connected successfully to: ${uri}`);
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`⚠️ MongoDB connection unavailable (${error.message}).`);
    console.log(`💡 Activated In-Memory persistence mode for zero-setup execution.`);
  }
};

const getDBStatus = () => ({
  connected: isConnectedToMongo,
  mode: isConnectedToMongo ? 'MongoDB' : 'In-Memory Store'
});

module.exports = { connectDB, getDBStatus };
