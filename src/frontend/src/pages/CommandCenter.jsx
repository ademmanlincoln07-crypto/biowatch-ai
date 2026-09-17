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
