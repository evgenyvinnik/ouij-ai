import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from '../types/speech.d';

/**
 * Return value from the useSpeechRecognition hook
 */
interface UseSpeechRecognitionReturn {
  /** Whether speech recognition is currently active and listening */
  isListening: boolean;
  /** Final transcript (completed speech that won't change) */
  transcript: string;
  /** Interim transcript (in-progress speech that may change) */
  interimTranscript: string;
  /** Whether the browser supports the Web Speech API */
  isSupported: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Start listening for speech input */
  startListening: () => void;
  /** Stop listening for speech input */
  stopListening: () => void;
  /** Clear all transcript data */
  resetTranscript: () => void;
}

/**
 * Custom hook for browser-based speech recognition using the Web Speech API
 *
 * @returns Speech recognition state and control functions
 *
 * @remarks
 * This hook provides voice input functionality for the Ouija board,
 * allowing users to speak their questions instead of typing them.
 *
 * Browser support:
 * - Chrome/Edge: Full support
 * - Safari: Full support (using webkitSpeechRecognition)
 * - Firefox: Limited/no support
 * - Check `isSupported` before showing voice input UI
 *
 * Configuration:
 * - Language: 'en-US' (English)
 * - Continuous: false (stops after first result)
 * - Interim results: true (shows in-progress transcription)
 * - Max alternatives: 1 (only best guess)
 *
 * Transcript handling:
 * - `transcript`: Accumulates all final (completed) speech
 * - `interimTranscript`: Shows current in-progress speech
 * - Final results are appended to transcript
 * - Interim results replace interimTranscript each time
 *
 * Error handling:
 * - Provides user-friendly error messages for common issues
 * - Handles microphone permission denial
 * - Handles network errors and service unavailability
 * - Sets `isListening` to false on error
 *
 * Side effects:
 * - Initializes SpeechRecognition instance on mount (if supported)
 * - Registers event handlers (onresult, onerror, onend, onstart)
 * - Cleans up by aborting recognition on unmount
 *
 * @example
 * ```tsx
 * function VoiceInput() {
 *   const {
 *     isSupported,
 *     isListening,
 *     transcript,
 *     interimTranscript,
 *     error,
 *     startListening,
 *     stopListening,
 *     resetTranscript
 *   } = useSpeechRecognition();
 *
 *   if (!isSupported) {
 *     return <p>Voice input not supported in this browser</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={isListening ? stopListening : startListening}>
 *         {isListening ? 'Stop' : 'Start'} Listening
 *       </button>
 *       {error && <p className="error">{error}</p>}
 *       <p>Final: {transcript}</p>
 *       <p>Interim: {interimTranscript}</p>
 *       <button onClick={resetTranscript}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition}
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  /** Ref to hold SpeechRecognition instance across renders */
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  /**
   * Check browser support for Web Speech API
   *
   * @remarks
   * Checks for both standard and webkit-prefixed versions.
   * Safari uses webkitSpeechRecognition.
   */
  const isSupported =
    typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  /**
   * Initialize SpeechRecognition instance and register event handlers
   *
   * @remarks
   * This effect runs once on mount (if supported) and:
   * 1. Creates SpeechRecognition instance with configuration
   * 2. Registers event handlers for results, errors, and state changes
   * 3. Returns cleanup function to abort recognition on unmount
   *
   * Event handlers:
   * - `onresult`: Processes speech results (final and interim)
   * - `onerror`: Handles errors with user-friendly messages
   * - `onend`: Updates listening state when recognition stops
   * - `onstart`: Clears errors and updates listening state
   *
   * Dependencies: [isSupported]
   * Only runs once since isSupported never changes.
   */
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI();
    // Configuration
    recognition.continuous = false; // Stop after first result
    recognition.interimResults = true; // Show in-progress transcription
    recognition.lang = 'en-US'; // English language
    recognition.maxAlternatives = 1; // Only return best guess

    /**
     * Handler for speech recognition results
     *
     * @param event - SpeechRecognitionEvent with results array
     *
     * @remarks
     * Processes both final and interim results:
     * - Final results: Appended to transcript, won't change
     * - Interim results: Shown in interimTranscript, may change
     *
     * The results array contains all results from the session.
     * We start from resultIndex to only process new results.
     */
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      // Process results starting from the last index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Final results are stable and won't change
          finalTranscript += result[0].transcript;
        } else {
          // Interim results are in-progress and may change
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        // Append final transcript and clear interim
        setTranscript((prev) => prev + finalTranscript);
        setInterimTranscript('');
      } else {
        // Update interim transcript
        setInterimTranscript(interim);
      }
    };

    /**
     * Handler for speech recognition errors
     *
     * @param event - SpeechRecognitionErrorEvent with error type
     *
     * @remarks
     * Converts technical error codes into user-friendly messages.
     * Common errors:
     * - 'no-speech': User didn't say anything
     * - 'not-allowed': Microphone permission denied
     * - 'network': Connection issue with speech service
     * - 'audio-capture': No microphone found
     *
     * Sets isListening to false on any error.
     */
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech was detected. Please try again.',
        aborted: 'Speech recognition was aborted.',
        'audio-capture':
          'No microphone was found. Please ensure a microphone is connected.',
        network: 'Network error occurred. Please check your connection.',
        'not-allowed':
          'Microphone permission was denied. Please allow access to use voice input.',
        'service-not-available': 'Speech recognition service is not available.',
        'bad-grammar': 'Speech grammar error occurred.',
        'language-not-supported': 'Language is not supported.',
      };

      setError(errorMessages[event.error] || `Error: ${event.error}`);
      setIsListening(false);
    };

    /**
     * Handler for when speech recognition ends
     * Updates listening state to reflect stopped status
     */
    recognition.onend = () => {
      setIsListening(false);
    };

    /**
     * Handler for when speech recognition starts
     * Clears any previous errors and updates listening state
     */
    recognition.onstart = () => {
      setError(null);
      setIsListening(true);
    };

    recognitionRef.current = recognition;

    // Cleanup: abort recognition on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  /**
   * Start listening for speech input
   *
   * @remarks
   * Attempts to start speech recognition. Does nothing if:
   * - Already listening (prevents multiple simultaneous sessions)
   * - Recognition instance not initialized
   *
   * Clears error state and interim transcript before starting.
   * Catches and ignores errors from calling start() when already running
   * (handled by onstart/onend event handlers).
   *
   * Dependencies: [isListening]
   * Recreated when listening state changes.
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setError(null);
    setInterimTranscript('');

    try {
      recognitionRef.current.start();
    } catch {
      // Speech recognition may already be running - this is expected in some edge cases
      // The onstart/onend handlers will manage the listening state correctly
    }
  }, [isListening]);

  /**
   * Stop listening for speech input
   *
   * @remarks
   * Stops active speech recognition session. Does nothing if:
   * - Not currently listening
   * - Recognition instance not initialized
   *
   * The onend handler will update isListening state when stopping completes.
   *
   * Dependencies: [isListening]
   * Recreated when listening state changes.
   */
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    recognitionRef.current.stop();
  }, [isListening]);

  /**
   * Clear all transcript data
   *
   * @remarks
   * Resets both final transcript and interim transcript to empty strings.
   * Does not affect listening state.
   * Useful when user wants to start a new question from scratch.
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
