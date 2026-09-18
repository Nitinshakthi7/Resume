import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { RESUME_URL } from './Navigation';

const ease = [0.16, 1, 0.3, 1] as const;

const roles = ['Full-Stack', 'AI / ML', 'Game Dev'];

// Soft light that drifts toward the cursor. Driven by motion values, so
// mouse movement never re-renders React. Skipped on touch / reduced motion.
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 240);
      y.set((e.clientY / window.innerHeight - 0.5) * 160);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="absolute top-[30%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-3xl h-[320px] rounded-full pointer-events-none blur-[110px] opacity-50 bg-gradient-to-r from-accent/10 via-gold/15 to-transparent"
    />
  );
}

export function Hero({ introFinished }: { introFinished?: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const show = introFinished ? 'show' : 'hide';

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full flex flex-col justify-center px-6 md:px-12 pt-28 pb-24 bg-dark overflow-hidden"
    >
      <CursorGlow />
      {/* Ambient glow + fine grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_75%_30%,_rgba(212,175,55,0.10)_0%,_transparent_55%)]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F5F2ED 1px, transparent 1px), linear-gradient(to bottom, #F5F2ED 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <motion.div
        style={{ y, opacity }}
        initial="hide"
        animate={show}
        className="relative w-full max-w-7xl mx-auto flex flex-col items-start justify-center z-10"
      >
        <div className="flex w-full justify-between items-end mb-12 md:mb-16 text-light/55 font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase overflow-hidden">
          <motion.div
            variants={{ hide: { y: '100%' }, show: { y: 0 } }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Portfolio — 2026
          </motion.div>
          <motion.div
            variants={{ hide: { y: '100%' }, show: { y: 0 } }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-right"
          >
            Bengaluru, IN
            <br />
            <span className="inline-flex items-center gap-2 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Open to internships
            </span>
          </motion.div>
        </div>

        <h1 className="w-full flex flex-col leading-[0.8] tracking-tighter m-0">
          <span className="sr-only">Nitin M — Full-Stack, AI/ML and Game Developer</span>
          <span className="overflow-hidden block" aria-hidden="true">
            <motion.span
              variants={{ hide: { y: '100%' }, show: { y: 0 } }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="block text-light font-display text-[15vw] md:text-[145px] uppercase font-bold"
            >
              Creative
            </motion.span>
          </span>
          <span className="overflow-hidden block pb-[0.12em]" aria-hidden="true">
            <motion.span
              variants={{ hide: { y: '100%' }, show: { y: 0 } }}
              transition={{ duration: 1, delay: 0.2, ease }}
              className="block text-gold font-serif text-[15vw] md:text-[145px] lowercase italic font-light opacity-90 tracking-normal"
            >
              developer
            </motion.span>
          </span>
        </h1>

        <motion.div
          variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 1, delay: 0.45, ease }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {roles.map((r) => (
            <span
              key={r}
              className="px-3 py-1 rounded-full border border-light/15 text-[11px] font-sans tracking-[0.2em] uppercase text-light/70"
            >
              {r}
            </span>
          ))}
        </motion.div>

        <motion.p
          variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 1, delay: 0.55, ease }}
          className="mt-6 max-w-lg text-base md:text-lg text-light/65 leading-relaxed font-sans"
        >
          I'm Nitin — a B.Tech student in Bengaluru who builds things end to end: data platforms fed by
          7+ live APIs, ML models that predict accident severity, and a 15-hour narrative game in Unreal Engine 5.
        </motion.p>

        <motion.div
          variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-dark font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-light transition-colors"
          >
            View my work
            <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-light/25 text-light font-sans text-xs font-bold tracking-[0.2em] uppercase hover:border-light transition-colors"
          >
            Download resume
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introFinished ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 right-6 md:right-12 hidden sm:flex items-center gap-4"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-light/40 font-bold">Scroll</span>
        <motion.div
          className="w-12 h-[1px] bg-light/30 origin-left"
          animate={{ scaleX: [0, 1, 0], translateX: [0, 0, 24] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
