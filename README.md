# BIOWATCH-AI

> **Biological Surveillance Research Prototype** — AI-assisted biological surveillance & early outbreak signal detection. A single-file, no-dependency research prototype designed with explicit epistemic honesty: no trained model, no real surveillance data, no outbreak-declaration code path.

![BIOWATCH-AI logo](biowatch-logo.png)

> ⚠️ **Research prototype, not a clinical diagnostic or operational public-health system.** Every demonstration value is deterministic synthetic output labelled **SIMULATED** at its point of use. See the *Structural Honesty Rules* below.

## Quick start

```bash
# Open directly in any modern browser — no build step, no framework, no CDN
open index.html        # macOS
xdg-open index.html   # Linux
start index.html      # Windows
```

Or just double-click `index.html`. The entire application — design system, data layer, statistical detectors, world map, 25 modules, router — is self-contained in that one file. No network access required.

## What it is

BIOWATCH-AI is a research prototype exploring what an **honest** AI-assisted biological-surveillance interface could look like. It ships with:

- 🧬 **25 integrated modules** covering pathogen registries, geography, data-stream connectors, statistical detectors (CUSUM, EARS, Farrington), genomic/epi signals, environmental streams, lab capacity, event feeds
- 🗺️ **Inline-SVG world map** with country-level status and data-availability hatching (missing data is hatched, never green)
- 📊 **SVG chart renderers** (no chart library) — timeseries, heatmaps, ROC-style confidence, detector traces
- 🔌 **14 public-source connectors registered** (GISAID, GenBank, WHO, ProMED, HealthMap, etc.) — all unconfigured by default, with "Awaiting credentials/configuration" states instead of fake data
- 🧠 **"ML layer" intentionally inert** — the machine-learning stage cannot contribute to any signal until an actual model is trained and validated; baseline-first architecture enforced in code
- 📝 **Epistemic tagging** on every figure: ESTABLISHED / ASSUMPTION / HYPOTHESIS / PRELIMINARY / PREDICTION / PLAN / SIMULATED
- 📖 **Master log of structural decisions** built into the UI (rationale, evidence, alternatives, status)
- 🎯 **Constrained vocabulary** — UI can say "Signal detected" or "Unusual activity" but is code-blocked from ever saying "outbreak confirmed"
- ♿ Accessible contrast, reduced-motion support, no neon/gaming glow

## Structural Honesty Rules (enforced in code)

1. **Baseline before model.** The ML stage is inert and cannot contribute to any signal.
2. **Epistemic tags.** Every figure carries an ESTABLISHED / ASSUMPTION / HYPOTHESIS / PRELIMINARY / PREDICTION / PLAN / SIMULATED tag.
3. **Constrained vocabulary.** No code path declares an outbreak at any privilege level.
4. **Missing data is hatched** and labelled DATA NOT AVAILABLE — never green.
5. **"Awaiting experiment"** appears where a real experiment would be needed, never a plausible-looking number.
6. **Unconfigured connectors say so** — synthetic values are never substituted for live data.

## File layout

```
biowatch-ai/
├── index.html              # Entire app (single file, ~425 KB, no deps)
├── world.compact.txt       # Compact country geometry for the inline-SVG map
├── biowatch-logo.png
├── biowatch-logo-transparent.png
└── screenshot.png
```

## How to use it

Open `index.html` and you land on the **Overview** dashboard. Use the top nav or hash routes:

- `#landing` — project overview & integrity statement
- `#signals` — active detection signals across streams
- `#pathogens` — pathogen registry
- `#map` — world-map view
- `#streams` — data-stream status (all 14 connectors start as "unconfigured")
- `#detectors` — CUSUM / EARS / Farrington detector configuration
- `#genomics` / `#environment` / `#labcapacity` / `#events` — domain panels
- `#ml` — intentionally-disabled ML stage with honest "awaiting training data" state
- `#decisions` — master log of structural decisions
- `#settings` — configuration

## What it is NOT

- ❌ Not a clinical diagnostic device
- ❌ Not an operational public-health system
- ❌ Not evidence of any real outbreak — there is no trained model, no reference label set, no validated performance figure
- ❌ Not connected to real surveillance data by default — all demo values are deterministic synthetic output
- ❌ Not a record of any real research programme

Open DevTools and you'll see the integrity statement printed in the console on boot.

## Topics / Tags

`public-health` `biosurveillance` `early-warning` `epidemiology` `syndromic-surveillance` `outbreak-detection` `cusum` `ears` `farrington` `single-page-app` `no-dependencies` `epistemic-honesty` `responsible-ai` `dark-mode` `svg-charts` `research-prototype` `world-map`

## License

BIOWATCH-AI is released under a **Research-Use Only** license for transparency and academic review. See the LICENSE file for full terms. The structural honesty rules are a non-negotiable part of the code: removing or weakening them invalidates the spirit of the project.

---

*"The interface can say 'Signal detected.' It can never say 'Outbreak confirmed.'"*
