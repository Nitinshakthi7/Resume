// Single source of truth for the site's content. Everything here is taken
// from the resume or verified on GitHub — keep it that way when editing.
import type { ArtKind } from '../components/ProjectArt';

export const GH = 'https://github.com/Nitinshakthi7';

// Screenshots live in /public/projects/<slug>/ and are real captures of each
// running project (ML projects show their own output charts).
export type Shot = { src: string; caption: string };

const shot = (slug: string, name: string, caption: string): Shot => ({
  src: `/projects/${slug}/${name}.webp`,
  caption,
});

// The expanded, click-to-open view of a project
export type ProjectDetails = {
  overview: string;
  features: string[];
  build: string[];
  stats?: { value: string; label: string }[];
  note?: string;
  role?: string; // for team projects: what the resume owner specifically contributed
};

type ProjectBase = {
  slug: string;
  name: string;
  category: string;
  summary: string; // one or two lines, shown on hover
  tech: string[];
  link?: string;
  gallery?: Shot[];
  details: ProjectDetails;
  badge?: string;
  live?: { url: string; label: string }; // a hosted/playable build, e.g. itch.io
  notDeployed?: boolean; // finished, but not hosted anywhere
};

// True only when the project is done (not WIP, no status pill) and has no live build.
export const showNotDeployed = (p: ProjectBase): boolean =>
  !!p.notDeployed && !p.live && !('wip' in p && p.wip) && !('status' in p && p.status);

export type Featured = ProjectBase & {
  id: string;
  desc: string;
  highlights: string[];
  art?: ArtKind;
  image?: string; // screenshot used on the card; falls back to the generated art
  status?: string;
  wip?: boolean; // shows a "Work in progress" band across the card image
};

export const featured: Featured[] = [
  {
    id: '01',
    slug: 'ecosense',
    name: 'EcoSense India',
    category: 'Full-Stack Platform',
    summary:
      'Weather and air quality for any place in India, with every source shown side by side and forecasts scored against what actually happened.',
    desc: 'An environmental intelligence platform that unifies weather, AQI and satellite data for any place in India.',
    highlights: [
      'Combines 10 data sources: ground stations, forecast models, satellites and reanalysis',
      'Express / MongoDB backend with scheduled collection, forecast and backfill jobs',
      'JWT + Google sign-in, map search down to locality level, 12h → 30d trend dashboards',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'MapTiler', 'Recharts'],
    art: 'ecosense',
    image: '/projects/ecosense/cover.webp',
    link: `${GH}/Ecosense`,
    status: 'Work in progress',
    gallery: [
      shot('ecosense', 'cover', 'Animated landing page with a day/night Indian skyline'),
      shot('ecosense', 'live', 'Live conditions: every reading shows its source and how much sources disagree'),
      shot('ecosense', 'map', 'Search or click anywhere in India, with plain-language trend insights'),
      shot('ecosense', 'forecast', '7-day forecasts by model, and which model has been most accurate here'),
      shot('ecosense', 'climate', '10-year climate: monthly normals, warming trend and a date explorer back to 1940'),
    ],
    details: {
      overview:
        'EcoSense shows the weather and air quality for any city, town, village or locality in India. Instead of blending readings into one number, it puts independent sources side by side (ground stations, global forecast models, satellites and reanalysis), flags when they disagree, and scores each forecast model against what actually happened.',
      features: [
        "Click any state, district, city or locality on the map; if there is no data at that exact spot, the nearest data point is used while keeping your place's name",
        '7-day forecasts from ECMWF, NOAA GFS, DWD ICON and MET Norway, each scored against ERA5 over the last 30 days',
        'Trend charts from 12 hours to 30 days, split by source, plus a correlation view',
        '10 years of records, monthly normals, the warming trend per decade and a date explorer back to 1940',
        'Plain-language insights: unusual readings (robust z-scores), fast trends, air-quality alerts and source disagreements',
        'Saved places, JWT and Google sign-in, automatic day/night theme from local sunrise, Excel/CSV export',
      ],
      build: [
        'Express + MongoDB API with one collector module per source and a registry that tracks which providers are live, failing or missing a key',
        'Scheduled jobs for hourly collection, daily forecasts and paced ERA5 / CAMS history backfill',
        'React + Vite frontend with MapTiler maps and Recharts; falls back to reading model data directly if the backend is offline',
        'Test suites on both ends (node:test and Vitest) run in a GitHub Actions CI pipeline',
      ],
      stats: [
        { value: '10', label: 'data sources' },
        { value: '4', label: 'forecast models scored' },
        { value: '1940', label: 'history goes back to' },
      ],
    },
  },
  {
    id: '02',
    slug: 'irais',
    name: 'IR-AIS',
    category: 'Machine Learning',
    summary:
      'Predicts whether a road accident will be slight, serious or fatal, and explains the risk behind it, from 12,316 Indian accident records.',
    desc: 'India Road Accident Intelligence System: predicts accident severity and segments high-risk conditions.',
    highlights: [
      'Slight / Serious / Fatal classification with 26 engineered features',
      'SMOTE for class imbalance; PCA + K-Means risk segmentation',
      'Interactive Next.js predictor and model-comparison dashboard',
    ],
    tech: ['Python', 'Scikit-Learn', 'XGBoost', 'imbalanced-learn', 'Next.js', 'TypeScript'],
    art: 'irais',
    image: '/projects/irais/cover.webp',
    link: `${GH}/IR-AIS-India-Road-Accident-Intelligence-System`,
    gallery: [
      shot('irais', 'cover', 'Hand-illustrated landing page'),
      shot('irais', 'playground', 'Model playground: compare classification, regression and auxiliary models'),
      shot('irais', 'scorecard', 'Radar comparison and full metric scorecard for every model'),
      shot('irais', 'eda', 'Exploratory data analysis dashboard'),
    ],
    details: {
      overview:
        'IR-AIS predicts the severity of a road accident (Slight, Serious or Fatal) from road, weather, lighting and driver conditions. The data is heavily imbalanced (84.6% slight, 1.3% fatal), so the work focused on making the models sensitive to rare, life-threatening cases rather than just scoring high accuracy.',
      features: [
        'Severity classification across 11 model variants (base and SMOTE-balanced), with Random Forest + SMOTE performing best',
        'Casualty-count regression and auxiliary models for cause, collision type and time of accident',
        'PCA to map the 26-dimensional feature space and K-Means to segment driver and environment risk profiles',
        'Model playground with radar charts and a sortable metric scorecard',
        'Live predictor: enter conditions and get a severity prediction from the trained model',
      ],
      build: [
        'Python pipeline for preprocessing, feature engineering, SMOTE balancing, training and tuning, producing serialized models and JSON metrics',
        'Next.js 15 + TypeScript dashboard with Recharts, calling the Python models through a Node-to-Python bridge',
        'Auto-generated analysis report comparing every model',
      ],
      stats: [
        { value: '12,316', label: 'accident records' },
        { value: '84%', label: 'accuracy (RF + SMOTE)' },
        { value: '0.786', label: 'weighted F1' },
      ],
    },
  },
  {
    id: '03',
    slug: 'threat',
    name: 'Behavioral Threat Detection',
    category: 'Cybersecurity · ML',
    summary:
      'Finds suspicious network sessions without being told what an attack looks like, by combining three anomaly detectors.',
    desc: 'An unsupervised framework that surfaces suspicious network behaviour without labelled attacks.',
    highlights: [
      'Analysed 175K+ UNSW-NB15 network sessions',
      'DBSCAN + Isolation Forest with anomaly-consensus scoring',
      'Apriori association rules to explain behavioural patterns',
    ],
    tech: ['Python', 'Scikit-Learn', 'K-Means', 'DBSCAN', 'Isolation Forest', 'Apriori'],
    art: 'threat',
    image: '/projects/threat/cover.webp',
    link: `${GH}/Network-Behavior-and-Cybersecurity-Pattern-Analysis-Using-Unsupervised-Learning`,
    gallery: [
      shot('threat', 'cover', 'Isolation Forest SOC dashboard with a top-20 priority queue'),
      shot('threat', 'rules', 'Association rules explaining which behaviours occur together'),
      shot('threat', 'silhouette', 'Choosing K by silhouette score'),
      shot('threat', 'clusters', 'Behavioural cluster sizes: rare clusters are flagged'),
      shot('threat', 'dbscan', 'DBSCAN density-based anomaly summary'),
    ],
    details: {
      overview:
        'A behavioural threat-detection framework built on the UNSW-NB15 benchmark. All modelling is unsupervised: attack labels are used only afterwards, to check whether the behavioural clusters line up with real attack categories. The output is a ranked queue a security analyst could work through.',
      features: [
        'Behavioural features engineered from raw flows: outbound-dominance ratio, packet rate, bytes per packet and packet asymmetry',
        'K-Means segmentation into 10 behavioural clusters (K chosen by silhouette score); rare clusters flagged',
        'DBSCAN for density anomalies and Isolation Forest for global outliers, each flagging about 4% of sessions',
        'Custom Apriori implementation to mine explainable rules, e.g. "TCP + high packet rate → high outbound dominance"',
        'Multi-method consensus: sessions flagged by several detectors are ranked highest, cutting false positives',
      ],
      build: [
        'Modular Python pipeline: preprocessing, feature engineering, clustering, anomaly detection, association mining, reporting',
        'Post-hoc validation with cluster purity and Adjusted Rand Index against the held-out labels',
        'Dark "SOC dashboard" style plots and CSV reports for the analyst queue',
      ],
      stats: [
        { value: '175,341', label: 'sessions analysed' },
        { value: '7,014', label: 'flagged by Isolation Forest' },
        { value: '2,918', label: 'flagged by two detectors' },
      ],
      note: 'UNSW-NB15 is a lab-generated research benchmark, not production traffic.',
    },
  },
  {
    id: '04',
    slug: 'loopedlies',
    name: 'Looped Lies',
    category: 'Game Development',
    summary: 'A solo-built narrative action-adventure in Unreal Engine 5 where you relive the same day, again and again.',
    desc: 'A solo-developed 15–20 hour narrative action-adventure in Unreal Engine 5, built around a time loop.',
    highlights: [
      '16,500-word story across five acts with three endings',
      'Stealth, branching dialogue, moral alignment and save/load systems',
      '1,341-line technical development guide',
    ],
    tech: ['Unreal Engine 5', 'C++', 'Blueprints', 'Nanite', 'Lumen'],
    art: 'looped',
    status: 'In development',
    wip: true,
    details: {
      overview:
        'Looped Lies is a narrative action-adventure I am building solo in Unreal Engine 5. The story is structured around a 742-iteration time loop, across five acts with three possible endings.',
      features: [
        '16,500-word original script across five acts',
        'Stealth, branching dialogue and a moral-alignment system that shapes which ending you reach',
        'Save/load system designed around the time loop',
      ],
      build: [
        'Unreal Engine 5 with C++ and Blueprints, using Nanite geometry and Lumen lighting',
        "A 1,341-line technical development guide documenting the game's systems",
      ],
      stats: [
        { value: '5', label: 'acts' },
        { value: '3', label: 'endings' },
        { value: '742', label: 'loop iterations' },
      ],
      note: 'In active development. Screenshots coming soon.',
    },
  },
  {
    id: '05',
    slug: 'merchantos',
    name: 'MerchantOS',
    category: 'Hackathon · Fintech Agent',
    summary:
      'An agent that watches for failed payments, works out why they failed, and decides — within strict policy limits — whether to retry or nudge the customer.',
    desc: 'A Razorpay Buildathon submission: a policy-bounded agent loop that recovers failed payments end to end, with a full audit trail.',
    highlights: [
      'Five-stage agent loop: Detect → Diagnose → Decide → Act → Verify, every step written to an audit trail',
      'Swappable Razorpay clients: the official SDK, or a deterministic in-memory simulator',
      'Live dashboard: KPIs and charts, recovery cases, audit trail and run controls',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'Recharts'],
    link: `${GH}/MerchantOS`,
    badge: 'Razorpay Buildathon',
    notDeployed: true,
    details: {
      overview:
        'Built for the Razorpay Buildathon, MerchantOS watches for failed payments and abandoned checkouts, classifies why each one failed, and makes a bounded recovery decision — retry, send a payment link, or hold back — before verifying the outcome. Every decision is policy-limited and logged.',
      features: [
        'Opens a recovery case for each failed payment or abandoned checkout',
        'Each case runs through five stages, with a timestamped audit trace for every step',
        'Respects opt-outs: in a simulated 50-case run, opted-out customers were correctly held back instead of contacted',
        "The dashboard's Controls tab injects a test payment event and the case list updates live",
        'An LLM step for advisory copy falls back to deterministic rules when no model is configured, and the audit log records which path ran',
      ],
      build: [
        'Prisma schema with 5 tables (Customer, RecoveryCase, AuditLog, WebhookEvent, MetricsSnapshot) on SQLite',
        'A client interface with a LiveRazorpayClient (wraps the real SDK) and a SimulatedRazorpayClient (deterministic in-memory emulator)',
        '8 API routes; Zustand and TanStack Query on the client; a 5-tab dashboard (Overview, Cases, Audit Trail, Policy, Controls)',
      ],
      stats: [
        { value: '5', label: 'agent loop stages' },
        { value: '62.9%', label: 'recovered in a simulated 50-case run' },
        { value: '8', label: 'API routes' },
      ],
      note: 'Built for the Razorpay Buildathon. Runs end to end against a simulated Razorpay; it has not been connected to live payments or deployed.',
    },
  },
  {
    id: '06',
    slug: 'mysterydesk',
    name: 'MysteryDesk',
    category: 'Game · Full-Stack',
    summary:
      'A detective game where you read case files, question suspects, link evidence and name the culprit, with five endings worked out from what you actually did.',
    desc: 'A full-stack detective investigation game with five cases, branching interrogations and a server-derived contradiction engine — built with a four-person team.',
    highlights: [
      'Team of four: I rebuilt a one-case prototype into the full five-case game',
      'Contradictions between testimony and evidence are computed at query time, so the answer key is never stored',
      'Five endings derived from the player’s actual investigation, not pre-written per case',
    ],
    tech: ['React', 'Vite', 'Node.js', 'Express', 'SQLite', 'GSAP'],
    link: 'https://github.com/TejashRajuKV/Mystery_Desk',
    badge: 'Team of 4',
    notDeployed: true,
    details: {
      overview:
        'MysteryDesk is a detective investigation game: read case files, travel between locations, interview suspects through branching dialogue, link evidence on an investigation board, and submit a final accusation. What actually happened, and which of five endings you get, is worked out from the investigation you ran — nothing is pre-written per playthrough.',
      features: [
        '5 cases, each with 5 suspects, 6 locations and 12–18 pieces of evidence',
        'Every action costs in-game time; once the clock runs out, only an accusation is left',
        'Branching interrogations that unlock or lock off depending on evidence viewed and earlier answers',
        'An investigation board for linking evidence, and a rule-based Detective’s Notes assistant (no LLM, no network call)',
        'Five named endings (Perfect Investigation, True Criminal, Criminal Escapes, Wrong Suspect, Innocent Accused) computed from the actual playthrough',
        'SVG portraits generated from mood and posture data; all audio synthesised with the Web Audio API — no art or audio files shipped',
      ],
      build: [
        'Express backend on Node 22’s built-in node:sqlite (no ORM), reseeded from JSON case files on every start — no game data lives in the frontend',
        'Four kinds of statement-vs-evidence claim matching for contradiction detection; dialogue trees checked for reachability at seed time',
        'Clock and investigation progress kept server-side, so a case survives page refreshes and server restarts',
        'React 18 + Vite + react-router + GSAP, with hand-written CSS design tokens (no UI framework)',
        '49 documented QA test cases; manual playthroughs reached all five endings',
      ],
      stats: [
        { value: '5', label: 'cases' },
        { value: '5', label: 'endings' },
        { value: '49', label: 'QA test cases' },
      ],
      role: 'A four-person team project for the AI Augmented Software Development course. A teammate built the original single-case prototype. I rebuilt and expanded it into the full five-case game — the additional cases, the contradiction engine, the branching dialogue and the ending logic — and added Claude Code agents to the team’s development pipeline. Teammates handled edge cases and the project’s CLAUDE.md, hooks, skills and test agents.',
    },
  },
];

export type ProjectKind = 'web' | 'ml' | 'game';

export type Minor = ProjectBase & {
  kind: ProjectKind;
  desc: string;
  cover?: string;
  wip?: boolean;
};

export const more: Minor[] = [
  {
    slug: 'timegenius',
    name: 'TimeGenius.AI',
    kind: 'ml',
    category: 'Hackathon · Optimisation',
    summary: 'Generates clash-free university timetables in seconds using a constraint solver.',
    desc: 'Conflict-free timetables for 50+ courses in under 3 seconds, with PDF/Excel export.',
    tech: ['Flask', 'OR-Tools', 'React', 'SQLite'],
    badge: 'CICADA Hackathon',
    link: `${GH}/TimeGenius-AI`,
    notDeployed: true,
    cover: '/projects/timegenius/cover.webp',
    gallery: [
      shot('timegenius', 'cover', 'Landing page'),
      shot('timegenius', 'timetable', "A generated timetable with the solver's summary"),
      shot('timegenius', 'dashboard', 'Dashboard for faculty, courses and rooms'),
    ],
    details: {
      overview:
        "Built at the CICADA Hackathon, TimeGenius turns hours of manual timetabling into a single click. Faculty, courses and rooms are entered once, and a constraint solver produces a schedule with no clashes, aligned with India's NEP 2020 course types.",
      features: [
        'Manage faculty (with workload limits), courses (NEP 2020 types: Major, Minor, Multidisciplinary…) and rooms',
        'One-click generation of a conflict-free weekly timetable',
        'Summary of classes scheduled, room utilisation and workload checks',
        'Export to PDF and Excel',
      ],
      build: [
        'Google OR-Tools CP-SAT solver with five constraint types: course hours, faculty clashes, room clashes, workload caps and availability',
        'Flask REST API with JWT auth and SQLite storage',
        'React + Vite + Tailwind frontend with Framer Motion',
      ],
      stats: [{ value: '< 3 s', label: 'for 50+ courses' }],
    },
  },
  {
    slug: 'assetgen',
    name: 'KOSMOS',
    kind: 'web',
    category: 'Tool · Level Design',
    summary: 'A level editor for building engine-ready interior spaces and reusable parametric assets.',
    desc: 'Author rooms, place catalog assets and design parametric asset definitions, exported as deterministic JSON for game engines.',
    tech: ['React', 'TypeScript', 'Vite', 'Gemini API'],
    wip: true,
    link: `${GH}/Its-a-Asset-Generator`,
    cover: '/projects/assetgen/cover.webp',
    gallery: [
      shot('assetgen', 'cover', 'Landing page'),
      shot('assetgen', 'hub', 'Three workflows: design a room, import one, or define a custom asset'),
      shot('assetgen', 'editor', 'Room editor with a furniture catalog and properties panel'),
    ],
    details: {
      overview:
        'KOSMOS started as an interior-design tool and is becoming a developer-facing level editor: define precise rectangular spaces, place catalog assets and export deterministic JSON that game engines like Unreal can consume.',
      features: [
        'Room setup by type and exact dimensions, with walls generated automatically',
        '2D drag-and-drop canvas with snapping, undo/redo and a properties panel',
        'Built-in furniture catalog, plus custom parametric asset definitions',
        'Import and export rooms as JSON, with migration from older file versions',
        'Gemini-powered product suggestions and design advice',
      ],
      build: [
        'React + TypeScript + Vite, with utilities for wall generation, parameter resolution and catalog management',
        'Versioned export schema with migration helpers for backward compatibility',
        'Asset definitions include hints for Unreal Blueprint paths',
      ],
      note: 'Work in progress: the 3D view and full parametric editing are still being built.',
    },
  },
  {
    slug: 'algoviz',
    name: 'AlgoViz',
    kind: 'web',
    category: 'Education · Algorithms',
    summary:
      'Step through 59 algorithms and data-structure operations, with animated visuals and the code running line by line.',
    desc: 'An interactive DSA visualizer and theory studio covering 59 topics across 8 categories.',
    tech: ['JavaScript', 'HTML', 'CSS', 'SVG'],
    link: `${GH}/AlgoViz`,
    notDeployed: true,
    cover: '/projects/algoviz/cover.webp',
    gallery: [
      shot('algoviz', 'cover', 'Landing page with a live sorting preview'),
      shot('algoviz', 'tree', 'Building a binary tree step by step'),
      shot('algoviz', 'sorting', 'Quick Sort with the executing line and pointers at each step'),
      shot('algoviz', 'studio', 'Code & Theory Studio: 59 searchable topics'),
    ],
    details: {
      overview:
        'AlgoViz is a single-file interactive learning tool for data structures and algorithms. Enter your own numbers, then step forwards and backwards through each operation while the matching line of code, variables and pointers update alongside the animation.',
      features: [
        '59 topics across sorting, arrays, binary trees, BSTs, traversals, stacks, linked lists and queues',
        'Step, play and rewind with a live execution log and the current code line highlighted',
        'Array cards or bar charts, and dynamic SVG tree drawings',
        'Code & Theory Studio with 7 tabs per topic: intuition, Python code, pseudocode, line-by-line breakdown, worked trace, theory and a quiz',
      ],
      build: [
        'Framework-free HTML, CSS and JavaScript in a single file',
        'Each algorithm records a sequence of states, which the player then renders frame by frame',
      ],
      stats: [
        { value: '59', label: 'topics' },
        { value: '8', label: 'categories' },
        { value: '7', label: 'lesson tabs per topic' },
      ],
    },
  },
  {
    slug: 'gamevault',
    name: 'GameVault',
    kind: 'web',
    category: 'Full-Stack · API',
    summary: 'A personal game library with a collection, a wishlist and filters, backed by a secured REST API.',
    desc: '15+ REST endpoints in an MVC architecture with JWT auth, collections, wishlists and cascade deletes.',
    tech: ['Express', 'MongoDB', 'JWT', 'HTML/CSS/JS'],
    link: `${GH}/GameVault`,
    notDeployed: true,
    cover: '/projects/gamevault/cover.webp',
    gallery: [
      shot('gamevault', 'cover', 'Landing page'),
      shot('gamevault', 'grid', 'Game library with genre-coloured cover art'),
      shot('gamevault', 'library', 'Filter by platform, genre and top rated'),
    ],
    details: {
      overview:
        'GameVault lets users build a shared game library and keep their own collection and wishlist. The focus is a clean, well-validated REST API that the static frontend and Postman both use.',
      features: [
        'Register and log in; add games with optional poster art',
        'Filter by platform, genre and top rating',
        'Personal collection (owned) and wishlist',
        'Bulk insertion and cascade deletion',
      ],
      build: [
        'Node.js + Express in an MVC structure, with Mongoose models and request validators',
        'JWT auth middleware, central error handling and request logging',
        'Static HTML/CSS/JS frontend; full Postman collection for the API',
      ],
      stats: [{ value: '15+', label: 'REST endpoints' }],
    },
  },
  {
    slug: 'usedcar',
    name: 'Used Car Price & Insurance',
    kind: 'ml',
    category: 'Machine Learning',
    summary: "Predicts a used car's price and whether it is insured, comparing six models on Indian market data.",
    desc: 'Six-algorithm comparison over 2,805 records: R² 0.883 on price, 81% on insurance status.',
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'GridSearchCV'],
    link: `${GH}/Used-Car-Price-and-Insurance-Prediction`,
    cover: '/projects/usedcar/cover.webp',
    gallery: [
      shot('usedcar', 'cover', 'Tuned Decision Tree predictions and feature importance'),
      shot('usedcar', 'predicted', 'Actual vs predicted price (R² = 0.883)'),
      shot('usedcar', 'importance', 'Engine capacity and make year drive 82% of the prediction'),
      shot('usedcar', 'confusion', 'Insurance-status confusion matrix (Logistic Regression)'),
    ],
    details: {
      overview:
        'An end-to-end supervised learning pipeline on 2,805 pre-owned car listings. It predicts selling price (regression) and insurance status (classification), comparing three models for each task.',
      features: [
        'Regression: Linear Regression, KNN and a GridSearchCV-tuned Decision Tree for price',
        'Classification: Logistic Regression, Decision Tree and KNN for insurance status',
        'Leakage-prone columns (overall cost, registration details) removed before modelling',
        'Feature-importance analysis of what drives price',
      ],
      build: [
        'Modular Python pipeline (preprocessing, regression, classification) with saved models and scalers',
        'Hyperparameter tuning with GridSearchCV; plots generated automatically',
      ],
      stats: [
        { value: '0.883', label: 'R² on price' },
        { value: '81%', label: 'insurance accuracy' },
        { value: '2,805', label: 'records' },
      ],
    },
  },
  {
    slug: 'energy',
    name: 'Smart Energy Tracker',
    kind: 'web',
    category: 'Full-Stack · API',
    summary: 'Tracks home electricity use per room and device, with cost, carbon and 24-hour usage charts.',
    desc: 'Home → Room → Device → Reading hierarchy with authenticated REST APIs and cost analytics.',
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    link: `${GH}/Smart-Energy-Usage-Tracker`,
    notDeployed: true,
    cover: '/projects/energy/cover.webp',
    gallery: [
      shot('energy', 'cover', 'Landing page'),
      shot('energy', 'dashboard', 'Dashboard: top consumers and a 24-hour timeline'),
      shot('energy', 'meter', 'Live energy meter'),
    ],
    details: {
      overview:
        'A full-stack app for tracking household electricity. Users model their home as rooms and devices, submit readings, and see usage, cost and carbon footprint over time.',
      features: [
        'Home → Room → Device → Reading data model',
        "Dashboard with a live meter, today's usage and cost, carbon footprint and a tracking streak",
        'Top energy consumers and a 24-hour timeline; history and heatmap endpoints',
        'Alerts and recommendations',
      ],
      build: [
        'Express + Mongoose API with JWT auth and input validation',
        'Batch endpoint to generate 24 hours of readings for testing',
        'Static HTML/CSS/JS frontend with charts',
      ],
    },
  },
  {
    slug: 'dontevenbother',
    name: "Don't Even Bother",
    kind: 'game',
    category: 'Game · Pygame',
    summary:
      'A troll platformer that lies to you: 19 levels across three acts, a Brutal mode with no checkpoints anywhere, a solver bot you can race, and a narrator who calls you by name.',
    desc: 'A merciless troll platformer: 19 levels, two difficulty modes, a bot to race, and every pixel and sound generated at runtime.',
    tech: ['Python', 'Pygame', 'NumPy', 'OOP'],
    link: `${GH}/Don-t-Even-Bother---Pure-Evil-Edition`,
    live: { url: 'https://lazyhunter7.itch.io/dont-even-bother', label: 'Play on itch.io' },
    cover: '/projects/dontevenbother/cover.webp',
    gallery: [
      shot('dontevenbother', 'cover', 'Title screen: your name, your lifetime deaths and the character you are wearing'),
      shot('dontevenbother', 'difficulty', 'Normal or Brutal — progress is saved separately for each'),
      shot('dontevenbother', 'levels', 'Act-based level select with a rank and a best time for every level'),
      shot('dontevenbother', 'machines', 'Act II: ceiling lasers fire in rolling waves over a checkpoint'),
      shot('dontevenbother', 'climb', 'Act III: a vertical tower with an altitude meter'),
      shot('dontevenbother', 'race', "Race the Bot — the solver's verified run replays live beside you"),
      shot('dontevenbother', 'cleared', 'Clearing a level ranks it and itemises the Spite it paid out'),
      shot('dontevenbother', 'skins', '14 characters, each a different shape, face and headgear'),
      shot('dontevenbother', 'awards', '12 achievements, most of them earned by accident'),
      shot('dontevenbother', 'death', 'The narrator picks its taunt from how you died — and uses your name'),
    ],
    details: {
      overview:
        'A rage platformer that started as an object-oriented programming project and kept growing. Every trap is deterministic — the same thing happens on every attempt, so a level is learnable — and the game is deliberately built to break the expectations it just taught you: the floor is fake, the door runs away, and the narrator comments on each death.',
      features: [
        '19 levels in three acts: 10 hand-drawn troll maps, 8 long Gauntlet runs of 160–300 tiles, and a vertical Only Up-style Climb',
        'Normal and Brutal modes with separate saves — Brutal removes every checkpoint, speeds hazards up 25–30% and layers extra traps into each map',
        'Traps that lie: fake ground, crumbling floors, hidden spikes, fake walls and doors, reversed controls and lights-out sections',
        'Creatures and machines with their own behaviour: patrolling crawlers, mimics that jump exactly when you jump, ceiling swoopers, aiming sentries, lasers, cannons, conveyors, ice, and an echo that replays your last few seconds and chases you with it',
        'A narrator with 86 taunts chosen by how you died, that notices when you die on the same spot twice and calls you by the name you typed at the start',
        "Race the Bot: the solver's verified run replays live beside you, so every level has a par time that is provably achievable",
        'Spite, a currency paid for clean clears, better times and finished acts (dying pays one coin, capped, so farming deaths never pays), spent on 14 characters — 4 bought, the rest earned — alongside 12 achievements',
        'Every graphic, sound effect and all five music tracks are synthesised at startup — the game ships no art or audio files',
      ],
      build: [
        'Deterministic simulation: physics runs at a fixed 120 Hz and World holds a level’s rules with no drawing or sound, emitting events the scene turns into juice',
        'Class hierarchy from an abstract Entity — blocks, hazards, creatures, doors, checkpoints; Act I levels are ASCII maps with a scripting layer, and the long levels are glued together from reusable chunks',
        'Fourteen scenes behind one stack — title, name entry, mode select, difficulty, act cards, level select, skins and awards, settings, credits, play and race — with fades; paged tile rendering and spatial buckets keep the 300-tile levels fast',
        'Dev tools ship a best-first search bot that plays the real simulation to beat levels and saves its inputs; those recordings become both the bot you race and the fixtures an 84-test unittest suite replays',
        'Payout rules and cosmetics live in their own modules as pure functions over plain numbers, so the economy can be tested without starting pygame or touching a save',
        'Keyboard, mouse and gamepad input on a fixed 1280×720 canvas scaled to any display',
      ],
      stats: [
        { value: '19', label: 'levels across three acts' },
        { value: '86', label: 'narrator taunts' },
        { value: '0', label: 'art or audio files' },
      ],
    },
  },
  {
    slug: 'stationquest',
    name: 'Station Quest',
    kind: 'game',
    category: 'Game · Text Adventure',
    summary: 'Trapped on a space station with 30 moves to escape, typing plain-English commands into a retro terminal.',
    desc: 'A text-based escape room built in Figma Make: six rooms, a natural-language command parser, and a 22-step optimal escape.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Figma Make'],
    link: `${GH}/StationQuestGameDevelopment`,
    notDeployed: true,
    details: {
      overview:
        'Station Quest is a text-based escape room built with Figma Make: trapped on Station Sigma, you have 30 moves to get out, typing plain-English commands ("grab the keycard", "swipe the badge") into a retro terminal.',
      features: [
        '6 connected rooms and a 30-step move budget, with an optimal 22-step escape route',
        'A natural-language parser covering 16 verb groups and about 58 item/object aliases',
        'CRT terminal UI: blinking cursor, arrow-key command history, a live backpack sidebar and an animated step counter',
        'Puzzle chain gated by item dependencies and story flags',
      ],
      build: [
        'Built in Figma Make as a React, TypeScript and Tailwind CSS app',
        'Parser, engine and world kept as separate modules so the parser could later be swapped for an LLM without touching game logic',
        'Immutable state: every action is validated against current state before being applied',
      ],
      stats: [
        { value: '6', label: 'rooms' },
        { value: '30', label: 'step budget' },
        { value: '22', label: 'steps, best route' },
      ],
    },
  },
  {
    slug: 'snakeladder',
    name: 'Snake & Ladder Quiz',
    kind: 'game',
    category: 'Game · Web',
    summary: 'Two-player Snake & Ladder where a trivia question decides whether you climb the ladder or dodge the snake.',
    desc: 'A vanilla-JS board game with quiz-gated movement and true-random dice from an external API.',
    tech: ['JavaScript', 'HTML/CSS', 'Open Trivia DB', 'Random.org'],
    link: `${GH}/Snake-and-Ladder-Quiz-Game`,
    badge: 'Course final project',
    notDeployed: true,
    details: {
      overview:
        'A two-player, browser-based Snake & Ladder game with trivia mixed into the core mechanic: landing on a snake or ladder triggers a quiz question, and a correct answer decides whether you climb or dodge.',
      features: [
        'Two-player turn-based play with position tracking on a 10×10 board',
        'Quiz questions pulled live from the Open Trivia Database, gating every snake and ladder',
        'True-random dice rolls from the Random.org API instead of Math.random',
        'Responsive 3-column layout, with player tokens offset when they land on the same square',
      ],
      build: [
        'Framework-free HTML, CSS and JavaScript — no build step, no dependencies',
        'HTML-entity decoding and answer shuffling on API responses; a network-error fallback on the dice API',
      ],
    },
  },
  {
    slug: 'kanban',
    name: 'Kanban Board',
    kind: 'web',
    category: 'Full-Stack · AI-Assisted Build',
    summary: 'A full-featured Kanban board built entirely from prompts, comparing two ways of directing an AI coding agent.',
    desc: 'Boards, columns, cards, labels and roles, with drag-and-drop, an activity log and auth — built prompt-only as a course exercise.',
    tech: ['Next.js', 'React', 'TypeScript', 'Prisma', 'NextAuth.js', 'Tailwind CSS'],
    link: `${GH}/Kanban-Just-Prompts`,
    badge: 'Course project',
    notDeployed: true,
    details: {
      overview:
        'Built for the AI Augmented Software Development university course, which compared building the same app two ways: guided by a pre-written CLAUDE.md, or from prompts alone. This is the prompts-only build — a genuinely full-featured Kanban board, not a shallow scaffold.',
      features: [
        'Full CRUD for boards, columns, cards and labels, with drag-and-drop reordering',
        'Board membership with four roles: Owner, Admin, Member, Viewer',
        'Activity log covering 10+ event types (moved, priority changed, assignee changed, archived…)',
        'Credential auth with bcrypt-hashed passwords, rate limiting, dark mode and dashboard stats',
        'Mobile-responsive: dialogs on desktop become drawers on mobile',
      ],
      build: [
        '20+ API routes and an 8-model Prisma schema (SQLite by default, Postgres-capable)',
        'Zustand and TanStack Query on the client, Zod validation, shadcn/ui on Radix',
        'Work flowed through spec-reader and project-planner agents into an orchestrating session — the same pipeline this portfolio is maintained with',
      ],
      stats: [
        { value: '20+', label: 'API routes' },
        { value: '8', label: 'data models' },
        { value: '4', label: 'access roles' },
      ],
    },
  },
];

export type Project = Featured | Minor;

export const allProjects: Project[] = [...featured, ...more];

// ---------------------------------------------------------------------------
// Skills. `usedIn` maps a skill to the projects above that actually use it,
// so the Expertise section can back every claim with a project.
export type SkillGroup = { category: string; items: string[] };

export const skills: SkillGroup[] = [
  { category: 'LANGUAGES', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'] },
  { category: 'FRONTEND', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts'] },
  { category: 'BACKEND', items: ['Node.js', 'Express.js', 'Flask', 'REST APIs', 'JWT', 'OAuth 2.0'] },
  { category: 'AI & ML', items: ['Scikit-Learn', 'XGBoost', 'SMOTE', 'K-Means', 'DBSCAN', 'Isolation Forest'] },
  { category: 'DATABASES', items: ['MongoDB', 'Mongoose', 'Prisma', 'SQLite', 'Redis'] },
  { category: 'GAME DEV', items: ['Unreal Engine 5', 'Blueprints', 'Pygame'] },
  { category: 'TOOLS', items: ['Git/GitHub', 'Postman', 'Blender', 'Cron Jobs', 'Vercel'] },
];

export const usedIn: Record<string, string[]> = {
  Python: ['IR-AIS', 'Behavioral Threat Detection', 'Used Car Price & Insurance', 'TimeGenius.AI', "Don't Even Bother"],
  JavaScript: ['EcoSense India', 'GameVault', 'Smart Energy Tracker', 'AlgoViz', 'MysteryDesk', 'Snake & Ladder Quiz'],
  TypeScript: ['IR-AIS', 'KOSMOS', 'MerchantOS', 'Station Quest', 'Kanban Board'],
  SQL: ['TimeGenius.AI'],
  'HTML/CSS': ['AlgoViz', 'GameVault', 'Smart Energy Tracker', 'Snake & Ladder Quiz'],
  React: ['EcoSense India', 'TimeGenius.AI', 'KOSMOS', 'MysteryDesk', 'MerchantOS', 'Station Quest', 'Kanban Board'],
  'Next.js': ['IR-AIS', 'MerchantOS', 'Kanban Board'],
  Vite: ['EcoSense India', 'KOSMOS', 'This portfolio', 'MysteryDesk', 'Station Quest'],
  'Tailwind CSS': ['TimeGenius.AI', 'This portfolio', 'MerchantOS', 'Station Quest', 'Kanban Board'],
  'Framer Motion': ['This portfolio'],
  'Node.js': ['EcoSense India', 'GameVault', 'Smart Energy Tracker', 'MysteryDesk'],
  'Express.js': ['EcoSense India', 'GameVault', 'Smart Energy Tracker', 'MysteryDesk'],
  Flask: ['TimeGenius.AI'],
  'REST APIs': ['GameVault', 'Smart Energy Tracker', 'EcoSense India', 'TimeGenius.AI', 'MysteryDesk', 'MerchantOS', 'Kanban Board'],
  JWT: ['GameVault', 'Smart Energy Tracker'],
  'OAuth 2.0': ['EcoSense India'],
  'Scikit-Learn': ['IR-AIS', 'Behavioral Threat Detection', 'Used Car Price & Insurance'],
  XGBoost: ['IR-AIS'],
  SMOTE: ['IR-AIS'],
  'K-Means': ['IR-AIS'],
  DBSCAN: ['Behavioral Threat Detection'],
  'Isolation Forest': ['Behavioral Threat Detection'],
  MongoDB: ['EcoSense India', 'GameVault', 'Smart Energy Tracker'],
  Prisma: ['MerchantOS', 'Kanban Board'],
  SQLite: ['TimeGenius.AI', 'MysteryDesk', 'MerchantOS', 'Kanban Board'],
  'Unreal Engine 5': ['Looped Lies'],
  Blueprints: ['Looped Lies'],
  Pygame: ["Don't Even Bother"],
  'Git/GitHub': ['Every project'],
  'Cron Jobs': ['EcoSense India'],
  Recharts: ['EcoSense India', 'IR-AIS', 'MerchantOS'],
};

export function projectsForGroup(group: SkillGroup) {
  return [...new Set(group.items.flatMap((s) => usedIn[s] ?? []))];
}

// ---------------------------------------------------------------------------
// Journey. Project dates are when each repo was first published on GitHub.
export type Milestone = { when: string; title: string; detail: string; tags?: string[]; current?: boolean };

export const journey: Milestone[] = [
  {
    when: '2024',
    title: 'Started B.Tech at Atria University',
    detail: 'Digital Transformation, with a minor in AI & Machine Learning. Completed PUC at New Horizon the same year.',
    tags: ['Atria University', 'AI/ML minor'],
  },
  {
    when: 'Late 2025',
    title: 'Games and backend foundations',
    detail: 'Shipped Python games — a console Pac-Man and a brutally hard Pygame platformer — then moved to REST backends with JWT auth.',
    tags: ["Don't Even Bother", 'Smart Energy Tracker', 'GameVault'],
  },
  {
    when: 'Early 2026',
    title: 'Into machine learning',
    detail: 'Unsupervised threat detection on 175K+ network sessions, a six-model used-car study, then IR-AIS accident-severity prediction.',
    tags: ['Behavioral Threat Detection', 'Used Car Price & Insurance', 'IR-AIS'],
  },
  {
    when: '2026',
    title: 'Full-stack platforms at scale',
    detail: 'EcoSense India — a platform combining 7+ live data APIs with pipelines, caching, OAuth and GIS dashboards.',
    tags: ['EcoSense India'],
  },
  {
    when: 'Now',
    title: 'Building Looped Lies in Unreal Engine 5',
    detail: 'A solo 15–20 hour narrative game: five acts, three endings and a 742-iteration time loop.',
    tags: ['Looped Lies'],
    current: true,
  },
  {
    when: '2028',
    title: 'Expected graduation',
    detail: 'B.Tech in Digital Transformation, Atria University.',
  },
];

// Career direction, from the resume
export const direction = {
  want: 'Real products, difficult engineering problems and technology with practical impact — especially full-stack product engineering, AI/ML applications, backend systems, data-driven products, automation and game technology.',
  grow: 'Teams that value curiosity, experimentation, engineering depth and ownership — where I can learn from strong engineers while owning meaningful parts of a product.',
  goal: 'Take a problem from idea → architecture → implementation → intelligent system → finished product.',
};

export const EMAIL = 'nitinshakthi7@gmail.com';
