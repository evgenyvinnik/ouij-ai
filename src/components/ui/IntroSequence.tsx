import { useState, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { SpiritNameDialog } from './SpiritNameDialog';

interface IntroSequenceProps {
  onComplete: (spiritName: string) => void;
}

interface VerificationState {
  status: 'idle' | 'verifying' | 'success' | 'rejected';
  message?: string;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [verification, setVerification] = useState<VerificationState>({ status: 'idle' });

  // Simple sequential animation approach
  const [animationPhase, setAnimationPhase] = useState<'fadeIn' | 'hold' | 'fadeOut' | 'done'>('fadeIn');

  // Single spring that handles all phases
  const titleSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: {
      opacity: animationPhase === 'fadeOut' || animationPhase === 'done' ? 0 : 1,
      scale: animationPhase === 'fadeOut' || animationPhase === 'done' ? 0.8 : 1,
    },
    config: { tension: 240, friction: 30 },
    onRest: () => {
      if (animationPhase === 'fadeIn') {
        setAnimationPhase('hold');
      } else if (animationPhase === 'fadeOut') {
        setAnimationPhase('done');
        setShowDialog(true);
      }
    },
  });

  // Handle phase transitions
  useEffect(() => {
    if (animationPhase === 'hold') {
      // Wait 1.5 seconds then fade out
      const timer = setTimeout(() => {
        setAnimationPhase('fadeOut');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  // Verification message animation
  const verificationSpring = useSpring({
    opacity: verification.status !== 'idle' ? 1 : 0,
    transform: verification.status !== 'idle' ? 'translateY(0%)' : 'translateY(10%)',
    config: { tension: 200, friction: 25 },
  });

  const handleNameSubmit = async (name: string) => {
    setVerification({ status: 'verifying', message: 'Reaching beyond the veil...' });

    try {
      // In development, if API is not available, allow all names
      const isDevelopment = import.meta.env.DEV;

      let result;
      try {
        const response = await fetch('/api/verify-spirit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        result = await response.json();
      } catch (fetchError) {
        // If in development and API fails, bypass verification
        if (isDevelopment) {
          console.warn('API not available in dev mode, bypassing verification');
          result = {
            isDeceased: true,
            message: `Channeling ${name} (dev mode - verification bypassed)`,
          };
        } else {
          throw fetchError;
        }
      }

      if (result.isDeceased) {
        setVerification({
          status: 'success',
          message: `The spirit of ${name} awaits...`,
        });

        // Wait for animation, then complete intro
        setTimeout(() => {
          onComplete(name);
        }, 2000);
      } else {
        setVerification({
          status: 'rejected',
          message: result.message || 'This soul still walks among the living. Try another name.',
        });

        // Reset after showing rejection
        setTimeout(() => {
          setVerification({ status: 'idle' });
        }, 4000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerification({
        status: 'rejected',
        message: 'The spirits are silent. Please try again.',
      });

      setTimeout(() => {
        setVerification({ status: 'idle' });
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-radial from-ouija-dark/20 to-black" />

      {/* Animated title screen */}
      {animationPhase !== 'done' && (
        <animated.div
          style={{
            opacity: titleSpring.opacity,
            transform: titleSpring.scale.to(s => `scale(${s})`),
          }}
          className="relative z-10"
        >
          <h1 className="intro-title text-center text-glow">
            OUIJ-AI
          </h1>

          {/* Pulsing glow effect */}
          <div className="intro-title-glow animate-pulse-slow" />
        </animated.div>
      )}

      {/* Spirit name dialog */}
      <SpiritNameDialog
        isVisible={showDialog && verification.status === 'idle'}
        onSubmit={handleNameSubmit}
      />

      {/* Verification status overlay */}
      {verification.status !== 'idle' && (
        <animated.div
          style={verificationSpring}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        >
          <div className="text-center">
            {/* Status message */}
            <p className={`verification-message ${
              verification.status === 'rejected' ? 'verification-message-rejected' :
              verification.status === 'success' ? 'verification-message-success' :
              'verification-message-verifying'
            }`}>
              {verification.message}
            </p>

            {/* Loading indicator for verification */}
            {verification.status === 'verifying' && (
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 animate-pulse rounded-full bg-ouija-gold"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Success indicator */}
            {verification.status === 'success' && (
              <div
                className="text-6xl text-glow"
                style={{
                  fontFamily: 'Carnivalee Freakshow, cursive',
                  color: '#d35400',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                ✧
              </div>
            )}

            {/* Rejection indicator */}
            {verification.status === 'rejected' && (
              <div
                className="text-5xl"
                style={{
                  fontFamily: 'Carnivalee Freakshow, cursive',
                  color: '#ff4444',
                  animation: 'shake 0.5s ease-in-out',
                }}
              >
                ✕
              </div>
            )}
          </div>
        </animated.div>
      )}
    </div>
  );
}
