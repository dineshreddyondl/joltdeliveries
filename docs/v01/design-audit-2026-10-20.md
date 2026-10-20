# Design Audit — 2026-10-20 (Qwen-Max · visual pass)

**Method:** 8 section crops (1440w) judged by Qwen-Max (DashScope intl) against a 10-dimension rubric.
**Cost:** ≈ 6,700 tokens total (~prompt 600/call incl. image, ~220 completion/call).
**Scope:** design / UX / aesthetic only. Frozen decisions excluded by rubric.
**Caveat:** static crops — models cannot see hover/motion; findings about motion are from the motion-notes ground truth.

## Scores

| Section | hier | spac | typo | color | comp | motion | mobile | cta | trust | system | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|
| hero | 8 | 7 | 9 | 8 | 7 | 6 | **5** | 3 | 4 | 8 | 6.5 |
| metrics | 8 | 7 | 9 | 8 | 7 | 10 | 6 | 3 | 8 | 9 | 7.5 |
| why | 8 | 7 | 9 | 8 | 7 | 6 | 7 | 3 | 5 | 8 | 6.8 |
| gap | 7 | 8 | 9 | 8 | 7 | 6 | 7 | 1 | 5 | 8 | 6.6 |
| how | 8 | 7 | 9 | 8 | 7 | 6 | 7 | 3 | 5 | 8 | 6.8 |
| eco | 8 | 7 | 9 | 8 | 7 | 6 | **5** | 3 | 4 | 8 | 6.5 |
| cta | 8 | 7 | 9 | 8 | 7 | 10 | 6 | 8 | 7 | 9 | 7.9 |
| footer | 8 | 7 | 9 | 8 | 7 | 10 | 6 | 7 | 8 | 8 | 7.8 |

**Verdicts:** all 8 `tune` (none `keep`, none `redo`). Typography + color are the site's strongest suit (9/8 across the board); motion_fit, mobile_fit and cta are the weak legs.

## Findings (deduped + fact-checked)

### False positives — verified against the live site
| Claim | Check |
|---|---|
| "Metrics content overlaps at 390px" | FALSE — clean 2×2 grid, zero overflow |
| "Lane table auto-rolls, no pause on hover" | FALSE — hover pause implemented |
| "Flash+spot too abrupt" | FROZEN — founder chose the camera cut this session |
| "No CTA" (×5 sections) | ARTIFACT of section crops — CTAs live in nav + finale; conversion flows are a planned phase |

### Real signals — for your accept/reject
| # | Sev | Where | Finding | My take |
|---|---|---|---|---|
| 1 | P1 | eco | Auto-scroll feels too fast | agree — halve speed; one-line change |
| 2 | P1 | gap | Travelling cell glow distracting | agree — reduce to a soft pulse or remove |
| 3 | P1 | how | H3s not clearly subordinate to H2 | agree — bump H2 vs H3 delta |
| 4 | P1 | cta | Buttons too close; SLA link not distinct | check — likely one spacing + one underline fix |
| 5 | P1 | footer | Link groups vs CTA hierarchy flat | agree — subtle differentiation |
| 6 | P2 | why | Orange beam slightly too prominent | taste — 1-opacity dial |
| 7 | P2 | eco/gap/how | "lacks specific data" | partial — numbers live in metrics; consider carrying one proof point down-page |

### Weakest legs → Phase 2 escalation
- **mobile_fit:** hero 5, eco 5, cta 6 — these 3 get mobile crops (390px) judged next.
- **cta dimension:** hero 3, gap 1, why/how/eco 3 — mostly crop artifact, but the mid-page CTA gap is a real strategy question for the conversion phase.

## Proposed next steps
1. **Phase 2:** 3 mobile-crop calls (hero, eco, cta) ≈ 2,500 tokens — approve and I fire them.
2. **Apply P1 fixes 1–5** through the normal gate after your accept/reject.
3. Record decisions in `freeze-log.md`.
