/**
 * Represents a position on the Ouija board as percentages
 * Used for responsive CSS positioning
 */
export interface Position {
  /** Horizontal position as percentage (0-100) */
  x: number; // percentage (0-100)
  /** Vertical position as percentage (0-100) */
  y: number; // percentage (0-100)
}

/**
 * Letter coordinates in pixels from board center
 * Source: Ported from baobabKoodaa/ouija
 */
export interface LetterCoord {
  /** Horizontal offset in pixels from center */
  x: number; // pixels from center
  /** Vertical offset in pixels from center */
  y: number; // pixels from center
}

/**
 * A conversation message between user and spirit
 */
export interface Message {
  /** The sender of the message */
  role: 'user' | 'assistant';
  /** The message text content */
  content: string;
}

/**
 * Global Zustand store state for the Ouija board application
 *
 * @remarks
 * This interface defines the complete application state including:
 * - Planchette position and rotation
 * - Animation queue and revealed letters
 * - Conversation history and turn management
 * - Session data (spirit name, intro completion)
 * - All action methods for state mutations
 */
export interface OuijaState {
  /**
   * Planchette state (position and rotation)
   */
  // Planchette
  planchette: {
    /** Current position on the board (percentage-based) */
    position: Position;
    /** Current rotation angle in degrees */
    rotation: number; // Rotation angle in degrees
  };

  /**
   * Animation state for letter-by-letter spelling
   */
  // Animation
  animation: {
    /** Whether planchette is currently animating */
    isAnimating: boolean;
    /** Queue of letters waiting to be animated */
    letterQueue: string[];
    /** Letters that have been revealed to the user */
    revealedLetters: string[];
    /** Index of the current letter being animated */
    currentLetterIndex: number;
  };

  /**
   * Game state and conversation management
   */
  // Game state
  /** Current turn: user input, spirit response, or animating */
  turn: 'user' | 'spirit' | 'animating';
  /** Current user message being typed */
  userMessage: string;
  /** Full conversation history (persisted) */
  conversationHistory: Message[];
  /** Name of the spirit being channeled (persisted) */
  spiritName: string | null;
  /** Whether user has completed intro sequence (persisted) */
  hasCompletedIntro: boolean;
  /** Current error message, if any */
  errorMessage: string | null;
  /** Timestamp of last activity for session timeout (persisted) */
  lastActivityTimestamp: number;

  /**
   * Action methods for state mutations
   */
  // Actions
  /** Move planchette to a new position with optional rotation */
  movePlanchette: (position: Position, rotation?: number) => void;
  /** Add letters to the animation queue */
  queueLetters: (letters: string[]) => void;
  /** Reveal the next letter in the queue */
  revealNextLetter: () => void;
  /** Clear all animation state */
  clearAnimation: () => void;
  /** Submit a user question */
  submitQuestion: (message: string) => void;
  /** Add a message to conversation history */
  addToHistory: (message: Message) => void;
  /** Set the current turn */
  setTurn: (turn: 'user' | 'spirit' | 'animating') => void;
  /** Set the spirit name */
  setSpiritName: (name: string) => void;
  /** Mark intro sequence as completed */
  completeIntro: () => void;
  /** Reset the entire session (new séance) */
  resetSession: () => void;
  /** Set or clear error message */
  setError: (error: string | null) => void;
}

/**
 * Server-Sent Event structure from the chat API
 *
 * @remarks
 * Event types:
 * - `token`: Individual text tokens from Claude (for debugging)
 * - `letters`: Array of letters to queue for animation
 * - `done`: Stream completion signal
 * - `error`: Error information
 */
export interface SSEEvent {
  /** The type of SSE event */
  type: 'token' | 'letters' | 'done' | 'error';
  /** Event payload data */
  data: {
    /** Individual token (for 'token' events) */
    token?: string;
    /** Array of letters to animate (for 'letters' events) */
    letters?: string[];
    /** Error message (for 'error' events) */
    error?: string;
  };
}
