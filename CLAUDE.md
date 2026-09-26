# CLAUDE.md

Project conventions for Claude Code sessions working in this repo. This is Nitin M's personal portfolio site.

## Stack & deployment

- Vite + React 19 + TypeScript, Tailwind CSS v4, Framer Motion (`motion/react`), Lenis smooth-scroll.
- **Deployed on Vercel**, connected to this GitHub repo — pushing to `main` auto-deploys, no manual build/deploy step. (`metadata.json`'s AI-Studio capability flag is a stale leftover from the project's origin, not the actual deploy target — ignore it.)
- Server-side code (the chatbot) lives under `/api` as Vercel serverless functions, not a persistent server — see the AI chatbot section below.
- `.env.example` documents required env vars for local dev; real secrets for production are set in the Vercel dashboard (Project Settings → Environment Variables), never committed.

## Content: single source of truth

- **`src/lib/resumeData.ts`** is the single source of truth for all site content — bio, skills, all 16 projects (tech, features, stats, screenshots), career direction, education, journey timeline. Any new project, skill, or bio change goes here first; components read from it rather than hardcoding content.
- **Honesty rule (non-negotiable):** only add claims that are backed by the resume or verifiable in the actual project code/repo. Changes to resume/portfolio content are additive only — never invent or embellish achievements, metrics, or scope.

## Resume PDF pipeline

- Source: `resume/resume.html` + `resume/resume.css`, built via `scripts/build-resume-pdf.mjs` (Playwright + system Edge, no bundled browser download) → `npm run resume:pdf` → writes `public/Nitin_M_Resume.pdf`.
- **Font must stay on the `'Segoe UI', Arial, sans-serif` stack.** Chromium's PDF export has a text-shaping bug that inserts phantom visual gaps (e.g. "Py game", "AI / ML") with Arial, Georgia, and the Satoshi variable font at small sizes (~9-10px) — confirmed via PyMuPDF text-layer + pixel inspection. Segoe UI is the confirmed-clean fix. Don't reintroduce a different font without re-verifying with a zoomed PyMuPDF render.
- **Bump the cache-buster** (`RESUME_URL` in `src/components/Navigation.tsx`, e.g. `?v=4` → `?v=5`) every time the PDF content changes, and every time — browsers and the in-page iframe cache the PDF by URL, so a version bump is the only way a viewer sees the update. There's also a Vite dev-server middleware in `vite.config.ts` forcing `Cache-Control: no-store` on `/Nitin_M_Resume.pdf` specifically.
- The resume is shown via an in-page iframe modal (`src/components/ResumeModal.tsx`), not a direct link — some browsers (e.g. Opera) force-download PDFs on direct navigation regardless of link attributes; an iframe embed sidesteps that.
- Verify PDF changes with PyMuPDF (`pymupdf`/`fitz`): render pages to PNG and zoom into small text to check for the font-shaping bug, and check the page count/fit before calling a redesign done — don't rely on eyeballing the on-disk file without rebuilding, and don't claim a fix worked without re-rendering.

## Agent pipeline (`.claude/agents/`)

- `spec-reader.md` (Haiku) — reads/distills long prompts or spec text only, not application code.
- `project-planner.md` (Opus) — turns a spec-reader brief and/or codebase-surveyor survey into an implementation plan; never writes code.
- `codebase-surveyor.md` (Haiku) — surveys this repo, or any other project path pointed at, specifically to find resume-worthy material or trace bugs/explain code for another AI reviewer.

## Project discovery workflow

When given filesystem paths to search for resume-worthy projects: list candidates out, do not add anything to the resume/site automatically — wait for explicit picks.

## AI chatbot

A chat widget (`src/components/ChatWidget.tsx`) answers visitor questions about Nitin. `api/chat.ts` is the Vercel serverless function it calls; the actual logic (knowledge, Gemini call, rate limiting) lives in `server/` as plain, transport-agnostic modules that `api/chat.ts` imports — Vercel traces and bundles that import graph automatically, no manual bundling step. See [`docs/chatbot-plan.md`](docs/chatbot-plan.md) for the full spec and status.

- **`server/knowledge.ts`** builds the system prompt straight from `resumeData.ts` — it's the only place the bot's persona/rules live, and the only place resume-content changes need to reach the bot too.
- **Local dev:** `npm run dev:vercel` (runs `vercel dev`, which serves the Vite frontend and `/api/*` functions together on one port, close to production parity) instead of the plain `npm run dev`. Needs a one-time `vercel login` + `vercel link` to this project (interactive — can't be scripted), and a local `.env` with `GEMINI_API_KEY` (`vercel dev` loads it automatically); `.env.example` documents the shape.
- **Production:** nothing extra to run — `git push` to `main` deploys both the static site and `/api/chat` together. The one manual step is setting `GEMINI_API_KEY` once in the Vercel dashboard (Project Settings → Environment Variables); it isn't in the repo and won't travel with a push.
- Vercel serverless functions aren't a single persistent process — the in-memory rate limiter in `server/rateLimiter.ts` resets per cold start and doesn't share state across concurrent instances. It's still a real, useful abuse guard for this site's actual traffic level, just not a mathematically exact global cap.
- **Model:** `gemini-3.5-flash-lite` (free tier). If Google deprecates/renames it again, the API's own error message names the current successor — check `server/geminiClient.ts`'s `MODEL` constant.
