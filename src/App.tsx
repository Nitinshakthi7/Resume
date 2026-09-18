import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Expertise } from './components/Expertise';
import { Work } from './components/Work';
import { Contact } from './components/Contact';
import { Journey } from './components/Journey';
import { Intro } from './components/Intro';
import { setLenis, scrollToTarget } from './lib/scroll';

// Number keys jump between sections once the intro is done
const SHORTCUTS = ['#about', '#expertise', '#work', '#journey', '#contact'];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // One Lenis instance for the lifetime of the page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Smooth-scroll in-page anchor links (#about, #work, ...)
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      const href = anchor?.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      lenis.scrollTo(href === '#' ? 0 : href);
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      setLenis(null);
      lenisRef.current = null;
    };
  }, []);

  // Lock scrolling while the intro plays
  useEffect(() => {
    const lenis = lenisRef.current;
    if (showIntro) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      return;
    }
    lenis?.start();
    document.body.style.overflow = '';
    // Let the intro curtain lift before the hero animates in
    const t = setTimeout(() => setIntroFinished(true), 700);
    return () => clearTimeout(t);
  }, [showIntro]);

  useEffect(() => {
    if (!introFinished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.body.dataset.modal === 'open') return; // project details open
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= SHORTCUTS.length) scrollToTarget(SHORTCUTS[n - 1]);
      else if (e.key === '0') scrollToTarget(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [introFinished]);

  const finishIntro = useCallback(() => setShowIntro(false), []);

  return (
    <div className="bg-dark min-h-screen text-light selection:bg-accent selection:text-dark">
      <AnimatePresence>
        {showIntro && <Intro onComplete={finishIntro} />}
      </AnimatePresence>
      <div className="film-grain" aria-hidden="true" />
      <Navigation introFinished={introFinished} />
      <main>
        <Hero introFinished={introFinished} />
        <About />
        <Expertise />
        <Work />
        <Journey />
        <Contact />
      </main>
    </div>
  );
}
