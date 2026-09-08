require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { MessageRepository } = require('./models/Message');
const {
  generateAIResponse,
  analyzeSentiment,
  generateMessageSignature
} = require('./services/aiService');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Environment Configuration
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 5000;
const MAX_MESSAGES_PER_WINDOW = 15;

// Middleware
app.use(cors({ origin: CORS_ORIGIN, methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
app.use(express.json());

// Request Performance & Access Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Routes
app.use('/api', apiRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// State & Metric Trackers
const activeUsers = new Map();
const socketRateLimits = new Map(); // socketId -> number[] timestamps
const serverStartTime = Date.now();
let totalSocketMessagesDispatched = 0;
let totalAIGenerations = 0;

/**
 * Socket Rate Limiter Guard (Sliding Window)
 * Returns true if rate limit is exceeded.
 */
function isSocketRateLimited(socketId) {
  const now = Date.now();
  const timestamps = socketRateLimits.get(socketId) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_MESSAGES_PER_WINDOW) {
    socketRateLimits.set(socketId, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  socketRateLimits.set(socketId, validTimestamps);
  return false;
}

io.on('connection', (socket) => {
  // Latency Benchmarker (Ping - Pong)
  socket.on('ping_latency', (clientTimestamp) => {
    socket.emit('pong_latency', {
      clientTimestamp,
      serverTimestamp: Date.now()
    });
  });

  // User joins a channel
  socket.on('join_room', async ({ username, room }) => {
    const targetRoom = typeof room === 'string' && room.trim() ? room.trim() : 'general';
    const userName = typeof username === 'string' && username.trim()
      ? username.trim().substring(0, 32)
      : `User_${socket.id.substring(0, 4)}`;

    const prev = activeUsers.get(socket.id);
    if (prev && prev.room) {
      socket.leave(prev.room);
      io.to(prev.room).emit('user_left', { username: prev.username, room: prev.room });
    }

    socket.join(targetRoom);
    activeUsers.set(socket.id, { username: userName, room: targetRoom });

    socket.to(targetRoom).emit('user_joined', {
      username: userName,
      room: targetRoom,
      timestamp: new Date()
    });

    const roomUsers = Array.from(activeUsers.values())
      .filter((u) => u.room === targetRoom)
      .map((u) => u.username);

    io.to(targetRoom).emit('room_users', {
      room: targetRoom,
      users: [...new Set(roomUsers)]
    });
  });

  // User sends a message
  socket.on('send_message', async (data) => {
    if (!data || typeof data !== 'object') return;

    if (isSocketRateLimited(socket.id)) {
      socket.emit('error_message', {
        error: 'Rate limit exceeded. Please slow down your messages.'
      });
      return;
    }

    const { room = 'general', sender, content, aiConfig = {}, persona = 'copilot' } = data;

    if (!content || typeof content !== 'string' || !content.trim()) return;

    if (content.length > MAX_MESSAGE_LENGTH) {
      socket.emit('error_message', {
        error: `Message exceeds maximum permitted length of ${MAX_MESSAGE_LENGTH} characters.`
      });
      return;
    }

    try {
      totalSocketMessagesDispatched++;
      const now = new Date();
      const targetRoom = typeof room === 'string' && room.trim() ? room.trim() : 'general';
      const cleanSender = typeof sender === 'string' && sender.trim() ? sender.trim() : 'Anonymous';

      // 1. Analyze Sentiment & Compute Cryptographic Checksum
      const sentiment = analyzeSentiment(content);
      const signature = generateMessageSignature(content, cleanSender, now.toISOString());

      // 2. Persist User Message
      const savedUserMsg = await MessageRepository.saveMessage({
        room: targetRoom,
        sender: cleanSender,
        senderType: 'user',
        content: content.trim(),
        sentiment,
        signature
      });

      // 3. Broadcast to room
      io.to(targetRoom).emit('receive_message', savedUserMsg);

      // 4. Check AI triggers
      const isAiTriggered =
        content.toLowerCase().includes('@ai') ||
        content.toLowerCase().startsWith('/ai') ||
        targetRoom === 'ai-lounge' ||
        data.directAiRequest === true;

      if (isAiTriggered) {
        totalAIGenerations++;
        io.to(targetRoom).emit('ai_typing', { room: targetRoom, isTyping: true });

        let cleanPrompt = content.replace(/@ai/gi, '').replace(/\/ai/gi, '').trim();
        if (!cleanPrompt) cleanPrompt = content;

        const history = await MessageRepository.getRoomMessages(targetRoom, 6);

        const aiResponse = await generateAIResponse({
          prompt: cleanPrompt,
          conversationHistory: history,
          provider: aiConfig.provider || 'builtin',
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          persona: persona || 'copilot'
        });

        const aiTimestamp = new Date();
        const aiSignature = generateMessageSignature(aiResponse.text, 'AI_Assistant', aiTimestamp.toISOString());

        const savedAiMsg = await MessageRepository.saveMessage({
          room: targetRoom,
          sender: `AI Assistant (${aiResponse.provider})`,
          senderType: 'ai',
          content: aiResponse.text,
          aiModel: aiResponse.model,
          persona: aiResponse.persona || persona,
          sentiment: { polarity: 'positive', score: 1 },
          signature: aiSignature
        });

        io.to(targetRoom).emit('ai_typing', { room: targetRoom, isTyping: false });
        io.to(targetRoom).emit('receive_message', savedAiMsg);
      }
    } catch (err) {
      console.error('Error in send_message pipeline:', err);
      socket.emit('error_message', { error: 'Message pipeline failure' });
    }
  });

  // Typing state
  socket.on('typing', ({ username, room }) => {
    if (room) {
      socket.to(room).emit('user_typing', { username, isTyping: true });
    }
  });

  socket.on('stop_typing', ({ username, room }) => {
    if (room) {
      socket.to(room).emit('user_typing', { username, isTyping: false });
    }
  });

  // Disconnection
  socket.on('disconnect', () => {
    socketRateLimits.delete(socket.id);
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      socket.to(user.room).emit('user_left', { username: user.username, room: user.room });

      const roomUsers = Array.from(activeUsers.values())
        .filter((u) => u.room === user.room)
        .map((u) => u.username);

      socket.to(user.room).emit('room_users', {
        room: user.room,
        users: [...new Set(roomUsers)]
      });
    }
  });
});

// Provide metrics getter for API
app.locals.getSystemTelemetry = async () => {
  const mem = process.memoryUsage();
  const summary = await MessageRepository.getAnalyticsSummary();
  return {
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    activeConnections: activeUsers.size,
    totalMessagesDispatched: totalSocketMessagesDispatched,
    totalAIGenerations,
    memory: {
      rssMB: (mem.rss / (1024 * 1024)).toFixed(2),
      heapUsedMB: (mem.heapUsed / (1024 * 1024)).toFixed(2),
      heapTotalMB: (mem.heapTotal / (1024 * 1024)).toFixed(2)
    },
    analytics: summary
  };
};

// 404 Catch-All Handler for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedPath: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Unhandled Server Error]:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

// Graceful Process Termination
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down HTTP server cleanly...`);
  server.close(() => {
    console.log('HTTP and WebSocket server closed cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

if (require.main === module) {
  server.listen(PORT, async () => {
    console.log(`🚀 AetherChat Server running on http://localhost:${PORT}`);
    await connectDB();
  });
}


module.exports = { app, server };
