/* ============================================================================
   METRICS DATA — outcome strip (Brief 01)
   Copy is frozen per docs/briefs/01-metrics-band-brief.md "Final copy".
   Card 2 ships in the DEFAULT variant. The AUDITED (Option A) variant is
   founder-gated: it renders ONLY when every PLACEHOLDER field below is
   supplied — never render an invented percentage (AGENTS.md release blocker).
   ========================================================================== */

/* ---------------------------------------------------------------------------
 * PLACEHOLDER — founder-supplied data (TODO).
 *
 * 1. slaAdherencePercent — audited % (rolling 90-day, all live lanes) PLUS
 *    methodology ("% of shipments arriving within the committed window")
 *    PLUS window ("last 90 days, all live lanes") PLUS a money-back/credit
 *    remedy. ALL of these unlock Option A. Do NOT publish Option A with
 *    only the % — the bare, unaudited SLA-adherence percentage is a banned
 *    claim (AGENTS.md guardrail table).
 *
 * 2. liveMetricBase — real ops figure + refresh rate, if the LIVE number
 *    itself should reflect ops data. Today only the timestamp ticks; the
 *    % stays static until this is wired.
 *
 * 3. perShipmentCO2Kg — founder confirmation of ≈8.2 kg CO₂e per 200 kg
 *    shipment HYD–BLR before any per-shipment claim goes beyond the footnote.
 * --------------------------------------------------------------------------- */

export interface MetricsData {
  sla: {
    /** TODO(founder) 1 — audited % (rolling 90-day, all live lanes). */
    adherencePercent: number | null;
    /** TODO(founder) 1 — e.g. "% of shipments arriving within the committed window". */
    methodology: string;
    /** TODO(founder) 1 — e.g. "last 90 days, all live lanes". */
    window: string;
    /** TODO(founder) 1 — money-back / credit remedy on missed windows. */
    remedy: string;
  };
  live: {
    /** TODO(founder) 2 — real ops figure backing the LIVE number. */
    metricBase: number | null;
    /** TODO(founder) 2 — refresh rate (seconds) if the LIVE number ticks. */
    refreshSeconds: number | null;
  };
  co2: {
    /** TODO(founder) 3 — ≈8.2 kg CO₂e per 200 kg shipment HYD–BLR confirmation. */
    perShipmentKg: number | null;
  };
}

export const METRICS: MetricsData = {
  sla: {
    adherencePercent: null,
    methodology: "",
    window: "",
    remedy: "",
  },
  live: {
    metricBase: null,
    refreshSeconds: null,
  },
  co2: {
    perShipmentKg: null,
  },
};

/** Option A unlocks only when every audited field is supplied. */
export function isAuditedOptionAUnlocked(m: MetricsData = METRICS): boolean {
  return (
    m.sla.adherencePercent !== null &&
    m.sla.methodology !== "" &&
    m.sla.window !== "" &&
    m.sla.remedy !== ""
  );
}

/* ---------- Card 2 — DEFAULT (ships today) ---------- */
export const RELIABLE_DEFAULT = {
  number: 100,
  unit: "%",
  leadIn: "SLA-backed lanes",
  rest: "every booking ships with a printed arrival-window commitment",
  srOnly:
    "100 percent SLA-backed lanes — every booking ships with a printed arrival-window commitment",
} as const;

/* ---------- Card 2 — Option A (founder-gated) ---------- */
export const RELIABLE_AUDITED = {
  unit: "%",
  leadIn: "SLA adherence",
  rest: "across all live lanes — within committed window, last 90 days",
  srOnly:
    "SLA adherence — across all live lanes, within the committed window, last 90 days",
  footnote:
    "Definition: % of shipments arriving within the committed window, last 90 days, all live lanes. Money-back remedy on missed windows.",
} as const;

/* ---------- Footnotes (cards 3 and 4) ---------- */
export const FOOTNOTES = {
  co2: "NITI Aayog, “Fast Tracking Freight in India” (2021): rail 11.5 vs road 101 g CO₂/tonne-km (~89% less). Smart Freight Centre India Default GHG Values (2025): 81–87% lower vs road HDT classes, WTW basis. ≈ 8 kg CO₂e avoided per 200 kg shipment HYD–BLR.",
  capital:
    "Where rail transit cuts road transit 3× or more (e.g. HYD–BLR); applies to in-transit working capital, not total inventory.",
} as const;
