import { useState } from 'react';
import { SpiritNameDialog } from './SpiritNameDialog';

interface IntroSequenceProps {
  onComplete: (spiritName: string) => void;
}

interface VerificationState {
  status: 'idle' | 'verifying' | 'success' | 'rejected';
  message?: string;
}

export function IntroSequenceSimple({ onComplete }: IntroSequenceProps) {
  const [showDialog, setShowDialog] = useState(true); // Start with dialog visible for testing
  const [verification, setVerification] = useState<VerificationState>({ status: 'idle' });

  const handleNameSubmit = async (name: string) => {
    console.log('Name submitted:', name);
    setVerification({ status: 'verifying', message: 'Reaching beyond the veil...' });

    try {
      const response = await fetch('/api/verify-spirit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      console.log('Verification result:', result);

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
      <h1 className="text-4xl text-white">Simple Intro - Testing</h1>

      <SpiritNameDialog
        isVisible={showDialog && verification.status === 'idle'}
        onSubmit={handleNameSubmit}
      />

      {/* Verification status overlay */}
      {verification.status !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="text-center">
            <p className="mb-8 text-3xl text-white">
              {verification.message}
            </p>

            {verification.status === 'verifying' && (
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 animate-pulse rounded-full bg-white"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
