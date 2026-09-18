import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { EMAIL } from '../lib/resumeData';

// Messages are delivered to Nitin's Gmail by Web3Forms. This access key is
// designed to be public: it can only send to the inbox it was created for.
const WEB3FORMS_KEY = '03601a91-0c5b-4131-9c6a-8c87ea74e912';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'w-full bg-transparent border-b border-light/20 py-3 font-sans text-base text-light placeholder:text-light/30 outline-none transition-colors focus:border-accent';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: real people never see or fill this field
    if (data.get('botcheck')) return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio message from ${data.get('name')}`,
          from_name: 'Nitin M — Portfolio',
          name: data.get('name'),
          email: data.get('email'),
          replyto: data.get('email'),
          message: data.get('message'),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-5 py-6"
            role="status"
          >
            <span className="w-12 h-12 rounded-full bg-accent text-dark flex items-center justify-center">
              <Check size={22} />
            </span>
            <p className="font-display text-3xl md:text-4xl uppercase tracking-tight">Message sent.</p>
            <p className="font-sans text-base text-light/60 max-w-md leading-relaxed">
              Thanks for reaching out. I'll get back to you at the email you gave.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="inline-flex items-center gap-2 font-sans text-xs font-bold tracking-[0.2em] uppercase text-light/60 hover:text-accent transition-colors"
            >
              <RotateCcw size={14} />
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
          >
            <label className="flex flex-col gap-1">
              <span className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase">Your name</span>
              <input name="name" required maxLength={100} autoComplete="name" placeholder="Jane Doe" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase">Your email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                placeholder="jane@company.com"
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="font-sans text-[11px] tracking-[0.3em] font-bold text-light/50 uppercase">Message</span>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                placeholder="Tell me about the role, project or idea…"
                className={cn(field, 'resize-none leading-relaxed')}
              />
            </label>
            {/* Honeypot for bots, hidden from people and screen readers */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="md:col-span-2 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-dark font-sans text-xs font-bold tracking-[0.25em] uppercase hover:bg-light disabled:opacity-60 disabled:cursor-wait transition-colors"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              {status === 'error' && (
                <p className="font-sans text-sm text-red-400" role="alert">
                  {error} You can also email me directly at{' '}
                  <a href={`mailto:${EMAIL}`} className="underline hover:text-accent">
                    {EMAIL}
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
