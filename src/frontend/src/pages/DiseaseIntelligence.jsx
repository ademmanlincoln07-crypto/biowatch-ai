/* ============================================================
   BIOWATCH-AI — DISEASE INTELLIGENCE (SEGMENT 4)
   ============================================================ */
import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Stat, Pill, Dot, EvidenceTag, SimulatedBanner, Table, Callout,
  Segmented, Grid, Meter, NoData, KV, Disclosure, Awaiting,
} from '../components/ui';
import WorldMap, { MapLegend } from '../components/WorldMap';
import { SignalChart, Bars, Spark, Stacked } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { PATHOGENS, STREAMS } from '../lib/registry';
import { synthSeries, synthDelayProfile, rng, fmtTs } from '../lib/synth';
import { ALERT_STATES, SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';
import { CONNECTORS } from '../lib/connectors';

export default function DiseaseIntelligence() {
  const { isDemo } = useMode();
  const S = useMemo(() => buildSurveillance(), []);
  const [pid, setPid] = useState('lassa');
  const [window, setWindow] = useState('104');

  const pathogen = PATHOGENS.find((p) => p.id === pid);
  const countries = useMemo(() => S.countries.filter((c) => c.pathogenId === pid), [S, pid]);

  const global = useMemo(() => {
    const base = synthSeries(`disease:${pid}`, {
      weeks: 156, level: 400 + (pid.length * 37), season: pid === 'lassa' ? 0.75 : 0.5,
      disp: 0.18, injectAt: countries.some((c) => c.state !== 'GREEN') ? 8 : null, injectSize: 0.4,
    });
    return base;
  }, [pid, countries]);

  const w = Number(window);
  const view = global.slice(-w);

  const delays = useMemo(() => synthDelayProfile(pid), [pid]);
  const seasonality = useMemo(() => {
    const r = rng(pid + ':season');
    return Array.from({ length: 12 }, (_, i) => ({
      name: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i],
      value: +(50 + 40 * Math.sin((i / 12) * 2 * Math.PI - (pid === 'lassa' ? 0.2 : 1.6)) + r() * 12).toFixed(1),
    }));
  }, [pid]);

  const composition = useMemo(() => {
    const r = rng(pid + ':comp');
    return global.slice(-52).map((p) => ({
      date: p.date,
      suspected: Math.round(p.value * (0.55 + r() * 0.1)),
      confirmed: Math.round(p.value * (0.28 + r() * 0.08)),
      probable: Math.round(p.value * (0.1 + r() * 0.05)),
    }));
  }, [global, pid]);

  const mapVals = useMemo(() => Object.fromEntries(countries.map((c) => [c.iso, S.mapValues[c.iso]])), [countries, S]);
  const relevantConnectors = CONNECTORS.filter((c) => pathogen.streams.includes(c.stream));

  const latest = view[view.length - 1];
  const deviation = latest ? latest.z : 0;

  if (!isDemo) {
    return (
      <>
        <PageHeader kicker="Module 04" title="Disease Intelligence" evidence="PLAN"
          description="Per-pathogen exploration of incidence, baseline deviation, seasonality, confirmation and reporting behaviour." />
        <Callout tone="info" title="No pathogen stream bound in this mode" icon={<Icons.Info size={12} />}>
          This module renders only what a configured connector or uploaded dataset supplies. Nothing is bound in
          the active mode, and synthetic values are not substituted. Reference metadata below is descriptive
          public-health knowledge and contains no counts.
        </Callout>
        <Grid cols="lg:grid-cols-2" className="mt-3">
          {PATHOGENS.slice(0, 4).map((p) => (
            <Panel key={p.id} title={p.name} evidence="ESTABLISHED" subtitle={`${p.class} · ${p.family}`}>
              <p className="text-[12px] text-bw-muted">{p.seasonality}</p>
              <p className="mt-1 text-[11px] text-bw-dim">{p.surveillance}</p>
            </Panel>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Module 04" title="Disease Intelligence" evidence="SIMULATED"
        description="Pathogen-centred view combining synthetic activity series with descriptive surveillance metadata. Descriptive text is established public-health knowledge; every number is synthetic." />

      <div className="mb-3"><SimulatedBanner /></div>

      {/* ---------- Selector ---------- */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PATHOGENS.map((p) => (
          <button key={p.id} type="button" onClick={() => setPid(p.id)}
            className={`rounded-sm border px-2.5 py-1.5 text-[11.5px] transition-colors ${
              pid === p.id ? 'border-bw-primary bg-bw-primary/10 text-bw-text' : 'border-bw-line bg-bw-panel text-bw-muted hover:border-bw-line2'
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      <Grid cols="xl:grid-cols-[1fr_330px]" className="mb-3">
        <div className="min-w-0 space-y-3">
          <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Latest weekly count" value={latest?.value.toLocaleString()} evidence="SIMULATED"
              sub={`Week ending ${latest?.date}`} />
            <Stat label="Baseline expectation" value={latest?.baseline.toLocaleString()} evidence="SIMULATED"
              sub={`95% interval ${latest?.lo}–${latest?.hi}`} />
            <Stat label="Deviation from baseline" value={`${deviation > 0 ? '+' : ''}${deviation.toFixed(2)}σ`} evidence="SIMULATED"
              color={deviation >= 2 ? 'var(--color-alert-orange)' : 'var(--color-bw-text)'}
              sub={deviation >= 2 ? 'Exceeds detection threshold' : 'Within baseline interval'} />
            <Stat label="Deaths reported" value="—" evidence="SIMULATED" color="var(--color-bw-dim)"
              sub="Mortality stream not generated"
              hint="Mortality is deliberately not synthesised: fabricating death counts, even labelled, is unacceptable." />
          </Grid>

          <Panel title={`${pathogen.name} — incidence trend against baseline`} evidence="SIMULATED"
            subtitle="Solid: synthetic observed counts. Dashed: seasonal baseline. Band: 95% interval."
            actions={<Segmented size="xs" options={[
              { value: '52', label: '1 yr' }, { value: '104', label: '2 yr' }, { value: '156', label: '3 yr' },
            ]} value={window} onChange={setWindow} />}>
            <SignalChart data={view} height={230} yLabel="weekly count" />
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Case classification composition" evidence="SIMULATED"
              subtitle="Suspected / probable / laboratory-confirmed split — the confirmation ratio matters more than the total.">
              <Stacked data={composition} keys={['suspected', 'probable', 'confirmed']}
                colors={['#4a90c4', '#c9a227', '#2ea89a']} height={185} />
              <div className="mt-1.5 flex flex-wrap gap-3">
                {[['Suspected', '#4a90c4'], ['Probable', '#c9a227'], ['Confirmed', '#2ea89a']].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5 text-[10.5px] text-bw-muted">
                    <span className="h-2 w-2 rounded-sm" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Seasonality profile" evidence="SIMULATED"
              subtitle={`Descriptive note (ESTABLISHED): ${pathogen.seasonality}`}>
              <Bars data={seasonality} height={185} color="var(--color-bw-env)" note="SIMULATED — synthetic seasonal index" />
              <p className="mt-1.5 text-[10px] leading-snug text-bw-dim">
                A seasonal profile estimated from few years of data is unstable, and any detector built on it
                inherits that instability.
              </p>
            </Panel>
          </Grid>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Reporting delay distribution" evidence="SIMULATED"
              subtitle="Share of reports arriving n weeks after the event week. Drives now-cast correction.">
              <Bars data={delays.map((d) => ({ name: `+${d.lag}w`, value: Math.round(d.share * 100) }))}
                height={165} color="var(--color-alert-yellow)" unit="%" note="SIMULATED — synthetic delay profile" />
              <Callout tone="warn" title="Why this matters">
                The most recent points of any surveillance series are incomplete. A detector that ignores delay
                will read incompleteness as a decline, then read the back-fill as a surge.
              </Callout>
            </Panel>

            <Panel title="Geographic distribution" evidence="SIMULATED"
              subtitle="Territories with this stream configured in the synthetic set.">
              <WorldMap values={mapVals} height={190}
                points={countries.filter((c) => c.availability !== 'none').map((c) => ({
                  lon: c.lon, lat: c.lat, iso: c.iso, label: c.name,
                  color: ALERT_STATES[c.state].color, r: 3 + Math.abs(c.z),
                }))} />
              <div className="mt-2"><MapLegend compact /></div>
            </Panel>
          </Grid>
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Pathogen reference" evidence="ESTABLISHED"
            subtitle="Descriptive metadata — contains no counts and no claims about current activity.">
            <KV items={[
              { k: 'Name', v: pathogen.name, mono: false },
              { k: 'Family', v: pathogen.family, mono: false },
              { k: 'Class', v: pathogen.class, mono: false },
              { k: 'Seasonality', v: pathogen.seasonality, mono: false },
              { k: 'Surveillance practice', v: pathogen.surveillance, mono: false },
              { k: 'Note', v: pathogen.note, mono: false },
            ]} />
          </Panel>

          <Panel title="Stream availability" evidence="SIMULATED" dense>
            <div className="space-y-1 p-1">
              {Object.values(STREAMS).map((st) => {
                const on = pathogen.streams.includes(st.key);
                const C = Icons[st.icon] || Icons.Circle;
                return (
                  <div key={st.key} className="flex items-center gap-2 py-0.5">
                    <C size={13} style={{ color: on ? st.color : 'var(--color-bw-dim)' }} />
                    <span className={`flex-1 text-[11.5px] ${on ? 'text-bw-text' : 'text-bw-dim'}`}>{st.label}</span>
                    <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: on ? st.color : 'var(--color-bw-dim)' }}>
                      {on ? 'DESIGNED' : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Laboratory confirmation" evidence="SIMULATED">
            <Meter label="Confirmation ratio (synthetic)" right="≈ 31%" value={31} color="var(--color-bw-primary)" />
            <div className="mt-2 space-y-1.5 text-[11px] text-bw-muted">
              <div className="flex justify-between"><span>Assay</span><span className="bw-num text-bw-dim">RT-PCR (reference)</span></div>
              <div className="flex justify-between"><span>Turnaround (synthetic)</span><span className="bw-num text-bw-dim">2.4 d median</span></div>
              <div className="flex justify-between"><span>Validated sensitivity</span><span className="font-mono text-[10px] text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span></div>
            </div>
          </Panel>

          <Panel title="Relevant alerts" evidence="SIMULATED" dense>
            {S.alerts.filter((a) => a.pathogenId === pid).length === 0 ? (
              <div className="px-2 py-4 text-center text-[11px] text-bw-dim">No open signal for this stream.</div>
            ) : S.alerts.filter((a) => a.pathogenId === pid).map((a) => (
              <div key={a.id} className="border-b border-bw-line/60 px-1.5 py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <Dot color={ALERT_STATES[a.state].color} />
                  <span className="bw-num text-[10px] text-bw-dim">{a.id}</span>
                  <span className="ml-auto text-[10px] text-bw-dim">{a.country}</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-bw-muted">{a.what}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Source connectors for this pathogen" evidence="ESTABLISHED" dense>
            <div className="space-y-1 p-1">
              {relevantConnectors.slice(0, 5).map((c) => (
                <div key={c.id} className="rounded-sm border border-bw-line bg-bw-panel2/40 px-2 py-1.5">
                  <div className="text-[11px] text-bw-text">{c.name}</div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-[9.5px] text-bw-dim">{c.frequency}</span>
                    <span className="font-mono text-[8.5px] tracking-[0.08em] text-bw-dim">
                      {c.status === 'available' ? 'CONFIG REQUIRED' : c.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Grid>

      <Grid cols="lg:grid-cols-2">
        <Panel title="Territory breakdown" evidence="SIMULATED">
          <Table rowKey="iso" columns={[
            { key: 'name', header: 'Territory' },
            { key: 'state', header: 'Detector state', render: (r) => (
              <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: ALERT_STATES[r.state].color }}>
                <Dot color={ALERT_STATES[r.state].color} />{r.availability === 'none' ? 'Insufficient data' : r.state}
              </span>) },
            { key: 'z', header: 'z', align: 'right', render: (r) => <span className="bw-num text-[11.5px]">{r.availability === 'none' ? '—' : r.z.toFixed(2)}</span> },
            { key: 'sp', header: '26-wk', align: 'right', width: 90, render: (r) => (
              <div className="ml-auto w-[80px]"><Spark data={r.series.slice(-26)} color="var(--color-bw-dim)" height={20} /></div>) },
          ]} rows={countries} empty="No territory configured for this pathogen in the synthetic set." />
        </Panel>

        <Panel title="What this module cannot tell you" evidence="ESTABLISHED">
          <div className="space-y-2">
            <Disclosure summary="Incidence vs. detected incidence" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Every series here is a series of <em>reports</em>. The relationship between reports and true
                incidence depends on care-seeking, testing access, case definition and administrative capacity —
                each of which varies over time and place.
              </p>
            </Disclosure>
            <Disclosure summary="Why no case-fatality figure is shown" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A synthetic CFR would be a fabricated clinical statistic. Mortality streams are therefore left
                empty in DEMONSTRATION mode and populated only from a real, cited source.
              </p>
            </Disclosure>
            <Disclosure summary="Why deviation is not risk" tag="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                A z-score measures distance from a statistical expectation. Converting it into a risk statement
                requires an epidemiological model of consequence, transmission and susceptibility that this
                prototype does not contain.
              </p>
            </Disclosure>
            <Disclosure summary="Planned additions" tag="PLAN">
              <ul className="space-y-1 text-[11.5px] text-bw-muted">
                {['Now-casting with delay-adjusted reporting triangles', 'Rt estimation with documented serial-interval assumptions',
                  'Age/sex stratification where the source provides it', 'Sub-national resolution where licensing permits'].map((x) => (
                  <li key={x} className="flex gap-1.5"><Icons.Dot size={13} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
                ))}
              </ul>
            </Disclosure>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-bw-line pt-2">
            <span className="bw-label">Series generated</span>
            <span className="bw-num text-[10px] text-bw-dim">{fmtTs()}</span>
          </div>
        </Panel>
      </Grid>
    </>
  );
}
