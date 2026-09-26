// A lightweight abuse guard that runs ahead of every /api/chat call, protecting
// the shared Gemini free-tier quota from one visitor (or a bot) burning it for
// everyone. In-memory is a deliberate choice for a single-instance personal
// site — no external store, no extra cost, no extra moving parts.

const PER_IP_LIMIT = 15;
const PER_IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DAILY_LIMIT = 200; // well under Gemini's free-tier daily cap, as a safety margin

type Bucket = { count: number; windowStart: number };

const ipBuckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyWindowStart = Date.now();

function resetDailyIfNeeded() {
  const dayMs = 24 * 60 * 60 * 1000;
  if (Date.now() - dailyWindowStart >= dayMs) {
    dailyCount = 0;
    dailyWindowStart = Date.now();
  }
}

// Prevents unbounded memory growth from one-off visitor IPs piling up forever.
function pruneStaleBuckets() {
  const now = Date.now();
  for (const [ip, bucket] of ipBuckets) {
    if (now - bucket.windowStart >= PER_IP_WINDOW_MS) ipBuckets.delete(ip);
  }
}

export type RateLimitResult = { allowed: true } | { allowed: false; reason: 'per-ip' | 'daily' };

export function checkRateLimit(ip: string): RateLimitResult {
  resetDailyIfNeeded();
  if (dailyCount >= DAILY_LIMIT) return { allowed: false, reason: 'daily' };

  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.windowStart >= PER_IP_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
  } else {
    if (bucket.count >= PER_IP_LIMIT) return { allowed: false, reason: 'per-ip' };
    bucket.count += 1;
  }

  dailyCount += 1;
  if (ipBuckets.size > 500) pruneStaleBuckets();
  return { allowed: true };
}
