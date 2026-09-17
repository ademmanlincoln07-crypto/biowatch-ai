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
