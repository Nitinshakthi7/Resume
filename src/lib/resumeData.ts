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
};

export type Featured = ProjectBase & {
  id: string;
  desc: string;
  highlights: string[];
  art: ArtKind;
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
];

export type ProjectKind = 'web' | 'ml' | 'game';

export type Minor = ProjectBase & {
  kind: ProjectKind;
  desc: string;
  cover?: string;
  badge?: string;
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
    name: 'Asset Generator',
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
        'Asset Generator (previously KOSMOS, an interior-design tool) is becoming a developer-facing level editor: define precise rectangular spaces, place catalog assets and export deterministic JSON that game engines like Unreal can consume.',
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
      'A deliberately unfair platformer: invisible spikes, vanishing platforms and fake goals, all designed to troll you.',
    desc: 'A brutally hard troll platformer: 10 levels of invisible spikes, fake platforms and rage messages.',
    tech: ['Python', 'Pygame', 'OOP'],
    link: `${GH}/Don-t-Even-Bother---Pure-Evil-Edition`,
    cover: '/projects/dontevenbother/cover.webp',
    gallery: [
      shot('dontevenbother', 'cover', 'Main menu with a persistent death counter'),
      shot('dontevenbother', 'level4', 'Level 4: fake goal blocks and hidden spikes'),
      shot('dontevenbother', 'level7', 'Level 7: moving saws'),
      shot('dontevenbother', 'death', 'One of 18 sarcastic death messages'),
      shot('dontevenbother', 'levels', 'Unlock-as-you-go level select'),
    ],
    details: {
      overview:
        'A rage-inducing precision platformer built for an object-oriented programming course. Every level is designed to break expectations: spikes appear without warning, platforms vanish, and the goal itself can kill you.',
      features: [
        '10 levels with increasing difficulty and progressive unlocking',
        'Invisible spikes, fake platforms, speed-shifting saws and fake goal blocks',
        '18 sarcastic death messages and a death counter saved between sessions',
        'Physics-based movement, camera shake, parallax backgrounds and sprite animation',
      ],
      build: [
        'Object-oriented Python / Pygame: separate classes for the player, traps, levels, UI and assets',
        'Fixed-resolution game surface scaled to any screen, with fullscreen toggle',
      ],
      stats: [
        { value: '10', label: 'levels' },
        { value: '18', label: 'death messages' },
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
  JavaScript: ['EcoSense India', 'GameVault', 'Smart Energy Tracker', 'AlgoViz'],
  TypeScript: ['IR-AIS', 'Asset Generator'],
  SQL: ['TimeGenius.AI'],
  React: ['EcoSense India', 'TimeGenius.AI', 'Asset Generator'],
  'Next.js': ['IR-AIS'],
  Vite: ['EcoSense India', 'Asset Generator', 'This portfolio'],
  'Tailwind CSS': ['TimeGenius.AI', 'This portfolio'],
  'Framer Motion': ['This portfolio'],
  'Node.js': ['EcoSense India', 'GameVault', 'Smart Energy Tracker'],
  'Express.js': ['EcoSense India', 'GameVault', 'Smart Energy Tracker'],
  Flask: ['TimeGenius.AI'],
  'REST APIs': ['GameVault', 'Smart Energy Tracker', 'EcoSense India', 'TimeGenius.AI'],
  JWT: ['GameVault', 'Smart Energy Tracker'],
  'OAuth 2.0': ['EcoSense India'],
  'Scikit-Learn': ['IR-AIS', 'Behavioral Threat Detection', 'Used Car Price & Insurance'],
  XGBoost: ['IR-AIS'],
  SMOTE: ['IR-AIS'],
  'K-Means': ['IR-AIS'],
  DBSCAN: ['Behavioral Threat Detection'],
  'Isolation Forest': ['Behavioral Threat Detection'],
  MongoDB: ['EcoSense India', 'GameVault', 'Smart Energy Tracker'],
  SQLite: ['TimeGenius.AI'],
  'Unreal Engine 5': ['Looped Lies'],
  Blueprints: ['Looped Lies'],
  Pygame: ["Don't Even Bother"],
  'Git/GitHub': ['Every project'],
  'Cron Jobs': ['EcoSense India'],
  Recharts: ['EcoSense India', 'IR-AIS'],
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
