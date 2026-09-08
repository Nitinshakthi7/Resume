import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';

export function Navigation({ introFinished }: { introFinished?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERTISE', href: '#expertise' },
    { name: 'WORK', href: '#work' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={introFinished ? { y: 0 } : { y: -100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-colors duration-500",
          scrolled ? "bg-dark/80 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <a href="#" className="font-display text-2xl font-bold tracking-tighter text-light uppercase mix-blend-difference z-50">
          Nitin M
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 mix-blend-difference">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-light font-sans text-[9px] tracking-[0.3em] font-bold uppercase hover:text-accent transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-px after:bg-accent hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-light z-50 mix-blend-difference"
          onClick={() => setIsOpen(!isOpen)}
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
                transition={{ delay: 0.1 * i + 0.2 }}
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-light font-display text-4xl font-bold tracking-widest hover:text-accent transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
