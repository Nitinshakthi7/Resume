import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, ArrowUpRight, FileText, ArrowUp, Copy, Check } from 'lucide-react';
import { EMAIL } from '../lib/resumeData';
import { ContactForm } from './ContactForm';

const ease = [0.16, 1, 0.3, 1] as const;

const socials = [
  { name: 'GitHub', href: 'https://github.com/Nitinshakthi7', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nitin-m-758342219', icon: Linkedin },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard API can be blocked (iframes, http); fall back to a hidden textarea
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border font-sans text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-300 ${
        copied ? 'border-accent bg-accent text-dark' : 'border-light/20 text-light/70 hover:border-light/50 hover:text-light'
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span aria-live="polite">{copied ? 'Copied to clipboard' : 'Copy email'}</span>
    </button>
  );
}

export function Contact({ onOpenResume }: { onOpenResume: () => void }) {
  return (
    <section id="contact" className="relative w-full min-h-screen pt-32 pb-10 px-6 md:px-12 bg-dark text-light flex flex-col justify-between z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_40%,_rgba(226,255,0,0.05)_0%,_transparent_55%)]" />

      <div className="relative flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease }}
          className="flex flex-col"
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-accent mb-8">What's next?</p>
          <h2 className="font-display text-5xl md:text-8xl lg:text-[9rem] uppercase leading-[0.85] tracking-tighter text-balance">
            Let's create <br />
            something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light to-light/30">meaningful.</span>
          </h2>

          <div className="mt-16 pt-16 border-t border-light/10 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col gap-8">
              <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase">Say hello</h3>
              <div className="flex flex-col gap-6">
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-display text-2xl sm:text-3xl hover:text-accent transition-colors flex items-center gap-3 group w-fit break-all"
                >
                  {EMAIL}
                  <ArrowUpRight size={24} className="shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </a>
                <CopyEmail />
                <p className="font-sans text-base text-light/60 max-w-sm leading-relaxed">
                  Open to internships and collaborative projects in full-stack engineering, AI/ML and game technology.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase">Elsewhere</h3>
              <div className="flex flex-col gap-4">
                {socials.map(({ name, href, icon: Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 w-fit">
                    <div className="w-12 h-12 rounded-full border border-light/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                      <Icon size={20} className="group-hover:text-dark transition-colors" />
                    </div>
                    <span className="font-sans text-lg tracking-wide group-hover:text-accent transition-colors">{name}</span>
                  </a>
                ))}
                <button type="button" onClick={onOpenResume} className="group flex items-center gap-6 w-fit text-left">
                  <div className="w-12 h-12 rounded-full border border-light/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                    <FileText size={20} className="group-hover:text-dark transition-colors" />
                  </div>
                  <span className="font-sans text-lg tracking-wide group-hover:text-accent transition-colors">Resume (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-16 border-t border-light/10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <div>
              <h3 className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase mb-5">Send a message</h3>
              <p className="font-sans text-base text-light/60 max-w-xs leading-relaxed">
                Leave your name and email, and your message comes straight to my inbox.
              </p>
            </div>
            <ContactForm />
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto w-full mt-32 border-t border-light/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <span className="font-signature text-4xl text-gold leading-none">Nitin M</span>
          <p className="font-sans text-xs tracking-widest text-light/45 uppercase">© {new Date().getFullYear()} · Built with React</p>
        </div>
        <a
          href="#"
          className="group flex items-center gap-2 font-sans text-xs tracking-widest text-light/60 hover:text-accent uppercase transition-colors"
        >
          Back to top
          <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
