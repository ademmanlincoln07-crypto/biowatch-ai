/* ============================================================
   BIOWATCH-AI — ENVIRONMENTAL SURVEILLANCE (SEGMENT 9)
   Wastewater and environmental sampling. Synthetic site data is
   labelled; unavailable data is declared, never invented.
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  NotImplemented, SimulatedBanner, KV, Meter, Stat, NoData, Disclosure,
} from '../components/ui';
import { SignalChart, Bars, Spark } from '../components/charts';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { synthSeries, rng, fmtTs } from '../lib/synth';
import { CONNECTORS } from '../lib/connectors';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';

/* Synthetic sampling sites — fictional identifiers, no real facility. */
const SITES = [
  { id: 'WW-SYN-01', label: 'Site 01 (synthetic)', pop: 820000, lon: -0.1, lat: 51.5, iso: 'GBR', status: 'active', freq: 'Twice weekly' },
  { id: 'WW-SYN-02', label: 'Site 02 (synthetic)', pop: 340000, lon: 13.4, lat: 52.5, iso: 'DEU', status: 'active', freq: 'Weekly' },
  { id: 'WW-SYN-03', label: 'Site 03 (synthetic)', pop: 1250000, lon: -46.6, lat: -23.5, iso: 'BRA', status: 'active', freq: 'Weekly' },
  { id: 'WW-SYN-04', label: 'Site 04 (synthetic)', pop: 210000, lon: 28.0, lat: -26.2, iso: 'ZAF', status: 'intermittent', freq: 'Fortnightly' },
  { id: 'WW-SYN-05', label: 'Site 05 (synthetic)', pop: 95000, lon: 3.4, lat: 6.5, iso: 'NGA', status: 'not-configured', freq: '—' },
  { id: 'WW-SYN-06', label: 'Site 06 (synthetic)', pop: 640000, lon: -87.6, lat: 41.9, iso: 'USA', status: 'active', freq: 'Twice weekly' },
];

export default function Environmental() {
  const { isDemo } = useMode();
  const [site, setSite] = useState('WW-SYN-01');
  const [target, setTarget] = useState('sars-cov-2');
  const [norm, setNorm] = useState('flow');

  const selected = SITES.find((s) => s.id === site);
  const series = useMemo(() => synthSeries(`env:${site}:${target}:${norm}`, {
    weeks: 78, level: norm === 'raw' ? 42000 : 380, season: 0.5, disp: 0.3,
    injectAt: site === 'WW-SYN-03' ? 7 : null, injectSize: 0.8,
  }), [site, target, norm]);

  const detection = useMemo(() => {
    const r = rng(site + target);
    return SITES.map((s) => ({
      ...s,
      detected: s.status === 'not-configured' ? null : r() > 0.25,
      lastSample: s.status === 'not-configured' ? null : `2026-08-${String(10 + Math.floor(r() * 8)).padStart(2, '0')}`,
      trend: s.status === 'not-configured' ? null : synthSeries(`env:${s.id}:spark`, { weeks: 20, level: 300, disp: 0.35 }),
    }));
  }, [site, target]);

  const mapVals = Object.fromEntries(SITES.map((s) => [s.iso, {
    state: s.status === 'not-configured' ? 'GREEN' : s.status === 'intermittent' ? 'YELLOW' : 'GREEN',
    availability: s.status === 'not-configured' ? 'none' : undefined,
    label: s.status === 'not-configured' ? 'No sampling site configured' : `${s.freq} sampling`,
    metrics: [{ k: 'Catchment (synthetic)', v: s.pop.toLocaleString() }],
  }]));

  const envConnectors = CONNECTORS.filter((c) => c.stream === 'env');

  return (
    <>
      <PageHeader kicker="Module 12" title="Environmental Surveillance" evidence="PLAN"
        description="Wastewater and environmental sampling as an independent, non-clinical indicator. Site identifiers are fictional; concentrations are synthetic. No real sampling programme is represented." />

      {isDemo && <div className="mb-3"><SimulatedBanner text="SIMULATED DATA — fictional sampling sites and synthetic concentrations. No real wastewater programme is represented." /></div>}

      <Callout tone="info" title="Why environmental streams are valuable — and fragile" icon={<Icons.Droplets size={12} />}>
        Wastewater detection does not depend on care-seeking or testing access, which is exactly why it can move
        independently of case reporting. It is also acutely sensitive to dilution, flow, assay change, site
        substitution and catchment definition — so an unnormalised concentration trend is close to uninterpretable.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Sampling sites (synthetic)" value={SITES.filter((s) => s.status !== 'not-configured').length} evidence="SIMULATED" sub={`${SITES.length} defined`} />
        <Stat label="Real programmes connected" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.connectorUnconfigured} />
        <Stat label="Detection status (synthetic)" value={`${detection.filter((d) => d.detected).length}/${detection.filter((d) => d.detected !== null).length}`} evidence="SIMULATED" sub="Sites above detection limit" />
        <Stat label="Normalisation applied" value={norm === 'flow' ? 'Flow' : norm === 'pmmov' ? 'Faecal marker' : 'None'} evidence="SIMULATED" sub="Comparability depends on this" />
      </Grid>

      <Grid cols="xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-3">
          <Panel title="Concentration trend" evidence="SIMULATED"
            subtitle={`${selected?.label} · synthetic catchment ${selected?.pop.toLocaleString()} · ${selected?.freq}`}
            actions={
              <div className="flex flex-wrap gap-2">
                <Segmented size="xs" value={target} onChange={setTarget} options={[
                  { value: 'sars-cov-2', label: 'SARS-CoV-2' }, { value: 'influenza-a', label: 'Influenza A' },
                  { value: 'cholera', label: 'V. cholerae' },
                ]} />
                <Segmented size="xs" value={norm} onChange={setNorm} options={[
                  { value: 'raw', label: 'Raw' }, { value: 'flow', label: 'Flow-norm' }, { value: 'pmmov', label: 'Marker-norm' },
                ]} />
              </div>}>
            {selected?.status === 'not-configured' ? (
              <NoData reason="This site has no configured sampling stream. Absence of data is not absence of detection." />
            ) : (
              <>
                <SignalChart data={series.slice(-52)} height={210} color="var(--color-bw-env)"
                  yLabel={norm === 'raw' ? 'gene copies / L' : 'normalised index'} />
                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                  {[['Latest value', series[series.length - 1].value.toLocaleString()],
                    ['Baseline', series[series.length - 1].baseline.toLocaleString()],
                    ['Deviation', `z = ${series[series.length - 1].z}`],
                    ['Detection limit', norm === 'raw' ? '1,000 cp/L (synthetic)' : 'n/a']].map(([k, v]) => (
                    <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                      <div className="bw-label">{k}</div><div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                    </div>
                  ))}
                </div>
                {norm === 'raw' && (
                  <div className="mt-2"><Callout tone="warn" title="Unnormalised view">
                    Raw concentrations conflate pathogen shedding with rainfall, industrial discharge and flow
                    variation. This view is shown to demonstrate why normalisation is mandatory before any
                    detector is applied.
                  </Callout></div>
                )}
              </>
            )}
          </Panel>

          <Panel title="Sampling sites" evidence="SIMULATED"
            subtitle="Fictional site register. Sampling frequency and detection status are synthetic.">
            <Table rowKey="id" columns={[
              { key: 'id', header: 'Site ID', render: (r) => (
                <button className="bw-num text-[11px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSite(r.id)}>{r.id}</button>) },
              { key: 'iso', header: 'Territory', render: (r) => <span className="text-[11px] text-bw-muted">{r.iso}</span> },
              { key: 'pop', header: 'Catchment', align: 'right', render: (r) => <span className="bw-num text-[11px]">{r.pop.toLocaleString()}</span> },
              { key: 'freq', header: 'Frequency', render: (r) => <span className="text-[11px] text-bw-muted">{r.freq}</span> },
              { key: 'status', header: 'Site status', render: (r) => (
                <span className="font-mono text-[9.5px] tracking-[0.08em]" style={{
                  color: r.status === 'active' ? 'var(--color-alert-green)' : r.status === 'intermittent' ? 'var(--color-alert-yellow)' : 'var(--color-bw-dim)' }}>
                  {r.status === 'not-configured' ? 'NOT CONFIGURED' : r.status.toUpperCase()}
                </span>) },
              { key: 'detected', header: 'Detection', render: (r) => (
                r.detected === null ? <span className="font-mono text-[9.5px] text-bw-dim">{SAFE_LANGUAGE.noData}</span>
                  : <span className="text-[11px]" style={{ color: r.detected ? 'var(--color-alert-orange)' : 'var(--color-bw-muted)' }}>
                      {r.detected ? 'Detected above limit' : 'Below detection limit'}</span>) },
              { key: 'lastSample', header: 'Last sample', align: 'right', render: (r) => (
                <span className="bw-num text-[10.5px] text-bw-dim">{r.lastSample || '—'}</span>) },
              { key: 'trend', header: '20-wk', align: 'right', width: 80, render: (r) => (
                r.trend ? <div className="ml-auto w-[70px]"><Spark data={r.trend} color="var(--color-bw-env)" height={20} /></div> : '—') },
            ]} rows={detection} />
          </Panel>

          <Panel title="Geographic sampling coverage" evidence="SIMULATED">
            <WorldMap values={mapVals} height={250}
              points={SITES.filter((s) => s.status !== 'not-configured').map((s) => ({
                lon: s.lon, lat: s.lat, label: s.label, color: 'var(--color-bw-env)', r: 4,
              }))} />
            <div className="mt-2"><MapLegend compact /></div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Method requirements" evidence="ESTABLISHED"
            subtitle="Conditions before an environmental signal may be raised.">
            {[['Flow or faecal-marker normalisation', true], ['Documented catchment population', true],
              ['Assay and platform recorded per sample', true], ['Limit of detection reported', true],
              ['Site-change log maintained', false], ['Independent confirmation stream', false]].map(([k, ok]) => (
              <div key={k} className="flex items-center gap-2 border-b border-bw-line/50 py-1.5 last:border-0">
                {ok ? <Icons.CheckCircle2 size={13} className="shrink-0 text-[var(--color-alert-green)]" />
                    : <Icons.CircleAlert size={13} className="shrink-0 text-[var(--color-alert-yellow)]" />}
                <span className="text-[11.5px] text-bw-muted">{k}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Connectors" evidence="ESTABLISHED">
            {envConnectors.map((c) => (
              <div key={c.id} className="mb-2 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5 last:mb-0">
                <div className="text-[11.5px] text-bw-text">{c.name}</div>
                <div className="mt-1 text-[10px] text-bw-dim">{c.frequency} · {c.format}</div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-bw-dim">
                  {c.status === 'available' ? SAFE_LANGUAGE.connectorAvailable : SAFE_LANGUAGE.connectorUnconfigured}
                </div>
                <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-muted">{c.caveats}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Interpretation guidance" evidence="ESTABLISHED">
            <div className="space-y-1.5">
              <Disclosure summary="Lead time is not guaranteed">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Wastewater signals have shown lead time over case reporting in several published settings, but
                  the magnitude depends on local testing behaviour. Where testing is already fast, lead time can
                  be zero or negative.
                </p>
              </Disclosure>
              <Disclosure summary="Concentration is not incidence">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Shedding varies by individual, time since infection and pathogen. Converting a concentration to
                  a case count requires assumptions that are rarely defensible at a single site.
                </p>
              </Disclosure>
              <Disclosure summary="Equity consideration">
                <p className="text-[11px] leading-relaxed text-bw-muted">
                  Sewered catchments over-represent urban, formally-housed populations. Environmental surveillance
                  can systematically miss exactly the communities with least access to clinical testing.
                </p>
              </Disclosure>
            </div>
          </Panel>

          <Panel title="Module state" evidence="ESTABLISHED" dense>
            <KV items={[
              { k: 'Implementation', v: 'Interface + synthetic demo' },
              { k: 'Real programmes bound', v: 'None' },
              { k: 'Sites (fictional)', v: String(SITES.length) },
              { k: 'Last update', v: fmtTs() },
            ]} />
          </Panel>
        </div>
      </Grid>
    </>
  );
}
