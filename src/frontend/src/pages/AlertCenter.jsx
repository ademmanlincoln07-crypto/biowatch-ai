/* ============================================================
   BIOWATCH-AI — EARLY-WARNING CENTER (alert triage)
   Alert states are INTERFACE states, never public-health calls.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Grid, Stat, Btn, Segmented, KV, NoData, Field, Select,
} from '../components/ui';
import { SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { ALERT_STATES, ALERT_DISCLAIMER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';

const WORKFLOW = ['Awaiting triage', 'Under review', 'Investigation requested', 'Explained — reporting artefact', 'Closed — no action'];

export default function AlertCenter() {
  const { isDemo, session } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [filter, setFilter] = useState('ALL');
  const [selId, setSelId] = useState(S.alerts[0]?.id);
  const [statuses, setStatuses] = useState(() => Object.fromEntries(S.alerts.map((a) => [a.id, a.status])));
  const [log, setLog] = useState([]);
  const [note, setNote] = useState('');

  const alerts = S.alerts.filter((a) => filter === 'ALL' || a.state === filter);
  const sel = S.alerts.find((a) => a.id === selId);
  const country = S.countries.find((c) => c.iso === sel?.iso);

  const adjudicate = (status) => {
    if (!sel) return;
    setStatuses((s) => ({ ...s, [sel.id]: status }));
    setLog((l) => [{
      id: sel.id, status, at: fmtTs(), by: session?.name || 'Guest (read-only)',
      note: note || '(no rationale recorded)',
    }, ...l]);
    setNote('');
  };

  const counts = ['RED', 'ORANGE', 'YELLOW', 'GREEN'].map((k) => ({
    k, n: k === 'GREEN'
      ? S.countries.filter((c) => c.state === 'GREEN' && c.availability !== 'none').length
      : S.alerts.filter((a) => a.state === k).length,
  }));

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 08" title="Early-Warning Center" evidence="PLAN"
          description="Triage queue for candidate signals awaiting human adjudication." />
        <Callout tone="info" title="No candidate signals in this mode">
          Signals are produced only by detectors running on bound data. Nothing is bound in the active mode.
        </Callout>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 08" title="Early-Warning Center" evidence="SIMULATED"
        description="Candidate signals produced by statistical detectors on synthetic series, queued for analyst adjudication. No alert is ever transmitted externally from this prototype." />

      <div className="mb-3"><SimulatedBanner /></div>

      <Callout tone="danger" title="Standing constraint on every alert on this page" icon={<Icons.TriangleAlert size={12} />}>
        {ALERT_DISCLAIMER} No entry here states or implies that an outbreak exists.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        {counts.map(({ k, n }) => (
          <div key={k} className="rounded-md border bg-bw-panel px-3 py-2.5"
            style={{ borderColor: ALERT_STATES[k].color + '55', borderLeftWidth: 2, borderLeftColor: ALERT_STATES[k].color }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: ALERT_STATES[k].color }}>{k}</span>
              <span className="bw-num text-[20px] font-semibold text-bw-text">{n}</span>
            </div>
            <div className="mt-1 text-[11px] text-bw-text">{ALERT_STATES[k].title}</div>
            <p className="mt-1 text-[10px] leading-snug text-bw-dim">{ALERT_STATES[k].meaning}</p>
          </div>
        ))}
      </Grid>

      <Grid cols="xl:grid-cols-[380px_1fr]">
        {/* ---------- Queue ---------- */}
        <Panel title="Triage queue" evidence="SIMULATED"
          subtitle={`${alerts.length} candidate signal${alerts.length === 1 ? '' : 's'}`}
          actions={<Segmented size="xs" value={filter} onChange={setFilter}
            options={[{ value: 'ALL', label: 'All' }, { value: 'RED', label: 'Red', color: ALERT_STATES.RED.color },
              { value: 'ORANGE', label: 'Orange', color: ALERT_STATES.ORANGE.color }, { value: 'YELLOW', label: 'Yellow', color: ALERT_STATES.YELLOW.color }]} />}
          bodyClass="max-h-[720px] overflow-y-auto">
          <div className="space-y-1.5">
            {alerts.map((a) => (
              <button key={a.id} type="button" onClick={() => setSelId(a.id)}
                className={`block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  selId === a.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'
                }`}>
                <div className="flex items-center gap-2">
                  <Dot color={ALERT_STATES[a.state].color} pulse={a.state === 'RED'} />
                  <span className="bw-num text-[10px] text-bw-dim">{a.id}</span>
                  <span className="ml-auto font-mono text-[9px] tracking-[0.1em]" style={{ color: ALERT_STATES[a.state].color }}>{a.state}</span>
                </div>
                <div className="mt-1 text-[12px] text-bw-text">{a.country} · {a.pathogen}</div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="bw-num text-[10px] text-bw-dim">z = {a.z}</span>
                  <span className="text-[9.5px] text-bw-muted">{statuses[a.id]}</span>
                </div>
              </button>
            ))}
            {alerts.length === 0 && <NoData reason="No candidate signal matches this filter." />}
          </div>
        </Panel>

        {/* ---------- Detail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          {sel ? (
            <>
              <Panel accent={ALERT_STATES[sel.state].color} evidence="SIMULATED"
                title={`${sel.id} — ${sel.country} · ${sel.pathogen}`}
                subtitle="Structured candidate-signal record. Every field below is required before a signal may enter the queue."
                actions={<Pill color={ALERT_STATES[sel.state].color} filled>{sel.state}</Pill>}>

                <div className="mb-3 rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                  <div className="bw-label mb-1">What changed</div>
                  <p className="text-[12.5px] leading-relaxed text-bw-text">{sel.what}</p>
                </div>

                <Grid cols="md:grid-cols-2" gap="gap-2.5">
                  <div className="space-y-2.5">
                    {[
                      ['Where', sel.where, 'MapPin'],
                      ['When', sel.when, 'Clock'],
                      ['Detecting stream', `${STREAMS[sel.source].label} — ${sel.sources.map((s) => STREAMS[s].label).join(', ')}`, 'Radio'],
                      ['Detector used', sel.detector, 'Radar'],
                      ['Model used', sel.model, 'Brain'],
                    ].map(([k, v, icon]) => {
                      const C = Icons[icon];
                      return (
                        <div key={k} className="flex gap-2">
                          <C size={13} className="mt-[3px] shrink-0 text-bw-dim" />
                          <div className="min-w-0">
                            <div className="bw-label">{k}</div>
                            <div className="mt-0.5 text-[11.5px] leading-snug text-bw-text">{v}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2.5">
                    <div className="rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                      <div className="bw-label mb-1.5">Baseline comparison</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[['Observed', sel.observed.toLocaleString()], ['Expected', sel.baseline.toLocaleString()],
                          ['95% interval', `${sel.interval[0]}–${sel.interval[1]}`], ['Deviation', `z = ${sel.z}`]].map(([k, v]) => (
                          <div key={k}>
                            <div className="bw-label">{k}</div>
                            <div className="bw-num mt-0.5 text-[12.5px] text-bw-text">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                      <div className="bw-label mb-1">Confidence & uncertainty</div>
                      <div className="mb-1 flex items-center gap-2">
                        <Pill color={sel.confidence === 'Moderate' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)'}>
                          {sel.confidence} confidence in the OBSERVATION
                        </Pill>
                      </div>
                      <p className="text-[11px] leading-relaxed text-bw-muted">{sel.uncertainty}</p>
                      <p className="mt-1 text-[11px] text-bw-muted">{sel.concordance}</p>
                    </div>
                  </div>
                </Grid>

                <div className="mt-3">
                  <div className="bw-label mb-1.5">Possible alternative explanations (not excluded)</div>
                  <ul className="space-y-1">
                    {sel.alternatives.map((alt) => (
                      <li key={alt} className="flex gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5 text-[11.5px] text-bw-muted">
                        <Icons.CircleHelp size={13} className="mt-[2px] shrink-0 text-bw-dim" />{alt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[10.5px] text-bw-dim">
                    A signal may not be escalated until each alternative above has been considered and the
                    reasoning recorded. {SAFE_LANGUAGE.insufficient} until then.
                  </p>
                </div>

                <div className="mt-3 rounded-sm border p-2.5" style={{ borderColor: ALERT_STATES[sel.state].color + '55', background: ALERT_STATES[sel.state].color + '0d' }}>
                  <div className="bw-label mb-1">Recommended human review</div>
                  <p className="text-[12px] leading-relaxed text-bw-text">{sel.recommended}</p>
                </div>
              </Panel>

              <Grid cols="lg:grid-cols-[1.4fr_1fr]">
                <Panel title="Series in context" evidence="SIMULATED"
                  subtitle="Observed vs baseline for the detecting stream.">
                  {country && <SignalChart data={country.series.slice(-78)} height={190} />}
                </Panel>

                <Panel title="Adjudication" evidence="PLAN"
                  subtitle="Analyst action. Recorded locally in this session only — nothing is transmitted.">
                  <Field label="Reviewer rationale (required in production)">
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                      placeholder="e.g. Checked source revision history; increase coincides with a laboratory reporting backlog clearing."
                      className="w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[11.5px] text-bw-text placeholder:text-bw-dim outline-none focus:border-bw-primary" />
                  </Field>
                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {WORKFLOW.map((wstat) => (
                      <Btn key={wstat} size="xs" variant={statuses[sel.id] === wstat ? 'outline' : 'ghost'}
                        onClick={() => adjudicate(wstat)} className="justify-start">
                        {statuses[sel.id] === wstat ? <Icons.CircleDot size={11} /> : <Icons.Circle size={11} />} {wstat}
                      </Btn>
                    ))}
                  </div>
                  <Callout tone="danger" title="Blocked action">
                    <span className="flex items-center gap-2">
                      <Icons.Ban size={12} className="shrink-0" />
                      "Declare outbreak" is not an available action in this system, by design and at any role level.
                    </span>
                  </Callout>
                </Panel>
              </Grid>

              <Panel title="Session adjudication log" evidence="PLAN"
                subtitle="Append-only in production. Entries are superseded, never deleted.">
                <Table dense columns={[
                  { key: 'at', header: 'Timestamp', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.at}</span> },
                  { key: 'id', header: 'Signal', render: (r) => <span className="bw-num text-[10.5px]">{r.id}</span> },
                  { key: 'status', header: 'Adjudication' },
                  { key: 'by', header: 'Reviewer', render: (r) => <span className="text-[11px] text-bw-muted">{r.by}</span> },
                  { key: 'note', header: 'Rationale', render: (r) => <span className="text-[11px] text-bw-muted">{r.note}</span> },
                ]} rows={log} empty="No adjudication recorded in this session." />
              </Panel>
            </>
          ) : <Panel title="Signal detail"><NoData reason="Select a candidate signal from the queue." /></Panel>}
        </div>
      </Grid>

      <div className="mt-3">
        <Panel title="Escalation policy (design)" evidence="PLAN">
          <Grid cols="md:grid-cols-4">
            {Object.values(ALERT_STATES).map((s) => (
              <div key={s.key} className="rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5" style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
                <div className="font-mono text-[10px] tracking-[0.14em]" style={{ color: s.color }}>{s.key}</div>
                <div className="mt-1 text-[11.5px] text-bw-text">{s.title}</div>
                <p className="mt-1 text-[10.5px] leading-snug text-bw-dim">{s.meaning}</p>
              </div>
            ))}
          </Grid>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Link to="/app/settings"><Btn size="xs"><Icons.Bell size={11} /> Notification configuration</Btn></Link>
            <Link to="/app/xai"><Btn size="xs"><Icons.Lightbulb size={11} /> Explain this signal</Btn></Link>
            <span className="text-[10px] text-bw-dim">External notification channels are disabled and cannot be enabled in this build.</span>
          </div>
        </Panel>
      </div>
    </>
  );
}
