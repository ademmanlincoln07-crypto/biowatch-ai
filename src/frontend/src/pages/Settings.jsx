/* ============================================================
   BIOWATCH-AI — SETTINGS & NOTIFICATIONS (SEGMENT 12 / 20)
   Notification capability is designed but hard-disabled: this
   prototype must never transmit anything resembling a
   public-health alert.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Field, Select, Input, Checkbox, Stat, NotImplemented, Disclosure,
} from '../components/ui';
import { useMode, MODES } from '../lib/mode';
import { ALERT_STATES } from '../lib/evidence';

export default function Settings() {
  const { mode, setMode, session, setSession } = useMode();
  const [thresholds, setThresholds] = useState({ k: 2, persistence: 2, minHistory: 52 });
  const [channels, setChannels] = useState({ dashboard: true, email: false, webhook: false, report: false });
  const [prefs, setPrefs] = useState({ reduceMotion: false, density: 'comfortable', tags: true });

  return (
    <>
      <PageHeader kicker="Module 23" title="Settings & Notifications" evidence="PLAN"
        description="Platform configuration, detection parameters and the notification design. External delivery is disabled and cannot be enabled in this build." />

      <Callout tone="danger" title="Notification hard-stop" icon={<Icons.BellOff size={12} />}>
        BIOWATCH-AI must never send anything that could be received as a public-health alert. Email, webhook and
        report delivery are disabled at the code level in this prototype. In a deployed system they would require
        explicit institutional authorisation, a named accountable owner, and a documented recipient list — none of
        which exists.
      </Callout>

      <Grid cols="xl:grid-cols-2" className="mt-3">
        <div className="space-y-3">
          <Panel title="Prototype mode" evidence="ESTABLISHED"
            subtitle="Always visible in the top bar. Switching never converts synthetic values into live values.">
            <div className="space-y-2">
              {Object.values(MODES).map((m, i) => (
                <button key={m.key} type="button" onClick={() => setMode(m.key)}
                  className={`block w-full rounded-sm border px-3 py-2.5 text-left transition-colors ${
                    mode === m.key ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                  <div className="flex items-center gap-2">
                    <Dot color={m.color} />
                    <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: m.color }}>
                      MODE {i + 1} — {m.key}
                    </span>
                    {mode === m.key && <Pill color={m.color} className="ml-auto">ACTIVE</Pill>}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-bw-muted">{m.description}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Detection parameters" evidence="ASSUMPTION"
            subtitle="These are policy choices about tolerable false alarms, not statistical facts.">
            <Grid cols="sm:grid-cols-3">
              <Field label="Exceedance multiplier k" hint="Higher k = fewer alarms, later detection.">
                <Select value={String(thresholds.k)} onChange={(v) => setThresholds({ ...thresholds, k: Number(v) })}
                  options={['1.5', '2', '2.5', '3', '3.5'].map((v) => ({ value: v, label: `k = ${v}` }))} />
              </Field>
              <Field label="Persistence (weeks)" hint="Consecutive exceedances before escalation.">
                <Select value={String(thresholds.persistence)} onChange={(v) => setThresholds({ ...thresholds, persistence: Number(v) })}
                  options={['1', '2', '3', '4'].map((v) => ({ value: v, label: `${v} week(s)` }))} />
              </Field>
              <Field label="Minimum history (weeks)" hint="Below this, no baseline is estimated and the series is marked unavailable.">
                <Select value={String(thresholds.minHistory)} onChange={(v) => setThresholds({ ...thresholds, minHistory: Number(v) })}
                  options={['26', '52', '104', '156'].map((v) => ({ value: v, label: `${v} weeks` }))} />
              </Field>
            </Grid>
            <Callout tone="warn" title="Recorded as a provisional decision">
              The defaults (k = 2, persistence = 2) exist to make the interface demonstrable. They are logged in
              the decision register as DEC-009 with status PROVISIONAL, pending an agreed alarm-rate budget.
            </Callout>
          </Panel>

          <Panel title="Display preferences" evidence="PLAN">
            <div className="space-y-2">
              <Checkbox checked={prefs.tags} onChange={(v) => setPrefs({ ...prefs, tags: v })}
                label="Show epistemic tags on every panel"
                hint="Cannot be disabled in this build — provenance labelling is structural." />
              <Checkbox checked={prefs.reduceMotion} onChange={(v) => setPrefs({ ...prefs, reduceMotion: v })}
                label="Reduce motion" hint="The interface already avoids decorative animation; this honours the OS-level preference explicitly." />
              <Field label="Density">
                <Segmented value={prefs.density} onChange={(v) => setPrefs({ ...prefs, density: v })}
                  options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} />
              </Field>
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Notification channels" evidence="PLAN"
            subtitle="Designed capability. Every external channel is disabled at code level.">
            <div className="space-y-2">
              {[
                ['dashboard', 'Dashboard alerts', 'In-interface only. Visible to authenticated reviewers.', true],
                ['email', 'E-mail digest', 'Would require SMTP configuration, an authorised recipient list and a named accountable owner.', false],
                ['webhook', 'API / webhook', 'Would push structured candidate signals to an authorised internal endpoint only.', false],
                ['report', 'Downloadable alert report', 'PDF/Markdown export of a reviewed signal, watermarked as a research prototype output.', false],
              ].map(([k, name, desc, allowed]) => (
                <div key={k} className={`rounded-sm border px-2.5 py-2 ${allowed ? 'border-bw-line bg-bw-panel2/40' : 'border-dashed border-bw-line2 bg-bw-panel2/20'}`}>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" disabled={!allowed} checked={channels[k]}
                      onChange={(e) => setChannels({ ...channels, [k]: e.target.checked })}
                      className="mt-[3px] h-3.5 w-3.5 accent-[var(--color-bw-primary)]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] text-bw-text">{name}</span>
                        <span className="font-mono text-[8.5px] tracking-[0.08em]"
                          style={{ color: allowed ? 'var(--color-alert-green)' : 'var(--color-alert-red)' }}>
                          {allowed ? 'AVAILABLE' : 'DISABLED — NOT AUTHORISED'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-bw-dim">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 rounded-sm border border-bw-line bg-[#0a1218] p-2.5">
              <div className="bw-label mb-1">Delivery preconditions (all unmet)</div>
              <ul className="space-y-1 text-[10.5px] text-bw-muted">
                {['Institutional authorisation on file', 'Named accountable owner', 'Defined recipient list with consent',
                  'Escalation policy agreed with recipients', 'Rate limit and quiet hours configured',
                  'Message template reviewed for permitted phrasing'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.X size={11} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{x}</li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title="Notification rules (design)" evidence="PLAN">
            <Table dense columns={[
              { key: 'state', header: 'State', render: (r) => (
                <span className="flex items-center gap-1.5"><Dot color={ALERT_STATES[r.state].color} />
                  <span className="font-mono text-[9.5px]" style={{ color: ALERT_STATES[r.state].color }}>{r.state}</span></span>) },
              { key: 'who', header: 'Recipient' },
              { key: 'when', header: 'Timing' },
              { key: 'ch', header: 'Channel' },
            ]} rows={[
              { state: 'YELLOW', who: 'Duty analyst queue', when: 'Next daily digest', ch: 'Dashboard' },
              { state: 'ORANGE', who: 'Duty analyst', when: 'Within working hours', ch: 'Dashboard (+ e-mail if authorised)' },
              { state: 'RED', who: 'Senior epidemiologist', when: 'Immediate', ch: 'Dashboard (+ e-mail if authorised)' },
              { state: 'GREEN', who: '—', when: 'No notification', ch: '—' },
            ]} />
            <p className="mt-2 text-[10px] leading-snug text-bw-dim">
              Note that even a RED interface state notifies an internal reviewer only. There is no rule, and no
              code path, that notifies anyone outside the review team.
            </p>
          </Panel>

          <Panel title="Session" evidence="PLAN">
            <KV items={[
              { k: 'Display name', v: session?.name || 'Guest' },
              { k: 'Role', v: session?.role || 'Read-only viewer' },
              { k: 'Authenticated', v: 'No — prototype has no authentication' },
              { k: 'Storage', v: 'Browser local storage only' },
            ]} />
            <div className="mt-2 flex gap-2">
              <Btn size="sm" onClick={() => setSession(null)}><Icons.LogOut size={12} /> Clear session</Btn>
              <Btn size="sm" variant="danger" onClick={() => { try { localStorage.clear(); } catch { /* ignore */ } window.location.reload(); }}>
                <Icons.Trash2 size={12} /> Reset all local state
              </Btn>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}
