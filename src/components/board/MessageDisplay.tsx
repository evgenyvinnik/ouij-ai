import { useOuijaStore } from '../../state/useOuijaStore';
import { zalgoifyLight } from '../../utils/zalgo';

export function MessageDisplay() {
  const { animation, turn } = useOuijaStore();

  const revealedMessage = animation.revealedLetters.join('');
  const displayMessage = revealedMessage ? zalgoifyLight(revealedMessage) : '';

  return (
    <>
      {/* Spirit's message display - bottom edge of board */}
      {(turn === 'animating' || displayMessage) && (
        <div
          className="spirit-message absolute text-center"
          style={{
            bottom: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            letterSpacing: '0.3em',
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .spirit-message {
                bottom: -8% !important;
              }
              .spirit-message .message-text {
                font-size: 5vw !important;
              }
            }
            @media (min-width: 1024px) {
              .spirit-message {
                bottom: -5% !important;
              }
            }
          `}</style>
          <div
            className="message-text relative uppercase"
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
    </>
  );
}
