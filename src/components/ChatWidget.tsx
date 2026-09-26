import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

type Message = { role: 'user' | 'model'; text: string };

// Last-resort text if the greeting call itself fails (network error, quota) —
// the one place a fixed string is unavoidable, since the widget must still open.
const FALLBACK_GREETING = "Hey, I'm Nitin's personal assistant — ask me anything about him or his work.";

// A sentinel, not a real question — tells the model to produce a fresh,
// characterful opening line instead of answering a literal message. A random
// style hint rides along so the *shape* of the greeting actually varies each
// time, not just its word choice (sampling temperature alone wasn't enough —
// the model kept converging on "Hey there…" regardless).
const GREET_TRIGGER = '__GREET__';
const GREETING_HINTS = [
  'lead with a question for the visitor',
  "open by name-dropping one specific project of Nitin's",
  "keep it very short and casual, almost just a quick hello",
  "open with a line about Nitin's curiosity or how he likes building things",
  'be a little playful or witty in the opening line',
  'open by asking what brought the visitor to the site',
];

export function ChatWidget({ introFinished }: { introFinished?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [greetingLoading, setGreetingLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, greetingLoading, open]);

  const toggleOpen = useCallback(() => {
    setOpen((wasOpen) => {
      const willOpen = !wasOpen;
      // Only fetch a new greeting for a fresh, empty chat — never mid-conversation.
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
          .then((data) => setGreeting(typeof data?.reply === 'string' ? data.reply : FALLBACK_GREETING))
          .catch(() => setGreeting(FALLBACK_GREETING))
          .finally(() => setGreetingLoading(false));
      }
      return willOpen;
    });
  }, [messages.length]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setError(null);
    const historyForRequest = messages;
    setMessages((cur) => [...cur, { role: 'user', text }]);
    setSending(true);
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
      setSending(false);
    }
  }, [input, sending, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!introFinished) return null;

  return (
    <>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Chat with Nitin's personal assistant"
            className="fixed bottom-24 right-6 z-[140] w-[min(360px,calc(100vw-2rem))] h-[min(520px,calc(100vh-8rem))] bg-[#111] border border-light/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-light/10 bg-[#0d0d0d]">
              <span className="font-sans text-[11px] tracking-[0.25em] font-bold uppercase text-light/60">Ask about Nitin</span>
            </div>

            <div ref={listRef} data-lenis-prevent className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {greetingLoading && !greeting && (
                <div className="flex items-center gap-2 text-light/50 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking…
                </div>
              )}
              {greeting && <ChatBubble role="model" text={greeting} />}
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} />
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-light/50 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking…
                </div>
              )}
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="p-3 border-t border-light/10 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask something…"
                className="flex-grow resize-none bg-light/5 border border-light/10 rounded-xl px-3 py-2 text-sm text-light placeholder:text-light/40 focus:outline-none focus:border-accent/60 max-h-24"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
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

function ChatBubble({ role, text }: Message) {
  const isUser = role === 'user';
  return (
    <div
      className={cn(
        'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
        isUser ? 'self-end bg-accent text-dark rounded-br-sm' : 'self-start bg-light/[0.06] text-light/90 rounded-bl-sm',
      )}
    >
      {text}
    </div>
  );
}
