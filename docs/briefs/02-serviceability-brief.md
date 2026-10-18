# Brief 02 — Serviceability Checker

## Goal

Replace the dead "Check serviceability" nav CTA (frozen v5 wires every CTA to the fake quirk terminal) with a real, ungated pincode serviceability checker: 2 pincodes + weight → one of 6 states (LOADING / SERVED / PARTIAL / NOT-SERVED / INVALID / ERROR), backed by the existing `/api/serviceability` route in mock mode. SERVED shows transit + EDD + indicative rate with real disclaimers; PARTIAL/NOT-SERVED terminate in real lead capture — a WhatsApp deep link that works today, plus a pilot-form link that Brief 03 wires.

## Read first (ordered)

1. `AGENTS.md` — claim guardrails table, conversion machinery, stack, a11y conventions
2. `docs/uplift-spec.md` — §4 conversion spec (6-state checker, ungated = our differentiator vs Delhivery's login gate); §2 whitespace #1 ("instant honest quotes" is category-leading)
3. `docs/research/04-conversion-lead-capture.md` — checker state-machine spec, ClickPost/Delhivery copy patterns, WhatsApp deep-link template (V-Trans verbatim)
4. `app/api/serviceability/route.ts` — current mock (shape insufficient; exact change under "API changes needed")
5. `lib/validation.ts` — `serviceabilitySchema` (reused unchanged)
6. `app/page.tsx` — nav to rewire
7. `frozen design/jolt-landing-v5.html` — nav CTAs (lines 634–637) and quirk-modal chrome (lines 1153–1200) for the overlay visual language

## Spec

**Component type: modal dialog** (not a section). The trigger lives in the nav; a page section would break rhythm, and the frozen design already establishes the overlay pattern via the quirk modal. Inherit the quirk modal's chrome (dark panel, traffic-light dots, mono URL bar, hairline border, orange accent) but **not** its typewriter-joke behavior — AGENTS.md reserves the quirk terminal for the notify-me waitlist only. No typewriter, no joke lines, no fake success chatter.

**Files:**
- `components/serviceability/serviceability-checker.tsx` (`'use client'`) — exports `ServiceabilityChecker`: one client island containing the nav trigger button, the dialog, the form, and the full state machine.
- Edit `app/page.tsx` — add `<ServiceabilityChecker />` to the nav next to "Start a Pilot". page.tsx stays a server component.
- Edit `app/api/serviceability/route.ts` — mock branch only (see API changes needed).

**State machine (client):**
1. **IDLE (form)** — 3 required fields: Pickup pincode, Delivery pincode (each `inputMode="numeric"`, `maxLength={6}`, auto-format "110 001" on blur), Shipment weight kg (`min=20 max=1000`, placeholder "e.g. 200"). Submit: "Check serviceability →". Helper: "Don't know the pincode? Find it on India Post." (external link). react-hook-form + `zodResolver(serviceabilitySchema)`; zod errors render in INVALID state — the API is never called with invalid input.
2. **LOADING** — form swaps to a mono status line + two skeleton rows. Enforce ≥400 ms visibility (`Promise.all([fetch(...), delay(400)])`) so the state reads.
3. **SERVED** — green status chip; mono terminal-echo lane line; transit, EDD, rate band (from `rateBandInr`); both disclaimers; WhatsApp CTA with pre-filled lane text. Weight > 500 kg → freight-desk variant instead of rate band.
4. **PARTIAL** — amber chip; copy names the specific non-served pincode using `originServed`/`destServed` from the response.
5. **NOT-SERVED** — muted chip; plain Delhivery-style line + expansion promise; same two CTAs as PARTIAL.
6. **INVALID** — client-side only: banner + per-field zod messages under each input.
7. **ERROR** — non-2xx, non-JSON, or network failure: "Try again" re-submits with inputs preserved + WhatsApp fallback link.

State changes are announced through a visually hidden `aria-live="polite"` region.

**API contract (request unchanged):**
`POST /api/serviceability` → `{ "originPin": "500001", "destPin": "110001", "weightKg": 200 }`

**200 response (new mock shape — see API changes needed):**
```json
{
  "ok": true, "mock": true,
  "status": "served" | "partial" | "not-served",
  "originPin": "500001", "destPin": "110001",
  "originServed": true, "destServed": true,
  "eta": "24–48h" | null,
  "tatHours": 26 | null,
  "ratePerKgInr": 9 | null,
  "rateBandInr": [1800, 2300] | null
}
```
Client renders only what the response contains — no client-side fabrication of status/rates/coverage. Legacy tolerance: if `status` is absent but a `serviceable` boolean exists (real backend), map `true → served`, `false → not-served`.

## Final copy

All strings verbatim. Mono labels in JetBrains Mono, uppercase with wide tracking. Dialog chrome: URL bar `jolt.ondl.in/serviceability`, badge `● LIVE`, title `Check serviceability`.

**Form:** labels `Pickup pincode`, `Delivery pincode`, `Shipment weight (kg)`; pincode placeholder `110 001`; weight placeholder `e.g. 200`; helper `Don't know the pincode? Find it on India Post.` (href `https://www.indiapost.gov.in/VAS/Pages/findpincode.aspx`, `target="_blank" rel="noopener"`); submit `Check serviceability →`; microcopy under submit: `Free check · No signup · No login`.

**INVALID:** banner `That looks short for a pincode — it's 6 digits.`; field errors (from zod): `PIN code must be 6 digits`, `Weight must be positive`, `Max 1000 kg per shipment`.

**LOADING:** `Checking lane coverage on the JOLT network…` — no coverage counts, no invented numbers.

**SERVED:** chip `LANE LIVE`; echo line `` `> 500001 → 110001 — LANE LIVE` `` (values from response); `Transit: 24–48 hours on scheduled express trains.`; `Estimated delivery: Next-day to Day 2.`; rate line `Indicative rate for 200 kg: ₹1,800–₹2,300` (from `rateBandInr`, Indian locale formatting); weight > 500 kg variant (replaces rate line): `Lane is live. Shipments over 500 kg are priced case-by-case — talk to our freight desk.`; disclaimer (always, small muted): `Estimates based on published rail-freight rate slabs for heavy cargo. Actual rates vary by contract terms, fuel surcharges and seasonal adjustments.`; SLA fineprint: `The 48-hour promise excludes loading/unloading time, weather and force majeure.`; CTA `Get a contract rate on WhatsApp →` with pre-filled message `Hi JOLT! I checked serviceability for {originPin} → {destPin} ({weightKg} kg) — lane is live. Please share a contract rate for this lane.`

**PARTIAL:** chip `PARTIAL COVERAGE`; echo `` `> 500001 → 781001 — PARTIAL COVERAGE` ``; body (compose from flags, swap roles as needed) `Pickup pincode 500001 is on the JOLT network, but delivery pincode 781001 isn't live yet.`; `We're opening new terminals every quarter. Tell us where you ship and we'll ping you the day this lane goes live.`; primary CTA `Notify me when live →` (WhatsApp message `Hi JOLT! Please notify me when {originPin} → {destPin} opens on the JOLT network.`); secondary CTA `Or request pilot pricing →` (href `#pilot`, wired by Brief 03).

**NOT-SERVED:** chip `NOT ON NETWORK YET`; echo `` `> 781001 → 792001 — NOT ON NETWORK YET` ``; body `This lane isn't serviceable on the JOLT express network yet.`; `We're expanding lane by lane — ping us and we'll notify you the day it opens.`; same primary/secondary CTAs as PARTIAL.

**ERROR:** chip `NETWORK HICCUP`; body `Network hiccup. Try again or WhatsApp us →`; buttons `Try again` + WhatsApp fallback (message `Hi JOLT! The serviceability check for {originPin} → {destPin} failed — can you check this lane for me?`).

**WhatsApp wiring:** base number in one exported `const WHATSAPP_NUMBER = "91XXXXXXXXXX"` at the top of the checker file; links built as `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`. Replace the placeholder with the production JOLT WhatsApp number before deploy.

## Components

- shadcn/ui **Dialog** (Radix, React 19 + Tailwind v4 supported) — https://ui.shadcn.com/docs/components/dialog — run `npx shadcn@latest init` (zinc base), then `npx shadcn@latest add dialog`; restyle `components/ui/dialog.tsx` overlay/panel to JOLT dark chrome.
- **react-hook-form** + **zod** (installed) + `@hookform/resolvers` (add: `npm i @hookform/resolvers`) — https://react-hook-form.com
- **motion** — `npm i motion`; `import { AnimatePresence } from "motion/react"` — https://motion.dev/docs/react — never import from `"framer-motion"` (per AGENTS.md).
- Inline SVG icons only; no icon library.

## Constraints

- `'use client'` island: only the checker file is a client component; `app/page.tsx` stays server.
- Claim guardrails: no "19,000+ rail-connected pincodes" (Shiprocket's number), no invented terminal counts, no multi-tier rate comparison (JOLT has one SLA tier — do not fabricate Express/Premium/Surface tiers), no "first" claims, no SLA percentages.
- Quirk terminal (typewriter jokes) is forbidden in this modal — notify-me waitlist only (out of scope).
- A11y: Radix dialog semantics (role dialog, aria-modal, labelled by title), focus trap + focus return, Escape and backdrop close, body scroll lock, first input autofocus, per-field errors via `aria-describedby`, `aria-live="polite"` state announcer, visible focus states, body-text contrast ≥ 4.5:1 (#E8E8EA/#B9B9BF on #08080A, never #56565C for body copy).
- Reduced motion: no skeleton pulse or typewriter; gate AnimatePresence transitions on `prefers-reduced-motion` (globals.css already has a kill-switch).
- Env-gated pattern: the client talks only to `POST /api/serviceability`; provider switching (MOCK|SHEET|FORMSPREE) is server-side only; `JOLT_API_MOCK=true` is the default; no env vars in client code; UI renders response fields verbatim.
- Do not touch `frozen design/`, `public/`, or any other section; do not change existing copy elsewhere; list every copy deviation in your PR summary.

## Acceptance criteria

1. Nav shows a ghost "Check serviceability" button (frozen-design label, exact) next to "Start a Pilot" in `app/page.tsx`; clicking it opens the checker dialog and the old fake quirk-terminal wiring does not fire.
2. Form renders 3 required fields per Spec; invalid submissions show the INVALID state with per-field zod errors and never call the API.
3. Valid submit shows LOADING ≥ 400 ms with copy exactly `Checking lane coverage on the JOLT network…` and no invented coverage numbers.
4. The client POSTs exactly `{ originPin, destPin, weightKg }` to `/api/serviceability`; SERVED/PARTIAL/NOT-SERVED render solely from response fields; non-2xx/network failure renders ERROR with `Try again` (inputs preserved) and the WhatsApp fallback.
5. SERVED shows the echo line, transit, EDD, rate band from `rateBandInr` (or the 500+ kg freight-desk variant), both disclaimer sentences, and the WhatsApp CTA with the pre-filled lane message.
6. PARTIAL names the exact non-served pincode via `originServed`/`destServed` and shows both CTAs.
7. NOT-SERVED shows verbatim `This lane isn't serviceable on the JOLT express network yet.` plus the expansion copy and both CTAs.
8. All WhatsApp links derive from the single `WHATSAPP_NUMBER` const with `encodeURIComponent` messages per state.
9. All copy matches "Final copy" verbatim; zero banned claims from AGENTS.md §0 appear.
10. A11y: Radix dialog semantics, focus trap/return, Escape + backdrop close, scroll lock, labelled inputs with `aria-describedby` errors, aria-live announcer, contrast ≥ 4.5:1, reduced-motion honored.
11. `npm run build` and `npm run lint` pass; only the files named in Spec are touched; the mock branch remains gated by `getApiConfig()`.
12. No "mock"/"demo" wording leaks into user-facing copy; the summary flags that served rates are deterministic mock estimates until a real pincode/rate list lands.

## Out of scope

Pilot flow (3-step form, Brief 03 — the `#pilot` link and any pilot-modal wiring land there), notify-me waitlist + quirk terminal, WhatsApp floating button, `/api/estimate`, real pincode coverage data, `components/sections/hero.tsx` CTA rewiring, footer links.

## API changes needed

The current mock returns only `{ serviceable, eta, tatHours }` — insufficient for PARTIAL, rate band, and per-pincode copy. Replace the mock branch of `app/api/serviceability/route.ts` (keep the zod parse and `proxyToJolt` path untouched):

```ts
if (mock) {
  // Deterministic mock — replace with a git-committed pincode list when
  // real coverage data lands. Zone rule: first digit 1–6 = network zone.
  const { originPin, destPin, weightKg } = parsed.data;
  const originServed = Number(originPin[0]) <= 6;
  const destServed = Number(destPin[0]) <= 6;
  const status =
    originServed && destServed
      ? "served"
      : originServed || destServed
        ? "partial"
        : "not-served";
  const zoneDelta = Math.abs(Number(originPin[0]) - Number(destPin[0]));
  const served = status === "served";
  const perKgInr = served ? 6 + zoneDelta : null;
  const rateBandInr =
    served && perKgInr !== null
      ? [Math.round(perKgInr * 0.9 * weightKg), Math.round(perKgInr * 1.15 * weightKg)]
      : null;
  return Response.json({
    ok: true,
    mock: true,
    status,
    originPin,
    destPin,
    originServed,
    destServed,
    eta: served ? "24–48h" : null,
    tatHours: served ? 26 : null,
    ratePerKgInr: perKgInr,
    rateBandInr,
  });
}
```

Example responses (mock mode): `{500001, 110001, 200}` → `status: "served"`, `ratePerKgInr: 10`, `rateBandInr: [1800, 2300]` (matches the code snippet above — the snippet is authoritative). `{500001, 781001, 200}` → `"partial"`, `destServed: false`. `{781001, 792001, 200}` → `"not-served"`. No change to `lib/validation.ts` or the request body.
