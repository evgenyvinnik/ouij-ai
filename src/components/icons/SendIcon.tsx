/**
 * SendIcon - SVG icon component for send/submit action
 *
 * Used in the chat input to indicate message submission.
 */

/**
 * Props for the SendIcon component
 */
interface SendIconProps {
  /** Additional CSS classes to apply to the SVG */
  className?: string;
}

/**
 * Renders a send arrow SVG icon
 *
 * @param props - Component props
 * @returns JSX element containing the send icon
 */
export function SendIcon({ className = '' }: SendIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
