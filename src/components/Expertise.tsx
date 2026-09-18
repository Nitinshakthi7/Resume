import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { skills, usedIn, projectsForGroup } from '../lib/resumeData';

export function Expertise() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="expertise" className="relative w-full py-32 px-6 md:px-12 bg-dark text-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        <div className="w-full md:w-1/3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-32"
          >
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-light">
              MY<br/>EXPERTISE
            </h2>
            <div className="mt-8 w-12 h-[2px] bg-accent" />
            <p className="mt-8 font-sans text-sm tracking-wide text-light/60 max-w-xs text-balance">
              A comprehensive technical foundation spanning web development, machine learning architectures, and interactive game systems.
            </p>
          </motion.div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col border-t border-light/10">
          {skills.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredCategory(skillGroup.category)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setHoveredSkill(null);
              }}
              className="group relative flex flex-col md:flex-row md:items-start py-8 border-b border-light/10 transition-colors duration-500 hover:border-light/40"
            >
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <span className={cn(
                  "font-sans text-[11px] tracking-[0.3em] uppercase font-bold transition-colors duration-300",
                  hoveredCategory === skillGroup.category ? "text-accent" : "text-light/55"
                )}>
                  0{idx + 1} // {skillGroup.category}
                </span>
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {skillGroup.items.map((item, i) => (
                    <span
                      key={item}
                      onMouseEnter={() => setHoveredSkill(item)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={cn(
                        "font-display text-xl md:text-3xl uppercase tracking-wide transition-all duration-300",
                        hoveredCategory === skillGroup.category
                          ? "text-light translate-x-2"
                          : "text-light/60",
                        hoveredSkill === item && "text-accent"
                      )}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      {item}{i < skillGroup.items.length - 1 ? <span className="text-light/20 mx-2">/</span> : ""}
                    </span>
                  ))}
                </div>
                <UsedInLine
                  projects={
                    hoveredSkill && hoveredCategory === skillGroup.category
                      ? usedIn[hoveredSkill] ?? []
                      : projectsForGroup(skillGroup)
                  }
                  label={hoveredSkill && hoveredCategory === skillGroup.category ? hoveredSkill : null}
                  active={hoveredCategory === skillGroup.category}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function UsedInLine({ projects, label, active }: { projects: string[]; label: string | null; active: boolean }) {
  if (!projects.length && !label) return null;
  return (
    <p
      className={cn(
        'mt-4 font-sans text-xs leading-relaxed transition-colors duration-300',
        active ? 'text-light/75' : 'text-light/40',
      )}
    >
      <span className="font-bold tracking-[0.25em] uppercase text-[10px] text-gold/80 mr-2">
        {label ? `${label} →` : 'Used in →'}
      </span>
      {projects.length ? projects.join(' · ') : 'Coursework & practice'}
    </p>
  );
}
