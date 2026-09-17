/* ============================================================
   BIOWATCH-AI — DETECTION METHODS
   ------------------------------------------------------------
   These functions are ACTUALLY IMPLEMENTED and run in the
   browser on whatever series they are given (synthetic in
   DEMONSTRATION mode). They are classical statistical detectors,
   deliberately implemented FIRST so that any machine-learning
   method has a mandatory comparator.

   Nothing here is a trained model. Nothing here has been
   validated against real outbreak labels.
   ============================================================ */

/** Simple fixed threshold on the raw value. */
export function detectThreshold(series, { threshold }) {
  const t = threshold ?? Math.round(Math.max(...series.map((p) => p.value)) * 0.72);
  return {
    id: 'threshold',
    name: 'Fixed threshold',
    implemented: true,
    params: { threshold: t },
    flags: series.map((p) => ({ date: p.date, flag: p.value > t, score: p.value / t })),
    note: 'Crudest possible rule. Included because it is frequently the incumbent in practice and any method must beat it.',
  };
}

/** Seasonal baseline: harmonic-free variant using same-week historical mean ± k·SD. */
export function detectSeasonalZ(series, { k = 2, minHistory = 52 } = {}) {
  const flags = series.map((p, i) => {
    if (i < minHistory) return { date: p.date, flag: false, score: 0, insufficient: true };
    const hist = series.slice(0, i).filter((q) => q.week === p.week).map((q) => q.value);
    const pool = hist.length >= 2 ? hist : series.slice(Math.max(0, i - 8), i).map((q) => q.value);
    const mu = pool.reduce((a, b) => a + b, 0) / pool.length;
    const sd = Math.sqrt(pool.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, pool.length - 1)) || Math.sqrt(Math.max(1, mu));
    const z = (p.value - mu) / (sd || 1);
    return { date: p.date, flag: z >= k, score: +z.toFixed(2), expected: Math.round(mu), sd: +sd.toFixed(1) };
  });
  return {
    id: 'seasonal', name: `Seasonal baseline (same-week mean + ${k}σ)`, implemented: true,
    params: { k, minHistory }, flags,
    note: 'Comparable in spirit to CDC EARS-family and Farrington-style approaches, but simplified: no over-dispersion model, no trend term, no exclusion of past epidemic periods.',
  };
}

/** EWMA control chart on residuals from a rolling mean. */
export function detectEWMA(series, { lambda = 0.3, L = 3, window = 8 } = {}) {
  let ewma = null;
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    const mu = win.length ? win.reduce((a, b) => a + b, 0) / win.length : p.value;
    const sd = win.length > 1
      ? Math.sqrt(win.reduce((a, b) => a + (b - mu) ** 2, 0) / (win.length - 1)) || Math.sqrt(Math.max(1, mu))
      : Math.sqrt(Math.max(1, mu));
    ewma = ewma === null ? p.value : lambda * p.value + (1 - lambda) * ewma;
    const limit = mu + L * sd * Math.sqrt(lambda / (2 - lambda));
    return { date: p.date, flag: i > window && ewma > limit, score: +((ewma - mu) / (sd || 1)).toFixed(2), expected: Math.round(mu) };
  });
  return {
    id: 'ewma', name: `EWMA control chart (λ=${lambda}, L=${L})`, implemented: true,
    params: { lambda, L, window }, flags,
    note: 'Sensitive to small persistent shifts; weak against sharp single-week spikes. Assumes approximately stationary residuals, which surveillance data violate.',
  };
}

/** One-sided CUSUM on standardised residuals. */
export function detectCUSUM(series, { k = 0.5, h = 4, window = 12 } = {}) {
  let S = 0;
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    const mu = win.length ? win.reduce((a, b) => a + b, 0) / win.length : p.value;
    const sd = win.length > 1
      ? Math.sqrt(win.reduce((a, b) => a + (b - mu) ** 2, 0) / (win.length - 1)) || Math.sqrt(Math.max(1, mu))
      : Math.sqrt(Math.max(1, mu));
    const z = (p.value - mu) / (sd || 1);
    S = Math.max(0, S + z - k);
    const flag = i > window && S > h;
    if (flag) S = 0; // reset after signalling
    return { date: p.date, flag, score: +S.toFixed(2), expected: Math.round(mu) };
  });
  return {
    id: 'cusum', name: `CUSUM (k=${k}, h=${h})`, implemented: true,
    params: { k, h, window }, flags,
    note: 'Accumulates evidence; good at detecting sustained gradual shifts, but signalling time depends strongly on the reset policy.',
  };
}

/** Robust MAD-based outlier rule on week-over-week differences. */
export function detectMAD(series, { k = 3.5, window = 26 } = {}) {
  const flags = series.map((p, i) => {
    const win = series.slice(Math.max(0, i - window), i).map((q) => q.value);
    if (win.length < 6) return { date: p.date, flag: false, score: 0, insufficient: true };
    const sorted = [...win].sort((a, b) => a - b);
    const med = sorted[Math.floor(sorted.length / 2)];
    const devs = win.map((v) => Math.abs(v - med)).sort((a, b) => a - b);
    const mad = devs[Math.floor(devs.length / 2)] || 1;
    const score = (p.value - med) / (1.4826 * mad);
    return { date: p.date, flag: score >= k, score: +score.toFixed(2), expected: med };
  });
  return {
    id: 'mad', name: `Robust MAD rule (k=${k})`, implemented: true,
    params: { k, window }, flags,
    note: 'Resistant to contamination by previous outbreaks in the training window — a common failure mode of mean/SD baselines.',
  };
}

/** Registry including methods that are explicitly NOT implemented. */
export const DETECTORS = [
  { id: 'threshold', label: 'Fixed threshold', family: 'Threshold', run: detectThreshold, implemented: true },
  { id: 'seasonal', label: 'Seasonal baseline + kσ', family: 'Statistical baseline', run: detectSeasonalZ, implemented: true },
  { id: 'ewma', label: 'EWMA control chart', family: 'Time series', run: detectEWMA, implemented: true },
  { id: 'cusum', label: 'CUSUM', family: 'Time series', run: detectCUSUM, implemented: true },
  { id: 'mad', label: 'Robust MAD', family: 'Anomaly detection', run: detectMAD, implemented: true },
  { id: 'farrington', label: 'Farrington-type quasi-Poisson regression', family: 'Statistical baseline', implemented: false,
    plan: 'Requires an over-dispersed GLM with trend and seasonality terms and exclusion of historical epidemic periods. Planned as the primary statistical comparator.' },
  { id: 'iforest', label: 'Isolation Forest', family: 'Classical ML (unsupervised)', implemented: false,
    plan: 'Requires a feature matrix and a decision on contamination rate; unsupervised scores are not directly comparable to a calibrated alarm rate.' },
  { id: 'rf', label: 'Random Forest classifier', family: 'Classical ML (supervised)', implemented: false,
    plan: 'Requires labelled reference periods. Label definition must be fixed and documented before fitting to prevent leakage.' },
  { id: 'gbm', label: 'Gradient boosting (XGBoost/LightGBM)', family: 'Classical ML (supervised)', implemented: false,
    plan: 'Same labelling prerequisite as Random Forest. Expected to overfit small surveillance datasets without strong regularisation.' },
  { id: 'sarima', label: 'SARIMA / state-space forecast residuals', family: 'Time series', implemented: false,
    plan: 'Forecast-residual detection with prediction intervals; needs stationarity handling and order selection protocol.' },
  { id: 'lstm', label: 'Sequence model (LSTM / TCN)', family: 'Deep learning', implemented: false,
    plan: 'Later-stage only. Cannot be justified before a statistical baseline comparison exists; data volume in most surveillance series is far below the regime where deep models help.' },
];

/** Agreement matrix between detector outputs (not a validation metric). */
export function detectorAgreement(results) {
  const ids = results.map((r) => r.id);
  const m = {};
  ids.forEach((a) => {
    m[a] = {};
    ids.forEach((b) => {
      const ra = results.find((r) => r.id === a).flags;
      const rb = results.find((r) => r.id === b).flags;
      const n = Math.min(ra.length, rb.length);
      let agree = 0, both = 0, either = 0;
      for (let i = 0; i < n; i++) {
        if (ra[i].flag === rb[i].flag) agree++;
        if (ra[i].flag && rb[i].flag) both++;
        if (ra[i].flag || rb[i].flag) either++;
      }
      m[a][b] = { agreement: +(agree / n).toFixed(3), jaccard: either ? +(both / either).toFixed(3) : null };
    });
  });
  return m;
}
