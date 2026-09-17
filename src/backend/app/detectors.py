"""
BIOWATCH-AI — statistical detection methods (server-side).

These mirror the browser implementations exactly in intent: classical,
transparent, baseline-first. No trained model is present in this module and
none is planned here — models belong in the experiment harness, where they
must be compared against these baselines on identical temporal splits.
"""
from __future__ import annotations

import math
from typing import Any

import numpy as np


def _rolling_stats(values: np.ndarray, i: int, window: int) -> tuple[float, float]:
    win = values[max(0, i - window):i]
    if win.size == 0:
        return float(values[i]), math.sqrt(max(1.0, float(values[i])))
    mu = float(win.mean())
    sd = float(win.std(ddof=1)) if win.size > 1 else math.sqrt(max(1.0, mu))
    if sd <= 0:
        sd = math.sqrt(max(1.0, mu))
    return mu, sd


def seasonal_baseline(values: list[float], k: float = 2.0, period: int = 52, **_: Any) -> dict[str, list]:
    """Same-period historical mean ± k·SD. Falls back to a trailing window."""
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    for i in range(v.size):
        hist = v[i % period:i:period] if i >= period else np.array([])
        pool = hist if hist.size >= 2 else v[max(0, i - 8):i]
        if pool.size == 0:
            flags.append(False); scores.append(0.0); expected.append(float(v[i])); continue
        mu = float(pool.mean())
        sd = float(pool.std(ddof=1)) if pool.size > 1 else math.sqrt(max(1.0, mu))
        sd = sd if sd > 0 else math.sqrt(max(1.0, mu))
        z = (float(v[i]) - mu) / sd
        flags.append(bool(i >= period and z >= k))
        scores.append(round(z, 3))
        expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def ewma(values: list[float], lam: float = 0.3, L: float = 3.0, window: int = 8, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    z_ewma: float | None = None
    for i in range(v.size):
        mu, sd = _rolling_stats(v, i, window)
        z_ewma = float(v[i]) if z_ewma is None else lam * float(v[i]) + (1 - lam) * z_ewma
        limit = mu + L * sd * math.sqrt(lam / (2 - lam))
        flags.append(bool(i > window and z_ewma > limit))
        scores.append(round((z_ewma - mu) / sd, 3))
        expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def cusum(values: list[float], k: float = 0.5, h: float = 4.0, window: int = 12, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    S = 0.0
    for i in range(v.size):
        mu, sd = _rolling_stats(v, i, window)
        z = (float(v[i]) - mu) / sd
        S = max(0.0, S + z - k)
        flag = bool(i > window and S > h)
        if flag:
            S = 0.0
        flags.append(flag); scores.append(round(S, 3)); expected.append(round(mu, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def robust_mad(values: list[float], k: float = 3.5, window: int = 26, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    flags, scores, expected = [], [], []
    for i in range(v.size):
        win = v[max(0, i - window):i]
        if win.size < 6:
            flags.append(False); scores.append(0.0); expected.append(float(v[i])); continue
        med = float(np.median(win))
        mad = float(np.median(np.abs(win - med))) or 1.0
        score = (float(v[i]) - med) / (1.4826 * mad)
        flags.append(bool(score >= k)); scores.append(round(score, 3)); expected.append(round(med, 2))
    return {"flags": flags, "scores": scores, "expected": expected}


def fixed_threshold(values: list[float], threshold: float | None = None, **_: Any) -> dict[str, list]:
    v = np.asarray(values, dtype=float)
    t = float(threshold) if threshold is not None else float(v.max() * 0.72)
    return {
        "flags": [bool(x > t) for x in v],
        "scores": [round(float(x) / t, 3) if t else 0.0 for x in v],
        "expected": [round(t, 2)] * v.size,
    }


DETECTOR_REGISTRY: dict[str, dict[str, Any]] = {
    "seasonal": {
        "fn": seasonal_baseline, "name": "Seasonal baseline (same-period mean + kσ)",
        "family": "Statistical baseline",
        "note": "Simplified relative to Farrington-type methods: no over-dispersion model, no trend term, no exclusion of past epidemic periods.",
    },
    "ewma": {
        "fn": ewma, "name": "EWMA control chart", "family": "Time series",
        "note": "Sensitive to small persistent shifts; assumes approximately stationary residuals, which surveillance data violate.",
    },
    "cusum": {
        "fn": cusum, "name": "CUSUM", "family": "Time series",
        "note": "Accumulates evidence for sustained shifts; signalling time depends strongly on the reset policy.",
    },
    "mad": {
        "fn": robust_mad, "name": "Robust MAD rule", "family": "Anomaly detection",
        "note": "Resistant to contamination of the training window by previous epidemics.",
    },
    "threshold": {
        "fn": fixed_threshold, "name": "Fixed threshold", "family": "Threshold",
        "note": "Included because it is frequently the incumbent in practice; any method must beat it.",
    },
}


def run_detector(detector_id: str, values: list[float], **kwargs: Any) -> dict[str, list]:
    return DETECTOR_REGISTRY[detector_id]["fn"](values, **kwargs)
