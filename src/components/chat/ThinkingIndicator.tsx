interface ThinkingIndicatorProps {
  turn: 'user' | 'spirit' | 'animating';
}

export function ThinkingIndicator({ turn }: ThinkingIndicatorProps) {
  if (turn !== 'spirit' && turn !== 'animating') {
    return null;
  }

  return (
    <div className="chat-thinking-indicator">
      <div className="chat-thinking-bubble">
        <div className="chat-thinking-dots">
          <div className="chat-thinking-dots-group">
            <div className="chat-thinking-dot chat-thinking-dot-1"></div>
            <div className="chat-thinking-dot chat-thinking-dot-2"></div>
            <div className="chat-thinking-dot chat-thinking-dot-3"></div>
          </div>
          <span className="chat-thinking-text">
            {turn === 'spirit' ? 'Summoning...' : 'Speaking...'}
          </span>
        </div>
      </div>
    </div>
  );
}
