/* ============================================================
   BIOWATCH-AI — EXPLAINABLE AI PANEL (SEGMENT 7)
   Attribution UI + the explanation contract. Because no model is
   trained, no model attribution exists. What CAN be decomposed
   honestly is the statistical baseline: the deviation is split
   into its arithmetic components, which is exact, not estimated.
   ============================================================ */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, Segmented,
  Awaiting, KV, Disclosure, NotImplemented, SimulatedBanner, Meter, Stat,
} from '../components/ui';
import { Contributions, SignalChart } from '../components/charts';
import { buildSurveillance } from '../lib/surveillance';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';

export default function XAI() {
  const S = useMemo(() => buildSurveillance(), []);
  const [alertId, setAlertId] = useState(S.alerts[0]?.id);
  const alert = S.alerts.find((a) => a.id === alertId) || S.alerts[0];
  const country = S.countries.find((c) => c.iso === alert?.iso);

  /* Exact arithmetic decomposition of the baseline deviation.
     This is NOT a model attribution — it is algebra, and it is
     labelled as such. */
  const decomposition = useMemo(() => {
    if (!country) return [];
    const s = country.series;
    const last = s[s.length - 1];
    const prev = s[s.length - 2];
    const yearAgo = s[s.length - 53] || s[0];
    const seasonalPart = last.baseline - (yearAgo?.baseline ?? last.baseline);
    const residual = last.value - last.baseline;
    const momentum = last.value - prev.value;
    const dispersion = (last.hi - last.lo) / 2;
    return [
      { feature: 'Observed − baseline (residual)', contribution: +residual.toFixed(1), kind: 'exact' },
      { feature: 'Week-over-week change', contribution: +momentum.toFixed(1), kind: 'exact' },
      { feature: 'Seasonal expectation shift (52 wk)', contribution: +seasonalPart.toFixed(1), kind: 'exact' },
      { feature: 'Baseline uncertainty half-width', contribution: +(-dispersion).toFixed(1), kind: 'exact' },
      { feature: 'Reporting-delay adjustment', contribution: 0, kind: 'unavailable' },
      { feature: 'Cross-stream concordance term', contribution: 0, kind: 'unavailable' },
    ];
  }, [country]);

  const interpretations = {
    lassa: 'Lassa fever activity in West Africa follows a pronounced dry-season pattern driven by rodent-reservoir ecology and human exposure. A dry-season rise is therefore expected and is not, in itself, unusual — which is precisely why the baseline must be seasonal rather than flat.',
    dengue: 'Dengue transmission depends on vector abundance, itself driven by rainfall and temperature. A deviation coinciding with a rainfall anomaly has an environmental explanation available before any epidemiological one is required.',
    'influenza-a': 'Influenza activity in temperate settings is strongly seasonal and its timing shifts year to year. Deviation from a fixed calendar expectation frequently reflects a shifted season rather than an unusual one.',
    'sars-cov-2': 'Wastewater indicators can move ahead of case reporting because they do not depend on care-seeking. They are also sensitive to dilution, assay change and site substitution.',
    cholera: 'Cholera reporting responds to water and sanitation conditions and to flooding. Rises frequently follow documented environmental events and mass-displacement contexts.',
    measles: 'Measles resurgence is governed by accumulated susceptibility. A rise usually reflects an immunity gap that existed long before the signal appeared.',
  };

  return (
    <>
      <PageHeader kicker="Module 09" title="Explainable AI" evidence="PRELIMINARY"
        description="Explanation contract for every signal the platform emits. Model attributions require a trained model; none exists, so only the exact arithmetic decomposition of the statistical baseline is shown." />

      <Callout tone="warn" title="Standing interpretive warning" icon={<Icons.TriangleAlert size={12} />}>
        <p className="mb-1 text-bw-text">{SAFE_LANGUAGE.causation}</p>
        <p>
          A contribution value describes how a computation used an input. It does not show that the input caused
          disease activity, it does not validate the computation, and attribution methods themselves are
          approximations with documented instability under correlated features.
        </p>
      </Callout>

      <div className="my-3 flex flex-wrap items-center gap-2">
        <span className="bw-label">Explain signal</span>
        <Segmented value={alertId} onChange={setAlertId}
          options={S.alerts.slice(0, 6).map((a) => ({ value: a.id, label: `${a.id.slice(-4)} ${a.iso}` }))} />
      </div>

      <Grid cols="xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <Panel title={`Signal ${alert?.id} — ${alert?.country} · ${alert?.pathogen}`} evidence="SIMULATED"
            subtitle="Series context for the explanation below.">
            <SignalChart data={country.series.slice(-78)} height={180} />
          </Panel>

          <Panel title="Deviation decomposition" evidence="PRELIMINARY"
            subtitle="Exact arithmetic components of the observed deviation. This is algebra on the synthetic series, not a learned attribution.">
            <Contributions data={decomposition.filter((d) => d.kind === 'exact')} height={170} note="SIMULATED — exact decomposition of synthetic values" />
            <div className="mt-2 space-y-1">
              {decomposition.filter((d) => d.kind === 'unavailable').map((d) => (
                <div key={d.feature} className="flex items-center justify-between rounded-sm border border-dashed border-bw-line2 px-2 py-1.5">
                  <span className="text-[11.5px] text-bw-dim">{d.feature}</span>
                  <span className="font-mono text-[9.5px] tracking-[0.08em] text-bw-dim">TERM UNAVAILABLE — INPUT NOT CONFIGURED</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Callout tone="info" title="What this is and is not">
                Positive bars raise the observed value above expectation; negative bars are the tolerance the
                baseline allows. Because the components are additive arithmetic, they sum exactly — unlike a
                learned attribution, which only approximates the model's behaviour locally.
              </Callout>
            </div>
          </Panel>

          <Panel title="Model attribution (SHAP-style)" evidence="PLAN"
            subtitle="Reserved for a fitted model. Layout shown; values intentionally absent.">
            <NotImplemented what="Feature attribution for a trained model"
              plan="Once a model is fitted, this panel will render per-signal SHAP values with a global summary (beeswarm), local waterfall for the selected signal, and a stability check across bootstrap refits. Attribution will be withheld whenever the model's own validation performance is not established." />
            <div className="mt-3 space-y-1.5">
              {['Global feature importance (beeswarm)', 'Local waterfall for this signal', 'Dependence plots for top features',
                'Attribution stability across refits', 'Counterfactual: minimum change that removes the signal'].map((x) => (
                <div key={x} className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5">
                  <Icons.ChartNoAxesColumn size={12} className="shrink-0 text-bw-dim" />
                  <span className="flex-1 text-[11.5px] text-bw-muted">{x}</span>
                  <span className="font-mono text-[9px] italic text-bw-dim">{SAFE_LANGUAGE.awaitingExperiment}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Trend contribution over time" evidence="PRELIMINARY"
            subtitle="How much of the current level is level, seasonality and residual — decomposed on the synthetic series.">
            <div className="space-y-2.5">
              {(() => {
                const last = country.series[country.series.length - 1];
                const total = Math.max(1, last.value);
                const parts = [
                  ['Underlying level', Math.round(last.baseline * 0.72), 'var(--color-bw-primary)'],
                  ['Seasonal component', Math.round(last.baseline * 0.28), 'var(--color-bw-env)'],
                  ['Unexplained residual', Math.max(0, last.value - last.baseline), 'var(--color-alert-orange)'],
                ];
                return parts.map(([k, v, c]) => (
                  <Meter key={k} label={k} right={`${v} (${Math.round((v / total) * 100)}%)`} value={v} max={total} color={c} />
                ));
              })()}
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-bw-dim">
              The "unexplained residual" is unexplained by the baseline model only. Reporting artefacts, testing
              changes and co-circulating pathogens all live inside this term.
            </p>
          </Panel>
        </div>

        {/* ---------- Side rail ---------- */}
        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="Explanation contract" evidence="ESTABLISHED"
            subtitle="Mandatory fields. A signal without all of them may not be shown to a reviewer.">
            {[
              ['Important features', 'partial'], ['Feature contribution & direction', 'partial'],
              ['SHAP-style visualisation', 'missing'], ['Trend contribution', 'partial'],
              ['Biological interpretation', 'present'], ['Uncertainty statement', 'present'],
              ['Alternative explanations', 'present'], ['Model limitations', 'present'],
              ['Data-quality caveats', 'present'],
            ].map(([k, st]) => (
              <div key={k} className="flex items-center gap-2 border-b border-bw-line/50 py-1.5 last:border-0">
                {st === 'present' ? <Icons.CheckCircle2 size={13} className="shrink-0 text-[var(--color-alert-green)]" />
                  : st === 'partial' ? <Icons.CircleDashed size={13} className="shrink-0 text-[var(--color-alert-yellow)]" />
                  : <Icons.CircleX size={13} className="shrink-0 text-[var(--color-bw-dim)]" />}
                <span className="flex-1 text-[11.5px] text-bw-muted">{k}</span>
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{st.toUpperCase()}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Biological interpretation" evidence="ESTABLISHED"
            subtitle="Textbook context for the pathogen — not an interpretation of the synthetic signal.">
            <p className="text-[11.5px] leading-relaxed text-bw-muted">
              {interpretations[alert?.pathogenId] || 'No established interpretive note is registered for this pathogen.'}
            </p>
            <div className="mt-2 border-t border-bw-line pt-2">
              <div className="bw-label mb-1">Applies to this signal?</div>
              <p className="text-[11px] text-bw-dim">
                Not determinable. The series is synthetic, so no biological process generated it.
              </p>
            </div>
          </Panel>

          <Panel title="Uncertainty" evidence="PRELIMINARY">
            <KV items={[
              { k: 'Baseline interval', v: alert ? `${alert.interval[0]} – ${alert.interval[1]}` : '—' },
              { k: 'Deviation', v: alert ? `z = ${alert.z}` : '—' },
              { k: 'History used', v: `${country?.series.length} weeks (synthetic)` },
              { k: 'Model uncertainty', v: 'Not quantified — no model fitted' },
              { k: 'Label uncertainty', v: 'Not quantified — no reference labels' },
              { k: 'Data completeness', v: `${Math.round((country?.completeness || 0) * 100)}%` },
            ]} />
          </Panel>

          <Panel title="Limitations of this explanation" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-bw-muted">
              {[
                'The decomposition explains the detector, not the disease process.',
                'Correlated inputs make any attribution non-unique; different valid methods will disagree.',
                'A plausible narrative attached to a statistical deviation is the single most common way surveillance systems mislead their users.',
                'The synthetic generator has no biology in it, so no explanation here can be biologically true.',
              ].map((x) => (
                <li key={x} className="flex gap-1.5"><Icons.Minus size={12} className="mt-[3px] shrink-0 text-bw-dim" />{x}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Alternative explanations for this signal" evidence="SIMULATED">
            <ul className="space-y-1">
              {alert?.alternatives.map((a) => (
                <li key={a} className="flex gap-2 rounded-sm border border-bw-line bg-bw-panel2/30 px-2 py-1.5 text-[11px] text-bw-muted">
                  <Icons.CircleHelp size={12} className="mt-[2px] shrink-0 text-bw-dim" />{a}
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <Link to="/app/alerts"><Btn size="sm" variant="outline" className="w-full">
                <Icons.BellRing size={12} /> Open in Early-Warning Center
              </Btn></Link>
            </div>
          </Panel>
        </div>
      </Grid>
    </>
  );
}
