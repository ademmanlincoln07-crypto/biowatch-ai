/* ============================================================
   BIOWATCH-AI — DATA CONNECTOR MANAGEMENT (SEGMENT 11)
   Every connector exposes: source, endpoint, auth requirement,
   format, frequency, last update, status, error, licence.
   Unconfigured sources are declared, never simulated as live.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Field, Input, NoData, Disclosure, NotImplemented,
} from '../components/ui';
import { CONNECTORS, CONNECTOR_STATUS, connectorCounts } from '../lib/connectors';
import { STREAMS } from '../lib/registry';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { fmtTs } from '../lib/synth';
import { useMode } from '../lib/mode';

export default function Connectors() {
  const { mode } = useMode();
  const [sel, setSel] = useState(CONNECTORS[0].id);
  const [streamFilter, setStreamFilter] = useState('all');
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState({});

  const counts = useMemo(() => connectorCounts(), []);
  const list = CONNECTORS.filter((c) => streamFilter === 'all' || c.stream === streamFilter);
  const c = CONNECTORS.find((x) => x.id === sel);

  /* A "test" honestly reports that no request is made from the browser. */
  const runTest = (id) => {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setTestResult((r) => ({
        ...r,
        [id]: {
          at: fmtTs(),
          outcome: 'NOT ATTEMPTED',
          detail: 'No network request was issued. Connector calls must originate from the server-side ingestion service so that credentials, rate limits, caching and licence compliance are enforced centrally. A browser-side fetch would also be blocked by cross-origin policy for most of these sources.',
        },
      }));
    }, 700);
  };

  return (
    <>
      <PageHeader kicker="Module 19" title="Data Connectors" evidence="ESTABLISHED"
        description="Registry of public data sources the platform is architected to read, with the full connector contract for each. No source is connected in this build." />

      <Callout tone="warn" title="Nothing here is live" icon={<Icons.PlugZap size={12} />}>
        Every connector below is <span className="font-mono text-[11px]">{SAFE_LANGUAGE.connectorAvailable}</span> or
        not configured. The interface will not display a LIVE badge, a timestamp or a value for any source that has
        not actually returned data. Organisation names identify publicly documented sources and imply no
        affiliation, endorsement or granted access.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-5" className="my-3">
        <Stat label="Connectors defined" value={counts.total} evidence="ESTABLISHED" />
        <Stat label="Configured" value={counts.by.configured || 0} evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="None in this build" />
        <Stat label="Available — config required" value={counts.by.available || 0} evidence="ESTABLISHED" color="var(--color-bw-data)" />
        <Stat label="Access restricted" value={counts.by.blocked || 0} evidence="ESTABLISHED" color="var(--color-alert-yellow)" sub="Agreement required" />
        <Stat label="Planned" value={(counts.by.planned || 0) + (counts.by.unconfigured || 0)} evidence="ESTABLISHED" color="var(--color-bw-dim)" />
      </Grid>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="bw-label">Stream</span>
        <Segmented size="xs" value={streamFilter} onChange={setStreamFilter}
          options={[{ value: 'all', label: 'All' }, ...Object.values(STREAMS).map((s) => ({ value: s.key, label: s.label, color: s.color }))]} />
        <span className="ml-auto text-[10px] text-bw-dim">Active mode: {mode} · connector behaviour is identical in every mode</span>
      </div>

      <Grid cols="xl:grid-cols-[1fr_430px]">
        <Panel title="Connector registry" evidence="ESTABLISHED">
          <Table rowKey="id" columns={[
            { key: 'name', header: 'Source', render: (r) => (
              <button className="text-left text-[11.5px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSel(r.id)}>
                {r.name}
                <span className="mt-0.5 block text-[10px] text-bw-dim">{r.org}</span>
              </button>) },
            { key: 'stream', header: 'Stream', render: (r) => (
              <span className="text-[11px]" style={{ color: STREAMS[r.stream].color }}>{STREAMS[r.stream].label}</span>) },
            { key: 'frequency', header: 'Update freq.', render: (r) => <span className="text-[10.5px] text-bw-muted">{r.frequency}</span> },
            { key: 'lastUpdate', header: 'Last update', render: (r) => (
              <span className="bw-num text-[10.5px] text-bw-dim">{r.lastUpdate || '—'}</span>) },
            { key: 'status', header: 'Status', align: 'right', render: (r) => (
              <span className="font-mono text-[8.5px] tracking-[0.08em]" style={{ color: CONNECTOR_STATUS[r.status].color }}>
                {CONNECTOR_STATUS[r.status].label}
              </span>) },
          ]} rows={list} />
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          {c && (
            <>
              <Panel title={c.name} evidence="ESTABLISHED" accent={CONNECTOR_STATUS[c.status].color}
                subtitle={`${c.org} · ${c.type}`}
                actions={<Btn size="xs" onClick={() => runTest(c.id)} disabled={testing === c.id}>
                  {testing === c.id ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Activity size={11} />} Test connection
                </Btn>}>
                <div className="mb-2">
                  <Pill color={CONNECTOR_STATUS[c.status].color}>
                    <Dot color={CONNECTOR_STATUS[c.status].color} />{CONNECTOR_STATUS[c.status].label}
                  </Pill>
                </div>
                <KV cols={1} mono={false} items={[
                  { k: 'Source', v: c.name, mono: false },
                  { k: 'API / URL', v: c.url },
                  { k: 'Documentation', v: c.docs },
                  { k: 'Authentication requirement', v: c.auth, mono: false },
                  { k: 'Data format', v: c.format, mono: false },
                  { k: 'Update frequency', v: c.frequency, mono: false },
                  { k: 'Granularity', v: c.granularity, mono: false },
                  { k: 'Last successful update', v: c.lastUpdate || '— (never attempted)' },
                  { k: 'Status', v: CONNECTOR_STATUS[c.status].label, mono: false },
                  { k: 'Error message', v: c.error || '— (no request has been made)', mono: false },
                  { k: 'Licence / access', v: c.license, mono: false },
                ]} />

                {c.caveats && (
                  <div className="mt-2.5 rounded-sm border p-2.5"
                    style={{ borderColor: 'var(--color-alert-yellow)44', background: 'var(--color-alert-yellow)0a' }}>
                    <div className="bw-label mb-1" style={{ color: 'var(--color-alert-yellow)' }}>Scientific caveat</div>
                    <p className="text-[11px] leading-relaxed text-bw-muted">{c.caveats}</p>
                  </div>
                )}

                {testResult[c.id] && (
                  <div className="mt-2.5 rounded-sm border border-bw-line bg-[#0a1218] p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="bw-label">Connection test</span>
                      <span className="bw-num text-[10px] text-bw-dim">{testResult[c.id].at}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-[var(--color-alert-yellow)]">
                      {testResult[c.id].outcome}
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-bw-muted">{testResult[c.id].detail}</p>
                  </div>
                )}
              </Panel>

              <Panel title="Configuration" evidence="PLAN" subtitle="Server-side only. Credentials never reach the browser.">
                <div className="space-y-2 opacity-60">
                  <Field label="Base URL"><Input value={c.url} onChange={() => {}} /></Field>
                  <Field label="API key / token" hint="Stored in the backend secret store; write-only from the UI.">
                    <Input value="" onChange={() => {}} placeholder="•••••••••••• (not configurable in prototype)" />
                  </Field>
                  <Field label="Schedule"><Input value={c.frequency} onChange={() => {}} /></Field>
                  <Btn disabled className="w-full"><Icons.Save size={12} /> Save configuration</Btn>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-bw-dim">
                  Disabled: this prototype has no backend, no secret store and no scheduler. Enabling a connector
                  also requires a licence review recorded in the decision log.
                </p>
              </Panel>
            </>
          )}
        </div>
      </Grid>

      <Grid cols="lg:grid-cols-2" className="mt-3">
        <Panel title="Ingestion architecture" evidence="PLAN"
          subtitle="How a configured connector would move data into the platform.">
          <ol className="space-y-2">
            {[
              ['Scheduler', 'A backend scheduler triggers the connector at its declared frequency, with jitter and rate-limit compliance.'],
              ['Fetch & archive', 'Raw payload is stored immutably with retrieval timestamp, HTTP status and checksum before anything is parsed.'],
              ['Parse & map', 'Source schema is mapped to the internal panel schema; unmapped fields are retained, not discarded.'],
              ['Validate', 'Schema, vocabulary, range and duplicate checks. Failures quarantine rows and raise a data-quality event.'],
              ['Version', 'Each successful fetch creates a new dataset version. Revisions to historical values are recorded as revisions, not overwrites.'],
              ['Publish', 'Only validated versions become visible to analytical modules, tagged with source and licence.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-2.5">
                <span className="bw-num shrink-0 text-[10px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                <div><div className="text-[12px] text-bw-text">{t}</div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p></div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Licence & compliance policy" evidence="ESTABLISHED">
          <div className="space-y-1.5">
            <Disclosure summary="Attribution is mandatory and machine-enforced" defaultOpen>
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Every chart derived from a source carries that source's attribution string. Exports embed it.
                A dataset registered without licence information cannot be exported.
              </p>
            </Disclosure>
            <Disclosure summary="Restricted sources are excluded, not worked around">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Where terms prohibit redistribution (for example, agreement-governed genomic databases), the
                connector remains disabled and the module displays the restriction. No aggregate-derivative
                workaround is implemented without an explicit legal review recorded in the decision log.
              </p>
            </Disclosure>
            <Disclosure summary="Rate limits and politeness">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Requests are scheduled, cached and backed off. A research prototype has no entitlement to burden
                a public agency's infrastructure.
              </p>
            </Disclosure>
            <Disclosure summary="No scraping of prohibited endpoints">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Sources without a machine-readable interface (e.g. PDF situation reports) are ingested only where
                the publisher's terms permit it, and the extraction is validated per report layout.
              </p>
            </Disclosure>
          </div>
        </Panel>
      </Grid>
    </>
  );
}
