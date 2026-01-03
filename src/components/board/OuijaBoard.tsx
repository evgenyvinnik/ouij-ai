import { useEffect } from 'react';
import { BoardBackground } from './BoardBackground';
import { Planchette } from './Planchette';
import { usePlanchetteAnimation } from '../../hooks/usePlanchetteAnimation';
import { useOuijaStore } from '../../state/useOuijaStore';
import { useAIChat } from '../../hooks/useAIChat';

export function OuijaBoard() {
  const { turn, userMessage, conversationHistory, spiritName } = useOuijaStore();
  const { mutate: sendMessage } = useAIChat();

  usePlanchetteAnimation();

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
      {/* Mobile-specific positioning */}
      <style>{`
        @media (max-width: 768px) {
          .ouija-board {
            top: 32% !important;
            width: 95vw !important;
          }
        }
        @media (max-height: 700px) {
          .ouija-board {
            top: 25% !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1199px) {
          .ouija-board {
            top: 42% !important;
            width: 70vw !important;
          }
        }
        @media (min-width: 1200px) {
          .ouija-board {
            width: 60vw !important;
            max-width: 900px !important;
            top: 40% !important;
          }
        }
        @media (min-width: 1600px) {
          .ouija-board {
            width: 50vw !important;
            max-width: 800px !important;
            top: 38% !important;
          }
        }
      `}</style>
      {/* Background */}
      <BoardBackground />

      {/* Planchette */}
      <Planchette />

      {/* Hover area to catch mouse events on rounded corners */}
      <div
        className="pointer-events-auto absolute inset-0 z-[13]"
        style={{ cursor: 'auto' }}
      />
    </div>
  );
}
