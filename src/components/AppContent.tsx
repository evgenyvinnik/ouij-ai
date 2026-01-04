/**
 * AppContent - Main application content component
 *
 * Manages the core application flow:
 * - Intro sequence for spirit name entry
 * - Main Ouija board interface with chat panel
 * - Session handling via keyboard hooks
 *
 * @remarks
 * This component handles the state transition from intro to main app,
 * and coordinates the layout of all major UI elements.
 */

import { OuijaBoard } from './board/OuijaBoard';
import { ChatPanel } from './chat/ChatPanel';
import { MessageDisplay } from './board/MessageDisplay';
import { IntroSequence } from './ui/IntroSequence';
import { useOuijaSession } from '../hooks/useOuijaSession';
import { useOuijaStore } from '../state/useOuijaStore';

/**
 * Renders the main application content
 *
 * @returns JSX element containing either the intro sequence or main app interface
 */
export function AppContent() {
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
