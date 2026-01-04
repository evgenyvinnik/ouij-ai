import { useRef, useCallback } from 'react';
import { MicrophoneIcon, SendIcon } from '../icons';

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
          value={
            isListening && interimTranscript ? interimTranscript : inputText
          }
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isUserTurn || isListening}
          placeholder={
            isUserTurn ? 'Ask the spirits...' : 'Wait for the spirits...'
          }
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
            <MicrophoneIcon
              className={`chat-mic-icon ${isListening ? 'chat-mic-icon-listening' : ''}`}
            />
            {isListening && <span className="chat-mic-ping"></span>}
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
          <SendIcon className="chat-send-icon" />
        </button>
      </div>

      {/* Voice feedback */}
      {speechError && <p className="chat-voice-error">{speechError}</p>}
      {isListening && (
        <p className="chat-voice-listening">
          Listening... {interimTranscript && `"${interimTranscript}"`}
        </p>
      )}
    </div>
  );
}
