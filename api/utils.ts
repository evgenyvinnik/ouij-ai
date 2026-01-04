/**
 * Format data for Server-Sent Events (SSE) protocol
 *
 * @param event - The event name (e.g., 'token', 'letters', 'done', 'error')
 * @param data - The data payload to send with the event
 * @returns Formatted SSE string with event and data fields
 *
 * @example
 * ```ts
 * formatSSE('letters', { letters: ['H', 'E', 'L', 'L', 'O'] })
 * // Returns: "event: letters\ndata: {\"letters\":[\"H\",\"E\",\"L\",\"L\",\"O\"]}\n\n"
 * ```
 */
export function formatSSE(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Sanitize user input to prevent injection attacks and excessive length
 *
 * @param input - Raw user input string
 * @returns Trimmed and length-limited string (max 500 characters)
 *
 * @remarks
 * Security measures:
 * - Trims whitespace from both ends
 * - Limits length to 500 characters to prevent DoS
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500); // Limit length
}

/**
 * Validate and clean message to contain only valid Ouija board characters
 *
 * @param message - Raw message from AI
 * @returns Cleaned message with only A-Z, 0-9, and spaces (max 50 chars)
 *
 * @remarks
 * Cleaning operations:
 * - Converts to uppercase
 * - Removes all non-alphanumeric characters except spaces
 * - Limits to 50 characters for board display
 *
 * @example
 * ```ts
 * validateMessage("Hello, World!")
 * // Returns: "HELLO WORLD"
 * ```
 */
export function validateMessage(message: string): string {
  // Allow letters, numbers, spaces, and basic punctuation
  const cleaned = message
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .slice(0, 50);
  return cleaned;
}
