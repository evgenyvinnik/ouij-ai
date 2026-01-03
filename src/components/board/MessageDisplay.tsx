import { useOuijaStore } from '../../state/useOuijaStore';
import { zalgoifyLight } from '../../utils/zalgo';

export function MessageDisplay() {
  const { animation, turn } = useOuijaStore();

  const revealedMessage = animation.revealedLetters.join('');
  const displayMessage = revealedMessage ? zalgoifyLight(revealedMessage) : '';

  return (
    <div className="pointer-events-none absolute left-0 right-0 z-10">
      {/* Spirit's message display - above board */}
      {(turn === 'animating' || displayMessage) && (
        <div
          className="absolute text-center"
          style={{
            top: '-13%',
            left: '-50%',
            width: '100vw',
            letterSpacing: '3vw',
            textIndent: '3vw',
          }}
        >
          <div
            className="relative uppercase"
            style={{
              fontSize: '2vw',
              color: '#fff',
              textShadow: '0 0 5px #d35400',
              fontFamily: 'Feral, cursive',
            }}
            data-text={displayMessage}
          >
            {displayMessage}
            {turn === 'animating' && (
              <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ouija-gold"></span>
            )}
            {/* Glitch effect layers */}
            <div
              className="absolute left-0 top-0 h-full w-full"
              style={{
                content: 'attr(data-text)',
                color: '#f3ba39',
                animation: 'glitch-effect 6s infinite',
                zIndex: -1,
              }}
            >
              {displayMessage}
            </div>
            <div
              className="absolute left-0 top-0 h-full w-full"
              style={{
                content: 'attr(data-text)',
                color: '#f3ba39',
                animation: 'glitch-effect 4s infinite',
                zIndex: -1,
              }}
            >
              {displayMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
