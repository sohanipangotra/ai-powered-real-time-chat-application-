import React, { useState } from 'react';
import { Bot, User, Sparkles, Copy, Check, ShieldCheck, Smile, AlertTriangle } from 'lucide-react';


export default function MessageBubble({ message, isSelf }) {
  const [copied, setCopied] = useState(false);
  const isAi = message.senderType === 'ai';
  const isSystem = message.senderType === 'system';

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSentiment = (sentiment) => {
    if (!sentiment || !sentiment.polarity || sentiment.polarity === 'neutral') return null;

    if (sentiment.polarity === 'positive') {
      return (
        <span
          title="Sentiment Analysis: Positive Polarity"
          style={{
            fontSize: '0.64rem',
            padding: '1px 5px',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Smile size={9} />
          <span>Positive</span>
        </span>
      );
    }

    if (sentiment.polarity === 'critical') {
      return (
        <span
          title="Sentiment Analysis: Issue / Bug / Critical"
          style={{
            fontSize: '0.64rem',
            padding: '1px 5px',
            borderRadius: '4px',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <AlertTriangle size={9} />
          <span>Issue/Review</span>
        </span>
      );
    }
    return null;
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;

    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let language = 'code';
        let codeBody = lines.join('\n');
        if (lines[0] && !lines[0].includes(' ') && lines.length > 1) {
          language = lines[0];
          codeBody = lines.slice(1).join('\n');
        }

        return (
          <div key={index} style={{ margin: '8px 0', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 12px',
                background: '#0d1117',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>{language}</span>
            </div>
            <pre style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      const inlineLines = part.split('\n');
      return (
        <span key={index}>
          {inlineLines.map((line, lIdx) => {
            const boldParts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <React.Fragment key={lIdx}>
                {boldParts.map((bPart, bIdx) => {
                  if (bPart.startsWith('**') && bPart.endsWith('**')) {
                    return <strong key={bIdx} style={{ color: '#ffffff' }}>{bPart.slice(2, -2)}</strong>;
                  }
                  return bPart;
                })}
                {lIdx < inlineLines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  };

  if (isSystem) {
    return (
      <div
        style={{
          textAlign: 'center',
          margin: '12px 0',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span style={{ height: '1px', flex: 1, background: 'var(--border-subtle)' }} />
        <span>{message.content}</span>
        <span style={{ height: '1px', flex: 1, background: 'var(--border-subtle)' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        margin: '16px 0',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        alignItems: 'flex-start'
      }}
    >
      {/* Sender Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: isAi
            ? 'var(--ai-gradient)'
            : isSelf
            ? 'var(--accent-primary)'
            : 'rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isAi ? '0 0 14px rgba(6, 182, 212, 0.4)' : 'none'
        }}
      >
        {isAi ? (
          <Bot size={19} color="#ffffff" />
        ) : isSelf ? (
          <User size={18} color="#ffffff" />
        ) : (
          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
            {message.sender ? message.sender.charAt(0).toUpperCase() : 'U'}
          </span>
        )}
      </div>

      {/* Message Content Container */}
      <div
        style={{
          maxWidth: '78%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSelf ? 'flex-end' : 'flex-start'
        }}
      >
        {/* Header Metadata */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
            fontSize: '0.78rem',
            flexWrap: 'wrap'
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: isAi ? 'var(--accent-cyan)' : isSelf ? 'var(--accent-primary)' : 'var(--text-secondary)'
            }}
          >
            {isSelf ? 'You' : message.sender}
          </span>

          {/* Model & Persona Badge */}
          {isAi && (
            <span
              style={{
                fontSize: '0.64rem',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Sparkles size={10} />
              {message.persona ? `${message.persona.toUpperCase()} MODE` : (message.aiModel || 'AI')}
            </span>
          )}

          {/* Sentiment Badge */}
          {renderSentiment(message.sentiment)}

          {/* Cryptographic SHA-256 Signature */}
          {message.signature && (
            <span
              title={`SHA-256 Checksum Signature: ${message.signature}`}
              style={{
                fontSize: '0.64rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ShieldCheck size={10} color="#5eead4" />
              <span>#{message.signature.substring(0, 6)}</span>
            </span>
          )}

          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message Bubble Box */}
        <div
          className="message-bubble-box"
          style={{
            position: 'relative',
            padding: '12px 16px',
            borderRadius: isSelf ? '16px 4px 16px 16px' : '4px 16px 16px 16px',

            background: isAi
              ? 'rgba(15, 23, 42, 0.88)'
              : isSelf
              ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
              : 'rgba(26, 36, 60, 0.75)',
            border: isAi
              ? '1px solid rgba(6, 182, 212, 0.38)'
              : isSelf
              ? '1px solid rgba(99, 102, 241, 0.5)'
              : '1px solid var(--border-subtle)',
            boxShadow: isAi
              ? '0 4px 20px rgba(6, 182, 212, 0.12)'
              : isSelf
              ? '0 4px 16px rgba(99, 102, 241, 0.25)'
              : 'var(--shadow-sm)',
            fontSize: '0.92rem',
            lineHeight: 1.55,
            wordBreak: 'break-word',
            color: '#f8fafc'
          }}
        >
          {renderFormattedContent(message.content)}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy message text"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '4px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s'
            }}
            className="copy-btn"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
