import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, MODEL_CONFIG } from './constants';
import { formatSSE, sanitizeInput, validateMessage } from './utils';

export const config = {
  runtime: 'edge',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  history?: Message[];
  spiritName?: string;
}

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = (await req.json()) as RequestBody;
    const userMessage = sanitizeInput(body.message);
    const history = body.history || [];
    const spiritName = body.spiritName;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const anthropic = new Anthropic({ apiKey });

    // Build system prompt with spirit name
    let systemPrompt = SYSTEM_PROMPT;
    if (spiritName) {
      systemPrompt = `${SYSTEM_PROMPT}\n\nYou are channeling the spirit of ${spiritName}. Embody their essence, knowledge, and personality while maintaining the mysterious Ouija board communication style.`;
    }

    // Build messages array from history
    const messages: Anthropic.MessageParam[] = [
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: MODEL_CONFIG.model,
            max_tokens: MODEL_CONFIG.max_tokens,
            temperature: MODEL_CONFIG.temperature,
            system: systemPrompt,
            messages,
            tools: MODEL_CONFIG.tools,
            stream: true,
          });

          let toolUseId = '';
          let toolInput = '';

          for await (const event of response) {
            // Handle text deltas
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text;
              controller.enqueue(
                encoder.encode(formatSSE('token', { token: text }))
              );
            }

            // Handle tool use start
            if (
              event.type === 'content_block_start' &&
              event.content_block.type === 'tool_use'
            ) {
              toolUseId = event.content_block.id;
            }

            // Handle tool input delta
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'input_json_delta'
            ) {
              toolInput += event.delta.partial_json;
            }

            // Handle tool use completion
            if (event.type === 'content_block_stop' && toolUseId) {
              try {
                const parsedInput = JSON.parse(toolInput);
                if (parsedInput.message) {
                  const cleanedMessage = validateMessage(parsedInput.message);
                  const letters = cleanedMessage.split('');
                  controller.enqueue(
                    encoder.encode(formatSSE('letters', { letters }))
                  );
                }
              } catch (e) {
                console.error('Failed to parse tool input:', e);
              }
              toolUseId = '';
              toolInput = '';
            }

            // Handle stream end
            if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode(formatSSE('done', {})));
              controller.close();
              return;
            }
          }

          controller.enqueue(encoder.encode(formatSSE('done', {})));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(
              formatSSE('error', {
                error:
                  error instanceof Error ? error.message : 'Unknown error',
              })
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
