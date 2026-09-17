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
