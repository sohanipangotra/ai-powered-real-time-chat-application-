import React from 'react';
import {
  MessageSquare,
  Sparkles,
  Code2,
  Coffee,
  Bot
} from 'lucide-react';


const CHANNELS = [
  { id: 'general', name: 'general', icon: MessageSquare, desc: 'Team & Community' },
  { id: 'ai-lounge', name: 'ai-lounge', icon: Sparkles, desc: 'Auto AI Copilot', badge: 'AI' },
  { id: 'tech-talk', name: 'tech-talk', icon: Code2, desc: 'Dev & Algorithms' },
  { id: 'random', name: 'random', icon: Coffee, desc: 'Off-topic discussions' }
];

export default function Sidebar({
  currentRoom,
  onSelectRoom,
  onlineUsers = [],
  currentUser,
  onChangeUsername
}) {
  return (
    <aside
      id="chat-sidebar"
      style={{
        width: '280px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Bot size={22} color="#ffffff" />
        </div>
        <div>
          <h1
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(to right, #ffffff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AetherChat AI
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--badge-online)'
              }}
              className="pulse-dot"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Real-Time Engine
            </span>
          </div>
        </div>
      </div>

      {/* Channels Section */}
      <div style={{ padding: '16px 12px 8px 12px', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            padding: '0 8px 8px 8px'
          }}
        >
          Channels
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            const isActive = currentRoom === ch.id;
            return (
              <button
                key={ch.id}
                id={`channel-btn-${ch.id}`}
                onClick={() => onSelectRoom(ch.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--bg-glass-card)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon
                    size={17}
                    color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 500 }}>
                      #{ch.name}
                    </div>
                  </div>
                </div>

                {ch.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      background: 'var(--ai-gradient)',
                      color: '#ffffff'
                    }}
                  >
                    {ch.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Online Users List */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              padding: '0 8px 8px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Active Peers</span>
            <span
              style={{
                fontSize: '0.68rem',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '2px 6px',
                borderRadius: '999px'
              }}
            >
              {onlineUsers.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* AI Assistant Permanent Presence */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--ai-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={13} color="#ffffff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>AI Copilot</span>
                  <Sparkles size={11} color="var(--accent-cyan)" />
                </div>
              </div>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)'
                }}
              />
            </div>

            {/* Real online users */}
            {onlineUsers.map((user, idx) => {
              const isSelf = user === currentUser;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    color: isSelf ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isSelf ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    {user ? user.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: isSelf ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}
                  >
                    {user} {isSelf && '(You)'}
                  </span>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--badge-online)'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer / Profile Bar */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Online & Ready</div>
          </div>
        </div>

        <button
          id="btn-edit-username"
          onClick={onChangeUsername}
          title="Change Username"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '5px 8px',
            fontSize: '0.72rem'
          }}
        >
          Edit
        </button>
      </div>
    </aside>
  );
}
