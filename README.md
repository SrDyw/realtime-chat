# QuickChat

Real-time chat built with Next.js and Pusher.

![QuickChat](https://img.shields.io/badge/QuickChat-v1.0-violet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Pusher](https://img.shields.io/badge/Pusher-Realtime-FF6368?style=flat-square&logo=pusher)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## Demo

Try it live: [https://realtime-chat-bay.vercel.app](https://realtime-chat-bay.vercel.app)

## Features

### Real-Time Messaging
- Instant messages with WebSockets (Pusher)
- Real-time connection indicator
- Persistent message history

### User Presence
- Presence system with heartbeats (10s)
- Join/leave notifications
- Active users list in the room

### Reactions
- Emoji reactions (❤️, 😂, 😮, 😢, 👍, 🔥)
- Toggle reactions (same emoji to add/remove)
- See who reacted to each message

### Message Replies
- Reply to specific messages
- Preview of replied message
- Visual reply indicator

### Typing Indicator
- Shows when other users are typing
- WhatsApp-style animated dots
- Names of users who are typing

### Themes
- Light and dark mode
- Theme change from settings
- Selected theme persistence

### Design
- Modern UI with Tailwind CSS
- WhatsApp-style chat bubbles
- Random colors for each user
- Responsive design

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Real-Time**: Pusher Channels
- **Font**: Geist Sans/Mono

## Prerequisites

- Node.js 18+
- Pusher account (free at [pusher.com](https://pusher.com))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realtime-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Pusher credentials:
```env
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── messages/
│   │   │   ├── route.ts           # Store messages
│   │   │   └── reaction/
│   │   │       └── route.ts       # Reactions
│   │   ├── presence/
│   │   │   └── broadcast/
│   │   │       └── route.ts       # Presence events
│   │   ├── typing/
│   │   │   └── route.ts           # Typing indicator
│   │   └── pusher/
│   │       ├── auth/
│   │       │   └── route.ts       # Pusher auth
│   │       └── send/
│   │           └── route.ts       # Arbitrary events
│   ├── chat/
│   │   ├── ChatContent.tsx        # Chat content
│   │   ├── ChatHeader.tsx         # Header with users
│   │   ├── ChatTypingBubble.tsx   # Typing indicator
│   │   ├── Dropdown.tsx           # Reusable dropdown
│   │   ├── Modal.tsx              # Reusable modal
│   │   ├── MessageInput.tsx       # Message input
│   │   ├── MessageList.tsx         # Message list
│   │   ├── MessageReactions.tsx    # Message reactions
│   │   ├── ThemeDialog.tsx         # Theme dialog
│   │   └── useChat.ts             # Main chat hook
│   ├── hooks/
│   │   └── useTheme.ts            # Theme hook
│   ├── join/
│   │   ├── layout.tsx             # Layout with metadata
│   │   └── page.tsx               # Join page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Redirect to /join
└── lib/
    ├── pusher.ts                   # Pusher server client
    └── pusher-client.ts            # Pusher client
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/messages` | GET | Get room messages |
| `/api/messages` | POST | Store new message |
| `/api/messages/reaction` | POST | Add/remove reaction |
| `/api/presence/broadcast` | POST | Presence broadcast |
| `/api/typing` | POST | Typing indicator |
| `/api/pusher/auth` | POST | Channel authentication |

## Pusher Events

| Channel | Event | Description |
|---------|-------|-------------|
| `chat-{room}` | `new-message` | New message |
| `chat-{room}` | `user-joined` | User joined |
| `chat-{room}` | `user-left` | User left |
| `chat-{room}` | `heartbeat` | Presence heartbeat |
| `chat-{room}` | `user-typing` | User typing |
| `chat-{room}` | `message-reaction` | Message reaction |

## License

MIT
