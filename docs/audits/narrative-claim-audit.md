# Narrative Claim Audit — Why Now / The Unfilled Gap / The Orchestration Layer

> Produced by Specialist A (read-only audit, 2026-10-18). Scope: `frozen design/jolt-landing-v5.html` lines 772–846. Sources: AGENTS.md guardrail table, uplift-spec §0 + §5, research 05 + 06, next-version-plan rows 5/6/7. **Feeds Brief 05 (Why Now + Gap) and Brief 06 (How It Works).** All recommended replacements use existing guardrail/spec wording; no new claims, names, or numbers beyond the prescribed footnotes.

## 1. Verdict table

| Frozen copy (verbatim) | Verdict | Reason | Recommended replacement |
|---|---|---|---|
| H2: "Your customers won't wait 10 days for anything anymore." | REWORD | "10 days" is an invented threshold — no source in research 05:§7/§8. Never invent metrics. | "Your customers won't wait for anything anymore." |
| Lede: "Heavy commerce moved online, but logistics didn't. To scale today, you need a network built for modern speed—not legacy hub-and-spoke delays." | PASS | Narrative; consistent with research 05:§7/§8. | (keep) |
| Label "The Expectation Gap" | PASS | Label. | (keep) |
| "Quick-commerce killed consumer patience." | REWORD | uplift §0 #8 = soften: spec prescribes "reset expectations". | "Quick commerce reset delivery expectations across Indian commerce." |
| "Buyers now expect parcel-speed for 200kg payloads." | PASS | §0 #7 = PASS as narrative (Datum/PwC/Bain). | (keep) |
| "Traditional freight is physically incapable of delivering it." | REWORD | Contradicted by research 05:§5 (road FTL ~24h on short lanes); slowness is the LTL/consolidation model. | "Traditional freight was built around consolidation, not speed." |
| Label "The Working Capital Trap" | PASS | Label. | (keep) |
| "Long transit times are a cash trap for your distributors." | PASS | Consistent with §0 #6 (in-transit capital). | (keep) |
| "Inventory sitting on a truck for 8 days is dead capital." | REWORD | Invented "8 days" — no frozen lane exceeds 7 days. | "Every day in transit is dead capital." |
| "Cut transit to 2 days, and they rotate cash 3x faster." | REWORD | AGENTS guardrail row + §0 #6: unhedged 3× math. | "Up to 3x faster rotation of in-transit working capital on our longest lanes.†" |
| Label "The Tech Unlock" | PASS | Label. | (keep) |
| "The capacity always existed on the Indian rail network—the fastest, cleanest way to move weight." | REWORD | "Fastest" unscoped superlative contested; "cleanest" is supported (§0 #2). | "The capacity always existed on the Indian rail network — the cleanest way to move weight across India." |
| "But it was a black box." | PASS | Research 06 (ROQIT manual booking; CAG transparency findings). | (keep) |
| "We built the orchestration tech to stitch it end-to-end and back it with a guaranteed SLA." | PASS (conditional) | Publishable only with SLA-page definition + methodology + money-back remedy (§0 #3). | (keep; ship only together with SLA page) |
| "Until JOLT." | PASS | Brand line. | (keep) |
| H2: "You never had a choice. You were forced to use networks that were never built for you." | PASS | Rhetorical; supported by research 06 Gap analysis. | (keep) |
| "A purpose-built heavy express didn't exist." | REWORD | Re-asserts "first"-ness after the hero dropped it (§0 #1; SCR/Amazon precedents). | "Heavy B2B never got a network built for it." |
| "You've just been surviving on workarounds—hacking logistics models designed for entirely different categories." | PASS | Narrative. | (keep) |
| Badge "Workaround 01" + "Stretching the Courier Network" | PASS | Labels. | (keep) |
| "…delays are masked by fake delivery attempts…" | REWORD | Unsupported allegation against a real industry. | "…delays hide behind optimistic tracking…" |
| Tagline "A model built for 2kg parcels" | REWORD | Unsourced number. | "A model built for small parcels" |
| Badge "Workaround 02" + "Settling for Traditional Transport" | PASS | Bridge to the corrected "LTL / Part-Load" baseline. | (keep) |
| LTL card body ("…sit idle in hub yards for days… you save money, but lose a week.") | PASS | research 05:§5 (LTL adds 1–3 days); "a week" matches frozen lanes-table worst case (7 days). | (keep) |
| Tagline "A model built for bulk consolidation" | PASS | No claim. | (keep) |
| Pull-quote: "The system isn't broken. It just wasn't built for you." | PASS | Brand voice. | (keep) |
| H2: "…unlock India's fastest network." | REWORD | Unscoped superlative. | "…unlock the fastest mid-mile network in India." |
| "Marketplaces match supply and demand, then wash their hands of the SLA. We don't." | PASS | Positioning. | (keep) |
| "Indian rail has always been the fastest way to move weight, but it was an analog black box." | REWORD | Same superlative; "black box" duplicates Why Now item 03. | "Indian rail was always the cleanest way to move weight. It was just an analog black box." |
| "We built the tech to run it end-to-end, and we take full accountability for the delivery." | PASS | §5.4 — the reliability layer is the differentiator. | (keep) |
| Labels "01 / NTO" etc. + "Aviation has Next Flight Out…" | PASS | NTO story real and precedented (§5.1). | (keep) |
| "Your payload doesn't wait for a truck to fill up." | PASS | LTL contrast (research 05:§5). | (keep) |
| "High-capacity rail bypasses highway tolls, borders, and traffic … slashing carbon emissions by 80%." | REWORD | "borders" factually wrong (domestic lanes); 80% must sync to hero's corrected figure. | "High-capacity rail bypasses highway tolls and traffic to deliver non-stop linehaul — up to 89% less CO₂ per tonne-km vs road.†" |
| "02 / HUBLESS" labels + "From first-mile pickup to final-mile delivery." | PASS | Labels. | (keep) |
| "No consolidation yards. No waiting in truck hubs." | REWORD | Contradicts operating model: leased SLR/VP capacity IS a 4-tonne/23-tonne consolidation unit (research 06:Leasing). | "No multi-day consolidation waits. No waiting in truck hubs." |
| "We pick up your payload, load it directly onto the rail linehaul…" | PASS | Legitimate and precedented (uplift §5.3). | (keep) |
| "One seamless motion. Zero mid-journey sorting delays." | PASS | No intermediate unloading (research 06). | (keep) |
| "03 / VISIBILITY" + "Real-time tracking across every milestone." + "Rail used to be a blind spot." | PASS | The layer JOLT adds (§5.4); ROQIT/CAG. | (keep) |
| "…proactive alerts and absolute visibility, allowing us to guarantee the SLA." | PASS (conditional) | §0 #3 condition — ship only with SLA page. | (keep; ship only together with SLA page) |

**Counts: PASS 24 · REWORD 9 · REMOVE 0.**

## 2. Banned wording found

- "Quick-commerce killed consumer patience" (line 782) → REWORD per §0 #8.
- Unhedged "3x faster" (line 787) → guardrail replacement + footnote.
- "slashing carbon emissions by 80%" (line 840) → sync to hero + footnote.
- DFC references: **none** (grep). Vande Bharat parcel as live: **none**. Do not introduce.
- Extra: "borders" (line 840) wrong for domestic lanes; "8 days"/"10 days" unsourced (and "8 days" contradicts the 7-day-max lanes table).

Hero-adjacent banned wording (owned by other briefs, listed for the release gate): H1 "first express layer" (646), pillar "80% less carbon" (651), lanes header "Traditional Logistics" (656), metrics "80% Lower emissions" (754–755), bare "99.2% SLA adherence" (759), "1.4T CO₂ saved per lane" (763), footer tagline "first express layer" (905).

## 3. Narrative continuity vs corrected hero

1. Carbon: NTO "80%" must sync to "up to 89% less CO₂ per tonne-km†" (hard mid-page contradiction otherwise).
2. LTL baseline: "physically incapable" re-broadens the scoped "LTL / Part-Load" label — use the consolidation framing.
3. Numbers drift: "8 days" matches no lane; re-anchor to "our longest lanes" + guardrail 3× wording.
4. De-"first"-ing leak: "didn't exist" in Gap lede re-asserts firstness — use "never got a network built for it".
5. Superlative duplication: "fastest way to move weight" ×2 + "India's fastest network" — keep only "cleanest" (§0 #2) and scoped "fastest mid-mile".
6. SLA chain: "guaranteed SLA" → "guarantee the SLA" → "shipment is free" publishable only with the SLA page (definition + methodology + remedy).
7. Housekeeping: drop "borders"; drop "fake delivery attempts" and "2kg parcels".
