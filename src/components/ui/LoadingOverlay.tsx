/**
 * LoadingOverlay - Full-screen loading indicator
 *
 * Displays a centered spinner with a custom message on a dark overlay.
 * Automatically hidden when not loading.
 */

/**
 * Props for the LoadingOverlay component
 */
interface LoadingOverlayProps {
  /** Whether the loading overlay should be visible */
  isLoading: boolean;
  /** Optional message to display below the spinner */
  message?: string;
}

/**
 * Renders a full-screen loading overlay with spinner
 *
 * @param props - Component props
 * @returns JSX element with loading overlay, or null if not loading
 */
export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ouija-dark bg-opacity-90">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-ouija-gold border-t-transparent"></div>
        <p className="text-xl text-ouija-gold">{message}</p>
      </div>
    </div>
  );
}
