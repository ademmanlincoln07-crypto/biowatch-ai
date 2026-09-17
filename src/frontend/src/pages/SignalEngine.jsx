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
