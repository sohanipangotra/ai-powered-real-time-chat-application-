import { CONFIG } from '../config';

const SERVER_URL = CONFIG.SERVER_URL;

/**
 * Fetch server connectivity status & basic metadata.
 */
export async function fetchServerStatus() {
  try {
    const res = await fetch(`${SERVER_URL}/api/status`);
    if (!res.ok) throw new Error(`Status check failed with ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

/**
 * Fetch deep telemetry data (database state, memory, model status).
 */
export async function fetchTelemetry() {
  try {
    const res = await fetch(`${SERVER_URL}/api/telemetry`);
    if (!res.ok) throw new Error(`Telemetry failed with ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      database: { connected: false, messageCount: 0 },
      server: { memoryUsage: 'N/A' },
      activeModel: 'Offline',
      error: err.message,
    };
  }
}

/**
 * Retrieve message history for a specific room.
 */
export async function fetchRoomMessages(room = CONFIG.DEFAULT_ROOM) {
  try {
    const res = await fetch(`${SERVER_URL}/api/messages/${encodeURIComponent(room)}`);
    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.statusText}`);
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error('fetchRoomMessages error:', err);
    return [];
  }
}

/**
 * Clear message history for a specific room.
 */
export async function clearRoomMessages(room = CONFIG.DEFAULT_ROOM) {
  try {
    const res = await fetch(`${SERVER_URL}/api/messages/${encodeURIComponent(room)}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err) {
    console.error('clearRoomMessages error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Generate formatted export URL for room transcript download.
 */
export function getExportUrl(room, format = 'json') {
  return `${SERVER_URL}/api/messages/${encodeURIComponent(room)}/export?format=${encodeURIComponent(format)}`;
}
