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
