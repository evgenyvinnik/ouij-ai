import { useOuijaStore } from '../../state/useOuijaStore';

export function Planchette() {
  const { planchette } = useOuijaStore();
  const isAnimating = useOuijaStore((state) => state.animation.isAnimating);

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${planchette.position.x}%`,
        top: `${planchette.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: '18%',
      }}
    >
      <img
        src="/planchette2.png"
        alt="Planchette"
        className={`w-full ${isAnimating ? 'scale-110' : ''}`}
        style={{
          filter: isAnimating
            ? 'drop-shadow(5px 5px 5px rgb(255, 198, 198))'
            : 'drop-shadow(5px 5px 5px #222)',
          transform: `rotate(${planchette.rotation}deg)`,
          transition: isAnimating
            ? 'transform 0.3s ease-out, filter 0.3s ease-out, scale 0.3s ease-out'
            : 'filter 0.3s ease-out',
        }}
      />
    </div>
  );
}
