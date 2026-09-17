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
