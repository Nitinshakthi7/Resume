# Portfolio AI Chatbot — Plan & Spec

Status: **built, locally verified, ready to deploy.** Deploys automatically on the next push to `main` (Vercel is connected to this GitHub repo) — the one remaining manual step is setting `GEMINI_API_KEY` in the Vercel dashboard.

## Goal

A chat widget on the portfolio site that can answer any question about Nitin and his projects — "knows everything A-Z" from the resume/portfolio content — at **zero cost**, and behaves like a real assistant rather than a static FAQ.

## Core features

1. **Fully grounded in `resumeData.ts`.** The bot answers from the site's actual single source of truth (bio, skills, all 16 projects with tech/features/stats, career direction, education) — never from general knowledge about the world, and never inventing facts not present there. This mirrors the repo's existing honesty rule for the site content itself.

2. **Generative, not hardcoded — answers vary in wording every time.** A question like "who is Nitin" must not have one fixed, memorized string it always returns. The model is instructed to always compose its answer fresh from the underlying facts, in its own words, so two askers (or the same asker twice) get differently-phrased but factually-consistent answers — e.g. one reply might lead with "B.Tech student in Digital Transformation," another with "hands-on full-stack and AI builder." This is enforced by (a) never hardcoding canned response strings anywhere in the code for common questions, and (b) an explicit system-prompt instruction to vary phrasing/emphasis and not repeat itself verbatim, plus a non-zero sampling temperature so repeated identical questions don't produce identical output.

3. **Identity guard.** If asked about a named person who isn't Nitin (e.g. "what does Rahul study"), the bot must not guess or hallucinate — it responds with something like "Who is Rahul?" rather than inventing an answer about a stranger.

4. **Off-topic / jailbreak guard.** General trivia, unrelated coding help, or attempts to override its persona/system prompt get politely redirected back to portfolio topics rather than answered or complied with.

5. **A real personality, not a portfolio-bot voice.** It introduces itself as Nitin's *personal* assistant (not "portfolio assistant"), with a warm, witty, enthusiastic tone defined in the system prompt. The opening greeting shown when the chat is opened is itself generated fresh each time (not a static string) — the client sends a randomly-picked style hint ("lead with a question," "name-drop a project," "be playful," etc.) alongside the request, since sampling temperature alone wasn't enough to stop the model defaulting to "Hey there…" every time.

6. **Zero cost, structurally — not just by promise.** Built on the Gemini API free tier, called server-side using a `GEMINI_API_KEY` set as a Vercel environment variable (see `CLAUDE.md`) — never bundled into client code. As long as no billing account is attached to the key's project, Google cannot silently charge — it only rate-limits. No Ollama/local model: a locally-run model can't serve public site visitors without either an always-on personal machine (fragile/insecure) or a paid server (violates the zero-cost requirement); Ollama is only useful here for local prompt iteration during development, not production.
   - Model in use: `gemini-3.5-flash-lite` (the free-tier model `gemini-2.5-flash-lite` was retired for new API keys mid-build; Google's own API error pointed at the 3.5 successor, which is also free-tier).

## Components (Skills / Commands / Hooks)

Breaking the feature into its functional pieces, using the same skills/commands/hooks split as a Claude Code plugin's components — these aren't literal `.claude/` plugin files, this is a web feature, but the roles map cleanly:

- **Skill — the knowledge module.** ("What it knows and how it should behave.") A system-prompt builder that serializes the relevant parts of `resumeData.ts` (bio, skills, projects, career direction, education) into the model's system instructions on every request, plus the behavioral rules from Core Features above (grounding, phrasing variety, identity guard, off-topic guard). This is the piece that gets edited whenever resume content changes — no separate copy of the content is maintained, and it's the only place the bot's "personality" and rules live.

- **Command — the serverless endpoint + client trigger.** ("The action a visitor invokes.") `api/chat.ts`, a Vercel serverless function (deployed automatically — any file under `/api` becomes a route, no framework config needed), invoked by `ChatWidget.tsx` (the floating chat bubble/panel mounted in `App.tsx`, handling the message list, input, typing state, and error states). Takes the visitor's message plus a short rolling conversation history, calls the Gemini API with the Skill as system instructions, returns the reply. The API key never reaches the browser. The actual logic lives in `server/geminiClient.ts` (transport-agnostic — `api/chat.ts` just adapts it to Vercel's request/response shape).

- **Hook — the abuse guard.** ("Runs automatically around every request, not something a visitor triggers directly.") A lightweight in-memory per-IP rate limit (e.g. ~15 messages/hour) plus a daily request counter (`server/rateLimiter.ts`), so the shared free quota can't be exhausted by one bad actor or a scraping bot. Fires before the Command reaches Gemini; on exhaustion, the widget shows a friendly "back soon" message instead of a raw error — never a paid fallback. Note: since Vercel functions aren't one persistent process, this cap is per-instance, not a mathematically exact global limit — still a real, useful guard at this site's traffic level.

## What's done vs pending

**Done:**
- Confirmed deployment platform is **Vercel**, connected to this GitHub repo — pushing to `main` auto-deploys, no manual build/deploy step. (An earlier pass wrongly assumed Google AI Studio → Cloud Run based on a stale `metadata.json` capability flag; corrected once the actual deploy path was confirmed, which meant swapping the server from a persistent Express app to a Vercel serverless function under `/api`.)
- Chose Gemini's free tier over Ollama (not viable for a public always-on site) and over paid APIs (unnecessary for this scope); using `gemini-3.5-flash-lite` (see note above on the model swap).
- Confirmed `resumeData.ts` (~12k tokens) is small enough to inline in full as system-prompt context — no RAG/vector DB needed.
- Defined and implemented the behavioral spec: grounded answers, generative/varied phrasing (no hardcoded canned responses), a personal-assistant personality with a generated (not static) greeting, identity guard for other named people, off-topic/jailbreak redirection.
- Built the knowledge module (`server/knowledge.ts`), the Gemini client (`server/geminiClient.ts`), the Vercel function (`api/chat.ts`), the abuse-guard hook (`server/rateLimiter.ts`), and the client widget (`src/components/ChatWidget.tsx`, mounted in `App.tsx`).
- Verified: real project-detail questions answer correctly and vary in phrasing across repeats; the greeting varies in structure (not just word choice) across opens; a different-person name question returns "Who is X?"; an off-topic question and a jailbreak attempt are both declined and redirected; the scroll-hijacking bug where scrolling the chat panel scrolled the whole page (Lenis capturing the wheel event) was found and fixed with `data-lenis-prevent`; the `api/chat.ts` handler was verified directly (mock request/response, since `vercel dev` needs an interactive login this environment can't complete).

**Pending:**
- Push to `main` to deploy, and set `GEMINI_API_KEY` once in the Vercel dashboard (Project Settings → Environment Variables) — production won't answer chat requests without it.
- Optional follow-ups, not required for launch: streaming responses instead of a single request/response, and light markdown rendering in the widget (currently the model is instructed to avoid markdown entirely, which is simpler and sufficient).
