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
    <div className="ouija-board relative">
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
