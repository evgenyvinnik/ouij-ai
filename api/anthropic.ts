/**
 * Minimal fetch-based client for the Anthropic Messages API.
 *
 * @remarks
 * The official `@anthropic-ai/sdk` runtime client statically imports Node
 * built-ins (`node:fs`/`node:path`) through its credential-chain module, which
 * the Vercel Edge runtime rejects at bundle time. These edge functions only
 * ever hit a single endpoint, so we call the REST API directly with `fetch`
 * and keep the SDK for **types only** (type-only imports are erased at build,
 * so nothing from the SDK ends up in the edge bundle).
 *
 * @see https://docs.anthropic.com/en/api/messages
 */

/** Anthropic Messages API endpoint */
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/** Anthropic API version header value */
const ANTHROPIC_VERSION = '2023-06-01';

/**
 * POST a request to the Anthropic Messages API.
 *
 * @param apiKey - Anthropic API key
 * @param body - Messages API request body. Set `stream: true` to receive an
 *   SSE stream on the returned response's `body`; otherwise read `.json()`.
 * @returns The raw `fetch` {@link Response}. Callers are responsible for
 *   checking `response.ok` and consuming the body.
 */
export async function createMessage(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });
}
