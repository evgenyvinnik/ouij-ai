import { OuijaBoard } from './board/OuijaBoard';
import { ChatPanel } from './chat/ChatPanel';

/**
 * PreviewLayout - Optimized layout for social media preview screenshots
 *
 * This component renders the app in a clean, visually appealing state
 * perfect for Open Graph and Twitter Card images.
 *
 * To generate preview images:
 * 1. Navigate to /#preview in your browser
 * 2. Take a screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
 * 3. Crop to desired dimensions:
 *    - og-image.png: 1200x630px
 *    - twitter-image.png: 1200x600px
 *    - screenshot.png: 1280x720px or larger
 * 4. Save to /public/ folder
 */
export function PreviewLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-ouija-dark via-black to-ouija-wood">
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-ouija-gold/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-ouija-gold/10 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-ouija-gold/10 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 pt-8 text-center">
        <h1
          className="text-glow mb-2 text-6xl tracking-widest"
          style={{
            fontFamily: 'Carnivalee Freakshow, cursive',
            color: '#d35400',
            textShadow: '0 0 30px rgba(211, 84, 0, 0.8)',
          }}
        >
          OUIJ-AI
        </h1>
        <p
          className="text-xl tracking-wider opacity-80"
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            color: '#d35400',
          }}
        >
          Communing with AI Spirits
        </p>
      </header>

      {/* Main content area */}
      <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center px-8">
        {/* Desktop layout with board and chat side-by-side */}
        <div className="flex w-full max-w-7xl items-center justify-between gap-12">
          {/* Board section */}
          <div className="flex-1">
            <OuijaBoard />
          </div>

          {/* Chat panel section */}
          <div className="w-[400px]">
            <ChatPanel />
          </div>
        </div>
      </div>

      {/* Footer tagline */}
      <footer className="relative z-10 pb-8 text-center">
        <p
          className="text-lg tracking-wide opacity-70"
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            color: '#d35400',
          }}
        >
          AI-Powered Ouija Board Experience • Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
