import { motion } from 'motion/react';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="relative w-full min-h-screen py-32 px-6 md:px-12 bg-dark text-light flex flex-col justify-between z-10">
      
      <div className="flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-accent mb-8">What's next?</p>
          <h2 className="font-display text-5xl md:text-8xl lg:text-[9rem] uppercase leading-[0.85] tracking-tighter text-balance">
            LET'S CREATE <br/>
            SOMETHING <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light to-light/30">
              MEANINGFUL.
            </span>
          </h2>
          
          <div className="mt-16 pt-16 border-t border-light/10 grid grid-cols-1 md:grid-cols-2 gap-16">
            
            <div className="flex flex-col gap-8">
              <h3 className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/30 uppercase">Connect</h3>
              <div className="flex flex-col gap-6">
                <a 
                  href="mailto:Nitinshakthi7@gmail.com"
                  className="font-display text-2xl md:text-3xl hover:text-accent transition-colors flex items-center gap-4 group w-fit"
                  data-cursor="EMAIL"
                >
                  Nitinshakthi7@gmail.com
                  <ExternalLink size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
                <p className="font-sans text-base text-light/50 max-w-sm text-balance">
                  Currently available for freelance opportunities and full-time roles in full-stack development and machine learning.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/30 uppercase">Socials</h3>
              <div className="flex flex-col gap-4">
                <a 
                  href="https://github.com/Nitinshakthi7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 w-fit"
                  data-cursor="GITHUB"
                >
                  <div className="w-12 h-12 rounded-full border border-light/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                    <Github size={20} className="group-hover:text-dark transition-colors" />
                  </div>
                  <span className="font-sans text-lg tracking-wide group-hover:text-accent transition-colors">GitHub</span>
                </a>
                
                <a 
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 w-fit"
                  data-cursor="LINKEDIN"
                >
                  <div className="w-12 h-12 rounded-full border border-light/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                    <Linkedin size={20} className="group-hover:text-dark transition-colors" />
                  </div>
                  <span className="font-sans text-lg tracking-wide group-hover:text-accent transition-colors">LinkedIn</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto w-full mt-32 border-t border-light/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-sans text-xs tracking-widest text-light/40 uppercase">
          © {new Date().getFullYear()} Nitin M All rights reserved.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans text-xs tracking-widest text-light/60 hover:text-accent uppercase transition-colors"
          data-cursor="UP"
        >
          Back to Top
        </button>
      </div>
      
    </section>
  );
}
