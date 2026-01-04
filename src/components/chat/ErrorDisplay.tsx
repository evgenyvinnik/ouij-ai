/**
 * ErrorDisplay - Dismissible error message component
 *
 * Shows error messages with a close button. Automatically hidden when
 * no error is present.
 */

import { CloseIcon } from '../icons/CloseIcon';

/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** The error message to display, or null to hide */
  errorMessage: string | null;
  /** Callback when the dismiss button is clicked */
  onDismiss: () => void;
}

/**
 * Renders an error message with dismiss button
 *
 * @param props - Component props
 * @returns JSX element containing the error message, or null if no error
 */
export function ErrorDisplay({ errorMessage, onDismiss }: ErrorDisplayProps) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="chat-error-container">
      <div className="chat-error-content">
        <p className="chat-error-text">{errorMessage}</p>
        <button
          onClick={onDismiss}
          className="chat-error-dismiss"
          title="Dismiss error"
        >
          <CloseIcon className="chat-error-icon" />
        </button>
      </div>
    </div>
  );
}
