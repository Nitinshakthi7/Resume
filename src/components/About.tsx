import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function About() {
  return (
    <section id="about" className="relative w-full py-32 px-6 md:px-12 bg-[#0F0F0F] text-light z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        
        {/* Left column: Portrait image */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[3/4] rounded-2xl relative overflow-hidden bg-gradient-to-b from-[#1c1c1c] via-[#141414] to-[#0a0a0a] border border-light/10 shadow-2xl group"
          >
            {/* Subtle atmospheric ambient glow behind subject */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,_rgba(226,255,0,0.12)_0%,_transparent_65%)] pointer-events-none" />

            {/* Top corner identifier */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-widest uppercase text-light/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/70" />
              <span>Full-Stack · AI/ML · Games</span>
            </div>

            {/* Portrait Image */}
            <img 
              src="/portrait.png" 
              alt="Portrait of Nitin M" 
              className="w-full h-full object-cover object-top filter contrast-[1.04] brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
            />

            {/* Bottom blend gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent pointer-events-none" />

            {/* Floating glass info card at bottom */}
            <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-md border border-light/10 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-sans text-[11px] font-medium tracking-wide uppercase text-light/90">Nitin M</span>
              </div>
              <span className="font-mono text-[10px] text-light/60 uppercase tracking-widest">Bengaluru, IN</span>
            </div>
          </motion.div>

          {/* Area focus badges */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start w-full">
            <span className="px-3 py-1 rounded-full border border-light/10 bg-light/[0.02] text-[10px] font-sans tracking-widest uppercase text-light/60">System Design</span>
            <span className="px-3 py-1 rounded-full border border-light/10 bg-light/[0.02] text-[10px] font-sans tracking-widest uppercase text-light/60">Machine Learning</span>
            <span className="px-3 py-1 rounded-full border border-light/10 bg-light/[0.02] text-[10px] font-sans tracking-widest uppercase text-light/60">Game Dev</span>
          </div>
        </div>

        {/* Right column: Typography & Details */}
        <div className="w-full md:w-2/3 flex flex-col">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.9] tracking-tight mb-12 text-balance"
          >
            I BUILD DIGITAL <span className="text-accent">WORLDS</span> <br />
            WHERE DESIGN <br />
            MEETS LOGIC.
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-light/10 pt-12"
          >
            <div>
              <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/55 uppercase mb-4">Background</h3>
              <p className="font-sans text-lg text-light/80 leading-relaxed text-balance">
                I'm a builder who wants to understand how things work beneath the surface — why they work, and whether there's a better way to build them. That curiosity has taken me through full-stack development, machine learning, cybersecurity and game development. I'm currently pursuing a B.Tech in Digital Transformation with a minor in AI/ML at Atria University.
              </p>
            </div>
            <div>
              <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/55 uppercase mb-4">Education</h3>
              <ul className="space-y-4">
                <li className="font-sans text-base text-light border-b border-light/10 pb-4">
                  <span className="block font-bold">Atria University, Bengaluru</span>
                  <span className="block text-light/60 text-sm mt-1">B.Tech Digital Transformation · Minor in AI/ML · 2024–2028</span>
                </li>
                <li className="font-sans text-base text-light border-b border-light/10 pb-4">
                  <span className="block font-bold">New Horizon Pre-University</span>
                  <span className="block text-light/60 text-sm mt-1">PUC / 12th Grade · 2024</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 pl-6 border-l-2 border-gold/60"
          >
            <p className="font-serif italic text-2xl md:text-3xl text-light/90 leading-snug text-balance">
              In short: I am a builder, a question-asker, a problem solver, and someone who genuinely enjoys{' '}
              <span className="text-gold">learning by creating.</span>
            </p>
          </motion.blockquote>
        </div>

      </div>
    </section>
  );
}
