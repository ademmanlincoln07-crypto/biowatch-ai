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
