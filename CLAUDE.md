# CLAUDE.md - AI Assistant Guidelines

## Project Overview

**OUIJ-AI** is an AI-powered Ouija board web experience that combines React 19, Vite, TypeScript, Tailwind CSS v4, and Anthropic Claude API. The project features smooth planchette animations, real-time AI streaming, and atmospheric visual effects.

## Tech Stack

- **Frontend**: React 19 with React Compiler, TypeScript (strict mode)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (client), TanStack Query (server)
- **AI Backend**: Anthropic Claude Sonnet 4 via Vercel Edge Functions
- **Deployment**: Vercel

## Project Structure

```
ouij-ai/
├── api/                           # Backend Edge Functions
│   ├── chat.ts                   # SSE streaming endpoint
│   ├── verify-spirit.ts          # Spirit name verification
│   ├── constants.ts              # AI config & prompts
│   ├── utils.ts                  # Server utilities
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── AppContent.tsx        # Main app content wrapper
│   │   ├── board/                # Board components
│   │   │   ├── OuijaBoard.tsx
│   │   │   ├── BoardBackground.tsx
│   │   │   ├── Planchette.tsx
│   │   │   ├── MagnifyingGlass.tsx
│   │   │   └── MessageDisplay.tsx
│   │   ├── ui/                   # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── IntroSequence.tsx
│   │   │   ├── SpiritNameDialog.tsx
│   │   │   └── SpiritFilters.tsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ThinkingIndicator.tsx
│   │   │   └── ErrorDisplay.tsx
│   │   └── icons/
│   │       ├── MicrophoneIcon.tsx
│   │       ├── SendIcon.tsx
│   │       └── CloseIcon.tsx
│   ├── hooks/                    # Custom hooks
│   │   ├── usePlanchetteAnimation.ts  # 60fps animations
│   │   ├── useOuijaSession.ts    # Keyboard & session
│   │   ├── useAIChat.ts          # TanStack Query + SSE
│   │   └── useSpeechRecognition.ts # Voice input
│   ├── state/
│   │   └── useOuijaStore.ts      # Zustand store
│   ├── types/
│   │   └── ouija.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── letterCoords.ts       # Board coordinates
│   │   ├── animations.ts         # Easing functions
│   │   └── zalgo.ts              # Spooky text effects
│   ├── api/
│   │   └── chatClient.ts         # SSE client
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
└── [config files]
```

## Coding Patterns & Conventions

### TypeScript

- **Strict mode enabled**: All code must pass strict TypeScript checks
- **Explicit types**: Always define interface/type for component props
- **No `any`**: Use `unknown` when type is truly unknown
- **Prefer interfaces** over types for object shapes

### React

- **Function components only**: Use modern React patterns
- **Custom hooks**: Extract reusable logic into hooks
- **React Compiler**: Code is optimized by React Compiler, avoid manual memoization unless needed
- **Proper dependency arrays**: Ensure useEffect/useCallback deps are correct

### State Management

- **Zustand for client state**:
  - Single store in `useOuijaStore.ts`
  - Actions defined in store
  - Selectors used for granular subscriptions

- **TanStack Query for server state**:
  - Used in `useAIChat` hook
  - Handles mutations for AI chat
  - No manual refetch logic

### Styling

- **Tailwind CSS v4**: Utility-first approach
- **Custom colors**: `ouija-dark`, `ouija-wood`, `ouija-gold`, `ouija-text`
- **Custom fonts**: Feral, Carnivalee Freakshow, Kingthings Trypewriter 2
- **CSS organization**: All styles in `index.css`, no inline styles or embedded `<style>` tags
- **Responsive design**:
  - Mobile-first with breakpoints at 768px, 1024px, 1600px
  - Dynamic viewport height (`100dvh`) for mobile browser UI handling
  - Reduced padding and font sizes on mobile for optimal space usage
  - Chat panel max-height: 300px on mobile to prevent covering the board
  - Board positioned at 30% from top on mobile for better visibility
- **Dark theme**: Atmospheric, mystical aesthetic

### Animation System

- **requestAnimationFrame**: All animations use RAF for 60fps
- **Easing functions**: `easeOutCubic` for movement, `easeInOutCubic` for rotation
- **Bezier curves**: Smooth curved paths for planchette movement
- **No CSS transitions** for planchette movement (use RAF instead)
- **Rotation-aware positioning**: Tip offset calculated with trigonometry for YES/NO/GOODBYE
- **Visual feedback**: White glow when planchette is animating

## Key Architecture Decisions

### 1. SSE Streaming for AI Responses

**Why**: Real-time character-by-character streaming creates engaging UX
**Implementation**:
- Edge function returns SSE stream
- Client parses events: `token`, `letters`, `done`, `error`
- Letters queued in Zustand for animation

### 2. Tool-Based AI Control

**Why**: Forces AI to use structured output for planchette control
**Implementation**:
- `spell_message` tool defined in API
- AI must call tool to communicate
- Tool returns array of letters to spell

### 3. Coordinate-Based Positioning

**Why**: Accurate letter positioning matching traditional Ouija boards
**Implementation**:
- Pixel coordinates from original implementation
- Converted to percentages for responsive layout
- Center-based positioning (50%, 50%)

### 4. Separation of Animation from State

**Why**: Clean separation of concerns, easier testing
**Implementation**:
- `useOuijaStore`: State management with Zustand persistence
- `usePlanchetteAnimation`: Pure animation logic
- Hooks communicate via store
- No user drag interaction - fully AI-controlled

### 5. Session Persistence

**Why**: Maintain conversation context across page refreshes
**Implementation**:
- Zustand persist middleware with localStorage
- 5-minute timeout for conversation expiry
- Stores: conversation history, spirit name, intro completion status
- Custom merge function validates session before restoration

## Common Tasks

### Adding a New Component

1. Create component in appropriate directory
2. Define TypeScript interface for props
3. Use Tailwind for styling
4. Export from component file
5. Import and use in parent component

### Modifying Animation Behavior

1. Edit `usePlanchetteAnimation.ts` for timing/easing
2. Adjust constants: `MOVE_DURATION`, `PAUSE_DURATION`
3. Change easing function in `animations.ts`

### Updating AI Behavior

1. Edit `SYSTEM_PROMPT` in `api/constants.ts`
   - Spirits show unique personality through word choice (not generically cryptic)
   - Response length: 1-4 words that reflect character traits
   - Examples: Einstein uses "RELATIVE", Shakespeare uses "AYE", Mark Twain uses "HELL YES"
2. Adjust `MODEL_CONFIG` for model/temperature
3. Modify tool definition if needed

### Adding New Letter Positions

1. Edit `LETTER_COORDS` in `src/utils/letterCoords.ts`
2. Add coordinate mapping
3. Test with animation

## Testing Approach

- **Dev testing**: Use `bun run dev` for rapid iteration
- **Type checking**: `bun run type-check` before commit
- **Linting**: `bun run lint` to catch issues
- **Build verification**: `bun run build` to ensure production build works

## Deployment

1. Ensure `ANTHROPIC_API_KEY` is set in Vercel environment
2. Push to main branch (auto-deploys on Vercel)
3. Or use `vercel` CLI for manual deployment
4. Verify Edge Functions are working in production

## Troubleshooting

### Planchette Not Moving
- Check `usePlanchetteAnimation` is called
- Verify letters are queued in store
- Check browser console for RAF errors

### AI Not Responding
- Verify API key is set
- Check network tab for `/api/chat` requests
- Look for SSE parsing errors in console

### TypeScript Errors
- Run `bun run type-check` to see all errors
- Check for missing type definitions
- Ensure imports are correct

## Features Implemented

1. **AI-Powered Spirit Communication**: Claude Sonnet 4 responds with unique personality for each spirit
2. **Smooth Planchette Animation**: 60fps RAF-based animation with bezier curves
3. **Voice Input**: Speech-to-text for asking questions (100 character limit)
4. **Session Persistence**: Conversation saved for 5 minutes with localStorage
5. **Spirit Verification**: AI validates if entered name is deceased
6. **Intro Sequence**: Animated title and spirit name entry dialog
7. **Responsive Design**: Optimized for mobile, tablet, and desktop with dynamic viewport handling
8. **Chat History**: Full conversation display with compact mobile layout
9. **Error Handling**: Graceful degradation and user-friendly errors
10. **Atmospheric UI**: Custom fonts, dark theme, mystical effects with SVG filters
11. **Mobile Optimizations**: Reduced padding, adjusted positioning, max-height constraints

## Best Practices

1. **Keep components small**: Single responsibility
2. **Use semantic HTML**: Accessibility matters
3. **Avoid prop drilling**: Use Zustand for shared state
4. **Comment complex logic**: Especially animation math
5. **Test edge cases**: Empty messages, long messages, etc.

## Resources

- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)
- [Anthropic API](https://docs.anthropic.com/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)

---

When working on this project, prioritize:
1. Type safety (strict TypeScript)
2. Performance (60fps animations)
3. User experience (smooth interactions)
4. Code clarity (readable, maintainable)
5. Mobile responsiveness (dynamic viewport, compact layouts)