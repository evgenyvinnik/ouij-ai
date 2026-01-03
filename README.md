# OUIJ-AI 🔮

An AI-powered Ouija board web experience combining mystical aesthetics with cutting-edge AI technology. Ask questions and watch as AI spirits respond through smooth planchette animations.

![OUIJ-AI Banner](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-cyan)

## ✨ Features

- **AI-Powered Responses**: Powered by Anthropic's Claude Sonnet 4 for cryptic, mysterious responses
- **Smooth Animations**: 60fps planchette animations using requestAnimationFrame
- **Real-time Streaming**: Server-Sent Events (SSE) for live AI responses
- **Interactive Board**: Drag the planchette or watch it move autonomously
- **Spooky Effects**: Zalgo text effects and atmospheric styling
- **Conversation History**: Track your dialogue with the spirits
- **Keyboard Input**: Type questions directly and press Enter to submit

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/evgenyvinnik/ouij-ai.git
cd ouij-ai

# Install dependencies
bun install

# Create environment file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Development

```bash
# Start dev server
bun run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 🎮 How to Use

1. **Type Your Question**: Use your keyboard to type a question
2. **Press Enter**: Submit your question to the spirits
3. **Watch the Magic**: The planchette will move to spell out the AI's cryptic response
4. **Continue the Conversation**: Ask follow-up questions to dig deeper

## 🏗️ Tech Stack

- **Frontend Framework**: React 19 with React Compiler
- **Build Tool**: Vite 6
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**:
  - Zustand for client state
  - TanStack Query for server state
- **AI Backend**: Anthropic Claude API via Vercel Edge Functions
- **Deployment**: Vercel

## 📁 Project Structure

```
ouij-ai/
├── api/                    # Vercel Edge Functions
│   ├── chat.ts            # Main AI chat endpoint with SSE
│   ├── constants.ts       # AI configuration and prompts
│   └── utils.ts           # Server utilities
├── src/
│   ├── components/
│   │   ├── board/         # Ouija board components
│   │   ├── ui/            # Reusable UI components
│   │   └── chat/          # Chat panel components
│   ├── hooks/             # Custom React hooks
│   ├── state/             # Zustand store
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities (animations, zalgo, coords)
│   └── api/               # API client
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎨 Key Features Explained

### Planchette Animation System

The planchette uses requestAnimationFrame for smooth 60fps animations:
1. AI returns letters via the `spell_message` tool
2. Letters are queued in Zustand store
3. `usePlanchetteAnimation` hook processes the queue
4. Each letter: animate to coordinates → pause → reveal → next
5. Easing function (ease-out cubic) creates supernatural feel

### AI Integration

The system uses Anthropic's Claude with a custom tool definition:
- **Tool**: `spell_message` - Forces AI to spell messages letter by letter
- **System Prompt**: Defines spirit personality (cryptic, mysterious, brief)
- **Streaming**: Real-time SSE for responsive experience
- **Context**: Maintains conversation history for coherent dialogue

### Letter Coordinates

Coordinate system ported from [baobabKoodaa/ouija](https://github.com/baobabKoodaa/ouija):
- Pixel-based coordinates relative to board center
- Supports A-Z, 0-9, and special positions (YES, NO, GOODBYE)
- Converted to percentages for responsive CSS positioning

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Set environment variable
vercel env add ANTHROPIC_API_KEY
```

The `vercel.json` configuration is already set up for Edge Functions.

### Environment Variables

Required environment variables:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UI inspiration from [baobabKoodaa/ouija](https://github.com/baobabKoodaa/ouija)
- Architecture patterns from [evgenyvinnik/MCPlator](https://github.com/evgenyvinnik/MCPlator)
- Powered by [Anthropic Claude](https://www.anthropic.com/)

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/evgenyvinnik/ouij-ai/issues).

---

**Note**: This is a creative project for entertainment purposes. The "spirits" are powered by AI language models. 👻
