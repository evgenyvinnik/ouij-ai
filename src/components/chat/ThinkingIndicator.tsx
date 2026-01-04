/**
 * ThinkingIndicator - Animated indicator showing spirit activity
 *
 * Displays an animated "thinking" bubble with pulsing dots when the spirit
 * is generating a response or the planchette is animating.
 */

/**
 * Props for the ThinkingIndicator component
 */
interface ThinkingIndicatorProps {
  /** Current turn state determining visibility and message */
  turn: 'user' | 'spirit' | 'animating';
}

/**
 * Renders a thinking indicator during spirit activity
 *
 * @param props - Component props
 * @returns JSX element with animated thinking indicator, or null if user's turn
 */
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
