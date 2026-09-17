"""
Deterministic synthetic series generator (server-side mirror of the browser
engine). EVERY value produced here is SIMULATED and must be presented with
the SIMULATED tag. It encodes no real-world surveillance information.
"""
from __future__ import annotations

import math
from datetime import date, timedelta
from typing import Any


def _seed(text: str) -> int:
    h = 1779033703 ^ len(text)
    for ch in text:
        h = (h ^ ord(ch)) * 3432918353 % (2 ** 32)
        h = ((h << 13) | (h >> 19)) % (2 ** 32)
    return h % (2 ** 32)


class _Rng:
    def __init__(self, seed: int) -> None:
        self.a = seed

    def next(self) -> float:
        self.a = (self.a + 0x6D2B79F5) % (2 ** 32)
        t = self.a
        t = (t ^ (t >> 15)) * (1 | t) % (2 ** 32)
        t = (t + ((t ^ (t >> 7)) * (61 | t)) % (2 ** 32)) ^ t
        return ((t ^ (t >> 14)) % (2 ** 32)) / 2 ** 32


def synth_series(
    key: str, weeks: int = 104, level: float = 120.0, season: float = 0.45,
    disp: float = 0.18, end: date | None = None,
) -> list[dict[str, Any]]:
    rng = _Rng(_seed(key))
    end = end or date(2026, 8, 17)
    out: list[dict[str, Any]] = []
    for i in range(weeks):
        d = end - timedelta(days=7 * (weeks - 1 - i))
        woy = i % 52
        s = 1 + season * math.sin((2 * math.pi * woy) / 52 - math.pi / 3)
        mu = level * s
        noise = 1 + disp * (rng.next() - 0.5) * 2
        value = max(0, round(mu * noise))
        base = round(mu)
        sd = max(1.5, math.sqrt(max(1, base)) * 1.35 + base * disp * 0.55)
        out.append({
            "date": d.isoformat(), "value": value, "baseline": base,
            "lo": max(0, round(base - 1.96 * sd)), "hi": round(base + 1.96 * sd),
            "z": round((value - base) / sd, 2),
            "evidence_tag": "SIMULATED",
        })
    return out
