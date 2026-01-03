# Architecture Documentation

## System Overview

OUIJ-AI is a full-stack web application that combines a React-based frontend with Vercel Edge Functions backend to create an AI-powered Ouija board experience. The system uses real-time streaming to provide responsive AI interactions with smooth animations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Client                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │   Zustand    │  │  TanStack    │         │
│  │  Components  │──│    Store     │──│    Query     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         │                  │                  │                 │
│  ┌──────▼──────────────────▼──────────────────▼──────┐         │
│  │           Custom Hooks Layer                      │         │
│  │  - usePlanchette                                  │         │
│  │  - usePlanchetteAnimation (RAF)                   │         │
│  │  - useOuijaSession                                │         │
│  │  - useAIChat                                      │         │
│  └───────────────────────────────────────────────────┘         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/SSE
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Vercel Edge Functions                        │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/chat                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Receive user message + conversation history           │ │
│  │ 2. Call Anthropic API with streaming                     │ │
│  │ 3. Parse tool use (spell_message)                        │ │
│  │ 4. Stream SSE events back to client                      │ │
│  │    - event: token (AI thinking)                          │ │
│  │    - event: letters (planchette commands)                │ │
│  │    - event: done (completion)                            │ │
│  │    - event: error (error handling)                       │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Anthropic Claude API                       │
│                    (claude-sonnet-4-20250514)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Question Flow

```
1. User types question
   ↓
2. Keyboard handler (useOuijaSession)
   ↓
3. Store action: submitQuestion()
   ↓
4. Turn changes to 'spirit'
   ↓
5. useEffect triggers useAIChat mutation
   ↓
6. POST /api/chat with message + history
   ↓
7. Edge Function calls Anthropic with streaming
   ↓
8. AI generates response with spell_message tool
   ↓
9. SSE events streamed back:
   - tokens (optional, AI thinking)
   - letters (array of characters to spell)
   ↓
10. Client receives 'letters' event
   ↓
11. Store action: queueLetters()
   ↓
12. Turn changes to 'animating'
   ↓
13. usePlanchetteAnimation starts RAF loop
   ↓
14. For each letter:
    - Animate to coordinate (800ms)
    - Pause at letter (300ms)
    - Reveal letter
    - Queue next letter
   ↓
15. All letters revealed
   ↓
16. Turn changes to 'user'
```

## Component Hierarchy

```
App
└── QueryClientProvider
    └── AppContent
        ├── Header
        ├── OuijaBoard
        │   ├── BoardBackground (SVG/visual)
        │   ├── Planchette (draggable)
        │   │   └── MagnifyingGlass
        │   └── MessageDisplay
        │       ├── User input buffer
        │       └── Spirit revealed message (zalgo)
        └── ChatPanel
            ├── Conversation history
            └── Reset button
```

## State Management

### Zustand Store Structure

```typescript
OuijaState {
  planchette: {
    position: { x: number, y: number }  // percentages
    offset: { x: number, y: number }    // drag offset
    isDragging: boolean
  }

  animation: {
    isAnimating: boolean
    letterQueue: string[]               // letters to spell
    revealedLetters: string[]           // already shown
    currentLetterIndex: number
  }

  turn: 'user' | 'spirit' | 'animating'
  userMessage: string
  conversationHistory: Message[]

  // Actions...
}
```

### TanStack Query

- **Mutation**: `useAIChat` for sending messages
- **No caching**: Each message is a fresh mutation
- **SSE handling**: Custom fetch wrapper in `chatClient.ts`

## API Design

### Edge Function: `/api/chat`

**Endpoint**: `POST /api/chat`

**Request**:
```json
{
  "message": "What is my future?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "GREETINGS" }
  ]
}
```

**Response**: Server-Sent Events (SSE)

```
event: token
data: {"token":"I"}

event: token
data: {"token":" see"}

event: letters
data: {"letters":["D","A","R","K","N","E","S","S"]}

event: done
data: {}
```

**Error Response**:
```
event: error
data: {"error":"API key not configured"}
```

### Anthropic Integration

**Model**: `claude-sonnet-4-20250514`

**System Prompt**: Defines spirit personality
- Cryptic and mysterious
- Brief responses (under 20 chars)
- Must use `spell_message` tool
- Never breaks character

**Tool Definition**:
```json
{
  "name": "spell_message",
  "description": "Spell out a message on the Ouija board",
  "input_schema": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string",
        "description": "Message to spell (letters/numbers only)"
      }
    },
    "required": ["message"]
  }
}
```

## Animation System

### requestAnimationFrame Loop

```typescript
// Pseudo-code for animation
function animate() {
  const now = Date.now()
  const elapsed = now - startTime

  if (phase === 'moving') {
    const progress = Math.min(elapsed / MOVE_DURATION, 1)
    const eased = easeOutCubic(progress)
    const x = lerp(startX, targetX, eased)
    const y = lerp(startY, targetY, eased)
    movePlanchette({ x, y })

    if (progress >= 1) {
      phase = 'paused'
      pauseStartTime = now
    }
  } else if (phase === 'paused') {
    if (now - pauseStartTime >= PAUSE_DURATION) {
      revealNextLetter()
      return // Exit, will restart for next letter
    }
  }

  requestAnimationFrame(animate)
}
```

### Coordinate System

- **Origin**: Center of board (50%, 50%)
- **Units**: Percentages for CSS positioning
- **Conversion**: Pixel coords → percentage based on board dimensions

```typescript
// Example coordinate
'A': { x: -159.6, y: -58.17 }  // pixels from center

// Converted to percentage
const xPercent = 50 + (-159.6 / 400) * 100  // ~10%
const yPercent = 50 + (-58.17 / 300) * 100  // ~30%
```

## Vercel Deployment

### Configuration (`vercel.json`)

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### Environment Variables

- `ANTHROPIC_API_KEY`: Set in Vercel dashboard
- Access via `process.env.ANTHROPIC_API_KEY`

### Edge Runtime Features

- **Low latency**: Runs at edge locations worldwide
- **Streaming**: Native support for SSE
- **No cold starts**: Better performance than serverless functions

## Security Considerations

### Input Validation

- **User messages**: Trimmed and length-limited (500 chars)
- **AI output**: Sanitized to A-Z, 0-9, spaces only
- **No XSS**: React escapes all user content

### API Key Protection

- **Server-side only**: API key never exposed to client
- **Edge Functions**: Secure environment variable access
- **CORS**: Configured for specific origins in production

### Rate Limiting

- Consider implementing rate limiting on Edge Functions
- Anthropic has built-in rate limits
- Implement client-side debouncing for rapid submissions

## Performance Optimizations

### React Compiler

- Automatically optimizes component re-renders
- No manual `useMemo` or `useCallback` needed (unless for stable refs)

### Zustand Selectors

```typescript
// Bad: Subscribes to entire store
const state = useOuijaStore()

// Good: Subscribes to specific slice
const position = useOuijaStore(state => state.planchette.position)
```

### Animation Performance

- **RAF**: Synced with browser repaint (60fps)
- **Transform**: Uses CSS transform (GPU-accelerated)
- **No layout thrashing**: Batch DOM reads/writes

## Error Handling

### Client-Side

- **Network errors**: Caught in mutation error handler
- **SSE errors**: `error` event type from server
- **Animation errors**: Try-catch in RAF loop

### Server-Side

- **API failures**: Return error SSE event
- **Invalid input**: Validate before Anthropic call
- **Timeout**: Edge Functions have 25s limit

## Testing Strategy

### Unit Testing

- **Utils**: Pure functions (easing, coords, zalgo)
- **Hooks**: Test with React Testing Library
- **Store**: Test actions and state changes

### Integration Testing

- **Component interactions**: User flow testing
- **API mocking**: Mock SSE responses
- **Animation**: Visual regression testing

### E2E Testing

- **Full flow**: Question → AI response → animation
- **Edge cases**: Long messages, rapid submissions
- **Error scenarios**: API failures, network issues

## Future Enhancements

### Possible Features

1. **Voice Input**: Speech-to-text for questions
2. **Sound Effects**: Eerie sounds during animation
3. **Multiple Spirits**: Different AI personalities
4. **Session Persistence**: Save conversation history
5. **Multiplayer**: Multiple users on same board
6. **Custom Boards**: User-uploaded board images

### Technical Debt

- Add comprehensive test suite
- Implement proper error boundaries
- Add analytics/monitoring
- Optimize bundle size
- Add progressive web app (PWA) support

## Monitoring & Debugging

### Client-Side

- Browser DevTools for React components
- Network tab for SSE inspection
- Performance tab for RAF profiling

### Server-Side

- Vercel logs for Edge Function execution
- Anthropic dashboard for API usage
- Error tracking (Sentry, etc.)

## Dependencies

### Critical Dependencies

- `react@19`: UI framework
- `@anthropic-ai/sdk`: AI integration
- `zustand`: State management
- `@tanstack/react-query`: Server state
- `tailwindcss@4`: Styling

### Build Dependencies

- `vite`: Build tool
- `typescript`: Type safety
- `babel-plugin-react-compiler`: React optimization

---

This architecture supports scalability, maintainability, and provides an engaging user experience with smooth animations and responsive AI interactions.
