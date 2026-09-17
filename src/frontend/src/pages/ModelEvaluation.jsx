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
