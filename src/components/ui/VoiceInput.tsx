import { useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useOuijaStore } from '../../state/useOuijaStore';

interface VoiceInputProps {
  onTranscript?: (transcript: string) => void;
  disabled?: boolean;
}

/**
 * Voice input component for the Ouija board.
 * Allows users to speak their questions to communicate with the spirits.
 */
export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const { turn, submitQuestion, addToHistory } = useOuijaStore();
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const isUserTurn = turn === 'user';
  const isDisabled = disabled || !isUserTurn;

  // Submit transcript when listening stops and we have content
  useEffect(() => {
    if (!isListening && transcript.trim() && isUserTurn) {
      const message = transcript.trim();
      submitQuestion(message);
      addToHistory({
        role: 'user',
        content: message,
      });
      resetTranscript();
      onTranscript?.(message);
    }
  }, [
    isListening,
    transcript,
    isUserTurn,
    submitQuestion,
    addToHistory,
    resetTranscript,
    onTranscript,
  ]);

  const handleToggleListening = useCallback(() => {
    if (isDisabled) return;

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  }, [isDisabled, isListening, stopListening, resetTranscript, startListening]);

  // Don't render if speech recognition is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Microphone Button */}
      <button
        onClick={handleToggleListening}
        disabled={isDisabled}
        className={`
          relative flex h-14 w-14 items-center justify-center rounded-full
          transition-all duration-300
          ${
            isListening
              ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.7)]'
              : 'bg-[#958219] hover:bg-[#968a47] hover:shadow-[0_0_15px_#5c533b]'
          }
          ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        style={{
          border: '2px solid rgba(0, 0, 0, 0.3)',
        }}
        title={
          isDisabled
            ? 'Wait for the spirits to finish'
            : isListening
              ? 'Stop listening'
              : 'Speak your question'
        }
      >
        {/* Microphone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-7 w-7 text-white ${isListening ? 'animate-pulse' : ''}`}
        >
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
          <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z" />
        </svg>

        {/* Recording indicator pulse */}
        {isListening && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red-600 opacity-30"></span>
        )}
      </button>

      {/* Status Text */}
      <div
        className="text-center"
        style={{
          fontFamily: 'Kingthings Trypewriter 2, monospace',
          fontSize: 'clamp(0.75rem, 1vw, 1rem)',
          minHeight: '1.5em',
        }}
      >
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : isListening ? (
          <span className="text-ouija-gold animate-pulse">
            {interimTranscript || 'Listening...'}
          </span>
        ) : (
          <span className="text-ouija-gold opacity-60">
            {isUserTurn ? 'Click to speak' : 'Wait for spirits...'}
          </span>
        )}
      </div>
    </div>
  );
}
