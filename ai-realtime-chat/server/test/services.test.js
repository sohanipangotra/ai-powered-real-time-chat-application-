const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  analyzeSentiment,
  generateMessageSignature,
  generateAIResponse
} = require('../services/aiService');
const { MessageRepository } = require('../models/Message');

describe('AI Service & Cryptographic Signatures', () => {
  test('analyzeSentiment identifies positive sentiments', () => {
    const res = analyzeSentiment('Great work team, this release is fantastic!');
    assert.equal(res.polarity, 'positive');
    assert.ok(res.score > 0);
  });

  test('analyzeSentiment identifies critical/bug sentiments', () => {
    const res = analyzeSentiment('Warning: we encountered a severe bug and fatal crash');
    assert.equal(res.polarity, 'critical');
    assert.ok(res.score < 0);
  });

  test('analyzeSentiment defaults to neutral when words balance or are absent', () => {
    const res = analyzeSentiment('The daily standup starts at ten AM.');
    assert.equal(res.polarity, 'neutral');
    assert.equal(res.score, 0);
  });

  test('generateMessageSignature returns a valid 16-char SHA-256 hex signature', () => {
    const sig = generateMessageSignature('Hello world', 'EngineerA', '2026-09-08T00:00:00Z');
    assert.equal(typeof sig, 'string');
    assert.equal(sig.length, 16);
    assert.match(sig, /^[a-f0-9]{16}$/);
  });

  test('generateMessageSignature produces deterministic output for identical input', () => {
    const sig1 = generateMessageSignature('Payload', 'User', '2026');
    const sig2 = generateMessageSignature('Payload', 'User', '2026');
    assert.equal(sig1, sig2);
  });

  test('generateMessageSignature detects data tampering', () => {
    const sig1 = generateMessageSignature('Legit message', 'Alice', '2026');
    const sig2 = generateMessageSignature('Tampered message', 'Alice', '2026');
    assert.notEqual(sig1, sig2);
  });

  test('generateAIResponse builtin provider responds with contextual persona text', async () => {
    const res = await generateAIResponse({
      prompt: 'What is the time complexity of quicksort?',
      conversationHistory: [],
      provider: 'builtin',
      persona: 'architect'
    });
    assert.equal(res.provider, 'Capstone Engine');
    assert.equal(res.persona, 'architect');
    assert.ok(res.text && res.text.length > 0);
  });

});

describe('MessageRepository Dual-Mode Persistence & Analytics', () => {
  test('saves and retrieves messages from in-memory fallback', async () => {
    const testRoom = 'test-room-' + Date.now();
    const saved = await MessageRepository.saveMessage({
      room: testRoom,
      sender: 'Tester',
      senderType: 'user',
      content: 'Unit test message',
      sentiment: { polarity: 'neutral', score: 0 },
      signature: 'dummy-sha-256'
    });

    assert.ok(saved._id);
    assert.equal(saved.room, testRoom);
    assert.equal(saved.content, 'Unit test message');

    const history = await MessageRepository.getRoomMessages(testRoom, 10);
    assert.equal(history.length, 1);
    assert.equal(history[0].content, 'Unit test message');

    await MessageRepository.clearRoomMessages(testRoom);
    const clearedHistory = await MessageRepository.getRoomMessages(testRoom, 10);
    assert.equal(clearedHistory.length, 0);
  });

  test('calculates analytics summary accurately', async () => {
    const summary = await MessageRepository.getAnalyticsSummary();
    assert.ok(summary);
    assert.ok(typeof summary.totalMessages === 'number');
    assert.ok(summary.sentimentCounts);
    assert.ok('positive' in summary.sentimentCounts);
    assert.ok('neutral' in summary.sentimentCounts);
    assert.ok('critical' in summary.sentimentCounts);
  });
});
