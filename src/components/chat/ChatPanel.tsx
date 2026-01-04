import { useRef, useEffect, useState, useCallback } from 'react';
import { useOuijaStore } from '../../state/useOuijaStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Button } from '../ui/Button';

export function ChatPanel() {
  const { conversationHistory, resetSession, turn, userMessage, submitQuestion, addToHistory, spiritName, errorMessage, setError } = useOuijaStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, turn, userMessage]);

  // Submit transcript when listening stops
  useEffect(() => {
    if (!isListening && transcript.trim() && isUserTurn) {
      const message = transcript.trim();

      // Add to history only if it's not a duplicate
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      if (!lastMessage || lastMessage.role !== 'user' || lastMessage.content !== message) {
        addToHistory({
          role: 'user',
          content: message,
        });
      }

      submitQuestion(message);
      resetTranscript();
    }
  }, [isListening, transcript, isUserTurn, submitQuestion, addToHistory, resetTranscript, conversationHistory]);

  const handleSendMessage = useCallback(() => {
    if (!canSend) return;

    const message = inputText.trim();

    // Add to history only if it's not a duplicate
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (!lastMessage || lastMessage.role !== 'user' || lastMessage.content !== message) {
      addToHistory({
        role: 'user',
        content: message,
      });
    }

    submitQuestion(message);
    setInputText('');

    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [canSend, inputText, submitQuestion, addToHistory, conversationHistory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleToggleListening = useCallback(() => {
    if (!isUserTurn) return;

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  }, [isUserTurn, isListening, stopListening, resetTranscript, startListening]);

  // Always show the chat panel
  const showPanel = true;

  if (!showPanel) {
    return null;
  }

  return (
    <div
      className="chat-panel relative flex flex-col overflow-hidden rounded-lg shadow-2xl backdrop-blur-md"
      style={{
        background: 'linear-gradient(135deg, rgba(61, 40, 23, 0.9), rgba(10, 10, 10, 0.95))',
        maxHeight: '400px',
        border: '2px solid rgba(211, 84, 0, 0.3)',
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .chat-panel {
            max-height: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
          }
        }
        @media (min-width: 1200px) {
          .chat-panel {
            background: linear-gradient(135deg, rgba(61, 40, 23, 0.85), rgba(10, 10, 10, 0.9)) !important;
            backdrop-filter: blur(20px) !important;
          }
        }
      `}</style>
      {/* Background mystical effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ouija-gold/5 via-transparent to-ouija-wood/10 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-24 h-24 bg-ouija-gold/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-ouija-gold/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-ouija-gold/20 bg-black/30 px-4 py-3">
        <h3
          className="text-glow"
          style={{
            fontFamily: 'Carnivalee Freakshow, cursive',
            fontSize: '1.5rem',
            color: '#d35400',
            letterSpacing: '0.25em',
          }}
        >
          Spirit Conversation
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetSession}
          style={{
            fontFamily: 'Kingthings Trypewriter 2, monospace',
            color: '#d35400',
            fontSize: '0.875rem',
          }}
        >
          New séance
        </Button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="relative z-10 flex-1 space-y-3 overflow-y-auto p-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d35400 rgba(0,0,0,0.3)',
        }}
      >
        {conversationHistory.length === 0 && !userMessage && (
          <div className="flex h-full items-center justify-center">
            <p
              style={{
                fontFamily: 'Kingthings Trypewriter 2, monospace',
                fontSize: '1rem',
                color: '#fbedc8',
                opacity: 0.5,
                textAlign: 'center',
              }}
            >
              Type your question or use the microphone to commune with the spirits...
            </p>
          </div>
        )}

        {conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                msg.role === 'user'
                  ? 'rounded-br-none'
                  : 'rounded-bl-none'
              }`}
              style={{
                background:
                  msg.role === 'user'
                    ? 'linear-gradient(135deg, rgba(211, 84, 0, 0.3), rgba(211, 84, 0, 0.2))'
                    : 'linear-gradient(135deg, rgba(251, 237, 200, 0.15), rgba(251, 237, 200, 0.1))',
                border: `1px solid ${
                  msg.role === 'user'
                    ? 'rgba(211, 84, 0, 0.4)'
                    : 'rgba(251, 237, 200, 0.2)'
                }`,
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Role label */}
              <div
                className="mb-1 text-xs font-bold uppercase tracking-wider opacity-70"
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  color: msg.role === 'user' ? '#ff9933' : '#fbedc8',
                }}
              >
                {msg.role === 'user' ? 'You' : spiritName || 'Spirit'}
              </div>

              {/* Message content */}
              <p
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#fbedc8',
                  wordWrap: 'break-word',
                }}
              >
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {(turn === 'spirit' || turn === 'animating') && (
          <div className="flex justify-center">
            <div
              className="rounded-full px-6 py-3 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(211, 84, 0, 0.3), rgba(211, 84, 0, 0.2))',
                border: '2px solid rgba(211, 84, 0, 0.5)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 20px rgba(211, 84, 0, 0.3), inset 0 0 20px rgba(211, 84, 0, 0.1)',
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-ouija-gold shadow-lg" style={{ animationDelay: '0ms', boxShadow: '0 0 10px #d35400' }}></div>
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-ouija-gold shadow-lg" style={{ animationDelay: '150ms', boxShadow: '0 0 10px #d35400' }}></div>
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-ouija-gold shadow-lg" style={{ animationDelay: '300ms', boxShadow: '0 0 10px #d35400' }}></div>
                </div>
                <span
                  className="italic"
                  style={{
                    fontFamily: 'Carnivalee Freakshow, cursive',
                    fontSize: '1.1rem',
                    color: '#d35400',
                    textShadow: '0 0 10px rgba(211, 84, 0, 0.5)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {turn === 'spirit' ? 'Summoning...' : 'Speaking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-ouija-gold/20 bg-black/40 p-3">
        <div className="flex items-center gap-2">
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={isListening && interimTranscript ? interimTranscript : inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isUserTurn || isListening}
            placeholder={isUserTurn ? "Ask the spirits..." : "Wait for the spirits..."}
            className="flex-1 rounded-lg border-2 bg-black/60 px-4 py-2 backdrop-blur-sm transition-all focus:border-ouija-gold focus:bg-black/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-ouija-gold/50"
            style={{
              fontFamily: 'Kingthings Trypewriter 2, monospace',
              fontSize: '0.95rem',
              borderColor: 'rgba(211, 84, 0, 0.4)',
              color: '#fbedc8', // Cream color for high contrast
            }}
          />

          {/* Microphone Button */}
          {isSpeechSupported && (
            <button
              onClick={handleToggleListening}
              disabled={!isUserTurn}
              className={`
                relative flex h-10 w-10 items-center justify-center rounded-full
                transition-all duration-300
                ${
                  isListening
                    ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]'
                    : 'bg-ouija-gold hover:bg-[#ff9933] hover:shadow-[0_0_10px_#d35400]'
                }
                ${!isUserTurn ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
              `}
              title={
                !isUserTurn
                  ? 'Wait for the spirits to finish'
                  : isListening
                    ? 'Stop listening'
                    : 'Speak your question'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`h-5 w-5 text-white ${isListening ? 'animate-pulse' : ''}`}
              >
                <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z" />
              </svg>
              {isListening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-600 opacity-30"></span>
              )}
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-300
              ${
                canSend
                  ? 'bg-ouija-gold hover:bg-[#ff9933] hover:shadow-[0_0_10px_#d35400] cursor-pointer'
                  : 'bg-ouija-gold/30 cursor-not-allowed'
              }
            `}
            title="Send message (Enter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-white"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {/* Voice feedback */}
        {speechError && (
          <p
            className="mt-2 text-xs text-red-400"
            style={{ fontFamily: 'Kingthings Trypewriter 2, monospace' }}
          >
            {speechError}
          </p>
        )}
        {isListening && (
          <p
            className="mt-2 animate-pulse text-xs text-ouija-gold"
            style={{ fontFamily: 'Kingthings Trypewriter 2, monospace' }}
          >
            Listening... {interimTranscript && `"${interimTranscript}"`}
          </p>
        )}

        {/* Chat/API Error Messages */}
        {errorMessage && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-900/20 p-3 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <p
                className="flex-1 text-sm leading-relaxed text-red-400"
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {errorMessage}
              </p>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                title="Dismiss error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
