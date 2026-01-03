import { useEffect } from 'react';
import { BoardBackground } from './BoardBackground';
import { Planchette } from './Planchette';
import { MessageDisplay } from './MessageDisplay';
import { usePlanchetteAnimation } from '../../hooks/usePlanchetteAnimation';
import { useOuijaStore } from '../../state/useOuijaStore';
import { useAIChat } from '../../hooks/useAIChat';

export function OuijaBoard() {
  const { turn, userMessage, conversationHistory } = useOuijaStore();
  const { mutate: sendMessage } = useAIChat();
  usePlanchetteAnimation();

  // Trigger AI chat when it's the spirit's turn
  useEffect(() => {
    if (turn === 'spirit' && userMessage) {
      sendMessage({
        message: userMessage,
        history: conversationHistory,
      });
    }
  }, [turn, userMessage, conversationHistory, sendMessage]);

  return (
    <div
      className="ouija-board relative mx-auto"
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
      {/* Background */}
      <BoardBackground />

      {/* Planchette */}
      <Planchette />

      {/* Message Display */}
      <MessageDisplay />

      {/* Hover area to catch mouse events on rounded corners */}
      <div
        className="pointer-events-auto absolute inset-0 z-[13]"
        style={{ cursor: 'none' }}
      />
    </div>
  );
}
