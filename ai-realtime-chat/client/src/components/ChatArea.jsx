import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Bot, Sparkles, MessageCircle } from 'lucide-react';

export default function ChatArea({
  messages = [],
  currentUser,
  typingUsers = [],
  isAiTyping = false,
  room
}) {
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers, isAiTyping]);

  return (
    <div
      id="chat-messages-viewport"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Empty State Banner */}
      {messages.length === 0 && (
        <div
          style={{
            margin: 'auto',
            textAlign: 'center',
            maxWidth: '440px',
            padding: '36px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--accent-primary)'
            }}
          >
            {room === 'ai-lounge' ? <Sparkles size={28} /> : <MessageCircle size={28} />}
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            Welcome to #{room}!
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {room === 'ai-lounge'
              ? 'This room is plugged directly into the AI Engine. Ask any question, and the assistant will reply immediately.'
              : 'This is the start of this channel. Say hello to your peers or mention @AI to invite the assistant!'}
          </p>
        </div>
      )}

      {/* Messages List */}
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg._id || index}
          message={msg}
          isSelf={msg.sender === currentUser}
        />
      ))}

      {/* AI Generating / Typing Indicator */}
      {isAiTyping && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '12px 0'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--ai-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Bot size={18} color="#fff" />
          </div>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '4px 16px 16px 16px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              AI is thinking
            </span>
            <div style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        </div>
      )}

      {/* Peer Users Typing Indicator */}
      {typingUsers.length > 0 && !isAiTyping && (
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
          <div style={{ display: 'flex', gap: '2px' }}>
            <span className="typing-dot" style={{ background: 'var(--text-muted)' }} />
            <span className="typing-dot" style={{ background: 'var(--text-muted)' }} />
            <span className="typing-dot" style={{ background: 'var(--text-muted)' }} />
          </div>
        </div>
      )}

      <div ref={scrollBottomRef} />
    </div>
  );
}
