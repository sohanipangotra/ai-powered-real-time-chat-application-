import React from 'react';
import {
  Hash,
  Sparkles,
  Users,
  Database,
  Settings,
  Trash2,
  Wifi,
  WifiOff,
  Activity,
  Layers,
  Download,
  Zap,
  MessageSquare
} from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function Header({
  room,
  onlineUsers = [],
  isConnected = false,
  dbStatus,
  latency,
  activeView,
  onSwitchView,
  onOpenSettings,
  onOpenArchitecture,
  onClearChat
}) {
  const roomDescriptions = {
    general: 'General collaborative channel with live peer sync',
    'ai-lounge': 'Dedicated AI playground - Auto-invokes AI with memory context',
    'tech-talk': 'Software architecture, algorithms, and system design reviews',
    random: 'Casual banter and unstructured discussions'
  };

  const handleExport = (format) => {
    window.open(getExportUrl(room, format), '_blank');
  };


  return (
    <header
      id="chat-header"
      style={{
        minHeight: '68px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(15, 21, 35, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        zIndex: 10,
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      {/* Left: Channel Info & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: room === 'ai-lounge' ? 'var(--ai-gradient)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: room === 'ai-lounge' ? '#fff' : 'var(--accent-primary)'
            }}
          >
            {room === 'ai-lounge' ? <Sparkles size={18} /> : <Hash size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                #{room}
              </h2>
              {room === 'ai-lounge' && (
                <span
                  style={{
                    fontSize: '0.66rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    fontWeight: 600
                  }}
                >
                  AI Autopilot
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {roomDescriptions[room] || 'Channel for real-time collaboration'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Chat Arena vs Telemetry Dashboard */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <button
            id="view-chat-tab"
            onClick={() => onSwitchView('chat')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: activeView === 'chat' ? 'var(--accent-primary)' : 'transparent',
              color: activeView === 'chat' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <MessageSquare size={13} />
            <span>Chat Arena</span>
          </button>

          <button
            id="view-analytics-tab"
            onClick={() => onSwitchView('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: activeView === 'analytics' ? 'var(--accent-gradient)' : 'transparent',
              color: activeView === 'analytics' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Activity size={13} />
            <span>Telemetry & Metrics</span>
          </button>
        </div>
      </div>

      {/* Right Actions & Capstone Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Connection Status Indicator */}
        <div
          id="connection-indicator-badge"
          title={isConnected ? 'Connected to WebSocket Server' : 'Disconnected from WebSocket Server'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            padding: '5px 10px',
            borderRadius: '8px',
            background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.12)',
            color: isConnected ? 'var(--status-online, #10b981)' : '#f87171',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontWeight: 600
          }}
        >
          {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isConnected ? 'Online' : 'Offline'}</span>
        </div>

        {/* Online Peer Count */}
        <div
          id="peer-count-badge"
          title={`${onlineUsers.length} active participant(s) connected`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.74rem',
            padding: '5px 10px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            fontWeight: 500
          }}
        >
          <Users size={13} />
          <span>{onlineUsers.length}</span>
        </div>

        {/* Latency Meter */}
        <div
          title="Live WebSocket Roundtrip Latency"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
            padding: '5px 10px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.08)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            fontWeight: 600
          }}
        >
          <Zap size={13} />
          <span>{latency !== null ? `${latency} ms` : 'Syncing...'}</span>
        </div>


        {/* Database Status */}
        <div
          title={`Active persistence layer: ${dbStatus?.mode || 'Hybrid'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            padding: '5px 10px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Database size={13} color="var(--accent-cyan)" />
          <span>{dbStatus?.mode || 'In-Memory'}</span>
        </div>

        {/* Architecture & IEEE Specs Modal */}
        <button
          id="btn-architecture"
          onClick={onOpenArchitecture}
          title="View IEEE System Architecture & Specifications"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(168, 85, 247, 0.12)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <Layers size={14} />
          <span>Architecture</span>
        </button>

        {/* Export Transcript */}
        <button
          id="btn-export-chat"
          onClick={() => handleExport('markdown')}
          title="Export chat transcript with cryptographic signatures as Markdown"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Download size={13} />
          <span>Export</span>
        </button>

        {/* Action: Clear Room Chat */}
        <button
          id="btn-clear-chat"
          onClick={onClearChat}
          title="Clear room history"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '7px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.78rem'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Trash2 size={14} />
        </button>

        {/* Action: AI Settings */}
        <button
          id="btn-ai-settings"
          onClick={onOpenSettings}
          style={{
            background: 'var(--accent-gradient)',
            color: '#fff',
            fontWeight: 600,
            padding: '6px 13px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Settings size={14} />
          <span>AI Settings</span>
        </button>
      </div>
    </header>
  );
}
