import { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';

interface SpiritNameDialogProps {
  onSubmit: (name: string) => void;
  isVisible: boolean;
}

export function SpiritNameDialog({ onSubmit, isVisible }: SpiritNameDialogProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Dialog entrance animation
  const dialogSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1) translateY(0%)' : 'scale(0.8) translateY(10%)',
    config: { tension: 180, friction: 20 },
  });

  // Smoke/mist background animation
  const smokeSpring = useSpring({
    from: { opacity: 0 },
    to: async (next) => {
      while (isVisible) {
        await next({ opacity: 0.3 });
        await next({ opacity: 0.1 });
      }
    },
    config: { duration: 3000 },
  });

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Auto-focus input when dialog appears
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      onSubmit(name.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent input if max length reached
    if (e.key !== 'Backspace' && e.key !== 'Delete' && name.length >= 30) {
      e.preventDefault();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Atmospheric backdrop with animated mist */}
      <animated.div
        style={smokeSpring}
        className="absolute inset-0 bg-black/90"
      />

      {/* SVG noise filter for texture */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="spirit-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend mode="multiply" in="SourceGraphic" />
          </filter>
          <filter id="spirit-glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Dialog Box */}
      <animated.div
        style={dialogSpring}
        className="relative w-full max-w-2xl px-8"
      >
        {/* Ornate border frame */}
        <div
          className="relative rounded-lg border-4 border-ouija-gold/40 bg-gradient-to-b from-black/95 to-ouija-dark/95 p-12 shadow-2xl"
          style={{
            filter: 'url(#spirit-glow)',
            boxShadow: `
              0 0 60px rgba(211, 84, 0, 0.4),
              inset 0 0 60px rgba(0, 0, 0, 0.8),
              0 20px 40px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          {/* Corner decorations */}
          <div className="pointer-events-none absolute -left-2 -top-2 h-8 w-8 border-l-4 border-t-4 border-ouija-gold" />
          <div className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 border-r-4 border-t-4 border-ouija-gold" />
          <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-4 border-l-4 border-ouija-gold" />
          <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-4 border-r-4 border-ouija-gold" />

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question text with supernatural styling */}
            <div className="text-center">
              <h2
                className="mb-4 text-5xl leading-tight tracking-wide text-glow"
                style={{
                  fontFamily: 'Carnivalee Freakshow, cursive',
                  color: '#d35400',
                  textShadow: `
                    0 0 20px rgba(211, 84, 0, 0.8),
                    0 0 40px rgba(211, 84, 0, 0.4)
                  `,
                }}
              >
                With whom would you
                <br />
                like to speak today?
              </h2>
              <p
                className="text-xl opacity-60"
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  color: '#d35400',
                }}
              >
                Enter the name of a departed soul...
              </p>
            </div>

            {/* Input field with blinking cursor effect */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={30}
                className="blinking-caret w-full border-b-2 border-ouija-gold/50 bg-transparent px-4 py-4 text-center text-3xl text-ouija-gold outline-none transition-all duration-300 focus:border-ouija-gold"
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  textShadow: '0 0 10px rgba(211, 84, 0, 0.6)',
                  caretColor: 'transparent', // Hide default caret, use CSS animation
                }}
                placeholder=""
                autoComplete="off"
                spellCheck={false}
              />

              {/* Character counter */}
              <div
                className="mt-2 text-right text-sm opacity-40"
                style={{
                  fontFamily: 'Kingthings Trypewriter 2, monospace',
                  color: '#d35400',
                }}
              >
                {name.length}/30
              </div>
            </div>

            {/* Submit button (hidden, activated by Enter key) */}
            <button type="submit" className="hidden" aria-label="Submit name" />

            {/* Instructions */}
            <div
              className="text-center text-sm opacity-50"
              style={{
                fontFamily: 'Kingthings Trypewriter 2, monospace',
                color: '#d35400',
              }}
            >
              Press <span className="font-bold">ENTER</span> to summon
            </div>
          </form>

          {/* Animated particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-ouija-gold/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </animated.div>

      {/* Floating particle animation */}
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px) scale(1.5);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
