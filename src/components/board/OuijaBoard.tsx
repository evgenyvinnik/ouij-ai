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
    <div className="ouija-board relative mx-auto h-[600px] w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl">
      {/* Background */}
      <BoardBackground />

      {/* Planchette */}
      <Planchette />

      {/* Message Display */}
      <MessageDisplay />

      {/* Atmospheric effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent to-ouija-dark opacity-50"></div>
    </div>
  );
}
