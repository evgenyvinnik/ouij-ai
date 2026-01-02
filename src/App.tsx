import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OuijaBoard } from './components/board/OuijaBoard';
import { ChatPanel } from './components/chat/ChatPanel';
import { useOuijaSession } from './hooks/useOuijaSession';

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
        className="absolute left-1/2 top-8 z-10 -translate-x-1/2 text-center"
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
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            fontSize: '2vw',
            color: '#d35400',
            opacity: 0.7,
          }}
        >
          Ask the AI Spirits
        </p>
      </header>

      {/* Main Board - Centered */}
      <OuijaBoard />

      {/* Chat Panel - Below board */}
      <div className="absolute bottom-8 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4">
        <ChatPanel />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
        <p
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            fontSize: '1.2vw',
            color: '#d35400',
            opacity: 0.5,
          }}
        >
          Type your question and press Enter to consult the spirits
        </p>
      </div>
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
