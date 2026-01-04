/**
 * ChatInput - Input controls for sending messages to the spirit
 *
 * Provides text input with:
 * - Keyboard submission (Enter key)
 * - Speech recognition button (when supported)
 * - Send button
 * - Voice feedback display
 * - Error messaging
 *
 * @remarks
 * Input is disabled during spirit's turn and while listening.
 * Shows interim transcript while speech recognition is active.
 */

import { useRef, useCallback } from 'react';
import { MicrophoneIcon } from '../icons/MicrophoneIcon';
import { SendIcon } from '../icons/SendIcon';

/**
 * Props for the ChatInput component
 */
interface ChatInputProps {
  /** Current text input value */
  inputText: string;
  /** Callback to update input text */
  setInputText: (text: string) => void;
  /** Whether it's the user's turn to send a message */
  isUserTurn: boolean;
  /** Whether the send button should be enabled */
  canSend: boolean;
  /** Callback when send button is clicked or Enter is pressed */
  onSend: () => void;
  /** Whether speech recognition is currently active */
  isListening: boolean;
  /** Interim transcript from speech recognition */
  interimTranscript: string;
  /** Whether speech recognition is supported in this browser */
  isSpeechSupported: boolean;
  /** Callback to toggle speech recognition on/off */
  onToggleListening: () => void;
  /** Error message from speech recognition, if any */
  speechError: string | null;
}

/**
 * Renders the chat input area with text and voice input options
 *
 * @param props - Component props
 * @returns JSX element containing the input controls
 */
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
          maxLength={100}
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
