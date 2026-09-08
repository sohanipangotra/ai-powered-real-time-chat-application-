const mongoose = require('mongoose');
const { getDBStatus } = require('../config/db');

// Mongoose Schema Definition
const MessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    index: true,
    default: 'general'
  },
  sender: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ['user', 'ai', 'system'],
    default: 'user'
  },
  content: {
    type: String,
    required: true
  },
  aiModel: {
    type: String,
    default: null
  },
  persona: {
    type: String,
    default: null
  },
  sentiment: {
    polarity: { type: String, default: 'neutral' },
    score: { type: Number, default: 0 }
  },
  signature: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const MongooseMessage = mongoose.model('Message', MessageSchema);

// In-Memory fallback store
const inMemoryStore = [];

class MessageRepository {
  static async saveMessage({
    room,
    sender,
    senderType = 'user',
    content,
    aiModel = null,
    persona = null,
    sentiment = { polarity: 'neutral', score: 0 },
    signature = null
  }) {
    const status = getDBStatus();
    const messageData = {
      _id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      room: room || 'general',
      sender,
      senderType,
      content,
      aiModel,
      persona,
      sentiment,
      signature,
      timestamp: new Date()
    };

    if (status.connected) {
      try {
        const msg = new MongooseMessage(messageData);
        return await msg.save();
      } catch (err) {
        console.error('Error saving to MongoDB, writing to memory fallback:', err.message);
      }
    }

    inMemoryStore.push(messageData);
    if (inMemoryStore.length > 500) inMemoryStore.shift();
    return messageData;
  }

  static async getRoomMessages(room = 'general', limit = 100) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        return await MongooseMessage.find({ room }).sort({ timestamp: 1 }).limit(limit);
      } catch (err) {
        console.error('Error reading from MongoDB, falling back to memory:', err.message);
      }
    }

    return inMemoryStore
      .filter((m) => m.room === room)
      .slice(-limit);
  }

  static async getAllMessagesCount() {
    const status = getDBStatus();
    if (status.connected) {
      try {
        return await MongooseMessage.countDocuments();
      } catch (e) {}
    }
    return inMemoryStore.length;
  }

  static async getAnalyticsSummary() {
    const all = inMemoryStore;
    const sentimentCounts = { positive: 0, neutral: 0, critical: 0 };
    const senderTypeCounts = { user: 0, ai: 0, system: 0 };
    const roomCounts = {};

    all.forEach((m) => {
      // Sentiments
      const pol = m.sentiment?.polarity || 'neutral';
      sentimentCounts[pol] = (sentimentCounts[pol] || 0) + 1;

      // Sender type
      const st = m.senderType || 'user';
      senderTypeCounts[st] = (senderTypeCounts[st] || 0) + 1;

      // Rooms
      roomCounts[m.room] = (roomCounts[m.room] || 0) + 1;
    });

    return {
      totalMessages: all.length,
      sentimentCounts,
      senderTypeCounts,
      roomCounts
    };
  }

  static async clearRoomMessages(room = 'general') {
    const status = getDBStatus();
    if (status.connected) {
      try {
        await MongooseMessage.deleteMany({ room });
      } catch (e) {}
    }
    for (let i = inMemoryStore.length - 1; i >= 0; i--) {
      if (inMemoryStore[i].room === room) {
        inMemoryStore.splice(i, 1);
      }
    }
    return { success: true };
  }
}

module.exports = { MessageRepository, MongooseMessage };
