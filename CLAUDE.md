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
│   ├── constants.ts              # AI config & prompts
│   ├── utils.ts                  # Server utilities
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── board/                # Board components
│   │   │   ├── OuijaBoard.tsx
│   │   │   ├── BoardBackground.tsx
│   │   │   ├── Planchette.tsx
│   │   │   ├── MagnifyingGlass.tsx
│   │   │   └── MessageDisplay.tsx
│   │   ├── ui/                   # UI components
│   │   │   ├── Button.tsx
│   │   │   └── LoadingOverlay.tsx
│   │   └── chat/
│   │       └── ChatPanel.tsx
│   ├── hooks/                    # Custom hooks
│   │   ├── usePlanchette.ts      # Position & drag handling
│   │   ├── usePlanchetteAnimation.ts  # 60fps animations
│   │   ├── useOuijaSession.ts    # Keyboard & session
│   │   └── useAIChat.ts          # TanStack Query + SSE
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
- **Custom colors**: `ouija-dark`, `ouija-wood`, `ouija-gold`
- **Responsive**: Mobile-friendly but desktop-primary
- **Dark theme**: Atmospheric, mystical aesthetic

### Animation System

- **requestAnimationFrame**: All animations use RAF for 60fps
- **Easing functions**: `easeOutCubic` for supernatural feel
- **No CSS transitions** for planchette movement (use RAF instead)
- **Smooth interpolation**: `lerp` function for position changes

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
- `useOuijaStore`: State management
- `usePlanchetteAnimation`: Pure animation logic
- Hooks communicate via store

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
2. Adjust `MODEL_CONFIG` for model/temperature
3. Modify tool definition if needed

### Adding New Letter Positions

1. Edit `LETTER_COORDS` in `src/utils/letterCoords.ts`
2. Add coordinate mapping
3. Test with animation

## Testing Approach

- **Dev testing**: Use `npm run dev` for rapid iteration
- **Type checking**: `npm run type-check` before commit
- **Linting**: `npm run lint` to catch issues
- **Build verification**: `npm run build` to ensure production build works

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
- Run `npm run type-check` to see all errors
- Check for missing type definitions
- Ensure imports are correct

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
