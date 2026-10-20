/** Live-lanes data — single source shared by the hero table and the
 *  CTA routes modal. Placeholder values pending confirmed schedules. */
export interface Lane {
  lane: string;
  old: string;
  next: string;
  fast?: boolean;
}

export const LANES: Lane[] = [
  { lane: "Hyderabad → Delhi", old: "7 days", next: "3 days" },
  { lane: "Mumbai → Hyderabad", old: "3 days", next: "1 day" },
  { lane: "Mumbai → Delhi", old: "5 days", next: "2 days" },
  { lane: "Chennai → Mumbai", old: "5 days", next: "2 days" },
  { lane: "Bangalore → Trivandrum", old: "6 days", next: "2 days" },
  { lane: "Bangalore → Delhi", old: "7 days", next: "3 days" },
  { lane: "Hyderabad → Bangalore", old: "3 days", next: "24 hrs", fast: true },
  { lane: "Bangalore → Chennai", old: "2 days", next: "24 hrs", fast: true },
  { lane: "Coimbatore → Trivandrum", old: "5 days", next: "24 hrs", fast: true },
  { lane: "Hyderabad → Pune", old: "3 days", next: "24 hrs", fast: true },
];

/** Showcase lane (AGENTS.md): the one corridor where the gap is real. */
export const SHOWCASE_LANE: Lane = {
  lane: "Delhi → Mumbai",
  old: "4–5 days",
  next: "2 days",
};
