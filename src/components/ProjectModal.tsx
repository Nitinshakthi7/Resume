import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Play, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { lockScroll } from '../lib/scroll';
import { showNotDeployed, type Project } from '../lib/resumeData';
import { ProjectArt } from './ProjectArt';
import { NotDeployedTag } from './NotDeployedTag';

const ease = [0.16, 1, 0.3, 1] as const;

function Gallery({ project }: { project: Project }) {
  const shots = project.gallery ?? [];
  const [index, setIndex] = useState(0);
  const count = shots.length;

  useEffect(() => {
    if (count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  if (!count) {
    // No screenshots yet (e.g. Looped Lies): fall back to the generated art, if any
    const art = 'art' in project ? project.art : undefined;
    return (
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-light/10 bg-[#141414] min-w-0">
        {art ? <ProjectArt kind={art} /> : null}
      </div>
    );
  }

  const current = shots[index];
  return (
    <div className="min-w-0">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-light/10 bg-[#141414] group">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.caption}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((index - 1 + count) % count)}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/70 backdrop-blur border border-light/15 flex items-center justify-center text-light opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % count)}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/70 backdrop-blur border border-light/15 flex items-center justify-center text-light opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-dark/70 backdrop-blur font-mono text-[11px] text-light/70">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>
      <p className="mt-3 font-sans text-sm text-light/60">{current.caption}</p>
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}: ${s.caption}`}
              className={cn(
                'shrink-0 w-24 aspect-[16/10] rounded-md overflow-hidden border-2 transition-all',
                i === index ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-90',
              )}
            >
              <img src={s.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    lockScroll(true);
    document.body.dataset.modal = 'open';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      delete document.body.dataset.modal;
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  // Rendered at the document root so it always sits above the nav and page sections
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.slug}
          className="fixed inset-0 z-[150] flex items-start md:items-center justify-center p-0 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: 40, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[92vh] overflow-y-auto bg-[#111] md:rounded-3xl border border-light/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            data-lenis-prevent
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="sticky top-4 float-right mr-4 z-10 w-11 h-11 rounded-full bg-dark/80 backdrop-blur border border-light/15 flex items-center justify-center text-light hover:bg-accent hover:text-dark hover:border-accent transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-12">
                <Gallery project={project} />

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-sans text-[11px] tracking-[0.3em] font-bold text-accent uppercase">
                      {project.category}
                    </span>
                    {(project.wip || ('status' in project && project.status === 'Work in progress')) && (
                      <span className="px-2.5 py-0.5 rounded-full border border-gold/40 text-gold font-sans text-[10px] tracking-[0.2em] uppercase">
                        Work in progress
                      </span>
                    )}
                    {project.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-sans text-[10px] tracking-[0.2em] uppercase">
                        {project.badge}
                      </span>
                    )}
                    {showNotDeployed(project) && <NotDeployedTag />}
                  </div>
                  <h2
                    id="project-modal-title"
                    className="font-display text-4xl md:text-5xl uppercase tracking-tight text-light leading-[0.95] mb-5"
                  >
                    {project.name}
                  </h2>
                  <p className="font-sans text-base md:text-lg text-light/75 leading-relaxed">{project.details.overview}</p>

                  {project.details.stats && (
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {project.details.stats.map((s) => (
                        <div key={s.label} className="rounded-xl border border-light/10 bg-light/[0.03] p-4">
                          <div className="font-display text-2xl md:text-3xl text-light leading-none">{s.value}</div>
                          <div className="mt-2 font-sans text-[11px] leading-snug text-light/50">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.live && (
                      <a
                        href={project.live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-dark font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-light transition-colors"
                      >
                        <Play size={14} className="fill-dark" />
                        {project.live.label}
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-bold tracking-[0.2em] uppercase transition-colors',
                          project.live
                            ? 'border border-light/25 text-light hover:bg-light hover:text-dark'
                            : 'bg-accent text-dark hover:bg-light',
                        )}
                      >
                        <Github size={15} />
                        View source
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-light/10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                <section>
                  <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase mb-5">
                    What it does
                  </h3>
                  <ul className="space-y-3">
                    {project.details.features.map((f) => (
                      <li key={f} className="flex gap-3 font-sans text-sm md:text-[15px] text-light/75 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase mb-5">
                    How it's built
                  </h3>
                  <ul className="space-y-3">
                    {project.details.build.map((b) => (
                      <li key={b} className="flex gap-3 font-sans text-sm md:text-[15px] text-light/75 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full border border-light/15 font-sans text-[11px] uppercase tracking-wider text-light/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {project.details.role && (
                <section className="mt-10 pt-10 border-t border-light/10">
                  <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase mb-4">My part</h3>
                  <p className="font-sans text-sm md:text-[15px] text-light/75 leading-relaxed max-w-3xl">{project.details.role}</p>
                </section>
              )}

              {project.details.note && (
                <p className="mt-10 font-sans text-sm text-light/45 italic">{project.details.note}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
