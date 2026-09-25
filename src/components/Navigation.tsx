import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const RESUME_URL = '/Nitin_M_Resume.pdf?v=2';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Expertise', href: '#expertise' },
  { name: 'Work', href: '#work' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];

// Which section is currently in view (a band across the middle of the screen)
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    // Nothing is "active" while the hero is on screen
    const hero = document.querySelector('main > section:first-child');
    const heroObserver = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(null),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    if (hero) heroObserver.observe(hero);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);
  return active;
}

export function Navigation({ introFinished }: { introFinished?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={introFinished ? { y: 0 } : { y: -100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500',
          scrolled ? 'py-3 bg-dark/80 backdrop-blur-md border-b border-light/5' : 'py-5 bg-transparent',
        )}
      >
        <a
          href="#"
          aria-label="Nitin M — back to top"
          className="font-signature text-4xl md:text-[2.6rem] leading-none text-light hover:text-gold transition-colors z-50 pt-1"
        >
          Nitin M
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-current={active === link.href ? 'true' : undefined}
              className={cn(
                "font-sans text-[11px] tracking-[0.3em] font-bold uppercase hover:text-accent transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-accent hover:after:w-full after:transition-all after:duration-300",
                active === link.href ? 'text-accent after:w-full' : 'text-light/80 after:w-0',
              )}
            >
              {link.name}
            </a>
          ))}
          <a
            href={RESUME_URL}
            download="Nitin_M_Resume.pdf"
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full border border-light/20 text-light font-sans text-[11px] tracking-[0.25em] font-bold uppercase hover:bg-accent hover:border-accent hover:text-dark transition-all duration-300"
          >
            Resume
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-light z-50 p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-dark flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.15 }}
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'font-display text-4xl font-bold uppercase tracking-widest hover:text-accent transition-colors',
                  active === link.href ? 'text-accent' : 'text-light',
                )}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * navLinks.length + 0.15 }}
              href={RESUME_URL}
              download="Nitin_M_Resume.pdf"
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-dark font-sans text-sm tracking-[0.25em] font-bold uppercase"
            >
              Resume <ArrowUpRight size={16} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
