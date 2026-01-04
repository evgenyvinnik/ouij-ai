import { useRef, useEffect, useState, useCallback } from 'react';
import { useOuijaStore } from '../../state/useOuijaStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Button } from '../ui/Button';
import { ChatMessage } from './ChatMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChatInput } from './ChatInput';
import { ErrorDisplay } from './ErrorDisplay';

export function ChatPanel() {
  const {
    conversationHistory,
    resetSession,
    turn,
    submitQuestion,
    addToHistory,
    spiritName,
    errorMessage,
    setError,
  } = useOuijaStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const isUserTurn = turn === 'user';
  const canSend = isUserTurn && inputText.trim().length > 0;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, turn]);

  // Submit transcript when listening stops
  useEffect(() => {
    if (!isListening && transcript.trim() && isUserTurn) {
      const message = transcript.trim();

      // Add to history only if it's not a duplicate
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      if (
        !lastMessage ||
        lastMessage.role !== 'user' ||
        lastMessage.content !== message
      ) {
        addToHistory({
          role: 'user',
          content: message,
        });
      }

      submitQuestion(message);
      resetTranscript();
    }
  }, [
    isListening,
    transcript,
    isUserTurn,
    submitQuestion,
    addToHistory,
    resetTranscript,
    conversationHistory,
  ]);

  const handleSendMessage = useCallback(() => {
    if (!canSend) return;

    const message = inputText.trim();

    // Add to history only if it's not a duplicate
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (
      !lastMessage ||
      lastMessage.role !== 'user' ||
      lastMessage.content !== message
    ) {
      addToHistory({
        role: 'user',
        content: message,
      });
    }

    submitQuestion(message);
    setInputText('');
  }, [canSend, inputText, submitQuestion, addToHistory, conversationHistory]);

  const handleToggleListening = useCallback(() => {
    if (!isUserTurn) return;

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  }, [isUserTurn, isListening, stopListening, resetTranscript, startListening]);

  return (
    <div className="chat-panel">
      {/* Background mystical effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ouija-gold/5 via-transparent to-ouija-wood/10 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-24 h-24 bg-ouija-gold/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-ouija-gold/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="chat-panel-header">
        <h3 className="chat-panel-title text-glow">Spirit Conversation</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetSession}
          className="chat-panel-reset-btn"
        >
          New séance
        </Button>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="chat-messages-container">
        {conversationHistory.length === 0 && (
          <div className="chat-empty-state">
            <p className="chat-empty-text">
              Type your question or use the microphone to commune with the
              spirits...
            </p>
          </div>
        )}

        {conversationHistory.map((msg, index) => (
          <ChatMessage
            key={index}
            role={msg.role}
            content={msg.content}
            spiritName={spiritName}
          />
        ))}

        <ThinkingIndicator turn={turn} />

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        isUserTurn={isUserTurn}
        canSend={canSend}
        onSend={handleSendMessage}
        isListening={isListening}
        interimTranscript={interimTranscript}
        isSpeechSupported={isSpeechSupported}
        onToggleListening={handleToggleListening}
        speechError={speechError}
      />

      {/* Error Display */}
      <div className="relative z-10 px-3 pb-3">
        <ErrorDisplay
          errorMessage={errorMessage}
          onDismiss={() => setError(null)}
        />
      </div>
    </div>
  );
}
