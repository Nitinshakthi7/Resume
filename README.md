# Nitin M — Portfolio

Personal portfolio site for Nitin M — full-stack developer, AI/ML engineer, and game developer.

**Live:** [resume-one-theta-32.vercel.app](https://resume-one-theta-32.vercel.app)

## What's here

- A single-page portfolio built with React, TypeScript, Tailwind CSS and Framer Motion — bio, skills, 16 real projects (with screenshots, tech stacks and write-ups), a career timeline, and a contact form.
- A downloadable/previewable resume PDF, generated from HTML/CSS rather than maintained as a static file (see `resume/`).
- An AI chatbot embedded on the site (bottom-right chat bubble) that answers visitor questions about Nitin and his projects, grounded entirely in the site's own content — see `docs/chatbot-plan.md` for how it's built.

## Tech stack

- **Frontend:** Vite, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lenis (smooth scroll)
- **Chatbot backend:** Vercel serverless function (`api/chat.ts`) calling the Gemini API free tier
- **Deployment:** Vercel, auto-deployed from this repo's `main` branch

## Running locally

```bash
npm install
npm run dev
```

The chatbot needs a Gemini API key to answer (get a free one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)) and Vercel's local dev server to serve `/api/*` alongside the frontend:

```bash
cp .env.example .env   # fill in GEMINI_API_KEY
npm run dev:vercel     # runs `vercel dev` — needs a one-time `vercel login` + `vercel link`
```

Other scripts:

```bash
npm run build       # production build (Vite)
npm run lint         # type-check (tsc --noEmit)
npm run resume:pdf   # regenerate public/Nitin_M_Resume.pdf from resume/resume.html
```

See [`CLAUDE.md`](CLAUDE.md) for project conventions and known gotchas, and [`docs/chatbot-plan.md`](docs/chatbot-plan.md) for the chatbot's spec.

## Contact

- Email: nitinshakthi7@gmail.com
- GitHub: [github.com/Nitinshakthi7](https://github.com/Nitinshakthi7)
