"""
BIOWATCH-AI — research backend (FastAPI)
========================================

Scope of this service in the prototype:

*   It exposes the SAME statistical detectors that the frontend runs
    client-side, so that a researcher can execute them on real data
    server-side with pandas/numpy.
*   It exposes the connector registry as data, so the registry has one
    definition rather than two.
*   It exposes NO trained model, NO fabricated metric and NO live data.

Hard rules enforced here, mirroring the frontend:

*   An endpoint never returns a performance metric for a model that has
    not been trained. It returns ``"Awaiting experiment"``.
*   An endpoint never returns synthetic values labelled as live.
*   ``/api/health`` reports what actually exists, including the fact
    that the database and scheduler are not deployed.

Run:  uvicorn app.main:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .connectors import CONNECTORS
from .detectors import DETECTOR_REGISTRY, run_detector
from .synth import synth_series

VERSION = "0.4.0-prototype"

DISCLAIMER = (
    "BIOWATCH-AI research prototype. Not a clinical diagnostic and not an "
    "operational public-health system. No validated model performance is "
    "reported by this API. Alert states are interface states, not "
    "public-health decisions."
)

app = FastAPI(
    title="BIOWATCH-AI research API",
    version=VERSION,
    description=DISCLAIMER,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # prototype only; restrict in any deployment
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


# --------------------------------------------------------------------------
# Health / meta
# --------------------------------------------------------------------------
@app.get("/api/health")
def health() -> dict[str, Any]:
    """Honest component status. Nothing that is not deployed reports green."""
    return {
        "service": "biowatch-api",
        "version": VERSION,
        "status": "operational",
        "checked_at": _now(),
        "components": {
            "api": "operational",
            "detectors": "operational (statistical only)",
            "database": "not deployed",
            "ingestion_scheduler": "not deployed",
            "model_registry": "empty — no model artefacts exist",
            "notification_service": "disabled by design",
        },
        "data_state": "NO LIVE SOURCE CONFIGURED",
        "models_trained": 0,
        "disclaimer": DISCLAIMER,
    }


@app.get("/api/meta/evidence")
def evidence_vocabulary() -> dict[str, Any]:
    """The epistemic tags every response and every UI element must use."""
    return {
        "tags": {
            "ESTABLISHED": "Supported by peer-reviewed literature or an authoritative cited source.",
            "ASSUMPTION": "A design or modelling premise, explicitly not verified.",
            "HYPOTHESIS": "A testable proposition with no supporting result yet.",
            "PRELIMINARY": "Early, non-validated observation. Not citable.",
            "PREDICTION": "Model output about unobserved values. Not a biological confirmation.",
            "PLAN": "Intended future work; nothing executed.",
            "SIMULATED": "Synthetic values for interface demonstration only.",
        },
        "permitted_signal_language": [
            "Signal detected", "Unusual activity", "Elevated reporting",
            "Potential anomaly detected", "Requires investigation",
            "Model-generated alert", "Prediction — not biological confirmation",
        ],
        "prohibited_language": [
            "Outbreak confirmed", "Epidemic detected", "Diagnosis",
            "Guaranteed prediction", "Validated accuracy",
        ],
    }


# --------------------------------------------------------------------------
# Connectors
# --------------------------------------------------------------------------
@app.get("/api/connectors")
def list_connectors() -> dict[str, Any]:
    return {
        "count": len(CONNECTORS),
        "configured": 0,
        "note": (
            "No connector is configured. Unconfigured sources are reported as "
            "such and are never substituted with synthetic values."
        ),
        "connectors": CONNECTORS,
    }


@app.get("/api/connectors/{connector_id}")
def get_connector(connector_id: str) -> dict[str, Any]:
    for c in CONNECTORS:
        if c["id"] == connector_id:
            return c
    raise HTTPException(status_code=404, detail="Connector not defined")


@app.post("/api/connectors/{connector_id}/test")
def test_connector(connector_id: str) -> dict[str, Any]:
    """
    Deliberately does NOT contact the upstream source.

    A prototype has no entitlement to send traffic to a public agency, and a
    'successful' test would imply an access and licence position the project
    does not hold.
    """
    for c in CONNECTORS:
        if c["id"] == connector_id:
            return {
                "connector": connector_id,
                "outcome": "NOT ATTEMPTED",
                "at": _now(),
                "detail": (
                    "No request was issued. Enabling this connector requires a "
                    "recorded licence review, credential provisioning in the "
                    "server-side secret store, and a scheduler deployment."
                ),
                "license": c["license"],
            }
    raise HTTPException(status_code=404, detail="Connector not defined")


# --------------------------------------------------------------------------
# Detection
# --------------------------------------------------------------------------
class DetectRequest(BaseModel):
    values: list[float] = Field(..., description="Observed counts, time-ordered, one per period.")
    dates: list[str] | None = Field(None, description="Optional ISO dates aligned to values.")
    detector: str = Field("seasonal", description=f"One of: {', '.join(DETECTOR_REGISTRY)}")
    k: float = Field(2.0, description="Exceedance multiplier where applicable.")
    period: int = Field(52, description="Seasonal period in observations (52 for weekly data).")


@app.get("/api/detectors")
def detectors() -> dict[str, Any]:
    return {
        "implemented": [
            {"id": k, "name": v["name"], "family": v["family"], "note": v["note"]}
            for k, v in DETECTOR_REGISTRY.items()
        ],
        "not_implemented": [
            {"id": "farrington", "reason": "Quasi-Poisson GLM with epidemic-period exclusion not yet written."},
            {"id": "isolation_forest", "reason": "Requires a feature matrix and a contamination-rate decision."},
            {"id": "random_forest", "reason": "Requires a curated reference label set that does not exist."},
            {"id": "gradient_boosting", "reason": "Same labelling prerequisite as random_forest."},
            {"id": "lstm", "reason": "Later stage only; unjustified before a baseline comparison exists."},
        ],
        "performance_metrics": "Awaiting experiment — no reference label set exists.",
    }


@app.post("/api/detect")
def detect(req: DetectRequest) -> dict[str, Any]:
    if req.detector not in DETECTOR_REGISTRY:
        raise HTTPException(status_code=400, detail=f"Unknown detector '{req.detector}'")
    if len(req.values) < 10:
        raise HTTPException(status_code=400, detail="At least 10 observations are required.")

    result = run_detector(req.detector, req.values, k=req.k, period=req.period)
    return {
        "detector": req.detector,
        "name": DETECTOR_REGISTRY[req.detector]["name"],
        "evidence_tag": "PRELIMINARY",
        "n_observations": len(req.values),
        "flags": result["flags"],
        "scores": result["scores"],
        "expected": result["expected"],
        "n_flagged": int(sum(result["flags"])),
        "alarm_rate": round(sum(result["flags"]) / len(req.values), 4),
        "performance": "Awaiting experiment",
        "interpretation_note": (
            "A flag indicates a statistical deviation from the estimated baseline. "
            "It is not an outbreak, not a diagnosis and not a validated detection. "
            "Correlation does not establish biological causation."
        ),
        "computed_at": _now(),
    }


# --------------------------------------------------------------------------
# Synthetic demonstration data (explicitly labelled)
# --------------------------------------------------------------------------
@app.get("/api/demo/series")
def demo_series(key: str = "demo", weeks: int = 104, level: float = 120.0) -> dict[str, Any]:
    """Deterministic synthetic series for interface demonstration."""
    series = synth_series(key, weeks=weeks, level=level)
    return {
        "evidence_tag": "SIMULATED",
        "banner": "SIMULATED DATA — FOR PROTOTYPE DEMONSTRATION ONLY",
        "provenance": "Deterministic seeded generator. Encodes no real-world surveillance information.",
        "series": series,
    }


@app.get("/api/models")
def models() -> dict[str, Any]:
    """The model registry is empty. This endpoint says so."""
    return {
        "trained_models": [],
        "count": 0,
        "note": (
            "No model has been trained. Any endpoint that would return accuracy, "
            "precision, recall, AUROC, outbreak probability or lead time returns "
            "'Awaiting experiment' instead of a number."
        ),
        "metrics": "Awaiting experiment",
    }
