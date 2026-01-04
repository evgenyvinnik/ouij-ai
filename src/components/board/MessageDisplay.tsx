/**
 * MessageDisplay - Displays the spirit's message with supernatural text effects
 *
 * Shows the currently revealed letters from the spirit's message with:
 * - Zalgo text distortion for spooky aesthetic
 * - Glitch effect layers
 * - Animated cursor during message animation
 *
 * @remarks
 * Only visible during animation or when a message has been revealed.
 * The zalgo effect adds diacritical marks for a supernatural appearance.
 */

import { useOuijaStore } from '../../state/useOuijaStore';
import { zalgoifyLight } from '../../utils/zalgo';

/**
 * Renders the spirit's message with glitch effects and animated cursor
 *
 * @returns JSX element containing the stylized spirit message
 */
export function MessageDisplay() {
  const { animation, turn } = useOuijaStore();

  const revealedMessage = animation.revealedLetters.join('');
  const displayMessage = revealedMessage ? zalgoifyLight(revealedMessage) : '';

  return (
    <>
      {/* Spirit's message display - centered in board */}
      {(turn === 'animating' || displayMessage) && (
        <div className="spirit-message">
          <div className="message-text" data-text={displayMessage}>
            {displayMessage}
            {turn === 'animating' && (
              <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ouija-gold"></span>
            )}
            {/* Glitch effect layers */}
            <div className="glitch-layer glitch-layer-1">{displayMessage}</div>
            <div className="glitch-layer glitch-layer-2">{displayMessage}</div>
          </div>
        </div>
      )}
    </>
  );
}
