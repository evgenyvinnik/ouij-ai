import { useMutation } from '@tanstack/react-query';
import { useOuijaStore } from '../state/useOuijaStore';
import { sendChatMessage } from '../api/chatClient';
import { Message } from '../types/ouija';

interface ChatMutationVariables {
  message: string;
  history: Message[];
  spiritName?: string;
}

/**
 * Hook for AI chat with SSE streaming using TanStack Query
 */
export function useAIChat() {
  const { queueLetters, addToHistory, setTurn, clearAnimation, setError } =
    useOuijaStore();

  const mutation = useMutation({
    mutationFn: async ({
      message,
      history,
      spiritName,
    }: ChatMutationVariables) => {
      let assistantResponse = '';

      await sendChatMessage(
        { message, history, spiritName },
        {
          onToken: (token) => {
            assistantResponse += token;
          },
          onLetters: (letters) => {
            // Queue letters for animation
            queueLetters(letters);
            // Add assistant message to history
            addToHistory({
              role: 'assistant',
              content: letters.join(''),
            });
          },
          onDone: () => {
            // Animation will handle turn change
          },
          onError: (error) => {
            console.error('Chat error:', error);
            setError(error);
            setTurn('user');
            clearAnimation();
          },
        }
      );

      return assistantResponse;
    },
  });

  return mutation;
}
