/**
 * SpiritNameDialog - Modal dialog for entering the spirit's name
 *
 * An atmospheric modal with:
 * - Animated entrance/exit transitions using react-spring
 * - Animated mist background effect
 * - Uppercase text transformation
 * - 30 character limit with counter
 * - Floating particle effects
 * - Auto-focus on input field
 *
 * @remarks
 * Dialog is submitted by pressing Enter. Input is cleared when dialog
 * becomes visible again after a rejection.
 */

import { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { SpiritFilters } from './SpiritFilters';

/**
 * Props for the SpiritNameDialog component
 */
interface SpiritNameDialogProps {
  /** Callback when name is submitted */
  onSubmit: (name: string) => void;
  /** Whether the dialog should be visible */
  isVisible: boolean;
}

/**
 * Decorative floating particles, generated once at module load.
 *
 * @remarks
 * Computed outside render so the random positions/timings stay stable across
 * re-renders (previously they were re-randomized every render, making the
 * particles jump) and so render stays pure per the rules of React.
 */
const PARTICLES = Array.from({ length: 8 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 2}s`,
}));

/**
 * Renders a modal dialog for entering the spirit's name
 *
 * @param props - Component props
 * @returns JSX element with animated modal dialog, or null if not visible
 */
export function SpiritNameDialog({
  onSubmit,
  isVisible,
}: SpiritNameDialogProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Dialog entrance animation
  const dialogSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'scale(1) translateY(0%)'
      : 'scale(0.8) translateY(10%)',
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

  // Clear the input when the dialog transitions into view (e.g. after a
  // rejected name). Adjusting state during render on a prop change is the
  // React-recommended alternative to resetting state inside an effect.
  const [wasVisible, setWasVisible] = useState(isVisible);
  if (isVisible !== wasVisible) {
    setWasVisible(isVisible);
    if (isVisible) {
      setName('');
    }
  }

  useEffect(() => {
    // Auto-focus input when dialog appears
    if (isVisible) {
      inputRef.current?.focus();
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

  // Always render, but control visibility with opacity and spring animation
  if (!isVisible) return null; // Actually let's keep it simple and return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Atmospheric backdrop with animated mist */}
      <animated.div
        style={smokeSpring}
        className="absolute inset-0 bg-black/90"
      />

      {/* SVG filters for visual effects */}
      <SpiritFilters />

      {/* Dialog Box */}
      <animated.div
        style={dialogSpring}
        className="relative w-full max-w-2xl px-4 sm:px-8"
      >
        {/* Ornate border frame */}
        <div className="spirit-dialog-container">
          {/* Corner decorations */}
          <div className="spirit-dialog-corner spirit-dialog-corner-tl" />
          <div className="spirit-dialog-corner spirit-dialog-corner-tr" />
          <div className="spirit-dialog-corner spirit-dialog-corner-bl" />
          <div className="spirit-dialog-corner spirit-dialog-corner-br" />

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Question text with supernatural styling */}
            <div className="text-center">
              <h2 className="spirit-dialog-title text-glow">
                With whom would you
                <br />
                like to speak today?
              </h2>
              <p className="spirit-dialog-subtitle">
                Enter the name of a departed soul...
              </p>
            </div>

            {/* Input field with blinking cursor effect */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                maxLength={30}
                className="spirit-input-field"
                placeholder=""
                autoComplete="off"
                spellCheck={false}
              />

              {/* Character counter */}
              <div className="spirit-input-counter">{name.length}/30</div>
            </div>

            {/* Submit button (hidden, activated by Enter key) */}
            <button type="submit" className="hidden" aria-label="Submit name" />

            {/* Instructions - clickable to submit */}
            <div
              className="spirit-input-instructions cursor-pointer hover:opacity-100 transition-opacity"
              onClick={handleSubmit}
            >
              Press <span className="font-bold">ENTER</span> to summon
            </div>
          </form>

          {/* Animated particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            {PARTICLES.map((particle, i) => (
              <div
                key={i}
                className="spirit-dialog-particle"
                style={particle}
              />
            ))}
          </div>
        </div>
      </animated.div>
    </div>
  );
}
