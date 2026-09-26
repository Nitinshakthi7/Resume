// Vercel serverless function: POST /api/chat. This file's path under /api is
// what makes it a route — Vercel builds and deploys it automatically, no
// framework config needed. Everything it actually does lives in server/,
// which is plain, transport-agnostic logic reused here.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit } from '../server/rateLimiter';
import { generateReply, type ChatTurn } from '../server/geminiClient';

const MAX_HISTORY_TURNS = 10;
const MAX_MESSAGE_LENGTH = 2000;

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof value === 'string' && value.length) return value.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = clientIp(req);
  const limit = checkRateLimit(ip);
  if (limit.allowed === false) {
    const message =
      limit.reason === 'daily'
        ? "The chat's had a lot of visitors today and needs a short break — try again tomorrow, or just email Nitin directly."
        : "You've sent a lot of messages in a short time — give it a few minutes and try again.";
    res.status(429).json({ error: message });
    return;
  }

  // Vercel parses a JSON body into req.body automatically based on Content-Type.
  const { message, history } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: 'Invalid message.' });
    return;
  }

  const safeHistory: ChatTurn[] = Array.isArray(history)
    ? history
        .filter(
          (h): h is ChatTurn =>
            h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string' && h.text.length <= MAX_MESSAGE_LENGTH,
        )
        .slice(-MAX_HISTORY_TURNS)
    : [];

  try {
    const reply = await generateReply(safeHistory, message.trim());
    res.status(200).json({ reply });
  } catch (err) {
    console.error('[chat] Gemini call failed:', err);
    res.status(502).json({ error: "Couldn't reach the assistant right now — try again in a moment." });
  }
}
