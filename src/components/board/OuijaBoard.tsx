import { useEffect, useState } from 'react';
import { BoardBackground } from './BoardBackground';
import { Planchette } from './Planchette';
import { MessageDisplay } from './MessageDisplay';
import { CalibrationOverlay } from './CalibrationOverlay';
import { InteractiveCalibration } from './InteractiveCalibration';
import { usePlanchetteAnimation } from '../../hooks/usePlanchetteAnimation';
import { useOuijaStore } from '../../state/useOuijaStore';
import { useAIChat } from '../../hooks/useAIChat';

export function OuijaBoard() {
  const { turn, userMessage, conversationHistory, spiritName } = useOuijaStore();
  const { mutate: sendMessage } = useAIChat();
  const [showCalibration, setShowCalibration] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [hidePlanchette, setHidePlanchette] = useState(false);

  usePlanchetteAnimation();

  // Toggle calibration overlay with F1 key (won't interfere with chat)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault(); // Prevent browser help menu
        setShowCalibration(prev => {
          const newState = !prev;
          console.log('Calibration mode:', newState ? 'ON' : 'OFF');
          return newState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Trigger AI chat when it's the spirit's turn
  useEffect(() => {
    if (turn === 'spirit' && userMessage) {
      sendMessage({
        message: userMessage,
        history: conversationHistory,
        spiritName: spiritName || undefined,
      });
    }
  }, [turn, userMessage, conversationHistory, spiritName, sendMessage]);

  return (
    <div
      className="ouija-board relative mx-auto z-10"
      style={{
        width: '80vw',
        maxWidth: '1200px',
        aspectRatio: '1920 / 1282',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Calibration Toggle Button */}
      <button
        onClick={() => setShowCalibration(prev => !prev)}
        className="absolute -top-12 right-40 z-50 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-red-700"
      >
        {showCalibration ? '✓ View Mode' : 'View Mode'}
      </button>

      {/* Interactive Calibration Toggle */}
      <button
        onClick={() => setShowInteractive(prev => !prev)}
        className="absolute -top-12 right-0 z-50 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-green-700"
      >
        {showInteractive ? '✓ Edit Mode' : 'Edit Mode'}
      </button>

      {/* Background */}
      <BoardBackground />

      {/* Planchette - can be hidden during calibration */}
      {!hidePlanchette && <Planchette />}

      {/* Calibration Overlay */}
      <CalibrationOverlay visible={showCalibration} />

      {/* Interactive Calibration */}
      <InteractiveCalibration
        visible={showInteractive}
        onHidePlanchette={setHidePlanchette}
      />

      {/* Message Display */}
      <MessageDisplay />

      {/* Hover area to catch mouse events on rounded corners */}
      <div
        className="pointer-events-auto absolute inset-0 z-[13]"
        style={{ cursor: 'auto' }}
      />
    </div>
  );
}
