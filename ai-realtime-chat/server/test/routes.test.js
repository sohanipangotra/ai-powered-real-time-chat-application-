const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { app } = require('../server');

describe('HTTP API Endpoints & Middlewares', () => {
  let serverInstance;
  let baseUrl;

  before(() => {
    return new Promise((resolve) => {
      serverInstance = http.createServer(app);
      serverInstance.listen(0, '127.0.0.1', () => {
        const port = serverInstance.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      serverInstance.close(resolve);
    });
  });

  test('GET /api/health returns 200 with system telemetry and node info', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'healthy');
    assert.ok(body.nodeVersion);
    assert.ok(body.memoryMB);
    assert.ok(typeof body.uptimeSeconds === 'number');
  });

  test('GET /api/status returns online status and available channels', async () => {
    const res = await fetch(`${baseUrl}/api/status`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'online');
    assert.ok(Array.isArray(body.availableChannels));
    assert.ok(body.availableChannels.includes('general'));
  });

  test('GET unknown endpoint returns structured 404 JSON', async () => {
    const res = await fetch(`${baseUrl}/api/non-existent-route`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, 'Endpoint not found');
  });

  test('POST /api/ai/chat validates empty prompts with 400', async () => {
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '' })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /required/i);
  });
});
