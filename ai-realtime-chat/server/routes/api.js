const express = require('express');
const router = express.Router();
const { MessageRepository } = require('../models/Message');
const { getDBStatus } = require('../config/db');
const { generateAIResponse } = require('../services/aiService');

const VALID_ROOM_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;
const VALID_FORMATS = new Set(['markdown', 'json']);

function sanitizeRoom(room) {
  if (!room || typeof room !== 'string') return 'general';
  const clean = room.trim();
  return VALID_ROOM_REGEX.test(clean) ? clean : 'general';
}

// System Health & Liveness Probe
router.get('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryMB: {
      rss: (mem.rss / (1024 * 1024)).toFixed(2),
      heapUsed: (mem.heapUsed / (1024 * 1024)).toFixed(2),
      heapTotal: (mem.heapTotal / (1024 * 1024)).toFixed(2)
    },
    database: getDBStatus()
  });
});

// System Status & Database status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    database: getDBStatus(),
    availableChannels: ['general', 'tech-talk', 'ai-lounge', 'random']
  });
});

// Telemetry & Academic Metrics Endpoint
router.get('/telemetry', async (req, res) => {
  try {
    if (req.app.locals.getSystemTelemetry) {
      const data = await req.app.locals.getSystemTelemetry();
      return res.json({ success: true, ...data });
    }
    res.json({ success: true, message: 'Telemetry initializing' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get messages for a specific room
router.get('/messages/:room', async (req, res) => {
  try {
    const room = sanitizeRoom(req.params.room);
    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 && parsedLimit <= 500 ? parsedLimit : 100;
    const messages = await MessageRepository.getRoomMessages(room, limit);
    res.json({ success: true, room, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear messages in a room
router.delete('/messages/:room', async (req, res) => {
  try {
    const room = sanitizeRoom(req.params.room);
    await MessageRepository.clearRoomMessages(room);
    res.json({ success: true, message: `Room '${room}' cleared.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Common export handler for /export/:room and /messages/:room/export
const handleExport = async (req, res) => {
  try {
    const room = sanitizeRoom(req.params.room);
    const requestedFormat = (req.query.format || 'markdown').toLowerCase();
    const format = VALID_FORMATS.has(requestedFormat) ? requestedFormat : 'markdown';
    const messages = await MessageRepository.getRoomMessages(room, 500);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="aetherchat_${room}_transcript.json"`);
      return res.send(JSON.stringify(messages, null, 2));
    }

    // Markdown Export
    let md = `# 📜 AetherChat Real-Time Chat Transcript\n`;
    md += `**Channel:** #${room} | **Export Date:** ${new Date().toUTCString()}\n`;
    md += `**Total Messages:** ${messages.length}\n`;
    md += `---\n\n`;

    messages.forEach((m) => {
      const time = new Date(m.timestamp).toLocaleTimeString();
      const badge = m.senderType === 'ai' ? `[🤖 ${m.aiModel || 'AI'}]` : `[👤 User]`;
      const sentiment = m.sentiment?.polarity ? `*(Sentiment: ${m.sentiment.polarity})*` : '';
      const sig = m.signature ? `\`SHA256:${m.signature}\`` : '';

      md += `### ${badge} **${m.sender}** at ${time} ${sentiment}\n`;
      md += `${m.content}\n\n`;
      if (sig) md += `*Integrity Signature:* ${sig}\n\n`;
      md += `---\n\n`;
    });

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="aetherchat_${room}_transcript.md"`);
    res.send(md);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.get('/export/:room', handleExport);
router.get('/messages/:room/export', handleExport);

// Direct AI generation endpoint
router.post('/ai/chat', async (req, res) => {
  try {
    const { prompt, conversationHistory, provider, apiKey, model, persona } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Valid prompt string is required' });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({ success: false, error: 'Prompt exceeds maximum character limit of 4000' });
    }

    const aiResult = await generateAIResponse({
      prompt: prompt.trim(),
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
      provider,
      apiKey,
      model,
      persona
    });

    res.json({ success: true, ...aiResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
