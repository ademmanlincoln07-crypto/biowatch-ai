/* ============================================================
   BIOWATCH-AI — SECURITY & RESPONSIBLE AI (SEGMENT 12)
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Disclosure, NotImplemented,
} from '../components/ui';
import { EVIDENCE, EVIDENCE_ORDER, SAFE_LANGUAGE, SIGNAL_PHRASES } from '../lib/evidence';

const CONTROLS = [
  { area: 'Authentication', control: 'Institutional SSO (OIDC/SAML) with MFA for analyst and admin roles', state: 'planned',
    note: 'The prototype stores a self-declared role in local storage and authenticates nobody.' },
  { area: 'Authorisation', control: 'Role-based access control enforced server-side on every endpoint', state: 'planned',
    note: 'Client-side role display only in this build; a client-side check is not a security control.' },
  { area: 'Audit logging', control: 'Append-only log of logins, adjudications, connector edits, exports and runs', state: 'partial',
    note: 'Session-local demonstration; no durable log exists.' },
  { area: 'Data provenance', control: 'Source, licence, retrieval timestamp and checksum attached to every record', state: 'partial',
    note: 'Enforced in the interface contract; not persisted without a backend.' },
  { area: 'Secret handling', control: 'API credentials in a server-side secret store, never exposed to the browser', state: 'planned',
    note: 'No credentials exist in this build.' },
  { area: 'Transport security', control: 'TLS everywhere; HSTS; strict CSP', state: 'planned', note: 'Deployment concern.' },
  { area: 'Privacy', control: 'Aggregate surveillance data only; no patient-level records ingested', state: 'implemented',
    note: 'Architecturally enforced: no schema in the design accepts individual-level clinical data.' },
  { area: 'Minimum aggregation', control: 'Suppression of small cells to prevent re-identification', state: 'planned',
    note: 'Required before any sub-national or molecular-cluster display.' },
  { area: 'Bias monitoring', control: 'Performance and alarm rates stratified by region, completeness and delay', state: 'planned',
    note: 'Cannot run until a model exists; the metric contract already requires it.' },
  { area: 'Human oversight', control: 'No automated route from detector output to external communication', state: 'implemented',
    note: 'The "declare outbreak" action does not exist at any role level.' },
  { area: 'Uncertainty communication', control: 'Every figure carries an epistemic tag; intervals shown with point estimates', state: 'implemented',
    note: 'Enforced by the UI kit — a value cannot render without a tag.' },
  { area: 'Model governance', control: 'Model card required before a method can appear in the interface', state: 'implemented',
    note: 'Four cards registered, none for a trained model.' },
];

const STATE_META = {
  implemented: { label: 'IMPLEMENTED', color: 'var(--color-alert-green)' },
  partial: { label: 'PARTIAL', color: 'var(--color-alert-yellow)' },
  planned: { label: 'PLANNED', color: 'var(--color-bw-dim)' },
};

const HARMS = [
  ['False reassurance', 'A green state where data is simply missing tells a user that nothing is happening. Mitigation: hatched "insufficient data" fill, distinct from green, on every map and table.'],
  ['False alarm burden', 'Alarms that outnumber analyst capacity destroy trust in the system and in genuine signals. Mitigation: alarm-rate budget must be agreed before deployment; multiple-testing burden reported.'],
  ['Geographic inequity', 'Models trained where surveillance is strongest under-detect where capacity is weakest. Mitigation: stratified performance reporting is mandatory; capacity indicators shown alongside signals.'],
  ['Unearned authority', 'A polished dashboard makes weak evidence look strong. Mitigation: epistemic tags, standing disclaimers, and refusal to display fabricated metrics.'],
  ['Stigmatisation', 'Country-level alarm displays can drive travel, trade and social consequences disproportionate to the evidence. Mitigation: permitted-phrasing vocabulary; no confirmation language; human review before any external statement.'],
  ['Misuse of biological data', 'Molecular capability can attract dual-use interest. Mitigation: scope restricted to aggregate metadata; no sequence generation; institutional biosecurity review required before any genomic integration.'],
];

export default function Responsible() {
  const [tab, setTab] = useState('security');

  return (
    <>
      <PageHeader kicker="Module 22" title="Security & Responsible AI" evidence="PLAN"
        description="Controls, governance and the harms this system could plausibly cause. Each control states honestly whether it is implemented, partial or planned." />

      <div className="mb-3">
        <Segmented value={tab} onChange={setTab} options={[
          { value: 'security', label: 'Controls' }, { value: 'harms', label: 'Harm analysis' },
          { value: 'language', label: 'Language policy' }, { value: 'oversight', label: 'Human oversight' },
        ]} />
      </div>

      {tab === 'security' && (
        <>
          <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
            {Object.entries(STATE_META).map(([k, m]) => (
              <Stat key={k} label={m.label} value={CONTROLS.filter((c) => c.state === k).length} evidence="ESTABLISHED"
                color={m.color} sub={`of ${CONTROLS.length} controls`} />
            ))}
            <Stat label="Patient-level records held" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)"
              sub="No schema accepts them" />
          </Grid>

          <Panel title="Control register" evidence="ESTABLISHED">
            <Table rowKey="control" columns={[
              { key: 'area', header: 'Area', render: (r) => <Pill color="var(--color-bw-line2)">{r.area}</Pill> },
              { key: 'control', header: 'Control', render: (r) => <span className="text-[11.5px] text-bw-text">{r.control}</span> },
              { key: 'state', header: 'State', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: STATE_META[r.state].color }}>
                  {STATE_META[r.state].label}</span>) },
              { key: 'note', header: 'Honest note', render: (r) => <span className="text-[11px] text-bw-muted">{r.note}</span> },
            ]} rows={CONTROLS} />
          </Panel>

          <Grid cols="lg:grid-cols-2" className="mt-3">
            <Panel title="Data protection posture" evidence="PLAN">
              <KV cols={1} mono={false} items={[
                { k: 'Data categories held', v: 'Aggregate counts and indicators only. No names, identifiers, addresses or clinical records.', mono: false },
                { k: 'Lawful basis (if deployed)', v: 'Public-interest research; determined per jurisdiction with institutional guidance.', mono: false },
                { k: 'Retention', v: 'Raw source payloads retained for reproducibility; retention period set per source licence.', mono: false },
                { k: 'Re-identification risk', v: 'Arises at fine spatial granularity and in small molecular clusters. Suppression thresholds mandatory before such displays.', mono: false },
                { k: 'Cross-border transfer', v: 'Deployment-dependent; documented per installation.', mono: false },
              ]} />
            </Panel>
            <Panel title="What a security review would conclude today" evidence="ESTABLISHED">
              <Callout tone="danger" title="Not deployable">
                This build has no authentication, no server-side authorisation, no durable audit log and no
                secret management. It is a design prototype running entirely in a browser. Nothing about it is
                ready for data that matters, and it should not be connected to a restricted source.
              </Callout>
            </Panel>
          </Grid>
        </>
      )}

      {tab === 'harms' && (
        <Grid cols="lg:grid-cols-2">
          {HARMS.map(([t, b]) => (
            <Panel key={t} title={t} evidence="ESTABLISHED" accent="var(--color-alert-orange)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{b}</p>
            </Panel>
          ))}
        </Grid>
      )}

      {tab === 'language' && (
        <Grid cols="lg:grid-cols-2">
          <Panel title="Permitted signal vocabulary" evidence="ESTABLISHED"
            subtitle="The interface may describe a detection using these phrases and no others.">
            <div className="flex flex-wrap gap-1.5">
              {SIGNAL_PHRASES.map((p) => (
                <span key={p} className="rounded-sm border border-[var(--color-alert-green)]/40 bg-[var(--color-alert-green)]/10 px-2 py-1 text-[11.5px] text-bw-text">
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-3 bw-label">Prohibited</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['Outbreak confirmed', 'Epidemic detected', 'Diagnosis', 'Guaranteed prediction',
                'The model proves', 'Validated accuracy', 'Autonomous decision', 'Replaces epidemiologists'].map((p) => (
                <span key={p} className="rounded-sm border border-[var(--color-alert-red)]/40 bg-[var(--color-alert-red)]/10 px-2 py-1 text-[11.5px] text-bw-muted line-through">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-bw-dim">
              This is not cosmetic. Interface language is what a hurried reader takes away, and a system that can
              phrase a statistical deviation as a confirmed event will eventually be quoted as having done so.
            </p>
          </Panel>

          <Panel title="Epistemic labelling scheme" evidence="ESTABLISHED"
            subtitle="Every figure in the platform carries exactly one tag.">
            <div className="space-y-2">
              {EVIDENCE_ORDER.map((k) => (
                <div key={k} className="flex gap-2.5 border-b border-bw-line/50 pb-2 last:border-0">
                  <EvidenceTag t={k} size="xs" />
                  <p className="min-w-0 flex-1 text-[11px] leading-snug text-bw-muted">{EVIDENCE[k].definition}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5">
              <div className="bw-label mb-1">Enforcement</div>
              <p className="text-[11px] leading-relaxed text-bw-muted">
                Tags are applied by the shared UI components, not by individual page authors. A panel rendered
                without an evidence tag is a code-review failure.
              </p>
            </div>
          </Panel>
        </Grid>
      )}

      {tab === 'oversight' && (
        <Grid cols="lg:grid-cols-[1.2fr_1fr]">
          <Panel title="Human-in-the-loop design" evidence="PLAN">
            <ol className="space-y-2.5">
              {[
                ['Detector output is a candidate, not a conclusion', 'The engine emits flags with scores. Nothing downstream treats a flag as an event.'],
                ['Adjudication is mandatory and attributed', 'A named reviewer records a rationale. The rationale is part of the permanent record.'],
                ['Escalation requires alternatives to be excluded', 'The interface lists plausible non-epidemiological explanations; each must be addressed.'],
                ['No automated external communication', 'Notification channels to anyone outside the review team cannot be enabled in this build.'],
                ['Override is always available and always logged', 'A reviewer can dismiss any signal; the dismissal and its reason are retained.'],
                ['The system cannot declare an outbreak', 'There is no code path, at any privilege level, that produces such a statement.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-2.5">
                  <span className="bw-num shrink-0 text-[11px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-[12px] text-bw-text">{t}</div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <div className="space-y-3">
            <Panel title="Bias monitoring plan" evidence="PLAN">
              <ul className="space-y-1.5 text-[11.5px] text-bw-muted">
                {['Sensitivity and alarm rate stratified by WHO region',
                  'Performance stratified by data completeness decile',
                  'Performance stratified by reporting delay',
                  'Explicit reporting of territories excluded for insufficient history',
                  'Comparison of detection rates in high- vs low-capacity settings'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Scale size={12} className="mt-[2px] shrink-0 text-bw-dim" />{x}</li>
                ))}
              </ul>
              <div className="mt-2 font-mono text-[10px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</div>
            </Panel>

            <Panel title="Accountability" evidence="ESTABLISHED">
              <KV cols={1} mono={false} items={[
                { k: 'Who is responsible for a signal?', v: 'The reviewing analyst, named in the audit log. Never "the model".', mono: false },
                { k: 'Who is responsible for a model?', v: 'The researcher named on its model card.', mono: false },
                { k: 'Who can disable a stream?', v: 'Administrator, with the action logged and the reason recorded.', mono: false },
                { k: 'Who can delete history?', v: 'Nobody. The audit log and decision log are append-only.', mono: false },
              ]} />
            </Panel>
          </div>
        </Grid>
      )}
    </>
  );
}
