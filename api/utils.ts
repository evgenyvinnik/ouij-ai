/**
 * Format data for Server-Sent Events (SSE)
 */
export function formatSSE(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500); // Limit length
}

/**
 * Validate message contains only valid Ouija board characters
 */
export function validateMessage(message: string): string {
  // Allow letters, numbers, spaces, and basic punctuation
  const cleaned = message
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .slice(0, 50);
  return cleaned;
}
