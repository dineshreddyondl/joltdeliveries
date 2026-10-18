# 04 — Conversion & Lead Capture

> Research date: 2026-10-17 · Scope: Indian logistics + adjacent conversion UX (serviceability checkers, quote flows, WhatsApp, B2B pilot signup, form backends for a Next.js site with no backend). Every URL below was visited during research unless flagged ⚠️. Output is implementation-ready for the JOLT prototype (rail-first B2B heavy-shipment express, 24–48h promise).

## Executive brief

1. **The single highest-leverage fix is a real, instant pincode serviceability checker.** Every competitor with good conversion (ClickPost, Shiprocket) leads with a 2-input (origin/destination pincode) → instant result → CTA flow. JOLT's nav item "Check serviceability" doing nothing is the #1 leak.
2. **Instant beats callback for top-funnel; callback beats instant for B2B close.** Show a rate band + EDD instantly (ClickPost pattern); route "not serviceable" and "need exact rate" leads into a callback/WhatsApp capture, never a dead end.
3. **Long forms kill conversion with measured numbers:** logistics quote forms with 12–15 fields get 5–8% completion; a two-step form (name+email+phone+1 qualifier, rest optional post-submit) plus a WhatsApp alternative moves it to 25–40% (ITD GrowthLabs audit, verified below).
4. **WhatsApp click-to-chat (wa.me links) is the India-native conversion channel and costs ₹0.** Real Indian freight companies (V-Trans) ship pre-filled structured quote messages in their wa.me deep links. No Business API needed for the prototype.
5. **Explicit negative states sell trust.** Delhivery's B2B checker states "This pin code is not serviceable" plainly; ClickPost shows ODA surcharges in the result. A "not served yet → leave pincode, we'll ping you" state converts the negative into a lead.
6. **Disclaimers are trust accelerators, not fine print.** ClickPost puts "Estimates based on DTDC published rate slabs. Actual rates may vary by contract terms, fuel surcharges, ODA fees…" directly under the result — mirror this with JOLT's SLA fineprint ("48h promise excludes loading/unloading, weather, force majeure").
7. **B2B account forms are callback machines, not checkout flows.** Safexpress's Open Business Account form is 7 fields including "Preferred time to receive a call". BlackBuck has *no* web form at all — phone/email only — and that's a conversion anti-pattern, not a model.
8. **Zero-backend form infrastructure is a solved problem at ₹0–$25/mo:** Formspree free (50 subs/mo), Basin free (1 form, 50 subs/mo), Google Apps Script→Sheets (free, ~1 write/sec), Zapier free (100 tasks/mo). For JOLT, ship a Next.js API route with a MOCK|SHEET|FORMSPREE provider switch — UI never changes when the backend becomes real.
9. **Login-gating and app-gating are self-inflicted wounds:** Delhivery's B2B calculator sits behind a Delhivery One login; Porter's web site funnels everything into "download the app". JOLT should be the opposite: zero friction, no account to check serviceability.
10. **The conversion stack to build, in order:** (1) real pincode checker with 4 states, (2) 2-step quote/pilot form wired to a real backend, (3) WhatsApp deep link with pre-filled message on every CTA, (4) trust row under every form (no-spam, 2-hour callback promise, SLA fineprint), (5) not-serviceable lead capture.

## Serviceability-checker patterns

### Best-in-class reference: ClickPost's DTDC rate calculator
URL: https://www.clickpost.ai/dtdc-courier-rate-calculator (visited)
- **Inputs, exactly:** Route (Pickup Pincode*, Delivery Pincode*), Package (Weight* KG, Length/Width/Height CM *optional*), Payment mode (Prepaid | COD toggle). That's 3 required fields.
- **Result:** side-by-side comparison across all DTDC service tiers (Express 1–3d, Premium 1–2d, Lite 3–5d, Surface 5–8d) with transit windows — the *comparison* is the value; plus "Get a DTDC rate estimate in four steps" explainer.
- **Progressive disclosure:** pincodes first (serviceability gate), then package details (rate refinement). Payment mode last. The serviceability answer is implicitly bundled: a route that can't be served yields no tier result.
- **Trust copy verbatim:** "Estimates based on DTDC published rate slabs. Actual rates may vary by contract terms, fuel surcharges, ODA fees, and seasonal adjustments." and "If a pin code shows ODA (Out of Delivery Area), expect ₹50–₹150 extra per shipment."
- **Lead capture on the tool itself:** "Request a demo" / "Talk to an expert" CTAs frame the calculator as top-funnel content marketing — the calculator is the magnet, the demo form is the catch.

### Delhivery B2B Serviceability & Rate Calculator (the incumbent spec)
URL: https://help.delhivery.com/docs/b2b-serviceability-rate-calculator (visited)
- **Flow:** Pickup pincode + Delivery pincode → if either non-serviceable: explicit message *"This pin code is not serviceable."* → if served: box quantity + dimensions (LBH) + total weight → shipment value + payment mode (Prepaid/COD) → Calculate → result panel: Shipping mode, Freight Cost, Estimated Delivery Day, "Show Freight Breakup".
- **Copy states to steal:** the literal non-serviceable sentence; the freight-breakup disclosure; EDD shown *next to* price.
- ⚠️ **Caveat:** gated behind a Delhivery One B2B account login — great flow, wrong gate. JOLT should ship the same flow ungated.

### Blue Dart Location Finder
URL: https://www.bluedart.com/location-finder (visited)
- Input: "Use Pincodes or Location Names to locate a Blue Dart facility within India" — pincode **or** free-text name (important accessibility fallback for users who don't know the pincode).
- Result: list of services available at that location + facility contact details. No rate. Old-school but the "pincode OR name" input tolerance is worth copying.

### Aggregator marketing pattern: Shiprocket
URL: https://www.shiprocket.in/features/serviceable-pin-codes/ ⚠️ (search result; page not fully extracted)
- Headline: "Ship Across 19000+ Pincodes In A Few Clicks" — the coverage number *is* the hero copy. JOLT equivalent: "X rail-connected pincodes · 24–48h". Actual checker sits inside the logged-in product (same login-gating sin as Delhivery).

### Checker state machine to implement (spec for dev)
Input: origin pincode (6-digit, numeric, maxLength=6, inputMode=numeric, India-style grouping "110 001" on blur), destination pincode.
States:
1. **IDLE** — placeholder copy: "Enter pincode — e.g. 110 001". Helper: "Don't know the pincode? [Find it](https://www.indiapost.gov.in/VAS/Pages/findpincode.aspx)" (India Post finder, free, no key).
2. **VALIDATING** — skeleton row, 300–600ms fake latency: "Checking 19,000+ rail-connected pincodes…"
3. **SERVED** — green: "✓ Mumbai Suburban (400 001) → Delhi NCR (110 001) is on the JOLT network. Transit: 24–48h." + CTA "Get rate for this lane →"
4. **PARTIAL / NOT SERVED** — amber, explicit, with capture: "This pincode isn't on the express network yet. We're adding X terminals this quarter — leave your number and we'll ping you when it's live." (email/phone field + submit). This turns the dead state into the second-highest-intent lead source on the site.
5. **INVALID** — client-side only, no API call: "That looks short for a pincode — it's 6 digits."
6. **ERROR** — "Network hiccup. Try again or WhatsApp us →" (never a bare failure).

## Quote/estimate flows

### Instant calculator w/ tiers — ClickPost (above). The benchmark.
### Callback-form pattern — Safexpress "Open a Business Account"
URL: https://www.safexpress.com/open-a-business-account (visited via browser)
- **Fields (verbatim):** *Name, *Designation, *Email, *Organisation name, *Phone, *Location, *Preferred time to receive a call. (7 required, one screen.)
- **Copy:** "Sign up for a business account now to enjoy personalised rates and pay within our standard credit terms." + benefits list (personalised pricing, dedicated account managers, real-time tracking). Plus a parallel "ship right now without an account" path for urgent users.
- **Critique:** no rate feedback at all; the "preferred time" is a free-text input (bad — should be segmented: Morning 9–12 / Afternoon 12–4 / Evening 4–7).

### Web-hosted freight calculator + human quote — V-Trans
URLs: https://vtransgroup.com/rate-distance-calculator/ and https://vtransgroup.com/tools/ (visited)
- Calculator gives "approximate costs… automatically generated" with the explicit bridge copy: "Detailed costs and quotations will be provided by company representatives after evaluation of your cargo and logistics needs." — **instant estimate → human quote** is the model JOLT should copy verbatim in spirit.
- Tools hub groups: Track, Locate network, Rate & Distance Calculator, Pickup Request — one page, every self-serve tool.

### Freight query (V-Trans group, Mumbai) — see WhatsApp section; it IS a WhatsApp form.
### Minimal callback form — Indian Porter
URL: https://indianporter.com/get-quote/ (visited)
- 4 fields: Pickup City*, Drop City, Name*, Mobile Number* → Submit → human callback. Zero friction but zero feedback — acceptable for a small operator, insufficient for JOLT (add EDD/rate band).
### BlackBuck — ⚠️ anti-pattern benchmark
URL: https://www.blackbuck.com/contact-us.html (visited)
- No web quote form: phone (080-46481828), media/service emails, corporate address. A freight-tech unicorn with effectively no web lead capture — the market leaves quote capture on the table; a working web quote flow is a differentiator, not table stakes.

### What fields B2B logistics actually asks (consolidated from visited forms)
Required everywhere: **name, phone** (never optional in India). Usually: email, company, location/city. Freight-specific qualifiers (only when instant rates are impossible): weight band (select, not free text), lane (origin→destination pair), volume/month band, commodity type (select: FMCG / auto parts / electronics / machinery / chemicals-classified…), shipment readiness date, preferred call time. Field-count budget: **4 required on screen 1; everything else optional on screen 2** (ITD numbers below).

## WhatsApp-first India patterns

### Verified deep-link formats (both observed live in production on Indian freight sites)
1. `https://wa.me/<country-code+number>?text=<url-encoded>` — used by V-Trans Lojistik.
2. `https://api.whatsapp.com/send/?phone=91XXXXXXXXXX&text=...` — used by V-Trans (India) Ltd footer and thousands of Indian SMB sites.
- Both are **click-to-chat: free, no API, no template approval, works with a plain WhatsApp/WhatsApp Business App number.** Official reference: https://faq.whatsapp.com/5913398998672934/ (visited).

### Pre-filled message template (the V-Trans pattern, captured verbatim from their link)
URL: https://vstrans.in/freight-query/ (visited) — their CTA is a GIF button "Get Instant Freight Rates" pointing at:
`https://wa.me/917230970005?text=Hello%20VS%20Trans%20Team,%0A%0AI%20would%20like%20to%20get%20a%20freight%20quotation.%0A%0ACompany%20Name:%0AShipment%20Mode:%20Sea%20Freight%20/%20Air%20Freight%0AOrigin:%0ADestination:%0ACommodity:%0AContainer%20Size%20(20GP%20/%2040GP%20/%2040HC)%20or%20Cargo%20Weight:%0ACargo%20Readiness%20Date:%0A%0APlease%20share%20your%20best%20rate.%0A%0AThank%20you.`
i.e. a structured fill-in-the-blanks template: Company / Mode / Origin / Destination / Commodity / Size-or-weight / Readiness date. The user just fills blanks in their own WhatsApp — **this is the single best no-build conversion pattern observed.** JOLT equivalent:
`https://wa.me/91XXXXXXXXXX?text=Hi%20JOLT!%20I%20need%20a%20freight%20quote.%0ACompany:%0AOrigin%20city/pincode:%0ADestination:%0ACommodity:%0AWeight%20(tonne):%0AShipments/month:%0AReady%20date:`

### When to use click-to-chat vs forms vs API
- **Now (prototype):** wa.me deep links everywhere — primary CTA on mobile, secondary CTA on desktop, fallback in every form's success state ("Prefer WhatsApp? [Send it here]"), floating chat button on mobile only.
- **When to use WhatsApp Business Platform (API, paid):** automated 2-way journeys, notification workflows, template broadcasts. Since 1 July 2025 Meta bills **per delivered message** (was per-conversation), 4 categories (marketing/utility/authentication/service); service-category free window still exists; Ad-that-clicks-to-WhatsApp gives a 72h free message window. Sources: https://whatsappbusiness.com/products/platform-pricing/ (visited). **Do not build this for the prototype** — click-to-chat captures the same lead for ₹0 and no approval latency.

### Trust rules for WhatsApp CTAs (from Indian best practice articles + observed usage)
- Always show the number/handle and a human name ("Chat with Suresh, freight desk").
- Reply-time promise on the button ("Replies < 15 min, 9am–9pm IST").
- Never autofill sensitive data into text; only blanks and selectors.

## Pilot/B2B signup flow spec (implementable in Next.js API routes today)

Copy principles from observed winners: outcome-first ("Move 1T Delhi→Mumbai in 48h"), one qualifier per step, callback promise with a time bound ("We'll call within 2 business hours — no spam, ever"), WhatsApp as visible alternative at every step.

### Step 1 — Qualify (modal or /pilot page, 4 required fields)
- name (text, required)
- phone (tel, required, +91 prefix, 10-digit validation, `pattern="[6-9][0-9]{9}"`)
- company (text, optional-but-asked; placeholder "Company name (optional)")
- weight band (segmented radio — never free text): "Up to 500 kg / 500 kg–2 T / 2–5 T / 5–20 T / 20 T+ (FTL/rail)"
- CTA: "Get my pilot quote →" · microcopy: "Takes 40 seconds. No spam — we call once."

### Step 2 — Lanes & volume (2 required, 2 optional)
- top lane: origin city/pincode → destination city/pincode (two inputs)
- shipments/month (select: 1–4 / 5–15 / 16–50 / 50+)
- commodity (optional select, pre-filled categories)
- preferred call time (segmented buttons: "Morning 9–12 · Afternoon 12–4 · Evening 4–7") — fixes Safexpress's free-text mistake
- CTA: "Request pilot pricing →"

### Step 3 — Success (no more fields)
- Headline: "You're in. Expect a call within 2 business hours."
- Summary echo of their inputs ("Delhi → Mumbai · 2–5 T · 4 shipments/mo") — instant confirmation email + WhatsApp alternative button (pre-filled "Hi, I just submitted a pilot request for {lane}, {weight band} — reference {id}").
- Reference ID shown (`JOLT-2026-10-XXXX`) so the callback is verifiable.
- Trust row: "No spam · Unsubscribe anytime · Your number is only used for this callback."

### API route pattern (the mock→real swap)
```
// app/api/leads/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);      // zod: name, phone(+91 regex), weightBand enum, lane, volumeBand, optional fields
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  const provider = process.env.LEAD_PROVIDER ?? "MOCK";   // MOCK | SHEET | FORMSPREE | CRM_LATER
  const result = await leadSink(provider, parsed.data);   // MOCK: append to /data/leads.json (fs, gitignored) + log; SHEET: Apps Script /exec POST; FORMSPREE: fetch(formId, {method:"POST", headers:{Accept:"application/json"}, body: JSON.stringify(data)})
  if (!result.ok) { /* still return 200 to the user, log the sink failure */ }
  return NextResponse.json({ ok: true, ref: `JOLT-${Date.now().toString(36).toUpperCase()}` });
}
```
- Same shape for `/api/serviceability` (`{origin, destination}` → `{status: "served"|"not-served", eta: "24–48h", terminal: "..."}` backed by a static pincode list (fetch from a git-committed JSON of served pincodes/prefixes, or an env-flagged remote call later).
- **Rule:** the UI never talks to Formspree/Sheets directly; it always POSTs to the JOLT API route. One env var swaps providers. That's the pattern that survives prototype → launch.

## Form backend options for Next.js 15 (no-backend tier)

| Option | Free tier (verified) | Paid | Notes |
|---|---|---|---|
| **Formspree** (https://formspree.io/plans/ — visited) | **50 subs/mo**, basic spam filtering | Personal $10/mo (200 subs), Pro $20/mo (2k, autoresponses, API) | First-party `@formspree/react` `useForm` hook + official Next.js guide (https://formspree.io/guides/nextjs/ — visited). AJAX-friendly. Simplest "get an email on submit" path. |
| **Basin** (https://usebasin.com/pricing — visited) | **1 form, 50 subs/mo, 30-day retention**, AJAX + Zapier | Starter $12.50/mo (3 forms/250 subs); **Growth $24.17/mo adds Google Sheets, Slack, webhooks, auto-responses, branded emails** | Free plan is enough to wire one site form; the Growth-tier features are what a sales team eventually wants. |
| **Google Apps Script → Sheets** (https://formester.com/blog/how-to-send-contact-form-data-to-google-sheets-free/ — visited; full paste-ready `doPost` code incl. honeypot + CSV-injection sanitizing) | **₹0, no cap** within Google quotas (~1 Sheets write/sec per user) | — | 20–40 min setup: create Sheet → Apps Script `doPost` → Deploy as web app ("Anyone") → POST FormData/JSON to `/exec` URL. Pitfall: redeploy after every script edit. Never store payments/credentials in Sheets. |
| **Zapier** (https://zapier.com/pricing — search-verified, not extracted) | **100 tasks/mo**, includes Zaps, Tables & Forms | ~$20/mo+ | Use only if the sheet lives somewhere weird; Sheets/Zapier sync is also a native Basin/Formester feature. Usually unnecessary for JOLT. |
| **Next.js API route + mock** (pattern above) | ₹0, self-hosted, full control | — | Recommended default for the prototype. JSON-file mock on Vercel is ephemeral (read-only FS) — use `MOCK` only locally; in prod set `LEAD_PROVIDER=FORMSPREE` (or Sheets) from day one. |
| **Formester** (https://formester.com/templates/logistics-inquiry-form/ — visited) | Free plan w/ unlimited responses, Sheets sync, conditional logic | — | Pre-built "Logistics Inquiry Form" template is a good field checklist: origin, destination, cargo type, weight, dims, timing; conditional logic ("refrigerated" → temp range). |

Recommendation: **Formspree free for launch-day email capture (10-min wiring, official Next.js guide) + keep the API-route indirection so it can become Sheets/CRM without touching the UI.** Add Basin only when you need Sheets/Slack automation. Add Apps Script only if you want ₹0 forever and don't mind owning the script.

## Anti-patterns

1. **Fake forms** (JOLT's current state): every CTA opening a modal that stores nothing = silent lead destruction. Worse than no form: it trains users the site lies, and it hides the missing plumbing. **Fix first.**
2. **12–15-field single-step quote forms** → 5–8% completion (ITD GrowthLabs audit, URL below). Fix: 2-step + WhatsApp alternative → 25–40%.
3. **Login-gated or app-gated calculators** (Delhivery B2B checker behind account login; Porter's web funnel is "download the app" — https://porter.in/trucks, visited). Gate nothing top-funnel.
4. **No feedback after submit** (Indian Porter's 4-field form just… submits). Always render an explicit success state with a callback-time promise + reference ID.
5. **No WhatsApp escape hatch.** Every form on an Indian logistics site should have one; it's the highest-trust channel for tier-2/3 India.
6. **Free-text "preferred time"** (Safexpress) instead of segmented options — free text yields garbage scheduling data.
7. **Bare negative states.** "Pincode not found" with no next step throws away the highest-intent visitor. Always attach a capture ("ping me when live") to not-served.
8. **No estimate disclaimer.** Instant calculators without "rates may vary by contract/fuel/ODA" copy invite dispute and mistrust; ClickPost does this right.
9. **Own tools behind WAFs** — DTDC.com blocked our extraction outright (WAF "Web Page Blocked", Attack ID 20000051, ⚠️ unverified flow) and their consumer rate calculator URL 404s/was blocked; Gati's consumer domain now redirects into Allcargo corporate content. Even incumbents can't keep their funnel open — but JOLT must.
10. **BlackBuck-style no-web-form** (phone/email only): fine for a brand with a sales army; fatal for a landing-page-driven startup.
11. **Porter's ₹194/km claim** shows a different trap: undifferentiated "cheapest per km" copy trains price-only shoppers. JOLT's differentiator is time (24–48h rail) — lead with the SLA, not the rupee.

## Raw links log

Visited & verified (content extracted):
- https://help.delhivery.com/docs/b2b-serviceability-rate-calculator — Delhivery B2B checker flow, states, fields
- https://www.bluedart.com/location-finder — Blue Dart pincode/name → services + facility contacts
- https://vstrans.in/freight-query/ — V-Trans WhatsApp pre-filled freight-query deep link (captured full URL)
- https://vtransgroup.com/rate-distance-calculator/ — instant-approx-calc → human-quote bridge copy
- https://vtransgroup.com/tools/ — self-serve tools hub (track/network/calculator/pickup)
- https://www.safexpress.com/book-now — book-now category-step page (JS app; categories visible in nav)
- https://www.safexpress.com/open-a-business-account — 7-field callback B2B account form (fields captured)
- https://formspree.io/guides/nextjs/ — official Formspree + Next.js guide (@formspree/react, useForm)
- https://formspree.io/plans/ — pricing: Free 50/mo; Personal $10/200; Pro $20/2k; Business $60/20k
- https://usebasin.com/pricing — Basin pricing: Free 1 form/50 subs/30d; Starter $12.50; Growth $24.17 (Sheets/Slack/webhooks)
- https://indianporter.com/get-quote/ — 4-field callback form + wa.me footer link
- https://www.clickpost.ai/dtdc-courier-rate-calculator — best-in-class instant tiered calculator UX + disclaimers
- https://itdgrowthlabs.com/resources/logistics_website_conversion_optimisation.php — 9-point logistics conversion audit; 5–8% vs 25–40% form completion data; 2-step form + WhatsApp spec; "Call me back in 2 hours" toggle
- https://formester.com/templates/logistics-inquiry-form/ — logistics inquiry field checklist + conditional logic
- https://formester.com/blog/how-to-send-contact-form-data-to-google-sheets-free/ — Apps Script→Sheets paste-ready code, quotas, pitfalls
- https://faq.whatsapp.com/5913398998672934/ — official click-to-chat usage FAQ
- https://whatsappbusiness.com/products/platform-pricing/ — Business Platform per-message pricing, 4 categories, free 72h entry window
- https://porter.in/trucks — Porter web (app-gated, ₹194/km copy) — anti-pattern reference
- https://www.blackbuck.com/contact-us.html — BlackBuck phone/email-only contact — anti-pattern reference
- https://www.xpressbees.com/ and https://www.xpressbees.com/contact-us — B2C/B2B service nav, "Ship Now" portal link, support-category contact page
- https://www.ecomexpress.in/contact-us/ — now "Delhivery X Ecom Express" (post-acquisition merged site); Part Truckload/FTL/Warehousing service cards

⚠️ Not fully verified (blocked / search-only / failed extraction — flagged):
- https://www.dtdc.com/ — WAF-blocked ("Web Page Blocked", Attack ID 20000051) from this environment; DTDC's rate-calculator UX documented secondhand via ClickPost's DTDC calculator
- https://www.dtdc.com/b2b-enterprise/ — search snippet only: "rate calculator to estimate shipping costs based on origin and destination pin codes, weight, and dimensions"
- https://www.shiprocket.in/features/serviceable-pin-codes/ — search snippet only: "Ship Across 19000+ Pincodes In A Few Clicks"
- https://zapier.com/pricing — search snippet only: Free = 100 tasks/mo incl. Zaps, Tables, Forms
- https://www.fois.indianrail.gov.in/RailSAHAY/FrgtCalc — Indian Railways freight calculator; extraction failed (HTTP 500 via extractor). Existence confirmed via search result URL; UX not inspected. Worth a manual visit later — it's the closest public rail-freight rate reference for JOLT's pricing sanity checks.
- Gati: https://www.gati.com/ now redirects to https://www.allcargologistics.com/ (Allcargo corporate) — no consumer pincode checker found on the corporate site (volumetric-weight calculator exists there).

Not publicly available (noted, not visited): Ekart has no consumer/B2B-public signup surface (marketplace-tied); XpressBees rate calculator lives inside its shipmentv2 portal (login). Delhivery consumer "Delhivery Direct" flow is app-first.
