/* ============================================================
   BIOWATCH-AI — MODEL / EXPERIMENT CARDS (SEGMENT 10)
   Structured record for every model. Cards exist for the
   IMPLEMENTED statistical detectors (which are deterministic
   procedures, not trained models) and as empty templates for
   candidates that have not been trained.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn, KV,
  Awaiting, Disclosure, NotImplemented, Stat,
} from '../components/ui';
import { SAFE_LANGUAGE } from '../lib/evidence';
import { fmtTs } from '../lib/synth';

const CARDS = [
  {
    id: 'MC-001', name: 'Seasonal baseline detector (same-week mean + kσ)', kind: 'Statistical procedure',
    trained: false, version: '0.4.0',
    dataset: 'Applied to whichever series is bound; in this build, the synthetic demonstration panel.',
    features: 'Historical values for the same ISO week in prior years; fallback to trailing 8-week window when history is insufficient.',
    target: 'None — unsupervised threshold procedure, not a fitted model.',
    trainingPeriod: 'Not applicable (no parameters are learned; k is chosen, not estimated).',
    validationPeriod: 'Not performed.', testPeriod: 'Not performed.',
    preprocessing: 'ISO-week alignment. No imputation. No scaling.',
    hyperparameters: 'k = 2.0 (exceedance multiplier); minimum history = 52 weeks; persistence = 2 weeks.',
    metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: [
      'Baseline is contaminated by past epidemics present in the history window.',
      'Assumes approximate normality of counts; fails for low-count series where a Poisson/negative-binomial formulation is required.',
      'No trend term; a genuine secular increase is progressively absorbed into the baseline.',
      'k is a policy choice about tolerable false alarms, not an estimate.',
    ],
    biases: [
      'Series with more complete reporting produce tighter intervals and therefore flag more readily — capacity is confounded with signal.',
      'Territories with short history cannot be evaluated at all and silently disappear from the alarm set unless explicitly surfaced.',
    ],
    intended: 'A transparent comparator against which any machine-learning candidate must be evaluated; interface demonstration of the detection pipeline.',
    notIntended: 'Operational alerting; clinical use; any claim of validated detection performance; use on low-count series without reformulation.',
    date: '2026-08-12', researcher: 'Prototype author',
  },
  {
    id: 'MC-002', name: 'EWMA control chart', kind: 'Statistical procedure', trained: false, version: '0.4.0',
    dataset: 'Bound series.', features: 'Exponentially weighted mean of observed values; trailing-window mean and SD.',
    target: 'None — control-chart procedure.', trainingPeriod: 'Not applicable.', validationPeriod: 'Not performed.', testPeriod: 'Not performed.',
    preprocessing: 'ISO-week alignment.', hyperparameters: 'λ = 0.3; L = 3; trailing window = 8 weeks.',
    metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Assumes residual stationarity, which surveillance series violate.', 'Slow to react to abrupt single-week spikes.', 'Control limits assume independence; autocorrelation inflates false alarms.'],
    biases: ['Inherits the seasonality of the input; without deseasonalisation it alarms every season.'],
    intended: 'Comparator; demonstration of small-shift sensitivity.',
    notIntended: 'Deployment without deseasonalisation and an agreed alarm budget.',
    date: '2026-08-12', researcher: 'Prototype author',
  },
  {
    id: 'MC-003', name: 'Random Forest signal classifier', kind: 'Supervised ML', trained: false, version: '—',
    dataset: 'NOT SELECTED', features: 'Specified in the ML Lab; not fixed.', target: 'Requires curated reference-period labels — NOT AVAILABLE.',
    trainingPeriod: '—', validationPeriod: '—', testPeriod: '—',
    preprocessing: '—', hyperparameters: '—', metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Cannot be assessed — the model does not exist.'],
    biases: ['Anticipated: geographic bias inherited from training data; over-fitting to reporting artefacts.'],
    intended: 'Candidate method for the baseline-comparison experiment.',
    notIntended: 'Any use whatsoever until trained, validated and compared against the statistical baseline.',
    date: '—', researcher: '—', empty: true,
  },
  {
    id: 'MC-004', name: 'LSTM sequence detector', kind: 'Deep learning', trained: false, version: '—',
    dataset: 'NOT SELECTED', features: '—', target: '—', trainingPeriod: '—', validationPeriod: '—', testPeriod: '—',
    preprocessing: '—', hyperparameters: '—', metrics: SAFE_LANGUAGE.awaitingExperiment,
    limitations: ['Cannot be assessed — the model does not exist.', 'Data volume in typical weekly surveillance series is far below the regime where sequence models are justified.'],
    biases: ['Anticipated: severe over-fitting; opacity that conflicts with the explainability contract.'],
    intended: 'Later-stage exploration only, contingent on earlier stages producing a reason to try it.',
    notIntended: 'Anything, at present.',
    date: '—', researcher: '—', empty: true,
  },
];

export default function ModelCards() {
  const [sel, setSel] = useState('MC-001');
  const card = CARDS.find((c) => c.id === sel);

  const exportCard = () => {
    const md = `# Model Card — ${card.name}

**Card ID:** ${card.id}  
**Kind:** ${card.kind}  
**Trained:** ${card.trained ? 'Yes' : 'NO — no fitted model exists'}  
**Version:** ${card.version}  
**Date:** ${card.date}  
**Researcher:** ${card.researcher}

## Dataset
${card.dataset}

## Features
${card.features}

## Target
${card.target}

## Periods
- Training: ${card.trainingPeriod}
- Validation: ${card.validationPeriod}
- Test: ${card.testPeriod}

## Preprocessing
${card.preprocessing}

## Hyperparameters
${card.hyperparameters}

## Metrics
${card.metrics}

## Limitations
${card.limitations.map((l) => `- ${l}`).join('\n')}

## Known biases
${card.biases.map((l) => `- ${l}`).join('\n')}

## Intended use
${card.intended}

## NOT intended for
${card.notIntended}

---
Generated by the BIOWATCH-AI research prototype on ${fmtTs()}.
This card reports no validated performance. BIOWATCH-AI is not a clinical diagnostic or operational public-health system.
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${card.id}-model-card.md`; a.click();
  };

  return (
    <>
      <PageHeader kicker="Module 17" title="Model & Experiment Cards" evidence="ESTABLISHED"
        description="Structured record for every model or procedure the platform can run. A card must exist before a method may appear anywhere else in the interface." />

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="mb-3">
        <Stat label="Cards registered" value={CARDS.length} evidence="ESTABLISHED" />
        <Stat label="Cards for trained models" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub="No model has been fitted" />
        <Stat label="Cards with metrics" value="0" evidence="ESTABLISHED" color="var(--color-bw-muted)" sub={SAFE_LANGUAGE.awaitingExperiment} />
        <Stat label="Cards with limitations declared" value={CARDS.length} evidence="ESTABLISHED" color="var(--color-alert-green)" />
      </Grid>

      <Grid cols="xl:grid-cols-[300px_1fr]">
        <Panel title="Card registry" evidence="ESTABLISHED" dense>
          <div className="space-y-1 p-1">
            {CARDS.map((c) => (
              <button key={c.id} type="button" onClick={() => setSel(c.id)}
                className={`block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  sel === c.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'}`}>
                <div className="bw-num text-[10px] text-bw-dim">{c.id}</div>
                <div className="mt-0.5 text-[11.5px] text-bw-text">{c.name}</div>
                <div className="mt-1 font-mono text-[8.5px] tracking-[0.08em]"
                  style={{ color: c.empty ? 'var(--color-bw-dim)' : 'var(--color-bw-data)' }}>
                  {c.empty ? 'TEMPLATE — NOT TRAINED' : 'PROCEDURE — NO FITTED PARAMETERS'}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="min-w-0 space-y-3">
          <Panel title={card.name} evidence={card.empty ? 'PLAN' : 'ESTABLISHED'}
            subtitle={`${card.id} · ${card.kind} · version ${card.version}`}
            actions={<Btn size="xs" onClick={exportCard}><Icons.Download size={11} /> Export card (MD)</Btn>}>
            {card.empty && (
              <div className="mb-3">
                <Callout tone="warn" title="Empty card — model not trained">
                  This card exists so that the method is registered and its intended limitations are declared
                  before anyone attempts to use it. Every field that would require a fitted model is blank.
                </Callout>
              </div>
            )}
            <KV cols={2} mono={false} items={[
              { k: 'Model name', v: card.name, mono: false },
              { k: 'Dataset', v: card.dataset, mono: false },
              { k: 'Version', v: card.version },
              { k: 'Features', v: card.features, mono: false },
              { k: 'Target', v: card.target, mono: false },
              { k: 'Training period', v: card.trainingPeriod, mono: false },
              { k: 'Validation period', v: card.validationPeriod, mono: false },
              { k: 'Test period', v: card.testPeriod, mono: false },
              { k: 'Preprocessing', v: card.preprocessing, mono: false },
              { k: 'Hyperparameters', v: card.hyperparameters, mono: false },
              { k: 'Date', v: card.date },
              { k: 'Researcher', v: card.researcher, mono: false },
            ]} />

            <div className="mt-3 rounded-sm border border-dashed border-bw-line2 px-2.5 py-2">
              <div className="bw-label mb-1">Metrics</div>
              <Awaiting label={card.metrics} note="No metric may be entered on a card without a linked, completed experiment run." />
            </div>
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Limitations" evidence="ESTABLISHED" accent="var(--color-alert-yellow)">
              <ul className="space-y-1.5">
                {card.limitations.map((l) => (
                  <li key={l} className="flex gap-2 text-[11.5px] leading-relaxed text-bw-muted">
                    <Icons.TriangleAlert size={12} className="mt-[3px] shrink-0 text-[var(--color-alert-yellow)]" />{l}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Known biases" evidence="ESTABLISHED" accent="var(--color-alert-orange)">
              <ul className="space-y-1.5">
                {card.biases.map((l) => (
                  <li key={l} className="flex gap-2 text-[11.5px] leading-relaxed text-bw-muted">
                    <Icons.Scale size={12} className="mt-[3px] shrink-0 text-[var(--color-alert-orange)]" />{l}
                  </li>
                ))}
              </ul>
            </Panel>
          </Grid>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Intended use" evidence="ESTABLISHED" accent="var(--color-alert-green)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{card.intended}</p>
            </Panel>
            <Panel title="NOT intended for" evidence="ESTABLISHED" accent="var(--color-alert-red)">
              <p className="text-[12px] leading-relaxed text-bw-muted">{card.notIntended}</p>
              <div className="mt-2 border-t border-bw-line pt-2">
                <p className="text-[11px] text-bw-dim">
                  Universal exclusions apply to every card: clinical diagnosis, operational outbreak declaration,
                  regulatory decision-making, and any use implying validated performance.
                </p>
              </div>
            </Panel>
          </Grid>
        </div>
      </Grid>
    </>
  );
}
