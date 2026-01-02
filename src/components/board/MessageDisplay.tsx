import { useOuijaStore } from '../../state/useOuijaStore';
import { useOuijaSession } from '../../hooks/useOuijaSession';
import { zalgoifyLight } from '../../utils/zalgo';

export function MessageDisplay() {
  const { animation, turn } = useOuijaStore();
  const { inputBuffer, isUserTurn } = useOuijaSession();

  const revealedMessage = animation.revealedLetters.join('');
  const displayMessage = revealedMessage ? zalgoifyLight(revealedMessage) : '';

  return (
    <div className="absolute bottom-8 left-0 right-0 z-10 px-8">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* User input display */}
        {isUserTurn && (
          <div className="rounded-lg bg-ouija-dark bg-opacity-80 p-4 text-center backdrop-blur-sm">
            <p className="text-sm text-ouija-gold opacity-70">
              Ask the spirits...
            </p>
            <p className="mt-2 min-h-[1.5rem] font-vintage text-xl text-ouija-gold">
              {inputBuffer}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        )}

        {/* Spirit's message display */}
        {(turn === 'animating' || displayMessage) && (
          <div className="rounded-lg bg-ouija-dark bg-opacity-90 p-6 text-center backdrop-blur-sm">
            <p className="text-sm text-ouija-gold opacity-70">
              The spirits speak...
            </p>
            <p className="mt-3 min-h-[2rem] font-spooky text-2xl leading-relaxed text-ouija-gold">
              {displayMessage}
              {turn === 'animating' && (
                <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ouija-gold"></span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
