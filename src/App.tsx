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
    <div className="min-h-screen bg-gradient-to-b from-ouija-dark to-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 font-spooky text-6xl text-ouija-gold text-glow">
            OUIJ-AI
          </h1>
          <p className="font-vintage text-xl text-ouija-gold opacity-70">
            Ask the AI Spirits
          </p>
        </header>

        {/* Main Board */}
        <OuijaBoard />

        {/* Chat Panel */}
        <ChatPanel />

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-ouija-gold opacity-50">
            Type your question and press Enter to consult the spirits
          </p>
        </div>
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
