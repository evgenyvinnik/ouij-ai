interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  spiritName: string | null;
}

export function ChatMessage({ role, content, spiritName }: ChatMessageProps) {
  return (
    <div className={role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}>
      <div className={`chat-bubble ${role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
        {/* Role label */}
        <div className={`chat-role-label ${role === 'user' ? 'chat-role-label-user' : 'chat-role-label-assistant'}`}>
          {role === 'user' ? 'You' : spiritName || 'Spirit'}
        </div>

        {/* Message content */}
        <p className="chat-message-content">
          {content}
        </p>
      </div>
    </div>
  );
}
