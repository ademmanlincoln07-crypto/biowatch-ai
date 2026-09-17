/* ============================================================
   BIOWATCH-AI — BIOLOGICAL SIGNAL MODULE (SEGMENT 8)
   Molecular / laboratory-derived signals, kept structurally
   SEPARATE from epidemiological case data. Nothing here is
   implemented; the module documents its own contract.
   ============================================================ */
import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  PageHeader, Panel, Pill, EvidenceTag, Callout, Grid, Table, Btn,
  NotImplemented, KV, Disclosure, NoData, Stat, Awaiting,
} from '../components/ui';
import { SAFE_LANGUAGE } from '../lib/evidence';

const CATEGORIES = [
  {
    id: 'genomics', name: 'Pathogen genomics', icon: 'Dna', status: 'plan',
    inputs: 'Lineage assignment, mutation profile, sequence quality metadata from public repositories',
    signalType: 'Compositional change in circulating diversity',
    separation: 'Aggregated at population level; never linked to an individual case record.',
    caveat: 'Sampling is a convenience sample of sequencing capacity, not of infections.',
    ethics: 'Public repository data only. Redistribution constrained by each repository licence.',
  },
  {
    id: 'host', name: 'Host-response biomarkers', icon: 'HeartPulse', status: 'plan',
    inputs: 'Aggregate summaries of published host-response panels (e.g. interferon-stimulated gene signatures) from research cohorts',
    signalType: 'Population-level shift in host-response profile',
    separation: 'Research-cohort aggregates only. No clinical or patient-level record is ingested.',
    caveat: 'Host-response signatures are non-specific across pathogens and highly sensitive to assay platform and timing after exposure.',
    ethics: 'Human-subjects data requires ethics approval and a data-sharing agreement; the prototype holds none and therefore holds no such data.',
  },
  {
    id: 'assays', name: 'Molecular assays', icon: 'TestTubes', status: 'plan',
    inputs: 'Aggregate PCR cycle-threshold distributions, assay type, target gene, platform',
    signalType: 'Distributional shift in Ct values as a proxy for viral load in the tested population',
    separation: 'Aggregate distributions only; no specimen-level data.',
    caveat: 'Ct comparisons across platforms and sampling protocols are not valid; shifts frequently reflect testing-policy change rather than biology.',
    ethics: 'Requires laboratory data-sharing agreements.',
  },
  {
    id: 'protein', name: 'Protein / sequence-derived features', icon: 'Atom', status: 'plan',
    inputs: 'Annotation-level features from public repositories (protein family, domain presence) — descriptive only',
    signalType: 'None on its own; contextual annotation for genomic signals',
    separation: 'Reference annotation, not surveillance data.',
    caveat: 'Structural or functional inference from sequence is out of scope. No phenotype prediction is performed.',
    ethics: 'Public reference data only. Explicitly excludes any design, enhancement or engineering-related analysis.',
  },
  {
    id: 'amr', name: 'Antimicrobial-resistance markers', icon: 'Bug', status: 'plan',
    inputs: 'Aggregate resistance-gene detection and phenotypic susceptibility summaries from public AMR surveillance programmes',
    signalType: 'Change in resistance prevalence within an organism–drug pair',
    separation: 'Isolate-level counts aggregated by facility type/region; no patient linkage.',
    caveat: 'Denominators are frequently unclear; referral bias concentrates resistant isolates at tertiary laboratories.',
    ethics: 'Requires programme agreements; facility identity is sensitive and must be masked.',
  },
  {
    id: 'molepi', name: 'Molecular epidemiology', icon: 'Network', status: 'plan',
    inputs: 'Cluster assignments derived from public sequence data with documented distance thresholds',
    signalType: 'Emergence or expansion of a genomic cluster',
    separation: 'Population-level cluster statistics only.',
    caveat: 'Genomic clustering is not transmission. Threshold choice alone determines the number of clusters found.',
    ethics: 'High re-identification risk when clusters are small — minimum cluster size and geographic masking are mandatory.',
  },
];

export default function BioSignals() {
  const [sel, setSel] = useState('genomics');
  const cat = CATEGORIES.find((c) => c.id === sel);
  const C = Icons[cat.icon] || Icons.Circle;

  return (
    <>
      <PageHeader kicker="Module 11" title="Biological Signals" evidence="PLAN"
        description="Design specification for molecular and laboratory-derived signal streams. This module is deliberately unimplemented: each category below requires data agreements, ethics review and methodological work that the research programme has not completed." />

      <Callout tone="warn" title="Separation of biological and epidemiological data" icon={<Icons.SplitSquareHorizontal size={12} />}>
        Biological signals are held in a <span className="text-bw-text">separate schema</span> from epidemiological case
        data and are never silently merged into a case series. They answer a different question ("what is the
        organism / host doing in the tested population?") with a different denominator ("who was tested and how"),
        and combining them without an explicit, documented linkage model produces artefacts that look like biology.
      </Callout>

      <Grid cols="sm:grid-cols-2 xl:grid-cols-4" className="my-3">
        <Stat label="Categories specified" value={CATEGORIES.length} evidence="PLAN" sub="Design only" />
        <Stat label="Categories implemented" value="0" evidence="ESTABLISHED" sub="No molecular data is held" color="var(--color-bw-muted)" />
        <Stat label="Data-sharing agreements" value="0" evidence="ESTABLISHED" sub="None executed" color="var(--color-bw-muted)" />
        <Stat label="Ethics approvals" value="0" evidence="ESTABLISHED" sub="Required before any host data" color="var(--color-bw-muted)" />
      </Grid>

      <Grid cols="xl:grid-cols-[320px_1fr]">
        <Panel title="Signal categories" evidence="PLAN" dense>
          <div className="space-y-1 p-1">
            {CATEGORIES.map((c) => {
              const I = Icons[c.icon] || Icons.Circle;
              return (
                <button key={c.id} type="button" onClick={() => setSel(c.id)}
                  className={`flex w-full items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition-colors ${
                    sel === c.id ? 'border-bw-primary bg-bw-primary/10' : 'border-bw-line bg-bw-panel2/40 hover:border-bw-line2'
                  }`}>
                  <I size={15} className={sel === c.id ? 'text-bw-primary-bright' : 'text-bw-dim'} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11.5px] text-bw-text">{c.name}</span>
                    <span className="block font-mono text-[8.5px] tracking-[0.1em] text-bw-dim">NOT IMPLEMENTED</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title={cat.name} evidence="PLAN" accent="var(--color-bw-genomic)"
            subtitle="Specification record — inputs, signal semantics, separation rules, caveats and governance.">
            <div className="mb-3 flex items-center gap-2.5">
              <C size={22} strokeWidth={1.5} className="text-bw-genomic" />
              <Pill color="var(--color-bw-dim)">{SAFE_LANGUAGE.notImplemented}</Pill>
            </div>
            <KV cols={1} mono={false} items={[
              { k: 'Inputs', v: cat.inputs, mono: false },
              { k: 'Signal semantics', v: cat.signalType, mono: false },
              { k: 'Separation from case data', v: cat.separation, mono: false },
              { k: 'Principal caveat', v: cat.caveat, mono: false },
              { k: 'Governance requirement', v: cat.ethics, mono: false },
            ]} />
            <div className="mt-3"><NoData reason="No data of this category is held by the prototype." /></div>
          </Panel>

          <Panel title="Integration contract" evidence="PLAN"
            subtitle="Conditions a biological stream must satisfy before it may influence any signal.">
            <Table dense columns={[
              { key: 'req', header: 'Requirement' },
              { key: 'why', header: 'Rationale' },
              { key: 'state', header: 'State', align: 'right', render: (r) => (
                <span className="font-mono text-[9px] tracking-[0.08em] text-bw-dim">{r.state}</span>) },
            ]} rows={[
              { req: 'Documented denominator', why: 'A count without "out of what" cannot be compared across time or place.', state: 'NOT MET' },
              { req: 'Assay/platform metadata', why: 'Platform changes produce step artefacts indistinguishable from biological change.', state: 'NOT MET' },
              { req: 'Aggregation floor (k-anonymity)', why: 'Small molecular clusters are re-identifiable.', state: 'NOT MET' },
              { req: 'Ethics / data-sharing approval', why: 'Host-derived data are human-subjects data.', state: 'NOT MET' },
              { req: 'Independent stream for concordance', why: 'A molecular signal alone is insufficient evidence.', state: 'NOT MET' },
              { req: 'Documented linkage model to case data', why: 'Prevents silent merging of incompatible denominators.', state: 'NOT MET' },
            ]} />
          </Panel>

          <Grid cols="lg:grid-cols-2">
            <Panel title="Why this module is empty rather than simulated" evidence="ESTABLISHED">
              <p className="text-[11.5px] leading-relaxed text-bw-muted">
                Elsewhere in this prototype, synthetic series demonstrate interface behaviour. That is defensible
                for aggregate counts. It is not defensible here: a fabricated biomarker panel, Ct distribution or
                resistance profile can be mistaken for a laboratory finding, and molecular results carry an
                authority that makes such confusion costly. The module therefore shows its contract and nothing else.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill color="var(--color-alert-green)">NO SYNTHETIC MOLECULAR DATA</Pill>
                <Pill color="var(--color-alert-green)">NO SEQUENCES</Pill>
                <Pill color="var(--color-alert-green)">NO PATIENT-LEVEL RECORDS</Pill>
              </div>
            </Panel>

            <Panel title="Planned development sequence" evidence="PLAN">
              <ol className="space-y-2">
                {[
                  ['Stage 1', 'AMR aggregate reporting from an open programme — lowest ethical burden, clearest denominator.'],
                  ['Stage 2', 'Genomic lineage metadata (already partially specified in the Genomic module).'],
                  ['Stage 3', 'Aggregate Ct distributions, contingent on laboratory agreements.'],
                  ['Stage 4', 'Host-response signatures — only with ethics approval and a research collaboration.'],
                  ['Stage 5', 'Cross-stream concordance modelling between molecular and epidemiological streams.'],
                ].map(([s, t]) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="bw-num shrink-0 text-[10px] text-bw-dim">{s}</span>
                    <span className="text-[11.5px] leading-relaxed text-bw-muted">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-2.5"><Awaiting label="No stage has been started." /></div>
            </Panel>
          </Grid>
        </div>
      </Grid>
    </>
  );
}
