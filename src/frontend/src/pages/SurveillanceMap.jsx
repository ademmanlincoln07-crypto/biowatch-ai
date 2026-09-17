/* ============================================================
   BIOWATCH-AI — INTERACTIVE SURVEILLANCE MAP (SEGMENT 4)
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Segmented, Grid, Stat, Meter, NoData, Btn,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Spark } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { ALERT_STATES, ALERT_DISCLAIMER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS, PATHOGENS } from '../lib/registry';
import { useMode } from '../lib/mode';

const LAYERS = [
  { value: 'all', label: 'All streams', color: 'var(--color-bw-primary)' },
  { value: 'epi', label: 'Epi', color: STREAMS.epi.color },
  { value: 'genomic', label: 'Genomic', color: STREAMS.genomic.color },
  { value: 'env', label: 'Env', color: STREAMS.env.color },
  { value: 'lab', label: 'Lab', color: STREAMS.lab.color },
  { value: 'synd', label: 'Syndromic', color: STREAMS.synd.color },
];

export default function SurveillanceMap() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [layer, setLayer] = useState('all');
  const [pathogen, setPathogen] = useState('all');
  const [projection, setProjection] = useState('natural');
  const [selected, setSelected] = useState('NGA');
  const [showPoints, setShowPoints] = useState(true);

  const filtered = useMemo(() => S.countries.filter((c) =>
    (layer === 'all' || c.streams.includes(layer)) &&
    (pathogen === 'all' || c.pathogenId === pathogen)), [S, layer, pathogen]);

  const values = useMemo(() => Object.fromEntries(
    filtered.map((c) => [c.iso, S.mapValues[c.iso]])), [filtered, S]);

  const points = useMemo(() => (showPoints ? filtered
    .filter((c) => c.availability !== 'none')
    .map((c) => ({
      lon: c.lon, lat: c.lat, iso: c.iso, label: `${c.name} · ${c.pathogen?.name}`,
      color: ALERT_STATES[c.state].color,
      r: 2.5 + Math.min(5, Math.abs(c.z) * 1.5),
    })) : []), [filtered, showPoints]);

  const sel = S.countries.find((c) => c.iso === selected);
  const selAlert = S.alerts.find((a) => a.iso === selected);

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 03" title="Surveillance Map" evidence="PLAN"
          description="Geographic exploration of signal state by territory, stream and pathogen." />
        <Callout tone="info" title="No geographic data available in this mode" icon={<Icons.Info size={12} />}>
          Map geometry is available, but no configured stream supplies territory-level values in the active mode.
          Switch to DEMONSTRATION mode to explore the interface, or configure a connector.
        </Callout>
        <div className="mt-3"><WorldMap values={{}} height={420} /></div>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 03" title="Surveillance Map" evidence="SIMULATED"
        description="Territory-level detector state for the synthetic monitoring set. Colour encodes what the detector reported, never a confirmed epidemiological situation." />

      <div className="mb-3"><SimulatedBanner text="SIMULATED DATA — NOT REAL-WORLD SURVEILLANCE. No country shown is experiencing the depicted activity." /></div>

      <Grid cols="xl:grid-cols-[1fr_360px]" className="mb-3">
        <div className="min-w-0">
          <Panel
            title="Global view" evidence="SIMULATED"
            subtitle="Click a territory to inspect its stream detail."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Segmented size="xs" options={[
                  { value: 'natural', label: 'Natural Earth' },
                  { value: 'mercator', label: 'Mercator' },
                  { value: 'orthographic', label: 'Globe' },
                ]} value={projection} onChange={setProjection} />
                <Btn size="xs" onClick={() => setShowPoints(!showPoints)}>
                  <Icons.Circle size={10} /> {showPoints ? 'Hide' : 'Show'} markers
                </Btn>
              </div>
            }
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="bw-label">Stream layer</span>
                <Segmented size="xs" options={LAYERS} value={layer} onChange={setLayer} />
              </div>
              <div className="flex items-center gap-2">
                <span className="bw-label">Pathogen</span>
                <select value={pathogen} onChange={(e) => setPathogen(e.target.value)}
                  className="rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1 text-[11px] text-bw-text outline-none focus:border-bw-primary">
                  <option value="all">All streams</option>
                  {PATHOGENS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <WorldMap values={values} points={points} height={430} projection={projection}
              selected={selected} onSelect={setSelected} />

            <div className="mt-2.5 flex flex-wrap items-start justify-between gap-3">
              <MapLegend />
              <span className="text-[10px] text-bw-dim">
                Marker radius ∝ |z| deviation · {filtered.length} territories in view
              </span>
            </div>

            <div className="mt-2.5">
              <Callout tone="warn" title="Cartographic caution" icon={<Icons.TriangleAlert size={12} />}>
                Country-level fill implies a uniformity that surveillance data never has. A national colour is an
                aggregate of heterogeneous sub-national reporting, and the strongest visual contrast on this map
                is usually a contrast in <span className="text-bw-text">surveillance capacity</span>, not in
                disease. {ALERT_DISCLAIMER}
              </Callout>
            </div>
          </Panel>
        </div>

        {/* ---------- Inspector ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          {sel ? (
            <>
              <Panel title={sel.name} evidence="SIMULATED" accent={ALERT_STATES[sel.state].color}
                subtitle={`${sel.region} · ${sel.pathogen?.name}`}>
                {sel.availability === 'none' ? (
                  <NoData reason="No stream is configured for this territory in the synthetic set. Absence of data is not absence of disease." />
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Pill color={ALERT_STATES[sel.state].color}>
                        <Dot color={ALERT_STATES[sel.state].color} />{sel.state}
                      </Pill>
                      <span className="text-[11px] text-bw-muted">{S.mapValues[sel.iso].label}</span>
                    </div>
                    <SignalChart data={sel.series.slice(-52)} height={140} />
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {[
                        ['Latest observed', sel.last.value.toLocaleString()],
                        ['Baseline', sel.last.baseline.toLocaleString()],
                        ['Deviation z', sel.z.toFixed(2)],
                        ['Consecutive wks', sel.consecutive],
                        ['Completeness', `${Math.round(sel.completeness * 100)}%`],
                        ['Reporting delay', `${sel.delayWeeks} wk`],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                          <div className="bw-label">{k}</div>
                          <div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Panel>

              <Panel title="Configured streams" evidence="SIMULATED" dense>
                <div className="space-y-1">
                  {Object.values(STREAMS).map((st) => {
                    const on = sel.streams.includes(st.key);
                    const C = Icons[st.icon] || Icons.Circle;
                    return (
                      <div key={st.key} className="flex items-center gap-2 rounded-sm px-1.5 py-1">
                        <C size={13} style={{ color: on ? st.color : 'var(--color-bw-dim)' }} />
                        <span className={`flex-1 text-[11.5px] ${on ? 'text-bw-text' : 'text-bw-dim'}`}>{st.label}</span>
                        <span className="font-mono text-[9px] tracking-[0.08em]"
                          style={{ color: on ? 'var(--color-alert-green)' : 'var(--color-bw-dim)' }}>
                          {on ? 'MAPPED' : 'NOT MAPPED'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              {selAlert && (
                <Panel title="Open signal" evidence="SIMULATED" accent={ALERT_STATES[selAlert.state].color}
                  actions={<Link to="/app/alerts" className="text-[11px] text-bw-primary-bright hover:underline">Details →</Link>}>
                  <div className="bw-num mb-1 text-[10px] text-bw-dim">{selAlert.id}</div>
                  <p className="text-[11.5px] leading-relaxed text-bw-muted">{selAlert.what}</p>
                  <div className="mt-2 rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                    <div className="bw-label">Recommended human review</div>
                    <p className="mt-0.5 text-[11px] text-bw-text">{selAlert.recommended}</p>
                  </div>
                </Panel>
              )}
            </>
          ) : (
            <Panel title="Inspector"><NoData reason="Select a territory on the map." /></Panel>
          )}

          <Panel title="Data availability in view" evidence="SIMULATED" dense>
            <div className="space-y-2 p-1">
              <Meter label="Full reporting" right={`${filtered.filter((c) => c.availability === 'full').length}`}
                value={filtered.filter((c) => c.availability === 'full').length} max={filtered.length} color="var(--color-alert-green)" />
              <Meter label="Sparse reporting" right={`${filtered.filter((c) => c.availability === 'sparse').length}`}
                value={filtered.filter((c) => c.availability === 'sparse').length} max={filtered.length} color="var(--color-alert-yellow)" />
              <Meter label="Insufficient data" right={`${filtered.filter((c) => c.availability === 'none').length}`}
                value={filtered.filter((c) => c.availability === 'none').length} max={filtered.length} color="var(--color-bw-dim)" />
            </div>
          </Panel>
        </div>
      </Grid>

      {/* ---------- Territory table ---------- */}
      <Panel title="Territories in view" evidence="SIMULATED"
        subtitle="Sortable detector output. Language is constrained to permitted signal phrasing.">
        <Table
          rowKey="iso"
          columns={[
            { key: 'name', header: 'Territory', render: (r) => (
              <button className="text-left text-[12px] text-bw-text hover:text-bw-primary-bright" onClick={() => setSelected(r.iso)}>
                {r.name}
              </button>) },
            { key: 'region', header: 'Region', render: (r) => <span className="text-[11px] text-bw-dim">{r.region}</span> },
            { key: 'pathogen', header: 'Stream', render: (r) => <span className="text-[11.5px] text-bw-muted">{r.pathogen?.name}</span> },
            { key: 'state', header: 'Detector state', render: (r) => (
              <span className="flex items-center gap-1.5">
                <Dot color={ALERT_STATES[r.state].color} />
                <span className="text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                  {r.availability === 'none' ? 'Insufficient data' : S.mapValues[r.iso].label}
                </span>
              </span>) },
            { key: 'z', header: 'z', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px]">{r.availability === 'none' ? '—' : r.z.toFixed(2)}</span>) },
            { key: 'consecutive', header: 'Wks ≥2σ', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px] text-bw-muted">{r.availability === 'none' ? '—' : r.consecutive}</span>) },
            { key: 'completeness', header: 'Complete', align: 'right', render: (r) => (
              <span className="bw-num text-[11.5px] text-bw-muted">{r.availability === 'none' ? SAFE_LANGUAGE.noData : `${Math.round(r.completeness * 100)}%`}</span>) },
            { key: 'trend', header: '26-wk', align: 'right', width: 90, render: (r) => (
              <div className="ml-auto w-[80px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={22} /></div>) },
            { key: 'update', header: 'Last update', align: 'right', render: (r) => (
              <span className="bw-num text-[10px] text-bw-dim">{r.lastUpdate}</span>) },
          ]}
          rows={[...filtered].sort((a, b) => b.z - a.z)}
        />
      </Panel>
    </>
  );
}
