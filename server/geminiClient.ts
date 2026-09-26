import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction } from './knowledge.js';

const MODEL = 'gemini-3.5-flash-lite';

export type ChatTurn = { role: 'user' | 'model'; text: string };

// Must match the client's sentinel (src/components/ChatWidget.tsx) — a short,
// low-stakes generation (no facts to get wrong), so it gets a higher
// temperature than real Q&A to actually vary its opening line each time.
const GREET_TRIGGER = '__GREET__';

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Rebuilt on cold start / first call only — resumeData.ts doesn't change at
// runtime, so there's no need to re-serialize it on every request.
let cachedSystemInstruction: string | null = null;
function getSystemInstruction(): string {
  if (!cachedSystemInstruction) cachedSystemInstruction = buildSystemInstruction();
  return cachedSystemInstruction;
}

export async function generateReply(history: ChatTurn[], message: string): Promise<string> {
  const ai = getClient();
  const isGreeting = message.startsWith(GREET_TRIGGER);
  const effectiveMessage = isGreeting
    ? `A visitor just opened the chat — no real question yet. Write your opening greeting now. Style for this one: ${message.slice(GREET_TRIGGER.length).replace(/^::/, '') || 'just be yourself'}.`
    : message;
  const contents = [...history, { role: 'user' as const, text: effectiveMessage }].map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }));

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: getSystemInstruction(),
      // A little variety so the same question doesn't come back byte-identical;
      // greetings push higher since there's no fact-accuracy risk to balance against.
      temperature: isGreeting ? 1.4 : 0.9,
      maxOutputTokens: isGreeting ? 120 : 512,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}
