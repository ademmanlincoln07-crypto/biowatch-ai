/* ============================================================
   BIOWATCH-AI — DERIVED SURVEILLANCE STATE (DEMONSTRATION MODE)
   ------------------------------------------------------------
   Builds the synthetic surveillance picture ONCE so that the
   command centre, map, alert centre, XAI panel and regional view
   all describe the SAME simulated situation. Consistency here is
   a scientific-integrity requirement, not a convenience: a
   prototype that contradicts itself across modules teaches the
   reviewer nothing about the real architecture.

   ALL VALUES ARE SIMULATED.
   ============================================================ */
import { COUNTRY_POINTS, PATHOGENS } from './registry';
import { synthSeries, rng, fmtTs } from './synth';

/* Which synthetic stories exist in DEMONSTRATION mode.
   Each is an interface scenario, not a claim about any country. */
const SCENARIOS = [
  { iso: 'NGA', pathogen: 'lassa',      inject: 9,  size: 0.85, level: 42,  streams: ['epi', 'lab'] },
  { iso: 'BRA', pathogen: 'dengue',     inject: 12, size: 0.65, level: 900, streams: ['epi', 'lab', 'env'] },
  { iso: 'DEU', pathogen: 'influenza-a',inject: 6,  size: 0.42, level: 310, streams: ['epi', 'synd', 'lab'] },
  { iso: 'IND', pathogen: 'measles',    inject: 8,  size: 0.55, level: 260, streams: ['epi', 'lab'] },
  { iso: 'GBR', pathogen: 'sars-cov-2', inject: 5,  size: 0.3,  level: 480, streams: ['env', 'epi', 'genomic'] },
  { iso: 'COD', pathogen: 'cholera',    inject: 10, size: 0.7,  level: 120, streams: ['epi', 'env'] },
  { iso: 'USA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 1400,streams: ['epi', 'synd', 'lab', 'genomic'] },
  { iso: 'JPN', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 520, streams: ['epi', 'lab'] },
  { iso: 'ZAF', pathogen: 'sars-cov-2', inject: 0,  size: 0,    level: 210, streams: ['epi', 'env', 'genomic'] },
  { iso: 'KEN', pathogen: 'cholera',    inject: 4,  size: 0.35, level: 60,  streams: ['epi'] },
  { iso: 'PHL', pathogen: 'dengue',     inject: 0,  size: 0,    level: 340, streams: ['epi', 'lab'] },
  { iso: 'FRA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 290, streams: ['epi', 'synd'] },
  { iso: 'IDN', pathogen: 'dengue',     inject: 3,  size: 0.28, level: 410, streams: ['epi'] },
  { iso: 'MEX', pathogen: 'dengue',     inject: 0,  size: 0,    level: 220, streams: ['epi', 'lab'] },
  { iso: 'ETH', pathogen: 'measles',    inject: 0,  size: 0,    level: 95,  streams: ['epi'], availability: 'sparse' },
  { iso: 'PAK', pathogen: 'cholera',    inject: 0,  size: 0,    level: 88,  streams: ['epi'], availability: 'sparse' },
  { iso: 'EGY', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 130, streams: ['epi'] },
  { iso: 'THA', pathogen: 'dengue',     inject: 0,  size: 0,    level: 180, streams: ['epi', 'lab'] },
  { iso: 'AUS', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 240, streams: ['epi', 'lab', 'genomic'] },
  { iso: 'GHA', pathogen: 'cholera',    inject: 0,  size: 0,    level: 45,  streams: ['epi'], availability: 'none' },
  { iso: 'CHN', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 700, streams: ['epi'], availability: 'sparse' },
  { iso: 'ITA', pathogen: 'influenza-a',inject: 0,  size: 0,    level: 260, streams: ['epi', 'synd'] },
];

/** Deterministic detector cascade applied to a synthetic series. */
export function evaluateSeries(series, { z1 = 2.0, z2 = 3.0, persist = 2 } = {}) {
  const marked = series.map((p) => ({ ...p, flag: p.z >= z1 ? p.value : undefined }));
  const last = marked[marked.length - 1];
  const recent = marked.slice(-4);
  const consecutive = (() => {
    let c = 0;
    for (let i = marked.length - 1; i >= 0; i--) { if (marked[i].z >= z1) c++; else break; }
    return c;
  })();
  const maxZ = Math.max(...recent.map((p) => p.z));
  let state = 'GREEN';
  if (last.z >= z1 && consecutive >= persist) state = 'ORANGE';
  else if (last.z >= z1) state = 'YELLOW';
  if (last.z >= z2 && consecutive >= persist) state = 'RED';
  if (state === 'GREEN' && maxZ >= z1) state = 'YELLOW';
  return { series: marked, last, state, consecutive, maxZ: +maxZ.toFixed(2), z: last.z };
}

const _cache = {};

export function buildSurveillance() {
  if (_cache.data) return _cache.data;

  const countries = SCENARIOS.map((sc) => {
    const geo = COUNTRY_POINTS.find((c) => c.iso === sc.iso);
    const path = PATHOGENS.find((p) => p.id === sc.pathogen);
    const key = `${sc.iso}:${sc.pathogen}`;
    const series = synthSeries(key, {
      weeks: 104, level: sc.level, season: sc.pathogen === 'lassa' ? 0.7 : 0.45,
      injectAt: sc.inject || null, injectSize: sc.size, disp: 0.2,
      phase: (sc.iso.charCodeAt(0) + sc.iso.charCodeAt(2)) % 52,
    });
    const ev = evaluateSeries(series);
    const r = rng(key + ':meta');
    const availability = sc.availability || (r() > 0.75 ? 'sparse' : 'full');
    return {
      iso: sc.iso, name: geo?.name || sc.iso, lon: geo?.lon, lat: geo?.lat, region: geo?.region,
      pathogen: path, pathogenId: sc.pathogen, streams: sc.streams, availability,
      ...ev,
      completeness: +(availability === 'none' ? 0 : availability === 'sparse' ? 0.42 + r() * 0.2 : 0.78 + r() * 0.2).toFixed(2),
      delayWeeks: +(availability === 'sparse' ? 2.2 + r() * 2 : 0.6 + r() * 1.2).toFixed(1),
      lastUpdate: fmtTs(new Date(Date.now() - Math.floor(r() * 60) * 3600000)),
    };
  });

  /* Map payload: state + label using permitted phrasing only. */
  const LABEL = {
    GREEN: 'No unusual activity detected',
    YELLOW: 'Signal detected — review',
    ORANGE: 'Unusual activity — investigate',
    RED: 'Elevated reporting — human assessment',
  };
  const mapValues = Object.fromEntries(countries.map((c) => [c.iso, {
    state: c.availability === 'none' ? 'GREEN' : c.state,
    label: c.availability === 'none' ? 'Insufficient data for baseline' : LABEL[c.state],
    availability: c.availability === 'none' ? 'none' : undefined,
    metrics: [
      { k: 'Stream', v: c.pathogen?.name },
      { k: 'Deviation (z)', v: c.availability === 'none' ? '—' : c.z.toFixed(2) },
      { k: 'Consecutive weeks', v: c.availability === 'none' ? '—' : c.consecutive },
      { k: 'Completeness', v: c.availability === 'none' ? 'DATA NOT AVAILABLE' : `${Math.round(c.completeness * 100)}%` },
    ],
  }]));

  /* Alerts derive strictly from detector output — never invented. */
  const alerts = countries
    .filter((c) => c.state !== 'GREEN' && c.availability !== 'none')
    .sort((a, b) => b.z - a.z)
    .map((c, i) => buildAlert(c, i));

  const data = { countries, mapValues, alerts, generatedAt: fmtTs() };
  _cache.data = data;
  return data;
}

const ALT_EXPLANATIONS = {
  epi: [
    'Change in case definition or reporting form at the source',
    'Catch-up reporting after a backlog or public holiday',
    'Increased testing capacity raising ascertainment without a change in incidence',
    'Duplicate records introduced during a data migration',
  ],
  lab: [
    'Laboratory reagent or platform change affecting positivity',
    'Referral pattern shift concentrating specimens at one facility',
    'Seasonal testing campaign inflating denominators',
  ],
  env: [
    'Rainfall dilution or industrial discharge altering wastewater concentration',
    'Change in sampling site, flow normalisation or assay',
    'Sampling frequency change creating an apparent trend',
  ],
  synd: [
    'Co-circulating pathogen producing the same syndrome',
    'Media attention increasing care-seeking behaviour',
    'Change in the sentinel practice panel',
  ],
  genomic: [
    'Sequencing bias — targeted sequencing of unusual specimens',
    'Change in submission cadence by a contributing laboratory',
  ],
};

function buildAlert(c, i) {
  const r = rng(`${c.iso}:${c.pathogenId}:alert`);
  const primary = c.streams[0];
  const concordant = c.streams.filter(() => r() > 0.5);
  const wks = c.series.length;
  return {
    id: `BW-${new Date().getFullYear()}-${String(1041 + i)}`,
    state: c.state,
    iso: c.iso,
    country: c.name,
    region: c.region,
    pathogen: c.pathogen?.name,
    pathogenId: c.pathogenId,
    what: `${c.pathogen?.name} ${primary === 'env' ? 'environmental indicator' : primary === 'lab' ? 'laboratory confirmations' : 'reported cases'} exceeded the estimated seasonal baseline for ${c.consecutive} consecutive week${c.consecutive === 1 ? '' : 's'}.`,
    where: `${c.name} — national aggregate (sub-national resolution not available in this synthetic stream)`,
    when: (() => {
      /* consecutive may be 0 for a YELLOW state raised by a recent-window
         exceedance rather than a current one — clamp the index. */
      const firstIdx = Math.min(wks - 1, Math.max(0, wks - Math.max(1, c.consecutive)));
      return `Detected on the week ending ${c.series[wks - 1].date}; first exceedance in the current window ${c.series[firstIdx].date}`;
    })(),
    source: primary,
    sources: c.streams,
    observed: c.last.value,
    baseline: c.last.baseline,
    interval: [c.last.lo, c.last.hi],
    z: c.z,
    detector: 'Seasonal baseline (52-week harmonic) + 2σ exceedance with 2-week persistence rule',
    model: 'Statistical baseline only — no trained machine-learning model contributed to this signal',
    confidence: c.completeness > 0.8 ? 'Moderate' : 'Low',
    uncertainty: `Baseline estimated from ${wks} synthetic weeks; 95% interval ${c.last.lo}–${c.last.hi}. Reporting delay ≈ ${c.delayWeeks} weeks means the most recent point is likely to revise upward.`,
    concordance: concordant.length > 1
      ? `Deviation appears in ${concordant.length} of ${c.streams.length} configured streams`
      : 'Deviation appears in a single stream only — weak evidence',
    alternatives: (ALT_EXPLANATIONS[primary] || ALT_EXPLANATIONS.epi).slice(0, 3),
    recommended: c.state === 'RED'
      ? 'Escalate to a qualified epidemiologist for assessment within 24 h. Verify against the primary source before any external communication.'
      : c.state === 'ORANGE'
        ? 'Assign to an analyst for structured investigation. Check source data revisions and cross-stream concordance.'
        : 'Add to triage queue. Re-evaluate at the next data refresh before any action.',
    status: i === 0 ? 'Under review' : i < 3 ? 'Awaiting triage' : 'Awaiting triage',
    createdAt: fmtTs(new Date(Date.now() - (i + 1) * 5400000)),
  };
}

export function summarise(s) {
  const active = s.alerts.length;
  const byState = ['RED', 'ORANGE', 'YELLOW', 'GREEN'].map((k) => ({
    state: k, n: s.countries.filter((c) => c.state === k && c.availability !== 'none').length,
  }));
  return {
    monitored: s.countries.length,
    withData: s.countries.filter((c) => c.availability !== 'none').length,
    active,
    underReview: s.alerts.filter((a) => a.status === 'Under review').length,
    awaiting: s.alerts.filter((a) => a.status === 'Awaiting triage').length,
    byState,
    meanCompleteness: +(s.countries.reduce((a, c) => a + c.completeness, 0) / s.countries.length).toFixed(2),
    meanDelay: +(s.countries.reduce((a, c) => a + c.delayWeeks, 0) / s.countries.length).toFixed(1),
  };
}
