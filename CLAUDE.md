# CLAUDE.md

Project conventions for Claude Code sessions working in this repo. This is Nitin M's personal portfolio site.

## Stack & deployment

- Vite + React 19 + TypeScript, Tailwind CSS v4, Framer Motion (`motion/react`), Lenis smooth-scroll.
- **Deployed via Google AI Studio → Cloud Run**, not Vercel/Netlify. `metadata.json`'s `SERVER_SIDE_GEMINI_API` capability flag and `.env.example` (`GEMINI_API_KEY`, `APP_URL`) reflect this. AI Studio provisions a Node.js server-side runtime alongside the Vite frontend — server-side secrets are injected at runtime, never committed.
- `.env.example` documents required env vars; real values are injected by the AI Studio/Cloud Run runtime. Never commit `.env`.

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

A chat widget (`src/components/ChatWidget.tsx`) answers visitor questions about Nitin using a small Express server (`server/`) that calls the Gemini API free tier. See [`docs/chatbot-plan.md`](docs/chatbot-plan.md) for the full spec and status.

- **`server/knowledge.ts`** builds the system prompt straight from `resumeData.ts` — it's the only place the bot's persona/rules live, and the only place resume-content changes need to reach the bot too.
- **Local dev needs two processes**: `npm run dev` (Vite, port 3000) and `npm run dev:api` (the chat server, port 8787) — Vite proxies `/api/*` to it. A `.env` file (gitignored) with `GEMINI_API_KEY` is required for `dev:api` to answer; `.env.example` documents the shape.
- **Production is one process**: `npm run build` bundles the frontend with Vite and the server with esbuild (`dist-server/server.mjs`); `npm start` runs that bundle, which serves both the built static site and `/api/chat` on one port — matching Cloud Run's single-port model.
- **Model:** `gemini-3.5-flash-lite` (free tier). If Google deprecates/renames it again, the API's own error message names the current successor — check `server/geminiClient.ts`'s `MODEL` constant.
