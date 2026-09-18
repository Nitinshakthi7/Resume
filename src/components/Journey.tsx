import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { journey, direction } from '../lib/resumeData';

const ease = [0.16, 1, 0.3, 1] as const;

export function Journey() {
  return (
    <section id="journey" className="relative w-full py-32 px-6 md:px-12 bg-dark text-light z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-light">
            The <span className="text-gold font-serif italic lowercase font-light tracking-normal">journey</span>
          </h2>
          <p className="font-sans text-sm text-light/60 max-w-sm leading-relaxed">
            From first Python games to ML models and a full game in Unreal Engine — learning by building, one project at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Timeline */}
          <ol className="lg:col-span-7 relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/60 via-light/15 to-transparent"
              aria-hidden="true"
            />
            {journey.map((m, i) => (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.05, ease }}
                className="relative pl-10 pb-12 last:pb-0 group"
              >
                <span
                  className={cn(
                    'absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center bg-dark transition-colors duration-300',
                    m.current ? 'border-accent' : 'border-gold/60 group-hover:border-gold',
                  )}
                  aria-hidden="true"
                >
                  <span className={cn('w-[5px] h-[5px] rounded-full', m.current ? 'bg-accent animate-pulse' : 'bg-gold/70')} />
                </span>

                <span
                  className={cn(
                    'font-sans text-[11px] tracking-[0.3em] font-bold uppercase',
                    m.current ? 'text-accent' : 'text-gold/90',
                  )}
                >
                  {m.when}
                </span>
                <h3 className="mt-2 font-display text-2xl md:text-3xl uppercase tracking-tight text-light leading-none">
                  {m.title}
                </h3>
                <p className="mt-3 font-sans text-sm md:text-base text-light/65 leading-relaxed max-w-xl">{m.detail}</p>
                {m.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full border border-light/10 font-sans text-[10px] tracking-[0.15em] uppercase text-light/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.li>
            ))}
          </ol>

          {/* Direction */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="lg:col-span-5 lg:sticky lg:top-28 rounded-2xl border border-light/10 bg-light/[0.02] p-8 md:p-10"
          >
            <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-accent uppercase mb-8">Where I'm headed</h3>

            <dl className="space-y-7">
              <div>
                <dt className="font-display text-lg uppercase tracking-tight text-light mb-2">What I want</dt>
                <dd className="font-sans text-sm text-light/65 leading-relaxed">{direction.want}</dd>
              </div>
              <div>
                <dt className="font-display text-lg uppercase tracking-tight text-light mb-2">Where I want to grow</dt>
                <dd className="font-sans text-sm text-light/65 leading-relaxed">{direction.grow}</dd>
              </div>
            </dl>

            <blockquote className="mt-9 pt-8 border-t border-light/10">
              <p className="font-serif italic text-xl md:text-2xl text-gold/90 leading-snug">"{direction.goal}"</p>
              <footer className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase text-light/40">Long-term goal</footer>
            </blockquote>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
