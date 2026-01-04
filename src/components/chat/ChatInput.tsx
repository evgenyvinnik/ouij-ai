import { useRef, useCallback } from 'react';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isUserTurn: boolean;
  canSend: boolean;
  onSend: () => void;
  isListening: boolean;
  interimTranscript: string;
  isSpeechSupported: boolean;
  onToggleListening: () => void;
  speechError: string | null;
}

export function ChatInput({
  inputText,
  setInputText,
  isUserTurn,
  canSend,
  onSend,
  isListening,
  interimTranscript,
  isSpeechSupported,
  onToggleListening,
  speechError,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className="chat-input-area">
      <div className="chat-input-group">
        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={isListening && interimTranscript ? interimTranscript : inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isUserTurn || isListening}
          placeholder={isUserTurn ? 'Ask the spirits...' : 'Wait for the spirits...'}
          className="chat-input-field"
        />

        {/* Microphone Button */}
        {isSpeechSupported && (
          <button
            onClick={onToggleListening}
            disabled={!isUserTurn}
            className={`
              chat-mic-btn
              ${isListening ? 'chat-mic-btn-listening' : 'chat-mic-btn-idle'}
              ${!isUserTurn ? 'chat-mic-btn-disabled' : 'chat-mic-btn-enabled'}
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
              className={`chat-mic-icon ${isListening ? 'chat-mic-icon-listening' : ''}`}
            >
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
              <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z" />
            </svg>
            {isListening && (
              <span className="chat-mic-ping"></span>
            )}
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`
            chat-send-btn
            ${canSend ? 'chat-send-btn-enabled' : 'chat-send-btn-disabled'}
          `}
          title="Send message (Enter)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="chat-send-icon"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Voice feedback */}
      {speechError && (
        <p className="chat-voice-error">
          {speechError}
        </p>
      )}
      {isListening && (
        <p className="chat-voice-listening">
          Listening... {interimTranscript && `"${interimTranscript}"`}
        </p>
      )}
    </div>
  );
}
