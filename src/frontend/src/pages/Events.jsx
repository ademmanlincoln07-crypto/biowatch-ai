/* ============================================================
   BIOWATCH-AI — EVENT-BASED INTELLIGENCE (SEGMENT 9)
   Processing of legitimate public information sources.
   Every item enters as UNVERIFIED and requires human
   adjudication. Media reports are never treated as disease data.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  NotImplemented, SimulatedBanner, KV, Stat, NoData, Field, Select,
} from '../components/ui';
import { Bars } from '../components/charts';
import { rng, fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* Synthetic report items — deliberately generic, no real event,
   no real outlet, no real location claim. */
const TEMPLATES = [
  { type: 'Official bulletin', extract: 'Respiratory illness consultations described as elevated in a synthetic administrative area', pathogen: 'Unspecified respiratory', reliability: 'Official source (synthetic)' },
  { type: 'Ministry statement', extract: 'Routine seasonal advisory issued; no unusual activity described', pathogen: 'Influenza-like illness', reliability: 'Official source (synthetic)' },
  { type: 'News report', extract: 'Local reporting of increased clinic attendance; no laboratory confirmation described', pathogen: 'Unspecified febrile illness', reliability: 'Media (synthetic)' },
  { type: 'News report', extract: 'Report references a water-quality incident; no case data provided', pathogen: 'Enteric (unspecified)', reliability: 'Media (synthetic)' },
  { type: 'Professional network post', extract: 'Practitioner describes atypical presentation cluster; single source, unverified', pathogen: 'Unspecified', reliability: 'Low (synthetic)' },
  { type: 'Official bulletin', extract: 'Laboratory network reports increased specimen volume', pathogen: 'Unspecified', reliability: 'Official source (synthetic)' },
  { type: 'News aggregation', extract: 'Duplicate coverage of a previously indexed report', pathogen: 'Unspecified respiratory', reliability: 'Media (synthetic)' },
  { type: 'Regional bulletin', extract: 'Vector-control activity announced following rainfall', pathogen: 'Arboviral (unspecified)', reliability: 'Official source (synthetic)' },
];

const VERIF = {
  unverified: { label: 'UNVERIFIED', color: 'var(--color-bw-dim)' },
  triage: { label: 'IN TRIAGE', color: 'var(--color-alert-yellow)' },
  corroborated: { label: 'CORROBORATED BY OFFICIAL SOURCE', color: 'var(--color-bw-data)' },
  duplicate: { label: 'DUPLICATE — MERGED', color: 'var(--color-bw-dim)' },
  discarded: { label: 'DISCARDED — NOT A HEALTH EVENT', color: 'var(--color-bw-dim)' },
};

export default function Events() {
  const { isDemo } = useMode();
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState('EV-0001');
  const [states, setStates] = useState({});

  const items = useMemo(() => {
    const r = rng('events');
    return Array.from({ length: 14 }, (_, i) => {
      const t = TEMPLATES[i % TEMPLATES.length];
      return {
        id: `EV-${String(i + 1).padStart(4, '0')}`,
        ...t,
        date: `2026-08-${String(6 + (i % 15)).padStart(2, '0')}`,
        location: ['Synthetic Region A', 'Synthetic Region B', 'Synthetic Region C', 'Synthetic Region D'][i % 4],
        source: `${t.type} (synthetic corpus)`,
        confidence: ['Low', 'Low', 'Moderate'][Math.floor(r() * 3)],
        signalStrength: +(0.1 + r() * 0.6).toFixed(2),
        state: i === 0 ? 'triage' : i % 5 === 0 ? 'corroborated' : i % 7 === 0 ? 'duplicate' : 'unverified',
      };
    });
  }, []);

  const withState = items.map((i) => ({ ...i, state: states[i.id] || i.state }));
  const filtered = withState.filter((i) => filter === 'all' || i.state === filter);
  const sel = withState.find((i) => i.id === selId) || withState[0];

  const byType = useMemo(() => {
    const m = {};
    withState.forEach((i) => { m[i.type] = (m[i.type] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [withState]);

  return (
    <>
      <PageHeader kicker="Module 13" title="Event-Based Intelligence" evidence="PLAN"
        description="Structured extraction from official bulletins and vetted public reporting. Items enter as unverified by definition and can only change state through analyst adjudication." />

      <Callout tone="danger" title="Non-negotiable rule for this module" icon={<Icons.ShieldAlert size={12} />}>
        A media report, social post or aggregated headline is <span className="text-bw-text">never</span> treated as a
        confirmed disease event, is never counted as a case, and never contributes to a case series. It can only
        prompt a human to go and check an official source. Automatic promotion of an unverified report to a signal
        is not implementable in this design.
      </Callout>

      {isDemo && <div className="my-3"><SimulatedBanner text="SIMULATED CORPUS — generic placeholder reports. No real outlet, event, location or statement is represented." /></div>}

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Items in corpus" value={withState.length} evidence="SIMULATED" sub="Synthetic placeholder reports" />
        <Stat label="Unverified" value={withState.filter((i) => i.state === 'unverified').length} evidence="SIMULATED" color="var(--color-bw-muted)" sub="Default state on ingestion" />
        <Stat label="Corroborated by official source" value={withState.filter((i) => i.state === 'corroborated').length} evidence="SIMULATED" color="var(--color-bw-data)" sub="Still not a confirmed event" />
        <Stat label="Auto-promoted to signals" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)" sub="Prohibited by design" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Event corpus" evidence="SIMULATED"
            subtitle="Structured extraction output awaiting human review."
            actions={<Segmented size="xs" value={filter} onChange={setFilter} options={[
              { value: 'all', label: 'All' }, { value: 'unverified', label: 'Unverified' },
              { value: 'triage', label: 'In triage' }, { value: 'corroborated', label: 'Corroborated' },
            ]} />}>
            <Table rowKey="id" columns={[
              { key: 'id', header: 'ID', render: (r) => (
                <button className="bw-num text-[10.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSelId(r.id)}>{r.id}</button>) },
              { key: 'date', header: 'Date', render: (r) => <span className="bw-num text-[10.5px] text-bw-dim">{r.date}</span> },
              { key: 'type', header: 'Source type', render: (r) => <span className="text-[11px] text-bw-muted">{r.type}</span> },
              { key: 'location', header: 'Location', render: (r) => <span className="text-[11px] text-bw-muted">{r.location}</span> },
              { key: 'pathogen', header: 'Pathogen', render: (r) => <span className="text-[11px] text-bw-muted">{r.pathogen}</span> },
              { key: 'extract', header: 'Extracted signal', render: (r) => <span className="text-[11px] text-bw-text">{r.extract}</span> },
              { key: 'state', header: 'Verification', align: 'right', render: (r) => (
                <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: VERIF[r.state].color }}>{VERIF[r.state].label}</span>) },
            ]} rows={filtered} />
          </Panel>

          {sel && (
            <Panel title={`${sel.id} — review record`} evidence="SIMULATED"
              subtitle="Everything an analyst needs to decide whether this warrants checking an official source.">
              <Grid cols="md:grid-cols-2">
                <KV cols={1} mono={false} items={[
                  { k: 'Source', v: sel.source, mono: false },
                  { k: 'Source type', v: sel.type, mono: false },
                  { k: 'Date', v: sel.date },
                  { k: 'Location as stated', v: `${sel.location} (not geocoded — synthetic)`, mono: false },
                  { k: 'Pathogen as stated', v: sel.pathogen, mono: false },
                ]} />
                <KV cols={1} mono={false} items={[
                  { k: 'Extracted signal', v: sel.extract, mono: false },
                  { k: 'Extraction method', v: 'Rule-based template match (NLP model not implemented)', mono: false },
                  { k: 'Extraction confidence', v: sel.confidence, mono: false },
                  { k: 'Corroborating official source', v: sel.state === 'corroborated' ? 'One synthetic official bulletin' : 'None identified', mono: false },
                  { k: 'Verification status', v: VERIF[sel.state].label, mono: false },
                ]} />
              </Grid>

              <div className="mt-3 rounded-sm border border-bw-line bg-bw-panel2/50 p-2.5">
                <div className="bw-label mb-1.5">Analyst adjudication (session only)</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(VERIF).map(([k, v]) => (
                    <Btn key={k} size="xs" variant={sel.state === k ? 'outline' : 'ghost'}
                      onClick={() => setStates((s) => ({ ...s, [sel.id]: k }))}>{v.label}</Btn>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] leading-snug text-bw-dim">
                  No adjudication here creates a case, a count or a signal. Corroboration means only that an
                  official source describing the same situation was located, and the item may be cited as context
                  in a review — never as evidence of incidence.
                </p>
              </div>
            </Panel>
          )}

          <Panel title="Extraction pipeline" evidence="PLAN">
            <div className="flex flex-wrap gap-1.5">
              {[['Ingest', 'done'], ['Deduplicate', 'done'], ['Language detect', 'plan'], ['Entity extraction', 'plan'],
                ['Geocoding', 'plan'], ['Pathogen normalisation', 'plan'], ['Source-reliability score', 'partial'],
                ['Human triage', 'done'], ['Link to official source', 'partial']].map(([s, st]) => (
                <div key={s} className="rounded-sm border px-2 py-1.5" style={{
                  borderColor: st === 'done' ? 'var(--color-alert-green)55' : st === 'partial' ? 'var(--color-alert-yellow)55' : 'var(--color-bw-line2)',
                  background: st === 'done' ? 'var(--color-alert-green)0d' : 'transparent' }}>
                  <span className="text-[11px] text-bw-text">{s}</span>
                  <span className="ml-1.5 font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">{st.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5">
              <NotImplemented what="NLP extraction model"
                plan="Design: multilingual named-entity recognition for pathogen, location and date, plus a claim classifier separating 'official statement of counts' from 'reported concern'. Requires an annotated corpus and per-source licence review before any model is trained." />
            </div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Source-type composition" evidence="SIMULATED">
            <Bars horizontal data={byType} height={160} color="#a98bd6" note="SIMULATED — synthetic corpus" />
          </Panel>

          <Panel title="Source-reliability tiers" evidence="ESTABLISHED"
            subtitle="Tier determines what an item may be used for — never whether it is true.">
            {[
              ['Tier 1 — Official public-health authority', 'May be cited as a reported figure with attribution', 'var(--color-alert-green)'],
              ['Tier 2 — Peer-reviewed / institutional report', 'May be cited as context', 'var(--color-bw-data)'],
              ['Tier 3 — Established news organisation', 'Prompts verification only', 'var(--color-alert-yellow)'],
              ['Tier 4 — Aggregators, professional networks', 'Prompts verification; never cited', 'var(--color-alert-orange)'],
              ['Tier 5 — Social media, anonymous posts', 'Not ingested in this design', 'var(--color-alert-red)'],
            ].map(([t, use, c]) => (
              <div key={t} className="border-b border-bw-line/50 py-1.5 last:border-0">
                <div className="flex items-center gap-2">
                  <Dot color={c} /><span className="text-[11.5px] text-bw-text">{t}</span>
                </div>
                <div className="mt-0.5 pl-4 text-[10.5px] text-bw-dim">{use}</div>
              </div>
            ))}
          </Panel>

          <Panel title="Known hazards" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {['Reverse causality — media volume rises after official announcements, so it can appear predictive while being purely downstream.',
                'Attention bias — coverage concentrates on wealthy, English-language settings.',
                'Duplication cascades — one report syndicated across outlets can look like independent corroboration.',
                'Alarm amplification — an unverified item rendered on a surveillance dashboard acquires unearned authority.',
                'Legal exposure — several feeds prohibit redistribution; storage and display must be licence-checked.'].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.TriangleAlert size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-yellow)]" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Module state" evidence="ESTABLISHED" dense>
            <KV items={[
              { k: 'Real feeds connected', v: 'None' },
              { k: 'NLP model', v: 'Not implemented' },
              { k: 'Corpus', v: 'Synthetic placeholders' },
              { k: 'Auto-promotion', v: 'Disabled by design' },
              { k: 'Last update', v: fmtTs() },
            ]} />
          </Panel>
        </div>
      </Grid>
    </>
  );
}
