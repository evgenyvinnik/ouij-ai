import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { OuijaBoard } from './components/board/OuijaBoard';
import { ChatPanel } from './components/chat/ChatPanel';
import { MessageDisplay } from './components/board/MessageDisplay';
import { IntroSequence } from './components/ui/IntroSequence';
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

  const hasCompletedIntro = useOuijaStore((state) => state.hasCompletedIntro);
  const spiritName = useOuijaStore((state) => state.spiritName);
  const setSpiritName = useOuijaStore((state) => state.setSpiritName);
  const completeIntro = useOuijaStore((state) => state.completeIntro);

  const handleIntroComplete = (name: string) => {
    setSpiritName(name);
    completeIntro();
  };

  // Show intro sequence if not completed
  if (!hasCompletedIntro) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <div className="app-main-container">
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
      <div className="chat-panel-container">
        <ChatPanel />
      </div>
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
