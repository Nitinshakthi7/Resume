import { motion, useScroll, useTransform } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Github, Info, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProjectArt } from './ProjectArt';
import { ProjectModal } from './ProjectModal';
import { GH, featured, more, type Featured, type Minor, type Project, type ProjectKind } from '../lib/resumeData';

const ease = [0.16, 1, 0.3, 1] as const;

// Diagonal caution-tape band across the image for unfinished projects
function WipBand({ small = false }: { small?: boolean }) {
  const label = Array.from({ length: 6 }, () => 'Work in progress').join('  ✦  ');
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-dark/35" />
      <div className={`absolute left-1/2 top-1/2 w-[160%] -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] bg-gold ${small ? 'py-1.5' : 'py-2.5'} shadow-[0_10px_40px_rgba(0,0,0,0.6)]`}>
        <p className={`wip-marquee whitespace-nowrap font-sans font-bold tracking-[0.35em] uppercase text-dark ${small ? 'text-[10px]' : 'text-xs md:text-sm'}`}>
          {label}  ✦  {label}
        </p>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Featured; index: number; onOpen: (p: Project) => void }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const visual = (
    <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
      {project.image ? (
        <img src={project.image} alt={`${project.name} screenshot`} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <ProjectArt kind={project.art} />
      )}
    </motion.div>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease }}
      className={cn('flex flex-col gap-8 md:gap-16 w-full items-center', isEven ? 'md:flex-row' : 'md:flex-row-reverse')}
    >
      {/* Visual */}
      <div className="w-full md:w-3/5 overflow-hidden rounded-2xl border border-light/10 aspect-[16/10] relative group bg-[#141414]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">{visual}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
        {project.wip && <WipBand />}
        <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.25em] text-light/60 uppercase">
          {project.id} / 04
        </span>
        {project.status && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark/70 backdrop-blur border border-gold/40 font-sans text-[11px] tracking-[0.2em] uppercase text-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {project.status}
          </span>
        )}
        {/* Netflix-style hover preview: name + short summary, click for the full story */}
        <div className="absolute inset-x-0 bottom-0 z-[5] p-6 md:p-8 pt-28 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-all duration-500 ease-out pointer-events-none">
          <p className="font-display text-2xl md:text-3xl uppercase tracking-tight text-light leading-none">{project.name}</p>
          <p className="mt-2 max-w-lg font-sans text-sm text-light/80 leading-relaxed">{project.summary}</p>
          <span className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light text-dark font-sans text-[11px] font-bold tracking-[0.2em] uppercase">
            <Play size={12} className="fill-dark" />
            View details
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Open details for ${project.name}`}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      </div>

      {/* Text */}
      <div className="w-full md:w-2/5 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-5">
          <span className="font-sans text-[11px] tracking-[0.3em] font-bold text-accent uppercase">{project.category}</span>
          <div className="h-px flex-grow bg-light/15" />
        </div>

        <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-light mb-5 leading-[0.95]">
          {project.name}
        </h3>

        <p className="font-sans text-base text-light/75 mb-6 leading-relaxed">{project.desc}</p>

        <ul className="space-y-2.5 mb-7">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 font-sans text-sm text-light/65 leading-relaxed">
              <span className="mt-2 w-1 h-1 rounded-full bg-gold shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full border border-light/15 font-sans text-[11px] uppercase tracking-wider text-light/70">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="group/details inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-light/25 text-light font-sans text-xs font-bold uppercase tracking-widest hover:bg-light hover:text-dark hover:border-light transition-colors"
        >
          <Info size={14} />
          Details
        </button>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-light w-fit"
          >
            <Github size={16} />
            <span className="relative overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">View source</span>
              <span className="block absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">
                View source
              </span>
            </span>
            <span className="w-8 h-px bg-light/50 transition-all duration-300 group-hover:w-12 group-hover:bg-accent" />
          </a>
        ) : (
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-light/45">
            In active development
          </span>
        )}
        </div>
      </div>
    </motion.article>
  );
}

function MinorCard({ project, index, onOpen }: { project: Minor; index: number; onOpen: (p: Project) => void }) {
  const open = () => onOpen(project);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease }}
      className="relative hover:z-20 focus-within:z-20"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        aria-label={`Open details for ${project.name}`}
        className="group relative flex flex-col h-full rounded-2xl border border-light/10 bg-[#141414] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.04] hover:border-light/30 hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)] focus-visible:scale-[1.04]"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
          {project.cover && (
            <img
              src={project.cover}
              alt={`${project.name} screenshot`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          {project.wip && <WipBand small />}
          {/* Hover preview */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/70 to-black/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-400">
            <p className="font-sans text-sm text-light/90 leading-relaxed translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {project.summary}
            </p>
            <span className="mt-3 inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full bg-light text-dark font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
              <Play size={10} className="fill-dark" />
              View details
            </span>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.name} on GitHub`}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-dark/70 backdrop-blur border border-light/15 flex items-center justify-center text-light/80 hover:bg-accent hover:text-dark hover:border-accent transition-colors"
            >
              <Github size={16} />
            </a>
          )}
        </div>

        {/* Body: what was there before */}
        <div className="flex flex-col flex-grow p-6">
          <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-light/50 mb-3">{project.category}</span>
          <h4 className="font-display text-2xl uppercase tracking-tight text-light mb-3 leading-none">{project.name}</h4>
          {project.badge && (
            <span className="w-fit mb-3 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-sans text-[10px] tracking-[0.2em] uppercase">
              {project.badge}
            </span>
          )}
          <p className="font-sans text-sm text-light/65 leading-relaxed mb-5 flex-grow">{project.desc}</p>
          <p className="font-mono text-[11px] text-light/45 tracking-wide">{project.tech.join(' · ')}</p>
        </div>
      </div>
    </motion.div>
  );
}

const filters: { id: ProjectKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web & Backend' },
  { id: 'ml', label: 'AI / ML' },
  { id: 'game', label: 'Games' },
];

export function Work() {
  const [filter, setFilter] = useState<ProjectKind | 'all'>('all');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setOpenProject(null), []);
  const shown = filter === 'all' ? more : more.filter((p) => p.kind === filter);

  return (
    <section id="work" className="relative w-full py-32 px-6 md:px-12 bg-[#0F0F0F] text-light z-10">
      <div className="max-w-7xl mx-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 md:mb-28"
        >
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-light">
            Selected <span className="text-light/35">Work</span>
          </h2>
          <p className="font-sans text-sm text-light/60 max-w-sm leading-relaxed">
            Platforms, models and games — each one built end to end, from data and architecture to the interface.
          </p>
        </motion.div>

        <div className="flex flex-col gap-28 md:gap-40">
          {featured.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} onOpen={setOpenProject} />
          ))}
        </div>

        <div className="mt-36 md:mt-48">
          <div className="flex items-end justify-between gap-6 mb-10 border-b border-light/10 pb-6">
            <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-light">More projects</h3>
            <a
              href={GH}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-light/70 hover:text-accent transition-colors"
            >
              All on GitHub
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 mb-8">
            {filters.map((f) => {
              const count = f.id === 'all' ? more.length : more.filter((p) => p.kind === f.id).length;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={cn(
                    'px-4 py-1.5 rounded-full border font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-300',
                    active
                      ? 'border-accent bg-accent text-dark font-bold'
                      : 'border-light/15 text-light/65 hover:border-light/40 hover:text-light',
                  )}
                >
                  {f.label} <span className={active ? 'text-dark/60' : 'text-light/35'}>{count}</span>
                </button>
              );
            })}
          </div>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((p, i) => (
              <MinorCard key={p.name} project={p} index={i} onOpen={setOpenProject} />
            ))}
          </motion.div>
        </div>
      </div>
      <ProjectModal project={openProject} onClose={closeProject} />
    </section>
  );
}
