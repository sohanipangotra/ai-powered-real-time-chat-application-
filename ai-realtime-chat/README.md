# 💬 AetherChat AI — AI-Powered Real-Time Chat Platform

A production-grade, full-stack real-time communication platform bridging bi-directional live peer messaging with context-aware, streaming AI copilot assistants.

---

## 🌟 Key Features

- **⚡ Bi-Directional Real-Time Messaging**: Built on **Socket.IO** with sub-millisecond event dispatch, active user presence tracking, and dynamic typing indicators.
- **🤖 Context-Aware AI Copilot**:
  - Mention `@AI` or use `/ai` in any channel to invoke intelligent assistant responses.
  - Dedicated **#ai-lounge** channel where every query triggers instant AI reasoning.
  - Context retention: Passes recent conversation history to the model for coherent, context-rich replies.
- **🔄 Interchangeable AI Engine**:
  - **Built-in Engine**: Works instantly out of the box with zero configuration or API keys.
  - **OpenAI**: GPT-4o, GPT-4o-mini support.
  - **Google Gemini**: Gemini 1.5 Flash / Pro support.
  - **Local Ollama**: Self-hosted LLM integration (Llama 3, Mistral).
- **🗄️ Dual-Mode Persistence**:
  - Production **MongoDB** & **Mongoose** schema architecture.
  - Automatic graceful failover to **In-Memory Store** if a MongoDB instance is offline—ensuring zero crashes and seamless testing out of the box.
- **🎨 Sleek Cyber Glassmorphism UI**:
  - Tailored dark mode palette with glowing gradient accents, responsive sidebar, auto-scroll chat viewport, and syntax-highlighted code blocks with 1-click copy.
  - Dynamic channel switching (`#general`, `#ai-lounge`, `#tech-talk`, `#random`).

---

## 🛠️ Architecture & Tech Stack

```
ai-realtime-chat/
├── client/                     # Frontend (React.js + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Channels & Active Peer list
│   │   │   ├── Header.jsx      # Room status, live DB & socket badges
│   │   │   ├── ChatArea.jsx    # Virtual message stream & typing indicator
│   │   │   ├── MessageBubble.jsx # Markdown, code formatting, model chips
│   │   │   ├── MessageInput.jsx  # Typing signal, quick @AI action pills
│   │   │   └── AISettingsModal.jsx # Dynamic model and API key config
│   │   ├── services/           # Socket.IO client & REST API client
│   │   ├── index.css           # Custom design tokens & animations
│   │   └── App.jsx             # Main app state coordinator
├── server/                     # Backend (Node.js + Express + Socket.IO)
│   ├── config/db.js            # MongoDB connection with auto-failover
│   ├── models/Message.js       # Unified Mongoose & memory repository
│   ├── routes/api.js           # REST endpoints (/api/status, /api/messages)
│   ├── services/aiService.js   # Multi-provider AI orchestrator
│   └── server.js               # Express + Socket.IO server entrypoint
└── package.json                # Root concurrently runner
```

---

## 🚀 Quick Start Guide

### 1. Run Server & Client Together (One Command)
From the `ai-realtime-chat` root directory:
```bash
npm run dev
```
- **Backend Server**: Starts on `http://localhost:5000`
- **Frontend Client**: Starts on `http://localhost:5173`

---

### 2. Or Run Separately

#### In Terminal 1 (Backend Server):
```bash
cd server
npm start
```

#### In Terminal 2 (Frontend Client):
```bash
cd client
npm run dev
```

Then open `http://localhost:5173` in your browser!

---

## 🧪 Testing Real-Time Sync & AI
1. **Multi-User Simulation**: Open `http://localhost:5173` in **two separate browser windows** (or one incognito window).
2. Set different display names (e.g., "Alice" and "Bob") using the **Edit** button in the sidebar footer.
3. Send messages between both tabs to witness instant live synchronization, real-time typing indicators, and presence updates.
4. Type `@AI can you write an Express route for user authentication?` to receive instant structured code from the AI assistant.
5. Switch to `#ai-lounge` to test conversational autopilot mode.
