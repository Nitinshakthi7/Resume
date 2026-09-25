import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Download, X } from 'lucide-react';
import { lockScroll } from '../lib/scroll';
import { RESUME_URL } from './Navigation';

const ease = [0.16, 1, 0.3, 1] as const;

// An in-page preview so the resume opens and shows inline, with an explicit
// download button — independent of whether the visitor's browser is set to
// download PDFs automatically instead of viewing them (an <iframe> embed
// isn't subject to that top-level-navigation setting the way a direct link
// to the PDF is).
export function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: 30, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-4xl h-full md:h-[92vh] bg-[#111] md:rounded-2xl border border-light/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-light/10 bg-[#0d0d0d]">
              <span className="font-sans text-[11px] tracking-[0.25em] font-bold uppercase text-light/60">
                Nitin M — Resume
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={RESUME_URL}
                  download="Nitin_M_Resume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-dark font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-light transition-colors"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume preview"
                  className="w-9 h-9 rounded-full bg-dark/80 border border-light/15 flex items-center justify-center text-light hover:bg-accent hover:text-dark hover:border-accent transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <iframe src={RESUME_URL} title="Nitin M — Resume" className="flex-grow w-full bg-[#0a0a0a]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
