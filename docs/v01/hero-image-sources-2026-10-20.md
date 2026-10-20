# Hero Image Sources — research report (2026-10-20)

**Goal:** premium product images for the hero stage (dark `#08080A` card, 1.2s camera-cut swaps, 6 products).
**Method:** 4 parallel research agents; all URLs license-verified at report time. Nothing downloaded.
**Working pipeline:** true dark-isolated studio cutouts are scarce free → use (a) white-isolated shots + background removal, or (b) dark-scene shots placed directly on the card.

## Per-product candidates

### 1. FURNITURE — Sectional sofa
| Source | URL | License | Size | Notes |
|---|---|---|---|---|
| Pexels | pexels.com/photo/brown-couch-on-white-background-4172381 | Pexels (free comm.) | 5909×3939 | isolated brown L-sofa → cutout |
| Pexels | pexels.com/photo/white-pillow-on-white-leather-sofa-945669 | Pexels | 4200×2919 | beige sofa, dark backdrop `#000` dominant |
| Pexels | pexels.com/photo/moody-shadows-on-a-loveseat-in-natural-light-29681174 | Pexels | 3225×2148 | charcoal loveseat (not full sectional) |

### 2. AUTO PARTS — Alternator
| Source | URL | License | Size | Notes |
|---|---|---|---|---|
| Pexels | pexels.com/photo/close-up-photo-of-black-and-silver-car-engine-3757226 | Pexels | large | engine close-up, machined-metal dark (not alternator, reads as auto part) |
| Pexels | pexels.com/photo/man-fixing-a-car-alternator-16048266 | Pexels | large | mechanic + alternator, moody workshop |
| Wikimedia | commons.wikimedia.org/wiki/File:Alternator.jpg | CC BY-SA 3.0 (attribution) | 2576×1716 | true alternator |
| Pixabay | pixabay.com/photos/voltage-regulator-alternator-513434 | Pixabay | — | alternator voltage regulator part |
| **Honest note:** premium dark-studio alternator cutout effectively needs paid microstock (~$10–15 one-off, Adobe Stock/iStock/Envato). |

### 3. FURNITURE — Velvet bench (current: 1194×1194 hi)
(No dedicated findings — search terms: Pexels "bench dark", "ottoman dark"; same pipeline.)

### 4. BEDDING — Mattress set
| Source | URL | License | Size | Notes |
|---|---|---|---|---|
| Pexels | pexels.com/photo/white-and-gray-bed-linen-on-bed-9193637 | Pexels | 3443×2000 | dark bedroom, palette `#000/#696969` — **3D render** |
| Pexels | pexels.com/photo/brown-and-black-interior-of-the-bedroom-13722889 | Pexels | 5000×2000 | dark textured wall, brown ≈ accent family — **3D render**, author has a dark-bedroom series |
| Pexels | pexels.com/photo/interior-of-a-modern-bedroom-with-dark-walls-20604661 | Pexels | 6123px wide | real photo, dark walls, made bed |
| Unsplash | unsplash.com/photos/h5b7fpwCw5Y | Unsplash | — | bed + wooden headboard (verify in browser — bot-blocked at research time) |

### 5. NURSERY — Baby crib
| Source | URL | License | Size | Notes |
|---|---|---|---|---|
| Pixabay | pixabay.com/photos/apartment-room-space-bed-cot-dark-4231463 | Pixabay | 5475×3643 | dark nursery crib — moody, possibly "abandoned" vibe |
| Pexels | pexels.com/photo/brown-wooden-baby-crib-near-white-wooden-framed-glass-window-3958952 | Pexels | 5000×3333 | elegant brown crib, warm/neutral |
| Pixabay | pixabay.com/photos/nursery-crib-chair-bedroom-room-1078923 | Pixabay | 6016×4000 | white crib, neutral gray/pink — cutout-ready |

### 6. APPLIANCES — Appliance set
| Source | URL | License | Size | Notes |
|---|---|---|---|---|
| Pexels | pexels.com/photo/close-up-of-stainless-steel-washing-machine-drum-34397245 | Pexels | large | stainless drum detail — premium metal |
| Pexels | pexels.com/photo/a-white-front-load-washing-machine-9515294 | Pexels | large | front-load in low-lit closet |
| Pexels | pexels.com/photo/white-refrigerator-in-the-kitchen-9551373 | Pexels | large | fridge + dishwasher, clean neutral |
| Freepik | freepik.com/search?query=washing+machine+isolated | Freepik (attr. free / premium) | — | true isolated cutouts mostly Premium |

## Cutout pipeline (for white-isolated masters)
1. **rembg** (MIT, free local batch) — best for hard-edged products; run on the 6 masters.
2. **Adobe Express Remove Background** — free with account, full-size PNG.
3. **remove.bg** — best edges, HD pay-per-credit (a few cents/image).
4. **Photoroom Pro** — batch product cutouts if a paid month is acceptable.

## QA checklist (right quality)
- ≥1200px long edge masters; final crop ≥2× displayed width.
- Inspect edges at 200–400%: no white fringes/halos; true alpha.
- Same key-light direction + camera angle across all 6 (the 1.2s swap must not jump).
- Neutral color balance — orange stays the only accent.
- Ship WebP ≤100KB via next/image; log source + license per image.

## Caveats
- **Self-host** all files (no hotlinking Pexels/Pixabay/Commons).
- Licenses permit commercial site use, not resale as stock; Freepik free requires attribution; Wikimedia CC BY-SA requires TASL attribution.
- 3D renders (bedding 1–2) are fine for hero but aren't photography.
- Skip sponsored iStock rows inside Pixabay/Pexels grids; avoid Unsplash+ (paid).
- Trademark: avoid visible brand logos on appliances.

## Next step
Founder picks per product → download masters into `public/assets/hero-final/` → cutout pass (rembg/Adobe) → QA checklist → swap into `PRODUCTS` in `components/sections/hero.tsx` → gate.
