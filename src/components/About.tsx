import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function About() {
  return (
    <section id="about" className="relative w-full py-32 px-6 md:px-12 bg-[#0F0F0F] text-light z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        
        {/* Left column: Abstract shape / portrait replacement */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[3/4] bg-dark/5 rounded-2xl relative overflow-hidden group"
            data-cursor="ABOUT ME"
          >
            {/* Abstract visual instead of image since we don't have one */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full border border-light/20 mb-8 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent absolute top-0" />
                <div className="w-12 h-12 rounded-full bg-dark/10" />
              </div>
              <p className="font-sans text-xs tracking-widest uppercase text-light/40 mb-2">System Design</p>
              <p className="font-sans text-xs tracking-widest uppercase text-light/40 mb-2">Machine Learning</p>
              <p className="font-sans text-xs tracking-widest uppercase text-light/40">Game Development</p>
            </div>
            
            {/* Hover overlay pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
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
              <h3 className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/50 uppercase mb-4">Background</h3>
              <p className="font-sans text-lg text-light/80 leading-relaxed text-balance">
                I am a multidisciplinary developer focused on full-stack architecture, machine learning, and game development. Currently pursuing a B.Tech in Digital Transformation with a minor in AI/ML at Atria University.
              </p>
            </div>
            <div>
              <h3 className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/50 uppercase mb-4">Education</h3>
              <ul className="space-y-4">
                <li className="font-sans text-base text-light border-b border-light/10 pb-4">
                  <span className="block font-bold">Atria University, Bengaluru</span>
                  <span className="block text-light/60 text-sm mt-1">B.Tech Digital Transformation • 2024–2028</span>
                </li>
                <li className="font-sans text-base text-light border-b border-light/10 pb-4">
                  <span className="block font-bold">New Horizon Pre-University</span>
                  <span className="block text-light/60 text-sm mt-1">PUC / 12th Grade • 2024</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
