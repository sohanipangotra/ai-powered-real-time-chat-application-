import React, { useState, useEffect } from 'react';
import { socket, connectSocket, switchRoom } from './services/socket';
import { fetchServerStatus, fetchRoomMessages, clearRoomMessages } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import AISettingsModal from './components/AISettingsModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ArchitectureModal from './components/ArchitectureModal';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState('chat'); // 'chat' | 'analytics'
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('chat_username') || `Engineer_${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(currentUser);

  // Room & Messaging State
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('copilot'); // 'copilot' | 'architect' | 'researcher'

  // Latency & Connection Metrics
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [latency, setLatency] = useState(12);
  const [dbStatus, setDbStatus] = useState({ mode: 'Detecting...' });

  // AI Configuration State
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_chat_config');
      return saved ? JSON.parse(saved) : { provider: 'builtin', apiKey: '', model: '' };
    } catch {
      return { provider: 'builtin', apiKey: '', model: '' };
    }
  });

  // 1. Initial connection & server status
  useEffect(() => {
    fetchServerStatus().then((data) => {
      if (data && data.database) {
        setDbStatus(data.database);
      }
    });

    connectSocket(currentUser, currentRoom);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onReceiveMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onRoomUsers = (data) => {
      if (data && data.users) {
        setOnlineUsers(data.users);
      }
    };

    const onUserTyping = ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
    };

    const onAiTyping = ({ isTyping }) => {
      setIsAiTyping(isTyping);
    };

    const onPongLatency = ({ clientTimestamp }) => {
      const rtt = Date.now() - clientTimestamp;
      setLatency(rtt);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('room_users', onRoomUsers);
    socket.on('user_typing', onUserTyping);
    socket.on('ai_typing', onAiTyping);
    socket.on('pong_latency', onPongLatency);

    // Periodic Latency Ping every 3.5s
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping_latency', Date.now());
      }
    }, 3500);

    return () => {
      clearInterval(pingInterval);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('room_users', onRoomUsers);
      socket.off('user_typing', onUserTyping);
      socket.off('ai_typing', onAiTyping);
      socket.off('pong_latency', onPongLatency);
    };
  }, [currentUser, currentRoom]);

  // 2. Room Switch & History Loading with cancellation guard
  useEffect(() => {
    let isCancelled = false;

    fetchRoomMessages(currentRoom).then((history) => {
      if (!isCancelled) {
        setMessages(history);
        setTypingUsers([]);
        setIsAiTyping(false);
      }
    });

    switchRoom(currentUser, currentRoom);

    return () => {
      isCancelled = true;
    };
  }, [currentRoom, currentUser]);


  // Handle sending message with active Persona
  const handleSendMessage = (content, persona) => {
    const payload = {
      room: currentRoom,
      sender: currentUser,
      content,
      aiConfig,
      persona: persona || selectedPersona,
      directAiRequest: currentRoom === 'ai-lounge'
    };
    socket.emit('send_message', payload);
  };

  const handleTyping = () => {
    socket.emit('typing', { username: currentUser, room: currentRoom });
  };

  const handleStopTyping = () => {
    socket.emit('stop_typing', { username: currentUser, room: currentRoom });
  };

  const handleClearChat = async () => {
    if (window.confirm(`Are you sure you want to clear chat messages in #${currentRoom}?`)) {
      await clearRoomMessages(currentRoom);
      setMessages([]);
    }
  };

  const handleSaveAIConfig = (newConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem('ai_chat_config', JSON.stringify(newConfig));
  };

  const handleSaveUsername = (e) => {
    e.preventDefault();
    if (!tempUsername.trim()) return;
    const cleanName = tempUsername.trim();
    setCurrentUser(cleanName);
    localStorage.setItem('chat_username', cleanName);
    setIsUsernameModalOpen(false);
    switchRoom(cleanName, currentRoom);
  };

  return (
    <div className="app-container">
      {/* Background glowing gradients */}
      <div className="bg-glow-orb bg-glow-orb-1" />
      <div className="bg-glow-orb bg-glow-orb-2" />

      {/* Sidebar */}
      <Sidebar
        currentRoom={currentRoom}
        onSelectRoom={(r) => {
          setCurrentRoom(r);
          setActiveView('chat');
        }}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        onChangeUsername={() => {
          setTempUsername(currentUser);
          setIsUsernameModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'var(--bg-glass)',
          position: 'relative'
        }}
      >
        <Header
          room={currentRoom}
          onlineUsers={onlineUsers}
          isConnected={isConnected}
          dbStatus={dbStatus}
          latency={latency}
          activeView={activeView}
          onSwitchView={setActiveView}
          onOpenSettings={() => setIsAISettingsOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onClearChat={handleClearChat}
        />

        {activeView === 'chat' ? (
          <>
            <ChatArea
              messages={messages}
              currentUser={currentUser}
              typingUsers={typingUsers}
              isAiTyping={isAiTyping}
              room={currentRoom}
            />

            <MessageInput
              room={currentRoom}
              selectedPersona={selectedPersona}
              onChangePersona={setSelectedPersona}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <AnalyticsDashboard
            latency={latency}
            isConnected={isConnected}
            dbStatus={dbStatus}
          />
        )}
      </main>

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        aiConfig={aiConfig}
        onSaveConfig={handleSaveAIConfig}
      />

      {/* Architecture & IEEE Specifications Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Username Edit Modal */}
      {isUsernameModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Set Display Name
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              This identifier will sign all real-time events and telemetry streams.
            </p>

            <form onSubmit={handleSaveUsername}>
              <input
                type="text"
                id="input-username-edit"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                maxLength={24}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  marginBottom: '18px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsUsernameModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-username"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  Save Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
