import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Expertise } from './components/Expertise';
import { Work } from './components/Work';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { Intro } from './components/Intro';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    if (showIntro) {
      lenis.stop();
    } else {
      lenis.start();
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(href);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Allow animation to complete before triggering page animations
      setTimeout(() => setIntroFinished(true), 800);
    }
  }, [showIntro]);

  return (
    <div className="bg-dark min-h-screen text-light selection:bg-accent selection:text-dark">
      <CustomCursor />
      <AnimatePresence mode="wait">
        {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      <Navigation introFinished={introFinished} />
      <main>
        <Hero introFinished={introFinished} />
        <About />
        <Expertise />
        <Work />
        <Contact />
      </main>
    </div>
  );
}
