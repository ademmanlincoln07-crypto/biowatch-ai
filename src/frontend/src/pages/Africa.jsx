/* ============================================================
   BIOWATCH-AI — NIGERIA / AFRICA REGIONAL VIEW (SEGMENT 13)
   ------------------------------------------------------------
   HARD RULE: no African disease statistic is invented. Where a
   real figure would be required, the panel reads
   "DATA NOT AVAILABLE". Capacity indicators are structural
   descriptions, not measurements. Synthetic series used for
   interface demonstration are labelled at every point of use.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, Dot, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  KV, Stat, Meter, NoData, SimulatedBanner, Disclosure, NotImplemented,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Bars, Spark } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { NIGERIA_STATES, PATHOGENS } from '../lib/registry';
import { synthSeries, rng, fmtTs } from '../lib/synth';
import { ALERT_STATES, SAFE_LANGUAGE } from '../lib/evidence';
import { CONNECTORS } from '../lib/connectors';
import { useMode } from '../lib/mode';

/* Structural capacity descriptors. These are qualitative statements about
   what a surveillance system would need — NOT measurements of any country. */
const CAPACITY_DIMENSIONS = [
  { id: 'idsr', name: 'IDSR-style routine reporting', desc: 'Weekly integrated disease surveillance and response reporting from health facilities to district and national level.' },
  { id: 'lab', name: 'Reference laboratory network', desc: 'National and regional reference laboratories with confirmatory assay capacity and specimen-referral logistics.' },
  { id: 'genomic', name: 'Genomic sequencing capacity', desc: 'Sequencing platforms, bioinformatics staffing and submission pathways to public repositories.' },
  { id: 'env', name: 'Environmental surveillance', desc: 'Wastewater or water-source sampling programmes with defined catchments and normalisation.' },
  { id: 'digital', name: 'Digital reporting infrastructure', desc: 'Electronic case-based reporting replacing paper aggregation; determines achievable timeliness.' },
  { id: 'workforce', name: 'Field epidemiology workforce', desc: 'Trained epidemiologists available to investigate a signal once raised — the binding constraint on any alerting system.' },
];

const AFRICA_ISO = ['NGA', 'GHA', 'ZAF', 'KEN', 'ETH', 'COD', 'EGY', 'SEN', 'MAR', 'DZA', 'TZA', 'UGA',
  'ZMB', 'MOZ', 'CMR', 'CIV', 'SDN', 'SOM', 'MDG', 'AGO', 'NER', 'MLI', 'BFA', 'TCD', 'ZWE', 'RWA',
  'BDI', 'LBR', 'SLE', 'GIN', 'TUN', 'LBY', 'BWA', 'NAM', 'MWI'];

export default function Africa() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [scope, setScope] = useState('africa');
  const [pathogen, setPathogen] = useState('lassa');
  const [stateSel, setStateSel] = useState('ED');

  /* Africa map: only territories present in the synthetic set carry a state.
     Everything else is explicitly "no stream configured" — not green. */
  const mapValues = useMemo(() => {
    const vals = {};
    AFRICA_ISO.forEach((iso) => {
      const c = S.countries.find((x) => x.iso === iso);
      if (c && c.availability !== 'none') {
        vals[iso] = S.mapValues[iso];
      } else {
        vals[iso] = {
          state: 'GREEN', availability: 'none',
          label: 'No stream configured — data not available',
          metrics: [{ k: 'Status', v: SAFE_LANGUAGE.noData }],
        };
      }
    });
    return vals;
  }, [S]);

  const configured = AFRICA_ISO.filter((iso) => S.countries.some((c) => c.iso === iso && c.availability !== 'none'));

  /* Nigeria state-level synthetic demonstration series. */
  const stateData = useMemo(() => NIGERIA_STATES.map((st) => {
    const r = rng('ng:' + st.id + pathogen);
    const configuredState = r() > 0.25;
    const series = configuredState
      ? synthSeries(`ng:${st.id}:${pathogen}`, {
          weeks: 78, level: 8 + Math.floor(r() * 40), season: pathogen === 'lassa' ? 0.8 : 0.4,
          disp: 0.35, injectAt: st.id === 'ED' && pathogen === 'lassa' ? 6 : null, injectSize: 0.9,
        })
      : null;
    const last = series?.[series.length - 1];
    return {
      ...st, configured: configuredState, series,
      z: last?.z ?? null,
      state: !series ? null : last.z >= 3 ? 'RED' : last.z >= 2 ? 'ORANGE' : last.z >= 1.2 ? 'YELLOW' : 'GREEN',
      completeness: configuredState ? +(0.45 + r() * 0.45).toFixed(2) : null,
      delay: configuredState ? +(1.5 + r() * 3).toFixed(1) : null,
    };
  }), [pathogen]);

  const sel = stateData.find((s) => s.id === stateSel);
  const ngConnectors = CONNECTORS.filter((c) => ['ncdc-ng', 'africa-cdc', 'who-gho', 'who-flunet'].includes(c.id));

  return (
    <>
      <PageHeader kicker="Module 24" title="Nigeria / Africa Intelligence View" evidence="SIMULATED"
        description="Regional view with explicit data-availability accounting. No African disease statistic is invented anywhere in this module; where a real figure would be required, the panel declares that the data is not available." />

      <Callout tone="danger" title="Data-availability honesty rule" icon={<Icons.ShieldAlert size={12} />}>
        Most territories on this map have <span className="text-bw-text">no configured stream</span> and are therefore
        rendered as hatched "data not available" — never as green. Rendering unreported territories as calm is the
        specific failure that makes surveillance dashboards dangerous in exactly the settings where surveillance is
        weakest.
      </Callout>

      {isDemo && <div className="my-3"><SimulatedBanner text="SIMULATED DATA — NOT REAL-WORLD SURVEILLANCE. No figure here describes any real Nigerian state, African country, or disease event." /></div>}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Segmented value={scope} onChange={setScope} options={[
          { value: 'africa', label: 'Africa region' }, { value: 'nigeria', label: 'Nigeria' },
          { value: 'capacity', label: 'Capacity & gaps' },
        ]} />
        {scope !== 'capacity' && (
          <>
            <span className="bw-label ml-2">Pathogen</span>
            <Segmented size="xs" value={pathogen} onChange={setPathogen}
              options={PATHOGENS.filter((p) => ['lassa', 'cholera', 'measles', 'mpox'].includes(p.id)).map((p) => ({ value: p.id, label: p.name.split(' ')[0] }))} />
          </>
        )}
      </div>

      {/* ================= AFRICA SCOPE ================= */}
      {scope === 'africa' && (
        <Grid cols="xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-3">
            <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Territories in view" value={AFRICA_ISO.length} evidence="ESTABLISHED" sub="Africa region" />
              <Stat label="With a configured stream" value={configured.length} evidence="SIMULATED"
                color="var(--color-alert-yellow)" sub={`${AFRICA_ISO.length - configured.length} without any stream`} />
              <Stat label="Real data bound" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.connectorUnconfigured} />
              <Stat label="Invented statistics" value="0" evidence="ESTABLISHED" color="var(--color-alert-green)" sub="By policy" />
            </Grid>

            <Panel title="Regional surveillance state" evidence="SIMULATED"
              subtitle="Hatched territories have no configured stream. That is a statement about this prototype, not about those countries.">
              <WorldMap values={mapValues} height={430} focus={[20, 2, 2.4]}
                points={configured.map((iso) => {
                  const c = S.countries.find((x) => x.iso === iso);
                  return { lon: c.lon, lat: c.lat, iso, label: `${c.name} · ${c.pathogen?.name}`, color: ALERT_STATES[c.state].color, r: 3 + Math.abs(c.z) };
                })} />
              <div className="mt-2"><MapLegend /></div>
            </Panel>

            <Panel title="Configured territories" evidence="SIMULATED">
              <Table rowKey="iso" columns={[
                { key: 'name', header: 'Territory' },
                { key: 'pathogen', header: 'Stream', render: (r) => <span className="text-[11px] text-bw-muted">{r.pathogen?.name}</span> },
                { key: 'state', header: 'Detector state', render: (r) => (
                  <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                    <Dot color={ALERT_STATES[r.state].color} />{S.mapValues[r.iso]?.label}</span>) },
                { key: 'z', header: 'z', align: 'right', render: (r) => <span className="bw-num text-[11px]">{r.z.toFixed(2)}</span> },
                { key: 'completeness', header: 'Completeness', align: 'right', render: (r) => (
                  <span className="bw-num text-[11px] text-bw-muted">{Math.round(r.completeness * 100)}%</span>) },
                { key: 'delayWeeks', header: 'Delay', align: 'right', render: (r) => <span className="bw-num text-[11px] text-bw-muted">{r.delayWeeks} wk</span> },
                { key: 'sp', header: '26-wk', align: 'right', width: 84, render: (r) => (
                  <div className="ml-auto w-[74px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={20} /></div>) },
              ]} rows={S.countries.filter((c) => AFRICA_ISO.includes(c.iso) && c.availability !== 'none')} />
            </Panel>

            <Panel title="Territories without a configured stream" evidence="ESTABLISHED">
              <div className="flex flex-wrap gap-1.5">
                {AFRICA_ISO.filter((iso) => !configured.includes(iso)).map((iso) => (
                  <span key={iso} className="rounded-sm border border-dashed border-bw-line2 px-2 py-1 font-mono text-[10px] text-bw-dim">
                    {iso} · {SAFE_LANGUAGE.noData}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-bw-dim">
                These territories are shown because omitting them would misrepresent coverage. Their absence from
                the signal set reflects the prototype's connector configuration only.
              </p>
            </Panel>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <Panel title="Regional data sources" evidence="ESTABLISHED">
              {ngConnectors.map((c) => (
                <div key={c.id} className="mb-2 rounded-sm border border-bw-line bg-bw-panel2/40 p-2.5 last:mb-0">
                  <div className="text-[11.5px] text-bw-text">{c.name}</div>
                  <div className="mt-0.5 text-[10px] text-bw-dim">{c.format} · {c.frequency}</div>
                  <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-bw-dim">
                    {c.status === 'available' ? SAFE_LANGUAGE.connectorAvailable : SAFE_LANGUAGE.connectorUnconfigured}
                  </div>
                  <p className="mt-1 border-t border-bw-line/60 pt-1 text-[10px] leading-snug text-bw-muted">{c.caveats}</p>
                </div>
              ))}
            </Panel>

            <Panel title="Why this view exists" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Global surveillance platforms are typically built where data is densest, and their models inherit
                that geography. A regional view built from the start around <span className="text-bw-text">declared
                data availability</span> — rather than around whichever countries happen to report well — makes the
                gap visible instead of averaging it away.
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                The research question this supports is concrete: can a detection method be made useful under
                sparse, delayed and partially-missing reporting, and how much performance is lost relative to a
                dense-reporting setting?
              </p>
            </Panel>

            <Panel title="Regional research priorities" evidence="HYPOTHESIS">
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
                {['Detection under sparse reporting: quantify the completeness floor below which no detector is usable.',
                  'Delay-aware baselines: whether now-casting recovers usable timeliness from delayed streams.',
                  'Seasonal pathogens with strong ecology (Lassa, cholera) as a test bed for baseline specification.',
                  'Transferability: whether a detector tuned on dense data degrades gracefully or catastrophically.'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Dot size={13} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
                ))}
              </ul>
            </Panel>
          </div>
        </Grid>
      )}

      {/* ================= NIGERIA SCOPE ================= */}
      {scope === 'nigeria' && (
        <Grid cols="xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-3">
            <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="States in demonstration set" value={NIGERIA_STATES.length} evidence="SIMULATED" sub="of 36 + FCT" />
              <Stat label="With synthetic stream" value={stateData.filter((s) => s.configured).length} evidence="SIMULATED" />
              <Stat label="Real NCDC data bound" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="Connector not configured" />
              <Stat label="Mean completeness (synthetic)" value={`${Math.round((stateData.filter((s) => s.configured).reduce((a, s) => a + s.completeness, 0) / Math.max(1, stateData.filter((s) => s.configured).length)) * 100)}%`}
                evidence="SIMULATED" color="var(--color-alert-yellow)" />
            </Grid>

            <Panel title="State-level demonstration grid" evidence="SIMULATED"
              subtitle="A cartogram-style grid avoids implying precise geographic boundaries for synthetic values.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {stateData.map((st) => (
                  <button key={st.id} type="button" onClick={() => setStateSel(st.id)}
                    className={`rounded-sm border p-2.5 text-left transition-colors ${
                      stateSel === st.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}
                    style={st.configured ? { borderLeftWidth: 2, borderLeftColor: ALERT_STATES[st.state].color } : undefined}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-bw-text">{st.name}</span>
                      {st.configured ? <Dot color={ALERT_STATES[st.state].color} /> : <Icons.Slash size={11} className="text-bw-dim" />}
                    </div>
                    <div className="mt-0.5 text-[9.5px] text-bw-dim">{st.zone}</div>
                    {st.configured ? (
                      <>
                        <div className="mt-1.5 -mx-0.5"><Spark data={st.series.slice(-20)} color={ALERT_STATES[st.state].color} height={22} /></div>
                        <div className="bw-num mt-0.5 text-[10px] text-bw-muted">z = {st.z.toFixed(2)}</div>
                      </>
                    ) : (
                      <div className="mt-2 font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">{SAFE_LANGUAGE.noData}</div>
                    )}
                  </button>
                ))}
              </div>
            </Panel>

            {sel && (
              <Panel title={`${sel.name} — ${PATHOGENS.find((p) => p.id === pathogen)?.name}`} evidence="SIMULATED"
                accent={sel.configured ? ALERT_STATES[sel.state].color : undefined}
                subtitle={sel.configured ? `${sel.zone} · synthetic weekly series` : sel.zone}>
                {sel.configured ? (
                  <>
                    <SignalChart data={sel.series.slice(-52)} height={190} />
                    <Grid cols="sm:grid-cols-4" className="mt-2">
                      {[['Latest (synthetic)', sel.series[sel.series.length - 1].value],
                        ['Baseline', sel.series[sel.series.length - 1].baseline],
                        ['Completeness', `${Math.round(sel.completeness * 100)}%`],
                        ['Reporting delay', `${sel.delay} wk`]].map(([k, v]) => (
                        <div key={k} className="rounded-sm border border-bw-line bg-bw-panel2/50 px-2 py-1.5">
                          <div className="bw-label">{k}</div><div className="bw-num mt-0.5 text-[12px] text-bw-text">{v}</div>
                        </div>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <NoData reason="No stream is configured for this state in the demonstration set. This is a property of the prototype, not a statement about the state's surveillance." />
                )}
              </Panel>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <Panel title="Pathogen context (Nigeria)" evidence="ESTABLISHED"
              subtitle="Descriptive public-health knowledge. Contains no counts and no current-activity claim.">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                {PATHOGENS.find((p) => p.id === pathogen)?.seasonality}
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                {PATHOGENS.find((p) => p.id === pathogen)?.note}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-bw-dim">
                Surveillance practice: {PATHOGENS.find((p) => p.id === pathogen)?.surveillance}
              </p>
            </Panel>

            <Panel title="Reporting gaps (synthetic)" evidence="SIMULATED">
              <div className="space-y-2">
                {stateData.filter((s) => s.configured).sort((a, b) => a.completeness - b.completeness).slice(0, 6).map((s) => (
                  <Meter key={s.id} label={s.name} right={`${Math.round(s.completeness * 100)}%`}
                    value={s.completeness * 100}
                    color={s.completeness > 0.75 ? 'var(--color-alert-green)' : s.completeness > 0.55 ? 'var(--color-alert-yellow)' : 'var(--color-alert-red)'} />
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-snug text-bw-dim">
                Below roughly 60% completeness, a weekly baseline becomes too wide to detect anything short of a
                very large deviation — a structural limit, not a tuning problem.
              </p>
            </Panel>

            <Panel title="Data source status" evidence="ESTABLISHED" dense>
              <KV items={[
                { k: 'NCDC situation reports', v: 'CONNECTOR NOT CONFIGURED' },
                { k: 'State-level line lists', v: 'Not public — not sought' },
                { k: 'Laboratory network data', v: 'DATA NOT AVAILABLE' },
                { k: 'Genomic submissions', v: 'DATA NOT AVAILABLE' },
                { k: 'Environmental sampling', v: 'DATA NOT AVAILABLE' },
                { k: 'Last checked', v: fmtTs() },
              ]} />
            </Panel>
          </div>
        </Grid>
      )}

      {/* ================= CAPACITY SCOPE ================= */}
      {scope === 'capacity' && (
        <Grid cols="lg:grid-cols-2">
          <Panel title="Surveillance capacity dimensions" evidence="ESTABLISHED"
            subtitle="Structural descriptors of what a functioning surveillance system requires. No country is scored — scoring would require measurement this prototype has not done.">
            <Table dense columns={[
              { key: 'name', header: 'Dimension', render: (r) => <span className="text-[11.5px] text-bw-text">{r.name}</span> },
              { key: 'desc', header: 'What it means', render: (r) => <span className="text-[11px] text-bw-muted">{r.desc}</span> },
              { key: 'score', header: 'Country score', align: 'right', render: () => (
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{SAFE_LANGUAGE.noData}</span>) },
            ]} rows={CAPACITY_DIMENSIONS} />
            <Callout tone="warn" title="Why no capacity scores are shown">
              Capacity indices exist in the literature and in official assessments (for example, state-party
              self-assessment instruments). Reproducing or approximating them here without the underlying
              assessment data would be fabrication, and capacity scores attached to named countries carry
              political consequences.
            </Callout>
          </Panel>

          <div className="space-y-3">
            <Panel title="Gap analysis framework" evidence="PLAN"
              subtitle="How the platform would characterise a gap once real data exists.">
              <ol className="space-y-2">
                {[
                  ['Coverage gap', 'Which administrative units never appear in the data at all.'],
                  ['Temporal gap', 'Which weeks are missing, and whether missingness clusters around events.'],
                  ['Confirmation gap', 'Share of reported cases with laboratory confirmation, by unit.'],
                  ['Timeliness gap', 'Distribution of event-to-report delay, by unit.'],
                  ['Stream gap', 'Which of the six streams exist at all for a given pathogen and place.'],
                  ['Workforce gap', 'Whether a raised signal can actually be investigated — the constraint that determines whether alerting has any value.'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="bw-num shrink-0 text-[10px] text-bw-dim">{String(i + 1).padStart(2, '0')}</span>
                    <div><div className="text-[12px] text-bw-text">{t}</div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-bw-muted">{d}</p></div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Equity principle" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A detection method that only works where reporting is already excellent adds least where it is
                needed most. This project therefore treats performance under sparse, delayed reporting as a
                primary evaluation condition rather than a robustness footnote — and treats a method that fails
                that condition as having failed, regardless of its headline metrics elsewhere.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link to="/app/quality"><Btn size="sm"><Icons.ShieldCheck size={12} /> Data quality center</Btn></Link>
                <Link to="/app/connectors"><Btn size="sm"><Icons.PlugZap size={12} /> Connectors</Btn></Link>
              </div>
            </Panel>
          </div>
        </Grid>
      )}
    </>
  );
}
