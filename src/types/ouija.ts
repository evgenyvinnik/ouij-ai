export interface Position {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

export interface LetterCoord {
  x: number; // pixels from center
  y: number; // pixels from center
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface OuijaState {
  // Planchette
  planchette: {
    position: Position;
    offset: Position;
    isDragging: boolean;
    rotation: number; // Rotation angle in degrees
  };

  // Animation
  animation: {
    isAnimating: boolean;
    letterQueue: string[];
    revealedLetters: string[];
    currentLetterIndex: number;
  };

  // Game state
  turn: 'user' | 'spirit' | 'animating';
  userMessage: string;
  conversationHistory: Message[];
  spiritName: string | null;
  hasCompletedIntro: boolean;
  errorMessage: string | null;
  lastActivityTimestamp: number;

  // Actions
  movePlanchette: (position: Position, rotation?: number) => void;
  setOffset: (offset: Position) => void;
  setDragging: (isDragging: boolean) => void;
  queueLetters: (letters: string[]) => void;
  revealNextLetter: () => void;
  clearAnimation: () => void;
  submitQuestion: (message: string) => void;
  addToHistory: (message: Message) => void;
  setTurn: (turn: 'user' | 'spirit' | 'animating') => void;
  setSpiritName: (name: string) => void;
  completeIntro: () => void;
  resetSession: () => void;
  setError: (error: string | null) => void;
}

export interface SSEEvent {
  type: 'token' | 'letters' | 'done' | 'error';
  data: {
    token?: string;
    letters?: string[];
    error?: string;
  };
}
