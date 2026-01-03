import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
    <div
      className="relative h-screen w-screen bg-black"
      style={{
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header - matching original style */}
      <header
        className="header-title absolute left-1/2 top-8 z-30 -translate-x-1/2 text-center"
      >
        <h1
          className="mb-2 text-glow"
          style={{
            fontFamily: 'Carnivalee Freakshow, cursive',
            fontSize: '6vw',
            color: '#d35400',
          }}
        >
          OUIJ-AI
        </h1>
        <p
          className="spirit-subtitle"
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            fontSize: '2vw',
            color: '#d35400',
            opacity: 0.7,
          }}
        >
          Communing with {spiritName}
        </p>
      </header>
      <style>{`
        @media (max-width: 768px) {
          .header-title h1 {
            font-size: 10vw !important;
          }
          .spirit-subtitle {
            font-size: 4vw !important;
          }
        }
        @media (min-width: 1200px) {
          .header-title h1 {
            font-size: 4vw !important;
          }
          .spirit-subtitle {
            font-size: 1.5vw !important;
          }
        }
        @media (min-width: 1600px) {
          .header-title h1 {
            font-size: 3.5vw !important;
          }
          .spirit-subtitle {
            font-size: 1.2vw !important;
          }
        }
      `}</style>

      {/* Main Board - Centered */}
      <OuijaBoard />

      {/* Spirit Message Display - Below board */}
      <div className="spirit-message-container absolute left-1/2 top-1/2 z-25 -translate-x-1/2 -translate-y-1/2" style={{
        width: '80vw',
        maxWidth: '1200px',
        aspectRatio: '1920 / 1282',
        pointerEvents: 'none',
      }}>
        <MessageDisplay />
      </div>
      <style>{`
        @media (max-width: 768px) {
          .spirit-message-container {
            top: 32% !important;
            width: 95vw !important;
          }
        }
        @media (max-height: 700px) {
          .spirit-message-container {
            top: 25% !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1199px) {
          .spirit-message-container {
            top: 42% !important;
            width: 70vw !important;
          }
        }
        @media (min-width: 1200px) {
          .spirit-message-container {
            width: 60vw !important;
            max-width: 900px !important;
            top: 40% !important;
          }
        }
        @media (min-width: 1600px) {
          .spirit-message-container {
            width: 50vw !important;
            max-width: 800px !important;
            top: 38% !important;
          }
        }
      `}</style>

      {/* Chat Panel - Below board */}
      <div className="chat-panel-container absolute bottom-8 left-1/2 z-30 w-full max-w-4xl -translate-x-1/2 px-4">
        <ChatPanel />
      </div>
      <style>{`
        @media (min-width: 1200px) {
          .chat-panel-container {
            max-width: 800px !important;
            bottom: 2rem !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1199px) {
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
    </QueryClientProvider>
  );
}

export default App;
