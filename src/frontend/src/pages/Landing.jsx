/* ============================================================
   BIOWATCH-AI — PUBLIC LANDING PAGE (SEGMENT 2)
   ============================================================ */
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LogoLockup, Logo, TAGLINE_FORMAL, TAGLINE } from '../components/Brand';
import { EvidenceTag, Pill, Panel, Callout } from '../components/ui';
import { EVIDENCE, EVIDENCE_ORDER, SAFE_LANGUAGE } from '../lib/evidence';
import { STREAMS } from '../lib/registry';

const PIPELINE = [
  'Data sources', 'Ingestion', 'Validation', 'Storage', 'Preprocessing',
  'Feature engineering', 'Statistical baseline', 'Machine learning',
  'Signal detection', 'Explainable AI', 'Human review', 'Visualisation', 'Reporting',
];

function Section({ id, kicker, title, children, className = '' }) {
  return (
    <section id={id} className={`border-t border-bw-line px-5 py-14 sm:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-[1180px]">
        {kicker && <div className="bw-label mb-2">{kicker}</div>}
        {title && <h2 className="mb-6 text-[22px] font-semibold tracking-tight text-bw-text sm:text-[26px]">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bw-base">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-50 border-b border-bw-line bg-bw-void/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] w-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <LogoLockup size={30} />
          <nav className="hidden items-center gap-5 text-[12px] text-bw-muted lg:flex">
            <a href="#how" className="hover:text-bw-text">How it works</a>
            <a href="#methodology" className="hover:text-bw-text">Methodology</a>
            <a href="#sources" className="hover:text-bw-text">Data sources</a>
            <a href="#xai" className="hover:text-bw-text">Explainable AI</a>
            <a href="#limits" className="hover:text-bw-text">Limitations</a>
            <a href="#about" className="hover:text-bw-text">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/access" className="rounded-sm border border-bw-line px-3 py-1.5 text-[11px] text-bw-muted hover:border-bw-line2 hover:text-bw-text">
              Researcher access
            </Link>
            <Link to="/app" className="rounded-sm bg-bw-primary px-3 py-1.5 text-[11px] font-medium text-[#04120f] hover:bg-bw-primary-bright">
              Explore platform
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="bw-grid-bg relative overflow-hidden border-b border-bw-line px-5 py-16 sm:px-8 sm:py-20">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.09]"
          style={{ background: 'radial-gradient(circle, var(--color-bw-primary) 0%, transparent 65%)' }}
        />
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Pill color="var(--color-bw-primary)">RESEARCH PROTOTYPE</Pill>
              <EvidenceTag t="PLAN" title="This interface depicts a design target for the completed research programme." />
              <Pill color="var(--color-ev-simulated)">NON-OPERATIONAL</Pill>
            </div>
            <h1 className="text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] text-bw-text sm:text-[54px]">
              BIOWATCH<span className="text-bw-primary-bright">-AI</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-bw-text sm:text-[19px]">
              {TAGLINE_FORMAL}.
            </p>
            <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-bw-muted">
              BIOWATCH-AI is a research and educational prototype investigating a single question:
              <span className="text-bw-text"> can computational methods extract useful early signals from
              biological and epidemiological data, under a reproducible framework, better than or in
              combination with established statistical surveillance methods?</span> It is not a clinical
              diagnostic, not an operational public-health system, and it does not attempt to
              "predict pandemics".
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-sm bg-bw-primary px-4 py-2.5 text-[12.5px] font-medium text-[#04120f] hover:bg-bw-primary-bright">
                <Icons.LayoutDashboard size={15} /> Explore the platform
              </Link>
              <a href="#methodology" className="inline-flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-4 py-2.5 text-[12.5px] text-bw-muted hover:text-bw-text">
                <Icons.BookOpen size={15} /> Research methodology
              </a>
              <a href="#limits" className="inline-flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-4 py-2.5 text-[12.5px] text-bw-muted hover:text-bw-text">
                <Icons.TriangleAlert size={15} /> Research limitations
              </a>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bw-line pt-5 sm:grid-cols-4">
              {[
                ['Signal streams', '6 designed'],
                ['Detection methods', 'Baseline-first'],
                ['Reported metrics', 'None fabricated'],
                ['Human review', 'Mandatory'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="bw-label">{k}</div>
                  <div className="mt-1 text-[13px] text-bw-text">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero side panel: honest status card */}
          <div className="min-w-0">
            <Panel title="Prototype status declaration" evidence="ESTABLISHED"
              subtitle="What this build does and does not contain.">
              <ul className="space-y-2.5 text-[12px] leading-relaxed text-bw-muted">
                {[
                  ['Interface architecture for 23 modules', true],
                  ['Deterministic synthetic demonstration data, labelled at every point of use', true],
                  ['API-ready connector definitions for public data sources', true],
                  ['Statistical baseline logic executed in-browser on synthetic series', true],
                  ['Trained machine-learning models', false],
                  ['Validated accuracy / AUROC / lead-time figures', false],
                  ['Real outbreak data or real public-health events', false],
                  ['Authorisation to issue public-health alerts', false],
                ].map(([txt, yes]) => (
                  <li key={txt} className="flex items-start gap-2">
                    {yes
                      ? <Icons.Check size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />
                      : <Icons.X size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />}
                    <span className={yes ? 'text-bw-text' : ''}>{txt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-bw-line pt-2.5">
                <p className="text-[11px] italic leading-relaxed text-bw-dim">"{TAGLINE}"</p>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <Section id="how" kicker="Section 01" title="How it works">
        <p className="mb-6 max-w-3xl text-[13px] leading-relaxed text-bw-muted">
          BIOWATCH-AI is designed as a linear, auditable pipeline. Every stage is inspectable, every stage
          can be disabled, and the machine-learning stage is never permitted to bypass the statistical
          baseline it must be compared against.
        </p>
        <div className="flex flex-wrap items-stretch gap-1.5">
          {PIPELINE.map((p, i) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="rounded-sm border border-bw-line bg-bw-panel px-2.5 py-2">
                <div className="bw-num text-[9px] text-bw-dim">{String(i + 1).padStart(2, '0')}</div>
                <div className="mt-0.5 text-[11.5px] text-bw-text">{p}</div>
              </div>
              {i < PIPELINE.length - 1 && <Icons.ChevronRight size={13} className="text-bw-line2" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: 'Scale', title: 'Baseline before model',
              body: 'No machine-learning result is displayed without the corresponding statistical baseline (seasonal mean, EWMA, EARS/CUSUM-family or regression baseline) evaluated on the same temporal split.',
              tag: 'ASSUMPTION',
            },
            {
              icon: 'Eye', title: 'Human review is terminal',
              body: 'The system produces candidate signals. A qualified analyst classifies them. No automated route exists from detector output to a public-health statement.',
              tag: 'PLAN',
            },
            {
              icon: 'FileSearch', title: 'Provenance on every number',
              body: 'Each figure carries an epistemic tag and a source. Synthetic values are labelled SIMULATED wherever they appear, including inside tooltips and exports.',
              tag: 'ESTABLISHED',
            },
          ].map((c) => (
            <Panel key={c.title} title={c.title} evidence={c.tag}>
              <div className="mb-2 text-bw-primary">
                {(() => { const C = Icons[c.icon] || Icons.Circle; return <C size={18} strokeWidth={1.6} />; })()}
              </div>
              <p className="text-[12px] leading-relaxed text-bw-muted">{c.body}</p>
            </Panel>
          ))}
        </div>
      </Section>

      {/* ---------------- Signal streams ---------------- */}
      <Section id="streams" kicker="Section 02" title="Six designed signal streams">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(STREAMS).map((s) => {
            const C = Icons[s.icon] || Icons.Circle;
            return (
              <div key={s.key} className="rounded-md border border-bw-line bg-bw-panel p-3.5" style={{ borderLeftColor: s.color, borderLeftWidth: 2 }}>
                <div className="flex items-center gap-2">
                  <C size={16} strokeWidth={1.7} style={{ color: s.color }} />
                  <span className="text-[13px] font-medium text-bw-text">{s.label}</span>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-bw-muted">
                  {{
                    epi: 'Case notifications, hospitalisations and mortality series from public repositories, with reporting-delay correction.',
                    genomic: 'Lineage frequency, mutation profiles and sequence metadata from public genomic repositories. Sequences are never fabricated.',
                    env: 'Wastewater and environmental sampling concentrations from open programmes, treated as an independent, non-clinical indicator.',
                    lab: 'Test volumes, positivity, confirmation rates and antimicrobial-resistance isolate reporting.',
                    synd: 'Syndrome-level indicators such as ILI/ARI consultations, kept explicitly separate from confirmed cases.',
                    event: 'Structured extraction from official bulletins and vetted media, always entering as unverified until an analyst adjudicates.',
                  }[s.key]}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------- Methodology ---------------- */}
      <Section id="methodology" kicker="Section 03" title="Research methodology">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {[
              ['Question', 'Do computational detectors provide earlier or more specific signals than established statistical surveillance baselines, on the same data, under the same evaluation protocol?', 'HYPOTHESIS'],
              ['Design', 'Retrospective evaluation on historical public datasets with strictly temporal train/validation/test splits. No random shuffling of time-ordered records.', 'PLAN'],
              ['Comparators', 'Seasonal mean ± k·SD, EWMA, Farrington-type regression baselines, and simple threshold rules serve as mandatory comparators.', 'PLAN'],
              ['Outcome definition', 'A "signal" must be defined against an externally documented reference period before any model is fitted, to avoid label leakage.', 'ASSUMPTION'],
              ['Primary metrics', 'Detection delay and lead time relative to reference, with sensitivity, specificity, PPV and calibration reported jointly — never accuracy alone.', 'PLAN'],
              ['Failure criterion', 'If the machine-learning approach does not beat the statistical baseline, that negative result is reported, not hidden.', 'ESTABLISHED'],
            ].map(([k, v, tag]) => (
              <div key={k} className="rounded-md border border-bw-line bg-bw-panel p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[12.5px] font-medium text-bw-text">{k}</span>
                  <EvidenceTag t={tag} size="xs" />
                </div>
                <p className="text-[12px] leading-relaxed text-bw-muted">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <Panel title="Epistemic labelling scheme" evidence="ESTABLISHED"
              subtitle="Every statement in the platform carries exactly one of these tags.">
              <div className="space-y-2">
                {EVIDENCE_ORDER.map((k) => (
                  <div key={k} className="flex gap-2.5">
                    <EvidenceTag t={k} size="xs" />
                    <p className="min-w-0 flex-1 text-[11px] leading-snug text-bw-dim">{EVIDENCE[k].definition}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </Section>

      {/* ---------------- Data sources ---------------- */}
      <Section id="sources" kicker="Section 04" title="Data sources">
        <p className="mb-5 max-w-3xl text-[13px] leading-relaxed text-bw-muted">
          The platform ships connector definitions for openly licensed public-health and genomic resources.
          A connector that is not configured is displayed as <span className="font-mono text-[11px] text-bw-dim">{SAFE_LANGUAGE.connectorUnconfigured}</span> —
          it is never silently replaced with synthetic values presented as live.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'WHO — Global Health Observatory', 'WHO — Disease Outbreak News', 'CDC — open data portal',
            'ECDC — surveillance atlas exports', 'Our World in Data', 'NCBI — E-utilities / Datasets',
            'Nextstrain — open builds', 'Open wastewater programmes', 'Nigeria NCDC — public situation reports',
            'Africa CDC — public dashboards', 'HealthMap / ProMED-style event feeds', 'National open-data portals',
          ].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-3 py-2">
              <Icons.PlugZap size={13} className="shrink-0 text-bw-dim" />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-bw-muted">{s}</span>
              <span className="font-mono text-[9px] tracking-[0.1em] text-bw-dim">READY</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-bw-dim">
          Listing a source indicates a connector interface exists in the architecture. It does not indicate an
          active data feed, an endorsement, or any affiliation with the organisation named. Each source is
          subject to its own licence and terms of use.
        </p>
      </Section>

      {/* ---------------- XAI ---------------- */}
      <Section id="xai" kicker="Section 05" title="Explainable by construction">
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="What an explanation must contain" evidence="PLAN">
            <ul className="space-y-1.5 text-[12px] text-bw-muted">
              {['Ranked feature contributions for the specific signal', 'Direction and magnitude of each contribution',
                'The baseline value the deviation is measured against', 'Uncertainty around the model output',
                'A plausible biological or reporting-process interpretation', 'Alternative explanations that were not excluded',
                'The limitations of the model that produced it'].map((x) => (
                <li key={x} className="flex gap-2"><Icons.Dot size={14} className="mt-[1px] shrink-0 text-bw-primary" />{x}</li>
              ))}
            </ul>
          </Panel>
          <Callout tone="warn" title="Standing interpretive warning" icon={<Icons.TriangleAlert size={12} />}>
            <p className="mb-2">{SAFE_LANGUAGE.causation}</p>
            <p>
              A feature attribution describes how a model used an input. It does not demonstrate that the
              input causes disease activity, and it does not validate the model. Attribution methods are
              themselves approximations with known instabilities.
            </p>
          </Callout>
        </div>
      </Section>

      {/* ---------------- Limitations ---------------- */}
      <Section id="limits" kicker="Section 06" title="Research limitations">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['Surveillance data are not ground truth', 'Reported case counts reflect testing capacity, care-seeking behaviour and administrative practice as much as biology. A change in a series is frequently a change in reporting.'],
            ['Label scarcity', 'Historical outbreak "labels" are few, inconsistently defined and retrospectively assigned. This severely limits supervised learning and inflates apparent performance.'],
            ['Class imbalance', 'Genuine anomalies are rare. Accuracy is therefore uninformative, and even a high-specificity detector can generate an unusable false-alarm burden at scale.'],
            ['Non-stationarity', 'Reporting systems, case definitions and testing policies change over time, breaking the assumption that historical baselines transfer to the present.'],
            ['Geographic bias', 'Data density is highest where surveillance capacity is already strongest. Models trained on such data systematically under-detect where detection matters most.'],
            ['No causal claim is possible', 'The architecture is associational. It cannot establish that any detected pattern is biologically caused by a pathogen event.'],
          ].map(([t, b]) => (
            <div key={t} className="rounded-md border border-bw-line bg-bw-panel p-3.5">
              <div className="mb-1.5 flex items-start gap-2">
                <Icons.TriangleAlert size={14} className="mt-[2px] shrink-0 text-[var(--color-alert-yellow)]" />
                <span className="text-[12.5px] font-medium text-bw-text">{t}</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-bw-muted">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- About ---------------- */}
      <Section id="about" kicker="Section 07" title="About the project">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3 text-[13px] leading-relaxed text-bw-muted">
            <p>
              BIOWATCH-AI is a student-led research programme in computational biosurveillance. Its objective
              is methodological: to build a reproducible framework in which candidate detection methods can be
              compared fairly, and to report what that comparison actually shows.
            </p>
            <p>
              The programme is stage-gated. This interface represents the <span className="text-bw-text">possible end state</span> if
              the research objectives are met. It is deliberately built before the science so that the
              scientific requirements — labelling, baselines, human review, provenance — are structural rather
              than retrofitted.
            </p>
            <p>
              Intended audiences: university researchers, biochemistry and bioinformatics students,
              epidemiologists, data scientists, public-health researchers, supervisors and scientific
              competition reviewers.
            </p>
            <div className="pt-2">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-sm border border-bw-primary/50 px-3.5 py-2 text-[12px] text-bw-primary-bright hover:bg-bw-primary/10">
                Enter the prototype <Icons.ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <Panel title="Not intended for" evidence="ESTABLISHED">
            <ul className="space-y-1.5 text-[12px] text-bw-muted">
              {['Clinical diagnosis or patient management', 'Operational outbreak declaration',
                'Regulatory or policy decision-making', 'Border, travel or trade measures',
                'Any use implying validated performance', 'Any biosecurity-sensitive application'].map((x) => (
                <li key={x} className="flex gap-2"><Icons.X size={13} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{x}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-bw-line bg-bw-void px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <div>
              <div className="text-[12px] tracking-[0.14em] text-bw-muted">BIOWATCH-AI</div>
              <div className="text-[10px] text-bw-dim">Research prototype · v0.4.0 · Not for operational use</div>
            </div>
          </div>
          <p className="max-w-md text-[10px] leading-relaxed text-bw-dim">
            No real-world surveillance data, no validated model performance and no confirmed disease events are
            presented anywhere in this build. Organisation names refer to publicly documented data sources only
            and imply no affiliation or endorsement.
          </p>
        </div>
      </footer>
    </div>
  );
}
