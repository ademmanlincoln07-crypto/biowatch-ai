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
