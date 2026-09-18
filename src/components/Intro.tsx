import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Apple-style "hello" sequence: each greeting is written out in a cursive
// hand, then the sequence ends on a signature of the name.
const GREETING_FONT = '"Sacramento", cursive';
const SIGNATURE_FONT = '"Mr Dafoe", cursive';

type Step = {
  text: string;
  font: string;
  write: number; // seconds to "write" the word
  hold: number; // seconds to hold once written
  signature?: boolean;
};

const STEPS: Step[] = [
  { text: 'hello', font: GREETING_FONT, write: 1.5, hold: 0.45 },
  { text: 'hola', font: GREETING_FONT, write: 0.7, hold: 0.15 },
  { text: 'bonjour', font: GREETING_FONT, write: 0.75, hold: 0.15 },
  { text: 'ciao', font: GREETING_FONT, write: 0.65, hold: 0.15 },
  { text: 'olá', font: GREETING_FONT, write: 0.65, hold: 0.15 },
  { text: 'namaste', font: GREETING_FONT, write: 0.8, hold: 0.35 },
  { text: 'Nitin M', font: SIGNATURE_FONT, write: 1.7, hold: 1.1, signature: true },
];

const FONT_SIZE = 160;

function HandwrittenWord({ step, onDone }: { step: Step; onDone: () => void }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const bbox = textRef.current?.getBBox();
    if (bbox) setBox({ x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height });
  }, []);

  const pad = step.signature ? 40 : 24;
  const flourishDrop = 0;
  const viewBox = box
    ? `${box.x - pad} ${box.y - pad} ${box.w + pad * 2} ${box.h + pad * 2 + flourishDrop}`
    : `0 0 1000 ${FONT_SIZE * 2}`;
  const aspect = box ? (box.w + pad * 2) / (box.h + pad * 2 + flourishDrop) : 3;

  // Underline flourish that sweeps beneath the signature
  const flourish = box
    ? `M ${box.x + box.w * 0.02} ${box.y + box.h * 0.8}
       C ${box.x + box.w * 0.3} ${box.y + box.h * 0.95},
         ${box.x + box.w * 0.65} ${box.y + box.h * 0.7},
         ${box.x + box.w * 1.04} ${box.y + box.h * 0.82}`
    : '';

  const height = step.signature ? 'clamp(150px, 34vw, 360px)' : 'clamp(130px, 28vw, 300px)';
  const fill = step.signature ? `url(#ink-${id})` : 'var(--color-light)';
  const totalWrite = step.write + (step.signature ? 0.55 : 0);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!box) return;
    const t = setTimeout(() => onDoneRef.current(), (totalWrite + step.hold) * 1000);
    return () => clearTimeout(t);
  }, [box, step.hold, totalWrite]);

  return (
    <motion.svg
      viewBox={viewBox}
      aria-hidden="true"
      className="block max-w-[90vw] overflow-visible"
      style={{ height, width: `calc(${height} * ${aspect})` }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.28, ease: 'easeIn' } }}
    >
      <defs>
        {/* Soft-edged reveal: a gradient bar that sweeps left to right like a pen */}
        <linearGradient id={`edge-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`ink-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#F5F2ED" />
          <stop offset="0.55" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#E2FF00" />
        </linearGradient>
        {box && (
          <mask id={`reveal-${id}`} maskUnits="userSpaceOnUse">
            <motion.rect
              x={box.x - pad}
              y={box.y - pad}
              height={box.h + pad * 2 + flourishDrop}
              fill={`url(#edge-${id})`}
              initial={{ width: 0 }}
              animate={{ width: (box.w + pad * 2) * 1.2 }}
              transition={{ duration: step.write, ease: [0.45, 0.05, 0.4, 1] }}
            />
          </mask>
        )}
      </defs>

      <g mask={box ? `url(#reveal-${id})` : undefined} style={{ opacity: box ? 1 : 0 }}>
        <motion.text
          ref={textRef}
          x={0}
          y={FONT_SIZE}
          fontFamily={step.font}
          fontSize={FONT_SIZE}
          fill={fill}
          stroke={fill}
          strokeWidth={1.2}
          strokeDasharray={1200}
          initial={{ strokeDashoffset: 1200, fillOpacity: 0 }}
          animate={box ? { strokeDashoffset: 0, fillOpacity: 1 } : undefined}
          transition={{
            strokeDashoffset: { duration: step.write, ease: 'easeOut' },
            fillOpacity: { duration: step.write * 0.7, delay: step.write * 0.2, ease: 'easeOut' },
          }}
        >
          {step.text}
        </motion.text>
      </g>

      {step.signature && box && (
        <motion.path
          d={flourish}
          fill="none"
          stroke={`url(#ink-${id})`}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: step.write * 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </motion.svg>
  );
}

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const steps = useRef<Step[]>(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? [{ ...STEPS[STEPS.length - 1], write: 0.01 }]
      : STEPS,
  ).current;

  // Don't start writing until the script fonts are in, or the glyphs get
  // measured in the fallback font. Cap the wait so a slow CDN can't block.
  useEffect(() => {
    let cancelled = false;
    const load = Promise.all([
      document.fonts.load(`${FONT_SIZE}px "Sacramento"`),
      document.fonts.load(`${FONT_SIZE}px "Mr Dafoe"`),
    ]);
    const timeout = new Promise((r) => setTimeout(r, 2000));
    Promise.race([load, timeout]).finally(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const next = useCallback(() => {
    if (index >= steps.length - 1) onComplete();
    else setIndex(index + 1);
  }, [index, steps.length, onComplete]);

  // Enter / Escape / Space skips straight to the site
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onComplete();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onComplete]);

  const step = steps[index];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-dark text-light"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      role="presentation"
    >
      {/* Faint ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_60%)]" />

      <div className="relative flex items-center justify-center min-h-[40vh]">
        {fontsReady && (
          <AnimatePresence mode="wait">
            <HandwrittenWord key={index} step={step} onDone={next} />
          </AnimatePresence>
        )}
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-8 right-6 md:right-12 font-sans text-[11px] tracking-[0.3em] uppercase text-light/50 hover:text-accent transition-colors"
      >
        Skip intro
      </button>

      {/* Step progress */}
      <div className="absolute bottom-10 left-6 md:left-12 flex gap-1.5" aria-hidden="true">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-[2px] rounded-full transition-all duration-500 ${
              i < index ? 'w-4 bg-light/40' : i === index ? 'w-8 bg-accent' : 'w-4 bg-light/10'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
