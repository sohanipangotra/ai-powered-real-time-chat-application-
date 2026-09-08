import React from 'react';
import { X, Layers, CheckCircle2 } from 'lucide-react';


export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        id="architecture-modal"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '18px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                System Architecture & Capstone Specification
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                IEEE Standard Multi-Tier Distributed Design & Evaluation Blueprint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* System Architecture Diagram (Visual Block flow) */}
        <div style={{ marginBottom: '24px' }}>
          <h4
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--accent-cyan)',
              marginBottom: '12px'
            }}
          >
            Multi-Tier Architecture Diagram
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              position: 'relative'
            }}
          >
            {/* Layer 1: Client */}
            <div
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, marginBottom: '4px' }}>
                PRESENTATION
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                React.js Client
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Vite • Glassmorphism UI • Socket.IO Client • Telemetry
              </p>
            </div>

            {/* Layer 2: Transport */}
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#22d3ee', fontWeight: 700, marginBottom: '4px' }}>
                TRANSPORT BUS
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                WebSocket / Socket.IO
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                RFC 6455 Multiplex • Latency Ping-Pong • Typing State
              </p>
            </div>

            {/* Layer 3: Backend */}
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, marginBottom: '4px' }}>
                AI ORCHESTRATION
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                Node.js & Express
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Persona Dispatcher • Sentiment Engine • SHA-256 Hasher
              </p>
            </div>

            {/* Layer 4: Persistence */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                DATA LAYER
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                MongoDB / Hybrid
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Mongoose Schemas • Auto In-Memory Failover • Zero Setup
              </p>
            </div>
          </div>
        </div>

        {/* Academic Project Highlights & Methodology */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Engineering Innovations */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Key Engineering Contributions:
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span><strong>Zero-Friction Hybrid Storage:</strong> Instant boot with transparent memory fallback.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span><strong>Multi-Persona AI Pipeline:</strong> Switch between Architect, Academic, and Copilot.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span><strong>Cryptographic Auditing:</strong> Tamper-evident SHA-256 message signatures.</span>
              </li>
            </ul>
          </div>

          {/* Viva Presentation Points */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Examiner & Viva Talking Points:
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-cyan)" />
                <span><strong>Concurrency:</strong> Event-driven single-threaded asynchronous I/O with $O(1)$ dispatch.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-cyan)" />
                <span><strong>Low-Latency Framing:</strong> WebSocket frames replace costly HTTP headers.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-cyan)" />
                <span><strong>Live Profiling:</strong> Real-time latency measurement via synchronized timestamp offsets.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
