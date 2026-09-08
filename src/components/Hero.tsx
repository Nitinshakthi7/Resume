import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function Hero({ introFinished }: { introFinished?: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 bg-dark overflow-hidden"
    >
      <motion.div 
        style={{ y, opacity }}
        className="w-full max-w-7xl mx-auto flex flex-col items-start justify-center z-10"
      >
        <div className="flex w-full justify-between items-end mb-16 text-light/30 font-sans text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase overflow-hidden">
          <motion.div 
            initial={{ y: "100%" }} 
            animate={introFinished ? { y: 0 } : { y: "100%" }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Portfolio '24 / 25
          </motion.div>
          <motion.div 
            initial={{ y: "100%" }} 
            animate={introFinished ? { y: 0 } : { y: "100%" }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-right"
          >
            Based in Bengaluru, IN<br/><span className="text-accent">Currently Available</span>
          </motion.div>
        </div>

        <div className="w-full flex flex-col leading-[0.8] tracking-tighter">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={introFinished ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-light font-display text-[15vw] md:text-[145px] uppercase m-0 p-0 font-bold"
            >
              Creative
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={introFinished ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gold font-serif text-[15vw] md:text-[145px] lowercase italic font-light m-0 p-0 opacity-90 tracking-normal"
            >
              developer
            </motion.h1>
          </div>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={introFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-md text-sm text-light/50 leading-relaxed font-light font-sans"
        >
          Architecting high-performance digital experiences where artistic direction meets engineering excellence. Specializing in Full-Stack, WebGL, and Machine Learning.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={introFinished ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-12 left-12 md:left-24 flex items-center gap-4"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase opacity-30 font-bold">Scroll</span>
        <motion.div 
          className="w-12 h-[1px] bg-light/30 origin-left"
          animate={{ scaleX: [0, 1, 0], translateX: [0, 0, 24] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
