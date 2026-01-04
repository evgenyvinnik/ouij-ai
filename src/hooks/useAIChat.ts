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
  const { queueLetters, setTurn, clearAnimation, setError } = useOuijaStore();

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
            // Message will be added to history when animation completes
            queueLetters(letters);
          },
          onDone: () => {
            // Animation will handle turn change and add message to history
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
