/**
 * Application Configuration
 * Centralizes environment variables and global defaults.
 */
export const CONFIG = {
  SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  DEFAULT_ROOM: 'general',
  DEFAULT_USER: 'Guest',
  MAX_MESSAGE_LENGTH: 2000,
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 2000,
};

export default CONFIG;
