import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Send } from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Bot identity ────────────────────────────────────────────────────────────
const BOT_NAME = 'Jill Valentine';
const BOT_INITIAL = BOT_NAME.charAt(0); // "J"

type Message = { role: 'user' | 'model'; text: string };

const FALLBACK_GREETING =
  "Hey! I'm Jill Valentine — Nitin's personal AI. Ask me anything about him or his work.";

const GREET_TRIGGER = '__GREET__';
const GREETING_HINTS = [
  'end by asking what they want to know about Nitin',
  'end by asking what brought them to the site today',
  "end by mentioning one of Nitin's projects and asking if they want to hear more",
  "end by asking what they're curious about",
  'end with a playful invite like asking what they want to dig into',
  "end by asking if they want to know about Nitin's work, skills, or something else",
];

// ─── Animated typing dots ────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-light/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Bot avatar circle ────────────────────────────────────────────────────────
function BotAvatar({ small = false }: { small?: boolean }) {
  return (
    <div
      className={cn(
        'shrink-0 rounded-full bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center font-bold text-dark select-none',
        small ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm',
      )}
    >
      {BOT_INITIAL}
    </div>
  );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function ChatBubble({
  role,
  text,
  statusLabel,
}: Message & { statusLabel?: string }) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
      {!isUser && (
        <div className="flex items-end gap-2">
          <BotAvatar small />
          <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-light/[0.07] text-light/90">
            {text}
          </div>
        </div>
      )}
      {isUser && (
        <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap bg-accent text-dark">
          {text}
        </div>
      )}
      {/* Status label — animates between "Not seen yet" and "Read" */}
      <AnimatePresence mode="wait">
        {isUser && statusLabel && (
          <motion.p
            key={statusLabel}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'text-[10px] pr-0.5',
              statusLabel.startsWith('Read') ? 'text-emerald-400/70' : 'text-light/35',
            )}
          >
            {statusLabel}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export function ChatWidget({ introFinished }: { introFinished?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [msgStatus, setMsgStatus] = useState<'sent' | 'read' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [greetingLoading, setGreetingLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const readTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, msgStatus, greetingLoading, open]);

  const toggleOpen = useCallback(() => {
    setOpen((wasOpen) => {
      const willOpen = !wasOpen;
      if (willOpen && messages.length === 0) {
        setGreeting(null);
        setGreetingLoading(true);
        const hint = GREETING_HINTS[Math.floor(Math.random() * GREETING_HINTS.length)];
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `${GREET_TRIGGER}::${hint}`, history: [] }),
        })
          .then((res) => res.json())
          .then((data) =>
            setGreeting(typeof data?.reply === 'string' ? data.reply : FALLBACK_GREETING),
          )
          .catch(() => setGreeting(FALLBACK_GREETING))
          .finally(() => setGreetingLoading(false));
      }
      return willOpen;
    });
  }, [messages.length]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || msgStatus !== null) return;
    setInput('');
    setError(null);
    const historyForRequest = messages;
    setMessages((cur) => [...cur, { role: 'user', text }]);

    // Stage 1 — "Not seen yet"
    setMsgStatus('sent');

    // Stage 2 — after 1.5 s Jill "reads" it → show typing dots
    readTimerRef.current = setTimeout(() => setMsgStatus('read'), 1500);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyForRequest }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.');
      setMessages((cur) => [...cur, { role: 'model', text: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      if (readTimerRef.current) clearTimeout(readTimerRef.current);
      setMsgStatus(null);
    }
  }, [input, msgStatus, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!introFinished) return null;

  // Index of the last user message — for the status label
  const lastUserIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return i;
    }
    return -1;
  })();

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        aria-label={open ? 'Close chat' : "Chat with Nitin's assistant"}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 right-6 z-[140] flex items-center gap-2.5 pl-4 pr-5 h-12 rounded-full bg-accent text-dark shadow-[0_10px_40px_rgba(226,255,0,0.35)] hover:bg-light transition-colors"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <X size={16} />
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase">Close</span>
            </motion.span>
          ) : (
            <motion.span
              key="ask"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dark animate-pulse" />
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase">Ask Nitin's AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Chat with Jill Valentine"
            className="fixed bottom-24 right-6 z-[140] w-[min(370px,calc(100vw-2rem))] h-[min(560px,calc(100vh-8rem))] bg-[#111] border border-light/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
          >
            {/* ── Header with avatar + name + active status ── */}
            <div className="px-4 py-3 border-b border-light/10 bg-[#0d0d0d] flex items-center gap-3">
              <div className="relative">
                <BotAvatar />
                {/* Green "active" dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-sm font-semibold text-light leading-tight">{BOT_NAME}</span>
                <span className="font-sans text-[11px] text-emerald-400 leading-tight">Active</span>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={listRef}
              data-lenis-prevent
              className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3"
            >
              {/* Greeting loading state — animated typing dots */}
              {greetingLoading && !greeting && (
                <div className="flex items-end gap-2">
                  <BotAvatar small />
                  <div className="bg-light/[0.07] rounded-2xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </div>
              )}

              {greeting && <ChatBubble role="model" text={greeting} />}

              {messages.map((m, i) => (
                <ChatBubble
                  key={i}
                  role={m.role}
                  text={m.text}
                  // Pass the current status label only on the last user message
                  statusLabel={
                    msgStatus !== null && i === lastUserIdx
                      ? msgStatus === 'sent'
                        ? 'Not seen yet · Just now'
                        : 'Read · Just now'
                      : undefined
                  }
                />
              ))}

              {/* Typing dots — only shown after Jill has "read" the message */}
              {msgStatus === 'read' && (
                <div className="flex items-end gap-2">
                  <BotAvatar small />
                  <div className="bg-light/[0.07] rounded-2xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            {/* ── Input row ── */}
            <div className="p-3 border-t border-light/10 bg-[#0d0d0d] flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Message…"
                className="flex-grow resize-none bg-light/5 border border-light/10 rounded-xl px-3 py-2 text-sm text-light placeholder:text-light/40 focus:outline-none focus:border-accent/60 max-h-24"
              />
              <button
                type="button"
                onClick={send}
              disabled={msgStatus !== null || !input.trim()}
                aria-label="Send"
                className="w-10 h-10 shrink-0 rounded-xl bg-accent text-dark flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-light transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
