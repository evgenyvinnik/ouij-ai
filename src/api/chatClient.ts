/**
 * Client-side API for communicating with the AI chat endpoint
 *
 * @remarks
 * Handles Server-Sent Events (SSE) streaming from the `/api/chat` endpoint.
 * Provides development mode fallback with mock responses when API is unavailable.
 */

import { Message } from '../types/ouija';

/**
 * Request structure for chat API
 */
interface ChatRequest {
  /** User's question to the spirit */
  message: string;
  /** Conversation history for context */
  history: Message[];
  /** Optional name of spirit being channeled */
  spiritName?: string;
}

/**
 * Callback functions for SSE events
 */
interface SSECallback {
  /** Called when a text token is received (for debugging) */
  onToken?: (token: string) => void;
  /** Called when letters to animate are received */
  onLetters?: (letters: string[]) => void;
  /** Called when streaming completes */
  onDone?: () => void;
  /** Called if an error occurs */
  onError?: (error: string) => void;
}

/**
 * Send a chat message to the AI API with SSE streaming
 *
 * @param request - Chat request with message, history, and optional spirit name
 * @param callbacks - Event callbacks for handling stream events
 *
 * @remarks
 * This function:
 * 1. POSTs the request to `/api/chat`
 * 2. Reads the SSE stream response
 * 3. Parses events (token, letters, done, error)
 * 4. Calls appropriate callbacks for each event
 *
 * In development mode, if the API fails, it falls back to mock responses
 * for testing the UI without a backend connection.
 *
 * @throws Error if request fails in production mode
 *
 * @example
 * ```ts
 * await sendChatMessage(
 *   {
 *     message: "What is your name?",
 *     history: [],
 *     spiritName: "Albert Einstein"
 *   },
 *   {
 *     onLetters: (letters) => queueLetters(letters),
 *     onDone: () => setTurn('user'),
 *     onError: (error) => setError(error)
 *   }
 * );
 * ```
 */
export async function sendChatMessage(
  request: ChatRequest,
  callbacks: SSECallback
): Promise<void> {
  // Development mode: Mock response if API is not available
  const isDevelopment = import.meta.env.DEV;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          const eventMatch = line.match(/^event: (.+)$/m);
          const dataMatch = line.match(/^data: (.+)$/m);

          if (eventMatch && dataMatch) {
            const event = eventMatch[1];
            const data = JSON.parse(dataMatch[1]);

            switch (event) {
              case 'token':
                callbacks.onToken?.(data.token);
                break;
              case 'letters':
                callbacks.onLetters?.(data.letters);
                break;
              case 'done':
                callbacks.onDone?.();
                break;
              case 'error':
                callbacks.onError?.(data.error);
                break;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    if (isDevelopment) {
      // Chat API not available in dev mode, using mock response

      // Simulate a mock spirit response
      const mockMessages = [
        'YES',
        'HELLO',
        'I AM HERE',
        'ASK ME',
        'BEYOND THE VEIL',
        'THE ANSWER IS NEAR',
        'SEEK AND FIND',
        'MYSTERIES ABOUND',
      ];

      const mockResponse =
        mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const letters = mockResponse.split('');

      // Simulate thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send letters
      callbacks.onLetters?.(letters);
      callbacks.onDone?.();
    } else {
      throw error;
    }
  }
}
