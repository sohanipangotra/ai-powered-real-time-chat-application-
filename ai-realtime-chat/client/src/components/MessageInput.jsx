import React, { useState, useRef } from 'react';
import { Send, Sparkles, Terminal, CheckSquare, ShieldCheck } from 'lucide-react';


export default function MessageInput({
  onSendMessage,
  onTyping,
  onStopTyping,
  room,
  selectedPersona,
  onChangePersona
}) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (onTyping) onTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 1200);
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (onStopTyping) onStopTyping();

    onSendMessage(text, selectedPersona);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertPrompt = (promptText) => {
    setText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${promptText}` : promptText;
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      id="message-input-container"
      style={{
        padding: '14px 24px 18px 24px',
        backgroundColor: 'rgba(15, 21, 35, 0.96)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      {/* Top Bar: Persona Selection & Action Item Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '10px',
          overflowX: 'auto',
          paddingBottom: '2px',
          flexWrap: 'wrap'
        }}
      >
        {/* Persona Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            AI Persona:
          </span>

          {[
            { id: 'copilot', label: 'Copilot', icon: Sparkles },
            { id: 'architect', label: 'Architect (Big-O)', icon: Terminal },
            { id: 'researcher', label: 'Academic Mentor', icon: ShieldCheck }
          ].map((p) => {
            const isSelected = selectedPersona === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChangePersona(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-subtle)',
                  borderRadius: '999px',
                  padding: '3px 9px',
                  fontSize: '0.7rem',
                  fontWeight: isSelected ? 700 : 500
                }}
              >
                <Icon size={11} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => insertPrompt('@AI extract meeting minutes and action items')}
            title="Extract tasks, action items, and meeting minutes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '999px',
              padding: '3px 9px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
          >
            <CheckSquare size={11} />
            <span>Extract Action Items</span>
          </button>

          <button
            type="button"
            onClick={() => insertPrompt('@AI ')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '999px',
              padding: '3px 9px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
          >
            <Sparkles size={11} />
            <span>@AI Prompt</span>
          </button>
        </div>
      </div>

      {/* Input Form Box */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(26, 36, 60, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '8px 12px',
          boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.2)'
        }}
      >
        <textarea
          ref={textareaRef}
          id="chat-textarea"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            room === 'ai-lounge'
              ? `Ask in ${selectedPersona.toUpperCase()} mode (AI responds automatically)...`
              : `Message #${room} or type @AI (${selectedPersona} mode active)...`
          }
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            maxHeight: '120px',
            minHeight: '26px',
            color: '#ffffff',
            fontSize: '0.92rem',
            padding: '4px 6px'
          }}
        />

        <button
          type="submit"
          id="btn-send-message"
          disabled={!text.trim()}
          style={{
            background: text.trim() ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.08)',
            color: text.trim() ? '#ffffff' : 'var(--text-muted)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: text.trim() ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
            cursor: text.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
