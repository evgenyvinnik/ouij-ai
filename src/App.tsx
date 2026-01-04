import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';
import { OuijaBoard } from './components/board/OuijaBoard';
import { ChatPanel } from './components/chat/ChatPanel';
import { MessageDisplay } from './components/board/MessageDisplay';
import { IntroSequence } from './components/ui/IntroSequence';
import { PreviewLayout } from './components/PreviewLayout';
import { useOuijaSession } from './hooks/useOuijaSession';
import { useOuijaStore } from './state/useOuijaStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  useOuijaSession(); // Initialize keyboard handling

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const hasCompletedIntro = useOuijaStore((state) => state.hasCompletedIntro);
  const spiritName = useOuijaStore((state) => state.spiritName);
  const setSpiritName = useOuijaStore((state) => state.setSpiritName);
  const completeIntro = useOuijaStore((state) => state.completeIntro);

  // Check for preview mode via URL hash
  useEffect(() => {
    const checkPreviewMode = () => {
      setIsPreviewMode(window.location.hash === '#preview');
    };

    checkPreviewMode();
    window.addEventListener('hashchange', checkPreviewMode);
    return () => window.removeEventListener('hashchange', checkPreviewMode);
  }, []);

  // Render preview layout for screenshot generation
  if (isPreviewMode) {
    return <PreviewLayout />;
  }

  const handleIntroComplete = (name: string) => {
    setSpiritName(name);
    completeIntro();
  };

  // Show intro sequence if not completed
  if (!hasCompletedIntro) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <div
      className="relative h-screen w-screen bg-black"
      style={{
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header className="header-title">
        <h1 className="text-glow">OUIJ-AI</h1>
        <p className="spirit-subtitle">Communing with {spiritName}</p>
      </header>

      {/* Main Board - Centered */}
      <OuijaBoard />

      {/* Spirit Message Display */}
      <div className="spirit-message-container">
        <MessageDisplay />
      </div>

      {/* Chat Panel - Right side on desktop, bottom on mobile */}
      <div
        className="chat-panel-container absolute z-30"
        style={{
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1024px',
          padding: '0 1rem',
        }}
      >
        <ChatPanel />
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .chat-panel-container {
            right: 0 !important;
            left: auto !important;
            top: 50% !important;
            bottom: auto !important;
            transform: translateY(-50%) !important;
            max-width: 350px !important;
            width: 350px !important;
            height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .chat-panel-container {
            bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;
