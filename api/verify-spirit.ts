import Anthropic from '@anthropic-ai/sdk';

export const config = {
  runtime: 'edge',
};

interface RequestBody {
  name: string;
}

interface VerificationResult {
  isDeceased: boolean;
  message: string;
  name: string;
}

const VERIFICATION_PROMPT = `You are a knowledgeable historian and genealogist tasked with determining if a person is deceased.

Given a name, determine:
1. If this is a real historical or contemporary person
2. If they are deceased (dead)
3. Provide a brief explanation

Guidelines:
- For famous historical figures (e.g., "Albert Einstein", "Cleopatra", "Shakespeare"), confirm they are deceased
- For obviously living people (e.g., current celebrities, politicians who are alive), state they are not deceased
- For fictional characters (e.g., "Harry Potter", "Darth Vader"), explain they are fictional
- For ambiguous or unknown names, be cautious but provide your best assessment
- For common names without context (e.g., "John Smith"), explain that you cannot verify without more information, but allow the attempt

Respond in JSON format:
{
  "isDeceased": true/false,
  "explanation": "Brief 1-2 sentence explanation"
}

Be respectful and factual in your responses.`;

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
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const name = body.name?.trim();

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const anthropic = new Anthropic({ apiKey });

    // Query Claude to verify if the person is deceased
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.3,
      system: VERIFICATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Is "${name}" a deceased person? Provide your assessment in JSON format.`,
        },
      ],
    });

    // Extract the response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    let result: { isDeceased: boolean; explanation: string };
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1] : content.text;
      result = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse verification response');
    }

    const verificationResult: VerificationResult = {
      isDeceased: result.isDeceased,
      message: result.explanation,
      name,
    };

    return new Response(JSON.stringify(verificationResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
