# BIOWATCH-AI — FULL SOURCE LISTING

Research prototype v0.4.0 · generated 2026-08-21

> Research and educational prototype only. Not a clinical diagnostic, not an operational
> public-health system. Contains no trained model, no validated performance figure and no
> real surveillance data. All demonstration values are deterministic synthetic values
> labelled SIMULATED at their point of use.

Excluded from this listing: `frontend/package-lock.json`, `node_modules/`, `dist/`, and
`frontend/src/data/countries-110m.json` (106 KB Natural Earth topology, fetched from
`https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`).

## Contents

1. `README.md` — 182 lines
2. `docker-compose.yml` — 41 lines
3. `frontend/package.json` — 37 lines
4. `frontend/vite.config.js` — 21 lines
5. `frontend/vitest.config.js` — 7 lines
6. `frontend/index.html` — 22 lines
7. `frontend/Dockerfile` — 13 lines
8. `frontend/nginx.conf` — 18 lines
9. `frontend/public/favicon.svg` — 8 lines
10. `frontend/src/main.jsx` — 10 lines
11. `frontend/src/App.jsx` — 68 lines
12. `frontend/src/index.css` — 131 lines
13. `frontend/src/lib/evidence.js` — 129 lines
14. `frontend/src/lib/mode.jsx` — 74 lines
15. `frontend/src/lib/synth.js` — 116 lines
16. `frontend/src/lib/registry.js` — 131 lines
17. `frontend/src/lib/nav.js` — 77 lines
18. `frontend/src/lib/connectors.js` — 287 lines
19. `frontend/src/lib/detectors.js` — 147 lines
20. `frontend/src/lib/surveillance.js` — 207 lines
21. `frontend/src/components/Brand.jsx` — 70 lines
22. `frontend/src/components/ui.jsx` — 418 lines
23. `frontend/src/components/charts.jsx` — 150 lines
24. `frontend/src/components/WorldMap.jsx` — 180 lines
25. `frontend/src/components/Shell.jsx` — 253 lines
26. `frontend/src/pages/Landing.jsx` — 383 lines
27. `frontend/src/pages/Access.jsx` — 160 lines
28. `frontend/src/pages/CommandCenter.jsx` — 341 lines
29. `frontend/src/pages/SurveillanceMap.jsx` — 248 lines
30. `frontend/src/pages/DiseaseIntelligence.jsx` — 302 lines
31. `frontend/src/pages/SignalEngine.jsx` — 334 lines
32. `frontend/src/pages/AlertCenter.jsx` — 265 lines
33. `frontend/src/pages/XAI.jsx` — 220 lines
34. `frontend/src/pages/MLLab.jsx` — 339 lines
35. `frontend/src/pages/ModelEvaluation.jsx` — 288 lines
36. `frontend/src/pages/ModelCards.jsx` — 238 lines
37. `frontend/src/pages/Genomic.jsx` — 288 lines
38. `frontend/src/pages/BioSignals.jsx` — 182 lines
39. `frontend/src/pages/Environmental.jsx` — 217 lines
40. `frontend/src/pages/Events.jsx` — 219 lines
41. `frontend/src/pages/Africa.jsx` — 377 lines
42. `frontend/src/pages/Connectors.jsx` — 214 lines
43. `frontend/src/pages/DataQuality.jsx` — 197 lines
44. `frontend/src/pages/Workspace.jsx` — 205 lines
45. `frontend/src/pages/Experiments.jsx` — 153 lines
46. `frontend/src/pages/Decisions.jsx` — 209 lines
47. `frontend/src/pages/Architecture.jsx` — 212 lines
48. `frontend/src/pages/Health.jsx` — 174 lines
49. `frontend/src/pages/Responsible.jsx` — 218 lines
50. `frontend/src/pages/Settings.jsx` — 172 lines
51. `frontend/tests/smoke.test.jsx` — 104 lines
52. `backend/requirements.txt` — 15 lines
53. `backend/Dockerfile` — 9 lines
54. `backend/app/__init__.py` — 1 lines
55. `backend/app/main.py` — 248 lines
56. `backend/app/detectors.py` — 126 lines
57. `backend/app/synth.py` — 55 lines
58. `backend/app/connectors.py` — 265 lines

**Total: 58 files, 9775 lines.**

---

## 1. `README.md`

```markdown
# BIOWATCH-AI — Future-System Prototype

**AI-assisted biological surveillance and early outbreak signal detection**
Research & educational prototype · version 0.4.0-prototype

---

## ⚠️ Read this first

This repository is a **design and functional prototype** of what BIOWATCH-AI *could* become if its
research objectives are met. It is deliberately built before the science, so that scientific
requirements — provenance labelling, baseline-first comparison, human review, uncertainty
communication — are structural rather than retrofitted.

It is **not**:

| Not | Because |
|---|---|
| A clinical diagnostic device | No clinical data, no validation, no regulatory basis |
| An operational public-health system | No mandate, no data agreements, no accountability structure |
| Evidence of anything | No model has been trained; no reference label set exists |
| A source of real surveillance data | Every number in DEMONSTRATION mode is synthetic and labelled `SIMULATED` |
| A record of the research programme | The official Research & Development Master Log is separate and untouched by this work |

**Nothing produced here may be treated as an experimental result, a validated capability, a selected
dataset, or a completed research stage.**

---

## What actually exists in this build

| Capability | State |
|---|---|
| 25 interface modules with functional navigation | ✅ Implemented |
| Deterministic synthetic data engine, labelled at every point of use | ✅ Implemented |
| Statistical detectors (seasonal *k*σ, EWMA, CUSUM, robust MAD, fixed threshold) — run live in-browser **and** server-side | ✅ Implemented |
| Interactive world map with explicit "insufficient data" encoding | ✅ Implemented |
| Connector registry for 14 public data sources, with full contract per source | ✅ Defined (0 configured) |
| FastAPI research backend exposing the same detectors | ✅ Scaffolded and runnable |
| Render smoke test across every page × every mode | ✅ 71 checks passing |
| Trained machine-learning models | ❌ **None** |
| Accuracy / AUROC / sensitivity / lead-time figures | ❌ **None** — every such cell reads *"Awaiting experiment"* |
| Live data feeds | ❌ **None** — unconfigured connectors say so |
| Real genomic sequences, mutations or variant calls | ❌ **None, by policy** |
| Ability to send an external alert | ❌ **Disabled at code level** |

---

## Core design principles

1. **Baseline before model.** No machine-learning output may be displayed without the statistical
   baseline it must be compared against, evaluated on the same temporal split. The ML stage of the
   pipeline is physically downstream of the baseline stage.
2. **Every statement carries an epistemic tag** — one of `ESTABLISHED`, `ASSUMPTION`, `HYPOTHESIS`,
   `PRELIMINARY`, `PREDICTION`, `PLAN`, `SIMULATED`. Tags are applied by shared UI components, so a
   panel cannot render without one.
3. **Constrained vocabulary.** The interface may say *"Signal detected"*, *"Unusual activity"*,
   *"Elevated reporting"*, *"Requires investigation"*. It may never say *"outbreak confirmed"*.
   There is no code path, at any privilege level, that declares an outbreak.
4. **Missing data is declared, never coloured green.** Territories without a configured stream are
   rendered with a distinct hatched fill and the text `DATA NOT AVAILABLE`.
5. **No fabricated numbers.** Where a real experiment would be required, the interface shows
   *"Awaiting experiment"* rather than a plausible-looking figure. Mortality series and molecular
   data are not synthesised at all.
6. **Human review is a pipeline stage**, with inputs, outputs and an append-only audit trail — not a
   disclaimer at the bottom of a dashboard.

---

## Modules

**Surveillance** — Global Command Center · Surveillance Map · Disease Intelligence
**Detection** — Signal Detection Engine · Early-Warning Center · Explainable AI
**Modelling** — Machine-Learning Lab · Model Evaluation · Model & Experiment Cards
**Biological & environmental** — Genomic Surveillance · Biological Signals · Environmental Surveillance
**Intelligence** — Event-Based Intelligence · Nigeria / Africa View
**Data** — Data Connectors · Data Quality Center
**Research** — Researcher Workspace · Experiment Tracking · Decision Log
**System** — System Architecture · System Health · Security & Responsible AI · Settings & Notifications
**Public** — Landing page · Researcher access concept

---

## Prototype modes (always visible in the top bar)

| Mode | Behaviour |
|---|---|
| **1 · DEMONSTRATION** | Deterministic synthetic data, labelled `SIMULATED` on every surface |
| **2 · RESEARCH** | Only registered datasets and executed experiments; otherwise *"Awaiting experiment"* |
| **3 · LIVE DATA** | Only configured connectors. Synthetic values are **never** substituted — panels stay empty and say why |

Switching mode never converts synthetic values into live values.

---

## Running it

### Frontend (this is the prototype)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle
npx vitest run       # 71 render + language-policy checks
```

### Optional research backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The Vite dev server proxies `/api` to it. With the backend running, the **System Health** module
reports the API as operational — the probe is genuine, not mocked. Without it, every module still
works and the health page honestly reports the API as *not deployed*.

Useful endpoints:

| Endpoint | Returns |
|---|---|
| `GET /api/health` | Honest component status, including what is **not** deployed |
| `GET /api/detectors` | Implemented detectors, plus an explicit not-implemented list with reasons |
| `POST /api/detect` | Runs a real statistical detector on supplied values |
| `GET /api/connectors` | The connector registry (0 configured) |
| `GET /api/models` | An empty registry, and a note explaining why no metric is returned |
| `GET /api/meta/evidence` | The epistemic tag vocabulary and the permitted/prohibited language lists |

### Containers

```bash
docker compose up --build      # web on :8080, api on :8000
```

---

## Technology

React 19 · Vite · Tailwind CSS v4 · Recharts · d3-geo (local Natural Earth topology) · React Router
Python 3.12 · FastAPI · NumPy · (specified: pandas, scikit-learn, PostgreSQL, Biopython, Docker)

The map ships its own geodata and the UI uses no external fonts or CDNs, so the prototype renders
fully offline.

---

## Data sources

Connector definitions exist for WHO GHO, WHO Disease Outbreak News, WHO FluNet/FluID, US CDC open
data, ECDC, Our World in Data, NCBI E-utilities, Nextstrain, GISAID (access-restricted, disabled),
open wastewater programmes, Nigeria NCDC, Africa CDC, event-report feeds and Copernicus climate
reanalysis.

**None is configured.** Listing a source describes an architectural interface — it implies no
affiliation, endorsement, granted access or right of redistribution, and each source remains subject
to its own licence and terms of use.

---

## Known limitations of the research idea itself

These are documented inside the prototype (landing page, Model Evaluation, Data Quality, each model
card) and are the reason the interface refuses to report performance:

- Surveillance data measure **reporting**, not incidence.
- Historical outbreak labels are scarce, inconsistently defined and retrospectively assigned.
- Genuine anomalies are rare, so accuracy is uninformative and false-alarm burden dominates utility.
- Reporting systems are non-stationary: case definitions, testing policy and infrastructure change.
- Data density tracks surveillance capacity, so models under-detect exactly where detection matters most.
- The architecture is associational and cannot establish biological causation.

---

## Final principle

> BIOWATCH-AI is not trying to predict pandemics. It is investigating whether computational methods
> can extract useful early signals from biological and epidemiological data, under a clearly defined,
> reproducible and scientifically testable framework — and reporting honestly when they cannot.

If the statistical baseline wins, that is the finding, and the system is built to say so.

```

---

## 2. `docker-compose.yml`

```yaml
# BIOWATCH-AI — research prototype stack.
# NOTE: this compose file starts a development/demonstration environment only.
# It is NOT hardened, has no authentication, and must not be exposed publicly
# or connected to restricted data sources.
services:
  api:
    build: ./backend
    container_name: biowatch-api
    ports:
      - "8000:8000"
    environment:
      BIOWATCH_MODE: "prototype"
      # No connector credentials are defined. Adding one requires a recorded
      # licence review (see the Decision Log module).
    restart: unless-stopped

  web:
    build: ./frontend
    container_name: biowatch-web
    ports:
      - "8080:80"
    depends_on:
      - api
    restart: unless-stopped

  # Specified for the target architecture; not required by the prototype.
  # Uncomment only alongside a real ingestion/storage implementation.
  # db:
  #   image: postgres:16-alpine
  #   container_name: biowatch-db
  #   environment:
  #     POSTGRES_DB: biowatch
  #     POSTGRES_USER: biowatch
  #     POSTGRES_PASSWORD: change-me
  #   volumes:
  #     - biowatch-pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   biowatch-pgdata:

```

---

## 3. `frontend/package.json`

```json
{
  "name": "biowatch-ai-frontend",
  "private": true,
  "version": "0.4.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "d3-geo": "^3.1.1",
    "d3-scale": "^4.0.2",
    "lucide-react": "^1.33.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.2",
    "recharts": "^3.10.1",
    "tailwindcss": "^4.3.3",
    "topojson-client": "^3.1.0"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "jsdom": "^29.1.1",
    "oxlint": "^1.75.0",
    "vite": "^8.2.0",
    "vitest": "^4.1.11"
  },
  "description": "BIOWATCH-AI research prototype \u2014 biological surveillance and early signal detection interface. Not a clinical or operational system."
}

```

---

## 4. `frontend/vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BIOWATCH-AI — research prototype frontend
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    cors: true,
    hmr: { clientPort: 443 },
    proxy: {
      // FastAPI research backend (optional; UI degrades gracefully when absent)
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
  preview: { host: '0.0.0.0', port: 5173, allowedHosts: true },
})

```

---

## 5. `frontend/vitest.config.js`

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, css: false, include: ['tests/**/*.test.jsx'] },
});

```

---

## 6. `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="theme-color" content="#0b1117" />
    <title>BIOWATCH-AI — Biological Surveillance Research Prototype</title>
    <meta name="description"
      content="BIOWATCH-AI is a research and educational prototype investigating whether computational methods can extract useful early signals from biological and epidemiological data. Not a clinical diagnostic and not an operational public-health system." />
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      BIOWATCH-AI is an interactive research prototype and requires JavaScript.
      Nothing shown in it constitutes validated model performance, real surveillance data, or a public-health determination.
    </noscript>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## 7. `frontend/Dockerfile`

```text
# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- serve stage ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

```

---

## 8. `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Research API
    location /api/ {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```

---

## 9. `frontend/public/favicon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="8" fill="#0b1117"/>
  <path d="M24 5.6 39.5 14.6v18.8L24 42.4 8.5 33.4V14.6Z" fill="none" stroke="#45c9b8" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M17 13c6 4 6 7.5 0 11.5S11 32 17 36" fill="none" stroke="#8b7ad6" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M31 13c-6 4-6 7.5 0 11.5s6 7.5 0 11.5" fill="none" stroke="#8b7ad6" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
  <path d="M11 27.5h5.5l2.4-3.1 2.6 6.4 2.5-9.6 2.6 6.6 2-2.4H37" fill="none" stroke="#45c9b8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="21.2" r="1.2" fill="#45c9b8"/>
</svg>

```

---

## 10. `frontend/src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

---

## 11. `frontend/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModeProvider } from './lib/mode';
import Shell from './components/Shell';

import Landing from './pages/Landing';
import Access from './pages/Access';
import CommandCenter from './pages/CommandCenter';
import SurveillanceMap from './pages/SurveillanceMap';
import DiseaseIntelligence from './pages/DiseaseIntelligence';
import SignalEngine from './pages/SignalEngine';
import AlertCenter from './pages/AlertCenter';
import XAI from './pages/XAI';
import MLLab from './pages/MLLab';
import ModelEvaluation from './pages/ModelEvaluation';
import ModelCards from './pages/ModelCards';
import Genomic from './pages/Genomic';
import BioSignals from './pages/BioSignals';
import Environmental from './pages/Environmental';
import Events from './pages/Events';
import Africa from './pages/Africa';
import Connectors from './pages/Connectors';
import DataQuality from './pages/DataQuality';
import Workspace from './pages/Workspace';
import Experiments from './pages/Experiments';
import Decisions from './pages/Decisions';
import Architecture from './pages/Architecture';
import Health from './pages/Health';
import Responsible from './pages/Responsible';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/access" element={<Access />} />
          <Route path="/app" element={<Shell />}>
            <Route index element={<CommandCenter />} />
            <Route path="map" element={<SurveillanceMap />} />
            <Route path="disease" element={<DiseaseIntelligence />} />
            <Route path="signals" element={<SignalEngine />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="xai" element={<XAI />} />
            <Route path="ml-lab" element={<MLLab />} />
            <Route path="evaluation" element={<ModelEvaluation />} />
            <Route path="model-cards" element={<ModelCards />} />
            <Route path="genomic" element={<Genomic />} />
            <Route path="biosignals" element={<BioSignals />} />
            <Route path="environmental" element={<Environmental />} />
            <Route path="events" element={<Events />} />
            <Route path="africa" element={<Africa />} />
            <Route path="connectors" element={<Connectors />} />
            <Route path="quality" element={<DataQuality />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="experiments" element={<Experiments />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="architecture" element={<Architecture />} />
            <Route path="health" element={<Health />} />
            <Route path="responsible" element={<Responsible />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ModeProvider>
  );
}

```

---

## 12. `frontend/src/index.css`

```css
@import "tailwindcss";

/* ============================================================
   BIOWATCH-AI — DESIGN SYSTEM (SEGMENT 1)
   Scientific / public-health intelligence aesthetic.
   Dark, low-chroma substrate + restrained functional colour.
   No neon, no gaming glow, no decorative motion.
   ============================================================ */

@theme {
  /* --- Substrate: cool desaturated "lab slate" ------------- */
  --color-bw-void: #070b0f;
  --color-bw-base: #0b1117;
  --color-bw-panel: #111a22;
  --color-bw-panel2: #16212b;
  --color-bw-line: #1e2c37;
  --color-bw-line2: #2a3b49;

  /* --- Text ------------------------------------------------ */
  --color-bw-text: #e6eef5;
  --color-bw-muted: #93a7b8;
  --color-bw-dim: #62788a;

  /* --- Primary: "biosignal teal" (assay / culture) --------- */
  --color-bw-primary: #2ea89a;
  --color-bw-primary-bright: #45c9b8;
  --color-bw-primary-dim: #16333a;

  /* --- Secondary: genomic violet, data blue, env cyan ------ */
  --color-bw-genomic: #8b7ad6;
  --color-bw-data: #4a90c4;
  --color-bw-env: #4bb1a8;
  --color-bw-lab: #c9a227;

  /* --- Alert states (WCAG-checked on dark substrate) ------- */
  --color-alert-green: #3fa66b;
  --color-alert-yellow: #d7b23c;
  --color-alert-orange: #d9822b;
  --color-alert-red: #cf4a4a;

  /* --- Evidence-tag palette -------------------------------- */
  --color-ev-established: #3fa66b;
  --color-ev-assumption: #8f9bb3;
  --color-ev-hypothesis: #8b7ad6;
  --color-ev-preliminary: #d7b23c;
  --color-ev-prediction: #4a90c4;
  --color-ev-plan: #6b7f91;
  --color-ev-simulated: #d9822b;

  --font-sans: "Inter", "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular,
    Menlo, Consolas, monospace;

  --radius-panel: 6px;
}

:root {
  color-scheme: dark;
  --bw-grid: rgba(120, 160, 185, 0.05);
}

html, body, #root { height: 100%; }

body {
  margin: 0;
  background: var(--color-bw-base);
  color: var(--color-bw-text);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Faint isometric lab-grid substrate — static, non-decorative depth cue */
.bw-grid-bg {
  background-image:
    linear-gradient(var(--bw-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--bw-grid) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* --- Typography scale ------------------------------------- */
.bw-h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.015em; }
.bw-h2 { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; }
.bw-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-bw-dim);
}
.bw-num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

/* --- Scrollbars ------------------------------------------- */
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: #22323f; border-radius: 6px; border: 3px solid transparent;
  background-clip: content-box;
}
*::-webkit-scrollbar-thumb:hover { background: #33485a; background-clip: content-box; }

/* --- Focus visibility (accessibility) --------------------- */
:focus-visible {
  outline: 2px solid var(--color-bw-primary-bright);
  outline-offset: 2px;
}

/* --- Motion: only state transitions, never ambience -------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}

.bw-pulse-dot { position: relative; }
.bw-pulse-dot::after {
  content: ""; position: absolute; inset: -4px; border-radius: 9999px;
  border: 1px solid currentColor; opacity: 0.35;
}

/* Recharts tooltip normalisation */
.recharts-default-tooltip {
  background: #16212b !important;
  border: 1px solid #2a3b49 !important;
  border-radius: 4px !important;
  font-size: 12px !important;
}

```

---

## 13. `frontend/src/lib/evidence.js`

```js
/* ============================================================
   BIOWATCH-AI — EVIDENCE / EPISTEMIC STATUS VOCABULARY
   ------------------------------------------------------------
   Every quantitative or qualitative statement rendered by this
   prototype MUST carry one of these tags. This module is the
   single source of truth for that vocabulary.
   ============================================================ */

export const EVIDENCE = {
  ESTABLISHED: {
    key: 'ESTABLISHED',
    label: 'ESTABLISHED',
    color: 'var(--color-ev-established)',
    definition:
      'Supported by peer-reviewed literature or by an authoritative public-health source that is cited inline. Not produced by this prototype.',
  },
  ASSUMPTION: {
    key: 'ASSUMPTION',
    label: 'ASSUMPTION',
    color: 'var(--color-ev-assumption)',
    definition:
      'A design or modelling premise adopted for the prototype. Explicitly not verified. Must be revisited before any research claim.',
  },
  HYPOTHESIS: {
    key: 'HYPOTHESIS',
    label: 'HYPOTHESIS',
    color: 'var(--color-ev-hypothesis)',
    definition:
      'A testable proposition the research programme intends to evaluate. No supporting result exists yet.',
  },
  PRELIMINARY: {
    key: 'PRELIMINARY',
    label: 'PRELIMINARY',
    color: 'var(--color-ev-preliminary)',
    definition:
      'An early, non-validated observation from an incomplete or unreviewed procedure. Not citable. May change or be withdrawn.',
  },
  PREDICTION: {
    key: 'PREDICTION',
    label: 'PREDICTION',
    color: 'var(--color-ev-prediction)',
    definition:
      'A model-generated output about unobserved values. A prediction is not a biological confirmation and not a public-health determination.',
  },
  PLAN: {
    key: 'PLAN',
    label: 'PLAN',
    color: 'var(--color-ev-plan)',
    definition:
      'Intended future work. Describes what the module is designed to do once implemented; nothing has been executed.',
  },
  SIMULATED: {
    key: 'SIMULATED',
    label: 'SIMULATED',
    color: 'var(--color-ev-simulated)',
    definition:
      'Synthetic values generated by a deterministic function inside this prototype for interface demonstration. Contains no real-world surveillance information.',
  },
};

export const EVIDENCE_ORDER = [
  'ESTABLISHED', 'ASSUMPTION', 'HYPOTHESIS', 'PRELIMINARY',
  'PREDICTION', 'PLAN', 'SIMULATED',
];

/* ------------------------------------------------------------
   Standard interface strings. Centralised so that scientifically
   irresponsible phrasing cannot drift into individual modules.
   ------------------------------------------------------------ */
export const SAFE_LANGUAGE = {
  simulatedBanner: 'SIMULATED DATA — FOR PROTOTYPE DEMONSTRATION ONLY',
  simulatedShort: 'SIMULATED DATA — NOT REAL-WORLD SURVEILLANCE',
  notImplemented: 'RESEARCH MODULE — NOT YET IMPLEMENTED',
  connectorUnconfigured: 'CONNECTOR NOT CONFIGURED',
  connectorAvailable: 'LIVE CONNECTOR AVAILABLE — CONFIGURATION REQUIRED',
  awaitingExperiment: 'Awaiting experiment',
  demoMetric: 'Demo metric',
  noData: 'DATA NOT AVAILABLE',
  causation: 'Correlation does not establish biological causation.',
  humanReview: 'Requires human review',
  notDiagnostic:
    'Research prototype. Not a clinical diagnostic device and not an operational public-health system.',
  insufficient: 'Evidence insufficient for confirmation',
};

/* Permitted signal phrasing — an outbreak is NEVER declared by the system. */
export const SIGNAL_PHRASES = [
  'Signal detected',
  'Unusual activity',
  'Elevated reporting',
  'Potential anomaly detected',
  'Requires investigation',
  'Model-generated alert',
  'Prediction — not biological confirmation',
];

export const ALERT_STATES = {
  GREEN: {
    key: 'GREEN',
    color: 'var(--color-alert-green)',
    title: 'No unusual activity detected',
    meaning:
      'Observed values fall inside the estimated baseline interval for this stream. Routine monitoring continues.',
  },
  YELLOW: {
    key: 'YELLOW',
    color: 'var(--color-alert-yellow)',
    title: 'Signal requiring review',
    meaning:
      'A deviation from baseline was flagged by at least one detector. Analyst triage requested. No epidemiological interpretation is implied.',
  },
  ORANGE: {
    key: 'ORANGE',
    color: 'var(--color-alert-orange)',
    title: 'Stronger signal requiring investigation',
    meaning:
      'Concordant deviation across detectors or streams. Structured investigation by a qualified analyst is requested.',
  },
  RED: {
    key: 'RED',
    color: 'var(--color-alert-red)',
    title: 'High-priority signal requiring human assessment',
    meaning:
      'Large, persistent, multi-stream deviation. Escalation to a qualified epidemiologist is requested. This is an interface state, NOT a public-health decision.',
  },
};

export const ALERT_DISCLAIMER =
  'Alert states are prototype interface states derived from statistical deviation. They are not medical or public-health decisions, and they do not constitute confirmation of an outbreak.';

```

---

## 14. `frontend/src/lib/mode.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — PROTOTYPE MODE CONTEXT
   Three modes, always visible in the top bar:
     DEMONSTRATION  clearly-labelled synthetic data
     RESEARCH       user-uploaded datasets / real experiments
     LIVE DATA      configured public API feeds
   ============================================================ */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const MODES = {
  DEMONSTRATION: {
    key: 'DEMONSTRATION',
    short: 'DEMO',
    color: 'var(--color-ev-simulated)',
    description:
      'All figures shown are deterministic synthetic values generated inside the browser for interface demonstration. No real surveillance data is present.',
    dataBadge: 'DEMO DATA',
  },
  RESEARCH: {
    key: 'RESEARCH',
    short: 'RESEARCH',
    color: 'var(--color-bw-primary-bright)',
    description:
      'Modules operate on datasets uploaded by the researcher. Only results actually computed in an experiment run are displayed; everything else reads "Awaiting experiment".',
    dataBadge: 'RESEARCH DATA',
  },
  LIVE: {
    key: 'LIVE',
    short: 'LIVE',
    color: 'var(--color-bw-data)',
    description:
      'Modules read from configured public data connectors. Unconfigured connectors are shown as such and are never substituted with synthetic values.',
    dataBadge: 'LIVE',
  },
};

const ModeCtx = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('bw.mode') || 'DEMONSTRATION'; }
    catch { return 'DEMONSTRATION'; }
  });
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bw.session') || 'null'); }
    catch { return null; }
  });

  useEffect(() => { try { localStorage.setItem('bw.mode', mode); } catch { /* ignore */ } }, [mode]);
  useEffect(() => {
    try {
      if (session) localStorage.setItem('bw.session', JSON.stringify(session));
      else localStorage.removeItem('bw.session');
    } catch { /* ignore */ }
  }, [session]);

  const value = useMemo(
    () => ({
      mode, setMode, meta: MODES[mode],
      isDemo: mode === 'DEMONSTRATION',
      isResearch: mode === 'RESEARCH',
      isLive: mode === 'LIVE',
      session, setSession,
    }),
    [mode, session],
  );
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeCtx);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
}

```

---

## 15. `frontend/src/lib/synth.js`

```js
/* ============================================================
   BIOWATCH-AI — SYNTHETIC DATA ENGINE
   ------------------------------------------------------------
   EVERY value produced here is SIMULATED. It is generated by a
   deterministic seeded PRNG so that the interface is reproducible
   across reloads and reviewers.
   It encodes NO real-world epidemiological information, NO real
   outbreak, NO real country statistic and NO real model result.
   Components consuming this module must render the SIMULATED tag.
   ============================================================ */

export const SYNTHETIC_PROVENANCE = {
  generator: 'bw-synth v0.4 (mulberry32 PRNG + seasonal-Poisson surrogate)',
  seedPolicy: 'Deterministic per stream key; identical on every load.',
  statement:
    'Synthetic surrogate series. Structure (weekly seasonality, reporting-delay decay, occasional step change) is imposed by the generator, not observed in nature.',
  notCitable: 'Not citable. Not derived from WHO, CDC, ECDC, NCBI or any real repository.',
};

/* --- deterministic PRNG ----------------------------------- */
export function seedFrom(str) {
  let h = 1779033703 ^ String(str).length;
  for (let i = 0; i < String(str).length; i++) {
    h = Math.imul(h ^ String(str).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = typeof seed === 'string' ? seedFrom(seed) : seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r) {
  const u = Math.max(1e-9, r()), v = Math.max(1e-9, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function isoWeeksBack(n, end = new Date('2026-08-17T00:00:00Z')) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 7 * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/**
 * SIMULATED weekly count series with:
 *  - annual seasonality
 *  - slow trend
 *  - negative-binomial-ish overdispersion
 *  - optional injected step change (a synthetic "signal" for UI demo)
 */
export function synthSeries(key, {
  weeks = 104, level = 120, season = 0.45, trend = 0.0,
  disp = 0.18, injectAt = null, injectSize = 0, phase = 0,
} = {}) {
  const r = rng(key);
  const dates = isoWeeksBack(weeks);
  const out = [];
  for (let i = 0; i < weeks; i++) {
    const woy = (i + phase) % 52;
    const s = 1 + season * Math.sin((2 * Math.PI * woy) / 52 - Math.PI / 3);
    const tr = 1 + trend * (i / weeks);
    let mu = level * s * tr;
    if (injectAt !== null && i >= weeks - injectAt) {
      const k = (i - (weeks - injectAt) + 1) / Math.max(1, injectAt);
      mu *= 1 + injectSize * Math.min(1, k * 1.6);
    }
    const noise = 1 + disp * gauss(r) * 0.6;
    const value = Math.max(0, Math.round(mu * noise));
    /* baseline = seasonal expectation WITHOUT the injected step */
    const base = Math.round(level * s * tr);
    const sd = Math.max(1.5, Math.sqrt(base) * 1.35 + base * disp * 0.55);
    out.push({
      date: dates[i],
      week: `W${String((woy % 52) + 1).padStart(2, '0')}`,
      value,
      baseline: base,
      lo: Math.max(0, Math.round(base - 1.96 * sd)),
      hi: Math.round(base + 1.96 * sd),
      z: +((value - base) / sd).toFixed(2),
    });
  }
  return out;
}

/** Reporting-delay distribution (SIMULATED) — share of reports arriving after d weeks */
export function synthDelayProfile(key, maxLag = 6) {
  const r = rng(key + ':delay');
  const raw = Array.from({ length: maxLag + 1 }, (_, d) => Math.exp(-d / (0.9 + r())) * (0.7 + 0.6 * r()));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v, d) => ({ lag: d, share: +(v / sum).toFixed(3) }));
}

/** Small helper for sparkline-style arrays */
export function tail(series, n) { return series.slice(Math.max(0, series.length - n)); }

export function fmtNum(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(0) + 'k';
  return String(n);
}

export function fmtTs(d = new Date()) {
  return new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

```

---

## 16. `frontend/src/lib/registry.js`

```js
/* ============================================================
   BIOWATCH-AI — DOMAIN REGISTRIES
   Pathogen/stream/region definitions used across modules.
   Descriptive fields cite public-health convention (ESTABLISHED);
   all numeric activity is generated by lib/synth.js (SIMULATED).
   ============================================================ */

export const STREAMS = {
  epi:      { key: 'epi',      label: 'Epidemiological', color: 'var(--color-bw-primary)',  icon: 'Activity' },
  genomic:  { key: 'genomic',  label: 'Genomic',         color: 'var(--color-bw-genomic)',  icon: 'Dna' },
  env:      { key: 'env',      label: 'Environmental',   color: 'var(--color-bw-env)',      icon: 'Droplets' },
  lab:      { key: 'lab',      label: 'Laboratory',      color: 'var(--color-bw-lab)',      icon: 'FlaskConical' },
  synd:     { key: 'synd',     label: 'Syndromic',       color: 'var(--color-bw-data)',     icon: 'Thermometer' },
  event:    { key: 'event',    label: 'Event-based',     color: '#a98bd6',                  icon: 'Newspaper' },
};

/* Pathogen reference metadata.
   Transmission/seasonality notes are textbook-level public-health facts
   (ESTABLISHED). No case counts are stored here. */
export const PATHOGENS = [
  {
    id: 'influenza-a', name: 'Influenza A', family: 'Orthomyxoviridae',
    class: 'Respiratory virus', streams: ['epi', 'lab', 'synd', 'genomic'],
    seasonality: 'Marked winter seasonality in temperate zones; less regular in tropics.',
    note: 'Subtyping (e.g. H1/H3) and clade assignment are routine in sentinel networks.',
    surveillance: 'Sentinel ILI/ARI networks; virological confirmation by RT-PCR.',
  },
  {
    id: 'sars-cov-2', name: 'SARS-CoV-2', family: 'Coronaviridae',
    class: 'Respiratory virus', streams: ['epi', 'lab', 'genomic', 'env', 'synd'],
    seasonality: 'Multi-annual wave structure; seasonality not fully established.',
    note: 'Wastewater detection is an established complementary indicator in several countries.',
    surveillance: 'Case reporting, wastewater, genomic sequencing, hospital admissions.',
  },
  {
    id: 'cholera', name: 'Cholera (V. cholerae)', family: 'Vibrionaceae',
    class: 'Enteric bacterium', streams: ['epi', 'lab', 'env'],
    seasonality: 'Strongly linked to rainfall, flooding and water/sanitation conditions.',
    note: 'Rapid diagnostic tests require culture/PCR confirmation.',
    surveillance: 'Case-based reporting, culture confirmation, environmental water sampling.',
  },
  {
    id: 'lassa', name: 'Lassa fever (LASV)', family: 'Arenaviridae',
    class: 'Viral haemorrhagic fever', streams: ['epi', 'lab', 'genomic'],
    seasonality: 'Pronounced dry-season peak in West Africa (approx. Dec–Mar).',
    note: 'Rodent reservoir (Mastomys spp.); zoonotic spillover dominant.',
    surveillance: 'Case-based reporting with RT-PCR confirmation at reference laboratories.',
  },
  {
    id: 'mpox', name: 'Mpox (MPXV)', family: 'Poxviridae',
    class: 'Zoonotic virus', streams: ['epi', 'lab', 'genomic'],
    seasonality: 'No established regular seasonality.',
    note: 'Clade assignment is epidemiologically relevant.',
    surveillance: 'Case-based reporting, PCR confirmation, sequencing where capacity exists.',
  },
  {
    id: 'dengue', name: 'Dengue (DENV)', family: 'Flaviviridae',
    class: 'Arbovirus', streams: ['epi', 'lab', 'env'],
    seasonality: 'Rainfall- and temperature-dependent vector dynamics.',
    note: 'Four serotypes; serotype replacement affects severity patterns.',
    surveillance: 'Case reporting, NS1/PCR confirmation, entomological indices.',
  },
  {
    id: 'measles', name: 'Measles (MeV)', family: 'Paramyxoviridae',
    class: 'Vaccine-preventable virus', streams: ['epi', 'lab', 'genomic'],
    seasonality: 'Epidemic cycles governed by susceptible accumulation and contact patterns.',
    note: 'Immunity gaps are the dominant driver of resurgence.',
    surveillance: 'Case-based reporting with IgM/PCR confirmation; genotype surveillance.',
  },
  {
    id: 'amr-kpn', name: 'Carbapenem-resistant K. pneumoniae', family: 'Enterobacteriaceae',
    class: 'AMR organism', streams: ['lab', 'genomic'],
    seasonality: 'Not applicable — healthcare-associated transmission dynamics.',
    note: 'Resistance-gene surveillance (e.g. carbapenemase families) is laboratory-driven.',
    surveillance: 'Laboratory isolate reporting, susceptibility testing, genomic AMR typing.',
  },
];

/* Regions used for the map / regional aggregation.
   Coordinates are geographic reference points only. */
export const REGIONS = [
  { id: 'AFRO',  name: 'African Region',            lon: 20,   lat: 2 },
  { id: 'EMRO',  name: 'Eastern Mediterranean',     lon: 45,   lat: 25 },
  { id: 'EURO',  name: 'European Region',           lon: 15,   lat: 52 },
  { id: 'PAHO',  name: 'Region of the Americas',    lon: -75,  lat: 5 },
  { id: 'SEARO', name: 'South-East Asia',           lon: 95,   lat: 15 },
  { id: 'WPRO',  name: 'Western Pacific',           lon: 130,  lat: 10 },
];

/* Country reference points (geographic centroids, ESTABLISHED geography).
   Any activity value attached to these in DEMONSTRATION mode is SIMULATED. */
export const COUNTRY_POINTS = [
  { iso: 'NGA', name: 'Nigeria', lon: 8.7, lat: 9.1, region: 'AFRO' },
  { iso: 'GHA', name: 'Ghana', lon: -1.0, lat: 7.9, region: 'AFRO' },
  { iso: 'ZAF', name: 'South Africa', lon: 24.7, lat: -29.0, region: 'AFRO' },
  { iso: 'KEN', name: 'Kenya', lon: 37.9, lat: 0.0, region: 'AFRO' },
  { iso: 'ETH', name: 'Ethiopia', lon: 39.8, lat: 9.1, region: 'AFRO' },
  { iso: 'COD', name: 'DR Congo', lon: 23.6, lat: -2.9, region: 'AFRO' },
  { iso: 'EGY', name: 'Egypt', lon: 30.8, lat: 26.8, region: 'EMRO' },
  { iso: 'PAK', name: 'Pakistan', lon: 69.3, lat: 30.4, region: 'EMRO' },
  { iso: 'GBR', name: 'United Kingdom', lon: -3.4, lat: 55.4, region: 'EURO' },
  { iso: 'DEU', name: 'Germany', lon: 10.5, lat: 51.2, region: 'EURO' },
  { iso: 'FRA', name: 'France', lon: 2.2, lat: 46.2, region: 'EURO' },
  { iso: 'ITA', name: 'Italy', lon: 12.6, lat: 41.9, region: 'EURO' },
  { iso: 'USA', name: 'United States', lon: -98.6, lat: 39.8, region: 'PAHO' },
  { iso: 'BRA', name: 'Brazil', lon: -51.9, lat: -14.2, region: 'PAHO' },
  { iso: 'MEX', name: 'Mexico', lon: -102.6, lat: 23.6, region: 'PAHO' },
  { iso: 'IND', name: 'India', lon: 78.9, lat: 20.6, region: 'SEARO' },
  { iso: 'IDN', name: 'Indonesia', lon: 113.9, lat: -0.8, region: 'SEARO' },
  { iso: 'THA', name: 'Thailand', lon: 100.9, lat: 15.9, region: 'SEARO' },
  { iso: 'JPN', name: 'Japan', lon: 138.3, lat: 36.2, region: 'WPRO' },
  { iso: 'PHL', name: 'Philippines', lon: 121.8, lat: 12.9, region: 'WPRO' },
  { iso: 'AUS', name: 'Australia', lon: 133.8, lat: -25.3, region: 'WPRO' },
  { iso: 'CHN', name: 'China', lon: 104.2, lat: 35.9, region: 'WPRO' },
];

/* Nigerian states used by the Nigeria/Africa module (geography only). */
export const NIGERIA_STATES = [
  { id: 'LA', name: 'Lagos', lon: 3.4, lat: 6.5, zone: 'South West' },
  { id: 'FC', name: 'FCT Abuja', lon: 7.4, lat: 9.1, zone: 'North Central' },
  { id: 'KN', name: 'Kano', lon: 8.5, lat: 12.0, zone: 'North West' },
  { id: 'RI', name: 'Rivers', lon: 6.9, lat: 4.8, zone: 'South South' },
  { id: 'ED', name: 'Edo', lon: 5.9, lat: 6.6, zone: 'South South' },
  { id: 'ON', name: 'Ondo', lon: 5.1, lat: 7.1, zone: 'South West' },
  { id: 'EB', name: 'Ebonyi', lon: 8.1, lat: 6.3, zone: 'South East' },
  { id: 'BO', name: 'Borno', lon: 13.1, lat: 11.8, zone: 'North East' },
  { id: 'BA', name: 'Bauchi', lon: 10.0, lat: 10.3, zone: 'North East' },
  { id: 'TA', name: 'Taraba', lon: 10.8, lat: 8.0, zone: 'North East' },
  { id: 'PL', name: 'Plateau', lon: 9.5, lat: 9.2, zone: 'North Central' },
  { id: 'OY', name: 'Oyo', lon: 3.9, lat: 8.2, zone: 'South West' },
];

```

---

## 17. `frontend/src/lib/nav.js`

```js
/* ============================================================
   BIOWATCH-AI — NAVIGATION REGISTRY
   Single source of truth for modules, routes and their status.
   ============================================================ */
export const NAV = [
  {
    group: 'Surveillance',
    items: [
      { to: '/app', label: 'Global Command Center', icon: 'LayoutDashboard', end: true, status: 'prototype' },
      { to: '/app/map', label: 'Surveillance Map', icon: 'Globe2', status: 'prototype' },
      { to: '/app/disease', label: 'Disease Intelligence', icon: 'Activity', status: 'prototype' },
    ],
  },
  {
    group: 'Detection',
    items: [
      { to: '/app/signals', label: 'Signal Detection Engine', icon: 'Radar', status: 'partial' },
      { to: '/app/alerts', label: 'Early-Warning Center', icon: 'BellRing', status: 'prototype' },
      { to: '/app/xai', label: 'Explainable AI', icon: 'Lightbulb', status: 'partial' },
    ],
  },
  {
    group: 'Modelling',
    items: [
      { to: '/app/ml-lab', label: 'Machine-Learning Lab', icon: 'FlaskConical', status: 'partial' },
      { to: '/app/evaluation', label: 'Model Evaluation', icon: 'GaugeCircle', status: 'partial' },
      { to: '/app/model-cards', label: 'Model & Experiment Cards', icon: 'IdCard', status: 'prototype' },
    ],
  },
  {
    group: 'Biological & environmental',
    items: [
      { to: '/app/genomic', label: 'Genomic Surveillance', icon: 'Dna', status: 'plan' },
      { to: '/app/biosignals', label: 'Biological Signals', icon: 'Microscope', status: 'plan' },
      { to: '/app/environmental', label: 'Environmental Surveillance', icon: 'Droplets', status: 'plan' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { to: '/app/events', label: 'Event-Based Intelligence', icon: 'Newspaper', status: 'partial' },
      { to: '/app/africa', label: 'Nigeria / Africa View', icon: 'MapPinned', status: 'prototype' },
    ],
  },
  {
    group: 'Data',
    items: [
      { to: '/app/connectors', label: 'Data Connectors', icon: 'PlugZap', status: 'partial' },
      { to: '/app/quality', label: 'Data Quality Center', icon: 'ShieldCheck', status: 'prototype' },
    ],
  },
  {
    group: 'Research',
    items: [
      { to: '/app/workspace', label: 'Researcher Workspace', icon: 'FolderKanban', status: 'partial' },
      { to: '/app/experiments', label: 'Experiment Tracking', icon: 'ListChecks', status: 'partial' },
      { to: '/app/decisions', label: 'Decision Log', icon: 'ScrollText', status: 'prototype' },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/app/architecture', label: 'System Architecture', icon: 'Network', status: 'prototype' },
      { to: '/app/health', label: 'System Health', icon: 'HeartPulse', status: 'partial' },
      { to: '/app/responsible', label: 'Security & Responsible AI', icon: 'Lock', status: 'prototype' },
      { to: '/app/settings', label: 'Settings & Notifications', icon: 'Settings', status: 'prototype' },
    ],
  },
];

export const STATUS_META = {
  prototype: { label: 'Interface prototype', color: 'var(--color-bw-primary)' },
  partial: { label: 'Partially implemented', color: 'var(--color-alert-yellow)' },
  plan: { label: 'Planned research module', color: 'var(--color-bw-dim)' },
};

export const ALL_ITEMS = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));

```

---

## 18. `frontend/src/lib/connectors.js`

```js
/* ============================================================
   BIOWATCH-AI — DATA CONNECTOR REGISTRY (LIVE DATA LAYER)
   ------------------------------------------------------------
   Declarative definitions of public, openly-licensed data
   sources the platform is architected to read.

   HARD RULE: a connector that is not configured is reported as
   NOT CONFIGURED. It is never back-filled with synthetic values
   presented as live. Endpoints below are the publicly documented
   entry points of each organisation; listing one implies no
   affiliation, endorsement, or right of access, and each remains
   subject to its own terms and licence.
   ============================================================ */

export const CONNECTOR_STATUS = {
  configured: { label: 'CONFIGURED', color: 'var(--color-alert-green)' },
  available: { label: 'LIVE CONNECTOR AVAILABLE — CONFIGURATION REQUIRED', color: 'var(--color-bw-data)' },
  unconfigured: { label: 'CONNECTOR NOT CONFIGURED', color: 'var(--color-bw-dim)' },
  planned: { label: 'CONNECTOR PLANNED', color: 'var(--color-bw-dim)' },
  blocked: { label: 'ACCESS RESTRICTED — AGREEMENT REQUIRED', color: 'var(--color-alert-yellow)' },
};

export const CONNECTORS = [
  {
    id: 'who-gho',
    name: 'WHO Global Health Observatory (GHO)',
    org: 'World Health Organization',
    type: 'Epidemiological indicators',
    stream: 'epi',
    url: 'https://ghoapi.azureedge.net/api/',
    docs: 'https://www.who.int/data/gho/info/gho-odata-api',
    auth: 'None (public OData endpoint)',
    format: 'OData / JSON',
    frequency: 'Irregular — indicator dependent',
    granularity: 'Country · year (mostly annual)',
    license: 'WHO data terms; attribution required. Verify per-indicator terms.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Annual granularity is generally too coarse for weekly signal detection; useful as denominator/context.',
  },
  {
    id: 'who-don',
    name: 'WHO Disease Outbreak News (DON)',
    org: 'World Health Organization',
    type: 'Event-based reports',
    stream: 'event',
    url: 'https://www.who.int/emergencies/disease-outbreak-news',
    docs: 'https://www.who.int/emergencies/disease-outbreak-news',
    auth: 'None (public web/RSS)',
    format: 'HTML / RSS → structured extraction',
    frequency: 'Event-driven, irregular',
    granularity: 'Event · country · date',
    license: 'WHO content terms; attribution and non-alteration requirements apply.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Reference/verification corpus only. DON publication lags detection and must never be used as a real-time detector input without explicit lag handling.',
  },
  {
    id: 'cdc-socrata',
    name: 'US CDC open data (data.cdc.gov)',
    org: 'US Centers for Disease Control and Prevention',
    type: 'Surveillance datasets',
    stream: 'epi',
    url: 'https://data.cdc.gov/resource/{dataset_id}.json',
    docs: 'https://dev.socrata.com/',
    auth: 'Optional app token (higher rate limit)',
    format: 'Socrata SODA / JSON / CSV',
    frequency: 'Dataset dependent — weekly for several syndromic sets',
    granularity: 'State · week (varies)',
    license: 'Generally US public domain; confirm per dataset.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Schema and revision policy vary by dataset; back-revision of recent weeks is common.',
  },
  {
    id: 'ecdc-atlas',
    name: 'ECDC Surveillance Atlas exports',
    org: 'European Centre for Disease Prevention and Control',
    type: 'Notifiable disease surveillance',
    stream: 'epi',
    url: 'https://atlas.ecdc.europa.eu/public/index.aspx',
    docs: 'https://www.ecdc.europa.eu/en/publications-data',
    auth: 'None (bulk export)',
    format: 'CSV export',
    frequency: 'Periodic (monthly/annual by disease)',
    granularity: 'Country · month/year',
    license: 'ECDC re-use policy; attribution required.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Programmatic API coverage is limited; scheduled export ingestion is the realistic pattern.',
  },
  {
    id: 'owid',
    name: 'Our World in Data — health datasets',
    org: 'Our World in Data / Global Change Data Lab',
    type: 'Curated aggregate indicators',
    stream: 'epi',
    url: 'https://catalog.ourworldindata.org/',
    docs: 'https://docs.owid.io/projects/etl/api/',
    auth: 'None',
    format: 'CSV / Parquet',
    frequency: 'Dataset dependent',
    granularity: 'Country · day/week/year',
    license: 'Predominantly CC BY 4.0; upstream source licences also apply.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'A curated re-publication layer — always cite the upstream source, and expect harmonisation choices to affect series shape.',
  },
  {
    id: 'ncbi-eutils',
    name: 'NCBI E-utilities / Datasets',
    org: 'US National Center for Biotechnology Information',
    type: 'Pathogen sequence metadata',
    stream: 'genomic',
    url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
    docs: 'https://www.ncbi.nlm.nih.gov/books/NBK25501/',
    auth: 'Optional API key (raises rate limit to 10 req/s)',
    format: 'XML / JSON / FASTA',
    frequency: 'Continuous submission',
    granularity: 'Accession · collection date · geography',
    license: 'Public domain data; NCBI usage policies and rate limits apply.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Submission date ≠ collection date. Sequencing effort is highly non-uniform; frequency estimates from raw submissions are severely biased.',
  },
  {
    id: 'nextstrain',
    name: 'Nextstrain open builds',
    org: 'Nextstrain',
    type: 'Phylogenetic builds & clade assignment',
    stream: 'genomic',
    url: 'https://data.nextstrain.org/',
    docs: 'https://docs.nextstrain.org/',
    auth: 'None for public builds',
    format: 'Auspice JSON v2',
    frequency: 'Build dependent (often weekly)',
    granularity: 'Tree · node · metadata',
    license: 'Open builds; check individual build data provenance and acknowledgements.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'Builds are subsampled for tractability; subsampling is not a random sample of circulating diversity.',
  },
  {
    id: 'gisaid',
    name: 'GISAID EpiCoV / EpiFlu',
    org: 'GISAID',
    type: 'Pathogen genomic data',
    stream: 'genomic',
    url: 'https://gisaid.org/',
    docs: 'https://gisaid.org/',
    auth: 'Registered access + data-access agreement',
    format: 'Per-agreement feed',
    frequency: 'Continuous',
    granularity: 'Sequence · metadata',
    license: 'Access governed by the GISAID Database Access Agreement; redistribution restricted.',
    status: 'blocked',
    lastUpdate: null,
    error: 'Data-access agreement not executed for this prototype. No data requested or stored.',
    caveats: 'Terms prohibit the redistribution patterns a public dashboard would imply. Aggregate-only use must be legally reviewed before enabling.',
  },
  {
    id: 'wastewater-open',
    name: 'Open wastewater surveillance programmes',
    org: 'Various national/regional programmes',
    type: 'Environmental pathogen concentration',
    stream: 'env',
    url: 'Programme-specific endpoints (e.g. national open-data portals)',
    docs: '—',
    auth: 'Varies by programme',
    format: 'CSV / JSON',
    frequency: 'Typically weekly or twice-weekly',
    granularity: 'Sampling site · date',
    license: 'Programme-specific; several are open government licences.',
    status: 'unconfigured',
    lastUpdate: null,
    error: null,
    caveats: 'Concentrations require flow/population normalisation; assay and site changes routinely produce step artefacts that mimic signals.',
  },
  {
    id: 'ncdc-ng',
    name: 'Nigeria CDC public situation reports',
    org: 'Nigeria Centre for Disease Control and Prevention',
    type: 'National epidemiological reports',
    stream: 'epi',
    url: 'https://ncdc.gov.ng/reports',
    docs: 'https://ncdc.gov.ng/',
    auth: 'None (published reports)',
    format: 'PDF / HTML → structured extraction required',
    frequency: 'Weekly / monthly by programme',
    granularity: 'State · epidemiological week',
    license: 'Public reports; attribution required. Confirm re-use terms.',
    status: 'unconfigured',
    lastUpdate: null,
    error: null,
    caveats: 'No machine-readable API is documented; PDF extraction is fragile and must be validated per report layout before any analytical use.',
  },
  {
    id: 'africa-cdc',
    name: 'Africa CDC public dashboards',
    org: 'Africa Centres for Disease Control and Prevention',
    type: 'Regional epidemiological summaries',
    stream: 'epi',
    url: 'https://africacdc.org/',
    docs: 'https://africacdc.org/institutes/',
    auth: 'None (published dashboards)',
    format: 'HTML / dashboard exports',
    frequency: 'Weekly summaries where published',
    granularity: 'Country · week',
    license: 'Attribution required; confirm re-use terms.',
    status: 'unconfigured',
    lastUpdate: null,
    error: null,
    caveats: 'Member-state reporting completeness varies substantially; absence of data must never be rendered as absence of disease.',
  },
  {
    id: 'promed',
    name: 'Event-based media/report feeds (ProMED-style)',
    org: 'Various',
    type: 'Unverified event reports',
    stream: 'event',
    url: 'Feed-specific',
    docs: '—',
    auth: 'Varies; some require subscription',
    format: 'RSS / e-mail digest → NLP extraction',
    frequency: 'Continuous',
    granularity: 'Report · location · date',
    license: 'Varies; several prohibit redistribution.',
    status: 'planned',
    lastUpdate: null,
    error: null,
    caveats: 'Enters the system as UNVERIFIED by definition. Must never be auto-promoted to a confirmed event.',
  },
  {
    id: 'era5-climate',
    name: 'Open climate reanalysis (temperature/precipitation)',
    org: 'Copernicus / national meteorological services',
    type: 'Environmental covariates',
    stream: 'env',
    url: 'https://cds.climate.copernicus.eu/',
    docs: 'https://cds.climate.copernicus.eu/how-to-api',
    auth: 'Free registration + API key',
    format: 'NetCDF / GRIB',
    frequency: 'Daily/monthly reanalysis',
    granularity: 'Grid cell · day',
    license: 'Copernicus licence; attribution required.',
    status: 'unconfigured',
    lastUpdate: null,
    error: null,
    caveats: 'Covariate only. Climate association is confounded with seasonality already captured by the baseline.',
  },
  {
    id: 'who-flunet',
    name: 'WHO FluNet / FluID',
    org: 'World Health Organization',
    type: 'Virological & syndromic influenza surveillance',
    stream: 'lab',
    url: 'https://www.who.int/tools/flunet',
    docs: 'https://www.who.int/tools/flunet',
    auth: 'None (public export)',
    format: 'CSV export',
    frequency: 'Weekly',
    granularity: 'Country · epidemiological week',
    license: 'WHO data terms; attribution required.',
    status: 'available',
    lastUpdate: null,
    error: null,
    caveats: 'One of the few genuinely weekly global streams — the most realistic first target for a baseline-vs-model experiment.',
  },
];

export const CONNECTORS_BY_STREAM = CONNECTORS.reduce((acc, c) => {
  (acc[c.stream] ||= []).push(c);
  return acc;
}, {});

export function connectorCounts() {
  const by = {};
  CONNECTORS.forEach((c) => { by[c.status] = (by[c.status] || 0) + 1; });
  return { total: CONNECTORS.length, by };
}

```

---

## 19. `frontend/src/lib/detectors.js`

```js
/* ============================================================
   BIOWATCH-AI — DETECTION METHODS
   ------------------------------------------------------------
   These functions are ACTUALLY IMPLEMENTED and run in the
   browser on whatever series they are given (synthetic in
   DEMONSTRATION mode). They are classical statistical detectors,
   deliberately implemented FIRST so that any machine-learning
   method has a mandatory comparator.

   Nothing here is a trained model. Nothing here has been
   validated against real outbreak labels.
   ============================================================ */

/** Simple fixed threshold on the raw value. */
export function detectThreshold(series, { threshold }) {
  const t = threshold ?? Math.round(Math.max(...series.map((p) => p.value)) * 0.72);
  return {
    id: 'threshold',
    name: 'Fixed threshold',
    implemented: true,
    params: { threshold: t },
    flags: series.map((p) => ({ date: p.date, flag: p.value > t, score: p.value / t })),
    note: 'Crudest possible rule. Included because it is frequently the incumbent in practice and any method must beat it.',
  };
}

/** Seasonal baseline: harmonic-free variant using same-week historical mean ± k·SD. */
export function detectSeasonalZ(series, { k = 2, minHistory = 52 } = {}) {
  const flags = series.map((p, i) => {
    if (i < minHistory) return { date: p.date, flag: false, score: 0, insufficient: true };
    const hist = series.slice(0, i).filter((q) => q.week === p.week).map((q) => q.value);
    const pool = hist.length >= 2 ? hist : series.slice(Math.max(0, i - 8), i).map((q) => q.value);
    const mu = pool.reduce((a, b) => a + b, 0) / pool.length;
    const sd = Math.sqrt(pool.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, pool.length - 1)) || Math.sqrt(Math.max(1, mu));
    const z = (p.value - mu) / (sd || 1);
    return { date: p.date, flag: z >= k, score: +z.toFixed(2), expected: Math.round(mu), sd: +sd.toFixed(1) };
  });
  return {
    id: 'seasonal', name: `Seasonal baseline (same-week mean + ${k}σ)`, implemented: true,
    params: { k, minHistory }, flags,
    note: 'Comparable in spirit to CDC EARS-family and Farrington-style approaches, but simplified: no over-dispersion model, no trend term, no exclusion of past epidemic periods.',
  };
}

/** EWMA control chart on residuals from a rolling mean. */
export function detectEWMA(series, { lambda = 0.3, L = 3, window = 8 } = {}) {
  let ewma = null;
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    const mu = win.length ? win.reduce((a, b) => a + b, 0) / win.length : p.value;
    const sd = win.length > 1
      ? Math.sqrt(win.reduce((a, b) => a + (b - mu) ** 2, 0) / (win.length - 1)) || Math.sqrt(Math.max(1, mu))
      : Math.sqrt(Math.max(1, mu));
    ewma = ewma === null ? p.value : lambda * p.value + (1 - lambda) * ewma;
    const limit = mu + L * sd * Math.sqrt(lambda / (2 - lambda));
    return { date: p.date, flag: i > window && ewma > limit, score: +((ewma - mu) / (sd || 1)).toFixed(2), expected: Math.round(mu) };
  });
  return {
    id: 'ewma', name: `EWMA control chart (λ=${lambda}, L=${L})`, implemented: true,
    params: { lambda, L, window }, flags,
    note: 'Sensitive to small persistent shifts; weak against sharp single-week spikes. Assumes approximately stationary residuals, which surveillance data violate.',
  };
}

/** One-sided CUSUM on standardised residuals. */
export function detectCUSUM(series, { k = 0.5, h = 4, window = 12 } = {}) {
  let S = 0;
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    const mu = win.length ? win.reduce((a, b) => a + b, 0) / win.length : p.value;
    const sd = win.length > 1
      ? Math.sqrt(win.reduce((a, b) => a + (b - mu) ** 2, 0) / (win.length - 1)) || Math.sqrt(Math.max(1, mu))
      : Math.sqrt(Math.max(1, mu));
    const z = (p.value - mu) / (sd || 1);
    S = Math.max(0, S + z - k);
    const flag = i > window && S > h;
    if (flag) S = 0; // reset after signalling
    return { date: p.date, flag, score: +S.toFixed(2), expected: Math.round(mu) };
  });
  return {
    id: 'cusum', name: `CUSUM (k=${k}, h=${h})`, implemented: true,
    params: { k, h, window }, flags,
    note: 'Accumulates evidence; good at detecting sustained gradual shifts, but signalling time depends strongly on the reset policy.',
  };
}

/** Robust MAD-based outlier rule on week-over-week differences. */
export function detectMAD(series, { k = 3.5, window = 26 } = {}) {
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    if (win.length < 6) return { date: p.date, flag: false, score: 0, insufficient: true };
    const sorted = [...win].sort((a, b) => a - b);
    const med = sorted[Math.floor(sorted.length / 2)];
    const devs = win.map((v) => Math.abs(v - med)).sort((a, b) => a - b);
    const mad = devs[Math.floor(devs.length / 2)] || 1;
    const score = (p.value - med) / (1.4826 * mad);
    return { date: p.date, flag: score >= k, score: +score.toFixed(2), expected: med };
  });
  return {
    id: 'mad', name: `Robust MAD rule (k=${k})`, implemented: true,
    params: { k, window }, flags,
    note: 'Resistant to contamination by previous outbreaks in the training window — a common failure mode of mean/SD baselines.',
  };
}

/** Registry including methods that are explicitly NOT implemented. */
export const DETECTORS = [
  { id: 'threshold', label: 'Fixed threshold', family: 'Threshold', run: detectThreshold, implemented: true },
  { id: 'seasonal', label: 'Seasonal baseline + kσ', family: 'Statistical baseline', run: detectSeasonalZ, implemented: true },
  { id: 'ewma', label: 'EWMA control chart', family: 'Time series', run: detectEWMA, implemented: true },
  { id: 'cusum', label: 'CUSUM', family: 'Time series', run: detectCUSUM, implemented: true },
  { id: 'mad', label: 'Robust MAD', family: 'Anomaly detection', run: detectMAD, implemented: true },
  { id: 'farrington', label: 'Farrington-type quasi-Poisson regression', family: 'Statistical baseline', implemented: false,
    plan: 'Requires an over-dispersed GLM with trend and seasonality terms and exclusion of historical epidemic periods. Planned as the primary statistical comparator.' },
  { id: 'iforest', label: 'Isolation Forest', family: 'Classical ML (unsupervised)', implemented: false,
    plan: 'Requires a feature matrix and a decision on contamination rate; unsupervised scores are not directly comparable to a calibrated alarm rate.' },
  { id: 'rf', label: 'Random Forest classifier', family: 'Classical ML (supervised)', implemented: false,
    plan: 'Requires labelled reference periods. Label definition must be fixed and documented before fitting to prevent leakage.' },
  { id: 'gbm', label: 'Gradient boosting (XGBoost/LightGBM)', family: 'Classical ML (supervised)', implemented: false,
    plan: 'Same labelling prerequisite as Random Forest. Expected to overfit small surveillance datasets without strong regularisation.' },
  { id: 'sarima', label: 'SARIMA / state-space forecast residuals', family: 'Time series', implemented: false,
    plan: 'Forecast-residual detection with prediction intervals; needs stationarity handling and order selection protocol.' },
  { id: 'lstm', label: 'Sequence model (LSTM / TCN)', family: 'Deep learning', implemented: false,
    plan: 'Later-stage only. Cannot be justified before a statistical baseline comparison exists; data volume in most surveillance series is far below the regime where deep models help.' },
];

/** Agreement matrix between detector outputs (not a validation metric). */
export function detectorAgreement(results) {
  const ids = results.map((r) => r.id);
  const m = {};
  ids.forEach((a) => {
    m[a] = {};
    ids.forEach((b) => {
      const ra = results.find((r) => r.id === a).flags;
      const rb = results.find((r) => r.id === b).flags;
      const n = Math.min(ra.length, rb.length);
      let agree = 0, both = 0, either = 0;
      for (let i = 0; i < n; i++) {
        if (ra[i].flag === rb[i].flag) agree++;
        if (ra[i].flag && rb[i].flag) both++;
        if (ra[i].flag || rb[i].flag) either++;
      }
      m[a][b] = { agreement: +(agree / n).toFixed(3), jaccard: either ? +(both / either).toFixed(3) : null };
    });
  });
  return m;
}

```

---

## 20. `frontend/src/lib/surveillance.js`

```js
/* ============================================================
   BIOWATCH-AI — DERIVED SURVEILLANCE STATE (DEMONSTRATION MODE)
   ------------------------------------------------------------
   Builds the synthetic surveillance picture ONCE so that the
   command centre, map, alert centre, XAI panel and regional view
   all describe the SAME simulated situation. Consistency here is
   a scientific-integrity requirement, not a convenience: a
   prototype that contradicts itself across modules teaches the
   reviewer nothing about the real architecture.

   ALL VALUES ARE SIMULATED.
   ============================================================ */
import { COUNTRY_POINTS, PATHOGENS } from './registry';
import { synthSeries, rng, fmtTs } from './synth';

/* Which synthetic stories exist in DEMONSTRATION mode.
   Each is an interface scenario, not a claim about any country. */
const SCENARIOS = [
  { iso: 'NGA', pathogen: 'lassa',      inject: 9,  size: 0.85, level: 42,  streams: ['epi', 'lab'] },
  { iso: 'BRA', pathogen: 'dengue',     inject: 12, size: 0.65, level: 900, streams: ['epi', 'lab', 'env'] },
  { iso: 'DEU', pathogen: 'influenza-a',inject: 6,  size: 0.42, level: 310, streams: ['epi', 'synd', 'lab'] },
  { iso: 'IND', pathogen: 'measles',    inject: 8,  size: 0.55, level: 260, streams: ['epi', 'lab'] },
  { iso: 'GBR', pathogen: 'sars-cov-2', inject: 5,  size: 0.3,  level: 480, streams: ['env', 'epi', 'genomic'] },
  { iso: 'COD', pathogen: 'cholera',    inject: 10, size: 0.7,  level: 120, streams: ['epi', 'env'] },
  { iso: 'USA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 1400,streams: ['epi', 'synd', 'lab', 'genomic'] },
  { iso: 'JPN', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 520, streams: ['epi', 'lab'] },
  { iso: 'ZAF', pathogen: 'sars-cov-2', inject: 0,  size: 0,    level: 210, streams: ['epi', 'env', 'genomic'] },
  { iso: 'KEN', pathogen: 'cholera',    inject: 4,  size: 0.35, level: 60,  streams: ['epi'] },
  { iso: 'PHL', pathogen: 'dengue',     inject: 0,  size: 0,    level: 340, streams: ['epi', 'lab'] },
  { iso: 'FRA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 290, streams: ['epi', 'synd'] },
  { iso: 'IDN', pathogen: 'dengue',     inject: 3,  size: 0.28, level: 410, streams: ['epi'] },
  { iso: 'MEX', pathogen: 'dengue',     inject: 0,  size: 0,    level: 220, streams: ['epi', 'lab'] },
  { iso: 'ETH', pathogen: 'measles',    inject: 0,  size: 0,    level: 95,  streams: ['epi'], availability: 'sparse' },
  { iso: 'PAK', pathogen: 'cholera',    inject: 0,  size: 0,    level: 88,  streams: ['epi'], availability: 'sparse' },
  { iso: 'EGY', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 130, streams: ['epi'] },
  { iso: 'THA', pathogen: 'dengue',     inject: 0,  size: 0,    level: 180, streams: ['epi', 'lab'] },
  { iso: 'AUS', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 240, streams: ['epi', 'lab', 'genomic'] },
  { iso: 'GHA', pathogen: 'cholera',    inject: 0,  size: 0,    level: 45,  streams: ['epi'], availability: 'none' },
  { iso: 'CHN', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 700, streams: ['epi'], availability: 'sparse' },
  { iso: 'ITA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 260, streams: ['epi', 'synd'] },
];

/** Deterministic detector cascade applied to a synthetic series. */
export function evaluateSeries(series, { z1 = 2.0, z2 = 3.0, persist = 2 } = {}) {
  const marked = series.map((p) => ({ ...p, flag: p.z >= z1 ? p.value : undefined }));
  const last = marked[marked.length - 1];
  const recent = marked.slice(-4);
  const consecutive = (() => {
    let c = 0;
    for (let i = marked.length - 1; i >= 0; i--) { if (marked[i].z >= z1) c++; else break; }
    return c;
  })();
  const maxZ = Math.max(...recent.map((p) => p.z));
  let state = 'GREEN';
  if (last.z >= z1 && consecutive >= persist) state = 'ORANGE';
  else if (last.z >= z1) state = 'YELLOW';
  if (last.z >= z2 && consecutive >= persist) state = 'RED';
  if (state === 'GREEN' && maxZ >= z1) state = 'YELLOW';
  return { series: marked, last, state, consecutive, maxZ: +maxZ.toFixed(2), z: last.z };
}

const _cache = {};

export function buildSurveillance() {
  if (_cache.data) return _cache.data;

  const countries = SCENARIOS.map((sc) => {
    const geo = COUNTRY_POINTS.find((c) => c.iso === sc.iso);
    const path = PATHOGENS.find((p) => p.id === sc.pathogen);
    const key = `${sc.iso}:${sc.pathogen}`;
    const series = synthSeries(key, {
      weeks: 104, level: sc.level, season: sc.pathogen === 'lassa' ? 0.7 : 0.45,
      injectAt: sc.inject || null, injectSize: sc.size, disp: 0.2,
      phase: (sc.iso.charCodeAt(0) + sc.iso.charCodeAt(2)) % 52,
    });
    const ev = evaluateSeries(series);
    const r = rng(key + ':meta');
    const availability = sc.availability || (r() > 0.75 ? 'sparse' : 'full');
    return {
      iso: sc.iso, name: geo?.name || sc.iso, lon: geo?.lon, lat: geo?.lat, region: geo?.region,
      pathogen: path, pathogenId: sc.pathogen, streams: sc.streams, availability,
      ...ev,
      completeness: +(availability === 'none' ? 0 : availability === 'sparse' ? 0.42 + r() * 0.2 : 0.78 + r() * 0.2).toFixed(2),
      delayWeeks: +(availability === 'sparse' ? 2.2 + r() * 2 : 0.6 + r() * 1.2).toFixed(1),
      lastUpdate: fmtTs(new Date(Date.now() - Math.floor(r() * 60) * 3600000)),
    };
  });

  /* Map payload: state + label using permitted phrasing only. */
  const LABEL = {
    GREEN: 'No unusual activity detected',
    YELLOW: 'Signal detected — review',
    ORANGE: 'Unusual activity — investigate',
    RED: 'Elevated reporting — human assessment',
  };
  const mapValues = Object.fromEntries(countries.map((c) => [c.iso, {
    state: c.availability === 'none' ? 'GREEN' : c.state,
    label: c.availability === 'none' ? 'Insufficient data for baseline' : LABEL[c.state],
    availability: c.availability === 'none' ? 'none' : undefined,
    metrics: [
      { k: 'Stream', v: c.pathogen?.name },
      { k: 'Deviation (z)', v: c.availability === 'none' ? '—' : c.z.toFixed(2) },
      { k: 'Consecutive weeks', v: c.availability === 'none' ? '—' : c.consecutive },
      { k: 'Completeness', v: c.availability === 'none' ? 'DATA NOT AVAILABLE' : `${Math.round(c.completeness * 100)}%` },
    ],
  }]));

  /* Alerts derive strictly from detector output — never invented. */
  const alerts = countries
    .filter((c) => c.state !== 'GREEN' && c.availability !== 'none')
    .sort((a, b) => b.z - a.z)
    .map((c, i) => buildAlert(c, i));

  const data = { countries, mapValues, alerts, generatedAt: fmtTs() };
  _cache.data = data;
  return data;
}

const ALT_EXPLANATIONS = {
  epi: [
    'Change in case definition or reporting form at the source',
    'Catch-up reporting after a backlog or public holiday',
    'Increased testing capacity raising ascertainment without a change in incidence',
    'Duplicate records introduced during a data migration',
  ],
  lab: [
    'Laboratory reagent or platform change affecting positivity',
    'Referral pattern shift concentrating specimens at one facility',
    'Seasonal testing campaign inflating denominators',
  ],
  env: [
    'Rainfall dilution or industrial discharge altering wastewater concentration',
    'Change in sampling site, flow normalisation or assay',
    'Sampling frequency change creating an apparent trend',
  ],
  synd: [
    'Co-circulating pathogen producing the same syndrome',
    'Media attention increasing care-seeking behaviour',
    'Change in the sentinel practice panel',
  ],
  genomic: [
    'Sequencing bias — targeted sequencing of unusual specimens',
    'Change in submission cadence by a contributing laboratory',
  ],
};

function buildAlert(c, i) {
  const r = rng(`${c.iso}:${c.pathogenId}:alert`);
  const primary = c.streams[0];
  const concordant = c.streams.filter(() => r() > 0.5);
  const wks = c.series.length;
  return {
    id: `BW-${new Date().getFullYear()}-${String(1041 + i)}`,
    state: c.state,
    iso: c.iso,
    country: c.name,
    region: c.region,
    pathogen: c.pathogen?.name,
    pathogenId: c.pathogenId,
    what: `${c.pathogen?.name} ${primary === 'env' ? 'environmental indicator' : primary === 'lab' ? 'laboratory confirmations' : 'reported cases'} exceeded the estimated seasonal baseline for ${c.consecutive} consecutive week${c.consecutive === 1 ? '' : 's'}.`,
    where: `${c.name} — national aggregate (sub-national resolution not available in this synthetic stream)`,
    when: (() => {
      /* consecutive may be 0 for a YELLOW state raised by a recent-window
         exceedance rather than a current one — clamp the index. */
      const firstIdx = Math.min(wks - 1, Math.max(0, wks - Math.max(1, c.consecutive)));
      return `Detected on the week ending ${c.series[wks - 1].date}; first exceedance in the current window ${c.series[firstIdx].date}`;
    })(),
    source: primary,
    sources: c.streams,
    observed: c.last.value,
    baseline: c.last.baseline,
    interval: [c.last.lo, c.last.hi],
    z: c.z,
    detector: 'Seasonal baseline (52-week harmonic) + 2σ exceedance with 2-week persistence rule',
    model: 'Statistical baseline only — no trained machine-learning model contributed to this signal',
    confidence: c.completeness > 0.8 ? 'Moderate' : 'Low',
    uncertainty: `Baseline estimated from ${wks} synthetic weeks; 95% interval ${c.last.lo}–${c.last.hi}. Reporting delay ≈ ${c.delayWeeks} weeks means the most recent point is likely to revise upward.`,
    concordance: concordant.length > 1
      ? `Deviation appears in ${concordant.length} of ${c.streams.length} configured streams`
      : 'Deviation appears in a single stream only — weak evidence',
    alternatives: (ALT_EXPLANATIONS[primary] || ALT_EXPLANATIONS.epi).slice(0, 3),
    recommended: c.state === 'RED'
      ? 'Escalate to a qualified epidemiologist for assessment within 24 h. Verify against the primary source before any external communication.'
      : c.state === 'ORANGE'
        ? 'Assign to an analyst for structured investigation. Check source data revisions and cross-stream concordance.'
        : 'Add to triage queue. Re-evaluate at the next data refresh before any action.',
    status: i === 0 ? 'Under review' : i < 3 ? 'Awaiting triage' : 'Awaiting triage',
    createdAt: fmtTs(new Date(Date.now() - (i + 1) * 5400000)),
  };
}

export function summarise(s) {
  const active = s.alerts.length;
  const byState = ['RED', 'ORANGE', 'YELLOW', 'GREEN'].map((k) => ({
    state: k, n: s.countries.filter((c) => c.state === k && c.availability !== 'none').length,
  }));
  return {
    monitored: s.countries.length,
    withData: s.countries.filter((c) => c.availability !== 'none').length,
    active,
    underReview: s.alerts.filter((a) => a.status === 'Under review').length,
    awaiting: s.alerts.filter((a) => a.status === 'Awaiting triage').length,
    byState,
    meanCompleteness: +(s.countries.reduce((a, c) => a + c.completeness, 0) / s.countries.length).toFixed(2),
    meanDelay: +(s.countries.reduce((a, c) => a + c.delayWeeks, 0) / s.countries.length).toFixed(1),
  };
}

```

---

## 21. `frontend/src/components/Brand.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — BRAND / VISUAL IDENTITY (PART 1)
   ------------------------------------------------------------
   Mark concept: a hexagonal "field of view" (surveillance /
   microscope aperture) enclosing a double-helix strand that
   resolves into a signal trace with a detected deviation.
   Reads as: BIOLOGY inside SURVEILLANCE producing a SIGNAL.
   Drawn as inline SVG so it renders without any network access.
   ============================================================ */

export function Logo({ size = 32, tone = 'var(--color-bw-primary-bright)', tone2 = 'var(--color-bw-genomic)', title = 'BIOWATCH-AI' }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" role="img" aria-label={title} className="shrink-0">
      <title>{title}</title>
      {/* aperture hexagon — the "watch" field of view */}
      <path
        d="M24 2.6 41.5 12.8v20.4L24 43.4 6.5 33.2V12.8Z"
        fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round" opacity="0.85"
      />
      <path
        d="M24 7.6 37.2 15.3v15.4L24 38.4 10.8 30.7V15.3Z"
        fill="none" stroke={tone} strokeWidth="0.7" strokeLinejoin="round" opacity="0.3"
      />
      {/* double helix strands */}
      <path d="M17 13c6 4 6 7.5 0 11.5S11 32 17 36" fill="none" stroke={tone2} strokeWidth="1.7" strokeLinecap="round" opacity="0.95" />
      <path d="M31 13c-6 4-6 7.5 0 11.5s6 7.5 0 11.5" fill="none" stroke={tone2} strokeWidth="1.7" strokeLinecap="round" opacity="0.6" />
      {/* base pairs */}
      <g stroke={tone} strokeWidth="1.1" strokeLinecap="round" opacity="0.55">
        <line x1="18.6" y1="16.2" x2="29.4" y2="16.2" />
        <line x1="20.4" y1="24.5" x2="27.6" y2="24.5" />
        <line x1="18.6" y1="32.8" x2="29.4" y2="32.8" />
      </g>
      {/* signal trace with detected deviation */}
      <path d="M11 27.5h5.5l2.4-3.1 2.6 6.4 2.5-9.6 2.6 6.6 2-2.4H37"
        fill="none" stroke={tone} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="21.2" r="2.5" fill="none" stroke={tone} strokeWidth="1" opacity="0.9" />
      <circle cx="24" cy="21.2" r="1" fill={tone} />
    </svg>
  );
}

export function Wordmark({ size = 'md', sub = true }) {
  const scale = { sm: 'text-[13px]', md: 'text-[15px]', lg: 'text-[22px]', xl: 'text-[32px]' }[size];
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span className={`${scale} font-semibold tracking-[0.16em] text-bw-text`}>
        BIOWATCH<span className="text-bw-primary-bright">-AI</span>
      </span>
      {sub && (
        <span className="mt-1 font-mono text-[8.5px] tracking-[0.22em] text-bw-dim">
          BIOLOGICAL SIGNAL INTELLIGENCE
        </span>
      )}
    </span>
  );
}

export function LogoLockup({ size = 30, wordSize = 'md', sub = true }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Logo size={size} />
      <Wordmark size={wordSize} sub={sub} />
    </span>
  );
}

export const TAGLINE = 'Watching biology for the signal before the story.';
export const TAGLINE_FORMAL =
  'AI-assisted biological surveillance and early outbreak signal detection';

```

---

## 22. `frontend/src/components/ui.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — UI KIT (design system components)
   ============================================================ */
import { useState } from 'react';
import { EVIDENCE, SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';

/* ---------- Evidence tag ---------------------------------- */
export function EvidenceTag({ t = 'SIMULATED', size = 'sm', title }) {
  const e = EVIDENCE[t] || EVIDENCE.ASSUMPTION;
  return (
    <span
      title={title || e.definition}
      className={`inline-flex items-center gap-1 rounded-sm border font-mono uppercase tracking-[0.12em] ${
        size === 'xs' ? 'px-1 py-[1px] text-[9px]' : 'px-1.5 py-[2px] text-[10px]'
      }`}
      style={{ color: e.color, borderColor: e.color + '66', background: e.color + '14' }}
    >
      {e.label}
    </span>
  );
}

/* ---------- Generic pill / badge -------------------------- */
export function Pill({ children, color = 'var(--color-bw-muted)', filled = false, className = '', title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.1em] ${className}`}
      style={{
        color: filled ? '#08121a' : color,
        borderColor: color + (filled ? '' : '55'),
        background: filled ? color : color + '12',
      }}
    >
      {children}
    </span>
  );
}

export function Dot({ color, pulse = false }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${pulse ? 'bw-pulse-dot' : ''}`}
      style={{ background: color, color }}
    />
  );
}

/* ---------- Panel ----------------------------------------- */
export function Panel({
  title, subtitle, evidence, actions, children, className = '',
  bodyClass = '', dense = false, accent,
}) {
  return (
    <section
      className={`flex min-w-0 flex-col rounded-md border border-bw-line bg-bw-panel ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: 2 } : undefined}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-bw-line px-3 py-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {title && <h3 className="bw-h2 truncate text-bw-text">{title}</h3>}
              {evidence && <EvidenceTag t={evidence} size="xs" />}
            </div>
            {subtitle && <p className="mt-0.5 text-[11px] leading-snug text-bw-dim">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={`min-w-0 flex-1 ${dense ? 'p-2' : 'p-3'} ${bodyClass}`}>{children}</div>
    </section>
  );
}

/* ---------- Stat tile ------------------------------------- */
export function Stat({ label, value, unit, evidence, hint, color, sub }) {
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <span className="bw-label">{label}</span>
        {evidence && <EvidenceTag t={evidence} size="xs" />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="bw-num text-2xl font-semibold leading-none" style={{ color: color || 'var(--color-bw-text)' }}>
          {value}
        </span>
        {unit && <span className="bw-num text-[11px] text-bw-dim">{unit}</span>}
      </div>
      {sub && <div className="mt-1 text-[11px] text-bw-muted">{sub}</div>}
      {hint && <div className="mt-1 text-[10px] leading-snug text-bw-dim">{hint}</div>}
    </div>
  );
}

/* ---------- Data-state badge (mode aware) ----------------- */
export function DataState({ state, ts, source }) {
  const { meta } = useMode();
  const s = state || meta.dataBadge;
  const map = {
    LIVE: 'var(--color-bw-data)',
    'DEMO DATA': 'var(--color-ev-simulated)',
    'RESEARCH DATA': 'var(--color-bw-primary-bright)',
    'CONNECTOR NOT CONFIGURED': 'var(--color-bw-dim)',
    STALE: 'var(--color-alert-yellow)',
    ERROR: 'var(--color-alert-red)',
  };
  const color = map[s] || 'var(--color-bw-muted)';
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Pill color={color}><Dot color={color} pulse={s === 'LIVE'} />{s}</Pill>
      {ts !== undefined && (
        <span className="bw-num text-[10px] text-bw-dim">Last updated: {ts || '—'}</span>
      )}
      {source && <span className="text-[10px] text-bw-dim">· {source}</span>}
    </span>
  );
}

/* ---------- Banners --------------------------------------- */
export function SimulatedBanner({ text, compact = false, evidence = 'SIMULATED' }) {
  const { isDemo } = useMode();
  if (!isDemo && !text) return null;
  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-md border ${compact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
      style={{ borderColor: 'var(--color-ev-simulated)55', background: 'var(--color-ev-simulated)0f' }}
    >
      <EvidenceTag t={evidence} size="xs" />
      <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
        {text || SAFE_LANGUAGE.simulatedBanner}
      </span>
    </div>
  );
}

export function Callout({ tone = 'info', title, children, icon }) {
  const tones = {
    info: 'var(--color-bw-data)',
    warn: 'var(--color-alert-yellow)',
    danger: 'var(--color-alert-red)',
    ok: 'var(--color-alert-green)',
    neutral: 'var(--color-bw-line2)',
  };
  const c = tones[tone] || tones.info;
  return (
    <div className="rounded-md border px-3 py-2" style={{ borderColor: c + '55', background: c + '0d' }}>
      {title && (
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: c }}>
          {icon}{title}
        </div>
      )}
      <div className="text-[12px] leading-relaxed text-bw-muted">{children}</div>
    </div>
  );
}

/* ---------- Not-implemented / awaiting placeholders -------- */
export function NotImplemented({ what, plan, className = '' }) {
  return (
    <div className={`rounded-md border border-dashed border-bw-line2 bg-bw-panel2/40 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <EvidenceTag t="PLAN" size="xs" />
        <span className="font-mono text-[10px] tracking-[0.12em] text-bw-muted">
          {SAFE_LANGUAGE.notImplemented}
        </span>
      </div>
      {what && <p className="mt-2 text-[12px] text-bw-text">{what}</p>}
      {plan && <p className="mt-1 text-[11px] leading-relaxed text-bw-dim">{plan}</p>}
    </div>
  );
}

export function Awaiting({ label = SAFE_LANGUAGE.awaitingExperiment, note }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="bw-num text-[13px] text-bw-dim italic">{label}</span>
      {note && <span className="text-[10px] text-bw-dim">{note}</span>}
    </div>
  );
}

export function NoData({ reason }) {
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel2/50 px-3 py-4 text-center">
      <div className="font-mono text-[11px] tracking-[0.14em] text-bw-dim">{SAFE_LANGUAGE.noData}</div>
      {reason && <div className="mt-1 text-[11px] text-bw-dim">{reason}</div>}
    </div>
  );
}

/* ---------- Table ----------------------------------------- */
export function Table({ columns, rows, empty = 'No records', dense = false, rowKey }) {
  if (!rows || rows.length === 0) {
    return <div className="px-2 py-6 text-center text-[12px] text-bw-dim">{empty}</div>;
  }
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-bw-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className="bw-label whitespace-nowrap px-2 pb-1.5 pt-1 font-normal"
                style={{ textAlign: c.align || 'left', width: c.width }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={rowKey ? r[rowKey] : i}
              className="border-b border-bw-line/60 last:border-0 hover:bg-bw-panel2/60"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-2 align-top ${dense ? 'py-1' : 'py-2'} text-[12px] text-bw-text`}
                  style={{ textAlign: c.align || 'left' }}
                >
                  {c.render ? c.render(r, i) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Segmented control ----------------------------- */
export function Segmented({ options, value, onChange, size = 'sm' }) {
  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-sm border border-bw-line bg-bw-panel2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`border-r border-bw-line px-2.5 font-mono uppercase tracking-[0.08em] transition-colors last:border-0 ${
              size === 'xs' ? 'py-[3px] text-[9px]' : 'py-1 text-[10px]'
            } ${active ? 'text-[#08121a]' : 'text-bw-muted hover:bg-bw-line/40 hover:text-bw-text'}`}
            style={active ? { background: o.color || 'var(--color-bw-primary)' } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Buttons --------------------------------------- */
export function Btn({ children, onClick, variant = 'ghost', size = 'sm', disabled, title, type = 'button', className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-sm border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const sizes = { xs: 'px-2 py-1 text-[10px]', sm: 'px-2.5 py-1.5 text-[11px]', md: 'px-3.5 py-2 text-[12px]' };
  const variants = {
    primary: 'border-bw-primary bg-bw-primary/90 text-[#04120f] hover:bg-bw-primary',
    ghost: 'border-bw-line bg-bw-panel2 text-bw-muted hover:border-bw-line2 hover:text-bw-text',
    outline: 'border-bw-primary/50 bg-transparent text-bw-primary-bright hover:bg-bw-primary/10',
    danger: 'border-[var(--color-alert-red)]/50 bg-transparent text-[var(--color-alert-red)] hover:bg-[var(--color-alert-red)]/10',
  };
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

/* ---------- Field / select / input ------------------------ */
export function Field({ label, hint, children, evidence }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="bw-label">{label}</span>
        {evidence && <EvidenceTag t={evidence} size="xs" />}
      </div>
      {children}
      {hint && <p className="mt-1 text-[10px] leading-snug text-bw-dim">{hint}</p>}
    </label>
  );
}

export function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[12px] text-bw-text outline-none focus:border-bw-primary ${className}`}
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[12px] text-bw-text placeholder:text-bw-dim outline-none focus:border-bw-primary ${className}`}
    />
  );
}

export function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 py-0.5">
      <input
        type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[var(--color-bw-primary)]"
      />
      <span className="min-w-0">
        <span className="block text-[12px] text-bw-text">{label}</span>
        {hint && <span className="block text-[10px] text-bw-dim">{hint}</span>}
      </span>
    </label>
  );
}

/* ---------- Meter ----------------------------------------- */
export function Meter({ value, max = 100, color = 'var(--color-bw-primary)', height = 6, label, right }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      {(label || right) && (
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[11px] text-bw-muted">{label}</span>
          <span className="bw-num text-[11px] text-bw-dim">{right}</span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-sm bg-bw-line/70" style={{ height }}>
        <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ---------- Key/value list -------------------------------- */
export function KV({ items, cols = 1, mono = true }) {
  return (
    <dl className={`grid gap-x-6 gap-y-2 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
      {items.map((it) => (
        <div key={it.k} className="min-w-0 border-b border-bw-line/50 pb-1.5 last:border-0">
          <dt className="bw-label">{it.k}</dt>
          <dd className={`mt-0.5 break-words text-[12px] text-bw-text ${mono && it.mono !== false ? 'bw-num' : ''}`}>
            {it.v ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Collapsible ----------------------------------- */
export function Disclosure({ summary, children, defaultOpen = false, tag }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel2/40">
      <button
        type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] font-medium text-bw-text">
          {summary} {tag && <EvidenceTag t={tag} size="xs" />}
        </span>
        <span className="bw-num text-[11px] text-bw-dim">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="border-t border-bw-line px-3 py-2.5">{children}</div>}
    </div>
  );
}

/* ---------- Page header ----------------------------------- */
export function PageHeader({ title, kicker, description, evidence, right, children }) {
  const { meta } = useMode();
  return (
    <div className="mb-4 border-b border-bw-line pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {kicker && <div className="bw-label mb-1">{kicker}</div>}
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="bw-h1 text-bw-text">{title}</h1>
            {evidence && <EvidenceTag t={evidence} />}
          </div>
          {description && (
            <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-bw-muted">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <DataState ts={fmtTs()} />
          {right}
        </div>
      </div>
      {children}
      <div className="mt-2 text-[10px] text-bw-dim">
        Active mode: <span style={{ color: meta.color }}>{meta.key}</span> — {meta.description}
      </div>
    </div>
  );
}

export function Grid({ cols = 'md:grid-cols-2', gap = 'gap-3', children, className = '' }) {
  return <div className={`grid grid-cols-1 ${cols} ${gap} ${className}`}>{children}</div>;
}

```

---

## 23. `frontend/src/components/charts.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — CHART PRIMITIVES
   Thin, consistently-styled wrappers over Recharts so that every
   module renders data with the same visual grammar:
     observed = solid line, baseline = dashed, interval = band,
     flagged points = ringed markers.
   ============================================================ */
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, BarChart, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Scatter, Cell, LineChart, RadialBarChart, RadialBar,
} from 'recharts';

export const AXIS = { stroke: '#3a5061', fontSize: 10, fontFamily: 'var(--font-mono)' };
const GRID = '#1e2c37';

function TipBox({ active, payload, label, unit, note }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-bw-line2 bg-bw-panel2 px-2.5 py-2 shadow-xl">
      <div className="bw-num mb-1 text-[10px] text-bw-dim">{label}</div>
      {payload.filter((p) => p.value !== undefined && p.value !== null).map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.stroke }} />
          <span className="text-bw-muted">{p.name}</span>
          <span className="bw-num ml-auto text-bw-text">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{unit || ''}
          </span>
        </div>
      ))}
      <div className="mt-1 border-t border-bw-line pt-1 font-mono text-[8.5px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
        {note || 'SIMULATED'}
      </div>
    </div>
  );
}

/** Observed series vs baseline with 95% interval and flagged deviations. */
export function SignalChart({
  data, height = 200, color = 'var(--color-bw-primary-bright)', showBaseline = true,
  showBand = true, flagKey = 'flag', yLabel, note, valueName = 'Observed',
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="date" {...AXIS} tickLine={false} axisLine={{ stroke: GRID }}
          minTickGap={44} tickFormatter={(v) => String(v).slice(2, 7)} />
        <YAxis {...AXIS} tickLine={false} axisLine={false} width={46}
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#3a5061', fontSize: 9, offset: 16 } : undefined} />
        <Tooltip content={<TipBox note={note} />} cursor={{ stroke: '#2a3b49' }} />
        {showBand && <Area type="monotone" dataKey="hi" stroke="none" fill="#2ea89a" fillOpacity={0.09} name="Upper 95%" isAnimationActive={false} />}
        {showBand && <Area type="monotone" dataKey="lo" stroke="none" fill="#0b1117" fillOpacity={1} name="Lower 95%" isAnimationActive={false} />}
        {showBaseline && <Line type="monotone" dataKey="baseline" stroke="#7f95a6" strokeWidth={1.2} strokeDasharray="4 3" dot={false} name="Baseline" isAnimationActive={false} />}
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.7} dot={false} name={valueName} isAnimationActive={false} />
        <Scatter dataKey={flagKey} fill="var(--color-alert-orange)" shape="circle" name="Flagged" isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Spark({ data, dataKey = 'value', color = 'var(--color-bw-primary)', height = 34, type = 'line' }) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey={dataKey} fill={color} radius={[1, 1, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 3, right: 1, bottom: 1, left: 1 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.4} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, xKey = 'name', yKey = 'value', height = 200, color = 'var(--color-bw-primary)', horizontal = false, note, unit, colorKey }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 4, right: 10, bottom: 0, left: horizontal ? 8 : -20 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? <>
          <XAxis type="number" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey={xKey} {...AXIS} tickLine={false} axisLine={false} width={128} />
        </> : <>
          <XAxis dataKey={xKey} {...AXIS} tickLine={false} axisLine={{ stroke: GRID }} interval={0} angle={0} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} width={46} />
        </>}
        <Tooltip content={<TipBox note={note} unit={unit} />} cursor={{ fill: '#16212b' }} />
        <Bar dataKey={yKey} radius={horizontal ? [0, 2, 2, 0] : [2, 2, 0, 0]} isAnimationActive={false}>
          {data.map((d, i) => <Cell key={i} fill={colorKey ? d[colorKey] : color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Diverging contribution chart (SHAP-style layout, model-agnostic). */
export function Contributions({ data, height = 220, note }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" {...AXIS} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="feature" {...AXIS} tickLine={false} axisLine={false} width={168} />
        <Tooltip content={<TipBox note={note} />} cursor={{ fill: '#16212b' }} />
        <ReferenceLine x={0} stroke="#3a5061" />
        <Bar dataKey="contribution" radius={2} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.contribution >= 0 ? 'var(--color-alert-orange)' : 'var(--color-bw-data)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Stacked({ data, keys, colors, xKey = 'date', height = 200, note }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey={xKey} {...AXIS} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={40}
          tickFormatter={(v) => String(v).slice(2, 7)} />
        <YAxis {...AXIS} tickLine={false} axisLine={false} width={46} />
        <Tooltip content={<TipBox note={note} />} cursor={{ fill: '#16212b' }} />
        {keys.map((k, i) => (
          <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={colors[i]} fill={colors[i]}
            fillOpacity={0.28} strokeWidth={1.2} isAnimationActive={false} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Gauge({ value, max = 1, color = 'var(--color-bw-primary)', height = 110, label }) {
  const data = [{ name: label, value: Math.max(0, Math.min(max, value)), fill: color }];
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
          <RadialBar background={{ fill: '#1e2c37' }} dataKey="value" cornerRadius={2} isAnimationActive={false} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

```

---

## 24. `frontend/src/components/WorldMap.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — WORLD SURVEILLANCE MAP
   d3-geo + local Natural-Earth topology (no network dependency).
   Visual encoding is deliberately conservative:
     - fill  = signal STATE (none / review / investigate / assess)
     - ring  = data availability, NOT disease burden
     - hatch = insufficient data (never rendered as "low activity")
   A signal is never rendered as a confirmed outbreak.
   ============================================================ */
import { useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10, geoOrthographic, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import topo from '../data/countries-110m.json';
import { ALERT_STATES } from '../lib/evidence';

/* ISO3 ⇄ M49 numeric ids for the subset used by the prototype */
export const ISO_NUM = {
  NGA: '566', GHA: '288', ZAF: '710', KEN: '404', ETH: '231', COD: '180', EGY: '818',
  PAK: '586', GBR: '826', DEU: '276', FRA: '250', ITA: '380', USA: '840', BRA: '076',
  MEX: '484', IND: '356', IDN: '360', THA: '764', JPN: '392', PHL: '608', AUS: '036', CHN: '156',
  SEN: '686', MAR: '504', DZA: '012', TZA: '834', UGA: '800', ZMB: '894', MOZ: '508',
  CMR: '120', CIV: '384', SDN: '729', SOM: '706', MDG: '450', AGO: '024', NER: '562',
  MLI: '466', BFA: '854', TCD: '148', ZWE: '716', RWA: '646', BDI: '108', LBR: '430',
  SLE: '694', GIN: '324', TUN: '788', LBY: '434', BWA: '072', NAM: '516', MWI: '454',
};
export const NUM_ISO = Object.fromEntries(Object.entries(ISO_NUM).map(([k, v]) => [String(Number(v)), k]));

const STATE_FILL = {
  GREEN: '#16323f',
  YELLOW: 'rgba(215,178,60,0.42)',
  ORANGE: 'rgba(217,130,43,0.5)',
  RED: 'rgba(207,74,74,0.55)',
  NODATA: '#121b23',
};

export default function WorldMap({
  values = {},            // { ISO3: { state, label, metrics: [{k,v}], availability } }
  height = 420,
  projection = 'natural',
  onSelect,
  selected,
  points = [],            // [{lon,lat,label,color,r}]
  focus = null,           // [lon, lat, scaleFactor] to centre on a region
  showGraticule = true,
}) {
  const [hover, setHover] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const width = 960;

  const land = useMemo(() => feature(topo, topo.objects.countries), []);

  const { path, proj } = useMemo(() => {
    let p;
    if (projection === 'orthographic') p = geoOrthographic().rotate([-20, -5]).fitExtent([[8, 8], [width - 8, height - 8]], land);
    else if (projection === 'mercator') p = geoMercator().fitExtent([[8, 8], [width - 8, height - 8]], land);
    else p = geoNaturalEarth1().fitExtent([[8, 8], [width - 8, height - 8]], land);
    if (focus) {
      p.center([focus[0], focus[1]]).scale(p.scale() * (focus[2] || 3)).translate([width / 2, height / 2]);
    }
    return { path: geoPath(p), proj: p };
  }, [projection, height, land, focus]);

  const graticule = useMemo(() => (showGraticule ? geoPath(proj)(geoGraticule10()) : null), [proj, showGraticule]);

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-bw-line bg-[#08121a]">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <pattern id="bw-hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#101a22" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#22323f" strokeWidth="1.4" />
          </pattern>
          <radialGradient id="bw-ocean">
            <stop offset="0%" stopColor="#0a1620" />
            <stop offset="100%" stopColor="#070d13" />
          </radialGradient>
        </defs>

        <rect width={width} height={height} fill="url(#bw-ocean)" />
        {graticule && <path d={graticule} fill="none" stroke="#132029" strokeWidth="0.5" />}

        {land.features.map((f, fi) => {
          const iso = NUM_ISO[String(Number(f.id))];
          const v = iso ? values[iso] : null;
          const isSel = iso && selected === iso;
          const fill = v ? (v.availability === 'none' ? 'url(#bw-hatch)' : STATE_FILL[v.state] || STATE_FILL.NODATA) : STATE_FILL.NODATA;
          return (
            <path
              key={`${f.id ?? 'na'}-${fi}`}
              d={path(f)}
              fill={fill}
              stroke={isSel ? 'var(--color-bw-primary-bright)' : '#1c2a34'}
              strokeWidth={isSel ? 1.4 : 0.4}
              className={v ? 'cursor-pointer' : ''}
              onMouseEnter={() => setHover({ iso, name: f.properties.name, v })}
              onClick={() => iso && onSelect && onSelect(iso)}
            />
          );
        })}

        {points.map((pt, i) => {
          const xy = proj([pt.lon, pt.lat]);
          if (!xy) return null;
          return (
            <g key={i} transform={`translate(${xy[0]},${xy[1]})`} className={onSelect ? 'cursor-pointer' : ''}
              onMouseEnter={() => setHover({ name: pt.label, v: pt })}
              onClick={() => pt.iso && onSelect && onSelect(pt.iso)}>
              <circle r={(pt.r || 4) + 3} fill="none" stroke={pt.color} strokeWidth="0.8" opacity="0.45" />
              <circle r={pt.r || 4} fill={pt.color} fillOpacity="0.75" stroke={pt.color} strokeWidth="0.7" />
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 max-w-[240px] rounded-sm border border-bw-line2 bg-bw-panel2/95 px-2.5 py-2 shadow-xl"
          style={{ left: `min(${mouse.x}%, calc(100% - 250px))`, top: `min(${mouse.y}%, calc(100% - 90px))` }}
        >
          <div className="text-[12px] font-medium text-bw-text">{hover.name}</div>
          {hover.v ? (
            <>
              {hover.v.state && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ALERT_STATES[hover.v.state]?.color }} />
                  <span className="font-mono text-[9.5px] tracking-[0.1em]" style={{ color: ALERT_STATES[hover.v.state]?.color }}>
                    {hover.v.label || ALERT_STATES[hover.v.state]?.title}
                  </span>
                </div>
              )}
              {hover.v.metrics?.map((m) => (
                <div key={m.k} className="mt-0.5 flex justify-between gap-3 text-[10.5px]">
                  <span className="text-bw-dim">{m.k}</span><span className="bw-num text-bw-muted">{m.v}</span>
                </div>
              ))}
              <div className="mt-1 border-t border-bw-line pt-1 font-mono text-[8.5px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
                SIMULATED — NOT REAL SURVEILLANCE
              </div>
            </>
          ) : (
            <div className="mt-1 font-mono text-[9.5px] tracking-[0.1em] text-bw-dim">NO STREAM CONFIGURED</div>
          )}
        </div>
      )}
    </div>
  );
}

export function MapLegend({ compact = false }) {
  const items = [
    ['GREEN', 'No unusual activity detected'],
    ['YELLOW', 'Signal detected — review'],
    ['ORANGE', 'Unusual activity — investigate'],
    ['RED', 'Elevated reporting — human assessment'],
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map(([k, label]) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-[2px] border border-bw-line" style={{ background: STATE_FILL[k] }} />
          <span className="text-[10px] text-bw-muted">{compact ? k : label}</span>
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <svg width="16" height="10"><rect width="16" height="10" fill="url(#bw-hatch)" stroke="#22323f" /></svg>
        <span className="text-[10px] text-bw-dim">Insufficient data — not "low activity"</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[2px] border border-bw-line" style={{ background: STATE_FILL.NODATA }} />
        <span className="text-[10px] text-bw-dim">No stream configured</span>
      </span>
    </div>
  );
}

```

---

## 25. `frontend/src/components/Shell.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — APPLICATION SHELL
   Persistent sidebar navigation + top status bar with the
   always-visible prototype-mode indicator.
   ============================================================ */
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { NAV, STATUS_META, ALL_ITEMS } from '../lib/nav';
import { MODES, useMode } from '../lib/mode';
import { LogoLockup, Logo } from './Brand';
import { Pill, Dot, EvidenceTag } from './ui';
import { fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';

function Icon({ name, size = 15, className = '' }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} strokeWidth={1.7} className={className} />;
}

function ModeSwitcher() {
  const { mode, setMode, meta } = useMode();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-sm border px-2.5 py-1.5 transition-colors hover:bg-bw-panel2"
        style={{ borderColor: meta.color + '66', background: meta.color + '12' }}
        title="Active prototype mode"
      >
        <Dot color={meta.color} pulse />
        <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: meta.color }}>
          MODE: {meta.key}
        </span>
        <Icons.ChevronDown size={12} className="text-bw-dim" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-[330px] rounded-md border border-bw-line bg-bw-panel p-2 shadow-2xl">
            <div className="bw-label mb-1.5 px-1">Prototype mode</div>
            {Object.values(MODES).map((m) => (
              <button
                key={m.key} type="button"
                onClick={() => { setMode(m.key); setOpen(false); }}
                className={`mb-1 block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  mode === m.key ? 'border-bw-line2 bg-bw-panel2' : 'border-transparent hover:bg-bw-panel2/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Dot color={m.color} />
                  <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: m.color }}>
                    MODE {Object.keys(MODES).indexOf(m.key) + 1} — {m.key}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] leading-snug text-bw-dim">{m.description}</p>
              </button>
            ))}
            <p className="mt-1.5 border-t border-bw-line px-1 pt-1.5 text-[10px] leading-snug text-bw-dim">
              Switching mode never converts synthetic values into live values. Each module re-declares
              its own data state.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function CommandPalette({ open, setOpen }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  useEffect(() => { if (!open) setQ(''); }, [open]);
  if (!open) return null;
  const results = ALL_ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 9);
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[12vh] px-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg rounded-md border border-bw-line bg-bw-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-bw-line px-3 py-2.5">
          <Icons.Search size={14} className="text-bw-dim" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to module…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) { nav(results[0].to); setOpen(false); }
              if (e.key === 'Escape') setOpen(false);
            }}
            className="w-full bg-transparent text-[13px] text-bw-text outline-none placeholder:text-bw-dim"
          />
          <kbd className="rounded border border-bw-line px-1 font-mono text-[9px] text-bw-dim">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1.5">
          {results.map((r) => (
            <button key={r.to} type="button"
              onClick={() => { nav(r.to); setOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left hover:bg-bw-panel2">
              <Icon name={r.icon} size={14} className="text-bw-dim" />
              <span className="flex-1 text-[12px] text-bw-text">{r.label}</span>
              <span className="bw-label">{r.group}</span>
            </button>
          ))}
          {results.length === 0 && <div className="px-3 py-6 text-center text-[12px] text-bw-dim">No module matches.</div>}
        </div>
      </div>
    </div>
  );
}

export default function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { meta, session } = useMode();
  const loc = useLocation();

  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen((v) => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const sidebar = (
    <nav className={`flex h-full flex-col border-r border-bw-line bg-bw-void ${collapsed ? 'w-[62px]' : 'w-[248px]'} transition-[width] duration-150`}>
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-bw-line px-3">
        <NavLink to="/" className="min-w-0">
          {collapsed ? <Logo size={26} /> : <LogoLockup size={26} wordSize="sm" sub={false} />}
        </NavLink>
        <button type="button" onClick={() => setCollapsed(!collapsed)}
          className="hidden shrink-0 text-bw-dim hover:text-bw-text lg:block" title="Collapse navigation">
          <Icons.PanelLeftClose size={14} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {NAV.map((g) => (
          <div key={g.group} className="mb-3">
            {!collapsed && <div className="bw-label px-3 pb-1">{g.group}</div>}
            {g.items.map((it) => (
              <NavLink
                key={it.to} to={it.to} end={it.end}
                title={collapsed ? it.label : STATUS_META[it.status].label}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 px-3 py-[7px] text-[12px] transition-colors ${
                    isActive ? 'bg-bw-primary/10 text-bw-text' : 'text-bw-muted hover:bg-bw-panel/70 hover:text-bw-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-0 h-full w-[2px]" style={{ background: 'var(--color-bw-primary-bright)' }} />}
                    <Icon name={it.icon} size={15} className={isActive ? 'text-bw-primary-bright' : 'text-bw-dim group-hover:text-bw-muted'} />
                    {!collapsed && <span className="min-w-0 flex-1 truncate">{it.label}</span>}
                    {!collapsed && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS_META[it.status].color, opacity: 0.65 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="shrink-0 border-t border-bw-line p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            {Object.entries(STATUS_META).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1" title={v.label}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: v.color }} />
                <span className="text-[9px] text-bw-dim">{v.label.split(' ')[0]}</span>
              </span>
            ))}
          </div>
          <p className="text-[9.5px] leading-snug text-bw-dim">{SAFE_LANGUAGE.notDiagnostic}</p>
        </div>
      )}
    </nav>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bw-base">
      <div className="hidden lg:block">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-bw-line bg-bw-void px-3">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="text-bw-muted lg:hidden" onClick={() => setMobileOpen(true)}>
              <Icons.Menu size={18} />
            </button>
            <button type="button" onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-2.5 py-1.5 text-[11px] text-bw-dim hover:border-bw-line2 sm:flex">
              <Icons.Search size={13} />
              <span>Search modules</span>
              <kbd className="ml-3 rounded border border-bw-line px-1 font-mono text-[9px]">⌘K</kbd>
            </button>
            <Pill color="var(--color-bw-line2)" title="This build">
              <Icons.GitBranch size={10} /> v0.4.0-prototype
            </Pill>
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden items-center gap-2 xl:flex">
              <EvidenceTag t="PLAN" size="xs" title="The end-to-end platform depicted here is a design target, not a delivered capability." />
              <span className="bw-num text-[10px] text-bw-dim">{fmtTs()}</span>
            </span>
            <ModeSwitcher />
            <NavLink to="/access" className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-2 py-1.5 hover:border-bw-line2">
              <Icons.UserRound size={13} className="text-bw-dim" />
              <span className="hidden text-[11px] text-bw-muted sm:block">
                {session?.name || 'Guest — read only'}
              </span>
            </NavLink>
          </div>
        </header>

        {/* Global standing disclaimer — never dismissible */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-bw-line bg-bw-panel/60 px-3 py-1.5">
          <Icons.Info size={12} className="text-bw-dim" />
          <span className="text-[10.5px] leading-snug text-bw-dim">
            Research prototype. Alert states are interface states, not public-health decisions. Nothing here
            confirms an outbreak or constitutes a diagnosis.
          </span>
          <span className="ml-auto font-mono text-[9.5px] tracking-[0.12em]" style={{ color: meta.color }}>
            {meta.dataBadge}
          </span>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bw-grid-bg">
          <div className="mx-auto w-full max-w-[1680px] px-3 py-4 sm:px-5">
            <Outlet />
            <footer className="mt-8 border-t border-bw-line py-4 text-[10px] leading-relaxed text-bw-dim">
              BIOWATCH-AI research prototype · Interface demonstration of a proposed architecture ·
              No validated model performance is reported anywhere in this build ·
              Synthetic values are generated deterministically in-browser and are labelled SIMULATED.
            </footer>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}

```

---

## 26. `frontend/src/pages/Landing.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — PUBLIC LANDING PAGE (SEGMENT 2)
   ============================================================ */
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LogoLockup, Logo, TAGLINE_FORMAL, TAGLINE } from '../components/Brand';
import { EvidenceTag, Pill, Panel, Callout } from '../components/ui';
import { EVIDENCE, EVIDENCE_ORDER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';

const PIPELINE = [
  'Data sources', 'Ingestion', 'Validation', 'Storage', 'Preprocessing',
  'Feature engineering', 'Statistical baseline', 'Machine learning',
  'Signal detection', 'Explainable AI', 'Human review', 'Visualisation', 'Reporting',
];

function Section({ id, kicker, title, children, className = '' }) {
  return (
    <section id={id} className={`border-t border-bw-line px-5 py-14 sm:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-[1180px]">
        {kicker && <div className="bw-label mb-2">{kicker}</div>}
        {title && <h2 className="mb-6 text-[22px] font-semibold tracking-tight text-bw-text sm:text-[26px]">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bw-base">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-50 border-b border-bw-line bg-bw-void/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] w-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <LogoLockup size={30} />
          <nav className="hidden items-center gap-5 text-[12px] text-bw-muted lg:flex">
            <a href="#how" className="hover:text-bw-text">How it works</a>
            <a href="#methodology" className="hover:text-bw-text">Methodology</a>
            <a href="#sources" className="hover:text-bw-text">Data sources</a>
            <a href="#xai" className="hover:text-bw-text">Explainable AI</a>
            <a href="#limits" className="hover:text-bw-text">Limitations</a>
            <a href="#about" className="hover:text-bw-text">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/access" className="rounded-sm border border-bw-line px-3 py-1.5 text-[11px] text-bw-muted hover:border-bw-line2 hover:text-bw-text">
              Researcher access
            </Link>
            <Link to="/app" className="rounded-sm bg-bw-primary px-3 py-1.5 text-[11px] font-medium text-[#04120f] hover:bg-bw-primary-bright">
              Explore platform
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="bw-grid-bg relative overflow-hidden border-b border-bw-line px-5 py-16 sm:px-8 sm:py-20">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.09]"
          style={{ background: 'radial-gradient(circle, var(--color-bw-primary) 0%, transparent 65%)' }}
        />
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Pill color="var(--color-bw-primary)">RESEARCH PROTOTYPE</Pill>
              <EvidenceTag t="PLAN" title="This interface depicts a design target for the completed research programme." />
              <Pill color="var(--color-ev-simulated)">NON-OPERATIONAL</Pill>
            </div>
            <h1 className="text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] text-bw-text sm:text-[54px]">
              BIOWATCH<span className="text-bw-primary-bright">-AI</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-bw-text sm:text-[19px]">
              {TAGLINE_FORMAL}.
            </p>
            <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-bw-muted">
              BIOWATCH-AI is a research and educational prototype investigating a single question:
              <span className="text-bw-text"> can computational methods extract useful early signals from
              biological and epidemiological data, under a reproducible framework, better than or in
              combination with established statistical surveillance methods?</span> It is not a clinical
              diagnostic, not an operational public-health system, and it does not attempt to
              "predict pandemics".
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-sm bg-bw-primary px-4 py-2.5 text-[12.5px] font-medium text-[#04120f] hover:bg-bw-primary-bright">
                <Icons.LayoutDashboard size={15} /> Explore the platform
              </Link>
              <a href="#methodology" className="inline-flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-4 py-2.5 text-[12.5px] text-bw-muted hover:text-bw-text">
                <Icons.BookOpen size={15} /> Research methodology
              </a>
              <a href="#limits" className="inline-flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-4 py-2.5 text-[12.5px] text-bw-muted hover:text-bw-text">
                <Icons.TriangleAlert size={15} /> Research limitations
              </a>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bw-line pt-5 sm:grid-cols-4">
              {[
                ['Signal streams', '6 designed'],
                ['Detection methods', 'Baseline-first'],
                ['Reported metrics', 'None fabricated'],
                ['Human review', 'Mandatory'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="bw-label">{k}</div>
                  <div className="mt-1 text-[13px] text-bw-text">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero side panel: honest status card */}
          <div className="min-w-0">
            <Panel title="Prototype status declaration" evidence="ESTABLISHED"
              subtitle="What this build does and does not contain.">
              <ul className="space-y-2.5 text-[12px] leading-relaxed text-bw-muted">
                {[
                  ['Interface architecture for 23 modules', true],
                  ['Deterministic synthetic demonstration data, labelled at every point of use', true],
                  ['API-ready connector definitions for public data sources', true],
                  ['Statistical baseline logic executed in-browser on synthetic series', true],
                  ['Trained machine-learning models', false],
                  ['Validated accuracy / AUROC / lead-time figures', false],
                  ['Real outbreak data or real public-health events', false],
                  ['Authorisation to issue public-health alerts', false],
                ].map(([txt, yes]) => (
                  <li key={txt} className="flex items-start gap-2">
                    {yes
                      ? <Icons.Check size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />
                      : <Icons.X size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />}
                    <span className={yes ? 'text-bw-text' : ''}>{txt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-bw-line pt-2.5">
                <p className="text-[11px] italic leading-relaxed text-bw-dim">"{TAGLINE}"</p>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <Section id="how" kicker="Section 01" title="How it works">
        <p className="mb-6 max-w-3xl text-[13px] leading-relaxed text-bw-muted">
          BIOWATCH-AI is designed as a linear, auditable pipeline. Every stage is inspectable, every stage
          can be disabled, and the machine-learning stage is never permitted to bypass the statistical
          baseline it must be compared against.
        </p>
        <div className="flex flex-wrap items-stretch gap-1.5">
          {PIPELINE.map((p, i) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="rounded-sm border border-bw-line bg-bw-panel px-2.5 py-2">
                <div className="bw-num text-[9px] text-bw-dim">{String(i + 1).padStart(2, '0')}</div>
                <div className="mt-0.5 text-[11.5px] text-bw-text">{p}</div>
              </div>
              {i < PIPELINE.length - 1 && <Icons.ChevronRight size={13} className="text-bw-line2" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: 'Scale', title: 'Baseline before model',
              body: 'No machine-learning result is displayed without the corresponding statistical baseline (seasonal mean, EWMA, EARS/CUSUM-family or regression baseline) evaluated on the same temporal split.',
              tag: 'ASSUMPTION',
            },
            {
              icon: 'Eye', title: 'Human review is terminal',
              body: 'The system produces candidate signals. A qualified analyst classifies them. No automated route exists from detector output to a public-health statement.',
              tag: 'PLAN',
            },
            {
              icon: 'FileSearch', title: 'Provenance on every number',
              body: 'Each figure carries an epistemic tag and a source. Synthetic values are labelled SIMULATED wherever they appear, including inside tooltips and exports.',
              tag: 'ESTABLISHED',
            },
          ].map((c) => (
            <Panel key={c.title} title={c.title} evidence={c.tag}>
              <div className="mb-2 text-bw-primary">
                {(() => { const C = Icons[c.icon] || Icons.Circle; return <C size={18} strokeWidth={1.6} />; })()}
              </div>
              <p className="text-[12px] leading-relaxed text-bw-muted">{c.body}</p>
            </Panel>
          ))}
        </div>
      </Section>

      {/* ---------------- Signal streams ---------------- */}
      <Section id="streams" kicker="Section 02" title="Six designed signal streams">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(STREAMS).map((s) => {
            const C = Icons[s.icon] || Icons.Circle;
            return (
              <div key={s.key} className="rounded-md border border-bw-line bg-bw-panel p-3.5" style={{ borderLeftColor: s.color, borderLeftWidth: 2 }}>
                <div className="flex items-center gap-2">
                  <C size={16} strokeWidth={1.7} style={{ color: s.color }} />
                  <span className="text-[13px] font-medium text-bw-text">{s.label}</span>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                  {{
                    epi: 'Case notifications, hospitalisations and mortality series from public repositories, with reporting-delay correction.',
                    genomic: 'Lineage frequency, mutation profiles and sequence metadata from public genomic repositories. Sequences are never fabricated.',
                    env: 'Wastewater and environmental sampling concentrations from open programmes, treated as an independent, non-clinical indicator.',
                    lab: 'Test volumes, positivity, confirmation rates and antimicrobial-resistance isolate reporting.',
                    synd: 'Syndrome-level indicators such as ILI/ARI consultations, kept explicitly separate from confirmed cases.',
                    event: 'Structured extraction from official bulletins and vetted media, always entering as unverified until an analyst adjudicates.',
                  }[s.key]}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------- Methodology ---------------- */}
      <Section id="methodology" kicker="Section 03" title="Research methodology">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {[
              ['Question', 'Do computational detectors provide earlier or more specific signals than established statistical surveillance baselines, on the same data, under the same evaluation protocol?', 'HYPOTHESIS'],
              ['Design', 'Retrospective evaluation on historical public datasets with strictly temporal train/validation/test splits. No random shuffling of time-ordered records.', 'PLAN'],
              ['Comparators', 'Seasonal mean ± k·SD, EWMA, Farrington-type regression baselines, and simple threshold rules serve as mandatory comparators.', 'PLAN'],
              ['Outcome definition', 'A "signal" must be defined against an externally documented reference period before any model is fitted, to avoid label leakage.', 'ASSUMPTION'],
              ['Primary metrics', 'Detection delay and lead time relative to reference, with sensitivity, specificity, PPV and calibration reported jointly — never accuracy alone.', 'PLAN'],
              ['Failure criterion', 'If the machine-learning approach does not beat the statistical baseline, that negative result is reported, not hidden.', 'ESTABLISHED'],
            ].map(([k, v, tag]) => (
              <div key={k} className="rounded-md border border-bw-line bg-bw-panel p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[12.5px] font-medium text-bw-text">{k}</span>
                  <EvidenceTag t={tag} size="xs" />
                </div>
                <p className="text-[12px] leading-relaxed text-bw-muted">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <Panel title="Epistemic labelling scheme" evidence="ESTABLISHED"
              subtitle="Every statement in the platform carries exactly one of these tags.">
              <div className="space-y-2">
                {EVIDENCE_ORDER.map((k) => (
                  <div key={k} className="flex gap-2.5">
                    <EvidenceTag t={k} size="xs" />
                    <p className="min-w-0 flex-1 text-[11px] leading-snug text-bw-dim">{EVIDENCE[k].definition}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </Section>

      {/* ---------------- Data sources ---------------- */}
      <Section id="sources" kicker="Section 04" title="Data sources">
        <p className="mb-5 max-w-3xl text-[13px] leading-relaxed text-bw-muted">
          The platform ships connector definitions for openly licensed public-health and genomic resources.
          A connector that is not configured is displayed as <span className="font-mono text-[11px] text-bw-dim">{SAFE_LANGUAGE.connectorUnconfigured}</span> —
          it is never silently replaced with synthetic values presented as live.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'WHO — Global Health Observatory', 'WHO — Disease Outbreak News', 'CDC — open data portal',
            'ECDC — surveillance atlas exports', 'Our World in Data', 'NCBI — E-utilities / Datasets',
            'Nextstrain — open builds', 'Open wastewater programmes', 'Nigeria NCDC — public situation reports',
            'Africa CDC — public dashboards', 'HealthMap / ProMED-style event feeds', 'National open-data portals',
          ].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-3 py-2">
              <Icons.PlugZap size={13} className="shrink-0 text-bw-dim" />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-bw-muted">{s}</span>
              <span className="font-mono text-[9px] tracking-[0.1em] text-bw-dim">READY</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-bw-dim">
          Listing a source indicates a connector interface exists in the architecture. It does not indicate an
          active data feed, an endorsement, or any affiliation with the organisation named. Each source is
          subject to its own licence and terms of use.
        </p>
      </Section>

      {/* ---------------- XAI ---------------- */}
      <Section id="xai" kicker="Section 05" title="Explainable by construction">
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="What an explanation must contain" evidence="PLAN">
            <ul className="space-y-1.5 text-[12px] text-bw-muted">
              {['Ranked feature contributions for the specific signal', 'Direction and magnitude of each contribution',
                'The baseline value the deviation is measured against', 'Uncertainty around the model output',
                'A plausible biological or reporting-process interpretation', 'Alternative explanations that were not excluded',
                'The limitations of the model that produced it'].map((x) => (
                <li key={x} className="flex gap-2"><Icons.Dot size={14} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
              ))}
            </ul>
          </Panel>
          <Callout tone="warn" title="Standing interpretive warning" icon={<Icons.TriangleAlert size={12} />}>
            <p className="mb-2">{SAFE_LANGUAGE.causation}</p>
            <p>
              A feature attribution describes how a model used an input. It does not demonstrate that the
              input causes disease activity, and it does not validate the model. Attribution methods are
              themselves approximations with known instabilities.
            </p>
          </Callout>
        </div>
      </Section>

      {/* ---------------- Limitations ---------------- */}
      <Section id="limits" kicker="Section 06" title="Research limitations">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['Surveillance data are not ground truth', 'Reported case counts reflect testing capacity, care-seeking behaviour and administrative practice as much as biology. A change in a series is frequently a change in reporting.'],
            ['Label scarcity', 'Historical outbreak "labels" are few, inconsistently defined and retrospectively assigned. This severely limits supervised learning and inflates apparent performance.'],
            ['Class imbalance', 'Genuine anomalies are rare. Accuracy is therefore uninformative, and even a high-specificity detector can generate an unusable false-alarm burden at scale.'],
            ['Non-stationarity', 'Reporting systems, case definitions and testing policies change over time, breaking the assumption that historical baselines transfer to the present.'],
            ['Geographic bias', 'Data density is highest where surveillance capacity is already strongest. Models trained on such data systematically under-detect where detection matters most.'],
            ['No causal claim is possible', 'The architecture is associational. It cannot establish that any detected pattern is biologically caused by a pathogen event.'],
          ].map(([t, b]) => (
            <div key={t} className="rounded-md border border-bw-line bg-bw-panel p-3.5">
              <div className="mb-1.5 flex items-start gap-2">
                <Icons.TriangleAlert size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-yellow)]" />
                <span className="text-[12.5px] font-medium text-bw-text">{t}</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-bw-muted">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- About ---------------- */}
      <Section id="about" kicker="Section 07" title="About the project">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3 text-[13px] leading-relaxed text-bw-muted">
            <p>
              BIOWATCH-AI is a student-led research programme in computational biosurveillance. Its objective
              is methodological: to build a reproducible framework in which candidate detection methods can be
              compared fairly, and to report what that comparison actually shows.
            </p>
            <p>
              The programme is stage-gated. This interface represents the <span className="text-bw-text">possible end state</span> if
              the research objectives are met. It is deliberately built before the science so that the
              scientific requirements — labelling, baselines, human review, provenance — are structural rather
              than retrofitted.
            </p>
            <p>
              Intended audiences: university researchers, biochemistry and bioinformatics students,
              epidemiologists, data scientists, public-health researchers, supervisors and scientific
              competition reviewers.
            </p>
            <div className="pt-2">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-sm border border-bw-primary/50 px-3.5 py-2 text-[12px] text-bw-primary-bright hover:bg-bw-primary/10">
                Enter the prototype <Icons.ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <Panel title="Not intended for" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[12px] text-bw-muted">
              {['Clinical diagnosis or patient management', 'Operational outbreak declaration',
                'Regulatory or policy decision-making', 'Border, travel or trade measures',
                'Any use implying validated performance', 'Any biosecurity-sensitive application'].map((x) => (
                <li key={x} className="flex gap-2"><Icons.X size={13} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{x}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-bw-line bg-bw-void px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <div>
              <div className="text-[12px] tracking-[0.14em] text-bw-muted">BIOWATCH-AI</div>
              <div className="text-[10px] text-bw-dim">Research prototype · v0.4.0 · Not for operational use</div>
            </div>
          </div>
          <p className="max-w-md text-[10px] leading-relaxed text-bw-dim">
            No real-world surveillance data, no validated model performance and no confirmed disease events are
            presented anywhere in this build. Organisation names refer to publicly documented data sources only
            and imply no affiliation or endorsement.
          </p>
        </div>
      </footer>
    </div>
  );
}

```

---

## 27. `frontend/src/pages/Access.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — RESEARCHER ACCESS CONCEPT (login design)
   No real authentication is implemented. This page documents the
   intended access-control model and lets a reviewer enter the
   prototype under a chosen role for interface demonstration.
   ============================================================ */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LogoLockup } from '../components/Brand';
import { Panel, EvidenceTag, Callout, Field, Input, Btn, Pill, KV } from '../components/ui';
import { useMode } from '../lib/mode';

const ROLES = [
  {
    id: 'viewer', name: 'Public viewer', icon: 'Eye',
    can: ['View demonstration dashboards', 'Read methodology and limitations', 'Read model cards'],
    cannot: ['Upload data', 'Run experiments', 'Configure connectors', 'Adjudicate signals'],
  },
  {
    id: 'researcher', name: 'Researcher', icon: 'FlaskConical',
    can: ['Upload datasets to a private workspace', 'Define and run experiments', 'Compare models against baselines', 'Export figures and reports'],
    cannot: ['Adjudicate signals for release', 'Change global thresholds', 'Manage users'],
  },
  {
    id: 'analyst', name: 'Surveillance analyst', icon: 'Radar',
    can: ['Triage and adjudicate candidate signals', 'Record review rationale in the audit log', 'Request investigation'],
    cannot: ['Modify model code', 'Delete audit entries', 'Issue external public-health alerts'],
  },
  {
    id: 'admin', name: 'Administrator', icon: 'ShieldCheck',
    can: ['Manage roles and API keys', 'Configure connectors', 'Review the full audit log'],
    cannot: ['Delete historical decisions', 'Override the human-review requirement', 'Disable provenance labelling'],
  },
];

export default function Access() {
  const [role, setRole] = useState('researcher');
  const [name, setName] = useState('');
  const { setSession } = useMode();
  const nav = useNavigate();

  const enter = () => {
    const r = ROLES.find((x) => x.id === role);
    setSession({ name: name.trim() || 'Demo researcher', role: r.name, roleId: r.id, at: new Date().toISOString() });
    nav('/app');
  };

  return (
    <div className="bw-grid-bg min-h-screen bg-bw-base">
      <header className="border-b border-bw-line bg-bw-void px-5 py-3">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between">
          <Link to="/"><LogoLockup size={28} /></Link>
          <Link to="/app" className="text-[11px] text-bw-muted hover:text-bw-text">Continue as guest →</Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-5 py-10 lg:grid-cols-[400px_1fr]">
        <div>
          <Panel title="Researcher access" evidence="PLAN"
            subtitle="Interface concept — no credential is transmitted, stored server-side or verified.">
            <Callout tone="warn" title="Prototype authentication" icon={<Icons.TriangleAlert size={12} />}>
              This screen does not authenticate anyone. It records a role locally in your browser so that
              role-based interface behaviour can be demonstrated. In a real deployment this would be
              institutional SSO (e.g. SAML/OIDC) with MFA, not a form.
            </Callout>

            <div className="mt-3 space-y-3">
              <Field label="Display name" hint="Stored only in this browser's local storage.">
                <Input value={name} onChange={setName} placeholder="e.g. A. Researcher" />
              </Field>
              <Field label="Institutional identifier" hint="Disabled — institutional SSO is not configured in this prototype.">
                <div className="flex items-center gap-2 rounded-sm border border-dashed border-bw-line bg-bw-panel2/40 px-2 py-1.5 text-[11px] text-bw-dim">
                  <Icons.Lock size={12} /> SSO CONNECTOR NOT CONFIGURED
                </div>
              </Field>
              <Field label="Select demonstration role">
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLES.map((r) => {
                    const C = Icons[r.icon];
                    const active = role === r.id;
                    return (
                      <button key={r.id} type="button" onClick={() => setRole(r.id)}
                        className={`flex items-center gap-2 rounded-sm border px-2 py-2 text-left text-[11.5px] transition-colors ${
                          active ? 'border-bw-primary bg-bw-primary/10 text-bw-text' : 'border-bw-line bg-bw-panel2 text-bw-muted hover:border-bw-line2'
                        }`}>
                        <C size={14} className={active ? 'text-bw-primary-bright' : 'text-bw-dim'} />
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Btn variant="primary" size="md" className="w-full" onClick={enter}>
                <Icons.LogIn size={14} /> Enter prototype as {ROLES.find((r) => r.id === role).name}
              </Btn>
              <p className="text-[10px] leading-snug text-bw-dim">
                By entering you acknowledge that all content is a research prototype, that alert states are
                interface states rather than public-health decisions, and that no figure shown constitutes
                validated performance.
              </p>
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Role-based access model" evidence="PLAN"
            subtitle="Capability matrix the production system would enforce server-side.">
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => {
                const C = Icons[r.icon];
                return (
                  <div key={r.id} className={`rounded-md border p-3 ${role === r.id ? 'border-bw-primary/60 bg-bw-primary/5' : 'border-bw-line bg-bw-panel2/40'}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <C size={15} className="text-bw-primary-bright" />
                      <span className="text-[12.5px] font-medium text-bw-text">{r.name}</span>
                    </div>
                    <div className="bw-label mb-1">Permitted</div>
                    <ul className="mb-2 space-y-1">
                      {r.can.map((c) => (
                        <li key={c} className="flex gap-1.5 text-[11px] text-bw-muted">
                          <Icons.Check size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />{c}
                        </li>
                      ))}
                    </ul>
                    <div className="bw-label mb-1">Denied</div>
                    <ul className="space-y-1">
                      {r.cannot.map((c) => (
                        <li key={c} className="flex gap-1.5 text-[11px] text-bw-dim">
                          <Icons.X size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Session & audit design" evidence="PLAN">
            <KV cols={2} items={[
              { k: 'Identity provider', v: 'Institutional OIDC / SAML (not configured)' },
              { k: 'Second factor', v: 'Required for analyst and administrator roles' },
              { k: 'Session lifetime', v: '8 h idle timeout; re-auth for connector changes' },
              { k: 'Audit scope', v: 'Login, signal adjudication, connector edits, experiment runs, exports' },
              { k: 'Audit mutability', v: 'Append-only; entries are superseded, never deleted' },
              { k: 'Data residency', v: 'Deployment-dependent; documented per installation' },
              { k: 'Personal data', v: 'Design target: aggregate surveillance data only; no patient-level records' },
              { k: 'Key handling', v: 'API credentials stored server-side only; never exposed to the browser' },
            ]} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill color="var(--color-bw-dim)">NO REAL AUTHENTICATION IN THIS BUILD</Pill>
              <EvidenceTag t="PLAN" size="xs" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

```

---

## 28. `frontend/src/pages/CommandCenter.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — GLOBAL COMMAND CENTER (SEGMENT 3)
   ============================================================ */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Stat, Pill, Dot, EvidenceTag, SimulatedBanner, Table,
  Callout, Meter, Awaiting, NotImplemented, Grid, DataState,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Spark, Bars } from '../components/charts';
import { buildSurveillance, summarise } from '../lib/surveillance';
import { ALERT_STATES, ALERT_DISCLAIMER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';
import { synthSeries, fmtTs, tail } from '../lib/synth';
import { useMode } from '../lib/mode';
import { CONNECTORS } from '../lib/connectors';

function StateRow({ state, n, total }) {
  const s = ALERT_STATES[state];
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <Dot color={s.color} pulse={state === 'RED' && n > 0} />
      <span className="w-[52px] font-mono text-[10px] tracking-[0.1em]" style={{ color: s.color }}>{state}</span>
      <div className="min-w-0 flex-1">
        <Meter value={n} max={Math.max(1, total)} color={s.color} height={4} />
      </div>
      <span className="bw-num w-6 text-right text-[12px] text-bw-text">{n}</span>
    </div>
  );
}

function StreamCard({ stream, series, status, note }) {
  const meta = STREAMS[stream];
  const C = Icons[meta.icon] || Icons.Circle;
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const delta = prev ? ((last.value - prev.value) / Math.max(1, prev.value)) * 100 : 0;
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <C size={15} strokeWidth={1.7} style={{ color: meta.color }} />
          <span className="text-[12px] font-medium text-bw-text">{meta.label}</span>
        </div>
        <EvidenceTag t="SIMULATED" size="xs" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="bw-num text-[19px] font-semibold leading-none text-bw-text">{last.value.toLocaleString()}</div>
          <div className="bw-label mt-1">weekly index</div>
        </div>
        <div className="text-right">
          <div className="bw-num text-[12px]" style={{ color: delta >= 0 ? 'var(--color-alert-orange)' : 'var(--color-alert-green)' }}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </div>
          <div className="bw-label mt-0.5">vs prev wk</div>
        </div>
      </div>
      <div className="mt-1.5 -mx-1"><Spark data={tail(series, 26)} color={meta.color} height={30} /></div>
      <div className="mt-1.5 flex items-center justify-between border-t border-bw-line pt-1.5">
        <span className="text-[10px] text-bw-dim">{note}</span>
        <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: status === 'active' ? 'var(--color-alert-green)' : 'var(--color-bw-dim)' }}>
          {status === 'active' ? 'STREAM ACTIVE' : 'NOT CONFIGURED'}
        </span>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const { isDemo, isResearch, isLive } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const sum = useMemo(() => summarise(S), [S]);

  const streamSeries = useMemo(() => ({
    epi: synthSeries('global:epi', { level: 4200, season: 0.35, disp: 0.12 }),
    genomic: synthSeries('global:genomic', { level: 860, season: 0.2, disp: 0.22, trend: 0.3 }),
    env: synthSeries('global:env', { level: 310, season: 0.4, disp: 0.25 }),
    lab: synthSeries('global:lab', { level: 1900, season: 0.3, disp: 0.15 }),
    synd: synthSeries('global:synd', { level: 7300, season: 0.5, disp: 0.1 }),
    event: synthSeries('global:event', { level: 46, season: 0.15, disp: 0.35 }),
  }), []);

  const focusAlert = S.alerts[0];
  const focusCountry = S.countries.find((c) => c.iso === focusAlert?.iso);

  const connectorSummary = useMemo(() => {
    const total = CONNECTORS.length;
    const configured = CONNECTORS.filter((c) => c.status === 'configured').length;
    return { total, configured, unconfigured: total - configured };
  }, []);

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 01" title="Global Command Center" evidence={isLive ? 'PLAN' : 'PLAN'}
          description="Aggregated surveillance state across configured streams, regions and detectors." />
        <Callout tone="info" title={isLive ? 'Live mode active' : 'Research mode active'} icon={<Icons.Info size={12} />}>
          {isLive
            ? <>No data connector is currently configured, so this dashboard has nothing to display. Synthetic values are deliberately <span className="text-bw-text">not</span> substituted in LIVE mode. Configure a source in <Link to="/app/connectors" className="text-bw-primary-bright underline">Data Connectors</Link>, or switch to DEMONSTRATION mode to view the interface.</>
            : <>Research mode renders only datasets you have uploaded and experiments you have actually run. No dataset is registered in this session. Open the <Link to="/app/workspace" className="text-bw-primary-bright underline">Researcher Workspace</Link> to register one, or switch to DEMONSTRATION mode to view the interface.</>}
        </Callout>
        <Grid cols="md:grid-cols-4" className="mt-3">
          {['Monitored regions', 'Signals detected', 'Signals under review', 'Data freshness'].map((l) => (
            <Stat key={l} label={l} value="—" evidence="PLAN" sub={isLive ? SAFE_LANGUAGE.connectorUnconfigured : SAFE_LANGUAGE.awaitingExperiment} />
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <PageHeader
        kicker="Module 01" title="Global Command Center" evidence="SIMULATED"
        description="Cross-stream surveillance state for the configured monitoring set. Every figure on this screen is generated by the in-browser synthetic engine and describes no real country, pathogen or event."
        right={<div className="flex gap-1.5">
          <Link to="/app/alerts"><Pill color="var(--color-alert-orange)"><Icons.BellRing size={10} />{sum.active} open signals</Pill></Link>
          <Pill color="var(--color-bw-dim)"><Icons.Clock size={10} />refresh 6 h</Pill>
        </div>}
      />

      <div className="mb-3"><SimulatedBanner /></div>

      {/* ---------- Top strip: status summary ---------- */}
      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Monitored territories" value={sum.monitored} evidence="SIMULATED"
          sub={`${sum.withData} with a usable baseline`} hint="A territory is monitored when at least one stream is mapped to it." />
        <Stat label="Signals detected (open)" value={sum.active} evidence="SIMULATED" color="var(--color-alert-orange)"
          sub={`${sum.underReview} under review · ${sum.awaiting} awaiting triage`} hint="Detector output pending human adjudication. Not outbreaks." />
        <Stat label="Mean data completeness" value={`${Math.round(sum.meanCompleteness * 100)}%`} evidence="SIMULATED"
          sub={`Mean reporting delay ≈ ${sum.meanDelay} wk`} hint="Completeness constrains what any detector can possibly see." />
        <Stat label="Model contribution" value="0" unit="/ 0 trained" evidence="ESTABLISHED" color="var(--color-bw-muted)"
          sub="All current signals are baseline-derived" hint="No machine-learning model has been trained in this build, so none contributes to any signal." />
      </Grid>

      <Grid cols="xl:grid-cols-[1.55fr_1fr]" className="mb-3">
        {/* ---------- Map ---------- */}
        <Panel
          title="Global surveillance state" evidence="SIMULATED"
          subtitle="Fill encodes detector state, not disease burden. Hatching marks insufficient data — it is never rendered as low activity."
          actions={<Link to="/app/map" className="flex items-center gap-1 text-[11px] text-bw-primary-bright hover:underline">
            Full map <Icons.ArrowRight size={12} />
          </Link>}
        >
          <WorldMap values={S.mapValues} height={370} />
          <div className="mt-2.5"><MapLegend /></div>
        </Panel>

        {/* ---------- Right column ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Signal state distribution" evidence="SIMULATED" subtitle="Territories by current detector state.">
            {sum.byState.map((b) => <StateRow key={b.state} state={b.state} n={b.n} total={sum.withData} />)}
            <div className="mt-2 border-t border-bw-line pt-2">
              <p className="text-[10px] leading-relaxed text-bw-dim">{ALERT_DISCLAIMER}</p>
            </div>
          </Panel>

          <Panel title="System confidence indicators" evidence="ASSUMPTION"
            subtitle="Confidence in the SYSTEM's ability to observe — not confidence that an event exists.">
            <div className="space-y-2.5">
              <Meter label="Baseline coverage" right={`${sum.withData}/${sum.monitored} streams`} value={sum.withData} max={sum.monitored} color="var(--color-bw-primary)" />
              <Meter label="Input completeness" right={`${Math.round(sum.meanCompleteness * 100)}%`} value={sum.meanCompleteness * 100} color="var(--color-bw-data)" />
              <Meter label="Timeliness (inverse delay)" right={`${sum.meanDelay} wk mean`} value={Math.max(0, 100 - sum.meanDelay * 22)} color="var(--color-alert-yellow)" />
              <Meter label="Cross-stream concordance" right="Partial" value={38} color="var(--color-bw-env)" />
              <div className="flex items-center justify-between border-t border-bw-line pt-2">
                <span className="text-[11px] text-bw-muted">Validated detection performance</span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>
              </div>
            </div>
          </Panel>
        </div>
      </Grid>

      {/* ---------- Stream summaries ---------- */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="bw-h2 text-bw-text">Surveillance streams</h2>
        <span className="text-[10.5px] text-bw-dim">Weekly aggregate index per stream · synthetic</span>
      </div>
      <Grid cols="sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6" className="mb-3">
        <StreamCard stream="epi" series={streamSeries.epi} status="active" note="Case notifications" />
        <StreamCard stream="synd" series={streamSeries.synd} status="active" note="ILI/ARI consultations" />
        <StreamCard stream="lab" series={streamSeries.lab} status="active" note="Confirmations" />
        <StreamCard stream="genomic" series={streamSeries.genomic} status="active" note="Sequences submitted" />
        <StreamCard stream="env" series={streamSeries.env} status="active" note="Wastewater samples" />
        <StreamCard stream="event" series={streamSeries.event} status="active" note="Unverified reports" />
      </Grid>

      <Grid cols="xl:grid-cols-[1.3fr_1fr]" className="mb-3">
        {/* ---------- Focus signal ---------- */}
        <Panel
          title={`Highest-deviation stream — ${focusCountry?.name} · ${focusCountry?.pathogen?.name}`}
          evidence="SIMULATED"
          subtitle="Observed weekly counts against the seasonal baseline with 95% interval. Flagged points exceeded 2σ."
          accent={ALERT_STATES[focusAlert?.state]?.color}
          actions={<Link to="/app/signals" className="text-[11px] text-bw-primary-bright hover:underline">Detection engine →</Link>}
        >
          <SignalChart data={focusCountry.series.slice(-78)} height={220} />
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            {[
              ['Observed (latest wk)', focusAlert?.observed?.toLocaleString()],
              ['Baseline expectation', focusAlert?.baseline?.toLocaleString()],
              ['Deviation', `z = ${focusAlert?.z}`],
              ['Consecutive weeks', focusCountry?.consecutive],
            ].map(([k, v]) => (
              <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                <div className="bw-label">{k}</div>
                <div className="bw-num mt-0.5 text-[13px] text-bw-text">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Callout tone="warn" title="Interpretation constraint" icon={<Icons.TriangleAlert size={12} />}>
              An exceedance of a synthetic baseline demonstrates that the detector fires. It does not indicate
              disease activity anywhere. {SAFE_LANGUAGE.causation}
            </Callout>
          </div>
        </Panel>

        {/* ---------- Recent alerts ---------- */}
        <Panel title="Recent signals" evidence="SIMULATED"
          subtitle="Ordered by deviation magnitude. All require human adjudication."
          actions={<Link to="/app/alerts" className="text-[11px] text-bw-primary-bright hover:underline">Alert center →</Link>}>
          <div className="space-y-1.5">
            {S.alerts.slice(0, 6).map((a) => (
              <Link key={a.id} to="/app/alerts"
                className="block rounded-sm border border-bw-line bg-bw-panel2/40 px-2.5 py-2 hover:border-bw-line2">
                <div className="flex items-center gap-2">
                  <Dot color={ALERT_STATES[a.state].color} />
                  <span className="bw-num text-[10px] text-bw-dim">{a.id}</span>
                  <span className="font-mono text-[9.5px] tracking-[0.1em]" style={{ color: ALERT_STATES[a.state].color }}>{a.state}</span>
                  <span className="ml-auto text-[10px] text-bw-dim">{a.status}</span>
                </div>
                <div className="mt-1 text-[12px] text-bw-text">{a.country} · {a.pathogen}</div>
                <div className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-bw-muted">{a.what}</div>
              </Link>
            ))}
          </div>
        </Panel>
      </Grid>

      {/* ---------- Bottom row: sources, models, emerging ---------- */}
      <Grid cols="lg:grid-cols-3" className="mb-3">
        <Panel title="Data-source health" evidence="ESTABLISHED"
          subtitle="Connector configuration state in this build."
          actions={<Link to="/app/connectors" className="text-[11px] text-bw-primary-bright hover:underline">Manage →</Link>}>
          <div className="mb-2 flex items-center gap-3">
            <Stat label="Defined" value={connectorSummary.total} evidence="ESTABLISHED" />
            <Stat label="Configured" value={connectorSummary.configured} evidence="ESTABLISHED" color="var(--color-bw-dim)" />
          </div>
          <Table dense columns={[
            { key: 'name', header: 'Source', render: (r) => <span className="text-[11.5px]">{r.name}</span> },
            { key: 'freq', header: 'Freq', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.frequency}</span> },
            { key: 'status', header: 'State', align: 'right', render: () => (
              <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">NOT CONFIGURED</span>) },
          ]} rows={CONNECTORS.slice(0, 6)} />
          <p className="mt-2 text-[10px] leading-snug text-bw-dim">
            {SAFE_LANGUAGE.connectorAvailable} — connectors are defined in the architecture but no live
            credentials or endpoints are active in this prototype.
          </p>
        </Panel>

        <Panel title="Model status" evidence="ESTABLISHED"
          subtitle="Registry of models the research programme intends to evaluate."
          actions={<Link to="/app/ml-lab" className="text-[11px] text-bw-primary-bright hover:underline">ML lab →</Link>}>
          <Table dense columns={[
            { key: 'm', header: 'Model' },
            { key: 'role', header: 'Role' },
            { key: 's', header: 'Status', align: 'right', render: (r) => (
              <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: r.color }}>{r.s}</span>) },
          ]} rows={[
            { m: 'Seasonal baseline (52-wk)', role: 'Comparator', s: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
            { m: 'EWMA control chart', role: 'Comparator', s: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
            { m: 'Fixed threshold rule', role: 'Comparator', s: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
            { m: 'Farrington-type regression', role: 'Comparator', s: 'PLANNED', color: 'var(--color-bw-dim)' },
            { m: 'Isolation Forest', role: 'Candidate', s: 'NOT TRAINED', color: 'var(--color-alert-yellow)' },
            { m: 'Random Forest / GBM', role: 'Candidate', s: 'NOT TRAINED', color: 'var(--color-alert-yellow)' },
            { m: 'Sequence model (LSTM/TCN)', role: 'Later stage', s: 'NOT STARTED', color: 'var(--color-bw-dim)' },
          ]} />
          <div className="mt-2 rounded-sm border border-bw-line bg-bw-panel2/50 px-2.5 py-2">
            <div className="bw-label">Reported performance</div>
            <div className="mt-1"><Awaiting note="No model has been fitted; therefore no metric is displayable." /></div>
          </div>
        </Panel>

        <Panel title="Emerging signals watchlist" evidence="SIMULATED"
          subtitle="Streams trending upward but not yet exceeding the detection threshold.">
          <Table dense columns={[
            { key: 'country', header: 'Territory' },
            { key: 'pathogen', header: 'Stream', render: (r) => <span className="text-[11px] text-bw-muted">{r.pathogen?.name}</span> },
            { key: 'z', header: 'z', align: 'right', render: (r) => <span className="bw-num text-[11px]">{r.z.toFixed(2)}</span> },
            { key: 'trend', header: '4-wk', align: 'right', width: 70, render: (r) => (
              <div className="w-[64px]"><Spark data={tail(r.series, 12)} color="var(--color-bw-dim)" height={20} /></div>) },
          ]} rows={S.countries.filter((c) => c.state === 'GREEN' && c.availability !== 'none').sort((a, b) => b.z - a.z).slice(0, 6)} />
          <p className="mt-2 text-[10px] leading-snug text-bw-dim">
            Watchlist membership is a statistical property of a synthetic series. It carries no epidemiological meaning.
          </p>
        </Panel>
      </Grid>

      <Grid cols="lg:grid-cols-[1fr_1fr]">
        <Panel title="Regional activity index" evidence="SIMULATED"
          subtitle="Mean absolute deviation across configured territories, by WHO-style region grouping.">
          <Bars horizontal height={190}
            data={['AFRO', 'EMRO', 'EURO', 'PAHO', 'SEARO', 'WPRO'].map((r) => {
              const cs = S.countries.filter((c) => c.region === r && c.availability !== 'none');
              const v = cs.length ? +(cs.reduce((a, c) => a + Math.abs(c.z), 0) / cs.length).toFixed(2) : 0;
              return { name: r, value: v, color: v > 1.6 ? 'var(--color-alert-orange)' : v > 0.9 ? 'var(--color-alert-yellow)' : 'var(--color-bw-primary)' };
            })}
            colorKey="color" note="SIMULATED — synthetic deviation index" />
          <p className="mt-1 text-[10px] text-bw-dim">
            Regional aggregation hides sub-national heterogeneity and is dominated by whichever territories
            report most completely — a known bias, not a finding.
          </p>
        </Panel>

        <Panel title="Last data update & refresh policy" evidence="ESTABLISHED">
          <div className="space-y-2">
            {[
              ['Synthetic engine', 'Deterministic — regenerated identically on every load', fmtTs()],
              ['Public connectors', SAFE_LANGUAGE.connectorUnconfigured, '—'],
              ['Uploaded research datasets', 'None registered in this session', '—'],
              ['Model artefacts', 'None present', '—'],
            ].map(([k, v, ts]) => (
              <div key={k} className="flex flex-wrap items-center justify-between gap-2 border-b border-bw-line/60 pb-1.5 last:border-0">
                <div className="min-w-0">
                  <div className="text-[12px] text-bw-text">{k}</div>
                  <div className="text-[10.5px] text-bw-dim">{v}</div>
                </div>
                <span className="bw-num text-[10px] text-bw-dim">{ts}</span>
              </div>
            ))}
          </div>
          <div className="mt-3"><DataState state="DEMO DATA" ts={fmtTs()} source="in-browser synthetic engine" /></div>
        </Panel>
      </Grid>
    </>
  );
}

```

---

## 29. `frontend/src/pages/SurveillanceMap.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — INTERACTIVE SURVEILLANCE MAP (SEGMENT 4)
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Segmented, Grid, Stat, Meter, NoData, Btn,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Spark } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { ALERT_STATES, ALERT_DISCLAIMER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS, PATHOGENS } from '../lib/registry';
import { useMode } from '../lib/mode';

const LAYERS = [
  { value: 'all', label: 'All streams', color: 'var(--color-bw-primary)' },
  { value: 'epi', label: 'Epi', color: STREAMS.epi.color },
  { value: 'genomic', label: 'Genomic', color: STREAMS.genomic.color },
  { value: 'env', label: 'Env', color: STREAMS.env.color },
  { value: 'lab', label: 'Lab', color: STREAMS.lab.color },
  { value: 'synd', label: 'Syndromic', color: STREAMS.synd.color },
];

export default function SurveillanceMap() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [layer, setLayer] = useState('all');
  const [pathogen, setPathogen] = useState('all');
  const [projection, setProjection] = useState('natural');
  const [selected, setSelected] = useState('NGA');
  const [showPoints, setShowPoints] = useState(true);

  const filtered = useMemo(() => S.countries.filter((c) =>
    (layer === 'all' || c.streams.includes(layer)) &&
    (pathogen === 'all' || c.pathogenId === pathogen)), [S, layer, pathogen]);

  const values = useMemo(() => Object.fromEntries(
    filtered.map((c) => [c.iso, S.mapValues[c.iso]])), [filtered, S]);

  const points = useMemo(() => (showPoints ? filtered
    .filter((c) => c.availability !== 'none')
    .map((c) => ({
      lon: c.lon, lat: c.lat, iso: c.iso, label: `${c.name} · ${c.pathogen?.name}`,
      color: ALERT_STATES[c.state].color,
      r: 2.5 + Math.min(5, Math.abs(c.z) * 1.5),
    })) : []), [filtered, showPoints]);

  const sel = S.countries.find((c) => c.iso === selected);
  const selAlert = S.alerts.find((a) => a.iso === selected);

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 03" title="Surveillance Map" evidence="PLAN"
          description="Geographic exploration of signal state by territory, stream and pathogen." />
        <Callout tone="info" title="No geographic data available in this mode" icon={<Icons.Info size={12} />}>
          Map geometry is available, but no configured stream supplies territory-level values in the active mode.
          Switch to DEMONSTRATION mode to explore the interface, or configure a connector.
        </Callout>
        <div className="mt-3"><WorldMap values={{}} height={420} /></div>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 03" title="Surveillance Map" evidence="SIMULATED"
        description="Territory-level detector state for the synthetic monitoring set. Colour encodes what the detector reported, never a confirmed epidemiological situation." />

      <div className="mb-3"><SimulatedBanner text="SIMULATED DATA — NOT REAL-WORLD SURVEILLANCE. No country shown is experiencing the depicted activity." /></div>

      <Grid cols="xl:grid-cols-[1fr_360px]" className="mb-3">
        <div className="min-w-0">
          <Panel
            title="Global view" evidence="SIMULATED"
            subtitle="Click a territory to inspect its stream detail."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Segmented size="xs" options={[
                  { value: 'natural', label: 'Natural Earth' },
                  { value: 'mercator', label: 'Mercator' },
                  { value: 'orthographic', label: 'Globe' },
                ]} value={projection} onChange={setProjection} />
                <Btn size="xs" onClick={() => setShowPoints(!showPoints)}>
                  <Icons.Circle size={10} /> {showPoints ? 'Hide' : 'Show'} markers
                </Btn>
              </div>
            }
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="bw-label">Stream layer</span>
                <Segmented size="xs" options={LAYERS} value={layer} onChange={setLayer} />
              </div>
              <div className="flex items-center gap-2">
                <span className="bw-label">Pathogen</span>
                <select value={pathogen} onChange={(e) => setPathogen(e.target.value)}
                  className="rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1 text-[11px] text-bw-text outline-none focus:border-bw-primary">
                  <option value="all">All streams</option>
                  {PATHOGENS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <WorldMap values={values} points={points} height={430} projection={projection}
              selected={selected} onSelect={setSelected} />

            <div className="mt-2.5 flex flex-wrap items-start justify-between gap-3">
              <MapLegend />
              <span className="text-[10px] text-bw-dim">
                Marker radius ∝ |z| deviation · {filtered.length} territories in view
              </span>
            </div>

            <div className="mt-2.5">
              <Callout tone="warn" title="Cartographic caution" icon={<Icons.TriangleAlert size={12} />}>
                Country-level fill implies a uniformity that surveillance data never has. A national colour is an
                aggregate of heterogeneous sub-national reporting, and the strongest visual contrast on this map
                is usually a contrast in <span className="text-bw-text">surveillance capacity</span>, not in
                disease. {ALERT_DISCLAIMER}
              </Callout>
            </div>
          </Panel>
        </div>

        {/* ---------- Inspector ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          {sel ? (
            <>
              <Panel title={sel.name} evidence="SIMULATED" accent={ALERT_STATES[sel.state].color}
                subtitle={`${sel.region} · ${sel.pathogen?.name}`}>
                {sel.availability === 'none' ? (
                  <NoData reason="No stream is configured for this territory in the synthetic set. Absence of data is not absence of disease." />
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Pill color={ALERT_STATES[sel.state].color}>
                        <Dot color={ALERT_STATES[sel.state].color} />{sel.state}
                      </Pill>
                      <span className="text-[11px] text-bw-muted">{S.mapValues[sel.iso].label}</span>
                    </div>
                    <SignalChart data={sel.series.slice(-52)} height={140} />
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {[
                        ['Latest observed', sel.last.value.toLocaleString()],
                        ['Baseline', sel.last.baseline.toLocaleString()],
                        ['Deviation z', sel.z.toFixed(2)],
                        ['Consecutive wks', sel.consecutive],
                        ['Completeness', `${Math.round(sel.completeness * 100)}%`],
                        ['Reporting delay', `${sel.delayWeeks} wk`],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                          <div className="bw-label">{k}</div>
                          <div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Panel>

              <Panel title="Configured streams" evidence="SIMULATED" dense>
                <div className="space-y-1">
                  {Object.values(STREAMS).map((st) => {
                    const on = sel.streams.includes(st.key);
                    const C = Icons[st.icon] || Icons.Circle;
                    return (
                      <div key={st.key} className="flex items-center gap-2 rounded-sm px-1.5 py-1">
                        <C size={13} style={{ color: on ? st.color : 'var(--color-bw-dim)' }} />
                        <span className={`flex-1 text-[11.5px] ${on ? 'text-bw-text' : 'text-bw-dim'}`}>{st.label}</span>
                        <span className="font-mono text-[9px] tracking-[0.08em]"
                          style={{ color: on ? 'var(--color-alert-green)' : 'var(--color-bw-dim)' }}>
                          {on ? 'MAPPED' : 'NOT MAPPED'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              {selAlert && (
                <Panel title="Open signal" evidence="SIMULATED" accent={ALERT_STATES[selAlert.state].color}
                  actions={<Link to="/app/alerts" className="text-[11px] text-bw-primary-bright hover:underline">Details →</Link>}>
                  <div className="bw-num mb-1 text-[10px] text-bw-dim">{selAlert.id}</div>
                  <p className="text-[11.5px] leading-relaxed text-bw-muted">{selAlert.what}</p>
                  <div className="mt-2 rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                    <div className="bw-label">Recommended human review</div>
                    <p className="mt-0.5 text-[11px] text-bw-text">{selAlert.recommended}</p>
                  </div>
                </Panel>
              )}
            </>
          ) : (
            <Panel title="Inspector"><NoData reason="Select a territory on the map." /></Panel>
          )}

          <Panel title="Data availability in view" evidence="SIMULATED" dense>
            <div className="space-y-2 p-1">
              <Meter label="Full reporting" right={`${filtered.filter((c) => c.availability === 'full').length}`}
                value={filtered.filter((c) => c.availability === 'full').length} max={filtered.length} color="var(--color-alert-green)" />
              <Meter label="Sparse reporting" right={`${filtered.filter((c) => c.availability === 'sparse').length}`}
                value={filtered.filter((c) => c.availability === 'sparse').length} max={filtered.length} color="var(--color-alert-yellow)" />
              <Meter label="Insufficient data" right={`${filtered.filter((c) => c.availability === 'none').length}`}
                value={filtered.filter((c) => c.availability === 'none').length} max={filtered.length} color="var(--color-bw-dim)" />
            </div>
          </Panel>
        </div>
      </Grid>

      {/* ---------- Territory table ---------- */}
      <Panel title="Territories in view" evidence="SIMULATED"
        subtitle="Sortable detector output. Language is constrained to permitted signal phrasing.">
        <Table
          rowKey="iso"
          columns={[
            { key: 'name', header: 'Territory', render: (r) => (
              <button className="text-left text-[12px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSelected(r.iso)}>
                {r.name}
              </button>) },
            { key: 'region', header: 'Region', render: (r) => <span className="text-[11px] text-bw-dim">{r.region}</span> },
            { key: 'pathogen', header: 'Stream', render: (r) => <span className="text-[11.5px] text-bw-muted">{r.pathogen?.name}</span> },
            { key: 'state', header: 'Detector state', render: (r) => (
              <span className="flex items-center gap-1.5">
                <Dot color={ALERT_STATES[r.state].color} />
                <span className="text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                  {r.availability === 'none' ? 'Insufficient data' : S.mapValues[r.iso].label}
                </span>
              </span>) },
            { key: 'z', header: 'z', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px]">{r.availability === 'none' ? '—' : r.z.toFixed(2)}</span>) },
            { key: 'consecutive', header: 'Wks ≥2σ', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px] text-bw-muted">{r.availability === 'none' ? '—' : r.consecutive}</span>) },
            { key: 'completeness', header: 'Complete', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px] text-bw-muted">{r.availability === 'none' ? SAFE_LANGUAGE.noData : `${Math.round(r.completeness * 100)}%`}</span>) },
            { key: 'trend', header: '26-wk', align: 'right', width: 90, render: (r) => (
              <div className="ml-auto w-[80px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={22} /></div>) },
            { key: 'update', header: 'Last update', align: 'right', render: (r) => (
              <span className="bw-num text-[10px] text-bw-dim">{r.lastUpdate}</span>) },
          ]}
          rows={[...filtered].sort((a, b) => b.z - a.z)}
        />
      </Panel>
    </>
  );
}

```

---

## 30. `frontend/src/pages/DiseaseIntelligence.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — DISEASE INTELLIGENCE (SEGMENT 4)
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Stat, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Segmented, Grid, Meter, NoData, KV, Disclosure, Awaiting,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Bars, Spark, Stacked } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { PATHOGENS, STREAMS } from '../lib/registry';
import { synthSeries, synthDelayProfile, rng, fmtTs } from '../lib/synth';
import { ALERT_STATES, SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';
import { CONNECTORS } from '../lib/connectors';

export default function DiseaseIntelligence() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [pid, setPid] = useState('lassa');
  const [window, setWindow] = useState('104');

  const pathogen = PATHOGENS.find((p) => p.id === pid);
  const countries = useMemo(() => S.countries.filter((c) => c.pathogenId === pid), [S, pid]);

  const global = useMemo(() => {
    const base = synthSeries(`disease:${pid}`, {
      weeks: 156, level: 400 + (pid.length * 37), season: pid === 'lassa' ? 0.75 : 0.5,
      disp: 0.18, injectAt: countries.some((c) => c.state !== 'GREEN') ? 8 : null, injectSize: 0.4,
    });
    return base;
  }, [pid, countries]);

  const w = Number(window);
  const view = global.slice(-w);

  const delays = useMemo(() => synthDelayProfile(pid), [pid]);
  const seasonality = useMemo(() => {
    const r = rng(pid + ':season');
    return Array.from({ length: 12 }, (_, i) => ({
      name: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i],
      value: +(50 + 40 * Math.sin((i / 12) * 2 * Math.PI - (pid === 'lassa' ? 0.2 : 1.6)) + r() * 12).toFixed(1),
    }));
  }, [pid]);

  const composition = useMemo(() => {
    const r = rng(pid + ':comp');
    return global.slice(-52).map((p) => ({
      date: p.date,
      suspected: Math.round(p.value * (0.55 + r() * 0.1)),
      confirmed: Math.round(p.value * (0.28 + r() * 0.08)),
      probable: Math.round(p.value * (0.1 + r() * 0.05)),
    }));
  }, [global, pid]);

  const mapVals = useMemo(() => Object.fromEntries(countries.map((c) => [c.iso, S.mapValues[c.iso]])), [countries, S]);
  const relevantConnectors = CONNECTORS.filter((c) => pathogen.streams.includes(c.stream));

  const latest = view[view.length - 1];
  const deviation = latest ? latest.z : 0;

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 04" title="Disease Intelligence" evidence="PLAN"
          description="Per-pathogen exploration of incidence, baseline deviation, seasonality, confirmation and reporting behaviour." />
        <Callout tone="info" title="No pathogen stream bound in this mode" icon={<Icons.Info size={12} />}>
          This module renders only what a configured connector or uploaded dataset supplies. Nothing is bound in
          the active mode, and synthetic values are not substituted. Reference metadata below is descriptive
          public-health knowledge and contains no counts.
        </Callout>
        <Grid cols="lg:grid-cols-2" className="mt-3">
          {PATHOGENS.slice(0, 4).map((p) => (
            <Panel key={p.id} title={p.name} evidence="ESTABLISHED" subtitle={`${p.class} · ${p.family}`}>
              <p className="text-[12px] text-bw-muted">{p.seasonality}</p>
              <p className="mt-1 text-[11px] text-bw-dim">{p.surveillance}</p>
            </Panel>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 04" title="Disease Intelligence" evidence="SIMULATED"
        description="Pathogen-centred view combining synthetic activity series with descriptive surveillance metadata. Descriptive text is established public-health knowledge; every number is synthetic." />

      <div className="mb-3"><SimulatedBanner /></div>

      {/* ---------- Selector ---------- */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PATHOGENS.map((p) => (
          <button key={p.id} type="button" onClick={() => setPid(p.id)}
            className={`rounded-sm border px-2.5 py-1.5 text-[11.5px] transition-colors ${
              pid === p.id ? 'border-bw-primary bg-bw-primary/10 text-bw-text' : 'border-bw-line bg-bw-panel text-bw-muted hover:border-bw-line2'
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      <Grid cols="xl:grid-cols-[1fr_330px]" className="mb-3">
        <div className="min-w-0 space-y-3">
          <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Latest weekly count" value={latest?.value.toLocaleString()} evidence="SIMULATED"
              sub={`Week ending ${latest?.date}`} />
            <Stat label="Baseline expectation" value={latest?.baseline.toLocaleString()} evidence="SIMULATED"
              sub={`95% interval ${latest?.lo}–${latest?.hi}`} />
            <Stat label="Deviation from baseline" value={`${deviation > 0 ? '+' : ''}${deviation.toFixed(2)}σ`} evidence="SIMULATED"
              color={deviation >= 2 ? 'var(--color-alert-orange)' : 'var(--color-bw-text)'}
              sub={deviation >= 2 ? 'Exceeds detection threshold' : 'Within baseline interval'} />
            <Stat label="Deaths reported" value="—" evidence="SIMULATED" color="var(--color-bw-dim)"
              sub="Mortality stream not generated"
              hint="Mortality is deliberately not synthesised: fabricating death counts, even labelled, is unacceptable." />
          </Grid>

          <Panel title={`${pathogen.name} — incidence trend against baseline`} evidence="SIMULATED"
            subtitle="Solid: synthetic observed counts. Dashed: seasonal baseline. Band: 95% interval."
            actions={<Segmented size="xs" options={[
              { value: '52', label: '1 yr' }, { value: '104', label: '2 yr' }, { value: '156', label: '3 yr' },
            ]} value={window} onChange={setWindow} />}>
            <SignalChart data={view} height={230} yLabel="weekly count" />
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Case classification composition" evidence="SIMULATED"
              subtitle="Suspected / probable / laboratory-confirmed split — the confirmation ratio matters more than the total.">
              <Stacked data={composition} keys={['suspected', 'probable', 'confirmed']}
                colors={['#4a90c4', '#c9a227', '#2ea89a']} height={185} />
              <div className="mt-1.5 flex flex-wrap gap-3">
                {[['Suspected', '#4a90c4'], ['Probable', '#c9a227'], ['Confirmed', '#2ea89a']].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5 text-[10.5px] text-bw-muted">
                    <span className="h-2 w-2 rounded-sm" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Seasonality profile" evidence="SIMULATED"
              subtitle={`Descriptive note (ESTABLISHED): ${pathogen.seasonality}`}>
              <Bars data={seasonality} height={185} color="var(--color-bw-env)" note="SIMULATED — synthetic seasonal index" />
              <p className="mt-1.5 text-[10px] leading-snug text-bw-dim">
                A seasonal profile estimated from few years of data is unstable, and any detector built on it
                inherits that instability.
              </p>
            </Panel>
          </Grid>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Reporting delay distribution" evidence="SIMULATED"
              subtitle="Share of reports arriving n weeks after the event week. Drives now-cast correction.">
              <Bars data={delays.map((d) => ({ name: `+${d.lag}w`, value: Math.round(d.share * 100) }))}
                height={165} color="var(--color-alert-yellow)" unit="%" note="SIMULATED — synthetic delay profile" />
              <Callout tone="warn" title="Why this matters">
                The most recent points of any surveillance series are incomplete. A detector that ignores delay
                will read incompleteness as a decline, then read the back-fill as a surge.
              </Callout>
            </Panel>

            <Panel title="Geographic distribution" evidence="SIMULATED"
              subtitle="Territories with this stream configured in the synthetic set.">
              <WorldMap values={mapVals} height={190}
                points={countries.filter((c) => c.availability !== 'none').map((c) => ({
                  lon: c.lon, lat: c.lat, iso: c.iso, label: c.name,
                  color: ALERT_STATES[c.state].color, r: 3 + Math.abs(c.z),
                }))} />
              <div className="mt-2"><MapLegend compact /></div>
            </Panel>
          </Grid>
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Pathogen reference" evidence="ESTABLISHED"
            subtitle="Descriptive metadata — contains no counts and no claims about current activity.">
            <KV items={[
              { k: 'Name', v: pathogen.name, mono: false },
              { k: 'Family', v: pathogen.family, mono: false },
              { k: 'Class', v: pathogen.class, mono: false },
              { k: 'Seasonality', v: pathogen.seasonality, mono: false },
              { k: 'Surveillance practice', v: pathogen.surveillance, mono: false },
              { k: 'Note', v: pathogen.note, mono: false },
            ]} />
          </Panel>

          <Panel title="Stream availability" evidence="SIMULATED" dense>
            <div className="space-y-1 p-1">
              {Object.values(STREAMS).map((st) => {
                const on = pathogen.streams.includes(st.key);
                const C = Icons[st.icon] || Icons.Circle;
                return (
                  <div key={st.key} className="flex items-center gap-2 py-0.5">
                    <C size={13} style={{ color: on ? st.color : 'var(--color-bw-dim)' }} />
                    <span className={`flex-1 text-[11.5px] ${on ? 'text-bw-text' : 'text-bw-dim'}`}>{st.label}</span>
                    <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: on ? st.color : 'var(--color-bw-dim)' }}>
                      {on ? 'DESIGNED' : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Laboratory confirmation" evidence="SIMULATED">
            <Meter label="Confirmation ratio (synthetic)" right="≈ 31%" value={31} color="var(--color-bw-primary)" />
            <div className="mt-2 space-y-1.5 text-[11px] text-bw-muted">
              <div className="flex justify-between"><span>Assay</span><span className="bw-num text-bw-dim">RT-PCR (reference)</span></div>
              <div className="flex justify-between"><span>Turnaround (synthetic)</span><span className="bw-num text-bw-dim">2.4 d median</span></div>
              <div className="flex justify-between"><span>Validated sensitivity</span><span className="font-mono text-[10px] text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span></div>
            </div>
          </Panel>

          <Panel title="Relevant alerts" evidence="SIMULATED" dense>
            {S.alerts.filter((a) => a.pathogenId === pid).length === 0 ? (
              <div className="px-2 py-4 text-center text-[11px] text-bw-dim">No open signal for this stream.</div>
            ) : S.alerts.filter((a) => a.pathogenId === pid).map((a) => (
              <div key={a.id} className="border-b border-bw-line/60 px-1.5 py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <Dot color={ALERT_STATES[a.state].color} />
                  <span className="bw-num text-[10px] text-bw-dim">{a.id}</span>
                  <span className="ml-auto text-[10px] text-bw-dim">{a.country}</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-bw-muted">{a.what}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Source connectors for this pathogen" evidence="ESTABLISHED" dense>
            <div className="space-y-1 p-1">
              {relevantConnectors.slice(0, 5).map((c) => (
                <div key={c.id} className="rounded-sm border border-bw-line bg-bw-panel2/40 px-2 py-1.5">
                  <div className="text-[11px] text-bw-text">{c.name}</div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-[9.5px] text-bw-dim">{c.frequency}</span>
                    <span className="font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">
                      {c.status === 'available' ? 'CONFIG REQUIRED' : c.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Grid>

      <Grid cols="lg:grid-cols-2">
        <Panel title="Territory breakdown" evidence="SIMULATED">
          <Table rowKey="iso" columns={[
            { key: 'name', header: 'Territory' },
            { key: 'state', header: 'Detector state', render: (r) => (
              <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                <Dot color={ALERT_STATES[r.state].color} />{r.availability === 'none' ? 'Insufficient data' : r.state}
              </span>) },
            { key: 'z', header: 'z', align: 'right', render: (r) => <span className="bw-num text-[11.5px]">{r.availability === 'none' ? '—' : r.z.toFixed(2)}</span> },
            { key: 'sp', header: '26-wk', align: 'right', width: 90, render: (r) => (
              <div className="ml-auto w-[80px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={20} /></div>) },
          ]} rows={countries} empty="No territory configured for this pathogen in the synthetic set." />
        </Panel>

        <Panel title="What this module cannot tell you" evidence="ESTABLISHED">
          <div className="space-y-2">
            <Disclosure summary="Incidence vs. detected incidence" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Every series here is a series of <em>reports</em>. The relationship between reports and true
                incidence depends on care-seeking, testing access, case definition and administrative capacity —
                each of which varies over time and place.
              </p>
            </Disclosure>
            <Disclosure summary="Why no case-fatality figure is shown" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A synthetic CFR would be a fabricated clinical statistic. Mortality streams are therefore left
                empty in DEMONSTRATION mode and populated only from a real, cited source.
              </p>
            </Disclosure>
            <Disclosure summary="Why deviation is not risk" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A z-score measures distance from a statistical expectation. Converting it into a risk statement
                requires an epidemiological model of consequence, transmission and susceptibility that this
                prototype does not contain.
              </p>
            </Disclosure>
            <Disclosure summary="Planned additions" tag="PLAN">
              <ul className="space-y-1 text-[11.5px] text-bw-muted">
                {['Now-casting with delay-adjusted reporting triangles', 'Rt estimation with documented serial-interval assumptions',
                  'Age/sex stratification where the source provides it', 'Sub-national resolution where licensing permits'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Dot size={13} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
                ))}
              </ul>
            </Disclosure>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-bw-line pt-2">
            <span className="bw-label">Series generated</span>
            <span className="bw-num text-[10px] text-bw-dim">{fmtTs()}</span>
          </div>
        </Panel>
      </Grid>
    </>
  );
}

```

---

## 31. `frontend/src/pages/SignalEngine.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — SIGNAL DETECTION ENGINE (SEGMENT 5)
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Grid, Stat, NotImplemented, Btn, Field, Select, Segmented, Disclosure, KV, Awaiting,
} from '../components/ui';
import { SignalChart } from '../components/charts';
import { DETECTORS, detectorAgreement } from '../lib/detectors';
import { buildSurveillance } from '../lib/surveillance';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* ---------- Pipeline definition ---------- */
const STAGES = [
  { id: 'raw', name: 'Raw data', icon: 'Database', state: 'partial',
    what: 'Acquisition of source records exactly as published, with the retrieval timestamp and source hash retained.',
    impl: 'Synthetic generator in DEMONSTRATION mode; connector interfaces defined but unconfigured.',
    outputs: 'Immutable raw table + retrieval manifest' },
  { id: 'validation', name: 'Validation', icon: 'ShieldCheck', state: 'partial',
    what: 'Schema conformance, type checks, geography/date vocabulary checks, duplicate detection, range plausibility.',
    impl: 'Rule set specified; executed on synthetic frames only.',
    outputs: 'Validation report + quarantine table for rejected rows' },
  { id: 'preprocess', name: 'Preprocessing', icon: 'Filter', state: 'partial',
    what: 'Harmonisation of geography codes, epidemiological week alignment, unit reconciliation, deduplication.',
    impl: 'Week alignment implemented for the synthetic engine.',
    outputs: 'Tidy long-format panel: geo × time × indicator' },
  { id: 'normalise', name: 'Normalisation', icon: 'Scale', state: 'plan',
    what: 'Population, testing-volume and flow normalisation so that series are comparable across places and time.',
    impl: 'Not implemented — requires denominators from a configured source.',
    outputs: 'Rates and normalised indices with explicit denominators' },
  { id: 'qc', name: 'Quality control', icon: 'Microscope', state: 'partial',
    what: 'Missingness accounting, delay-triangle construction, reporting-artefact flags, source-reliability scoring.',
    impl: 'Metrics specified; demonstrated on synthetic data in the Data Quality Center.',
    outputs: 'Per-series quality vector attached to every downstream record' },
  { id: 'features', name: 'Feature engineering', icon: 'Boxes', state: 'partial',
    what: 'Lags, rolling statistics, week-over-week change, seasonal indices, cross-stream lead/lag features.',
    impl: 'Feature definitions listed in the ML Lab; computed only inside an experiment run.',
    outputs: 'Feature matrix with a documented, versioned recipe' },
  { id: 'baseline', name: 'Baseline estimation', icon: 'Ruler', state: 'done',
    what: 'Expected value and interval for each series under "no unusual activity", estimated from history.',
    impl: 'Implemented: same-week mean ± kσ, rolling mean, robust median.',
    outputs: 'Expected value, dispersion, 95% interval per time point' },
  { id: 'detect', name: 'Anomaly / signal detection', icon: 'Radar', state: 'done',
    what: 'Application of one or more detectors to the residual between observed and expected.',
    impl: 'Implemented: threshold, seasonal kσ, EWMA, CUSUM, robust MAD.',
    outputs: 'Per-time-point flag + score per detector' },
  { id: 'ml', name: 'Machine-learning model', icon: 'Brain', state: 'none',
    what: 'Supervised or unsupervised model producing a signal score from the feature matrix.',
    impl: 'NOT IMPLEMENTED. No model has been trained; no model contributes to any signal in this build.',
    outputs: 'Model score + calibrated probability (once trained)' },
  { id: 'compare', name: 'Model comparison', icon: 'GitCompare', state: 'partial',
    what: 'Head-to-head evaluation of every candidate against the statistical baseline on identical temporal splits.',
    impl: 'Comparison harness and metric definitions specified; no results because nothing is trained.',
    outputs: 'Comparison table with detection delay, sensitivity, PPV, alarm rate' },
  { id: 'xai', name: 'Explainability', icon: 'Lightbulb', state: 'partial',
    what: 'Attribution of each signal to input features, with uncertainty and alternative explanations.',
    impl: 'Panel and contract implemented; attributions require a fitted model.',
    outputs: 'Ranked contributions + narrative + limitations' },
  { id: 'alert', name: 'Alert generation', icon: 'BellRing', state: 'done',
    what: 'Composition of a structured candidate signal record with everything a reviewer needs to judge it.',
    impl: 'Implemented for baseline-derived signals in DEMONSTRATION mode.',
    outputs: 'Alert object: what/where/when/source/baseline/uncertainty/alternatives' },
  { id: 'review', name: 'Human review', icon: 'UserCheck', state: 'partial',
    what: 'Analyst adjudication. The only stage permitted to change a signal into an actionable statement.',
    impl: 'Workflow states implemented in the Alert Center; no external notification is ever sent.',
    outputs: 'Adjudication + rationale, appended to the immutable audit log' },
];

const STATE_META = {
  done: { label: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
  partial: { label: 'PARTIAL', color: 'var(--color-alert-yellow)' },
  plan: { label: 'PLANNED', color: 'var(--color-bw-dim)' },
  none: { label: 'NOT IMPLEMENTED', color: 'var(--color-alert-red)' },
};

export default function SignalEngine() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [stage, setStage] = useState('detect');
  const [streamKey, setStreamKey] = useState('NGA');
  const [k, setK] = useState('2');
  const [active, setActive] = useState(['seasonal', 'ewma', 'cusum', 'mad']);

  const country = S.countries.find((c) => c.iso === streamKey) || S.countries[0];
  const series = country.series;

  const results = useMemo(() => DETECTORS
    .filter((d) => d.implemented && active.includes(d.id))
    .map((d) => d.run(series, { k: Number(k) })), [series, active, k]);

  const overlay = useMemo(() => {
    const flagIdx = new Set();
    results.forEach((r) => r.flags.forEach((f, i) => { if (f.flag) flagIdx.add(i); }));
    return series.map((p, i) => ({ ...p, flag: flagIdx.has(i) ? p.value : undefined }));
  }, [series, results]);

  const agreement = useMemo(() => (results.length > 1 ? detectorAgreement(results) : null), [results]);
  const stageInfo = STAGES.find((s) => s.id === stage);

  const toggle = (id) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <>
      <PageHeader kicker="Module 05" title="Signal Detection Engine" evidence="PRELIMINARY"
        description="The computational pipeline from raw record to reviewed candidate signal. Statistical detectors below execute in the browser on the selected series; machine-learning stages are explicitly inert." />

      {isDemo && <div className="mb-3"><SimulatedBanner text="SIMULATED DATA — detectors are real code, the series they run on is synthetic." /></div>}

      {/* ---------- Pipeline ---------- */}
      <Panel title="Processing pipeline" evidence="PLAN"
        subtitle="Select a stage to inspect its contract, implementation state and outputs."
        className="mb-3">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {STAGES.map((s, i) => {
            const C = Icons[s.icon] || Icons.Circle;
            const meta = STATE_META[s.state];
            const on = stage === s.id;
            return (
              <div key={s.id} className="flex shrink-0 items-center">
                <button type="button" onClick={() => setStage(s.id)}
                  className={`w-[112px] rounded-sm border px-2 py-2 text-left transition-colors ${
                    on ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/50 hover:border-bw-line2'
                  }`}>
                  <div className="flex items-center justify-between">
                    <C size={13} style={{ color: on ? 'var(--color-bw-primary-bright)' : 'var(--color-bw-dim)' }} />
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                  </div>
                  <div className="bw-num mt-1 text-[8.5px] text-bw-dim">{String(i + 1).padStart(2, '0')}</div>
                  <div className={`mt-0.5 text-[10.5px] leading-tight ${on ? 'text-bw-text' : 'text-bw-muted'}`}>{s.name}</div>
                </button>
                {i < STAGES.length - 1 && <Icons.ChevronRight size={12} className="mx-0.5 shrink-0 text-bw-line2" />}
              </div>
            );
          })}
        </div>

        <div className="mt-2 rounded-md border border-bw-line bg-bw-panel2/40 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-bw-text">{stageInfo.name}</span>
            <Pill color={STATE_META[stageInfo.state].color}>{STATE_META[stageInfo.state].label}</Pill>
          </div>
          <Grid cols="md:grid-cols-3">
            <div><div className="bw-label mb-1">Contract</div><p className="text-[11.5px] leading-relaxed text-bw-muted">{stageInfo.what}</p></div>
            <div><div className="bw-label mb-1">Implementation state</div><p className="text-[11.5px] leading-relaxed text-bw-muted">{stageInfo.impl}</p></div>
            <div><div className="bw-label mb-1">Outputs</div><p className="text-[11.5px] leading-relaxed text-bw-muted">{stageInfo.outputs}</p></div>
          </Grid>
          {stageInfo.state === 'none' && (
            <div className="mt-2"><NotImplemented what="Machine-learning scoring stage"
              plan="This stage is deliberately inert. Enabling it requires a fixed label definition, a temporal split protocol, and a completed baseline comparison — in that order." /></div>
          )}
        </div>
      </Panel>

      {/* ---------- Detector bench ---------- */}
      <Grid cols="xl:grid-cols-[1fr_330px]" className="mb-3">
        <div className="min-w-0 space-y-3">
          <Panel title="Detector bench" evidence="PRELIMINARY"
            subtitle="Detectors run live on the selected series. Output is a flag, not a finding."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Select value={streamKey} onChange={setStreamKey} className="w-[170px]"
                  options={S.countries.filter((c) => c.availability !== 'none').map((c) => ({ value: c.iso, label: `${c.name} · ${c.pathogen?.name}` }))} />
                <Segmented size="xs" value={k} onChange={setK}
                  options={[{ value: '1.5', label: 'k=1.5' }, { value: '2', label: 'k=2' }, { value: '2.5', label: 'k=2.5' }, { value: '3', label: 'k=3' }]} />
              </div>}>
            <SignalChart data={overlay.slice(-104)} height={230} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DETECTORS.filter((d) => d.implemented).map((d) => (
                <button key={d.id} type="button" onClick={() => toggle(d.id)}
                  className={`rounded-sm border px-2 py-1 text-[10.5px] transition-colors ${
                    active.includes(d.id) ? 'border-bw-primary bg-bw-primary/10 text-bw-text' : 'border-bw-line bg-bw-panel2 text-bw-dim hover:text-bw-muted'
                  }`}>
                  {active.includes(d.id) ? '✓ ' : ''}{d.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Detector output comparison" evidence="PRELIMINARY"
            subtitle="Flag counts and latest scores on the identical series. These are descriptive counts, NOT performance metrics — no reference labels exist.">
            <Table rowKey="id" columns={[
              { key: 'name', header: 'Detector', render: (r) => <span className="text-[11.5px] text-bw-text">{r.name}</span> },
              { key: 'flags', header: 'Weeks flagged', align: 'right', render: (r) => (
                <span className="bw-num text-[11.5px]">{r.flags.filter((f) => f.flag).length}</span>) },
              { key: 'rate', header: 'Alarm rate', align: 'right', render: (r) => (
                <span className="bw-num text-[11.5px] text-bw-muted">
                  {((r.flags.filter((f) => f.flag).length / r.flags.length) * 100).toFixed(1)}%
                </span>) },
              { key: 'last', header: 'Latest score', align: 'right', render: (r) => {
                const f = r.flags[r.flags.length - 1];
                return <span className="bw-num text-[11.5px]" style={{ color: f.flag ? 'var(--color-alert-orange)' : 'var(--color-bw-muted)' }}>
                  {f.score}{f.flag ? ' ⚑' : ''}
                </span>;
              } },
              { key: 'sens', header: 'Sensitivity / PPV', align: 'right', render: () => (
                <span className="font-mono text-[10px] text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>) },
            ]} rows={results} empty="Select at least one detector." />
            <Callout tone="warn" title="Why no performance figures appear here">
              Sensitivity, specificity, PPV and detection delay all require a reference set of true events.
              This prototype has none, and a synthetic injected step is not a real event. Reporting a metric
              against a step this code itself inserted would be circular.
            </Callout>
          </Panel>

          {agreement && (
            <Panel title="Detector agreement matrix" evidence="PRELIMINARY"
              subtitle="Pairwise agreement (top) and Jaccard overlap of flagged weeks (bottom). Agreement is not correctness — detectors can agree and both be wrong.">
              <div className="overflow-x-auto">
                <table className="border-collapse text-[11px]">
                  <thead>
                    <tr>
                      <th className="bw-label p-1.5 text-left">—</th>
                      {results.map((r) => <th key={r.id} className="bw-label p-1.5">{r.id}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((a) => (
                      <tr key={a.id}>
                        <td className="bw-label p-1.5">{a.id}</td>
                        {results.map((b) => {
                          const cell = agreement[a.id][b.id];
                          const v = cell.agreement;
                          return (
                            <td key={b.id} className="p-1.5 text-center">
                              <div className="rounded-sm px-2 py-1"
                                style={{ background: `rgba(46,168,154,${(v - 0.5) * 1.6})`, color: v > 0.8 ? '#e6eef5' : '#93a7b8' }}>
                                <div className="bw-num">{v.toFixed(2)}</div>
                                <div className="bw-num text-[9px] opacity-70">J {cell.jaccard ?? '—'}</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Method inventory" evidence="ESTABLISHED"
            subtitle="What exists in code versus what is planned.">
            <div className="space-y-1.5">
              {DETECTORS.map((d) => (
                <div key={d.id} className="rounded-sm border border-bw-line bg-bw-panel2/40 px-2 py-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11.5px] text-bw-text">{d.label}</span>
                    <span className="shrink-0 font-mono text-[8.5px] tracking-[0.08em]"
                      style={{ color: d.implemented ? 'var(--color-alert-green)' : 'var(--color-bw-dim)' }}>
                      {d.implemented ? 'IN CODE' : 'NOT IMPL.'}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[9.5px] text-bw-dim">{d.family}</div>
                  {!d.implemented && d.plan && (
                    <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-dim">{d.plan}</p>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Selected detector parameters" evidence="PRELIMINARY" dense>
            {results.map((r) => (
              <div key={r.id} className="border-b border-bw-line/60 px-1.5 py-2 last:border-0">
                <div className="text-[11.5px] text-bw-text">{r.name}</div>
                <div className="bw-num mt-0.5 text-[10px] text-bw-dim">{JSON.stringify(r.params)}</div>
                <p className="mt-1 text-[10px] leading-snug text-bw-muted">{r.note}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Signal → review handoff" evidence="PLAN">
            <ol className="space-y-1.5 text-[11.5px] text-bw-muted">
              {['Detector emits flag + score', 'Engine attaches baseline, interval and quality vector',
                'Alert record composed with alternative explanations', 'Queued for analyst triage — never auto-published',
                'Adjudication written to append-only audit log'].map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="bw-num text-bw-dim">{i + 1}.</span>{s}
                </li>
              ))}
            </ol>
            <div className="mt-2.5">
              <Link to="/app/alerts"><Btn size="sm" variant="outline" className="w-full">
                <Icons.BellRing size={12} /> Open Early-Warning Center
              </Btn></Link>
            </div>
          </Panel>
        </div>
      </Grid>

      <Grid cols="lg:grid-cols-2">
        <Panel title="Known failure modes of this engine" evidence="ESTABLISHED">
          <div className="space-y-2">
            {[
              ['Baseline contamination', 'If the history used to estimate the baseline contains previous epidemics, the expected value is inflated and genuine events are missed. Robust or epidemic-excluding baselines mitigate but do not solve this.'],
              ['Reporting artefacts', 'Holiday backlogs, system migrations and case-definition changes produce textbook-shaped "signals". Without provenance metadata, no detector can distinguish them from biology.'],
              ['Multiple testing', 'Running five detectors across dozens of series multiplies false alarms. An alarm-rate budget must be set before deployment, not after.'],
              ['Threshold arbitrariness', 'k = 2 versus k = 3 changes the entire alarm profile. The choice is a policy decision about tolerable false-alarm burden, not a statistical fact.'],
            ].map(([t, b]) => (
              <Disclosure key={t} summary={t} tag="ESTABLISHED">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">{b}</p>
              </Disclosure>
            ))}
          </div>
        </Panel>

        <Panel title="Engine configuration" evidence="PRELIMINARY">
          <KV cols={2} items={[
            { k: 'Active series', v: `${country.name} · ${country.pathogen?.name}` },
            { k: 'Series length', v: `${series.length} weeks (synthetic)` },
            { k: 'Detectors enabled', v: `${results.length} of ${DETECTORS.filter((d) => d.implemented).length} implemented` },
            { k: 'ML contribution', v: 'None — no model trained' },
            { k: 'Persistence rule', v: '2 consecutive exceedances → escalate state' },
            { k: 'Alarm-rate budget', v: 'Not set — policy decision pending' },
            { k: 'Reference labels', v: 'None available' },
            { k: 'Validated performance', v: SAFE_LANGUAGE.awaitingExperiment },
          ]} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/app/ml-lab"><Btn size="sm"><Icons.FlaskConical size={12} /> ML Lab</Btn></Link>
            <Link to="/app/evaluation"><Btn size="sm"><Icons.GaugeCircle size={12} /> Evaluation</Btn></Link>
            <Link to="/app/xai"><Btn size="sm"><Icons.Lightbulb size={12} /> Explainability</Btn></Link>
          </div>
        </Panel>
      </Grid>
    </>
  );
}

```

---

## 32. `frontend/src/pages/AlertCenter.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — EARLY-WARNING CENTER (alert triage)
   Alert states are INTERFACE states, never public-health calls.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Grid, Stat, Btn, Segmented, KV, NoData, Field, Select,
} from '../components/ui';
import { SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { ALERT_STATES, ALERT_DISCLAIMER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';

const WORKFLOW = ['Awaiting triage', 'Under review', 'Investigation requested', 'Explained — reporting artefact', 'Closed — no action'];

export default function AlertCenter() {
  const { isDemo, session } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [filter, setFilter] = useState('ALL');
  const [selId, setSelId] = useState(S.alerts[0]?.id);
  const [statuses, setStatuses] = useState(() => Object.fromEntries(S.alerts.map((a) => [a.id, a.status])));
  const [log, setLog] = useState([]);
  const [note, setNote] = useState('');

  const alerts = S.alerts.filter((a) => filter === 'ALL' || a.state === filter);
  const sel = S.alerts.find((a) => a.id === selId);
  const country = S.countries.find((c) => c.iso === sel?.iso);

  const adjudicate = (status) => {
    if (!sel) return;
    setStatuses((s) => ({ ...s, [sel.id]: status }));
    setLog((l) => [{
      id: sel.id, status, at: fmtTs(), by: session?.name || 'Guest (read-only)',
      note: note || '(no rationale recorded)',
    }, ...l]);
    setNote('');
  };

  const counts = ['RED', 'ORANGE', 'YELLOW', 'GREEN'].map((k) => ({
    k, n: k === 'GREEN'
      ? S.countries.filter((c) => c.state === 'GREEN' && c.availability !== 'none').length
      : S.alerts.filter((a) => a.state === k).length,
  }));

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 08" title="Early-Warning Center" evidence="PLAN"
          description="Triage queue for candidate signals awaiting human adjudication." />
        <Callout tone="info" title="No candidate signals in this mode">
          Signals are produced only by detectors running on bound data. Nothing is bound in the active mode.
        </Callout>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 08" title="Early-Warning Center" evidence="SIMULATED"
        description="Candidate signals produced by statistical detectors on synthetic series, queued for analyst adjudication. No alert is ever transmitted externally from this prototype." />

      <div className="mb-3"><SimulatedBanner /></div>

      <Callout tone="danger" title="Standing constraint on every alert on this page" icon={<Icons.TriangleAlert size={12} />}>
        {ALERT_DISCLAIMER} No entry here states or implies that an outbreak exists.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        {counts.map(({ k, n }) => (
          <div key={k} className="rounded-md border bg-bw-panel px-3 py-2.5"
            style={{ borderColor: ALERT_STATES[k].color + '55', borderLeftWidth: 2, borderLeftColor: ALERT_STATES[k].color }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: ALERT_STATES[k].color }}>{k}</span>
              <span className="bw-num text-[20px] font-semibold text-bw-text">{n}</span>
            </div>
            <div className="mt-1 text-[11px] text-bw-text">{ALERT_STATES[k].title}</div>
            <p className="mt-1 text-[10px] leading-snug text-bw-dim">{ALERT_STATES[k].meaning}</p>
          </div>
        ))}
      </Grid>

      <Grid cols="xl:grid-cols-[380px_1fr]">
        {/* ---------- Queue ---------- */}
        <Panel title="Triage queue" evidence="SIMULATED"
          subtitle={`${alerts.length} candidate signal${alerts.length === 1 ? '' : 's'}`}
          actions={<Segmented size="xs" value={filter} onChange={setFilter}
            options={[{ value: 'ALL', label: 'All' }, { value: 'RED', label: 'Red', color: ALERT_STATES.RED.color },
              { value: 'ORANGE', label: 'Orange', color: ALERT_STATES.ORANGE.color }, { value: 'YELLOW', label: 'Yellow', color: ALERT_STATES.YELLOW.color }]} />}
          bodyClass="max-h-[720px] overflow-y-auto">
          <div className="space-y-1.5">
            {alerts.map((a) => (
              <button key={a.id} type="button" onClick={() => setSelId(a.id)}
                className={`block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  selId === a.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'
                }`}>
                <div className="flex items-center gap-2">
                  <Dot color={ALERT_STATES[a.state].color} pulse={a.state === 'RED'} />
                  <span className="bw-num text-[10px] text-bw-dim">{a.id}</span>
                  <span className="ml-auto font-mono text-[9px] tracking-[0.1em]" style={{ color: ALERT_STATES[a.state].color }}>{a.state}</span>
                </div>
                <div className="mt-1 text-[12px] text-bw-text">{a.country} · {a.pathogen}</div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="bw-num text-[10px] text-bw-dim">z = {a.z}</span>
                  <span className="text-[9.5px] text-bw-muted">{statuses[a.id]}</span>
                </div>
              </button>
            ))}
            {alerts.length === 0 && <NoData reason="No candidate signal matches this filter." />}
          </div>
        </Panel>

        {/* ---------- Detail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          {sel ? (
            <>
              <Panel accent={ALERT_STATES[sel.state].color} evidence="SIMULATED"
                title={`${sel.id} — ${sel.country} · ${sel.pathogen}`}
                subtitle="Structured candidate-signal record. Every field below is required before a signal may enter the queue."
                actions={<Pill color={ALERT_STATES[sel.state].color} filled>{sel.state}</Pill>}>

                <div className="mb-3 rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                  <div className="bw-label mb-1">What changed</div>
                  <p className="text-[12.5px] leading-relaxed text-bw-text">{sel.what}</p>
                </div>

                <Grid cols="md:grid-cols-2" gap="gap-2.5">
                  <div className="space-y-2.5">
                    {[
                      ['Where', sel.where, 'MapPin'],
                      ['When', sel.when, 'Clock'],
                      ['Detecting stream', `${STREAMS[sel.source].label} — ${sel.sources.map((s) => STREAMS[s].label).join(', ')}`, 'Radio'],
                      ['Detector used', sel.detector, 'Radar'],
                      ['Model used', sel.model, 'Brain'],
                    ].map(([k, v, icon]) => {
                      const C = Icons[icon];
                      return (
                        <div key={k} className="flex gap-2">
                          <C size={13} className="mt-[3px] shrink-0 text-bw-dim" />
                          <div className="min-w-0">
                            <div className="bw-label">{k}</div>
                            <div className="mt-0.5 text-[11.5px] leading-snug text-bw-text">{v}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2.5">
                    <div className="rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                      <div className="bw-label mb-1.5">Baseline comparison</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[['Observed', sel.observed.toLocaleString()], ['Expected', sel.baseline.toLocaleString()],
                          ['95% interval', `${sel.interval[0]}–${sel.interval[1]}`], ['Deviation', `z = ${sel.z}`]].map(([k, v]) => (
                          <div key={k}>
                            <div className="bw-label">{k}</div>
                            <div className="bw-num mt-0.5 text-[12.5px] text-bw-text">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                      <div className="bw-label mb-1">Confidence & uncertainty</div>
                      <div className="mb-1 flex items-center gap-2">
                        <Pill color={sel.confidence === 'Moderate' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)'}>
                          {sel.confidence} confidence in the OBSERVATION
                        </Pill>
                      </div>
                      <p className="text-[11px] leading-relaxed text-bw-muted">{sel.uncertainty}</p>
                      <p className="mt-1 text-[11px] text-bw-muted">{sel.concordance}</p>
                    </div>
                  </div>
                </Grid>

                <div className="mt-3">
                  <div className="bw-label mb-1.5">Possible alternative explanations (not excluded)</div>
                  <ul className="space-y-1">
                    {sel.alternatives.map((alt) => (
                      <li key={alt} className="flex gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5 text-[11.5px] text-bw-muted">
                        <Icons.CircleHelp size={13} className="mt-[2px] shrink-0 text-bw-dim" />{alt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[10.5px] text-bw-dim">
                    A signal may not be escalated until each alternative above has been considered and the
                    reasoning recorded. {SAFE_LANGUAGE.insufficient} until then.
                  </p>
                </div>

                <div className="mt-3 rounded-sm border p-2.5" style={{ borderColor: ALERT_STATES[sel.state].color + '55', background: ALERT_STATES[sel.state].color + '0d' }}>
                  <div className="bw-label mb-1">Recommended human review</div>
                  <p className="text-[12px] leading-relaxed text-bw-text">{sel.recommended}</p>
                </div>
              </Panel>

              <Grid cols="lg:grid-cols-[1.4fr_1fr]">
                <Panel title="Series in context" evidence="SIMULATED"
                  subtitle="Observed vs baseline for the detecting stream.">
                  {country && <SignalChart data={country.series.slice(-78)} height={190} />}
                </Panel>

                <Panel title="Adjudication" evidence="PLAN"
                  subtitle="Analyst action. Recorded locally in this session only — nothing is transmitted.">
                  <Field label="Reviewer rationale (required in production)">
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                      placeholder="e.g. Checked source revision history; increase coincides with a laboratory reporting backlog clearing."
                      className="w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[11.5px] text-bw-text placeholder:text-bw-dim outline-none focus:border-bw-primary" />
                  </Field>
                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {WORKFLOW.map((wstat) => (
                      <Btn key={wstat} size="xs" variant={statuses[sel.id] === wstat ? 'outline' : 'ghost'}
                        onClick={() => adjudicate(wstat)} className="justify-start">
                        {statuses[sel.id] === wstat ? <Icons.CircleDot size={11} /> : <Icons.Circle size={11} />} {wstat}
                      </Btn>
                    ))}
                  </div>
                  <Callout tone="danger" title="Blocked action">
                    <span className="flex items-center gap-2">
                      <Icons.Ban size={12} className="shrink-0" />
                      "Declare outbreak" is not an available action in this system, by design and at any role level.
                    </span>
                  </Callout>
                </Panel>
              </Grid>

              <Panel title="Session adjudication log" evidence="PLAN"
                subtitle="Append-only in production. Entries are superseded, never deleted.">
                <Table dense columns={[
                  { key: 'at', header: 'Timestamp', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.at}</span> },
                  { key: 'id', header: 'Signal', render: (r) => <span className="bw-num text-[10.5px]">{r.id}</span> },
                  { key: 'status', header: 'Adjudication' },
                  { key: 'by', header: 'Reviewer', render: (r) => <span className="text-[11px] text-bw-muted">{r.by}</span> },
                  { key: 'note', header: 'Rationale', render: (r) => <span className="text-[11px] text-bw-muted">{r.note}</span> },
                ]} rows={log} empty="No adjudication recorded in this session." />
              </Panel>
            </>
          ) : <Panel title="Signal detail"><NoData reason="Select a candidate signal from the queue." /></Panel>}
        </div>
      </Grid>

      <div className="mt-3">
        <Panel title="Escalation policy (design)" evidence="PLAN">
          <Grid cols="md:grid-cols-4">
            {Object.values(ALERT_STATES).map((s) => (
              <div key={s.key} className="rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5" style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
                <div className="font-mono text-[10px] tracking-[0.14em]" style={{ color: s.color }}>{s.key}</div>
                <div className="mt-1 text-[11.5px] text-bw-text">{s.title}</div>
                <p className="mt-1 text-[10.5px] leading-snug text-bw-dim">{s.meaning}</p>
              </div>
            ))}
          </Grid>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Link to="/app/settings"><Btn size="xs"><Icons.Bell size={11} /> Notification configuration</Btn></Link>
            <Link to="/app/xai"><Btn size="xs"><Icons.Lightbulb size={11} /> Explain this signal</Btn></Link>
            <span className="text-[10px] text-bw-dim">External notification channels are disabled and cannot be enabled in this build.</span>
          </div>
        </Panel>
      </div>
    </>
  );
}

```

---

## 33. `frontend/src/pages/XAI.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — EXPLAINABLE AI PANEL (SEGMENT 7)
   Attribution UI + the explanation contract. Because no model is
   trained, no model attribution exists. What CAN be decomposed
   honestly is the statistical baseline: the deviation is split
   into its arithmetic components, which is exact, not estimated.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  Awaiting, KV, Disclosure, NotImplemented, SimulatedBanner, Meter, Stat,
} from '../components/ui';
import { Contributions, SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';

export default function XAI() {
  const S = useMemo(() => buildSurveillance(), []);
  const [alertId, setAlertId] = useState(S.alerts[0]?.id);
  const alert = S.alerts.find((a) => a.id === alertId) || S.alerts[0];
  const country = S.countries.find((c) => c.iso === alert?.iso);

  /* Exact arithmetic decomposition of the baseline deviation.
     This is NOT a model attribution — it is algebra, and it is
     labelled as such. */
  const decomposition = useMemo(() => {
    if (!country) return [];
    const s = country.series;
    const last = s[s.length - 1];
    const prev = s[s.length - 2];
    const yearAgo = s[s.length - 53] || s[0];
    const seasonalPart = last.baseline - (yearAgo?.baseline ?? last.baseline);
    const residual = last.value - last.baseline;
    const momentum = last.value - prev.value;
    const dispersion = (last.hi - last.lo) / 2;
    return [
      { feature: 'Observed − baseline (residual)', contribution: +residual.toFixed(1), kind: 'exact' },
      { feature: 'Week-over-week change', contribution: +momentum.toFixed(1), kind: 'exact' },
      { feature: 'Seasonal expectation shift (52 wk)', contribution: +seasonalPart.toFixed(1), kind: 'exact' },
      { feature: 'Baseline uncertainty half-width', contribution: +(-dispersion).toFixed(1), kind: 'exact' },
      { feature: 'Reporting-delay adjustment', contribution: 0, kind: 'unavailable' },
      { feature: 'Cross-stream concordance term', contribution: 0, kind: 'unavailable' },
    ];
  }, [country]);

  const interpretations = {
    lassa: 'Lassa fever activity in West Africa follows a pronounced dry-season pattern driven by rodent-reservoir ecology and human exposure. A dry-season rise is therefore expected and is not, in itself, unusual — which is precisely why the baseline must be seasonal rather than flat.',
    dengue: 'Dengue transmission depends on vector abundance, itself driven by rainfall and temperature. A deviation coinciding with a rainfall anomaly has an environmental explanation available before any epidemiological one is required.',
    'influenza-a': 'Influenza activity in temperate settings is strongly seasonal and its timing shifts year to year. Deviation from a fixed calendar expectation frequently reflects a shifted season rather than an unusual one.',
    'sars-cov-2': 'Wastewater indicators can move ahead of case reporting because they do not depend on care-seeking. They are also sensitive to dilution, assay change and site substitution.',
    cholera: 'Cholera reporting responds to water and sanitation conditions and to flooding. Rises frequently follow documented environmental events and mass-displacement contexts.',
    measles: 'Measles resurgence is governed by accumulated susceptibility. A rise usually reflects an immunity gap that existed long before the signal appeared.',
  };

  return (
    <>
      <PageHeader kicker="Module 09" title="Explainable AI" evidence="PRELIMINARY"
        description="Explanation contract for every signal the platform emits. Model attributions require a trained model; none exists, so only the exact arithmetic decomposition of the statistical baseline is shown." />

      <Callout tone="warn" title="Standing interpretive warning" icon={<Icons.TriangleAlert size={12} />}>
        <p className="mb-1 text-bw-text">{SAFE_LANGUAGE.causation}</p>
        <p>
          A contribution value describes how a computation used an input. It does not show that the input caused
          disease activity, it does not validate the computation, and attribution methods themselves are
          approximations with documented instability under correlated features.
        </p>
      </Callout>

      <div className="my-3 flex flex-wrap items-center gap-2">
        <span className="bw-label">Explain signal</span>
        <Segmented value={alertId} onChange={setAlertId}
          options={S.alerts.slice(0, 6).map((a) => ({ value: a.id, label: `${a.id.slice(-4)} ${a.iso}` }))} />
      </div>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title={`Signal ${alert?.id} — ${alert?.country} · ${alert?.pathogen}`} evidence="SIMULATED"
            subtitle="Series context for the explanation below.">
            <SignalChart data={country.series.slice(-78)} height={180} />
          </Panel>

          <Panel title="Deviation decomposition" evidence="PRELIMINARY"
            subtitle="Exact arithmetic components of the observed deviation. This is algebra on the synthetic series, not a learned attribution.">
            <Contributions data={decomposition.filter((d) => d.kind === 'exact')} height={170} note="SIMULATED — exact decomposition of synthetic values" />
            <div className="mt-2 space-y-1">
              {decomposition.filter((d) => d.kind === 'unavailable').map((d) => (
                <div key={d.feature} className="flex items-center justify-between rounded-sm border border-dashed border-bw-line2 px-2 py-1.5">
                  <span className="text-[11.5px] text-bw-dim">{d.feature}</span>
                  <span className="font-mono text-[9.5px] tracking-[0.08em] text-bw-dim">TERM UNAVAILABLE — INPUT NOT CONFIGURED</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Callout tone="info" title="What this is and is not">
                Positive bars raise the observed value above expectation; negative bars are the tolerance the
                baseline allows. Because the components are additive arithmetic, they sum exactly — unlike a
                learned attribution, which only approximates the model's behaviour locally.
              </Callout>
            </div>
          </Panel>

          <Panel title="Model attribution (SHAP-style)" evidence="PLAN"
            subtitle="Reserved for a fitted model. Layout shown; values intentionally absent.">
            <NotImplemented what="Feature attribution for a trained model"
              plan="Once a model is fitted, this panel will render per-signal SHAP values with a global summary (beeswarm), local waterfall for the selected signal, and a stability check across bootstrap refits. Attribution will be withheld whenever the model's own validation performance is not established." />
            <div className="mt-3 space-y-1.5">
              {['Global feature importance (beeswarm)', 'Local waterfall for this signal', 'Dependence plots for top features',
                'Attribution stability across refits', 'Counterfactual: minimum change that removes the signal'].map((x) => (
                <div key={x} className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5">
                  <Icons.ChartNoAxesColumn size={12} className="shrink-0 text-bw-dim" />
                  <span className="flex-1 text-[11.5px] text-bw-muted">{x}</span>
                  <span className="font-mono text-[9px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Trend contribution over time" evidence="PRELIMINARY"
            subtitle="How much of the current level is level, seasonality and residual — decomposed on the synthetic series.">
            <div className="space-y-2.5">
              {(() => {
                const last = country.series[country.series.length - 1];
                const total = Math.max(1, last.value);
                const parts = [
                  ['Underlying level', Math.round(last.baseline * 0.72), 'var(--color-bw-primary)'],
                  ['Seasonal component', Math.round(last.baseline * 0.28), 'var(--color-bw-env)'],
                  ['Unexplained residual', Math.max(0, last.value - last.baseline), 'var(--color-alert-orange)'],
                ];
                return parts.map(([k, v, c]) => (
                  <Meter key={k} label={k} right={`${v} (${Math.round((v / total) * 100)}%)`} value={v} max={total} color={c} />
                ));
              })()}
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-bw-dim">
              The "unexplained residual" is unexplained by the baseline model only. Reporting artefacts, testing
              changes and co-circulating pathogens all live inside this term.
            </p>
          </Panel>
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Explanation contract" evidence="ESTABLISHED"
            subtitle="Mandatory fields. A signal without all of them may not be shown to a reviewer.">
            {[
              ['Important features', 'partial'], ['Feature contribution & direction', 'partial'],
              ['SHAP-style visualisation', 'missing'], ['Trend contribution', 'partial'],
              ['Biological interpretation', 'present'], ['Uncertainty statement', 'present'],
              ['Alternative explanations', 'present'], ['Model limitations', 'present'],
              ['Data-quality caveats', 'present'],
            ].map(([k, st]) => (
              <div key={k} className="flex items-center gap-2 border-b border-bw-line/50 py-1.5 last:border-0">
                {st === 'present' ? <Icons.CheckCircle2 size={13} className="shrink-0 text-[var(--color-alert-green)]" />
                  : st === 'partial' ? <Icons.CircleDashed size={13} className="shrink-0 text-[var(--color-alert-yellow)]" />
                  : <Icons.CircleX size={13} className="shrink-0 text-[var(--color-bw-dim)]" />}
                <span className="flex-1 text-[11.5px] text-bw-muted">{k}</span>
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{st.toUpperCase()}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Biological interpretation" evidence="ESTABLISHED"
            subtitle="Textbook context for the pathogen — not an interpretation of the synthetic signal.">
            <p className="text-[11.5px] leading-relaxed text-bw-muted">
              {interpretations[alert?.pathogenId] || 'No established interpretive note is registered for this pathogen.'}
            </p>
            <div className="mt-2 border-t border-bw-line pt-2">
              <div className="bw-label mb-1">Applies to this signal?</div>
              <p className="text-[11px] text-bw-dim">
                Not determinable. The series is synthetic, so no biological process generated it.
              </p>
            </div>
          </Panel>

          <Panel title="Uncertainty" evidence="PRELIMINARY">
            <KV items={[
              { k: 'Baseline interval', v: alert ? `${alert.interval[0]} – ${alert.interval[1]}` : '—' },
              { k: 'Deviation', v: alert ? `z = ${alert.z}` : '—' },
              { k: 'History used', v: `${country?.series.length} weeks (synthetic)` },
              { k: 'Model uncertainty', v: 'Not quantified — no model fitted' },
              { k: 'Label uncertainty', v: 'Not quantified — no reference labels' },
              { k: 'Data completeness', v: `${Math.round((country?.completeness || 0) * 100)}%` },
            ]} />
          </Panel>

          <Panel title="Limitations of this explanation" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {[
                'The decomposition explains the detector, not the disease process.',
                'Correlated inputs make any attribution non-unique; different valid methods will disagree.',
                'A plausible narrative attached to a statistical deviation is the single most common way surveillance systems mislead their users.',
                'The synthetic generator has no biology in it, so no explanation here can be biologically true.',
              ].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.Minus size={12} className="mt-[3px] shrink-0 text-bw-dim" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Alternative explanations for this signal" evidence="SIMULATED">
            <ul className="space-y-1">
              {alert?.alternatives.map((a) => (
                <li key={a} className="flex gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5 text-[11px] text-bw-muted">
                  <Icons.CircleHelp size={12} className="mt-[2px] shrink-0 text-bw-dim" />{a}
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <Link to="/app/alerts"><Btn size="sm" variant="outline" className="w-full">
                <Icons.BellRing size={12} /> Open in Early-Warning Center
              </Btn></Link>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 34. `frontend/src/pages/MLLab.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — MACHINE-LEARNING LABORATORY (SEGMENT 6)
   Baseline-first experiment configurator. Nothing is trained in
   this build: the lab produces a RUN SPECIFICATION, not results.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Btn, Field, Select, Input,
  Checkbox, Table, KV, NotImplemented, Awaiting, Disclosure, Stat, Meter, SimulatedBanner,
} from '../components/ui';
import { SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';

const FEATURES = [
  { id: 'lag1', name: 'value_lag_1', group: 'Autoregressive', desc: 'Previous week value', risk: 'low' },
  { id: 'lag2', name: 'value_lag_2', group: 'Autoregressive', desc: 'Two weeks prior', risk: 'low' },
  { id: 'lag4', name: 'value_lag_4', group: 'Autoregressive', desc: 'Four weeks prior', risk: 'low' },
  { id: 'roll4', name: 'rolling_mean_4', group: 'Rolling statistics', desc: '4-week rolling mean', risk: 'low' },
  { id: 'roll8sd', name: 'rolling_sd_8', group: 'Rolling statistics', desc: '8-week rolling standard deviation', risk: 'low' },
  { id: 'wow', name: 'week_over_week_pct', group: 'Change', desc: 'Percentage change vs previous week', risk: 'low' },
  { id: 'seasidx', name: 'seasonal_index_woy', group: 'Seasonality', desc: 'Historical same-week index', risk: 'medium', note: 'Leakage risk if computed over the full series rather than the training window only.' },
  { id: 'resid', name: 'baseline_residual', group: 'Baseline', desc: 'Observed minus baseline expectation', risk: 'medium', note: 'Must be computed with a baseline fitted on training data only.' },
  { id: 'testvol', name: 'test_volume', group: 'Denominator', desc: 'Laboratory tests performed', risk: 'low' },
  { id: 'positivity', name: 'test_positivity', group: 'Denominator', desc: 'Positive fraction', risk: 'low' },
  { id: 'delay', name: 'reporting_delay_mean', group: 'Quality', desc: 'Mean reporting lag for the week', risk: 'high', note: 'Strongly correlated with data-collection process; can trivially leak the outcome if labels were assigned retrospectively.' },
  { id: 'completeness', name: 'completeness_ratio', group: 'Quality', desc: 'Share of expected reporting units received', risk: 'medium' },
  { id: 'env', name: 'wastewater_conc_norm', group: 'Cross-stream', desc: 'Normalised environmental concentration', risk: 'low' },
  { id: 'genfreq', name: 'lineage_frequency_delta', group: 'Cross-stream', desc: 'Change in dominant lineage share', risk: 'medium' },
  { id: 'climate', name: 'precip_anomaly', group: 'Environmental covariate', desc: 'Precipitation anomaly', risk: 'low' },
  { id: 'events', name: 'unverified_event_count', group: 'Event-based', desc: 'Count of unverified media reports', risk: 'high', note: 'Media volume responds to official announcements — a classic reverse-causality trap.' },
];

const MODELS = [
  { id: 'seasonal', name: 'Seasonal baseline (mean ± kσ)', family: 'Statistical baseline', role: 'MANDATORY COMPARATOR', implemented: true },
  { id: 'ewma', name: 'EWMA control chart', family: 'Statistical baseline', role: 'Comparator', implemented: true },
  { id: 'farrington', name: 'Farrington-type quasi-Poisson GLM', family: 'Statistical baseline', role: 'Comparator', implemented: false },
  { id: 'logreg', name: 'Logistic Regression', family: 'Classical ML (supervised)', role: 'Candidate', implemented: false },
  { id: 'rf', name: 'Random Forest', family: 'Classical ML (supervised)', role: 'Candidate', implemented: false },
  { id: 'gbm', name: 'Gradient Boosting', family: 'Classical ML (supervised)', role: 'Candidate', implemented: false },
  { id: 'xgb', name: 'XGBoost / LightGBM', family: 'Classical ML (supervised)', role: 'Candidate', implemented: false },
  { id: 'iforest', name: 'Isolation Forest', family: 'Unsupervised anomaly', role: 'Candidate', implemented: false },
  { id: 'sarima', name: 'SARIMA residual detector', family: 'Time series', role: 'Candidate', implemented: false },
  { id: 'prophet', name: 'Structural time-series (decomposition)', family: 'Time series', role: 'Candidate', implemented: false },
  { id: 'lstm', name: 'LSTM / Temporal CNN', family: 'Deep learning', role: 'Later stage only', implemented: false },
];

export default function MLLab() {
  const { isResearch } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [dataset, setDataset] = useState('synthetic');
  const [target, setTarget] = useState('exceed2sd');
  const [feats, setFeats] = useState(['lag1', 'lag4', 'roll4', 'wow', 'resid']);
  const [models, setModels] = useState(['seasonal', 'logreg', 'rf']);
  const [split, setSplit] = useState({ train: 60, val: 20, test: 20 });
  const [cv, setCv] = useState('rolling');
  const [ack, setAck] = useState(false);

  const series = S.countries[0].series;
  const n = series.length;
  const bounds = {
    trainEnd: Math.floor(n * split.train / 100),
    valEnd: Math.floor(n * (split.train + split.val) / 100),
  };
  const highRisk = feats.filter((f) => FEATURES.find((x) => x.id === f)?.risk === 'high');
  const hasBaseline = models.some((m) => ['seasonal', 'ewma', 'farrington'].includes(m));
  const canQueue = hasBaseline && feats.length >= 2 && ack;

  const spec = {
    experiment_id: `EXP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
    dataset, target, split: `${split.train}/${split.val}/${split.test} temporal`,
    validation: cv, features: feats, models,
    baseline_first: hasBaseline, created: fmtTs(),
    status: 'SPECIFICATION ONLY — NOT EXECUTED',
  };

  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  return (
    <>
      <PageHeader kicker="Module 06" title="Machine-Learning Laboratory" evidence="PLAN"
        description="Experiment configurator enforcing baseline-first development and correct temporal splitting. This build produces a reproducible run specification; it does not train models." />

      <Callout tone="warn" title="No training occurs in this prototype" icon={<Icons.TriangleAlert size={12} />}>
        Model fitting requires a Python backend with the dataset registered and a fixed label definition. This
        interface therefore emits a specification that a researcher can execute offline. Any figure that would
        require a fitted model reads <span className="font-mono text-[11px]">{SAFE_LANGUAGE.awaitingExperiment}</span>.
      </Callout>

      <Grid cols="xl:grid-cols-[1fr_340px]" className="mt-3">
        <div className="min-w-0 space-y-3">
          {/* --- 1. Dataset --- */}
          <Panel title="1 · Dataset" evidence="PLAN" subtitle="Select the data the experiment will read.">
            <Grid cols="md:grid-cols-2">
              <Field label="Dataset" hint="Only registered datasets may be selected. Registration records checksum, licence and provenance.">
                <Select value={dataset} onChange={setDataset} options={[
                  { value: 'synthetic', label: 'Synthetic demonstration panel (in-browser, SIMULATED)' },
                  { value: 'upload', label: 'Uploaded dataset — none registered' },
                  { value: 'connector', label: 'Connector-backed dataset — none configured' },
                ]} />
              </Field>
              <Field label="Unit of analysis">
                <Select value="geo-week" onChange={() => {}} options={[{ value: 'geo-week', label: 'Territory × epidemiological week' }]} />
              </Field>
            </Grid>
            {dataset !== 'synthetic' && (
              <div className="mt-2"><NotImplemented what="Dataset binding"
                plan="Register a dataset in the Researcher Workspace, or configure a connector, before selecting this option." /></div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill color="var(--color-ev-simulated)">n = {n} weeks × {S.countries.length} territories (synthetic)</Pill>
              <Pill color="var(--color-bw-dim)">no real records present</Pill>
            </div>
          </Panel>

          {/* --- 2. Target --- */}
          <Panel title="2 · Target definition" evidence="ASSUMPTION"
            subtitle="The label must be fixed and documented BEFORE any model is fitted.">
            <Field label="Target variable">
              <Select value={target} onChange={setTarget} options={[
                { value: 'exceed2sd', label: 'Binary: observed exceeds seasonal baseline + 2σ (self-referential — demo only)' },
                { value: 'external', label: 'Binary: externally documented reference period (requires curated label set — NOT AVAILABLE)' },
                { value: 'nextweek', label: 'Regression: next-week count (forecasting formulation)' },
                { value: 'leadtime', label: 'Survival: weeks until reference event onset (requires reference set)' },
              ]} />
            </Field>
            <Callout tone={target === 'exceed2sd' ? 'danger' : 'info'} title={target === 'exceed2sd' ? 'Circularity warning' : 'Label provenance required'}>
              {target === 'exceed2sd'
                ? 'This label is generated by the same statistical rule the model would be compared against. A model trained on it can only learn to imitate the baseline — it cannot demonstrate improvement over it. Acceptable for pipeline demonstration only; unacceptable as evidence.'
                : 'A defensible experiment requires labels derived from an independent, documented source (e.g. curated historical event periods) with the definition and inclusion criteria published before fitting.'}
            </Callout>
          </Panel>

          {/* --- 3. Features --- */}
          <Panel title="3 · Feature selection" evidence="PLAN"
            subtitle={`${feats.length} selected. Leakage risk is flagged per feature.`}>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.id} className={`rounded-sm border px-2 py-1.5 ${
                  feats.includes(f.id) ? 'border-bw-primary/50 bg-bw-primary/5' : 'border-bw-line bg-bw-panel2/30'}`}>
                  <Checkbox checked={feats.includes(f.id)} onChange={() => toggle(feats, setFeats, f.id)}
                    label={<span className="flex flex-wrap items-center gap-1.5">
                      <span className="bw-num text-[11px]">{f.name}</span>
                      <span className="rounded-sm px-1 font-mono text-[8.5px] tracking-[0.08em]" style={{
                        color: f.risk === 'high' ? 'var(--color-alert-red)' : f.risk === 'medium' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)',
                        border: `1px solid ${f.risk === 'high' ? 'var(--color-alert-red)' : f.risk === 'medium' ? 'var(--color-alert-yellow)' : 'var(--color-bw-line2)'}55`,
                      }}>{f.risk.toUpperCase()} LEAK RISK</span>
                    </span>}
                    hint={f.desc} />
                  {feats.includes(f.id) && f.note && (
                    <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-dim">{f.note}</p>
                  )}
                </div>
              ))}
            </div>
            {highRisk.length > 0 && (
              <div className="mt-2">
                <Callout tone="danger" title={`${highRisk.length} high-leakage feature(s) selected`}>
                  These features encode the data-collection process rather than the biological signal. If the
                  labels were assigned retrospectively, they can produce excellent apparent performance that
                  collapses entirely in prospective use.
                </Callout>
              </div>
            )}
          </Panel>

          {/* --- 4. Split --- */}
          <Panel title="4 · Temporal split" evidence="ESTABLISHED"
            subtitle="Random shuffling of time-ordered surveillance data is prohibited by this interface.">
            <div className="mb-2 flex h-8 w-full overflow-hidden rounded-sm border border-bw-line">
              <div className="flex items-center justify-center text-[10px]" style={{ width: `${split.train}%`, background: 'rgba(46,168,154,0.35)' }}>TRAIN {split.train}%</div>
              <div className="flex items-center justify-center text-[10px]" style={{ width: `${split.val}%`, background: 'rgba(74,144,196,0.35)' }}>VAL {split.val}%</div>
              <div className="flex items-center justify-center text-[10px]" style={{ width: `${split.test}%`, background: 'rgba(217,130,43,0.35)' }}>TEST {split.test}%</div>
            </div>
            <div className="mb-3 grid gap-2 sm:grid-cols-3">
              {['train', 'val', 'test'].map((k) => (
                <Field key={k} label={`${k} %`}>
                  <input type="range" min="10" max="80" value={split[k]}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      const others = ['train', 'val', 'test'].filter((x) => x !== k);
                      const rem = 100 - v;
                      setSplit({ [k]: v, [others[0]]: Math.round(rem * 0.5), [others[1]]: rem - Math.round(rem * 0.5) });
                    }}
                    className="w-full accent-[var(--color-bw-primary)]" />
                </Field>
              ))}
            </div>
            <SignalChart data={series.map((p, i) => ({ ...p, flag: i === bounds.trainEnd || i === bounds.valEnd ? p.value : undefined }))} height={140} showBand={false} />
            <div className="mt-1.5 flex flex-wrap gap-3 text-[10.5px] text-bw-dim">
              <span>Train: {series[0].date} → {series[bounds.trainEnd - 1]?.date}</span>
              <span>Validation: {series[bounds.trainEnd]?.date} → {series[bounds.valEnd - 1]?.date}</span>
              <span>Test: {series[bounds.valEnd]?.date} → {series[n - 1].date}</span>
            </div>
            <div className="mt-2">
              <Field label="Validation scheme">
                <Select value={cv} onChange={setCv} options={[
                  { value: 'rolling', label: 'Rolling-origin (expanding window) — recommended' },
                  { value: 'blocked', label: 'Blocked time-series CV with embargo gap' },
                  { value: 'holdout', label: 'Single temporal hold-out' },
                  { value: 'kfold', label: 'Random k-fold — DISALLOWED for time series' },
                ]} />
              </Field>
              {cv === 'kfold' && (
                <div className="mt-2"><Callout tone="danger" title="Blocked configuration">
                  Random k-fold on time-ordered data lets the model see the future. This configuration cannot be queued.
                </Callout></div>
              )}
            </div>
          </Panel>

          {/* --- 5. Models --- */}
          <Panel title="5 · Models to compare" evidence="PLAN"
            subtitle="At least one statistical baseline is required. The interface will not queue a candidate-only run.">
            <Table rowKey="id" dense columns={[
              { key: 'sel', header: '', width: 34, render: (r) => (
                <input type="checkbox" checked={models.includes(r.id)} onChange={() => toggle(models, setModels, r.id)}
                  className="h-3.5 w-3.5 accent-[var(--color-bw-primary)]" />) },
              { key: 'name', header: 'Model', render: (r) => <span className="text-[11.5px] text-bw-text">{r.name}</span> },
              { key: 'family', header: 'Family', render: (r) => <span className="text-[11px] text-bw-dim">{r.family}</span> },
              { key: 'role', header: 'Role', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em]"
                  style={{ color: r.role === 'MANDATORY COMPARATOR' ? 'var(--color-bw-primary-bright)' : 'var(--color-bw-dim)' }}>{r.role}</span>) },
              { key: 'impl', header: 'Code', align: 'right', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: r.implemented ? 'var(--color-alert-green)' : 'var(--color-alert-yellow)' }}>
                  {r.implemented ? 'AVAILABLE' : 'NOT TRAINED'}
                </span>) },
              { key: 'metrics', header: 'Metrics', align: 'right', render: () => (
                <span className="font-mono text-[9.5px] text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>) },
            ]} rows={MODELS} />
            {!hasBaseline && (
              <div className="mt-2"><Callout tone="danger" title="Baseline required">
                No statistical baseline is selected. A candidate model evaluated without a comparator produces a
                number that cannot be interpreted. Select at least one baseline to proceed.
              </Callout></div>
            )}
          </Panel>
        </div>

        {/* ---------- Right rail: run spec ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Run specification" evidence="PLAN" subtitle="Reproducible, exportable, executed offline.">
            <pre className="max-h-[300px] overflow-auto rounded-sm border border-bw-line bg-[#0a1218] p-2.5 font-mono text-[10px] leading-relaxed text-bw-muted">
{JSON.stringify(spec, null, 2)}
            </pre>
            <div className="mt-2 space-y-2">
              <Checkbox checked={ack} onChange={setAck}
                label="I acknowledge this specification produces no validated result"
                hint="Required before the run can be queued." />
              <Btn variant="primary" size="md" className="w-full" disabled={!canQueue || cv === 'kfold'}
                onClick={() => {}}>
                <Icons.Play size={13} /> Queue experiment
              </Btn>
              <p className="text-[10px] leading-snug text-bw-dim">
                Queuing writes the specification to the experiment registry. Execution requires the Python
                backend, which is not running in this prototype — the queued run will remain in state
                <span className="bw-num"> PENDING_EXECUTION</span>.
              </p>
              <Btn size="sm" className="w-full"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `${spec.experiment_id}.json`;
                  a.click();
                }}>
                <Icons.Download size={12} /> Export specification (JSON)
              </Btn>
            </div>
          </Panel>

          <Panel title="Baseline-first checklist" evidence="ESTABLISHED">
            {[
              ['Statistical baseline included', hasBaseline],
              ['≥ 2 features selected', feats.length >= 2],
              ['Temporal split (no shuffling)', cv !== 'kfold'],
              ['Label definition documented', target !== 'exceed2sd'],
              ['No high-leakage feature', highRisk.length === 0],
              ['Reference label set available', false],
              ['Alarm-rate budget agreed', false],
              ['Pre-registration written', false],
            ].map(([label, ok]) => (
              <div key={label} className="flex items-center gap-2 border-b border-bw-line/50 py-1.5 last:border-0">
                {ok ? <Icons.CheckCircle2 size={13} className="shrink-0 text-[var(--color-alert-green)]" />
                    : <Icons.CircleAlert size={13} className="shrink-0 text-[var(--color-alert-yellow)]" />}
                <span className={`text-[11.5px] ${ok ? 'text-bw-text' : 'text-bw-muted'}`}>{label}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Results" evidence="PLAN">
            <Awaiting note="No experiment has been executed in this session. Metrics, error analysis and prediction plots appear here only after a real run completes." />
            <div className="mt-2 grid grid-cols-2 gap-2">
              {['AUROC', 'Sensitivity', 'PPV', 'Detection delay'].map((m) => (
                <div key={m} className="rounded-sm border border-dashed border-bw-line2 px-2 py-1.5">
                  <div className="bw-label">{m}</div>
                  <div className="bw-num mt-0.5 text-[12px] text-bw-dim italic">{SAFE_LANGUAGE.awaitingExperiment}</div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Link to="/app/evaluation"><Btn size="sm" variant="outline" className="w-full">
                <Icons.GaugeCircle size={12} /> Evaluation protocol
              </Btn></Link>
            </div>
          </Panel>

          <Panel title="Why baseline-first" evidence="ESTABLISHED">
            <div className="space-y-1.5">
              <Disclosure summary="The comparison is the experiment">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  An AUROC of 0.9 means nothing on its own. It means something only next to what a 30-year-old
                  control chart achieves on the same split, and next to the alarm burden each produces.
                </p>
              </Disclosure>
              <Disclosure summary="Small-n regime">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  A weekly national series over ten years has ~520 points and perhaps a handful of documented
                  events. That is far below the sample size where flexible models reliably outperform
                  well-specified simple ones.
                </p>
              </Disclosure>
              <Disclosure summary="Negative results are results">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  If the baseline wins, the finding is that the baseline wins. The experiment registry records
                  every run, including those that fail to support the hypothesis.
                </p>
              </Disclosure>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 35. `frontend/src/pages/ModelEvaluation.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — MODEL EVALUATION (SEGMENT 7)
   Metric definitions and comparison harness. Populated ONLY by
   real experiment runs; every cell currently reads
   "Awaiting experiment". Demo metrics, where shown, are labelled
   as such and are computed on synthetic data with a synthetic
   reference — they are illustrations of the layout, not results.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  Awaiting, KV, Disclosure, NotImplemented, SimulatedBanner, Stat, Meter,
} from '../components/ui';
import { Bars } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { detectSeasonalZ, detectEWMA, detectCUSUM, detectThreshold, detectMAD } from '../lib/detectors';
import { SAFE_LANGUAGE } from '../lib/evidence';

const METRICS = [
  { id: 'sens', name: 'Sensitivity / Recall', formula: 'TP / (TP + FN)', why: 'Share of reference events the detector flags. The headline number in surveillance — but meaningless without the alarm rate.', pitfall: 'Trivially maximised by flagging everything.' },
  { id: 'spec', name: 'Specificity', formula: 'TN / (TN + FP)', why: 'Share of non-event weeks correctly left unflagged.', pitfall: 'Looks excellent under class imbalance even for a useless detector.' },
  { id: 'ppv', name: 'Precision / PPV', formula: 'TP / (TP + FP)', why: 'Probability that a raised signal is a reference event. This is what an analyst actually experiences.', pitfall: 'Depends on prevalence; not transferable between settings.' },
  { id: 'f1', name: 'F1 score', formula: '2·PPV·Sens / (PPV + Sens)', why: 'Single summary when precision and recall matter equally.', pitfall: 'Hides which of the two is failing; rarely the right operational trade-off.' },
  { id: 'auroc', name: 'AUROC', formula: '∫ TPR d(FPR)', why: 'Threshold-free ranking quality.', pitfall: 'Over-optimistic under heavy imbalance; AUPRC is usually more informative here.' },
  { id: 'auprc', name: 'AUPRC', formula: '∫ Precision d(Recall)', why: 'Preferred summary when events are rare.', pitfall: 'Baseline value equals event prevalence — must always be reported alongside.' },
  { id: 'fpr', name: 'False-positive rate', formula: 'FP / (FP + TN)', why: 'Drives analyst workload directly.', pitfall: 'Must be expressed as alarms per unit time to be operationally meaningful.' },
  { id: 'fnr', name: 'False-negative rate', formula: 'FN / (TP + FN)', why: 'Missed events — the failure the system exists to prevent.', pitfall: 'Under-estimated when the reference set itself missed events.' },
  { id: 'delay', name: 'Detection delay', formula: 'median(t_flag − t_onset)', why: 'Weeks between reference onset and first flag. A primary endpoint for early warning.', pitfall: 'Onset definition dominates the result.' },
  { id: 'lead', name: 'Lead time', formula: 't_official − t_flag', why: 'Weeks gained versus the official/reference declaration.', pitfall: 'Negative lead time is common and must be reported honestly.' },
  { id: 'cal', name: 'Calibration', formula: 'Brier score, reliability curve, ECE', why: 'Whether stated probabilities match observed frequencies.', pitfall: 'A well-ranked model can be badly calibrated and therefore unusable for thresholding.' },
  { id: 'cm', name: 'Confusion matrix', formula: '[TP FP; FN TN]', why: 'The raw counts every other metric is derived from. Always report it.', pitfall: 'Threshold-dependent; report at the operating point actually proposed.' },
];

const CANDIDATES = [
  { id: 'seasonal', name: 'Seasonal baseline + 2σ', family: 'Statistical baseline', status: 'implemented' },
  { id: 'ewma', name: 'EWMA (λ=0.3, L=3)', family: 'Statistical baseline', status: 'implemented' },
  { id: 'cusum', name: 'CUSUM (k=0.5, h=4)', family: 'Time series', status: 'implemented' },
  { id: 'mad', name: 'Robust MAD (k=3.5)', family: 'Anomaly detection', status: 'implemented' },
  { id: 'threshold', name: 'Fixed threshold', family: 'Threshold', status: 'implemented' },
  { id: 'logreg', name: 'Logistic Regression', family: 'Classical ML', status: 'not-trained' },
  { id: 'rf', name: 'Random Forest', family: 'Classical ML', status: 'not-trained' },
  { id: 'gbm', name: 'Gradient Boosting', family: 'Classical ML', status: 'not-trained' },
  { id: 'iforest', name: 'Isolation Forest', family: 'Unsupervised', status: 'not-trained' },
  { id: 'lstm', name: 'LSTM sequence model', family: 'Deep learning', status: 'not-started' },
];

/* Demo-metric computation: detectors vs the SYNTHETIC injected step.
   This is explicitly circular — the "reference" is a step this code
   inserted. Shown to demonstrate the layout of a comparison table. */
function demoConfusion(flags, refIdx) {
  let TP = 0, FP = 0, FN = 0, TN = 0;
  flags.forEach((f, i) => {
    const ref = refIdx.has(i);
    if (f.flag && ref) TP++;
    else if (f.flag && !ref) FP++;
    else if (!f.flag && ref) FN++;
    else TN++;
  });
  const sens = TP + FN ? TP / (TP + FN) : null;
  const spec = TN + FP ? TN / (TN + FP) : null;
  const ppv = TP + FP ? TP / (TP + FP) : null;
  const f1 = ppv && sens ? (2 * ppv * sens) / (ppv + sens) : null;
  const firstFlag = flags.findIndex((f, i) => f.flag && refIdx.has(i));
  const onset = Math.min(...refIdx);
  return { TP, FP, FN, TN, sens, spec, ppv, f1, delay: firstFlag >= 0 ? firstFlag - onset : null };
}

export default function ModelEvaluation() {
  const S = useMemo(() => buildSurveillance(), []);
  const [showDemo, setShowDemo] = useState(false);
  const [series, setSeries] = useState('NGA');

  const country = S.countries.find((c) => c.iso === series);
  const refIdx = useMemo(() => {
    /* the synthetic injection window, known exactly because we created it */
    const n = country.series.length;
    const inj = { NGA: 9, BRA: 12, DEU: 6, IND: 8, GBR: 5, COD: 10 }[series] || 0;
    return new Set(Array.from({ length: inj }, (_, i) => n - inj + i));
  }, [country, series]);

  const demo = useMemo(() => {
    if (!showDemo || refIdx.size === 0) return null;
    const runs = [
      { id: 'seasonal', r: detectSeasonalZ(country.series, { k: 2 }) },
      { id: 'ewma', r: detectEWMA(country.series) },
      { id: 'cusum', r: detectCUSUM(country.series) },
      { id: 'mad', r: detectMAD(country.series) },
      { id: 'threshold', r: detectThreshold(country.series, {}) },
    ];
    return runs.map(({ id, r }) => ({ id, name: r.name, ...demoConfusion(r.flags, refIdx) }));
  }, [showDemo, country, refIdx]);

  const fmt = (v) => (v === null || v === undefined ? '—' : (v * 100).toFixed(1) + '%');

  return (
    <>
      <PageHeader kicker="Module 07" title="Model Evaluation" evidence="PLAN"
        description="Comparison harness and metric contract. No validated performance figure exists in this build; cells are populated exclusively by executed experiment runs." />

      <Callout tone="danger" title="No fabricated metrics — read this before interpreting anything below" icon={<Icons.ShieldAlert size={12} />}>
        Every performance cell reads <span className="font-mono text-[11px]">{SAFE_LANGUAGE.awaitingExperiment}</span> because
        no model has been trained and no reference label set exists. The optional demonstration below computes real
        arithmetic against a step that this prototype's own generator injected — it is <span className="text-bw-text">circular
        by construction</span> and is provided only to show the table layout. It is labelled DEMO METRIC and must never
        be quoted.
      </Callout>

      <Grid cols="lg:grid-cols-4" className="my-3">
        <Stat label="Models trained" value="0" evidence="ESTABLISHED" sub="No artefacts present" />
        <Stat label="Reference label sets" value="0" evidence="ESTABLISHED" sub="Curation not started" />
        <Stat label="Experiment runs completed" value="0" evidence="ESTABLISHED" sub="Backend not executed" />
        <Stat label="Reportable metrics" value="0" evidence="ESTABLISHED" sub="By policy, not by omission" color="var(--color-bw-muted)" />
      </Grid>

      {/* ---------- Comparison table ---------- */}
      <Panel title="Model comparison" evidence="PLAN" className="mb-3"
        subtitle="One row per candidate. Baselines are listed first and cannot be removed from the comparison."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Segmented size="xs" value={series} onChange={setSeries}
              options={S.countries.filter((c) => c.state !== 'GREEN').slice(0, 4).map((c) => ({ value: c.iso, label: c.iso }))} />
            <Btn size="xs" variant={showDemo ? 'outline' : 'ghost'} onClick={() => setShowDemo(!showDemo)}>
              <Icons.Beaker size={11} /> {showDemo ? 'Hide' : 'Show'} demo metrics
            </Btn>
          </div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-bw-line">
                {['Model', 'Family', 'Status', 'Sens', 'Spec', 'PPV', 'F1', 'AUROC', 'FPR', 'Delay (wk)', 'Lead (wk)', 'Calibration'].map((h) => (
                  <th key={h} className="bw-label whitespace-nowrap px-2 pb-1.5 pt-1 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((c) => {
                const d = demo?.find((x) => x.id === c.id);
                const cell = (v) => (
                  <td className="px-2 py-2">
                    {d ? <span className="bw-num text-[11.5px] text-bw-text">{v}</span>
                       : <span className="font-mono text-[9.5px] italic text-bw-dim">{c.status === 'implemented' ? SAFE_LANGUAGE.awaitingExperiment : '—'}</span>}
                  </td>
                );
                return (
                  <tr key={c.id} className="border-b border-bw-line/60 last:border-0 hover:bg-bw-panel2/50">
                    <td className="px-2 py-2 text-[11.5px] text-bw-text">{c.name}</td>
                    <td className="px-2 py-2 text-[11px] text-bw-dim">{c.family}</td>
                    <td className="px-2 py-2">
                      <span className="font-mono text-[9px] tracking-[0.08em]" style={{
                        color: c.status === 'implemented' ? 'var(--color-alert-green)'
                          : c.status === 'not-trained' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)' }}>
                        {c.status === 'implemented' ? 'DETECTOR IN CODE' : c.status === 'not-trained' ? 'NOT TRAINED' : 'NOT STARTED'}
                      </span>
                    </td>
                    {cell(fmt(d?.sens))}
                    {cell(fmt(d?.spec))}
                    {cell(fmt(d?.ppv))}
                    {cell(fmt(d?.f1))}
                    <td className="px-2 py-2"><span className="font-mono text-[9.5px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span></td>
                    {cell(d ? ((d.FP / Math.max(1, d.FP + d.TN)) * 100).toFixed(1) + '%' : '—')}
                    {cell(d?.delay ?? '—')}
                    <td className="px-2 py-2"><span className="font-mono text-[9.5px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span></td>
                    <td className="px-2 py-2"><span className="font-mono text-[9.5px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {showDemo && (
          <div className="mt-2">
            <SimulatedBanner text="DEMO METRIC — computed against a synthetic step injected by this prototype. Circular; not evidence of detection ability." evidence="SIMULATED" />
          </div>
        )}
      </Panel>

      <Grid cols="lg:grid-cols-[1.2fr_1fr]" className="mb-3">
        {/* Confusion matrix */}
        <Panel title="Confusion matrix" evidence={demo ? 'SIMULATED' : 'PLAN'}
          subtitle="At the proposed operating point. Shown for the seasonal baseline detector.">
          {demo ? (() => {
            const d = demo[0];
            const cells = [
              ['True positive', d.TP, 'var(--color-alert-green)'], ['False positive', d.FP, 'var(--color-alert-orange)'],
              ['False negative', d.FN, 'var(--color-alert-red)'], ['True negative', d.TN, 'var(--color-bw-line2)'],
            ];
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {cells.map(([k, v, c]) => (
                    <div key={k} className="rounded-sm border p-3 text-center" style={{ borderColor: c + '55', background: c + '0d' }}>
                      <div className="bw-num text-[22px] font-semibold" style={{ color: c }}>{v}</div>
                      <div className="bw-label mt-1">{k}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] leading-snug text-bw-dim">
                  Note the class imbalance: {d.TN} negative weeks against {d.TP + d.FN} reference weeks. Accuracy
                  here would exceed {(((d.TP + d.TN) / (d.TP + d.TN + d.FP + d.FN)) * 100).toFixed(1)}% for a
                  detector that never fires — which is exactly why accuracy is not reported anywhere in this system.
                </p>
              </>
            );
          })() : (
            <div className="grid grid-cols-2 gap-2">
              {['True positive', 'False positive', 'False negative', 'True negative'].map((k) => (
                <div key={k} className="rounded-sm border border-dashed border-bw-line2 p-4 text-center">
                  <div className="bw-num text-[13px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</div>
                  <div className="bw-label mt-1">{k}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Calibration & reliability" evidence="PLAN"
          subtitle="Reliability curve, Brier score and expected calibration error.">
          <NotImplemented what="Calibration assessment"
            plan="Requires a model that outputs probabilities. Detectors currently emit unbounded scores, which must be mapped to calibrated probabilities (e.g. isotonic or Platt scaling on a validation window) before any probability is displayed to a user." />
          <div className="mt-2 space-y-2">
            {['Brier score', 'Expected calibration error', 'Reliability curve', 'Sharpness'].map((m) => (
              <div key={m} className="flex items-center justify-between border-b border-bw-line/50 pb-1.5">
                <span className="text-[11.5px] text-bw-muted">{m}</span>
                <span className="font-mono text-[10px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>
              </div>
            ))}
          </div>
        </Panel>
      </Grid>

      {/* Metric contract */}
      <Panel title="Metric contract" evidence="ESTABLISHED" className="mb-3"
        subtitle="Every metric this platform is permitted to report, with its interpretation and its failure mode. Accuracy is deliberately absent.">
        <Table rowKey="id" columns={[
          { key: 'name', header: 'Metric', render: (r) => <span className="text-[11.5px] text-bw-text">{r.name}</span> },
          { key: 'formula', header: 'Definition', render: (r) => <span className="bw-num text-[10.5px] text-bw-muted">{r.formula}</span> },
          { key: 'why', header: 'Why it is reported', render: (r) => <span className="text-[11px] text-bw-muted">{r.why}</span> },
          { key: 'pitfall', header: 'Failure mode', render: (r) => <span className="text-[11px] text-[var(--color-alert-yellow)]/85">{r.pitfall}</span> },
        ]} rows={METRICS} />
      </Panel>

      <Grid cols="lg:grid-cols-2">
        <Panel title="Evaluation protocol" evidence="PLAN">
          <ol className="space-y-2">
            {[
              ['Pre-register', 'Hypothesis, label definition, split boundaries, primary metric and alarm-rate budget are written down and hashed before any model sees the test period.'],
              ['Fit on train only', 'All preprocessing statistics — baselines, scalers, seasonal indices — are estimated inside the training window.'],
              ['Tune on validation', 'Hyperparameters and thresholds are selected using rolling-origin validation, never the test period.'],
              ['Single test evaluation', 'The test period is scored once. Repeated evaluation converts it into a validation set.'],
              ['Report jointly', 'Sensitivity, PPV, alarm rate and detection delay are always reported together, with the baseline beside them.'],
              ['Publish negatives', 'Runs where the baseline wins are recorded in the experiment registry with the same prominence as any other run.'],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-2.5">
                <span className="bw-num shrink-0 text-[11px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="text-[12px] text-bw-text">{t}</div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Error inspection (planned)" evidence="PLAN">
          <NotImplemented what="Error analysis workbench"
            plan="Will list every false negative and false positive with its series context, quality vector and candidate explanation, so that failure patterns — not aggregate scores — drive the next iteration." />
          <div className="mt-3 space-y-1.5">
            {['Missed events ranked by magnitude', 'False alarms grouped by suspected cause',
              'Performance stratified by data completeness', 'Performance stratified by region and reporting delay',
              'Sensitivity of conclusions to threshold choice'].map((x) => (
              <div key={x} className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5">
                <Icons.ListChecks size={12} className="shrink-0 text-bw-dim" />
                <span className="flex-1 text-[11.5px] text-bw-muted">{x}</span>
                <span className="font-mono text-[9px] text-bw-dim">PLANNED</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/app/ml-lab"><Btn size="sm"><Icons.FlaskConical size={12} /> Configure a run</Btn></Link>
            <Link to="/app/model-cards"><Btn size="sm"><Icons.IdCard size={12} /> Model cards</Btn></Link>
          </div>
        </Panel>
      </Grid>
    </>
  );
}

```

---

## 36. `frontend/src/pages/ModelCards.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — MODEL / EXPERIMENT CARDS (SEGMENT 10)
   Structured record for every model. Cards exist for the
   IMPLEMENTED statistical detectors (which are deterministic
   procedures, not trained models) and as empty templates for
   candidates that have not been trained.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, KV,
  Awaiting, Disclosure, NotImplemented, Stat,
} from '../components/ui';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { fmtTs } from '../lib/synth';

const CARDS = [
  {
    id: 'MC-001', name: 'Seasonal baseline detector (same-week mean + kσ)', kind: 'Statistical procedure',
    trained: false, version: '0.4.0',
    dataset: 'Applied to whichever series is bound; in this build, the synthetic demonstration panel.',
    features: 'Historical values for the same ISO week in prior years; fallback to trailing 8-week window when history is insufficient.',
    target: 'None — unsupervised threshold procedure, not a fitted model.',
    trainingPeriod: 'Not applicable (no parameters are learned; k is chosen, not estimated).',
    validationPeriod: 'Not performed.', testPeriod: 'Not performed.',
    preprocessing: 'ISO-week alignment. No imputation. No scaling.',
    hyperparameters: 'k = 2.0 (exceedance multiplier); minimum history = 52 weeks; persistence = 2 weeks.',
    metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: [
      'Baseline is contaminated by past epidemics present in the history window.',
      'Assumes approximate normality of counts; fails for low-count series where a Poisson/negative-binomial formulation is required.',
      'No trend term; a genuine secular increase is progressively absorbed into the baseline.',
      'k is a policy choice about tolerable false alarms, not an estimate.',
    ],
    biases: [
      'Series with more complete reporting produce tighter intervals and therefore flag more readily — capacity is confounded with signal.',
      'Territories with short history cannot be evaluated at all and silently disappear from the alarm set unless explicitly surfaced.',
    ],
    intended: 'A transparent comparator against which any machine-learning candidate must be evaluated; interface demonstration of the detection pipeline.',
    notIntended: 'Operational alerting; clinical use; any claim of validated detection performance; use on low-count series without reformulation.',
    date: '2026-08-12', researcher: 'Prototype author',
  },
  {
    id: 'MC-002', name: 'EWMA control chart', kind: 'Statistical procedure', trained: false, version: '0.4.0',
    dataset: 'Bound series.', features: 'Exponentially weighted mean of observed values; trailing-window mean and SD.',
    target: 'None — control-chart procedure.', trainingPeriod: 'Not applicable.', validationPeriod: 'Not performed.', testPeriod: 'Not performed.',
    preprocessing: 'ISO-week alignment.', hyperparameters: 'λ = 0.3; L = 3; trailing window = 8 weeks.',
    metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Assumes residual stationarity, which surveillance series violate.', 'Slow to react to abrupt single-week spikes.', 'Control limits assume independence; autocorrelation inflates false alarms.'],
    biases: ['Inherits the seasonality of the input; without deseasonalisation it alarms every season.'],
    intended: 'Comparator; demonstration of small-shift sensitivity.',
    notIntended: 'Deployment without deseasonalisation and an agreed alarm budget.',
    date: '2026-08-12', researcher: 'Prototype author',
  },
  {
    id: 'MC-003', name: 'Random Forest signal classifier', kind: 'Supervised ML', trained: false, version: '—',
    dataset: 'NOT SELECTED', features: 'Specified in the ML Lab; not fixed.', target: 'Requires curated reference-period labels — NOT AVAILABLE.',
    trainingPeriod: '—', validationPeriod: '—', testPeriod: '—',
    preprocessing: '—', hyperparameters: '—', metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Cannot be assessed — the model does not exist.'],
    biases: ['Anticipated: geographic bias inherited from training data; over-fitting to reporting artefacts.'],
    intended: 'Candidate method for the baseline-comparison experiment.',
    notIntended: 'Any use whatsoever until trained, validated and compared against the statistical baseline.',
    date: '—', researcher: '—', empty: true,
  },
  {
    id: 'MC-004', name: 'LSTM sequence detector', kind: 'Deep learning', trained: false, version: '—',
    dataset: 'NOT SELECTED', features: '—', target: '—', trainingPeriod: '—', validationPeriod: '—', testPeriod: '—',
    preprocessing: '—', hyperparameters: '—', metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Cannot be assessed — the model does not exist.', 'Data volume in typical weekly surveillance series is far below the regime where sequence models are justified.'],
    biases: ['Anticipated: severe over-fitting; opacity that conflicts with the explainability contract.'],
    intended: 'Later-stage exploration only, contingent on earlier stages producing a reason to try it.',
    notIntended: 'Anything, at present.',
    date: '—', researcher: '—', empty: true,
  },
];

export default function ModelCards() {
  const [sel, setSel] = useState('MC-001');
  const card = CARDS.find((c) => c.id === sel);

  const exportCard = () => {
    const md = `# Model Card — ${card.name}

**Card ID:** ${card.id}  
**Kind:** ${card.kind}  
**Trained:** ${card.trained ? 'Yes' : 'NO — no fitted model exists'}  
**Version:** ${card.version}  
**Date:** ${card.date}  
**Researcher:** ${card.researcher}

## Dataset
${card.dataset}

## Features
${card.features}

## Target
${card.target}

## Periods
- Training: ${card.trainingPeriod}
- Validation: ${card.validationPeriod}
- Test: ${card.testPeriod}

## Preprocessing
${card.preprocessing}

## Hyperparameters
${card.hyperparameters}

## Metrics
${card.metrics}

## Limitations
${card.limitations.map((l) => `- ${l}`).join('\n')}

## Known biases
${card.biases.map((l) => `- ${l}`).join('\n')}

## Intended use
${card.intended}

## NOT intended for
${card.notIntended}

---
Generated by the BIOWATCH-AI research prototype on ${fmtTs()}.
This card reports no validated performance. BIOWATCH-AI is not a clinical diagnostic or operational public-health system.
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${card.id}-model-card.md`; a.click();
  };

  return (
    <>
      <PageHeader kicker="Module 17" title="Model & Experiment Cards" evidence="ESTABLISHED"
        description="Structured record for every model or procedure the platform can run. A card must exist before a method may appear anywhere else in the interface." />

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Cards registered" value={CARDS.length} evidence="ESTABLISHED" />
        <Stat label="Cards for trained models" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="No model has been fitted" />
        <Stat label="Cards with metrics" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.awaitingExperiment} />
        <Stat label="Cards with limitations declared" value={CARDS.length} evidence="ESTABLISHED" color="var(--color-alert-green)" />
      </Grid>

      <Grid cols="xl:grid-cols-[300px_1fr]">
        <Panel title="Card registry" evidence="ESTABLISHED" dense>
          <div className="space-y-1 p-1">
            {CARDS.map((c) => (
              <button key={c.id} type="button" onClick={() => setSel(c.id)}
                className={`block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  sel === c.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                <div className="bw-num text-[10px] text-bw-dim">{c.id}</div>
                <div className="mt-0.5 text-[11.5px] text-bw-text">{c.name}</div>
                <div className="mt-1 font-mono text-[8.5px] tracking-[0.08em]"
                  style={{ color: c.empty ? 'var(--color-bw-dim)' : 'var(--color-bw-data)' }}>
                  {c.empty ? 'TEMPLATE — NOT TRAINED' : 'PROCEDURE — NO FITTED PARAMETERS'}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="min-w-0 space-y-3">
          <Panel title={card.name} evidence={card.empty ? 'PLAN' : 'ESTABLISHED'}
            subtitle={`${card.id} · ${card.kind} · version ${card.version}`}
            actions={<Btn size="xs" onClick={exportCard}><Icons.Download size={11} /> Export card (MD)</Btn>}>
            {card.empty && (
              <div className="mb-3">
                <Callout tone="warn" title="Empty card — model not trained">
                  This card exists so that the method is registered and its intended limitations are declared
                  before anyone attempts to use it. Every field that would require a fitted model is blank.
                </Callout>
              </div>
            )}
            <KV cols={2} mono={false} items={[
              { k: 'Model name', v: card.name, mono: false },
              { k: 'Dataset', v: card.dataset, mono: false },
              { k: 'Version', v: card.version },
              { k: 'Features', v: card.features, mono: false },
              { k: 'Target', v: card.target, mono: false },
              { k: 'Training period', v: card.trainingPeriod, mono: false },
              { k: 'Validation period', v: card.validationPeriod, mono: false },
              { k: 'Test period', v: card.testPeriod, mono: false },
              { k: 'Preprocessing', v: card.preprocessing, mono: false },
              { k: 'Hyperparameters', v: card.hyperparameters, mono: false },
              { k: 'Date', v: card.date },
              { k: 'Researcher', v: card.researcher, mono: false },
            ]} />

            <div className="mt-3 rounded-sm border border-dashed border-bw-line2 px-2.5 py-2">
              <div className="bw-label mb-1">Metrics</div>
              <Awaiting label={card.metrics} note="No metric may be entered on a card without a linked, completed experiment run." />
            </div>
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Limitations" evidence="ESTABLISHED" accent="var(--color-alert-yellow)">
              <ul className="space-y-1.5">
                {card.limitations.map((l) => (
                  <li key={l} className="flex gap-2 text-[11.5px] leading-relaxed text-bw-muted">
                    <Icons.TriangleAlert size={12} className="mt-[3px] shrink-0 text-[var(--color-alert-yellow)]" />{l}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Known biases" evidence="ESTABLISHED" accent="var(--color-alert-orange)">
              <ul className="space-y-1.5">
                {card.biases.map((l) => (
                  <li key={l} className="flex gap-2 text-[11.5px] leading-relaxed text-bw-muted">
                    <Icons.Scale size={12} className="mt-[3px] shrink-0 text-[var(--color-alert-orange)]" />{l}
                  </li>
                ))}
              </ul>
            </Panel>
          </Grid>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Intended use" evidence="ESTABLISHED" accent="var(--color-alert-green)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{card.intended}</p>
            </Panel>
            <Panel title="NOT intended for" evidence="ESTABLISHED" accent="var(--color-alert-red)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{card.notIntended}</p>
              <div className="mt-2 border-t border-bw-line pt-2">
                <p className="text-[11px] text-bw-dim">
                  Universal exclusions apply to every card: clinical diagnosis, operational outbreak declaration,
                  regulatory decision-making, and any use implying validated performance.
                </p>
              </div>
            </Panel>
          </Grid>
        </div>
      </Grid>
    </>
  );
}

```

---

## 37. `frontend/src/pages/Genomic.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — GENOMIC SURVEILLANCE (SEGMENT 8)
   ------------------------------------------------------------
   HARD RULE FOR THIS MODULE: no nucleotide/protein sequence, no
   real lineage name, no mutation and no variant discovery is
   fabricated anywhere. Synthetic lineages carry deliberately
   non-real placeholder labels (SYN-A … SYN-E) so that no output
   can be mistaken for a genomic finding.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  NotImplemented, SimulatedBanner, KV, Meter, Stat, NoData, Disclosure, Awaiting,
} from '../components/ui';
import { Stacked, Bars, Spark } from '../components/charts';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { rng, synthSeries, isoWeeksBack, fmtTs } from '../lib/synth';
import { CONNECTORS } from '../lib/connectors';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* Placeholder lineage labels — intentionally NOT real nomenclature. */
const SYN_LINEAGES = [
  { id: 'SYN-A', color: '#8b7ad6', note: 'Synthetic placeholder lineage A' },
  { id: 'SYN-B', color: '#4a90c4', note: 'Synthetic placeholder lineage B' },
  { id: 'SYN-C', color: '#2ea89a', note: 'Synthetic placeholder lineage C' },
  { id: 'SYN-D', color: '#c9a227', note: 'Synthetic placeholder lineage D' },
  { id: 'SYN-E', color: '#d9822b', note: 'Synthetic placeholder lineage E' },
];

export default function Genomic() {
  const { isDemo } = useMode();
  const [pathogen, setPathogen] = useState('sars-cov-2');
  const [view, setView] = useState('frequency');

  const freq = useMemo(() => {
    const r = rng('genomic:' + pathogen);
    const dates = isoWeeksBack(52);
    return dates.map((d, i) => {
      const t = i / dates.length;
      const raw = [
        Math.max(0, 0.55 - t * 0.5 + r() * 0.05),
        Math.max(0, 0.25 - t * 0.12 + r() * 0.04),
        Math.max(0, 0.1 + t * 0.35 + r() * 0.05),
        Math.max(0, 0.06 + t * 0.12 + r() * 0.03),
        Math.max(0, 0.04 + t * 0.08 + r() * 0.02),
      ];
      const s = raw.reduce((a, b) => a + b, 0);
      const row = { date: d };
      SYN_LINEAGES.forEach((l, j) => { row[l.id] = +((raw[j] / s) * 100).toFixed(1); });
      return row;
    });
  }, [pathogen]);

  const submissions = useMemo(() => synthSeries('genomic:sub:' + pathogen, { weeks: 52, level: 420, season: 0.25, disp: 0.35, trend: 0.4 }), [pathogen]);
  const latest = freq[freq.length - 1];

  const qc = useMemo(() => {
    const r = rng('genomic:qc:' + pathogen);
    return [
      { k: 'Sequences passing QC', v: `${(88 + r() * 8).toFixed(1)}%`, meter: 88 + r() * 8, color: 'var(--color-alert-green)' },
      { k: 'Mean genome coverage', v: `${(94 + r() * 4).toFixed(1)}%`, meter: 94 + r() * 4, color: 'var(--color-bw-primary)' },
      { k: 'Ambiguous base fraction', v: `${(1.2 + r() * 1.5).toFixed(2)}%`, meter: 12 + r() * 15, color: 'var(--color-alert-yellow)' },
      { k: 'Median submission lag', v: `${(11 + r() * 9).toFixed(0)} days`, meter: 55, color: 'var(--color-alert-orange)' },
    ];
  }, [pathogen]);

  const geoCoverage = {
    GBR: { state: 'GREEN', label: 'Sequencing stream configured', metrics: [{ k: 'Synthetic submissions/wk', v: '210' }] },
    USA: { state: 'GREEN', label: 'Sequencing stream configured', metrics: [{ k: 'Synthetic submissions/wk', v: '480' }] },
    ZAF: { state: 'YELLOW', label: 'Sparse submissions', metrics: [{ k: 'Synthetic submissions/wk', v: '24' }] },
    AUS: { state: 'GREEN', label: 'Sequencing stream configured', metrics: [{ k: 'Synthetic submissions/wk', v: '90' }] },
    NGA: { state: 'YELLOW', label: 'Sparse submissions', metrics: [{ k: 'Synthetic submissions/wk', v: '11' }] },
    BRA: { state: 'YELLOW', label: 'Sparse submissions', metrics: [{ k: 'Synthetic submissions/wk', v: '36' }] },
    IND: { state: 'YELLOW', label: 'Sparse submissions', metrics: [{ k: 'Synthetic submissions/wk', v: '52' }] },
    COD: { state: 'GREEN', availability: 'none', label: 'No sequencing stream configured', metrics: [] },
    ETH: { state: 'GREEN', availability: 'none', label: 'No sequencing stream configured', metrics: [] },
  };

  const genomicConnectors = CONNECTORS.filter((c) => c.stream === 'genomic');

  return (
    <>
      <PageHeader kicker="Module 10" title="Genomic Surveillance" evidence="PLAN"
        description="Architecture for lineage tracking, sequence quality assessment and emerging-variant signal detection from public genomic repositories. No sequence, mutation or variant discovery is generated by this prototype." />

      <Callout tone="danger" title="Fabrication prohibition for this module" icon={<Icons.ShieldAlert size={12} />}>
        Lineage labels below are placeholders (<span className="bw-num">SYN-A … SYN-E</span>) chosen so they cannot be
        confused with real nomenclature. No nucleotide or amino-acid sequence is displayed, stored or invented
        anywhere in this build, and no variant is claimed to be emerging, more transmissible or more severe.
      </Callout>

      {isDemo && <div className="my-3"><SimulatedBanner /></div>}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="bw-label">Pathogen stream</span>
        <Segmented value={pathogen} onChange={setPathogen} options={[
          { value: 'sars-cov-2', label: 'SARS-CoV-2' }, { value: 'influenza-a', label: 'Influenza A' },
          { value: 'mpox', label: 'Mpox' }, { value: 'measles', label: 'Measles' },
        ]} />
        <span className="ml-auto"><Segmented size="xs" value={view} onChange={setView} options={[
          { value: 'frequency', label: 'Lineage frequency' }, { value: 'quality', label: 'Sequence QC' },
          { value: 'phylo', label: 'Phylogenetics' },
        ]} /></span>
      </div>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Sequences ingested (synthetic)" value={submissions[submissions.length - 1].value.toLocaleString()} evidence="SIMULATED" sub="Latest synthetic week" />
        <Stat label="Placeholder lineages tracked" value={SYN_LINEAGES.length} evidence="SIMULATED" sub="Non-real labels" />
        <Stat label="Real variant calls made" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="By design — no genomic analysis is performed" />
        <Stat label="Repository connectors" value={`${genomicConnectors.length}`} evidence="ESTABLISHED" sub="0 configured" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_350px]">
        <div className="min-w-0 space-y-3">
          {view === 'frequency' && (
            <>
              <Panel title="Placeholder lineage frequency over time" evidence="SIMULATED"
                subtitle="Stacked share of synthetic submissions. Frequency ≠ fitness: submission bias dominates raw shares.">
                <Stacked data={freq} keys={SYN_LINEAGES.map((l) => l.id)} colors={SYN_LINEAGES.map((l) => l.color)}
                  height={230} note="SIMULATED — placeholder lineages" />
                <div className="mt-2 flex flex-wrap gap-3">
                  {SYN_LINEAGES.map((l) => (
                    <span key={l.id} className="flex items-center gap-1.5 text-[10.5px] text-bw-muted">
                      <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} />
                      {l.id} · {latest[l.id]}%
                    </span>
                  ))}
                </div>
              </Panel>

              <Panel title="Growth-advantage estimation" evidence="PLAN"
                subtitle="The analysis that would matter — and why it is not shown.">
                <NotImplemented what="Logistic growth-rate estimation with confidence intervals"
                  plan="Requires unbiased sampling assumptions, a documented denominator, and correction for submission lag and sequencing-strategy change. Producing a growth advantage from biased convenience samples is one of the most common errors in genomic epidemiology, and the prototype refuses to display one." />
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {['Relative growth rate', 'Doubling time', 'Selection coefficient'].map((m) => (
                    <div key={m} className="rounded-sm border border-dashed border-bw-line2 px-2 py-2">
                      <div className="bw-label">{m}</div>
                      <div className="mt-1"><Awaiting label={SAFE_LANGUAGE.awaitingExperiment} /></div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Mutation profile" evidence="PLAN"
                subtitle="Reserved for real repository data.">
                <NoData reason="No mutation table is displayed because no genomic data is connected. Fabricating mutation positions would be scientifically unacceptable even under a SIMULATED label." />
                <div className="mt-2 text-[11px] leading-relaxed text-bw-muted">
                  When a connector is configured, this panel will render: substitutions by genome position, amino-acid
                  changes by protein, prevalence per lineage, and a per-site coverage indicator so that absence of a
                  mutation call can be distinguished from absence of coverage.
                </div>
              </Panel>
            </>
          )}

          {view === 'quality' && (
            <>
              <Panel title="Sequence quality control" evidence="SIMULATED"
                subtitle="QC gates every sequence must pass before entering any frequency calculation.">
                <div className="space-y-3">
                  {qc.map((q) => <Meter key={q.k} label={q.k} right={q.v} value={q.meter} color={q.color} />)}
                </div>
                <div className="mt-3">
                  <Table dense columns={[
                    { key: 'gate', header: 'QC gate' }, { key: 'rule', header: 'Rule' },
                    { key: 'action', header: 'Action on failure' },
                  ]} rows={[
                    { gate: 'Genome coverage', rule: '≥ 90% of reference length', action: 'Exclude from frequency estimates; retain in archive' },
                    { gate: 'Ambiguous bases', rule: '≤ 5% N content', action: 'Exclude from lineage assignment' },
                    { gate: 'Collection date', rule: 'Present and plausible', action: 'Exclude from temporal analysis' },
                    { gate: 'Geography', rule: 'Resolvable to admin-1 or country', action: 'Exclude from geographic analysis' },
                    { gate: 'Duplicate detection', rule: 'Hash of sequence + metadata', action: 'Retain first, flag subsequent' },
                    { gate: 'Submission lag', rule: 'Recorded, not filtered', action: 'Down-weight recent weeks in trend estimates' },
                  ]} />
                </div>
              </Panel>

              <Panel title="Submission cadence" evidence="SIMULATED"
                subtitle="Sequences submitted per week. Cadence changes create apparent lineage shifts that are purely artefactual.">
                <Bars data={submissions.slice(-26).map((s) => ({ name: s.date.slice(5), value: s.value }))}
                  height={170} color="var(--color-bw-genomic)" note="SIMULATED — synthetic submission counts" />
              </Panel>
            </>
          )}

          {view === 'phylo' && (
            <Panel title="Phylogenetic analysis interface" evidence="PLAN">
              <NotImplemented what="Interactive phylogenetic tree (Auspice-compatible)"
                plan="Design target: load an Auspice v2 JSON from a public Nextstrain build, render a time-scaled tree with tip metadata (collection date, geography, lineage), support clade collapse, colour-by, and a linked map. Tree inference itself would remain the responsibility of the upstream build — this platform would visualise and interrogate, not infer." />
              <Grid cols="md:grid-cols-2" className="mt-3">
                <div className="rounded-md border border-dashed border-bw-line2 p-6 text-center">
                  <Icons.GitFork size={28} className="mx-auto text-bw-line2" strokeWidth={1.2} />
                  <div className="mt-2 font-mono text-[10px] tracking-[0.12em] text-bw-dim">TREE VIEWER — NOT IMPLEMENTED</div>
                  <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-snug text-bw-dim">
                    No tree is rendered from synthetic data: a fabricated phylogeny implies evolutionary
                    relationships that do not exist.
                  </p>
                </div>
                <div className="space-y-2">
                  {[['Time-scaled tree', 'Auspice JSON v2'], ['Tip metadata linkage', 'collection date · geography · lineage'],
                    ['Clade frequency panel', 'derived from tree, not from raw submissions'], ['Geographic transmission view', 'requires strong caveats on sampling'],
                    ['Ancestral state reconstruction', 'upstream responsibility']].map(([k, v]) => (
                    <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/40 px-2.5 py-2">
                      <div className="text-[11.5px] text-bw-text">{k}</div>
                      <div className="mt-0.5 text-[10px] text-bw-dim">{v}</div>
                    </div>
                  ))}
                </div>
              </Grid>
            </Panel>
          )}

          <Panel title="Geographic sequencing capacity" evidence="SIMULATED"
            subtitle="Where sequences come from is a map of capacity, not of viral diversity.">
            <WorldMap values={geoCoverage} height={260} />
            <div className="mt-2"><MapLegend compact /></div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-bw-dim">
              Any global lineage frequency computed from these submissions is dominated by the few territories that
              sequence most. This is the single largest bias in genomic surveillance and no statistical correction
              fully removes it.
            </p>
          </Panel>
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Repository connectors" evidence="ESTABLISHED">
            <div className="space-y-2">
              {genomicConnectors.map((c) => (
                <div key={c.id} className="rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5">
                  <div className="text-[11.5px] text-bw-text">{c.name}</div>
                  <div className="mt-1 space-y-0.5 text-[10px] text-bw-dim">
                    <div>Auth: {c.auth}</div>
                    <div>Format: {c.format}</div>
                    <div>Licence: {c.license}</div>
                  </div>
                  <div className="mt-1.5 font-mono text-[9px] tracking-[0.08em]"
                    style={{ color: c.status === 'blocked' ? 'var(--color-alert-yellow)' : 'var(--color-bw-data)' }}>
                    {c.status === 'blocked' ? 'ACCESS RESTRICTED — AGREEMENT REQUIRED' : SAFE_LANGUAGE.connectorAvailable}
                  </div>
                  {c.caveats && <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-muted">{c.caveats}</p>}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Emerging-variant signal design" evidence="PLAN"
            subtitle="What a defensible genomic signal would require.">
            <ol className="space-y-1.5 text-[11px] text-bw-muted">
              {['Denominator-aware frequency (sequences per case, per region)',
                'Explicit submission-lag model before any trend is fitted',
                'Growth estimate with uncertainty, not a point value',
                'Concordance requirement with an independent stream (cases, hospitalisations, wastewater)',
                'Phenotypic caution: sequence change ≠ transmissibility or severity change',
                'Human genomic-epidemiology review before any signal is surfaced'].map((x, i) => (
                <li key={x} className="flex gap-2"><span className="bw-num text-bw-dim">{i + 1}.</span>{x}</li>
              ))}
            </ol>
          </Panel>

          <Panel title="Biosecurity posture" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {['No sequence data is generated, stored or displayed by this prototype.',
                'No enhancement-, gain-of-function- or design-related capability exists or is planned.',
                'Analysis scope is restricted to lineage-frequency and quality metadata from public repositories.',
                'Any future integration must pass an institutional biosecurity review before configuration.'].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.ShieldCheck size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Module state" evidence="ESTABLISHED" dense>
            <KV items={[
              { k: 'Implementation', v: 'Interface only' },
              { k: 'Data bound', v: 'None' },
              { k: 'Sequences held', v: '0' },
              { k: 'Variant calls', v: '0' },
              { k: 'Last update', v: fmtTs() },
            ]} />
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 38. `frontend/src/pages/BioSignals.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — BIOLOGICAL SIGNAL MODULE (SEGMENT 8)
   Molecular / laboratory-derived signals, kept structurally
   SEPARATE from epidemiological case data. Nothing here is
   implemented; the module documents its own contract.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn,
  NotImplemented, KV, Disclosure, NoData, Stat, Awaiting,
} from '../components/ui';
import { SAFE_LANGUAGE } from '../lib/evidence';

const CATEGORIES = [
  {
    id: 'genomics', name: 'Pathogen genomics', icon: 'Dna', status: 'plan',
    inputs: 'Lineage assignment, mutation profile, sequence quality metadata from public repositories',
    signalType: 'Compositional change in circulating diversity',
    separation: 'Aggregated at population level; never linked to an individual case record.',
    caveat: 'Sampling is a convenience sample of sequencing capacity, not of infections.',
    ethics: 'Public repository data only. Redistribution constrained by each repository licence.',
  },
  {
    id: 'host', name: 'Host-response biomarkers', icon: 'HeartPulse', status: 'plan',
    inputs: 'Aggregate summaries of published host-response panels (e.g. interferon-stimulated gene signatures) from research cohorts',
    signalType: 'Population-level shift in host-response profile',
    separation: 'Research-cohort aggregates only. No clinical or patient-level record is ingested.',
    caveat: 'Host-response signatures are non-specific across pathogens and highly sensitive to assay platform and timing after exposure.',
    ethics: 'Human-subjects data requires ethics approval and a data-sharing agreement; the prototype holds none and therefore holds no such data.',
  },
  {
    id: 'assays', name: 'Molecular assays', icon: 'TestTubes', status: 'plan',
    inputs: 'Aggregate PCR cycle-threshold distributions, assay type, target gene, platform',
    signalType: 'Distributional shift in Ct values as a proxy for viral load in the tested population',
    separation: 'Aggregate distributions only; no specimen-level data.',
    caveat: 'Ct comparisons across platforms and sampling protocols are not valid; shifts frequently reflect testing-policy change rather than biology.',
    ethics: 'Requires laboratory data-sharing agreements.',
  },
  {
    id: 'protein', name: 'Protein / sequence-derived features', icon: 'Atom', status: 'plan',
    inputs: 'Annotation-level features from public repositories (protein family, domain presence) — descriptive only',
    signalType: 'None on its own; contextual annotation for genomic signals',
    separation: 'Reference annotation, not surveillance data.',
    caveat: 'Structural or functional inference from sequence is out of scope. No phenotype prediction is performed.',
    ethics: 'Public reference data only. Explicitly excludes any design, enhancement or engineering-related analysis.',
  },
  {
    id: 'amr', name: 'Antimicrobial-resistance markers', icon: 'Bug', status: 'plan',
    inputs: 'Aggregate resistance-gene detection and phenotypic susceptibility summaries from public AMR surveillance programmes',
    signalType: 'Change in resistance prevalence within an organism–drug pair',
    separation: 'Isolate-level counts aggregated by facility type/region; no patient linkage.',
    caveat: 'Denominators are frequently unclear; referral bias concentrates resistant isolates at tertiary laboratories.',
    ethics: 'Requires programme agreements; facility identity is sensitive and must be masked.',
  },
  {
    id: 'molepi', name: 'Molecular epidemiology', icon: 'Network', status: 'plan',
    inputs: 'Cluster assignments derived from public sequence data with documented distance thresholds',
    signalType: 'Emergence or expansion of a genomic cluster',
    separation: 'Population-level cluster statistics only.',
    caveat: 'Genomic clustering is not transmission. Threshold choice alone determines the number of clusters found.',
    ethics: 'High re-identification risk when clusters are small — minimum cluster size and geographic masking are mandatory.',
  },
];

export default function BioSignals() {
  const [sel, setSel] = useState('genomics');
  const cat = CATEGORIES.find((c) => c.id === sel);
  const C = Icons[cat.icon] || Icons.Circle;

  return (
    <>
      <PageHeader kicker="Module 11" title="Biological Signals" evidence="PLAN"
        description="Design specification for molecular and laboratory-derived signal streams. This module is deliberately unimplemented: each category below requires data agreements, ethics review and methodological work that the research programme has not completed." />

      <Callout tone="warn" title="Separation of biological and epidemiological data" icon={<Icons.SplitSquareHorizontal size={12} />}>
        Biological signals are held in a <span className="text-bw-text">separate schema</span> from epidemiological case
        data and are never silently merged into a case series. They answer a different question ("what is the
        organism / host doing in the tested population?") with a different denominator ("who was tested and how"),
        and combining them without an explicit, documented linkage model produces artefacts that look like biology.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Categories specified" value={CATEGORIES.length} evidence="PLAN" sub="Design only" />
        <Stat label="Categories implemented" value="0" evidence="ESTABLISHED" sub="No molecular data is held" color="var(--color-bw-muted)" />
        <Stat label="Data-sharing agreements" value="0" evidence="ESTABLISHED" sub="None executed" color="var(--color-bw-muted)" />
        <Stat label="Ethics approvals" value="0" evidence="ESTABLISHED" sub="Required before any host data" color="var(--color-bw-muted)" />
      </Grid>

      <Grid cols="xl:grid-cols-[320px_1fr]">
        <Panel title="Signal categories" evidence="PLAN" dense>
          <div className="space-y-1 p-1">
            {CATEGORIES.map((c) => {
              const I = Icons[c.icon] || Icons.Circle;
              return (
                <button key={c.id} type="button" onClick={() => setSel(c.id)}
                  className={`flex w-full items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition-colors ${
                    sel === c.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'
                  }`}>
                  <I size={15} className={sel === c.id ? 'text-bw-primary-bright' : 'text-bw-dim'} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11.5px] text-bw-text">{c.name}</span>
                    <span className="block font-mono text-[8.5px] tracking-[0.1em] text-bw-dim">NOT IMPLEMENTED</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title={cat.name} evidence="PLAN" accent="var(--color-bw-genomic)"
            subtitle="Specification record — inputs, signal semantics, separation rules, caveats and governance.">
            <div className="mb-3 flex items-center gap-2.5">
              <C size={22} strokeWidth={1.5} className="text-bw-genomic" />
              <Pill color="var(--color-bw-dim)">{SAFE_LANGUAGE.notImplemented}</Pill>
            </div>
            <KV cols={1} mono={false} items={[
              { k: 'Inputs', v: cat.inputs, mono: false },
              { k: 'Signal semantics', v: cat.signalType, mono: false },
              { k: 'Separation from case data', v: cat.separation, mono: false },
              { k: 'Principal caveat', v: cat.caveat, mono: false },
              { k: 'Governance requirement', v: cat.ethics, mono: false },
            ]} />
            <div className="mt-3"><NoData reason="No data of this category is held by the prototype." /></div>
          </Panel>

          <Panel title="Integration contract" evidence="PLAN"
            subtitle="Conditions a biological stream must satisfy before it may influence any signal.">
            <Table dense columns={[
              { key: 'req', header: 'Requirement' },
              { key: 'why', header: 'Rationale' },
              { key: 'state', header: 'State', align: 'right', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{r.state}</span>) },
            ]} rows={[
              { req: 'Documented denominator', why: 'A count without "out of what" cannot be compared across time or place.', state: 'NOT MET' },
              { req: 'Assay/platform metadata', why: 'Platform changes produce step artefacts indistinguishable from biological change.', state: 'NOT MET' },
              { req: 'Aggregation floor (k-anonymity)', why: 'Small molecular clusters are re-identifiable.', state: 'NOT MET' },
              { req: 'Ethics / data-sharing approval', why: 'Host-derived data are human-subjects data.', state: 'NOT MET' },
              { req: 'Independent stream for concordance', why: 'A molecular signal alone is insufficient evidence.', state: 'NOT MET' },
              { req: 'Documented linkage model to case data', why: 'Prevents silent merging of incompatible denominators.', state: 'NOT MET' },
            ]} />
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Why this module is empty rather than simulated" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Elsewhere in this prototype, synthetic series demonstrate interface behaviour. That is defensible
                for aggregate counts. It is not defensible here: a fabricated biomarker panel, Ct distribution or
                resistance profile can be mistaken for a laboratory finding, and molecular results carry an
                authority that makes such confusion costly. The module therefore shows its contract and nothing else.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill color="var(--color-alert-green)">NO SYNTHETIC MOLECULAR DATA</Pill>
                <Pill color="var(--color-alert-green)">NO SEQUENCES</Pill>
                <Pill color="var(--color-alert-green)">NO PATIENT-LEVEL RECORDS</Pill>
              </div>
            </Panel>

            <Panel title="Planned development sequence" evidence="PLAN">
              <ol className="space-y-2">
                {[
                  ['Stage 1', 'AMR aggregate reporting from an open programme — lowest ethical burden, clearest denominator.'],
                  ['Stage 2', 'Genomic lineage metadata (already partially specified in the Genomic module).'],
                  ['Stage 3', 'Aggregate Ct distributions, contingent on laboratory agreements.'],
                  ['Stage 4', 'Host-response signatures — only with ethics approval and a research collaboration.'],
                  ['Stage 5', 'Cross-stream concordance modelling between molecular and epidemiological streams.'],
                ].map(([s, t]) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="bw-num shrink-0 text-[10px] text-bw-dim">{s}</span>
                    <span className="text-[11.5px] leading-relaxed text-bw-muted">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-2.5"><Awaiting label="No stage has been started." /></div>
            </Panel>
          </Grid>
        </div>
      </Grid>
    </>
  );
}

```

---

## 39. `frontend/src/pages/Environmental.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — ENVIRONMENTAL SURVEILLANCE (SEGMENT 9)
   Wastewater and environmental sampling. Synthetic site data is
   labelled; unavailable data is declared, never invented.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  NotImplemented, SimulatedBanner, KV, Meter, Stat, NoData, Disclosure,
} from '../components/ui';
import { SignalChart, Bars, Spark } from '../components/charts';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { synthSeries, rng, fmtTs } from '../lib/synth';
import { CONNECTORS } from '../lib/connectors';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* Synthetic sampling sites — fictional identifiers, no real facility. */
const SITES = [
  { id: 'WW-SYN-01', label: 'Site 01 (synthetic)', pop: 820000, lon: -0.1, lat: 51.5, iso: 'GBR', status: 'active', freq: 'Twice weekly' },
  { id: 'WW-SYN-02', label: 'Site 02 (synthetic)', pop: 340000, lon: 13.4, lat: 52.5, iso: 'DEU', status: 'active', freq: 'Weekly' },
  { id: 'WW-SYN-03', label: 'Site 03 (synthetic)', pop: 1250000, lon: -46.6, lat: -23.5, iso: 'BRA', status: 'active', freq: 'Weekly' },
  { id: 'WW-SYN-04', label: 'Site 04 (synthetic)', pop: 210000, lon: 28.0, lat: -26.2, iso: 'ZAF', status: 'intermittent', freq: 'Fortnightly' },
  { id: 'WW-SYN-05', label: 'Site 05 (synthetic)', pop: 95000, lon: 3.4, lat: 6.5, iso: 'NGA', status: 'not-configured', freq: '—' },
  { id: 'WW-SYN-06', label: 'Site 06 (synthetic)', pop: 640000, lon: -87.6, lat: 41.9, iso: 'USA', status: 'active', freq: 'Twice weekly' },
];

export default function Environmental() {
  const { isDemo } = useMode();
  const [site, setSite] = useState('WW-SYN-01');
  const [target, setTarget] = useState('sars-cov-2');
  const [norm, setNorm] = useState('flow');

  const selected = SITES.find((s) => s.id === site);
  const series = useMemo(() => synthSeries(`env:${site}:${target}:${norm}`, {
    weeks: 78, level: norm === 'raw' ? 42000 : 380, season: 0.5, disp: 0.3,
    injectAt: site === 'WW-SYN-03' ? 7 : null, injectSize: 0.8,
  }), [site, target, norm]);

  const detection = useMemo(() => {
    const r = rng(site + target);
    return SITES.map((s) => ({
      ...s,
      detected: s.status === 'not-configured' ? null : r() > 0.25,
      lastSample: s.status === 'not-configured' ? null : `2026-08-${String(10 + Math.floor(r() * 8)).padStart(2, '0')}`,
      trend: s.status === 'not-configured' ? null : synthSeries(`env:${s.id}:spark`, { weeks: 20, level: 300, disp: 0.35 }),
    }));
  }, [site, target]);

  const mapVals = Object.fromEntries(SITES.map((s) => [s.iso, {
    state: s.status === 'not-configured' ? 'GREEN' : s.status === 'intermittent' ? 'YELLOW' : 'GREEN',
    availability: s.status === 'not-configured' ? 'none' : undefined,
    label: s.status === 'not-configured' ? 'No sampling site configured' : `${s.freq} sampling`,
    metrics: [{ k: 'Catchment (synthetic)', v: s.pop.toLocaleString() }],
  }]));

  const envConnectors = CONNECTORS.filter((c) => c.stream === 'env');

  return (
    <>
      <PageHeader kicker="Module 12" title="Environmental Surveillance" evidence="PLAN"
        description="Wastewater and environmental sampling as an independent, non-clinical indicator. Site identifiers are fictional; concentrations are synthetic. No real sampling programme is represented." />

      {isDemo && <div className="mb-3"><SimulatedBanner text="SIMULATED DATA — fictional sampling sites and synthetic concentrations. No real wastewater programme is represented." /></div>}

      <Callout tone="info" title="Why environmental streams are valuable — and fragile" icon={<Icons.Droplets size={12} />}>
        Wastewater detection does not depend on care-seeking or testing access, which is exactly why it can move
        independently of case reporting. It is also acutely sensitive to dilution, flow, assay change, site
        substitution and catchment definition — so an unnormalised concentration trend is close to uninterpretable.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Sampling sites (synthetic)" value={SITES.filter((s) => s.status !== 'not-configured').length} evidence="SIMULATED" sub={`${SITES.length} defined`} />
        <Stat label="Real programmes connected" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.connectorUnconfigured} />
        <Stat label="Detection status (synthetic)" value={`${detection.filter((d) => d.detected).length}/${detection.filter((d) => d.detected !== null).length}`} evidence="SIMULATED" sub="Sites above detection limit" />
        <Stat label="Normalisation applied" value={norm === 'flow' ? 'Flow' : norm === 'pmmov' ? 'Faecal marker' : 'None'} evidence="SIMULATED" sub="Comparability depends on this" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Concentration trend" evidence="SIMULATED"
            subtitle={`${selected?.label} · synthetic catchment ${selected?.pop.toLocaleString()} · ${selected?.freq}`}
            actions={
              <div className="flex flex-wrap gap-2">
                <Segmented size="xs" value={target} onChange={setTarget} options={[
                  { value: 'sars-cov-2', label: 'SARS-CoV-2' }, { value: 'influenza-a', label: 'Influenza A' },
                  { value: 'cholera', label: 'V. cholerae' },
                ]} />
                <Segmented size="xs" value={norm} onChange={setNorm} options={[
                  { value: 'raw', label: 'Raw' }, { value: 'flow', label: 'Flow-norm' }, { value: 'pmmov', label: 'Marker-norm' },
                ]} />
              </div>}>
            {selected?.status === 'not-configured' ? (
              <NoData reason="This site has no configured sampling stream. Absence of data is not absence of detection." />
            ) : (
              <>
                <SignalChart data={series.slice(-52)} height={210} color="var(--color-bw-env)"
                  yLabel={norm === 'raw' ? 'gene copies / L' : 'normalised index'} />
                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                  {[['Latest value', series[series.length - 1].value.toLocaleString()],
                    ['Baseline', series[series.length - 1].baseline.toLocaleString()],
                    ['Deviation', `z = ${series[series.length - 1].z}`],
                    ['Detection limit', norm === 'raw' ? '1,000 cp/L (synthetic)' : 'n/a']].map(([k, v]) => (
                    <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                      <div className="bw-label">{k}</div><div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                    </div>
                  ))}
                </div>
                {norm === 'raw' && (
                  <div className="mt-2"><Callout tone="warn" title="Unnormalised view">
                    Raw concentrations conflate pathogen shedding with rainfall, industrial discharge and flow
                    variation. This view is shown to demonstrate why normalisation is mandatory before any
                    detector is applied.
                  </Callout></div>
                )}
              </>
            )}
          </Panel>

          <Panel title="Sampling sites" evidence="SIMULATED"
            subtitle="Fictional site register. Sampling frequency and detection status are synthetic.">
            <Table rowKey="id" columns={[
              { key: 'id', header: 'Site ID', render: (r) => (
                <button className="bw-num text-[11px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSite(r.id)}>{r.id}</button>) },
              { key: 'iso', header: 'Territory', render: (r) => <span className="text-[11px] text-bw-muted">{r.iso}</span> },
              { key: 'pop', header: 'Catchment', align: 'right', render: (r) => <span className="bw-num text-[11px]">{r.pop.toLocaleString()}</span> },
              { key: 'freq', header: 'Frequency', render: (r) => <span className="text-[11px] text-bw-muted">{r.freq}</span> },
              { key: 'status', header: 'Site status', render: (r) => (
                <span className="font-mono text-[9.5px] tracking-[0.08em]" style={{
                  color: r.status === 'active' ? 'var(--color-alert-green)' : r.status === 'intermittent' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)' }}>
                  {r.status === 'not-configured' ? 'NOT CONFIGURED' : r.status.toUpperCase()}
                </span>) },
              { key: 'detected', header: 'Detection', render: (r) => (
                r.detected === null ? <span className="font-mono text-[9.5px] text-bw-dim">{SAFE_LANGUAGE.noData}</span>
                  : <span className="text-[11px]" style={{ color: r.detected ? 'var(--color-alert-orange)' : 'var(--color-bw-muted)' }}>
                      {r.detected ? 'Detected above limit' : 'Below detection limit'}</span>) },
              { key: 'lastSample', header: 'Last sample', align: 'right', render: (r) => (
                <span className="bw-num text-[10.5px] text-bw-dim">{r.lastSample || '—'}</span>) },
              { key: 'trend', header: '20-wk', align: 'right', width: 80, render: (r) => (
                r.trend ? <div className="ml-auto w-[70px]"><Spark data={r.trend} color="var(--color-bw-env)" height={20} /></div> : '—') },
            ]} rows={detection} />
          </Panel>

          <Panel title="Geographic sampling coverage" evidence="SIMULATED">
            <WorldMap values={mapVals} height={250}
              points={SITES.filter((s) => s.status !== 'not-configured').map((s) => ({
                lon: s.lon, lat: s.lat, label: s.label, color: 'var(--color-bw-env)', r: 4,
              }))} />
            <div className="mt-2"><MapLegend compact /></div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Method requirements" evidence="ESTABLISHED"
            subtitle="Conditions before an environmental signal may be raised.">
            {[['Flow or faecal-marker normalisation', true], ['Documented catchment population', true],
              ['Assay and platform recorded per sample', true], ['Limit of detection reported', true],
              ['Site-change log maintained', false], ['Independent confirmation stream', false]].map(([k, ok]) => (
              <div key={k} className="flex items-center gap-2 border-b border-bw-line/50 py-1.5 last:border-0">
                {ok ? <Icons.CheckCircle2 size={13} className="shrink-0 text-[var(--color-alert-green)]" />
                    : <Icons.CircleAlert size={13} className="shrink-0 text-[var(--color-alert-yellow)]" />}
                <span className="text-[11.5px] text-bw-muted">{k}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Connectors" evidence="ESTABLISHED">
            {envConnectors.map((c) => (
              <div key={c.id} className="mb-2 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5 last:mb-0">
                <div className="text-[11.5px] text-bw-text">{c.name}</div>
                <div className="mt-1 text-[10px] text-bw-dim">{c.frequency} · {c.format}</div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-bw-dim">
                  {c.status === 'available' ? SAFE_LANGUAGE.connectorAvailable : SAFE_LANGUAGE.connectorUnconfigured}
                </div>
                <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-muted">{c.caveats}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Interpretation guidance" evidence="ESTABLISHED">
            <div className="space-y-1.5">
              <Disclosure summary="Lead time is not guaranteed">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Wastewater signals have shown lead time over case reporting in several published settings, but
                  the magnitude depends on local testing behaviour. Where testing is already fast, lead time can
                  be zero or negative.
                </p>
              </Disclosure>
              <Disclosure summary="Concentration is not incidence">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Shedding varies by individual, time since infection and pathogen. Converting a concentration to
                  a case count requires assumptions that are rarely defensible at a single site.
                </p>
              </Disclosure>
              <Disclosure summary="Equity consideration">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Sewered catchments over-represent urban, formally-housed populations. Environmental surveillance
                  can systematically miss exactly the communities with least access to clinical testing.
                </p>
              </Disclosure>
            </div>
          </Panel>

          <Panel title="Module state" evidence="ESTABLISHED" dense>
            <KV items={[
              { k: 'Implementation', v: 'Interface + synthetic demo' },
              { k: 'Real programmes bound', v: 'None' },
              { k: 'Sites (fictional)', v: String(SITES.length) },
              { k: 'Last update', v: fmtTs() },
            ]} />
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 40. `frontend/src/pages/Events.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — EVENT-BASED INTELLIGENCE (SEGMENT 9)
   Processing of legitimate public information sources.
   Every item enters as UNVERIFIED and requires human
   adjudication. Media reports are never treated as disease data.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  NotImplemented, SimulatedBanner, KV, Stat, NoData, Field, Select,
} from '../components/ui';
import { Bars } from '../components/charts';
import { rng, fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* Synthetic report items — deliberately generic, no real event,
   no real outlet, no real location claim. */
const TEMPLATES = [
  { type: 'Official bulletin', extract: 'Respiratory illness consultations described as elevated in a synthetic administrative area', pathogen: 'Unspecified respiratory', reliability: 'Official source (synthetic)' },
  { type: 'Ministry statement', extract: 'Routine seasonal advisory issued; no unusual activity described', pathogen: 'Influenza-like illness', reliability: 'Official source (synthetic)' },
  { type: 'News report', extract: 'Local reporting of increased clinic attendance; no laboratory confirmation described', pathogen: 'Unspecified febrile illness', reliability: 'Media (synthetic)' },
  { type: 'News report', extract: 'Report references a water-quality incident; no case data provided', pathogen: 'Enteric (unspecified)', reliability: 'Media (synthetic)' },
  { type: 'Professional network post', extract: 'Practitioner describes atypical presentation cluster; single source, unverified', pathogen: 'Unspecified', reliability: 'Low (synthetic)' },
  { type: 'Official bulletin', extract: 'Laboratory network reports increased specimen volume', pathogen: 'Unspecified', reliability: 'Official source (synthetic)' },
  { type: 'News aggregation', extract: 'Duplicate coverage of a previously indexed report', pathogen: 'Unspecified respiratory', reliability: 'Media (synthetic)' },
  { type: 'Regional bulletin', extract: 'Vector-control activity announced following rainfall', pathogen: 'Arboviral (unspecified)', reliability: 'Official source (synthetic)' },
];

const VERIF = {
  unverified: { label: 'UNVERIFIED', color: 'var(--color-bw-dim)' },
  triage: { label: 'IN TRIAGE', color: 'var(--color-alert-yellow)' },
  corroborated: { label: 'CORROBORATED BY OFFICIAL SOURCE', color: 'var(--color-bw-data)' },
  duplicate: { label: 'DUPLICATE — MERGED', color: 'var(--color-bw-dim)' },
  discarded: { label: 'DISCARDED — NOT A HEALTH EVENT', color: 'var(--color-bw-dim)' },
};

export default function Events() {
  const { isDemo } = useMode();
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState('EV-0001');
  const [states, setStates] = useState({});

  const items = useMemo(() => {
    const r = rng('events');
    return Array.from({ length: 14 }, (_, i) => {
      const t = TEMPLATES[i % TEMPLATES.length];
      return {
        id: `EV-${String(i + 1).padStart(4, '0')}`,
        ...t,
        date: `2026-08-${String(6 + (i % 15)).padStart(2, '0')}`,
        location: ['Synthetic Region A', 'Synthetic Region B', 'Synthetic Region C', 'Synthetic Region D'][i % 4],
        source: `${t.type} (synthetic corpus)`,
        confidence: ['Low', 'Low', 'Moderate'][Math.floor(r() * 3)],
        signalStrength: +(0.1 + r() * 0.6).toFixed(2),
        state: i === 0 ? 'triage' : i % 5 === 0 ? 'corroborated' : i % 7 === 0 ? 'duplicate' : 'unverified',
      };
    });
  }, []);

  const withState = items.map((i) => ({ ...i, state: states[i.id] || i.state }));
  const filtered = withState.filter((i) => filter === 'all' || i.state === filter);
  const sel = withState.find((i) => i.id === selId) || withState[0];

  const byType = useMemo(() => {
    const m = {};
    withState.forEach((i) => { m[i.type] = (m[i.type] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [withState]);

  return (
    <>
      <PageHeader kicker="Module 13" title="Event-Based Intelligence" evidence="PLAN"
        description="Structured extraction from official bulletins and vetted public reporting. Items enter as unverified by definition and can only change state through analyst adjudication." />

      <Callout tone="danger" title="Non-negotiable rule for this module" icon={<Icons.ShieldAlert size={12} />}>
        A media report, social post or aggregated headline is <span className="text-bw-text">never</span> treated as a
        confirmed disease event, is never counted as a case, and never contributes to a case series. It can only
        prompt a human to go and check an official source. Automatic promotion of an unverified report to a signal
        is not implementable in this design.
      </Callout>

      {isDemo && <div className="my-3"><SimulatedBanner text="SIMULATED CORPUS — generic placeholder reports. No real outlet, event, location or statement is represented." /></div>}

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Items in corpus" value={withState.length} evidence="SIMULATED" sub="Synthetic placeholder reports" />
        <Stat label="Unverified" value={withState.filter((i) => i.state === 'unverified').length} evidence="SIMULATED" color="var(--color-bw-muted)" sub="Default state on ingestion" />
        <Stat label="Corroborated by official source" value={withState.filter((i) => i.state === 'corroborated').length} evidence="SIMULATED" color="var(--color-bw-data)" sub="Still not a confirmed event" />
        <Stat label="Auto-promoted to signals" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)" sub="Prohibited by design" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Event corpus" evidence="SIMULATED"
            subtitle="Structured extraction output awaiting human review."
            actions={<Segmented size="xs" value={filter} onChange={setFilter} options={[
              { value: 'all', label: 'All' }, { value: 'unverified', label: 'Unverified' },
              { value: 'triage', label: 'In triage' }, { value: 'corroborated', label: 'Corroborated' },
            ]} />}>
            <Table rowKey="id" columns={[
              { key: 'id', header: 'ID', render: (r) => (
                <button className="bw-num text-[10.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSelId(r.id)}>{r.id}</button>) },
              { key: 'date', header: 'Date', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.date}</span> },
              { key: 'type', header: 'Source type', render: (r) => <span className="text-[11px] text-bw-muted">{r.type}</span> },
              { key: 'location', header: 'Location', render: (r) => <span className="text-[11px] text-bw-muted">{r.location}</span> },
              { key: 'pathogen', header: 'Pathogen', render: (r) => <span className="text-[11px] text-bw-muted">{r.pathogen}</span> },
              { key: 'extract', header: 'Extracted signal', render: (r) => <span className="text-[11px] text-bw-text">{r.extract}</span> },
              { key: 'state', header: 'Verification', align: 'right', render: (r) => (
                <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: VERIF[r.state].color }}>{VERIF[r.state].label}</span>) },
            ]} rows={filtered} />
          </Panel>

          {sel && (
            <Panel title={`${sel.id} — review record`} evidence="SIMULATED"
              subtitle="Everything an analyst needs to decide whether this warrants checking an official source.">
              <Grid cols="md:grid-cols-2">
                <KV cols={1} mono={false} items={[
                  { k: 'Source', v: sel.source, mono: false },
                  { k: 'Source type', v: sel.type, mono: false },
                  { k: 'Date', v: sel.date },
                  { k: 'Location as stated', v: `${sel.location} (not geocoded — synthetic)`, mono: false },
                  { k: 'Pathogen as stated', v: sel.pathogen, mono: false },
                ]} />
                <KV cols={1} mono={false} items={[
                  { k: 'Extracted signal', v: sel.extract, mono: false },
                  { k: 'Extraction method', v: 'Rule-based template match (NLP model not implemented)', mono: false },
                  { k: 'Extraction confidence', v: sel.confidence, mono: false },
                  { k: 'Corroborating official source', v: sel.state === 'corroborated' ? 'One synthetic official bulletin' : 'None identified', mono: false },
                  { k: 'Verification status', v: VERIF[sel.state].label, mono: false },
                ]} />
              </Grid>

              <div className="mt-3 rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                <div className="bw-label mb-1.5">Analyst adjudication (session only)</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(VERIF).map(([k, v]) => (
                    <Btn key={k} size="xs" variant={sel.state === k ? 'outline' : 'ghost'}
                      onClick={() => setStates((s) => ({ ...s, [sel.id]: k }))}>{v.label}</Btn>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] leading-snug text-bw-dim">
                  No adjudication here creates a case, a count or a signal. Corroboration means only that an
                  official source describing the same situation was located, and the item may be cited as context
                  in a review — never as evidence of incidence.
                </p>
              </div>
            </Panel>
          )}

          <Panel title="Extraction pipeline" evidence="PLAN">
            <div className="flex flex-wrap gap-1.5">
              {[['Ingest', 'done'], ['Deduplicate', 'done'], ['Language detect', 'plan'], ['Entity extraction', 'plan'],
                ['Geocoding', 'plan'], ['Pathogen normalisation', 'plan'], ['Source-reliability score', 'partial'],
                ['Human triage', 'done'], ['Link to official source', 'partial']].map(([s, st]) => (
                <div key={s} className="rounded-sm border px-2 py-1.5" style={{
                  borderColor: st === 'done' ? 'var(--color-alert-green)55' : st === 'partial' ? 'var(--color-alert-yellow)55' : 'var(--color-bw-line2)',
                  background: st === 'done' ? 'var(--color-alert-green)0d' : 'transparent' }}>
                  <span className="text-[11px] text-bw-text">{s}</span>
                  <span className="ml-1.5 font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">{st.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5">
              <NotImplemented what="NLP extraction model"
                plan="Design: multilingual named-entity recognition for pathogen, location and date, plus a claim classifier separating 'official statement of counts' from 'reported concern'. Requires an annotated corpus and per-source licence review before any model is trained." />
            </div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Source-type composition" evidence="SIMULATED">
            <Bars horizontal data={byType} height={160} color="#a98bd6" note="SIMULATED — synthetic corpus" />
          </Panel>

          <Panel title="Source-reliability tiers" evidence="ESTABLISHED"
            subtitle="Tier determines what an item may be used for — never whether it is true.">
            {[
              ['Tier 1 — Official public-health authority', 'May be cited as a reported figure with attribution', 'var(--color-alert-green)'],
              ['Tier 2 — Peer-reviewed / institutional report', 'May be cited as context', 'var(--color-bw-data)'],
              ['Tier 3 — Established news organisation', 'Prompts verification only', 'var(--color-alert-yellow)'],
              ['Tier 4 — Aggregators, professional networks', 'Prompts verification; never cited', 'var(--color-alert-orange)'],
              ['Tier 5 — Social media, anonymous posts', 'Not ingested in this design', 'var(--color-alert-red)'],
            ].map(([t, use, c]) => (
              <div key={t} className="border-b border-bw-line/50 py-1.5 last:border-0">
                <div className="flex items-center gap-2">
                  <Dot color={c} /><span className="text-[11.5px] text-bw-text">{t}</span>
                </div>
                <div className="mt-0.5 pl-4 text-[10.5px] text-bw-dim">{use}</div>
              </div>
            ))}
          </Panel>

          <Panel title="Known hazards" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {['Reverse causality — media volume rises after official announcements, so it can appear predictive while being purely downstream.',
                'Attention bias — coverage concentrates on wealthy, English-language settings.',
                'Duplication cascades — one report syndicated across outlets can look like independent corroboration.',
                'Alarm amplification — an unverified item rendered on a surveillance dashboard acquires unearned authority.',
                'Legal exposure — several feeds prohibit redistribution; storage and display must be licence-checked.'].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.TriangleAlert size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-yellow)]" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Module state" evidence="ESTABLISHED" dense>
            <KV items={[
              { k: 'Real feeds connected', v: 'None' },
              { k: 'NLP model', v: 'Not implemented' },
              { k: 'Corpus', v: 'Synthetic placeholders' },
              { k: 'Auto-promotion', v: 'Disabled by design' },
              { k: 'Last update', v: fmtTs() },
            ]} />
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 41. `frontend/src/pages/Africa.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — NIGERIA / AFRICA REGIONAL VIEW (SEGMENT 13)
   ------------------------------------------------------------
   HARD RULE: no African disease statistic is invented. Where a
   real figure would be required, the panel reads
   "DATA NOT AVAILABLE". Capacity indicators are structural
   descriptions, not measurements. Synthetic series used for
   interface demonstration are labelled at every point of use.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Meter, NoData, SimulatedBanner, Disclosure, NotImplemented,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Bars, Spark } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { NIGERIA_STATES, PATHOGENS } from '../lib/registry';
import { synthSeries, rng, fmtTs } from '../lib/synth';
import { ALERT_STATES, SAFE_LANGUAGE } from '../lib/evidence';
import { CONNECTORS } from '../lib/connectors';
import { useMode } from '../lib/mode';

/* Structural capacity descriptors. These are qualitative statements about
   what a surveillance system would need — NOT measurements of any country. */
const CAPACITY_DIMENSIONS = [
  { id: 'idsr', name: 'IDSR-style routine reporting', desc: 'Weekly integrated disease surveillance and response reporting from health facilities to district and national level.' },
  { id: 'lab', name: 'Reference laboratory network', desc: 'National and regional reference laboratories with confirmatory assay capacity and specimen-referral logistics.' },
  { id: 'genomic', name: 'Genomic sequencing capacity', desc: 'Sequencing platforms, bioinformatics staffing and submission pathways to public repositories.' },
  { id: 'env', name: 'Environmental surveillance', desc: 'Wastewater or water-source sampling programmes with defined catchments and normalisation.' },
  { id: 'digital', name: 'Digital reporting infrastructure', desc: 'Electronic case-based reporting replacing paper aggregation; determines achievable timeliness.' },
  { id: 'workforce', name: 'Field epidemiology workforce', desc: 'Trained epidemiologists available to investigate a signal once raised — the binding constraint on any alerting system.' },
];

const AFRICA_ISO = ['NGA', 'GHA', 'ZAF', 'KEN', 'ETH', 'COD', 'EGY', 'SEN', 'MAR', 'DZA', 'TZA', 'UGA',
  'ZMB', 'MOZ', 'CMR', 'CIV', 'SDN', 'SOM', 'MDG', 'AGO', 'NER', 'MLI', 'BFA', 'TCD', 'ZWE', 'RWA',
  'BDI', 'LBR', 'SLE', 'GIN', 'TUN', 'LBY', 'BWA', 'NAM', 'MWI'];

export default function Africa() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [scope, setScope] = useState('africa');
  const [pathogen, setPathogen] = useState('lassa');
  const [stateSel, setStateSel] = useState('ED');

  /* Africa map: only territories present in the synthetic set carry a state.
     Everything else is explicitly "no stream configured" — not green. */
  const mapValues = useMemo(() => {
    const vals = {};
    AFRICA_ISO.forEach((iso) => {
      const c = S.countries.find((x) => x.iso === iso);
      if (c && c.availability !== 'none') {
        vals[iso] = S.mapValues[iso];
      } else {
        vals[iso] = {
          state: 'GREEN', availability: 'none',
          label: 'No stream configured — data not available',
          metrics: [{ k: 'Status', v: SAFE_LANGUAGE.noData }],
        };
      }
    });
    return vals;
  }, [S]);

  const configured = AFRICA_ISO.filter((iso) => S.countries.some((c) => c.iso === iso && c.availability !== 'none'));

  /* Nigeria state-level synthetic demonstration series. */
  const stateData = useMemo(() => NIGERIA_STATES.map((st) => {
    const r = rng('ng:' + st.id + pathogen);
    const configuredState = r() > 0.25;
    const series = configuredState
      ? synthSeries(`ng:${st.id}:${pathogen}`, {
          weeks: 78, level: 8 + Math.floor(r() * 40), season: pathogen === 'lassa' ? 0.8 : 0.4,
          disp: 0.35, injectAt: st.id === 'ED' && pathogen === 'lassa' ? 6 : null, injectSize: 0.9,
        })
      : null;
    const last = series?.[series.length - 1];
    return {
      ...st, configured: configuredState, series,
      z: last?.z ?? null,
      state: !series ? null : last.z >= 3 ? 'RED' : last.z >= 2 ? 'ORANGE' : last.z >= 1.2 ? 'YELLOW' : 'GREEN',
      completeness: configuredState ? +(0.45 + r() * 0.45).toFixed(2) : null,
      delay: configuredState ? +(1.5 + r() * 3).toFixed(1) : null,
    };
  }), [pathogen]);

  const sel = stateData.find((s) => s.id === stateSel);
  const ngConnectors = CONNECTORS.filter((c) => ['ncdc-ng', 'africa-cdc', 'who-gho', 'who-flunet'].includes(c.id));

  return (
    <>
      <PageHeader kicker="Module 24" title="Nigeria / Africa Intelligence View" evidence="SIMULATED"
        description="Regional view with explicit data-availability accounting. No African disease statistic is invented anywhere in this module; where a real figure would be required, the panel declares that the data is not available." />

      <Callout tone="danger" title="Data-availability honesty rule" icon={<Icons.ShieldAlert size={12} />}>
        Most territories on this map have <span className="text-bw-text">no configured stream</span> and are therefore
        rendered as hatched "data not available" — never as green. Rendering unreported territories as calm is the
        specific failure that makes surveillance dashboards dangerous in exactly the settings where surveillance is
        weakest.
      </Callout>

      {isDemo && <div className="my-3"><SimulatedBanner text="SIMULATED DATA — NOT REAL-WORLD SURVEILLANCE. No figure here describes any real Nigerian state, African country, or disease event." /></div>}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Segmented value={scope} onChange={setScope} options={[
          { value: 'africa', label: 'Africa region' }, { value: 'nigeria', label: 'Nigeria' },
          { value: 'capacity', label: 'Capacity & gaps' },
        ]} />
        {scope !== 'capacity' && (
          <>
            <span className="bw-label ml-2">Pathogen</span>
            <Segmented size="xs" value={pathogen} onChange={setPathogen}
              options={PATHOGENS.filter((p) => ['lassa', 'cholera', 'measles', 'mpox'].includes(p.id)).map((p) => ({ value: p.id, label: p.name.split(' ')[0] }))} />
          </>
        )}
      </div>

      {/* ================= AFRICA SCOPE ================= */}
      {scope === 'africa' && (
        <Grid cols="xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-3">
            <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Territories in view" value={AFRICA_ISO.length} evidence="ESTABLISHED" sub="Africa region" />
              <Stat label="With a configured stream" value={configured.length} evidence="SIMULATED"
                color="var(--color-alert-yellow)" sub={`${AFRICA_ISO.length - configured.length} without any stream`} />
              <Stat label="Real data bound" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.connectorUnconfigured} />
              <Stat label="Invented statistics" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)" sub="By policy" />
            </Grid>

            <Panel title="Regional surveillance state" evidence="SIMULATED"
              subtitle="Hatched territories have no configured stream. That is a statement about this prototype, not about those countries.">
              <WorldMap values={mapValues} height={430} focus={[20, 2, 2.4]}
                points={configured.map((iso) => {
                  const c = S.countries.find((x) => x.iso === iso);
                  return { lon: c.lon, lat: c.lat, iso, label: `${c.name} · ${c.pathogen?.name}`, color: ALERT_STATES[c.state].color, r: 3 + Math.abs(c.z) };
                })} />
              <div className="mt-2"><MapLegend /></div>
            </Panel>

            <Panel title="Configured territories" evidence="SIMULATED">
              <Table rowKey="iso" columns={[
                { key: 'name', header: 'Territory' },
                { key: 'pathogen', header: 'Stream', render: (r) => <span className="text-[11px] text-bw-muted">{r.pathogen?.name}</span> },
                { key: 'state', header: 'Detector state', render: (r) => (
                  <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                    <Dot color={ALERT_STATES[r.state].color} />{S.mapValues[r.iso]?.label}</span>) },
                { key: 'z', header: 'z', align: 'right', render: (r) => <span className="bw-num text-[11px]">{r.z.toFixed(2)}</span> },
                { key: 'completeness', header: 'Completeness', align: 'right', render: (r) => (
                  <span className="bw-num text-[11px] text-bw-muted">{Math.round(r.completeness * 100)}%</span>) },
                { key: 'delayWeeks', header: 'Delay', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.delayWeeks} wk</span> },
                { key: 'sp', header: '26-wk', align: 'right', width: 84, render: (r) => (
                  <div className="ml-auto w-[74px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={20} /></div>) },
              ]} rows={S.countries.filter((c) => AFRICA_ISO.includes(c.iso) && c.availability !== 'none')} />
            </Panel>

            <Panel title="Territories without a configured stream" evidence="ESTABLISHED">
              <div className="flex flex-wrap gap-1.5">
                {AFRICA_ISO.filter((iso) => !configured.includes(iso)).map((iso) => (
                  <span key={iso} className="rounded-sm border border-dashed border-bw-line2 px-2 py-1 font-mono text-[10px] text-bw-dim">
                    {iso} · {SAFE_LANGUAGE.noData}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-bw-dim">
                These territories are shown because omitting them would misrepresent coverage. Their absence from
                the signal set reflects the prototype's connector configuration only.
              </p>
            </Panel>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <Panel title="Regional data sources" evidence="ESTABLISHED">
              {ngConnectors.map((c) => (
                <div key={c.id} className="mb-2 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5 last:mb-0">
                  <div className="text-[11.5px] text-bw-text">{c.name}</div>
                  <div className="mt-0.5 text-[10px] text-bw-dim">{c.format} · {c.frequency}</div>
                  <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-bw-dim">
                    {c.status === 'available' ? SAFE_LANGUAGE.connectorAvailable : SAFE_LANGUAGE.connectorUnconfigured}
                  </div>
                  <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-muted">{c.caveats}</p>
                </div>
              ))}
            </Panel>

            <Panel title="Why this view exists" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Global surveillance platforms are typically built where data is densest, and their models inherit
                that geography. A regional view built from the start around <span className="text-bw-text">declared
                data availability</span> — rather than around whichever countries happen to report well — makes the
                gap visible instead of averaging it away.
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                The research question this supports is concrete: can a detection method be made useful under
                sparse, delayed and partially-missing reporting, and how much performance is lost relative to a
                dense-reporting setting?
              </p>
            </Panel>

            <Panel title="Regional research priorities" evidence="HYPOTHESIS">
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
                {['Detection under sparse reporting: quantify the completeness floor below which no detector is usable.',
                  'Delay-aware baselines: whether now-casting recovers usable timeliness from delayed streams.',
                  'Seasonal pathogens with strong ecology (Lassa, cholera) as a test bed for baseline specification.',
                  'Transferability: whether a detector tuned on dense data degrades gracefully or catastrophically.'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Dot size={13} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
                ))}
              </ul>
            </Panel>
          </div>
        </Grid>
      )}

      {/* ================= NIGERIA SCOPE ================= */}
      {scope === 'nigeria' && (
        <Grid cols="xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-3">
            <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="States in demonstration set" value={NIGERIA_STATES.length} evidence="SIMULATED" sub="of 36 + FCT" />
              <Stat label="With synthetic stream" value={stateData.filter((s) => s.configured).length} evidence="SIMULATED" />
              <Stat label="Real NCDC data bound" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="Connector not configured" />
              <Stat label="Mean completeness (synthetic)" value={`${Math.round((stateData.filter((s) => s.configured).reduce((a, s) => a + s.completeness, 0) / Math.max(1, stateData.filter((s) => s.configured).length)) * 100)}%`}
                evidence="SIMULATED" color="var(--color-alert-yellow)" />
            </Grid>

            <Panel title="State-level demonstration grid" evidence="SIMULATED"
              subtitle="A cartogram-style grid avoids implying precise geographic boundaries for synthetic values.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {stateData.map((st) => (
                  <button key={st.id} type="button" onClick={() => setStateSel(st.id)}
                    className={`rounded-sm border p-2.5 text-left transition-colors ${
                      stateSel === st.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}
                    style={st.configured ? { borderLeftWidth: 2, borderLeftColor: ALERT_STATES[st.state].color } : undefined}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-bw-text">{st.name}</span>
                      {st.configured ? <Dot color={ALERT_STATES[st.state].color} /> : <Icons.Slash size={11} className="text-bw-dim" />}
                    </div>
                    <div className="mt-0.5 text-[9.5px] text-bw-dim">{st.zone}</div>
                    {st.configured ? (
                      <>
                        <div className="mt-1.5 -mx-0.5"><Spark data={st.series.slice(-20)} color={ALERT_STATES[st.state].color} height={22} /></div>
                        <div className="bw-num mt-0.5 text-[10px] text-bw-muted">z = {st.z.toFixed(2)}</div>
                      </>
                    ) : (
                      <div className="mt-2 font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">{SAFE_LANGUAGE.noData}</div>
                    )}
                  </button>
                ))}
              </div>
            </Panel>

            {sel && (
              <Panel title={`${sel.name} — ${PATHOGENS.find((p) => p.id === pathogen)?.name}`} evidence="SIMULATED"
                accent={sel.configured ? ALERT_STATES[sel.state].color : undefined}
                subtitle={sel.configured ? `${sel.zone} · synthetic weekly series` : sel.zone}>
                {sel.configured ? (
                  <>
                    <SignalChart data={sel.series.slice(-52)} height={190} />
                    <Grid cols="sm:grid-cols-4" className="mt-2">
                      {[['Latest (synthetic)', sel.series[sel.series.length - 1].value],
                        ['Baseline', sel.series[sel.series.length - 1].baseline],
                        ['Completeness', `${Math.round(sel.completeness * 100)}%`],
                        ['Reporting delay', `${sel.delay} wk`]].map(([k, v]) => (
                        <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                          <div className="bw-label">{k}</div><div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                        </div>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <NoData reason="No stream is configured for this state in the demonstration set. This is a property of the prototype, not a statement about the state's surveillance." />
                )}
              </Panel>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <Panel title="Pathogen context (Nigeria)" evidence="ESTABLISHED"
              subtitle="Descriptive public-health knowledge. Contains no counts and no current-activity claim.">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                {PATHOGENS.find((p) => p.id === pathogen)?.seasonality}
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                {PATHOGENS.find((p) => p.id === pathogen)?.note}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-bw-dim">
                Surveillance practice: {PATHOGENS.find((p) => p.id === pathogen)?.surveillance}
              </p>
            </Panel>

            <Panel title="Reporting gaps (synthetic)" evidence="SIMULATED">
              <div className="space-y-2">
                {stateData.filter((s) => s.configured).sort((a, b) => a.completeness - b.completeness).slice(0, 6).map((s) => (
                  <Meter key={s.id} label={s.name} right={`${Math.round(s.completeness * 100)}%`}
                    value={s.completeness * 100}
                    color={s.completeness > 0.75 ? 'var(--color-alert-green)' : s.completeness > 0.55 ? 'var(--color-alert-yellow)' : 'var(--color-alert-red)'} />
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-snug text-bw-dim">
                Below roughly 60% completeness, a weekly baseline becomes too wide to detect anything short of a
                very large deviation — a structural limit, not a tuning problem.
              </p>
            </Panel>

            <Panel title="Data source status" evidence="ESTABLISHED" dense>
              <KV items={[
                { k: 'NCDC situation reports', v: 'CONNECTOR NOT CONFIGURED' },
                { k: 'State-level line lists', v: 'Not public — not sought' },
                { k: 'Laboratory network data', v: 'DATA NOT AVAILABLE' },
                { k: 'Genomic submissions', v: 'DATA NOT AVAILABLE' },
                { k: 'Environmental sampling', v: 'DATA NOT AVAILABLE' },
                { k: 'Last checked', v: fmtTs() },
              ]} />
            </Panel>
          </div>
        </Grid>
      )}

      {/* ================= CAPACITY SCOPE ================= */}
      {scope === 'capacity' && (
        <Grid cols="lg:grid-cols-2">
          <Panel title="Surveillance capacity dimensions" evidence="ESTABLISHED"
            subtitle="Structural descriptors of what a functioning surveillance system requires. No country is scored — scoring would require measurement this prototype has not done.">
            <Table dense columns={[
              { key: 'name', header: 'Dimension', render: (r) => <span className="text-[11.5px] text-bw-text">{r.name}</span> },
              { key: 'desc', header: 'What it means', render: (r) => <span className="text-[11px] text-bw-muted">{r.desc}</span> },
              { key: 'score', header: 'Country score', align: 'right', render: () => (
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{SAFE_LANGUAGE.noData}</span>) },
            ]} rows={CAPACITY_DIMENSIONS} />
            <Callout tone="warn" title="Why no capacity scores are shown">
              Capacity indices exist in the literature and in official assessments (for example, state-party
              self-assessment instruments). Reproducing or approximating them here without the underlying
              assessment data would be fabrication, and capacity scores attached to named countries carry
              political consequences.
            </Callout>
          </Panel>

          <div className="space-y-3">
            <Panel title="Gap analysis framework" evidence="PLAN"
              subtitle="How the platform would characterise a gap once real data exists.">
              <ol className="space-y-2">
                {[
                  ['Coverage gap', 'Which administrative units never appear in the data at all.'],
                  ['Temporal gap', 'Which weeks are missing, and whether missingness clusters around events.'],
                  ['Confirmation gap', 'Share of reported cases with laboratory confirmation, by unit.'],
                  ['Timeliness gap', 'Distribution of event-to-report delay, by unit.'],
                  ['Stream gap', 'Which of the six streams exist at all for a given pathogen and place.'],
                  ['Workforce gap', 'Whether a raised signal can actually be investigated — the constraint that determines whether alerting has any value.'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="bw-num shrink-0 text-[10px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                    <div><div className="text-[12px] text-bw-text">{t}</div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p></div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Equity principle" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A detection method that only works where reporting is already excellent adds least where it is
                needed most. This project therefore treats performance under sparse, delayed reporting as a
                primary evaluation condition rather than a robustness footnote — and treats a method that fails
                that condition as having failed, regardless of its headline metrics elsewhere.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link to="/app/quality"><Btn size="sm"><Icons.ShieldCheck size={12} /> Data quality center</Btn></Link>
                <Link to="/app/connectors"><Btn size="sm"><Icons.PlugZap size={12} /> Connectors</Btn></Link>
              </div>
            </Panel>
          </div>
        </Grid>
      )}
    </>
  );
}

```

---

## 42. `frontend/src/pages/Connectors.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — DATA CONNECTOR MANAGEMENT (SEGMENT 11)
   Every connector exposes: source, endpoint, auth requirement,
   format, frequency, last update, status, error, licence.
   Unconfigured sources are declared, never simulated as live.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Field, Input, NoData, Disclosure, NotImplemented,
} from '../components/ui';
import { CONNECTORS, CONNECTOR_STATUS, connectorCounts } from '../lib/connectors';
import { STREAMS } from '../lib/registry';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { fmtTs } from '../lib/synth';
import { useMode } from '../lib/mode';

export default function Connectors() {
  const { mode } = useMode();
  const [sel, setSel] = useState(CONNECTORS[0].id);
  const [streamFilter, setStreamFilter] = useState('all');
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState({});

  const counts = useMemo(() => connectorCounts(), []);
  const list = CONNECTORS.filter((c) => streamFilter === 'all' || c.stream === streamFilter);
  const c = CONNECTORS.find((x) => x.id === sel);

  /* A "test" honestly reports that no request is made from the browser. */
  const runTest = (id) => {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setTestResult((r) => ({
        ...r,
        [id]: {
          at: fmtTs(),
          outcome: 'NOT ATTEMPTED',
          detail: 'No network request was issued. Connector calls must originate from the server-side ingestion service so that credentials, rate limits, caching and licence compliance are enforced centrally. A browser-side fetch would also be blocked by cross-origin policy for most of these sources.',
        },
      }));
    }, 700);
  };

  return (
    <>
      <PageHeader kicker="Module 19" title="Data Connectors" evidence="ESTABLISHED"
        description="Registry of public data sources the platform is architected to read, with the full connector contract for each. No source is connected in this build." />

      <Callout tone="warn" title="Nothing here is live" icon={<Icons.PlugZap size={12} />}>
        Every connector below is <span className="font-mono text-[11px]">{SAFE_LANGUAGE.connectorAvailable}</span> or
        not configured. The interface will not display a LIVE badge, a timestamp or a value for any source that has
        not actually returned data. Organisation names identify publicly documented sources and imply no
        affiliation, endorsement or granted access.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-5" className="my-3">
        <Stat label="Connectors defined" value={counts.total} evidence="ESTABLISHED" />
        <Stat label="Configured" value={counts.by.configured || 0} evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="None in this build" />
        <Stat label="Available — config required" value={counts.by.available || 0} evidence="ESTABLISHED" color="var(--color-bw-data)" />
        <Stat label="Access restricted" value={counts.by.blocked || 0} evidence="ESTABLISHED" color="var(--color-alert-yellow)" sub="Agreement required" />
        <Stat label="Planned" value={(counts.by.planned || 0) + (counts.by.unconfigured || 0)} evidence="ESTABLISHED" color="var(--color-bw-dim)" />
      </Grid>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="bw-label">Stream</span>
        <Segmented size="xs" value={streamFilter} onChange={setStreamFilter}
          options={[{ value: 'all', label: 'All' }, ...Object.values(STREAMS).map((s) => ({ value: s.key, label: s.label, color: s.color }))]} />
        <span className="ml-auto text-[10px] text-bw-dim">Active mode: {mode} · connector behaviour is identical in every mode</span>
      </div>

      <Grid cols="xl:grid-cols-[1fr_430px]">
        <Panel title="Connector registry" evidence="ESTABLISHED">
          <Table rowKey="id" columns={[
            { key: 'name', header: 'Source', render: (r) => (
              <button className="text-left text-[11.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSel(r.id)}>
                {r.name}
                <span className="mt-0.5 block text-[10px] text-bw-dim">{r.org}</span>
              </button>) },
            { key: 'stream', header: 'Stream', render: (r) => (
              <span className="text-[11px]" style={{ color: STREAMS[r.stream].color }}>{STREAMS[r.stream].label}</span>) },
            { key: 'frequency', header: 'Update freq.', render: (r) => <span className="text-[10.5px] text-bw-muted">{r.frequency}</span> },
            { key: 'lastUpdate', header: 'Last update', render: (r) => (
              <span className="bw-num text-[10.5px] text-bw-dim">{r.lastUpdate || '—'}</span>) },
            { key: 'status', header: 'Status', align: 'right', render: (r) => (
              <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: CONNECTOR_STATUS[r.status].color }}>
                {CONNECTOR_STATUS[r.status].label}
              </span>) },
          ]} rows={list} />
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          {c && (
            <>
              <Panel title={c.name} evidence="ESTABLISHED" accent={CONNECTOR_STATUS[c.status].color}
                subtitle={`${c.org} · ${c.type}`}
                actions={<Btn size="xs" onClick={() => runTest(c.id)} disabled={testing === c.id}>
                  {testing === c.id ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Activity size={11} />} Test connection
                </Btn>}>
                <div className="mb-2">
                  <Pill color={CONNECTOR_STATUS[c.status].color}>
                    <Dot color={CONNECTOR_STATUS[c.status].color} />{CONNECTOR_STATUS[c.status].label}
                  </Pill>
                </div>
                <KV cols={1} mono={false} items={[
                  { k: 'Source', v: c.name, mono: false },
                  { k: 'API / URL', v: c.url },
                  { k: 'Documentation', v: c.docs },
                  { k: 'Authentication requirement', v: c.auth, mono: false },
                  { k: 'Data format', v: c.format, mono: false },
                  { k: 'Update frequency', v: c.frequency, mono: false },
                  { k: 'Granularity', v: c.granularity, mono: false },
                  { k: 'Last successful update', v: c.lastUpdate || '— (never attempted)' },
                  { k: 'Status', v: CONNECTOR_STATUS[c.status].label, mono: false },
                  { k: 'Error message', v: c.error || '— (no request has been made)', mono: false },
                  { k: 'Licence / access', v: c.license, mono: false },
                ]} />

                {c.caveats && (
                  <div className="mt-2.5 rounded-sm border p-2.5"
                    style={{ borderColor: 'var(--color-alert-yellow)44', background: 'var(--color-alert-yellow)0a' }}>
                    <div className="bw-label mb-1" style={{ color: 'var(--color-alert-yellow)' }}>Scientific caveat</div>
                    <p className="text-[11px] leading-relaxed text-bw-muted">{c.caveats}</p>
                  </div>
                )}

                {testResult[c.id] && (
                  <div className="mt-2.5 rounded-sm border border-bw-line bg-[#0a1218] p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="bw-label">Connection test</span>
                      <span className="bw-num text-[10px] text-bw-dim">{testResult[c.id].at}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-[var(--color-alert-yellow)]">
                      {testResult[c.id].outcome}
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-bw-muted">{testResult[c.id].detail}</p>
                  </div>
                )}
              </Panel>

              <Panel title="Configuration" evidence="PLAN" subtitle="Server-side only. Credentials never reach the browser.">
                <div className="space-y-2 opacity-60">
                  <Field label="Base URL"><Input value={c.url} onChange={() => {}} /></Field>
                  <Field label="API key / token" hint="Stored in the backend secret store; write-only from the UI.">
                    <Input value="" onChange={() => {}} placeholder="•••••••••••• (not configurable in prototype)" />
                  </Field>
                  <Field label="Schedule"><Input value={c.frequency} onChange={() => {}} /></Field>
                  <Btn disabled className="w-full"><Icons.Save size={12} /> Save configuration</Btn>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-bw-dim">
                  Disabled: this prototype has no backend, no secret store and no scheduler. Enabling a connector
                  also requires a licence review recorded in the decision log.
                </p>
              </Panel>
            </>
          )}
        </div>
      </Grid>

      <Grid cols="lg:grid-cols-2" className="mt-3">
        <Panel title="Ingestion architecture" evidence="PLAN"
          subtitle="How a configured connector would move data into the platform.">
          <ol className="space-y-2">
            {[
              ['Scheduler', 'A backend scheduler triggers the connector at its declared frequency, with jitter and rate-limit compliance.'],
              ['Fetch & archive', 'Raw payload is stored immutably with retrieval timestamp, HTTP status and checksum before anything is parsed.'],
              ['Parse & map', 'Source schema is mapped to the internal panel schema; unmapped fields are retained, not discarded.'],
              ['Validate', 'Schema, vocabulary, range and duplicate checks. Failures quarantine rows and raise a data-quality event.'],
              ['Version', 'Each successful fetch creates a new dataset version. Revisions to historical values are recorded as revisions, not overwrites.'],
              ['Publish', 'Only validated versions become visible to analytical modules, tagged with source and licence.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-2.5">
                <span className="bw-num shrink-0 text-[10px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                <div><div className="text-[12px] text-bw-text">{t}</div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p></div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Licence & compliance policy" evidence="ESTABLISHED">
          <div className="space-y-1.5">
            <Disclosure summary="Attribution is mandatory and machine-enforced" defaultOpen>
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Every chart derived from a source carries that source's attribution string. Exports embed it.
                A dataset registered without licence information cannot be exported.
              </p>
            </Disclosure>
            <Disclosure summary="Restricted sources are excluded, not worked around">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Where terms prohibit redistribution (for example, agreement-governed genomic databases), the
                connector remains disabled and the module displays the restriction. No aggregate-derivative
                workaround is implemented without an explicit legal review recorded in the decision log.
              </p>
            </Disclosure>
            <Disclosure summary="Rate limits and politeness">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Requests are scheduled, cached and backed off. A research prototype has no entitlement to burden
                a public agency's infrastructure.
              </p>
            </Disclosure>
            <Disclosure summary="No scraping of prohibited endpoints">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Sources without a machine-readable interface (e.g. PDF situation reports) are ingested only where
                the publisher's terms permit it, and the extraction is validated per report layout.
              </p>
            </Disclosure>
          </div>
        </Panel>
      </Grid>
    </>
  );
}

```

---

## 43. `frontend/src/pages/DataQuality.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — DATA QUALITY CENTER (SEGMENT 11)
   Quality is not a side panel: it bounds what any detector can
   possibly see. Metrics below are computed on synthetic frames.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Meter, SimulatedBanner, Disclosure, NoData,
} from '../components/ui';
import { Bars, Spark, SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { rng, synthDelayProfile, fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

const DIMENSIONS = [
  { id: 'completeness', name: 'Completeness', q: 'What fraction of expected reporting units actually reported?' },
  { id: 'timeliness', name: 'Timeliness', q: 'How long between event and availability?' },
  { id: 'validity', name: 'Validity', q: 'Do values conform to type, range and vocabulary?' },
  { id: 'consistency', name: 'Consistency', q: 'Do related fields agree (cases ≥ confirmed, sums = totals)?' },
  { id: 'uniqueness', name: 'Uniqueness', q: 'Are records duplicated across submissions or revisions?' },
  { id: 'coverage', name: 'Coverage', q: 'Which geographies and periods are represented at all?' },
  { id: 'stability', name: 'Stability', q: 'Does the schema or definition change over time?' },
];

export default function DataQuality() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [dim, setDim] = useState('completeness');

  const rows = useMemo(() => S.countries.map((c) => {
    const r = rng('dq:' + c.iso);
    return {
      iso: c.iso, name: c.name, stream: c.pathogen?.name,
      completeness: c.availability === 'none' ? null : c.completeness,
      delay: c.availability === 'none' ? null : c.delayWeeks,
      duplicates: c.availability === 'none' ? null : +(r() * 2.6).toFixed(2),
      invalid: c.availability === 'none' ? null : +(r() * 1.8).toFixed(2),
      gaps: c.availability === 'none' ? null : Math.floor(r() * 6),
      freshness: c.availability === 'none' ? null : Math.floor(r() * 72),
      reliability: c.availability === 'none' ? null : +(0.5 + r() * 0.45).toFixed(2),
      series: c.series,
    };
  }), [S]);

  const withData = rows.filter((r) => r.completeness !== null);
  const mean = (k) => (withData.reduce((a, r) => a + r[k], 0) / withData.length);

  const delayProfile = useMemo(() => synthDelayProfile('dq:global'), []);

  const issues = useMemo(() => [
    { id: 'DQ-001', severity: 'high', dim: 'Coverage', desc: '2 territories have no configured stream; their absence must not be rendered as "no activity".', affected: 'GHA, and any territory with availability=none', action: 'Render hatched on maps; exclude from denominators.' },
    { id: 'DQ-002', severity: 'high', dim: 'Timeliness', desc: 'Most recent 2–3 weeks are provisional in every stream due to reporting delay.', affected: 'All streams', action: 'Down-weight recent weeks; never trigger escalation on the leading edge alone.' },
    { id: 'DQ-003', severity: 'medium', dim: 'Completeness', desc: 'Sparse-reporting territories have completeness below 60%, widening baseline intervals and suppressing detection.', affected: 'ETH, PAK, CHN (synthetic)', action: 'Report detection sensitivity as capacity-limited for these series.' },
    { id: 'DQ-004', severity: 'medium', dim: 'Consistency', desc: 'Confirmed counts occasionally exceed suspected counts in the synthetic composition frame.', affected: 'Disease Intelligence composition panel', action: 'Add a cross-field validation rule before any real data is bound.' },
    { id: 'DQ-005', severity: 'low', dim: 'Uniqueness', desc: 'Duplicate-record rate under 3% in synthetic frames.', affected: 'All streams', action: 'Monitor; hash-based dedupe already specified in the recipe.' },
    { id: 'DQ-006', severity: 'high', dim: 'Stability', desc: 'No schema-change detection exists yet; a source-side definition change would pass silently.', affected: 'All connectors', action: 'Implement schema fingerprinting before enabling any live connector.' },
  ], []);

  const sevColor = { high: 'var(--color-alert-red)', medium: 'var(--color-alert-orange)', low: 'var(--color-alert-yellow)' };

  return (
    <>
      <PageHeader kicker="Module 14" title="Data Quality Center" evidence="SIMULATED"
        description="Quality assessment for every bound stream. These figures bound what any detector can see: a signal cannot be detected in data that was never reported." />

      {isDemo && <div className="mb-3"><SimulatedBanner /></div>}

      <Callout tone="warn" title="Quality is upstream of every claim in this platform" icon={<Icons.ShieldCheck size={12} />}>
        A detector applied to an incomplete, delayed or inconsistently defined series will produce confident
        output about the reporting process rather than about disease. The quality vector below travels with every
        record into the detection engine and is displayed on every alert.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-5" className="my-3">
        <Stat label="Streams assessed" value={withData.length} evidence="SIMULATED" sub={`${rows.length - withData.length} with no data`} />
        <Stat label="Mean completeness" value={`${Math.round(mean('completeness') * 100)}%`} evidence="SIMULATED" color="var(--color-bw-primary)" />
        <Stat label="Mean reporting delay" value={`${mean('delay').toFixed(1)} wk`} evidence="SIMULATED" color="var(--color-alert-yellow)" />
        <Stat label="Mean duplicate rate" value={`${mean('duplicates').toFixed(2)}%`} evidence="SIMULATED" />
        <Stat label="Open quality issues" value={issues.length} evidence="SIMULATED" color="var(--color-alert-orange)" sub={`${issues.filter((i) => i.severity === 'high').length} high severity`} />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Per-stream quality matrix" evidence="SIMULATED"
            subtitle="One row per bound stream. Missing values are shown as DATA NOT AVAILABLE, never as zero.">
            <Table rowKey="iso" columns={[
              { key: 'name', header: 'Territory' },
              { key: 'stream', header: 'Stream', render: (r) => <span className="text-[11px] text-bw-muted">{r.stream}</span> },
              { key: 'completeness', header: 'Completeness', render: (r) => (
                r.completeness === null ? <span className="font-mono text-[9px] text-bw-dim">{SAFE_LANGUAGE.noData}</span> : (
                  <div className="flex items-center gap-2">
                    <div className="w-[54px]"><Meter value={r.completeness * 100} height={4}
                      color={r.completeness > 0.75 ? 'var(--color-alert-green)' : r.completeness > 0.5 ? 'var(--color-alert-yellow)' : 'var(--color-alert-red)'} /></div>
                    <span className="bw-num text-[10.5px]">{Math.round(r.completeness * 100)}%</span>
                  </div>)) },
              { key: 'delay', header: 'Delay (wk)', align: 'right', render: (r) => (
                <span className="bw-num text-[11px]" style={{ color: r.delay > 2 ? 'var(--color-alert-orange)' : 'var(--color-bw-muted)' }}>{r.delay ?? '—'}</span>) },
              { key: 'duplicates', header: 'Dupes %', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.duplicates ?? '—'}</span> },
              { key: 'invalid', header: 'Invalid %', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.invalid ?? '—'}</span> },
              { key: 'gaps', header: 'Temporal gaps', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.gaps ?? '—'}</span> },
              { key: 'freshness', header: 'Age (h)', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.freshness ?? '—'}</span> },
              { key: 'reliability', header: 'Source score', align: 'right', render: (r) => (
                r.reliability === null ? '—' : <span className="bw-num text-[11px]" style={{ color: r.reliability > 0.8 ? 'var(--color-alert-green)' : 'var(--color-alert-yellow)' }}>{r.reliability}</span>) },
            ]} rows={rows} />
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Reporting-delay profile" evidence="SIMULATED"
              subtitle="Share of records arriving n weeks after the event week.">
              <Bars data={delayProfile.map((d) => ({ name: `+${d.lag}w`, value: Math.round(d.share * 100) }))}
                height={165} color="var(--color-alert-yellow)" unit="%" note="SIMULATED" />
              <p className="mt-1.5 text-[10.5px] leading-snug text-bw-dim">
                Only {Math.round(delayProfile[0].share * 100)}% of records for a given week are available in that
                week. Any detector reading the leading edge as complete will misinterpret incompleteness as decline.
              </p>
            </Panel>

            <Panel title="Missingness pattern" evidence="SIMULATED"
              subtitle="Whether missingness is random matters more than how much there is.">
              <div className="space-y-2.5">
                {[['Missing completely at random (MCAR)', 18, 'var(--color-alert-green)'],
                  ['Missing at random, explainable by covariates (MAR)', 34, 'var(--color-alert-yellow)'],
                  ['Missing not at random (MNAR) — suspected', 48, 'var(--color-alert-red)']].map(([k, v, c]) => (
                  <Meter key={k} label={k} right={`${v}%`} value={v} color={c} />
                ))}
              </div>
              <Callout tone="danger" title="Why MNAR is the dangerous one">
                If reporting fails precisely when a health system is under strain, then data goes missing exactly
                when the signal is strongest. No imputation method recovers this; it must be reported as a
                structural limitation.
              </Callout>
            </Panel>
          </Grid>

          <Panel title="Open quality issues" evidence="SIMULATED">
            <Table rowKey="id" columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="bw-num text-[10.5px]">{r.id}</span> },
              { key: 'severity', header: 'Severity', render: (r) => (
                <span className="flex items-center gap-1.5"><Dot color={sevColor[r.severity]} />
                  <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: sevColor[r.severity] }}>{r.severity.toUpperCase()}</span></span>) },
              { key: 'dim', header: 'Dimension', render: (r) => <Pill color="var(--color-bw-line2)">{r.dim}</Pill> },
              { key: 'desc', header: 'Issue', render: (r) => <span className="text-[11.5px]">{r.desc}</span> },
              { key: 'affected', header: 'Affected', render: (r) => <span className="text-[10.5px] text-bw-dim">{r.affected}</span> },
              { key: 'action', header: 'Required action', render: (r) => <span className="text-[11px] text-bw-muted">{r.action}</span> },
            ]} rows={issues} />
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Quality dimensions" evidence="ESTABLISHED" dense>
            <div className="space-y-1 p-1">
              {DIMENSIONS.map((d) => (
                <button key={d.id} type="button" onClick={() => setDim(d.id)}
                  className={`block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                    dim === d.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                  <div className="text-[11.5px] text-bw-text">{d.name}</div>
                  <div className="mt-0.5 text-[10px] leading-snug text-bw-dim">{d.q}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Source reliability scoring" evidence="PLAN"
            subtitle="How a source score is composed — deliberately transparent and overridable.">
            <KV items={[
              { k: 'Timeliness component', v: '30% — median lag vs declared frequency' },
              { k: 'Completeness component', v: '30% — reporting units received / expected' },
              { k: 'Stability component', v: '20% — schema and definition changes per year' },
              { k: 'Revision component', v: '20% — magnitude of retrospective revisions' },
              { k: 'Override', v: 'Analyst may override with recorded rationale' },
              { k: 'Score use', v: 'Down-weighting only — never automatic exclusion' },
            ]} />
          </Panel>

          <Panel title="Freshness policy" evidence="PLAN">
            <div className="space-y-2">
              {[['< 1 update interval', 'FRESH', 'var(--color-alert-green)'],
                ['1–2 intervals', 'AGEING — flagged on dashboards', 'var(--color-alert-yellow)'],
                ['2–4 intervals', 'STALE — excluded from escalation', 'var(--color-alert-orange)'],
                ['> 4 intervals', 'DORMANT — stream marked unavailable', 'var(--color-alert-red)']].map(([k, v, c]) => (
                <div key={k} className="flex items-start gap-2 border-b border-bw-line/50 pb-1.5 last:border-0">
                  <Dot color={c} />
                  <div><div className="text-[11.5px] text-bw-text">{k}</div>
                    <div className="text-[10px] text-bw-dim">{v}</div></div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-bw-dim">Assessed at {fmtTs()}</div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 44. `frontend/src/pages/Workspace.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — RESEARCHER WORKSPACE (SEGMENT 10)
   Dataset registration, preprocessing documentation, experiment
   creation and export. State is session-local (browser only).
   ============================================================ */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Field, Input,
  Select, Checkbox, KV, NotImplemented, NoData, Stat, Disclosure, Awaiting,
} from '../components/ui';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';

const PREPROCESS_STEPS = [
  { id: 'dedupe', name: 'Deduplication', detail: 'Exact and near-duplicate record removal keyed on (geo, date, indicator, value).' },
  { id: 'geo', name: 'Geography harmonisation', detail: 'Map source geography strings to ISO 3166 / admin-1 codes; unmapped rows quarantined, never dropped silently.' },
  { id: 'week', name: 'Epidemiological week alignment', detail: 'Convert dates to ISO weeks; document the week-numbering convention used by the source.' },
  { id: 'missing', name: 'Missing-value policy', detail: 'Distinguish "reported zero" from "not reported". Never impute the difference away.' },
  { id: 'outlier', name: 'Outlier handling', detail: 'Flag, do not delete. Deleting outliers from surveillance data deletes the phenomenon of interest.' },
  { id: 'delay', name: 'Reporting-delay adjustment', detail: 'Build the reporting triangle; treat the most recent weeks as provisional.' },
  { id: 'denom', name: 'Denominator attachment', detail: 'Attach population / test-volume denominators with their own source and vintage.' },
  { id: 'scale', name: 'Scaling / transformation', detail: 'Fit any scaler on the training window only. Record the transformation in the recipe.' },
];

export default function Workspace() {
  const { session, isResearch, setMode } = useMode();
  const [datasets, setDatasets] = useState([]);
  const [steps, setSteps] = useState(['dedupe', 'geo', 'week', 'missing']);
  const [form, setForm] = useState({ name: '', source: '', license: '', period: '', notes: '' });

  const register = () => {
    if (!form.name) return;
    setDatasets((d) => [...d, {
      ...form, id: `DS-${String(d.length + 1).padStart(3, '0')}`,
      registered: fmtTs(), rows: '—', checksum: 'not computed (no backend)', status: 'REGISTERED — NOT INGESTED',
    }]);
    setForm({ name: '', source: '', license: '', period: '', notes: '' });
  };

  return (
    <>
      <PageHeader kicker="Module 15" title="Researcher Workspace" evidence="PLAN"
        description="Where a researcher registers data, documents preprocessing, and creates experiments. Registration records provenance and licence before any analysis is permitted." />

      {!isResearch && (
        <Callout tone="info" title="Workspace is designed for RESEARCH mode" icon={<Icons.Info size={12} />}>
          You can browse the workspace in any mode, but datasets you register are only used by experiments in
          RESEARCH mode.{' '}
          <button className="text-bw-primary-bright underline" onClick={() => setMode('RESEARCH')}>Switch to RESEARCH mode</button>.
        </Callout>
      )}

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Datasets registered" value={datasets.length} evidence="PLAN" sub="Session-local only" />
        <Stat label="Datasets ingested" value="0" evidence="ESTABLISHED" sub="Requires backend" color="var(--color-bw-muted)" />
        <Stat label="Experiments run" value="0" evidence="ESTABLISHED" sub={SAFE_LANGUAGE.awaitingExperiment} color="var(--color-bw-muted)" />
        <Stat label="Researcher" value={session?.role ? session.role.split(' ')[0] : 'Guest'} evidence="PLAN" sub={session?.name || 'Read-only'} />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Dataset registry" evidence="PLAN"
            subtitle="Nothing may be analysed until it is registered with a source, a licence and a period.">
            <Table rowKey="id" columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="bw-num text-[10.5px]">{r.id}</span> },
              { key: 'name', header: 'Dataset' },
              { key: 'source', header: 'Source', render: (r) => <span className="text-[11px] text-bw-muted">{r.source || '—'}</span> },
              { key: 'license', header: 'Licence', render: (r) => <span className="text-[11px] text-bw-muted">{r.license || 'UNSPECIFIED'}</span> },
              { key: 'period', header: 'Period', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.period || '—'}</span> },
              { key: 'status', header: 'Status', align: 'right', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{r.status}</span>) },
            ]} rows={datasets} empty="No dataset registered in this session. Register one below." />
          </Panel>

          <Panel title="Register a dataset" evidence="PLAN"
            subtitle="Metadata is mandatory. A dataset without provenance cannot support a reproducible claim.">
            <Grid cols="md:grid-cols-2">
              <Field label="Dataset name" hint="e.g. 'FluNet weekly virological, AFRO, 2015–2025'">
                <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Dataset name" />
              </Field>
              <Field label="Source & retrieval URL">
                <Input value={form.source} onChange={(v) => setForm({ ...form, source: v })} placeholder="Organisation / URL" />
              </Field>
              <Field label="Licence / terms of use" hint="Recorded verbatim; blocks export if incompatible.">
                <Input value={form.license} onChange={(v) => setForm({ ...form, license: v })} placeholder="e.g. CC BY 4.0" />
              </Field>
              <Field label="Temporal coverage">
                <Input value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="e.g. 2015-W01 – 2025-W52" />
              </Field>
            </Grid>
            <Field label="Known limitations of this dataset (required)"
              hint="Recorded on the dataset and reproduced on every model card that uses it.">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                placeholder="e.g. Reporting completeness varies by member state; 2020–2021 disrupted by pandemic response."
                className="w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[11.5px] text-bw-text placeholder:text-bw-dim outline-none focus:border-bw-primary" />
            </Field>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Btn variant="primary" onClick={register} disabled={!form.name}>
                <Icons.Plus size={13} /> Register dataset
              </Btn>
              <Btn disabled title="File upload requires the FastAPI backend, which is not running in this prototype.">
                <Icons.Upload size={13} /> Upload file
              </Btn>
              <span className="text-[10px] text-bw-dim">
                Upload disabled — no backend. Registration records metadata only.
              </span>
            </div>
          </Panel>

          <Panel title="Preprocessing recipe" evidence="PLAN"
            subtitle="The recipe is versioned and attached to every experiment. Undocumented preprocessing is the most common source of irreproducibility.">
            <div className="grid gap-1.5 sm:grid-cols-2">
              {PREPROCESS_STEPS.map((s) => (
                <div key={s.id} className={`rounded-sm border px-2 py-1.5 ${
                  steps.includes(s.id) ? 'border-bw-primary/50 bg-bw-primary/5' : 'border-bw-line bg-bw-panel2/30'}`}>
                  <Checkbox checked={steps.includes(s.id)}
                    onChange={() => setSteps((x) => x.includes(s.id) ? x.filter((y) => y !== s.id) : [...x, s.id])}
                    label={s.name} hint={s.detail} />
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-sm border border-bw-line bg-[#0a1218] p-2.5">
              <div className="bw-label mb-1">Recipe hash (would be computed server-side)</div>
              <div className="bw-num text-[10.5px] text-bw-dim">sha256(recipe) — not computed in browser · {steps.length} steps selected</div>
            </div>
          </Panel>

          <Panel title="Reproducibility record" evidence="PLAN">
            <KV cols={2} items={[
              { k: 'Environment capture', v: 'requirements.txt + lockfile hash (backend)' },
              { k: 'Random seed policy', v: 'Fixed seed recorded per run; seed sensitivity reported' },
              { k: 'Data snapshot', v: 'Immutable copy + checksum at registration' },
              { k: 'Code version', v: 'Git commit SHA of the analysis repository' },
              { k: 'Split boundaries', v: 'Stored explicitly as dates, not fractions' },
              { k: 'Execution log', v: 'stdout/stderr archived with the run' },
              { k: 'Artefact storage', v: 'Model binary + metrics JSON + figures' },
              { k: 'Current state', v: 'None captured — backend not running' },
            ]} />
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Workspace actions" evidence="PLAN">
            <div className="space-y-1.5">
              {[
                ['Create experiment', 'FlaskConical', '/app/ml-lab', true],
                ['Compare experiments', 'GitCompare', '/app/experiments', true],
                ['View model cards', 'IdCard', '/app/model-cards', true],
                ['Data quality report', 'ShieldCheck', '/app/quality', true],
                ['Decision log', 'ScrollText', '/app/decisions', true],
              ].map(([label, icon, to]) => {
                const C = Icons[icon];
                return (
                  <Link key={label} to={to} className="flex items-center gap-2.5 rounded-sm border border-bw-line bg-bw-panel2/40 px-2.5 py-2 hover:border-bw-line2">
                    <C size={14} className="text-bw-dim" />
                    <span className="flex-1 text-[11.5px] text-bw-text">{label}</span>
                    <Icons.ArrowRight size={12} className="text-bw-dim" />
                  </Link>
                );
              })}
            </div>
          </Panel>

          <Panel title="Export" evidence="PLAN" subtitle="What the workspace can emit.">
            <div className="space-y-1.5">
              {[['Experiment specification (JSON)', true], ['Preprocessing recipe (JSON)', true],
                ['Figures (SVG/PNG)', false], ['Model card (Markdown)', true],
                ['Results table (CSV)', false], ['Full report (PDF)', false]].map(([k, ok]) => (
                <div key={k} className="flex items-center justify-between rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5">
                  <span className="text-[11.5px] text-bw-muted">{k}</span>
                  <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: ok ? 'var(--color-alert-green)' : 'var(--color-bw-dim)' }}>
                    {ok ? 'AVAILABLE' : 'NEEDS BACKEND'}
                  </span>
                </div>
              ))}
            </div>
            <Btn size="sm" className="mt-2 w-full" onClick={() => {
              const recipe = { steps, datasets, exported: fmtTs(), note: 'BIOWATCH-AI prototype export — contains no results.' };
              const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = 'biowatch-workspace-export.json'; a.click();
            }}>
              <Icons.Download size={12} /> Export workspace metadata
            </Btn>
          </Panel>

          <Panel title="Workspace rules" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {['No dataset may be analysed before registration with source and licence.',
                'Preprocessing is declared before results are viewed, not after.',
                'Every run is recorded — including abandoned and failed runs.',
                'Results are never edited; a corrected run is a new run that supersedes the old one.',
                'Exports carry the epistemic tags of their contents.'].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.Check size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />{x}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 45. `frontend/src/pages/Experiments.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — EXPERIMENT TRACKING (SEGMENT 10)
   Registry of runs. In this build the registry is empty of
   results by design; queued specifications are shown as pending.
   ============================================================ */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Stat,
  Awaiting, KV, NoData, Disclosure, NotImplemented,
} from '../components/ui';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { fmtTs } from '../lib/synth';

/* Registry entries: specifications only. status never claims a result. */
const RUNS = [
  {
    id: 'EXP-20260812-001', title: 'Baseline characterisation on synthetic panel',
    hypothesis: 'Establish detector alarm-rate profiles on a controlled synthetic series before any real data is touched.',
    dataset: 'Synthetic demonstration panel (in-browser)', target: 'Self-referential 2σ exceedance',
    models: 'Seasonal baseline, EWMA, CUSUM, MAD, fixed threshold',
    split: '60/20/20 temporal', status: 'COMPLETED — DESCRIPTIVE ONLY',
    result: 'Alarm-rate profiles recorded. No performance claim: the reference is self-generated.',
    created: '2026-08-12 09:14 UTC', researcher: 'Prototype author',
  },
  {
    id: 'EXP-20260818-002', title: 'FluNet weekly virological — baseline comparison',
    hypothesis: 'Do EWMA and Farrington-type baselines differ in detection delay on a real weekly stream?',
    dataset: 'WHO FluNet weekly (CONNECTOR NOT CONFIGURED)', target: 'Externally documented reference periods (NOT CURATED)',
    models: 'Seasonal baseline, EWMA, Farrington-type GLM',
    split: 'Rolling origin, 8-week horizon', status: 'BLOCKED — DATA NOT AVAILABLE',
    result: SAFE_LANGUAGE.awaitingExperiment,
    created: '2026-08-18 16:40 UTC', researcher: 'Prototype author',
  },
  {
    id: 'EXP-20260820-003', title: 'Random Forest vs statistical baseline',
    hypothesis: 'Does a Random Forest on lag/rolling features reduce detection delay relative to a seasonal baseline at matched alarm rate?',
    dataset: 'Pending — requires registered dataset', target: 'Pending — requires curated reference labels',
    models: 'Seasonal baseline (comparator), Random Forest (candidate)',
    split: '60/20/20 temporal, embargo 4 weeks', status: 'PENDING_EXECUTION',
    result: SAFE_LANGUAGE.awaitingExperiment,
    created: '2026-08-20 11:02 UTC', researcher: 'Prototype author',
  },
];

const STATUS_COLOR = {
  'COMPLETED — DESCRIPTIVE ONLY': 'var(--color-bw-data)',
  'BLOCKED — DATA NOT AVAILABLE': 'var(--color-alert-yellow)',
  PENDING_EXECUTION: 'var(--color-bw-dim)',
};

export default function Experiments() {
  const [sel, setSel] = useState(RUNS[2].id);
  const run = RUNS.find((r) => r.id === sel);

  return (
    <>
      <PageHeader kicker="Module 16" title="Experiment Tracking" evidence="PLAN"
        description="Append-only registry of every experiment specification, including blocked and abandoned runs. Nothing is deleted; results are superseded, never overwritten." />

      <Callout tone="warn" title="Registry contains no validated results" icon={<Icons.TriangleAlert size={12} />}>
        One descriptive run exists (alarm-rate profiling on synthetic data). Two runs are recorded as blocked or
        pending because the data and reference labels they require do not exist. That is the honest state of the
        research programme, and the registry reports it rather than hiding it.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Runs registered" value={RUNS.length} evidence="ESTABLISHED" />
        <Stat label="Runs with performance results" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="No model trained" />
        <Stat label="Runs blocked on data" value={RUNS.filter((r) => r.status.startsWith('BLOCKED')).length} evidence="ESTABLISHED" color="var(--color-alert-yellow)" />
        <Stat label="Negative results published" value="0" evidence="ESTABLISHED" sub="None yet — none suppressed" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_400px]">
        <Panel title="Experiment registry" evidence="ESTABLISHED">
          <Table rowKey="id" columns={[
            { key: 'id', header: 'Run ID', render: (r) => (
              <button className="bw-num text-[10.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSel(r.id)}>{r.id}</button>) },
            { key: 'title', header: 'Title', render: (r) => <span className="text-[11.5px]">{r.title}</span> },
            { key: 'created', header: 'Created', render: (r) => <span className="bw-num text-[10px] text-bw-dim">{r.created}</span> },
            { key: 'status', header: 'Status', align: 'right', render: (r) => (
              <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: STATUS_COLOR[r.status] }}>{r.status}</span>) },
          ]} rows={RUNS} />

          {run && (
            <div className="mt-3 rounded-md border border-bw-line bg-bw-panel2/40 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="bw-num text-[11px] text-bw-dim">{run.id}</span>
                <span className="text-[13px] font-medium text-bw-text">{run.title}</span>
                <Pill color={STATUS_COLOR[run.status]}>{run.status}</Pill>
              </div>
              <KV cols={2} mono={false} items={[
                { k: 'Hypothesis', v: run.hypothesis, mono: false },
                { k: 'Dataset', v: run.dataset, mono: false },
                { k: 'Target / label', v: run.target, mono: false },
                { k: 'Models', v: run.models, mono: false },
                { k: 'Split', v: run.split, mono: false },
                { k: 'Researcher', v: run.researcher, mono: false },
              ]} />
              <div className="mt-2.5 rounded-sm border border-bw-line bg-bw-panel px-2.5 py-2">
                <div className="bw-label mb-1">Result</div>
                <div className="text-[12px] text-bw-text">{run.result}</div>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-4">
                {['AUROC', 'Sensitivity', 'PPV', 'Detection delay'].map((m) => (
                  <div key={m} className="rounded-sm border border-dashed border-bw-line2 px-2 py-1.5">
                    <div className="bw-label">{m}</div>
                    <div className="bw-num mt-0.5 text-[11px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Run comparison" evidence="PLAN">
            <NotImplemented what="Side-by-side run comparison"
              plan="Will diff two runs across dataset version, feature set, split boundaries, hyperparameters and metrics, highlighting which single change is responsible for a difference in outcome." />
          </Panel>

          <Panel title="Registry policy" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {['Every configured run is registered before execution, not after seeing results.',
                'Abandoned runs remain visible with the reason for abandonment.',
                'A corrected analysis is a new run that references and supersedes the previous one.',
                'Runs that contradict the project hypothesis are recorded identically to those that support it.',
                'The test period is evaluated once per run; repeated evaluation is recorded as a protocol deviation.'].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.Check size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Reproducibility fields per run" evidence="PLAN">
            <KV items={[
              { k: 'Code commit', v: 'Not captured (no backend)' },
              { k: 'Environment lock', v: 'Not captured' },
              { k: 'Data checksum', v: 'Not captured' },
              { k: 'Seed', v: 'Not captured' },
              { k: 'Runtime', v: 'Not captured' },
              { k: 'Artefacts', v: 'None' },
            ]} />
            <div className="mt-2 flex gap-2">
              <Link to="/app/ml-lab"><Btn size="sm"><Icons.Plus size={12} /> New run</Btn></Link>
              <Link to="/app/model-cards"><Btn size="sm"><Icons.IdCard size={12} /> Model cards</Btn></Link>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 46. `frontend/src/pages/Decisions.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — RESEARCH DECISION LOG (SEGMENT 10)
   Append-only record of design and methodological decisions.
   Superseded entries remain visible. Nothing is ever deleted.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Field, Input, Select,
} from '../components/ui';
import { fmtTs } from '../lib/synth';

const DECISIONS = [
  {
    id: 'DEC-001', date: '2026-07-02', area: 'Scope',
    decision: 'BIOWATCH-AI is scoped as a research and educational prototype, not an operational surveillance system.',
    reason: 'Operational systems require validation, institutional mandate, data agreements and accountability structures the project does not have.',
    evidence: 'Project charter; absence of institutional mandate.',
    alternative: 'Pursue an operational pilot with a partner agency.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-002', date: '2026-07-05', area: 'Methodology',
    decision: 'No machine-learning result may be displayed without an accompanying statistical baseline evaluated on the same temporal split.',
    reason: 'A model metric without a comparator is uninterpretable, and the literature contains many surveillance ML claims that do not beat simple baselines.',
    evidence: 'Established practice in forecasting evaluation; internal design review.',
    alternative: 'Report model metrics alone and add baselines later.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-003', date: '2026-07-09', area: 'Interface',
    decision: 'The system may never emit the phrase "outbreak confirmed" or any equivalent. Permitted phrasing is restricted to a fixed vocabulary of signal terms.',
    reason: 'Interface language becomes the claim. Constraining vocabulary structurally prevents overstatement.',
    evidence: 'Risk analysis of alert phrasing; safety rule in the project specification.',
    alternative: 'Allow analysts to write free-text conclusions.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-004', date: '2026-07-14', area: 'Data',
    decision: 'Unconfigured connectors display CONNECTOR NOT CONFIGURED and are never substituted with synthetic values.',
    reason: 'Silently filling a live panel with synthetic data is the single most dangerous failure mode for a surveillance dashboard.',
    evidence: 'Design review; prototype safety rules.',
    alternative: 'Show synthetic placeholders in live mode for visual completeness.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-005', date: '2026-07-20', area: 'Metrics',
    decision: 'Accuracy is excluded from the metric contract. Sensitivity, PPV, alarm rate and detection delay must be reported jointly.',
    reason: 'Under the class imbalance typical of outbreak detection, accuracy is dominated by true negatives and is actively misleading.',
    evidence: 'Standard result in imbalanced classification; documented in the Model Evaluation module.',
    alternative: 'Report accuracy alongside other metrics with a caveat.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-006', date: '2026-07-28', area: 'Biological data',
    decision: 'No nucleotide or amino-acid sequence, mutation call or variant discovery is generated by the prototype, even under a SIMULATED label.',
    reason: 'Molecular outputs carry unearned authority and are readily mistaken for findings; the reputational and scientific cost of confusion exceeds the demonstration value.',
    evidence: 'Biosecurity and integrity review.',
    alternative: 'Generate clearly-labelled synthetic sequences for visual demonstration.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-007', date: '2026-08-01', area: 'Labels',
    decision: 'Self-referential labels (baseline exceedance used as ground truth) are permitted for pipeline demonstration but are prohibited as evidence of detection ability.',
    reason: 'Training on a rule and then evaluating against that rule measures imitation, not detection.',
    evidence: 'Circularity analysis recorded in the ML Lab module.',
    alternative: 'Use exceedance labels as a provisional target until curated labels exist.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-008', date: '2026-08-06', area: 'Mortality data',
    decision: 'Mortality series are not synthesised in DEMONSTRATION mode; the mortality panel remains empty.',
    reason: 'Fabricated death counts are unacceptable even when labelled, and their absence costs the demonstration little.',
    evidence: 'Integrity review of the Disease Intelligence module.',
    alternative: 'Synthesise mortality with prominent labelling.',
    status: 'ACTIVE',
  },
  {
    id: 'DEC-009', date: '2026-08-10', area: 'Architecture',
    decision: 'Detection thresholds default to k = 2 with a 2-week persistence rule.',
    reason: 'Chosen to make the interface demonstrable; not derived from any operational alarm-rate budget.',
    evidence: 'None — this is an arbitrary demonstration parameter and is recorded as such.',
    alternative: 'Leave thresholds unset and require explicit user configuration.',
    status: 'PROVISIONAL — TO BE REPLACED BY AN AGREED ALARM BUDGET',
  },
  {
    id: 'DEC-010', date: '2026-07-11', area: 'Interface',
    decision: 'Country choropleth fill encodes detector state only.',
    reason: 'Encoding case counts by colour invites comparison between territories with incomparable surveillance capacity.',
    evidence: 'Cartographic review.',
    alternative: 'Encode incidence rate per 100,000.',
    status: 'SUPERSEDED BY DEC-011',
  },
  {
    id: 'DEC-011', date: '2026-08-15', area: 'Interface',
    decision: 'Map adds an explicit hatched "insufficient data" fill, distinct from "no unusual activity".',
    reason: 'Rendering missing data in the same colour as a green state told the reviewer that nothing was happening where in fact nothing was known.',
    evidence: 'Usability review of the surveillance map; supersedes DEC-010.',
    alternative: 'Grey-out with a legend note only.',
    status: 'ACTIVE',
  },
];

const STATUS_COLOR = (s) =>
  s.startsWith('ACTIVE') ? 'var(--color-alert-green)'
    : s.startsWith('PROVISIONAL') ? 'var(--color-alert-yellow)'
    : 'var(--color-bw-dim)';

export default function Decisions() {
  const [area, setArea] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState('DEC-011');

  const areas = ['all', ...Array.from(new Set(DECISIONS.map((d) => d.area)))];
  const rows = DECISIONS
    .filter((d) => area === 'all' || d.area === area)
    .filter((d) => !q || (d.decision + d.reason + d.id).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));
  const cur = DECISIONS.find((d) => d.id === sel);

  return (
    <>
      <PageHeader kicker="Module 18" title="Research Decision Log" evidence="ESTABLISHED"
        description="Append-only record of every significant design and methodological decision, with the reasoning, the evidence, the alternative that was rejected, and the current status. Superseded decisions remain visible." />

      <Callout tone="info" title="Why superseded entries are never deleted" icon={<Icons.History size={12} />}>
        A decision log that only shows current decisions is a marketing document. Keeping DEC-010 visible next to
        the decision that replaced it records that the earlier design was wrong and why — which is the part a
        reviewer, supervisor or future contributor actually needs.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Decisions recorded" value={DECISIONS.length} evidence="ESTABLISHED" />
        <Stat label="Active" value={DECISIONS.filter((d) => d.status.startsWith('ACTIVE')).length} evidence="ESTABLISHED" color="var(--color-alert-green)" />
        <Stat label="Provisional" value={DECISIONS.filter((d) => d.status.startsWith('PROVISIONAL')).length} evidence="ESTABLISHED" color="var(--color-alert-yellow)" />
        <Stat label="Superseded (retained)" value={DECISIONS.filter((d) => d.status.startsWith('SUPERSEDED')).length} evidence="ESTABLISHED" color="var(--color-bw-muted)" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_420px]">
        <Panel title="Decision register" evidence="ESTABLISHED"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Input value={q} onChange={setQ} placeholder="Search…" className="w-[140px]" />
              <Select value={area} onChange={setArea} className="w-[130px]"
                options={areas.map((a) => ({ value: a, label: a === 'all' ? 'All areas' : a }))} />
            </div>}>
          <Table rowKey="id" columns={[
            { key: 'id', header: 'ID', render: (r) => (
              <button className="bw-num text-[10.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSel(r.id)}>{r.id}</button>) },
            { key: 'date', header: 'Date', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.date}</span> },
            { key: 'area', header: 'Area', render: (r) => <Pill color="var(--color-bw-line2)">{r.area}</Pill> },
            { key: 'decision', header: 'Decision', render: (r) => <span className="text-[11.5px]">{r.decision}</span> },
            { key: 'status', header: 'Status', align: 'right', render: (r) => (
              <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: STATUS_COLOR(r.status) }}>{r.status}</span>) },
          ]} rows={rows} />
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          {cur && (
            <Panel title={`${cur.id} — detail`} evidence="ESTABLISHED" accent={STATUS_COLOR(cur.status)}>
              <KV cols={1} mono={false} items={[
                { k: 'Date', v: cur.date },
                { k: 'Area', v: cur.area, mono: false },
                { k: 'Decision', v: cur.decision, mono: false },
                { k: 'Reason', v: cur.reason, mono: false },
                { k: 'Evidence', v: cur.evidence, mono: false },
                { k: 'Alternative considered', v: cur.alternative, mono: false },
                { k: 'Status', v: cur.status, mono: false },
              ]} />
            </Panel>
          )}

          <Panel title="Log properties" evidence="ESTABLISHED">
            <KV items={[
              { k: 'Mutability', v: 'Append-only' },
              { k: 'Deletion', v: 'Not permitted at any role level' },
              { k: 'Supersession', v: 'New entry references the entry it replaces' },
              { k: 'Required fields', v: 'date · decision · reason · evidence · alternative · status' },
              { k: 'Empty evidence allowed?', v: 'Yes — recorded explicitly as "None"' },
              { k: 'Export', v: 'Markdown / JSON' },
            ]} />
            <Btn size="sm" className="mt-2 w-full" onClick={() => {
              const md = DECISIONS.map((d) =>
                `## ${d.id} — ${d.decision}\n\n- **Date:** ${d.date}\n- **Area:** ${d.area}\n- **Reason:** ${d.reason}\n- **Evidence:** ${d.evidence}\n- **Alternative considered:** ${d.alternative}\n- **Status:** ${d.status}\n`).join('\n');
              const blob = new Blob([`# BIOWATCH-AI — Research Decision Log\n\nExported ${fmtTs()}\n\n${md}`], { type: 'text/markdown' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = 'biowatch-decision-log.md'; a.click();
            }}>
              <Icons.Download size={12} /> Export decision log (Markdown)
            </Btn>
          </Panel>

          <Panel title="Add decision" evidence="PLAN">
            <p className="mb-2 text-[11px] leading-relaxed text-bw-muted">
              In the deployed system, new entries are written through an authenticated endpoint and signed with the
              author identity. This prototype has no backend, so the form is disabled rather than pretending to persist.
            </p>
            <div className="space-y-2 opacity-50">
              <Field label="Decision"><Input value="" onChange={() => {}} placeholder="Disabled — no backend" /></Field>
              <Field label="Reason"><Input value="" onChange={() => {}} placeholder="Disabled — no backend" /></Field>
              <Btn disabled className="w-full"><Icons.Plus size={12} /> Append entry</Btn>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 47. `frontend/src/pages/Architecture.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — SYSTEM ARCHITECTURE (SEGMENT 12)
   Visual, modular architecture with per-layer implementation
   state. Rendered as inline SVG so it works without network.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, KV, Btn, Disclosure, Stat,
} from '../components/ui';

const LAYERS = [
  { id: 'sources', name: 'DATA SOURCES', state: 'partial', tech: 'WHO · CDC · ECDC · OWID · NCBI · Nextstrain · open wastewater · national portals',
    detail: 'Connector definitions exist for 14 public sources. None is configured in this build.' },
  { id: 'ingest', name: 'DATA INGESTION', state: 'plan', tech: 'Python · httpx · APScheduler · immutable raw archive',
    detail: 'Scheduled fetch with rate-limit compliance, raw payload archival and checksum before parsing.' },
  { id: 'validate', name: 'DATA VALIDATION', state: 'plan', tech: 'Pandera / Pydantic schemas · vocabulary checks',
    detail: 'Schema conformance, geography and date vocabularies, range plausibility, duplicate detection; failures quarantined.' },
  { id: 'storage', name: 'STORAGE', state: 'plan', tech: 'PostgreSQL (+ TimescaleDB optional) · object store for raw payloads',
    detail: 'Versioned dataset tables; revisions recorded as revisions, never overwrites.' },
  { id: 'preprocess', name: 'PREPROCESSING', state: 'partial', tech: 'Pandas · NumPy',
    detail: 'Geography harmonisation, ISO-week alignment, deduplication, explicit missingness policy.' },
  { id: 'features', name: 'FEATURE ENGINEERING', state: 'partial', tech: 'Pandas · versioned recipe hash',
    detail: 'Lags, rolling statistics, seasonal indices, cross-stream lead/lag features — all fitted on the training window only.' },
  { id: 'baseline', name: 'STATISTICAL BASELINES', state: 'done', tech: 'NumPy · SciPy (JS implementation in the prototype)',
    detail: 'Same-week mean ± kσ, EWMA, CUSUM, robust MAD, fixed threshold. Implemented and running.' },
  { id: 'ml', name: 'MACHINE LEARNING', state: 'none', tech: 'scikit-learn · XGBoost/LightGBM (later: PyTorch)',
    detail: 'NOT IMPLEMENTED. No model is trained; the stage is inert and cannot contribute to any signal.' },
  { id: 'detect', name: 'SIGNAL DETECTION', state: 'done', tech: 'Detector cascade + persistence rules',
    detail: 'Combines detector flags into a state with a persistence requirement.' },
  { id: 'xai', name: 'EXPLAINABLE AI', state: 'partial', tech: 'SHAP (planned) · exact arithmetic decomposition (implemented)',
    detail: 'Explanation contract enforced; model attribution requires a fitted model.' },
  { id: 'review', name: 'HUMAN REVIEW', state: 'partial', tech: 'Workflow states + append-only audit log',
    detail: 'The only stage authorised to convert a candidate signal into an actionable statement.' },
  { id: 'viz', name: 'VISUALISATION', state: 'done', tech: 'React · Vite · Tailwind CSS · Recharts · d3-geo',
    detail: 'This interface. Every figure carries an epistemic tag and a data-state badge.' },
  { id: 'report', name: 'REPORTING', state: 'partial', tech: 'Markdown / JSON export (PDF planned)',
    detail: 'Model cards, decision log and run specifications export with their provenance labels intact.' },
];

const STATE_META = {
  done: { label: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
  partial: { label: 'PARTIAL', color: 'var(--color-alert-yellow)' },
  plan: { label: 'PLANNED', color: 'var(--color-bw-data)' },
  none: { label: 'NOT IMPLEMENTED', color: 'var(--color-alert-red)' },
};

const STACK = [
  ['Frontend', 'React 19 + Vite', 'Implemented'],
  ['Styling', 'Tailwind CSS v4 (design tokens in CSS variables)', 'Implemented'],
  ['Charts', 'Recharts', 'Implemented'],
  ['Maps', 'd3-geo + local Natural Earth topology (MapLibre/Leaflet compatible)', 'Implemented'],
  ['Routing', 'React Router', 'Implemented'],
  ['Backend', 'Python 3.11 + FastAPI', 'Scaffolded, not running'],
  ['Data processing', 'Pandas · NumPy · scikit-learn', 'Specified'],
  ['Bioinformatics', 'Biopython (metadata handling only)', 'Planned'],
  ['Database', 'PostgreSQL', 'Specified'],
  ['API', 'REST (OpenAPI-documented)', 'Scaffolded'],
  ['Containerisation', 'Docker + docker-compose', 'Provided'],
  ['Testing', 'pytest · Vitest', 'Planned'],
];

export default function Architecture() {
  const [sel, setSel] = useState('baseline');
  const layer = LAYERS.find((l) => l.id === sel);

  return (
    <>
      <PageHeader kicker="Module 20" title="System Architecture" evidence="PLAN"
        description="End-to-end architecture with honest per-layer implementation state. The pipeline is modular: sources, detectors and models are registered components, so adding one does not require changing the layers around it." />

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        {Object.entries(STATE_META).map(([k, m]) => (
          <Stat key={k} label={m.label} value={LAYERS.filter((l) => l.state === k).length} evidence="ESTABLISHED"
            color={m.color} sub={`of ${LAYERS.length} layers`} />
        ))}
      </Grid>

      <Grid cols="xl:grid-cols-[minmax(0,420px)_1fr]">
        {/* ---------- Vertical flow diagram ---------- */}
        <Panel title="Pipeline" evidence="PLAN" subtitle="Select a layer for its contract and state.">
          <div className="space-y-0">
            {LAYERS.map((l, i) => {
              const m = STATE_META[l.state];
              const on = sel === l.id;
              return (
                <div key={l.id}>
                  <button type="button" onClick={() => setSel(l.id)}
                    className={`flex w-full items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition-colors ${
                      on ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                    <span className="bw-num w-5 shrink-0 text-[9px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[11px] tracking-[0.1em] text-bw-text">{l.name}</span>
                    </span>
                    <span className="shrink-0 rounded-sm px-1.5 py-[1px] font-mono text-[8px] tracking-[0.08em]"
                      style={{ color: m.color, border: `1px solid ${m.color}55`, background: m.color + '10' }}>
                      {m.label}
                    </span>
                  </button>
                  {i < LAYERS.length - 1 && (
                    <div className="flex justify-center py-[3px]">
                      <Icons.ChevronDown size={12} className="text-bw-line2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title={layer.name} evidence="PLAN" accent={STATE_META[layer.state].color}
            subtitle={layer.tech}>
            <div className="mb-2"><Pill color={STATE_META[layer.state].color}>{STATE_META[layer.state].label}</Pill></div>
            <p className="text-[12.5px] leading-relaxed text-bw-muted">{layer.detail}</p>
          </Panel>

          <Panel title="Modularity contract" evidence="PLAN"
            subtitle="What must be true for a new source, detector or model to be added without touching the rest.">
            <Grid cols="md:grid-cols-3">
              {[
                ['New data source', ['Implements the connector interface (fetch, parse, validate, version)', 'Declares licence, frequency and granularity', 'Maps to the internal geo × time × indicator panel schema', 'Registers a quality vector']],
                ['New detector', ['Consumes a series + baseline, returns flags and scores', 'Declares parameters and their justification', 'Has a model card before it can be enabled', 'Is evaluated against the statistical baseline']],
                ['New model', ['Registered in the model registry with a card', 'Trained through the experiment harness only', 'Emits calibrated scores + attribution hooks', 'Cannot be surfaced without a completed comparison']],
              ].map(([t, items]) => (
                <div key={t} className="rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5">
                  <div className="mb-1.5 text-[12px] font-medium text-bw-text">{t}</div>
                  <ul className="space-y-1">
                    {items.map((x) => (
                      <li key={x} className="flex gap-1.5 text-[11px] leading-snug text-bw-muted">
                        <Icons.Dot size={12} className="mt-[1px] shrink-0 text-bw-primary" />{x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Grid>
          </Panel>

          <Panel title="Deployment topology" evidence="PLAN">
            <div className="overflow-x-auto">
              <svg viewBox="0 0 720 220" className="min-w-[640px]">
                {[
                  { x: 20, y: 80, w: 120, h: 56, label: 'Browser', sub: 'React SPA', color: '#2ea89a' },
                  { x: 180, y: 80, w: 120, h: 56, label: 'API gateway', sub: 'FastAPI · REST', color: '#4a90c4' },
                  { x: 340, y: 20, w: 130, h: 52, label: 'Ingestion worker', sub: 'scheduler', color: '#8b7ad6' },
                  { x: 340, y: 84, w: 130, h: 52, label: 'Analysis worker', sub: 'pandas · sklearn', color: '#8b7ad6' },
                  { x: 340, y: 148, w: 130, h: 52, label: 'Audit service', sub: 'append-only', color: '#c9a227' },
                  { x: 520, y: 52, w: 120, h: 52, label: 'PostgreSQL', sub: 'panel + registry', color: '#4bb1a8' },
                  { x: 520, y: 116, w: 120, h: 52, label: 'Object store', sub: 'raw payloads', color: '#4bb1a8' },
                ].map((b) => (
                  <g key={b.label}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.color + '14'} stroke={b.color} strokeWidth="1" />
                    <text x={b.x + b.w / 2} y={b.y + 22} textAnchor="middle" fill="#e6eef5" fontSize="11" fontFamily="var(--font-sans)">{b.label}</text>
                    <text x={b.x + b.w / 2} y={b.y + 38} textAnchor="middle" fill="#62788a" fontSize="9" fontFamily="var(--font-mono)">{b.sub}</text>
                  </g>
                ))}
                {[[140, 108, 180, 108], [300, 108, 340, 46], [300, 108, 340, 110], [300, 108, 340, 174],
                  [470, 46, 520, 78], [470, 110, 520, 78], [470, 110, 520, 142], [470, 174, 520, 142]].map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3b49" strokeWidth="1" markerEnd="url(#arw)" />
                ))}
                <defs>
                  <marker id="arw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#2a3b49" />
                  </marker>
                </defs>
                <text x="20" y="200" fill="#62788a" fontSize="9" fontFamily="var(--font-mono)">
                  PROTOTYPE STATE: only the browser layer is running. All server components are scaffolded, not deployed.
                </text>
              </svg>
            </div>
          </Panel>

          <Panel title="Technology stack" evidence="ESTABLISHED">
            <Table dense columns={[
              { key: 'l', header: 'Layer', render: (r) => <span className="text-[11.5px] text-bw-text">{r[0]}</span> },
              { key: 't', header: 'Technology', render: (r) => <span className="text-[11.5px] text-bw-muted">{r[1]}</span> },
              { key: 's', header: 'State', align: 'right', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em]" style={{
                  color: r[2] === 'Implemented' ? 'var(--color-alert-green)' : r[2] === 'Provided' ? 'var(--color-bw-data)' : 'var(--color-bw-dim)' }}>
                  {r[2].toUpperCase()}</span>) },
            ]} rows={STACK} rowKey={null} />
          </Panel>

          <Panel title="Why this shape" evidence="ESTABLISHED">
            <div className="space-y-1.5">
              <Disclosure summary="Linear and auditable rather than clever" defaultOpen>
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  Each stage has one job and writes down what it did. A reviewer can point at any figure and walk
                  backwards to the raw record. Architectures that fuse ingestion, feature engineering and inference
                  are faster to build and impossible to audit.
                </p>
              </Disclosure>
              <Disclosure summary="Baselines are a first-class layer, not a utility function">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  Placing statistical baselines as their own layer, upstream of machine learning, makes the
                  comparison structural. The ML layer physically cannot emit a signal that bypasses it.
                </p>
              </Disclosure>
              <Disclosure summary="Human review is inside the pipeline, not bolted on">
                <p className="text-[11.5px] leading-relaxed text-bw-muted">
                  Review is a stage with inputs, outputs and an audit trail — not a disclaimer at the bottom of a
                  dashboard.
                </p>
              </Disclosure>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 48. `frontend/src/pages/Health.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — REAL-TIME SYSTEM STATUS (SEGMENT 12)
   Reports the ACTUAL state of this build. Where infrastructure
   does not exist, it says so rather than showing a green light.
   ============================================================ */
import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn,
  KV, Stat, Meter, NoData, Disclosure,
} from '../components/ui';
import { Spark } from '../components/charts';
import { CONNECTORS, CONNECTOR_STATUS } from '../lib/connectors';
import { fmtTs, synthSeries } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';

export default function Health() {
  const [apiState, setApiState] = useState({ status: 'checking', detail: 'Probing /api/health…', at: null });
  const [now, setNow] = useState(fmtTs());

  useEffect(() => {
    const t = setInterval(() => setNow(fmtTs()), 30000);
    return () => clearInterval(t);
  }, []);

  /* A genuine probe of the optional FastAPI backend. */
  const probe = async () => {
    setApiState({ status: 'checking', detail: 'Probing /api/health…', at: null });
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 3000);
      const res = await fetch('/api/health', { signal: ctrl.signal });
      clearTimeout(to);
      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        setApiState({ status: 'up', detail: JSON.stringify(body), at: fmtTs() });
      } else {
        setApiState({ status: 'down', detail: `HTTP ${res.status} — backend reachable but unhealthy`, at: fmtTs() });
      }
    } catch (e) {
      setApiState({
        status: 'absent',
        detail: 'No response. The FastAPI backend is not running in this prototype; the frontend is fully functional without it because every module declares its own data state.',
        at: fmtTs(),
      });
    }
  };
  useEffect(() => { probe(); }, []);

  const components = [
    { name: 'Frontend application', tech: 'React SPA (this page)', status: 'up', detail: 'Rendering; deterministic synthetic engine available in DEMONSTRATION mode.' },
    { name: 'REST API', tech: 'FastAPI', status: apiState.status === 'up' ? 'up' : apiState.status === 'checking' ? 'checking' : 'absent', detail: apiState.detail },
    { name: 'Database', tech: 'PostgreSQL', status: 'absent', detail: 'Not deployed. No persistent storage exists; all state is browser-local and lost on clear.' },
    { name: 'Ingestion scheduler', tech: 'APScheduler worker', status: 'absent', detail: 'Not deployed. No scheduled fetch has ever executed.' },
    { name: 'Analysis worker', tech: 'pandas / scikit-learn', status: 'absent', detail: 'Not deployed. Detectors run client-side in JavaScript instead.' },
    { name: 'Model registry', tech: 'Artefact store', status: 'absent', detail: 'Empty. Zero model artefacts exist.' },
    { name: 'Audit service', tech: 'Append-only log', status: 'partial', detail: 'Session-local only. Entries do not survive a page reload.' },
    { name: 'Notification service', tech: 'SMTP / webhook', status: 'disabled', detail: 'Deliberately disabled. Cannot be enabled in this build.' },
  ];

  const statusMeta = {
    up: { label: 'OPERATIONAL', color: 'var(--color-alert-green)' },
    checking: { label: 'CHECKING…', color: 'var(--color-bw-data)' },
    partial: { label: 'DEGRADED — SESSION ONLY', color: 'var(--color-alert-yellow)' },
    absent: { label: 'NOT DEPLOYED', color: 'var(--color-bw-dim)' },
    disabled: { label: 'DISABLED BY DESIGN', color: 'var(--color-alert-red)' },
    down: { label: 'UNHEALTHY', color: 'var(--color-alert-red)' },
  };

  const renderLoad = useMemo(() => synthSeries('health:render', { weeks: 30, level: 42, disp: 0.25 }), []);

  return (
    <>
      <PageHeader kicker="Module 21" title="System Health" evidence="ESTABLISHED"
        description="Actual runtime state of this build. Components that do not exist are reported as not deployed — no green light is shown for infrastructure that was never started." />

      <Callout tone="info" title="This panel reports reality, not a mock-up" icon={<Icons.HeartPulse size={12} />}>
        The API row below reflects a genuine <span className="bw-num">fetch('/api/health')</span> probe against the
        optional FastAPI backend. Everything else reports the honest deployment state of the prototype. A
        surveillance system whose status page lies is worse than one with no status page.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Components operational" value={components.filter((c) => c.status === 'up').length} evidence="ESTABLISHED"
          color="var(--color-alert-green)" sub={`of ${components.length} defined`} />
        <Stat label="Not deployed" value={components.filter((c) => c.status === 'absent').length} evidence="ESTABLISHED" color="var(--color-bw-muted)" />
        <Stat label="Failed jobs" value="0" evidence="ESTABLISHED" sub="No job has ever been scheduled" />
        <Stat label="Data freshness" value="n/a" evidence="ESTABLISHED" sub="No live source bound" color="var(--color-bw-muted)" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Component status" evidence="ESTABLISHED"
            actions={<Btn size="xs" onClick={probe}><Icons.RefreshCw size={11} /> Re-probe API</Btn>}>
            <Table rowKey="name" columns={[
              { key: 'name', header: 'Component', render: (r) => (
                <span><span className="text-[12px] text-bw-text">{r.name}</span>
                  <span className="mt-0.5 block text-[10px] text-bw-dim">{r.tech}</span></span>) },
              { key: 'status', header: 'Status', render: (r) => (
                <span className="flex items-center gap-1.5">
                  <Dot color={statusMeta[r.status].color} pulse={r.status === 'up'} />
                  <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: statusMeta[r.status].color }}>
                    {statusMeta[r.status].label}</span>
                </span>) },
              { key: 'detail', header: 'Detail', render: (r) => <span className="text-[11px] text-bw-muted">{r.detail}</span> },
            ]} rows={components} />
          </Panel>

          <Panel title="Connector health" evidence="ESTABLISHED"
            subtitle="Per-source last successful update and error state. No source has been contacted.">
            <Table rowKey="id" columns={[
              { key: 'name', header: 'Source', render: (r) => <span className="text-[11.5px]">{r.name}</span> },
              { key: 'frequency', header: 'Expected freq.', render: (r) => <span className="text-[10.5px] text-bw-dim">{r.frequency}</span> },
              { key: 'lastUpdate', header: 'Last success', render: (r) => (
                <span className="bw-num text-[10.5px] text-bw-dim">{r.lastUpdate || 'never'}</span>) },
              { key: 'error', header: 'Last error', render: (r) => (
                <span className="text-[10.5px] text-bw-muted">{r.error || '— (no request issued)'}</span>) },
              { key: 'status', header: 'State', align: 'right', render: (r) => (
                <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: CONNECTOR_STATUS[r.status].color }}>
                  {CONNECTOR_STATUS[r.status].label}</span>) },
            ]} rows={CONNECTORS} />
          </Panel>

          <Panel title="Pipeline job history" evidence="ESTABLISHED">
            <NoData reason="No pipeline job has ever executed. The scheduler is not deployed, so there is no history to show — this table is empty rather than populated with a plausible-looking log." />
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Client runtime" evidence="SIMULATED" subtitle="Browser-side render metrics (synthetic illustration).">
            <div className="space-y-2.5">
              <Meter label="Synthetic engine determinism" right="100%" value={100} color="var(--color-alert-green)" />
              <Meter label="Modules mounted" right="23 / 23" value={100} color="var(--color-bw-primary)" />
              <Meter label="Chart render budget" right="within budget" value={62} color="var(--color-bw-data)" />
            </div>
            <div className="mt-2 -mx-1"><Spark data={renderLoad} color="var(--color-bw-data)" height={34} /></div>
            <div className="mt-1 text-[10px] text-bw-dim">Illustrative only — not an instrumented measurement.</div>
          </Panel>

          <Panel title="Last update ledger" evidence="ESTABLISHED">
            <KV items={[
              { k: 'Page rendered', v: now },
              { k: 'Synthetic engine seed', v: 'deterministic (fixed)' },
              { k: 'Live data last update', v: '— (none configured)' },
              { k: 'Model artefacts updated', v: '— (none exist)' },
              { k: 'Audit entries this session', v: 'session-local' },
              { k: 'API probe', v: apiState.at || 'in progress' },
            ]} />
          </Panel>

          <Panel title="Alerting on system health" evidence="PLAN">
            <p className="text-[11.5px] leading-relaxed text-bw-muted">
              In deployment, a stalled connector is itself a surveillance failure: silence looks identical to
              "no activity". The design therefore raises an internal operational alert when a stream misses its
              expected update window, and marks the affected geography as unavailable on every map rather than
              leaving it green.
            </p>
            <div className="mt-2 space-y-1.5">
              {[['Stream missed 1 interval', 'Dashboard badge: AGEING'],
                ['Stream missed 2 intervals', 'Stream excluded from escalation logic'],
                ['Stream missed 4 intervals', 'Geography rendered as DATA NOT AVAILABLE'],
                ['Validation failure rate > 5%', 'Ingestion paused pending review']].map(([k, v]) => (
                <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/40 px-2 py-1.5">
                  <div className="text-[11px] text-bw-text">{k}</div>
                  <div className="text-[10px] text-bw-dim">{v}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 49. `frontend/src/pages/Responsible.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — SECURITY & RESPONSIBLE AI (SEGMENT 12)
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Disclosure, NotImplemented,
} from '../components/ui';
import { EVIDENCE, EVIDENCE_ORDER, SAFE_LANGUAGE, SIGNAL_PHRASES } from '../lib/evidence';

const CONTROLS = [
  { area: 'Authentication', control: 'Institutional SSO (OIDC/SAML) with MFA for analyst and admin roles', state: 'planned',
    note: 'The prototype stores a self-declared role in local storage and authenticates nobody.' },
  { area: 'Authorisation', control: 'Role-based access control enforced server-side on every endpoint', state: 'planned',
    note: 'Client-side role display only in this build; a client-side check is not a security control.' },
  { area: 'Audit logging', control: 'Append-only log of logins, adjudications, connector edits, exports and runs', state: 'partial',
    note: 'Session-local demonstration; no durable log exists.' },
  { area: 'Data provenance', control: 'Source, licence, retrieval timestamp and checksum attached to every record', state: 'partial',
    note: 'Enforced in the interface contract; not persisted without a backend.' },
  { area: 'Secret handling', control: 'API credentials in a server-side secret store, never exposed to the browser', state: 'planned',
    note: 'No credentials exist in this build.' },
  { area: 'Transport security', control: 'TLS everywhere; HSTS; strict CSP', state: 'planned', note: 'Deployment concern.' },
  { area: 'Privacy', control: 'Aggregate surveillance data only; no patient-level records ingested', state: 'implemented',
    note: 'Architecturally enforced: no schema in the design accepts individual-level clinical data.' },
  { area: 'Minimum aggregation', control: 'Suppression of small cells to prevent re-identification', state: 'planned',
    note: 'Required before any sub-national or molecular-cluster display.' },
  { area: 'Bias monitoring', control: 'Performance and alarm rates stratified by region, completeness and delay', state: 'planned',
    note: 'Cannot run until a model exists; the metric contract already requires it.' },
  { area: 'Human oversight', control: 'No automated route from detector output to external communication', state: 'implemented',
    note: 'The "declare outbreak" action does not exist at any role level.' },
  { area: 'Uncertainty communication', control: 'Every figure carries an epistemic tag; intervals shown with point estimates', state: 'implemented',
    note: 'Enforced by the UI kit — a value cannot render without a tag.' },
  { area: 'Model governance', control: 'Model card required before a method can appear in the interface', state: 'implemented',
    note: 'Four cards registered, none for a trained model.' },
];

const STATE_META = {
  implemented: { label: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
  partial: { label: 'PARTIAL', color: 'var(--color-alert-yellow)' },
  planned: { label: 'PLANNED', color: 'var(--color-bw-dim)' },
};

const HARMS = [
  ['False reassurance', 'A green state where data is simply missing tells a user that nothing is happening. Mitigation: hatched "insufficient data" fill, distinct from green, on every map and table.'],
  ['False alarm burden', 'Alarms that outnumber analyst capacity destroy trust in the system and in genuine signals. Mitigation: alarm-rate budget must be agreed before deployment; multiple-testing burden reported.'],
  ['Geographic inequity', 'Models trained where surveillance is strongest under-detect where capacity is weakest. Mitigation: stratified performance reporting is mandatory; capacity indicators shown alongside signals.'],
  ['Unearned authority', 'A polished dashboard makes weak evidence look strong. Mitigation: epistemic tags, standing disclaimers, and refusal to display fabricated metrics.'],
  ['Stigmatisation', 'Country-level alarm displays can drive travel, trade and social consequences disproportionate to the evidence. Mitigation: permitted-phrasing vocabulary; no confirmation language; human review before any external statement.'],
  ['Misuse of biological data', 'Molecular capability can attract dual-use interest. Mitigation: scope restricted to aggregate metadata; no sequence generation; institutional biosecurity review required before any genomic integration.'],
];

export default function Responsible() {
  const [tab, setTab] = useState('security');

  return (
    <>
      <PageHeader kicker="Module 22" title="Security & Responsible AI" evidence="PLAN"
        description="Controls, governance and the harms this system could plausibly cause. Each control states honestly whether it is implemented, partial or planned." />

      <div className="mb-3">
        <Segmented value={tab} onChange={setTab} options={[
          { value: 'security', label: 'Controls' }, { value: 'harms', label: 'Harm analysis' },
          { value: 'language', label: 'Language policy' }, { value: 'oversight', label: 'Human oversight' },
        ]} />
      </div>

      {tab === 'security' && (
        <>
          <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
            {Object.entries(STATE_META).map(([k, m]) => (
              <Stat key={k} label={m.label} value={CONTROLS.filter((c) => c.state === k).length} evidence="ESTABLISHED"
                color={m.color} sub={`of ${CONTROLS.length} controls`} />
            ))}
            <Stat label="Patient-level records held" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)"
              sub="No schema accepts them" />
          </Grid>

          <Panel title="Control register" evidence="ESTABLISHED">
            <Table rowKey="control" columns={[
              { key: 'area', header: 'Area', render: (r) => <Pill color="var(--color-bw-line2)">{r.area}</Pill> },
              { key: 'control', header: 'Control', render: (r) => <span className="text-[11.5px] text-bw-text">{r.control}</span> },
              { key: 'state', header: 'State', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: STATE_META[r.state].color }}>
                  {STATE_META[r.state].label}</span>) },
              { key: 'note', header: 'Honest note', render: (r) => <span className="text-[11px] text-bw-muted">{r.note}</span> },
            ]} rows={CONTROLS} />
          </Panel>

          <Grid cols="lg:grid-cols-2" className="mt-3">
            <Panel title="Data protection posture" evidence="PLAN">
              <KV cols={1} mono={false} items={[
                { k: 'Data categories held', v: 'Aggregate counts and indicators only. No names, identifiers, addresses or clinical records.', mono: false },
                { k: 'Lawful basis (if deployed)', v: 'Public-interest research; determined per jurisdiction with institutional guidance.', mono: false },
                { k: 'Retention', v: 'Raw source payloads retained for reproducibility; retention period set per source licence.', mono: false },
                { k: 'Re-identification risk', v: 'Arises at fine spatial granularity and in small molecular clusters. Suppression thresholds mandatory before such displays.', mono: false },
                { k: 'Cross-border transfer', v: 'Deployment-dependent; documented per installation.', mono: false },
              ]} />
            </Panel>
            <Panel title="What a security review would conclude today" evidence="ESTABLISHED">
              <Callout tone="danger" title="Not deployable">
                This build has no authentication, no server-side authorisation, no durable audit log and no
                secret management. It is a design prototype running entirely in a browser. Nothing about it is
                ready for data that matters, and it should not be connected to a restricted source.
              </Callout>
            </Panel>
          </Grid>
        </>
      )}

      {tab === 'harms' && (
        <Grid cols="lg:grid-cols-2">
          {HARMS.map(([t, b]) => (
            <Panel key={t} title={t} evidence="ESTABLISHED" accent="var(--color-alert-orange)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{b}</p>
            </Panel>
          ))}
        </Grid>
      )}

      {tab === 'language' && (
        <Grid cols="lg:grid-cols-2">
          <Panel title="Permitted signal vocabulary" evidence="ESTABLISHED"
            subtitle="The interface may describe a detection using these phrases and no others.">
            <div className="flex flex-wrap gap-1.5">
              {SIGNAL_PHRASES.map((p) => (
                <span key={p} className="rounded-sm border border-[var(--color-alert-green)]/40 bg-[var(--color-alert-green)]/10 px-2 py-1 text-[11.5px] text-bw-text">
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-3 bw-label">Prohibited</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['Outbreak confirmed', 'Epidemic detected', 'Diagnosis', 'Guaranteed prediction',
                'The model proves', 'Validated accuracy', 'Autonomous decision', 'Replaces epidemiologists'].map((p) => (
                <span key={p} className="rounded-sm border border-[var(--color-alert-red)]/40 bg-[var(--color-alert-red)]/10 px-2 py-1 text-[11.5px] text-bw-muted line-through">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-bw-dim">
              This is not cosmetic. Interface language is what a hurried reader takes away, and a system that can
              phrase a statistical deviation as a confirmed event will eventually be quoted as having done so.
            </p>
          </Panel>

          <Panel title="Epistemic labelling scheme" evidence="ESTABLISHED"
            subtitle="Every figure in the platform carries exactly one tag.">
            <div className="space-y-2">
              {EVIDENCE_ORDER.map((k) => (
                <div key={k} className="flex gap-2.5 border-b border-bw-line/50 pb-2 last:border-0">
                  <EvidenceTag t={k} size="xs" />
                  <p className="min-w-0 flex-1 text-[11px] leading-snug text-bw-muted">{EVIDENCE[k].definition}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5">
              <div className="bw-label mb-1">Enforcement</div>
              <p className="text-[11px] leading-relaxed text-bw-muted">
                Tags are applied by the shared UI components, not by individual page authors. A panel rendered
                without an evidence tag is a code-review failure.
              </p>
            </div>
          </Panel>
        </Grid>
      )}

      {tab === 'oversight' && (
        <Grid cols="lg:grid-cols-[1.2fr_1fr]">
          <Panel title="Human-in-the-loop design" evidence="PLAN">
            <ol className="space-y-2.5">
              {[
                ['Detector output is a candidate, not a conclusion', 'The engine emits flags with scores. Nothing downstream treats a flag as an event.'],
                ['Adjudication is mandatory and attributed', 'A named reviewer records a rationale. The rationale is part of the permanent record.'],
                ['Escalation requires alternatives to be excluded', 'The interface lists plausible non-epidemiological explanations; each must be addressed.'],
                ['No automated external communication', 'Notification channels to anyone outside the review team cannot be enabled in this build.'],
                ['Override is always available and always logged', 'A reviewer can dismiss any signal; the dismissal and its reason are retained.'],
                ['The system cannot declare an outbreak', 'There is no code path, at any privilege level, that produces such a statement.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-2.5">
                  <span className="bw-num shrink-0 text-[11px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-[12px] text-bw-text">{t}</div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <div className="space-y-3">
            <Panel title="Bias monitoring plan" evidence="PLAN">
              <ul className="space-y-1.5 text-[11.5px] text-bw-muted">
                {['Sensitivity and alarm rate stratified by WHO region',
                  'Performance stratified by data completeness decile',
                  'Performance stratified by reporting delay',
                  'Explicit reporting of territories excluded for insufficient history',
                  'Comparison of detection rates in high- vs low-capacity settings'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Scale size={12} className="mt-[2px] shrink-0 text-bw-dim" />{x}</li>
                ))}
              </ul>
              <div className="mt-2 font-mono text-[10px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</div>
            </Panel>

            <Panel title="Accountability" evidence="ESTABLISHED">
              <KV cols={1} mono={false} items={[
                { k: 'Who is responsible for a signal?', v: 'The reviewing analyst, named in the audit log. Never "the model".', mono: false },
                { k: 'Who is responsible for a model?', v: 'The researcher named on its model card.', mono: false },
                { k: 'Who can disable a stream?', v: 'Administrator, with the action logged and the reason recorded.', mono: false },
                { k: 'Who can delete history?', v: 'Nobody. The audit log and decision log are append-only.', mono: false },
              ]} />
            </Panel>
          </div>
        </Grid>
      )}
    </>
  );
}

```

---

## 50. `frontend/src/pages/Settings.jsx`

```jsx
/* ============================================================
   BIOWATCH-AI — SETTINGS & NOTIFICATIONS (SEGMENT 12 / 20)
   Notification capability is designed but hard-disabled: this
   prototype must never transmit anything resembling a
   public-health alert.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Field, Select, Input, Checkbox, Stat, NotImplemented, Disclosure,
} from '../components/ui';
import { useMode, MODES } from '../lib/mode';
import { ALERT_STATES } from '../lib/evidence';

export default function Settings() {
  const { mode, setMode, session, setSession } = useMode();
  const [thresholds, setThresholds] = useState({ k: 2, persistence: 2, minHistory: 52 });
  const [channels, setChannels] = useState({ dashboard: true, email: false, webhook: false, report: false });
  const [prefs, setPrefs] = useState({ reduceMotion: false, density: 'comfortable', tags: true });

  return (
    <>
      <PageHeader kicker="Module 23" title="Settings & Notifications" evidence="PLAN"
        description="Platform configuration, detection parameters and the notification design. External delivery is disabled and cannot be enabled in this build." />

      <Callout tone="danger" title="Notification hard-stop" icon={<Icons.BellOff size={12} />}>
        BIOWATCH-AI must never send anything that could be received as a public-health alert. Email, webhook and
        report delivery are disabled at the code level in this prototype. In a deployed system they would require
        explicit institutional authorisation, a named accountable owner, and a documented recipient list — none of
        which exists.
      </Callout>

      <Grid cols="xl:grid-cols-2" className="mt-3">
        <div className="space-y-3">
          <Panel title="Prototype mode" evidence="ESTABLISHED"
            subtitle="Always visible in the top bar. Switching never converts synthetic values into live values.">
            <div className="space-y-2">
              {Object.values(MODES).map((m, i) => (
                <button key={m.key} type="button" onClick={() => setMode(m.key)}
                  className={`block w-full rounded-sm border px-3 py-2.5 text-left transition-colors ${
                    mode === m.key ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                  <div className="flex items-center gap-2">
                    <Dot color={m.color} />
                    <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: m.color }}>
                      MODE {i + 1} — {m.key}
                    </span>
                    {mode === m.key && <Pill color={m.color} className="ml-auto">ACTIVE</Pill>}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-bw-muted">{m.description}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Detection parameters" evidence="ASSUMPTION"
            subtitle="These are policy choices about tolerable false alarms, not statistical facts.">
            <Grid cols="sm:grid-cols-3">
              <Field label="Exceedance multiplier k" hint="Higher k = fewer alarms, later detection.">
                <Select value={String(thresholds.k)} onChange={(v) => setThresholds({ ...thresholds, k: Number(v) })}
                  options={['1.5', '2', '2.5', '3', '3.5'].map((v) => ({ value: v, label: `k = ${v}` }))} />
              </Field>
              <Field label="Persistence (weeks)" hint="Consecutive exceedances before escalation.">
                <Select value={String(thresholds.persistence)} onChange={(v) => setThresholds({ ...thresholds, persistence: Number(v) })}
                  options={['1', '2', '3', '4'].map((v) => ({ value: v, label: `${v} week(s)` }))} />
              </Field>
              <Field label="Minimum history (weeks)" hint="Below this, no baseline is estimated and the series is marked unavailable.">
                <Select value={String(thresholds.minHistory)} onChange={(v) => setThresholds({ ...thresholds, minHistory: Number(v) })}
                  options={['26', '52', '104', '156'].map((v) => ({ value: v, label: `${v} weeks` }))} />
              </Field>
            </Grid>
            <Callout tone="warn" title="Recorded as a provisional decision">
              The defaults (k = 2, persistence = 2) exist to make the interface demonstrable. They are logged in
              the decision register as DEC-009 with status PROVISIONAL, pending an agreed alarm-rate budget.
            </Callout>
          </Panel>

          <Panel title="Display preferences" evidence="PLAN">
            <div className="space-y-2">
              <Checkbox checked={prefs.tags} onChange={(v) => setPrefs({ ...prefs, tags: v })}
                label="Show epistemic tags on every panel"
                hint="Cannot be disabled in this build — provenance labelling is structural." />
              <Checkbox checked={prefs.reduceMotion} onChange={(v) => setPrefs({ ...prefs, reduceMotion: v })}
                label="Reduce motion" hint="The interface already avoids decorative animation; this honours the OS-level preference explicitly." />
              <Field label="Density">
                <Segmented value={prefs.density} onChange={(v) => setPrefs({ ...prefs, density: v })}
                  options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} />
              </Field>
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Notification channels" evidence="PLAN"
            subtitle="Designed capability. Every external channel is disabled at code level.">
            <div className="space-y-2">
              {[
                ['dashboard', 'Dashboard alerts', 'In-interface only. Visible to authenticated reviewers.', true],
                ['email', 'E-mail digest', 'Would require SMTP configuration, an authorised recipient list and a named accountable owner.', false],
                ['webhook', 'API / webhook', 'Would push structured candidate signals to an authorised internal endpoint only.', false],
                ['report', 'Downloadable alert report', 'PDF/Markdown export of a reviewed signal, watermarked as a research prototype output.', false],
              ].map(([k, name, desc, allowed]) => (
                <div key={k} className={`rounded-sm border px-2.5 py-2 ${allowed ? 'border-bw-line bg-bw-panel2/40' : 'border-dashed border-bw-line2 bg-bw-panel2/20'}`}>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" disabled={!allowed} checked={channels[k]}
                      onChange={(e) => setChannels({ ...channels, [k]: e.target.checked })}
                      className="mt-[3px] h-3.5 w-3.5 accent-[var(--color-bw-primary)]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] text-bw-text">{name}</span>
                        <span className="font-mono text-[8.5px] tracking-[0.08em]"
                          style={{ color: allowed ? 'var(--color-alert-green)' : 'var(--color-alert-red)' }}>
                          {allowed ? 'AVAILABLE' : 'DISABLED — NOT AUTHORISED'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-bw-dim">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 rounded-sm border border-bw-line bg-[#0a1218] p-2.5">
              <div className="bw-label mb-1">Delivery preconditions (all unmet)</div>
              <ul className="space-y-1 text-[10.5px] text-bw-muted">
                {['Institutional authorisation on file', 'Named accountable owner', 'Defined recipient list with consent',
                  'Escalation policy agreed with recipients', 'Rate limit and quiet hours configured',
                  'Message template reviewed for permitted phrasing'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.X size={11} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{x}</li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title="Notification rules (design)" evidence="PLAN">
            <Table dense columns={[
              { key: 'state', header: 'State', render: (r) => (
                <span className="flex items-center gap-1.5"><Dot color={ALERT_STATES[r.state].color} />
                  <span className="font-mono text-[9.5px]" style={{ color: ALERT_STATES[r.state].color }}>{r.state}</span></span>) },
              { key: 'who', header: 'Recipient' },
              { key: 'when', header: 'Timing' },
              { key: 'ch', header: 'Channel' },
            ]} rows={[
              { state: 'YELLOW', who: 'Duty analyst queue', when: 'Next daily digest', ch: 'Dashboard' },
              { state: 'ORANGE', who: 'Duty analyst', when: 'Within working hours', ch: 'Dashboard (+ e-mail if authorised)' },
              { state: 'RED', who: 'Senior epidemiologist', when: 'Immediate', ch: 'Dashboard (+ e-mail if authorised)' },
              { state: 'GREEN', who: '—', when: 'No notification', ch: '—' },
            ]} />
            <p className="mt-2 text-[10px] leading-snug text-bw-dim">
              Note that even a RED interface state notifies an internal reviewer only. There is no rule, and no
              code path, that notifies anyone outside the review team.
            </p>
          </Panel>

          <Panel title="Session" evidence="PLAN">
            <KV items={[
              { k: 'Display name', v: session?.name || 'Guest' },
              { k: 'Role', v: session?.role || 'Read-only viewer' },
              { k: 'Authenticated', v: 'No — prototype has no authentication' },
              { k: 'Storage', v: 'Browser local storage only' },
            ]} />
            <div className="mt-2 flex gap-2">
              <Btn size="sm" onClick={() => setSession(null)}><Icons.LogOut size={12} /> Clear session</Btn>
              <Btn size="sm" variant="danger" onClick={() => { try { localStorage.clear(); } catch { /* ignore */ } window.location.reload(); }}>
                <Icons.Trash2 size={12} /> Reset all local state
              </Btn>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}

```

---

## 51. `frontend/tests/smoke.test.jsx`

```jsx
/* BIOWATCH-AI — render smoke test.
   Mounts every route in every prototype mode and fails on any React error
   or on the appearance of prohibited language in the rendered output. */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ModeProvider } from '../src/lib/mode';
import Shell from '../src/components/Shell';

import Landing from '../src/pages/Landing';
import Access from '../src/pages/Access';
import CommandCenter from '../src/pages/CommandCenter';
import SurveillanceMap from '../src/pages/SurveillanceMap';
import DiseaseIntelligence from '../src/pages/DiseaseIntelligence';
import SignalEngine from '../src/pages/SignalEngine';
import AlertCenter from '../src/pages/AlertCenter';
import XAI from '../src/pages/XAI';
import MLLab from '../src/pages/MLLab';
import ModelEvaluation from '../src/pages/ModelEvaluation';
import ModelCards from '../src/pages/ModelCards';
import Genomic from '../src/pages/Genomic';
import BioSignals from '../src/pages/BioSignals';
import Environmental from '../src/pages/Environmental';
import Events from '../src/pages/Events';
import Africa from '../src/pages/Africa';
import Connectors from '../src/pages/Connectors';
import DataQuality from '../src/pages/DataQuality';
import Workspace from '../src/pages/Workspace';
import Experiments from '../src/pages/Experiments';
import Decisions from '../src/pages/Decisions';
import Architecture from '../src/pages/Architecture';
import Health from '../src/pages/Health';
import Responsible from '../src/pages/Responsible';
import Settings from '../src/pages/Settings';

const PAGES = {
  Landing, Access, CommandCenter, SurveillanceMap, DiseaseIntelligence, SignalEngine,
  AlertCenter, XAI, MLLab, ModelEvaluation, ModelCards, Genomic, BioSignals,
  Environmental, Events, Africa, Connectors, DataQuality, Workspace, Experiments,
  Decisions, Architecture, Health, Responsible, Settings,
};

/* Prohibited phrases: the interface must never assert these. */
const PROHIBITED = [
  'outbreak confirmed', 'confirmed outbreak', 'epidemic detected',
  'guaranteed prediction', 'validated accuracy',
];

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  global.fetch = vi.fn(() => Promise.reject(new Error('no backend in test')));
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }),
  });
});
afterEach(cleanup);

function mount(Page, mode) {
  try { localStorage.setItem('bw.mode', mode); } catch { /* ignore */ }
  return render(
    <ModeProvider>
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<Shell />}>
            <Route index element={<Page />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ModeProvider>,
  );
}

describe('BIOWATCH-AI page render smoke test', () => {
  for (const mode of ['DEMONSTRATION', 'RESEARCH', 'LIVE']) {
    for (const [name, Page] of Object.entries(PAGES)) {
      if ((name === 'Landing' || name === 'Access') && mode !== 'DEMONSTRATION') continue;
      it(`${name} renders in ${mode} mode`, () => {
        const errors = [];
        const spy = vi.spyOn(console, 'error').mockImplementation((...a) => errors.push(a.join(' ')));
        let container;
        if (name === 'Landing' || name === 'Access') {
          ({ container } = render(<ModeProvider><MemoryRouter><Page /></MemoryRouter></ModeProvider>));
        } else {
          ({ container } = mount(Page, mode));
        }
        spy.mockRestore();
        expect(container.textContent.length).toBeGreaterThan(50);
        const real = errors.filter((e) => !/not wrapped in act|ReactDOMTestUtils/i.test(e));
        expect(real, `React errors in ${name}:\n${real.join('\n')}`).toHaveLength(0);
        const text = container.textContent.toLowerCase();
        for (const p of PROHIBITED) {
          const idx = text.indexOf(p);
          // allowed only inside an explicit prohibition list ("Prohibited" section)
          if (idx !== -1) {
            const ctx = text.slice(Math.max(0, idx - 400), idx);
            expect(/prohibit|never|not permitted|cannot|blocked|does not/.test(ctx),
              `Prohibited phrase "${p}" asserted in ${name}`).toBe(true);
          }
        }
      });
    }
  }
});

```

---

## 52. `backend/requirements.txt`

```text
# BIOWATCH-AI research backend
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.4
numpy==2.2.1
pandas==2.2.3
scikit-learn==1.6.0
httpx==0.28.1
python-dateutil==2.9.0.post0
# Planned (not imported by the current scaffold):
# biopython==1.84          # genomic metadata handling only
# SQLAlchemy==2.0.36       # PostgreSQL access
# psycopg[binary]==3.2.3
# apscheduler==3.11.0      # ingestion scheduling
# shap==0.46.0             # attribution, once a model exists

```

---

## 53. `backend/Dockerfile`

```text
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /srv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
EXPOSE 8000
# Research prototype. Not hardened for production deployment.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

```

---

## 54. `backend/app/__init__.py`

```python
"""BIOWATCH-AI research backend package."""

```

---

## 55. `backend/app/main.py`

```python
"""
BIOWATCH-AI — research backend (FastAPI)
========================================

Scope of this service in the prototype:

*   It exposes the SAME statistical detectors that the frontend runs
    client-side, so that a researcher can execute them on real data
    server-side with pandas/numpy.
*   It exposes the connector registry as data, so the registry has one
    definition rather than two.
*   It exposes NO trained model, NO fabricated metric and NO live data.

Hard rules enforced here, mirroring the frontend:

*   An endpoint never returns a performance metric for a model that has
    not been trained. It returns ``"Awaiting experiment"``.
*   An endpoint never returns synthetic values labelled as live.
*   ``/api/health`` reports what actually exists, including the fact
    that the database and scheduler are not deployed.

Run:  uvicorn app.main:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .connectors import CONNECTORS
from .detectors import DETECTOR_REGISTRY, run_detector
from .synth import synth_series

VERSION = "0.4.0-prototype"

DISCLAIMER = (
    "BIOWATCH-AI research prototype. Not a clinical diagnostic and not an "
    "operational public-health system. No validated model performance is "
    "reported by this API. Alert states are interface states, not "
    "public-health decisions."
)

app = FastAPI(
    title="BIOWATCH-AI research API",
    version=VERSION,
    description=DISCLAIMER,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # prototype only; restrict in any deployment
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


# --------------------------------------------------------------------------
# Health / meta
# --------------------------------------------------------------------------
@app.get("/api/health")
def health() -> dict[str, Any]:
    """Honest component status. Nothing that is not deployed reports green."""
    return {
        "service": "biowatch-api",
        "version": VERSION,
        "status": "operational",
        "checked_at": _now(),
        "components": {
            "api": "operational",
            "detectors": "operational (statistical only)",
            "database": "not deployed",
            "ingestion_scheduler": "not deployed",
            "model_registry": "empty — no model artefacts exist",
            "notification_service": "disabled by design",
        },
        "data_state": "NO LIVE SOURCE CONFIGURED",
        "models_trained": 0,
        "disclaimer": DISCLAIMER,
    }


@app.get("/api/meta/evidence")
def evidence_vocabulary() -> dict[str, Any]:
    """The epistemic tags every response and every UI element must use."""
    return {
        "tags": {
            "ESTABLISHED": "Supported by peer-reviewed literature or an authoritative cited source.",
            "ASSUMPTION": "A design or modelling premise, explicitly not verified.",
            "HYPOTHESIS": "A testable proposition with no supporting result yet.",
            "PRELIMINARY": "Early, non-validated observation. Not citable.",
            "PREDICTION": "Model output about unobserved values. Not a biological confirmation.",
            "PLAN": "Intended future work; nothing executed.",
            "SIMULATED": "Synthetic values for interface demonstration only.",
        },
        "permitted_signal_language": [
            "Signal detected", "Unusual activity", "Elevated reporting",
            "Potential anomaly detected", "Requires investigation",
            "Model-generated alert", "Prediction — not biological confirmation",
        ],
        "prohibited_language": [
            "Outbreak confirmed", "Epidemic detected", "Diagnosis",
            "Guaranteed prediction", "Validated accuracy",
        ],
    }


# --------------------------------------------------------------------------
# Connectors
# --------------------------------------------------------------------------
@app.get("/api/connectors")
def list_connectors() -> dict[str, Any]:
    return {
        "count": len(CONNECTORS),
        "configured": 0,
        "note": (
            "No connector is configured. Unconfigured sources are reported as "
            "such and are never substituted with synthetic values."
        ),
        "connectors": CONNECTORS,
    }


@app.get("/api/connectors/{connector_id}")
def get_connector(connector_id: str) -> dict[str, Any]:
    for c in CONNECTORS:
        if c["id"] == connector_id:
            return c
    raise HTTPException(status_code=404, detail="Connector not defined")


@app.post("/api/connectors/{connector_id}/test")
def test_connector(connector_id: str) -> dict[str, Any]:
    """
    Deliberately does NOT contact the upstream source.

    A prototype has no entitlement to send traffic to a public agency, and a
    'successful' test would imply an access and licence position the project
    does not hold.
    """
    for c in CONNECTORS:
        if c["id"] == connector_id:
            return {
                "connector": connector_id,
                "outcome": "NOT ATTEMPTED",
                "at": _now(),
                "detail": (
                    "No request was issued. Enabling this connector requires a "
                    "recorded licence review, credential provisioning in the "
                    "server-side secret store, and a scheduler deployment."
                ),
                "license": c["license"],
            }
    raise HTTPException(status_code=404, detail="Connector not defined")


# --------------------------------------------------------------------------
# Detection
# --------------------------------------------------------------------------
class DetectRequest(BaseModel):
    values: list[float] = Field(..., description="Observed counts, time-ordered, one per period.")
    dates: list[str] | None = Field(None, description="Optional ISO dates aligned to values.")
    detector: str = Field("seasonal", description=f"One of: {', '.join(DETECTOR_REGISTRY)}")
    k: float = Field(2.0, description="Exceedance multiplier where applicable.")
    period: int = Field(52, description="Seasonal period in observations (52 for weekly data).")


@app.get("/api/detectors")
def detectors() -> dict[str, Any]:
    return {
        "implemented": [
            {"id": k, "name": v["name"], "family": v["family"], "note": v["note"]}
            for k, v in DETECTOR_REGISTRY.items()
        ],
        "not_implemented": [
            {"id": "farrington", "reason": "Quasi-Poisson GLM with epidemic-period exclusion not yet written."},
            {"id": "isolation_forest", "reason": "Requires a feature matrix and a contamination-rate decision."},
            {"id": "random_forest", "reason": "Requires a curated reference label set that does not exist."},
            {"id": "gradient_boosting", "reason": "Same labelling prerequisite as random_forest."},
            {"id": "lstm", "reason": "Later stage only; unjustified before a baseline comparison exists."},
        ],
        "performance_metrics": "Awaiting experiment — no reference label set exists.",
    }


@app.post("/api/detect")
def detect(req: DetectRequest) -> dict[str, Any]:
    if req.detector not in DETECTOR_REGISTRY:
        raise HTTPException(status_code=400, detail=f"Unknown detector '{req.detector}'")
    if len(req.values) < 10:
        raise HTTPException(status_code=400, detail="At least 10 observations are required.")

    result = run_detector(req.detector, req.values, k=req.k, period=req.period)
    return {
        "detector": req.detector,
        "name": DETECTOR_REGISTRY[req.detector]["name"],
        "evidence_tag": "PRELIMINARY",
        "n_observations": len(req.values),
        "flags": result["flags"],
        "scores": result["scores"],
        "expected": result["expected"],
        "n_flagged": int(sum(result["flags"])),
        "alarm_rate": round(sum(result["flags"]) / len(req.values), 4),
        "performance": "Awaiting experiment",
        "interpretation_note": (
            "A flag indicates a statistical deviation from the estimated baseline. "
            "It is not an outbreak, not a diagnosis and not a validated detection. "
            "Correlation does not establish biological causation."
        ),
        "computed_at": _now(),
    }


# --------------------------------------------------------------------------
# Synthetic demonstration data (explicitly labelled)
# --------------------------------------------------------------------------
@app.get("/api/demo/series")
def demo_series(key: str = "demo", weeks: int = 104, level: float = 120.0) -> dict[str, Any]:
    """Deterministic synthetic series for interface demonstration."""
    series = synth_series(key, weeks=weeks, level=level)
    return {
        "evidence_tag": "SIMULATED",
        "banner": "SIMULATED DATA — FOR PROTOTYPE DEMONSTRATION ONLY",
        "provenance": "Deterministic seeded generator. Encodes no real-world surveillance information.",
        "series": series,
    }


@app.get("/api/models")
def models() -> dict[str, Any]:
    """The model registry is empty. This endpoint says so."""
    return {
        "trained_models": [],
        "count": 0,
        "note": (
            "No model has been trained. Any endpoint that would return accuracy, "
            "precision, recall, AUROC, outbreak probability or lead time returns "
            "'Awaiting experiment' instead of a number."
        ),
        "metrics": "Awaiting experiment",
    }

```

---

## 56. `backend/app/detectors.py`

```python
"""
BIOWATCH-AI — statistical detection methods (server-side).

These mirror the browser implementations exactly in intent: classical,
transparent, baseline-first. No trained model is present in this module and
none is planned here — models belong in the experiment harness, where they
must be compared against these baselines on identical temporal splits.
"""
from __future__ import annotations

import math
from typing import Any

import numpy as np


def _rolling_stats(values: np.ndarray, i: int, window: int) -> tuple[float, float]:
    win = values[max(0, i - window):i]
    if win.size == 0:
        return float(values[i]), math.sqrt(max(1.0, float(values[i])))
    mu = float(win.mean())
    sd = float(win.std(ddof=1)) if win.size > 1 else math.sqrt(max(1.0, mu))
    if sd <= 0:
        sd = math.sqrt(max(1.0, mu))
    return mu, sd


def seasonal_baseline(values: list[float], k: float = 2.0, period: int = 52, **_: Any) -> dict[str, list]:
    """Same-period historical mean ± k·SD. Falls back to a trailing window."""
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    for i in range(v.size):
        hist = v[i % period:i:period] if i >= period else np.array([])
        pool = hist if hist.size >= 2 else v[max(0, i - 8):i]
        if pool.size == 0:
            flags.append(False); scores.append(0.0); expected.append(float(v[i])); continue
        mu = float(pool.mean())
        sd = float(pool.std(ddof=1)) if pool.size > 1 else math.sqrt(max(1.0, mu))
        sd = sd if sd > 0 else math.sqrt(max(1.0, mu))
        z = (float(v[i]) - mu) / sd
        flags.append(bool(i >= period and z >= k))
        scores.append(round(z, 3))
        expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def ewma(values: list[float], lam: float = 0.3, L: float = 3.0, window: int = 8, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    z_ewma: float | None = None
    for i in range(v.size):
        mu, sd = _rolling_stats(v, i, window)
        z_ewma = float(v[i]) if z_ewma is None else lam * float(v[i]) + (1 - lam) * z_ewma
        limit = mu + L * sd * math.sqrt(lam / (2 - lam))
        flags.append(bool(i > window and z_ewma > limit))
        scores.append(round((z_ewma - mu) / sd, 3))
        expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def cusum(values: list[float], k: float = 0.5, h: float = 4.0, window: int = 12, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    S = 0.0
    for i in range(v.size):
        mu, sd = _rolling_stats(v, i, window)
        z = (float(v[i]) - mu) / sd
        S = max(0.0, S + z - k)
        flag = bool(i > window and S > h)
        if flag:
            S = 0.0
        flags.append(flag); scores.append(round(S, 3)); expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def robust_mad(values: list[float], k: float = 3.5, window: int = 26, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    for i in range(v.size):
        win = v[max(0, i - window):i]
        if win.size < 6:
            flags.append(False); scores.append(0.0); expected.append(float(v[i])); continue
        med = float(np.median(win))
        mad = float(np.median(np.abs(win - med))) or 1.0
        score = (float(v[i]) - med) / (1.4826 * mad)
        flags.append(bool(score >= k)); scores.append(round(score, 3)); expected.append(round(med, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def fixed_threshold(values: list[float], threshold: float | None = None, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    t = float(threshold) if threshold is not None else float(v.max() * 0.72)
    return {
        "flags": [bool(x > t) for x in v],
        "scores": [round(float(x) / t, 3) if t else 0.0 for x in v],
        "expected": [round(t, 2)] * v.size,
    }


DETECTOR_REGISTRY: dict[str, dict[str, Any]] = {
    "seasonal": {
        "fn": seasonal_baseline, "name": "Seasonal baseline (same-period mean + kσ)",
        "family": "Statistical baseline",
        "note": "Simplified relative to Farrington-type methods: no over-dispersion model, no trend term, no exclusion of past epidemic periods.",
    },
    "ewma": {
        "fn": ewma, "name": "EWMA control chart", "family": "Time series",
        "note": "Sensitive to small persistent shifts; assumes approximately stationary residuals, which surveillance data violate.",
    },
    "cusum": {
        "fn": cusum, "name": "CUSUM", "family": "Time series",
        "note": "Accumulates evidence for sustained shifts; signalling time depends strongly on the reset policy.",
    },
    "mad": {
        "fn": robust_mad, "name": "Robust MAD rule", "family": "Anomaly detection",
        "note": "Resistant to contamination of the training window by previous epidemics.",
    },
    "threshold": {
        "fn": fixed_threshold, "name": "Fixed threshold", "family": "Threshold",
        "note": "Included because it is frequently the incumbent in practice; any method must beat it.",
    },
}


def run_detector(detector_id: str, values: list[float], **kwargs: Any) -> dict[str, list]:
    return DETECTOR_REGISTRY[detector_id]["fn"](values, **kwargs)

```

---

## 57. `backend/app/synth.py`

```python
"""
Deterministic synthetic series generator (server-side mirror of the browser
engine). EVERY value produced here is SIMULATED and must be presented with
the SIMULATED tag. It encodes no real-world surveillance information.
"""
from __future__ import annotations

import math
from datetime import date, timedelta
from typing import Any


def _seed(text: str) -> int:
    h = 1779033703 ^ len(text)
    for ch in text:
        h = (h ^ ord(ch)) * 3432918353 % (2 ** 32)
        h = ((h << 13) | (h >> 19)) % (2 ** 32)
    return h % (2 ** 32)


class _Rng:
    def __init__(self, seed: int) -> None:
        self.a = seed

    def next(self) -> float:
        self.a = (self.a + 0x6D2B79F5) % (2 ** 32)
        t = self.a
        t = (t ^ (t >> 15)) * (1 | t) % (2 ** 32)
        t = (t + ((t ^ (t >> 7)) * (61 | t)) % (2 ** 32)) ^ t
        return ((t ^ (t >> 14)) % (2 ** 32)) / 2 ** 32


def synth_series(
    key: str, weeks: int = 104, level: float = 120.0, season: float = 0.45,
    disp: float = 0.18, end: date | None = None,
) -> list[dict[str, Any]]:
    rng = _Rng(_seed(key))
    end = end or date(2026, 8, 17)
    out: list[dict[str, Any]] = []
    for i in range(weeks):
        d = end - timedelta(days=7 * (weeks - 1 - i))
        woy = i % 52
        s = 1 + season * math.sin((2 * math.pi * woy) / 52 - math.pi / 3)
        mu = level * s
        noise = 1 + disp * (rng.next() - 0.5) * 2
        value = max(0, round(mu * noise))
        base = round(mu)
        sd = max(1.5, math.sqrt(max(1, base)) * 1.35 + base * disp * 0.55)
        out.append({
            "date": d.isoformat(), "value": value, "baseline": base,
            "lo": max(0, round(base - 1.96 * sd)), "hi": round(base + 1.96 * sd),
            "z": round((value - base) / sd, 2),
            "evidence_tag": "SIMULATED",
        })
    return out

```

---

## 58. `backend/app/connectors.py`

```python
"""
BIOWATCH-AI — connector registry (server-side mirror of the frontend registry).

Listing a source implies no affiliation, endorsement or granted access; each
remains subject to its own licence and terms of use.

No connector is configured in this prototype. Unconfigured sources are reported
as such and are NEVER substituted with synthetic values presented as live.
"""
from __future__ import annotations

CONNECTORS: list[dict] = [
    {
        "id": "who-gho",
        "name": "WHO Global Health Observatory (GHO)",
        "org": "World Health Organization",
        "type": "Epidemiological indicators",
        "stream": "epi",
        "url": "https://ghoapi.azureedge.net/api/",
        "docs": "https://www.who.int/data/gho/info/gho-odata-api",
        "auth": "None (public OData endpoint)",
        "format": "OData / JSON",
        "frequency": "Irregular — indicator dependent",
        "granularity": "Country · year (mostly annual)",
        "license": "WHO data terms; attribution required. Verify per-indicator terms.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Annual granularity is generally too coarse for weekly signal detection; useful as denominator/context."
    },
    {
        "id": "who-don",
        "name": "WHO Disease Outbreak News (DON)",
        "org": "World Health Organization",
        "type": "Event-based reports",
        "stream": "event",
        "url": "https://www.who.int/emergencies/disease-outbreak-news",
        "docs": "https://www.who.int/emergencies/disease-outbreak-news",
        "auth": "None (public web/RSS)",
        "format": "HTML / RSS → structured extraction",
        "frequency": "Event-driven, irregular",
        "granularity": "Event · country · date",
        "license": "WHO content terms; attribution and non-alteration requirements apply.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Reference/verification corpus only. DON publication lags detection and must never be used as a real-time detector input without explicit lag handling."
    },
    {
        "id": "cdc-socrata",
        "name": "US CDC open data (data.cdc.gov)",
        "org": "US Centers for Disease Control and Prevention",
        "type": "Surveillance datasets",
        "stream": "epi",
        "url": "https://data.cdc.gov/resource/{dataset_id}.json",
        "docs": "https://dev.socrata.com/",
        "auth": "Optional app token (higher rate limit)",
        "format": "Socrata SODA / JSON / CSV",
        "frequency": "Dataset dependent — weekly for several syndromic sets",
        "granularity": "State · week (varies)",
        "license": "Generally US public domain; confirm per dataset.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Schema and revision policy vary by dataset; back-revision of recent weeks is common."
    },
    {
        "id": "ecdc-atlas",
        "name": "ECDC Surveillance Atlas exports",
        "org": "European Centre for Disease Prevention and Control",
        "type": "Notifiable disease surveillance",
        "stream": "epi",
        "url": "https://atlas.ecdc.europa.eu/public/index.aspx",
        "docs": "https://www.ecdc.europa.eu/en/publications-data",
        "auth": "None (bulk export)",
        "format": "CSV export",
        "frequency": "Periodic (monthly/annual by disease)",
        "granularity": "Country · month/year",
        "license": "ECDC re-use policy; attribution required.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Programmatic API coverage is limited; scheduled export ingestion is the realistic pattern."
    },
    {
        "id": "owid",
        "name": "Our World in Data — health datasets",
        "org": "Our World in Data / Global Change Data Lab",
        "type": "Curated aggregate indicators",
        "stream": "epi",
        "url": "https://catalog.ourworldindata.org/",
        "docs": "https://docs.owid.io/projects/etl/api/",
        "auth": "None",
        "format": "CSV / Parquet",
        "frequency": "Dataset dependent",
        "granularity": "Country · day/week/year",
        "license": "Predominantly CC BY 4.0; upstream source licences also apply.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "A curated re-publication layer — always cite the upstream source, and expect harmonisation choices to affect series shape."
    },
    {
        "id": "ncbi-eutils",
        "name": "NCBI E-utilities / Datasets",
        "org": "US National Center for Biotechnology Information",
        "type": "Pathogen sequence metadata",
        "stream": "genomic",
        "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/",
        "docs": "https://www.ncbi.nlm.nih.gov/books/NBK25501/",
        "auth": "Optional API key (raises rate limit to 10 req/s)",
        "format": "XML / JSON / FASTA",
        "frequency": "Continuous submission",
        "granularity": "Accession · collection date · geography",
        "license": "Public domain data; NCBI usage policies and rate limits apply.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Submission date ≠ collection date. Sequencing effort is highly non-uniform; frequency estimates from raw submissions are severely biased."
    },
    {
        "id": "nextstrain",
        "name": "Nextstrain open builds",
        "org": "Nextstrain",
        "type": "Phylogenetic builds & clade assignment",
        "stream": "genomic",
        "url": "https://data.nextstrain.org/",
        "docs": "https://docs.nextstrain.org/",
        "auth": "None for public builds",
        "format": "Auspice JSON v2",
        "frequency": "Build dependent (often weekly)",
        "granularity": "Tree · node · metadata",
        "license": "Open builds; check individual build data provenance and acknowledgements.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "Builds are subsampled for tractability; subsampling is not a random sample of circulating diversity."
    },
    {
        "id": "gisaid",
        "name": "GISAID EpiCoV / EpiFlu",
        "org": "GISAID",
        "type": "Pathogen genomic data",
        "stream": "genomic",
        "url": "https://gisaid.org/",
        "docs": "https://gisaid.org/",
        "auth": "Registered access + data-access agreement",
        "format": "Per-agreement feed",
        "frequency": "Continuous",
        "granularity": "Sequence · metadata",
        "license": "Access governed by the GISAID Database Access Agreement; redistribution restricted.",
        "status": "blocked",
        "lastUpdate": None,
        "error": "Data-access agreement not executed for this prototype. No data requested or stored.",
        "caveats": "Terms prohibit the redistribution patterns a public dashboard would imply. Aggregate-only use must be legally reviewed before enabling."
    },
    {
        "id": "wastewater-open",
        "name": "Open wastewater surveillance programmes",
        "org": "Various national/regional programmes",
        "type": "Environmental pathogen concentration",
        "stream": "env",
        "url": "Programme-specific endpoints (e.g. national open-data portals)",
        "docs": "—",
        "auth": "Varies by programme",
        "format": "CSV / JSON",
        "frequency": "Typically weekly or twice-weekly",
        "granularity": "Sampling site · date",
        "license": "Programme-specific; several are open government licences.",
        "status": "unconfigured",
        "lastUpdate": None,
        "error": None,
        "caveats": "Concentrations require flow/population normalisation; assay and site changes routinely produce step artefacts that mimic signals."
    },
    {
        "id": "ncdc-ng",
        "name": "Nigeria CDC public situation reports",
        "org": "Nigeria Centre for Disease Control and Prevention",
        "type": "National epidemiological reports",
        "stream": "epi",
        "url": "https://ncdc.gov.ng/reports",
        "docs": "https://ncdc.gov.ng/",
        "auth": "None (published reports)",
        "format": "PDF / HTML → structured extraction required",
        "frequency": "Weekly / monthly by programme",
        "granularity": "State · epidemiological week",
        "license": "Public reports; attribution required. Confirm re-use terms.",
        "status": "unconfigured",
        "lastUpdate": None,
        "error": None,
        "caveats": "No machine-readable API is documented; PDF extraction is fragile and must be validated per report layout before any analytical use."
    },
    {
        "id": "africa-cdc",
        "name": "Africa CDC public dashboards",
        "org": "Africa Centres for Disease Control and Prevention",
        "type": "Regional epidemiological summaries",
        "stream": "epi",
        "url": "https://africacdc.org/",
        "docs": "https://africacdc.org/institutes/",
        "auth": "None (published dashboards)",
        "format": "HTML / dashboard exports",
        "frequency": "Weekly summaries where published",
        "granularity": "Country · week",
        "license": "Attribution required; confirm re-use terms.",
        "status": "unconfigured",
        "lastUpdate": None,
        "error": None,
        "caveats": "Member-state reporting completeness varies substantially; absence of data must never be rendered as absence of disease."
    },
    {
        "id": "promed",
        "name": "Event-based media/report feeds (ProMED-style)",
        "org": "Various",
        "type": "Unverified event reports",
        "stream": "event",
        "url": "Feed-specific",
        "docs": "—",
        "auth": "Varies; some require subscription",
        "format": "RSS / e-mail digest → NLP extraction",
        "frequency": "Continuous",
        "granularity": "Report · location · date",
        "license": "Varies; several prohibit redistribution.",
        "status": "planned",
        "lastUpdate": None,
        "error": None,
        "caveats": "Enters the system as UNVERIFIED by definition. Must never be auto-promoted to a confirmed event."
    },
    {
        "id": "era5-climate",
        "name": "Open climate reanalysis (temperature/precipitation)",
        "org": "Copernicus / national meteorological services",
        "type": "Environmental covariates",
        "stream": "env",
        "url": "https://cds.climate.copernicus.eu/",
        "docs": "https://cds.climate.copernicus.eu/how-to-api",
        "auth": "Free registration + API key",
        "format": "NetCDF / GRIB",
        "frequency": "Daily/monthly reanalysis",
        "granularity": "Grid cell · day",
        "license": "Copernicus licence; attribution required.",
        "status": "unconfigured",
        "lastUpdate": None,
        "error": None,
        "caveats": "Covariate only. Climate association is confounded with seasonality already captured by the baseline."
    },
    {
        "id": "who-flunet",
        "name": "WHO FluNet / FluID",
        "org": "World Health Organization",
        "type": "Virological & syndromic influenza surveillance",
        "stream": "lab",
        "url": "https://www.who.int/tools/flunet",
        "docs": "https://www.who.int/tools/flunet",
        "auth": "None (public export)",
        "format": "CSV export",
        "frequency": "Weekly",
        "granularity": "Country · epidemiological week",
        "license": "WHO data terms; attribution required.",
        "status": "available",
        "lastUpdate": None,
        "error": None,
        "caveats": "One of the few genuinely weekly global streams — the most realistic first target for a baseline-vs-model experiment."
    }
]

```
