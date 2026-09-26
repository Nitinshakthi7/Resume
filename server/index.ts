import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkRateLimit } from './rateLimiter';
import { generateReply, type ChatTurn } from './geminiClient';

// Loads .env for local dev only — AI Studio/Cloud Run injects GEMINI_API_KEY
// directly into the runtime environment in production, so a missing .env
// there is expected, not an error.
try {
  process.loadEnvFile();
} catch {
  // no .env file present — fine in production
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const app = express();
app.use(express.json({ limit: '16kb' }));

const MAX_HISTORY_TURNS = 10;
const MAX_MESSAGE_LENGTH = 2000;

function clientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

app.post('/api/chat', async (req, res) => {
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
    res.json({ reply });
  } catch (err) {
    console.error('[chat] Gemini call failed:', err);
    res.status(502).json({ error: "Couldn't reach the assistant right now — try again in a moment." });
  }
});

// Production only: this process is the whole app (static files + API) behind
// one Cloud Run port. In dev, Vite serves the frontend and proxies /api here.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
