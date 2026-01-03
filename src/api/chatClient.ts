import { Message } from '../types/ouija';

interface ChatRequest {
  message: string;
  history: Message[];
  spiritName?: string;
}

interface SSECallback {
  onToken?: (token: string) => void;
  onLetters?: (letters: string[]) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
}

/**
 * Send a chat request to the AI API with SSE streaming
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
      console.warn('Chat API not available in dev mode, using mock response');

      // Simulate a mock spirit response
      const spiritName = request.spiritName || 'spirit';
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

      const mockResponse = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const letters = mockResponse.split('');

      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send letters
      callbacks.onLetters?.(letters);
      callbacks.onDone?.();
    } else {
      throw error;
    }
  }
}
