import { CloseIcon } from '../icons/CloseIcon';

interface ErrorDisplayProps {
  errorMessage: string | null;
  onDismiss: () => void;
}

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
