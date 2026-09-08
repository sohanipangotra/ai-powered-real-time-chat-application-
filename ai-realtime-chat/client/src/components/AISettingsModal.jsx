import React, { useState } from 'react';
import { X, Sparkles, Key, ShieldCheck, Check } from 'lucide-react';


export default function AISettingsModal({
  isOpen,
  onClose,
  aiConfig,
  onSaveConfig
}) {
  const [provider, setProvider] = useState(aiConfig.provider || 'builtin');
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '');
  const [model, setModel] = useState(aiConfig.model || '');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({ provider, apiKey, model });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        id="ai-settings-modal"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.15)',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--ai-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Model Configuration</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Customize the real-time AI generation engine & models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave}>
          {/* Provider Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}
            >
              AI Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'builtin', name: 'Built-in Engine', desc: 'Instant (No key required)' },
                { id: 'openai', name: 'OpenAI', desc: 'GPT-4o / GPT-4o-mini' },
                { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 1.5 Flash' },
                { id: 'ollama', name: 'Local Ollama', desc: 'Self-hosted LLMs' }
              ].map((item) => {
                const isSelected = provider === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setProvider(item.id);
                      if (item.id === 'openai' && !model) setModel('gpt-4o-mini');
                      if (item.id === 'gemini' && !model) setModel('gemini-1.5-flash');
                      if (item.id === 'ollama' && !model) setModel('llama3');
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: isSelected
                        ? '1px solid var(--accent-primary)'
                        : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Name */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}
            >
              Model Identifier
            </label>
            <input
              type="text"
              id="input-model-id"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={
                provider === 'openai'
                  ? 'gpt-4o-mini'
                  : provider === 'gemini'
                  ? 'gemini-1.5-flash'
                  : provider === 'ollama'
                  ? 'llama3'
                  : 'built-in-neural-v1'
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* API Key (if external provider selected) */}
          {provider !== 'builtin' && provider !== 'ollama' && (
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}
              >
                <label
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Key size={13} />
                  <span>API Key (stored securely in browser)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    background: 'transparent',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.72rem'
                  }}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                id="input-api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider === 'openai' ? 'sk-...' : 'AIzaSy...'} key`}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          )}

          {/* Privacy Note */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <ShieldCheck size={16} color="var(--accent-cyan)" />
            <span>
              Keys configured here are sent directly to the local server orchestrator and are never shared publicly.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
              id="btn-save-ai-settings"
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                background: savedSuccess ? '#10b981' : 'var(--accent-gradient)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
