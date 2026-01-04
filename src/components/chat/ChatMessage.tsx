/**
 * ChatMessage - Individual message bubble in the chat conversation
 *
 * Displays a single message with appropriate styling based on the sender
 * (user or spirit/assistant).
 */

/**
 * Props for the ChatMessage component
 */
interface ChatMessageProps {
  /** The role of the message sender */
  role: 'user' | 'assistant';
  /** The text content of the message */
  content: string;
  /** Optional custom name for the spirit */
  spiritName: string | null;
}

/**
 * Renders a chat message bubble with role-specific styling
 *
 * @param props - Component props
 * @returns JSX element containing the styled message bubble
 */
export function ChatMessage({ role, content, spiritName }: ChatMessageProps) {
  return (
    <div
      className={
        role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
      }
    >
      <div
        className={`chat-bubble ${role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
      >
        {/* Role label */}
        <div
          className={`chat-role-label ${role === 'user' ? 'chat-role-label-user' : 'chat-role-label-assistant'}`}
        >
          {role === 'user' ? 'You' : spiritName || 'Spirit'}
        </div>

        {/* Message content */}
        <p className="chat-message-content">{content}</p>
      </div>
    </div>
  );
}
