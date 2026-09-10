# Content TODO — items Pink Tree must supply to go live

Everything below is a placeholder or assumption. **No client results or testimonials have been invented.** Generated placeholder imagery is clearly abstract and must be replaced with real photography/video.

## 1. Confirm the flagship clients (planning §13.1)

Currently scaffolded:

| Slug | Client | Status |
| --- | --- | --- |
| `the-chigwell-marquees` | The Chigwell Marquees | **Lead** — copy is a considered DRAFT pending sign-off; outcomes are qualitative (no invented metrics) |
| `aya-beauty` | Aya Beauty | Placeholder — confirm + supply everything |
| `swifty-beats` | Swifty Beats | Placeholder — confirm + supply everything |
| `central-restaurant-lounge` | Central Restaurant & Lounge | Placeholder — confirm + supply everything |
| `north-mymms-park` | North Mymms Park | Placeholder — confirm + supply everything |

For each **confirmed** client, supply:

- [ ] Real **client name**, **sector**, and the **disciplines** Pink Tree delivered.
- [ ] **The Client** paragraph (who they are).
- [ ] **The Challenge** paragraph (what they needed).
- [ ] **What We Delivered** — a short summary per relevant discipline.
- [ ] **The Work** — real images/video of the actual work (hero + gallery).
- [ ] **Results** — real outcome statements or metrics (or confirm the qualitative statements used for Chigwell).
- [ ] **SEO** title + description.

Placeholder copy currently reads `TODO: client to supply …` and the cards show an **"In preparation"** tag — both disappear automatically once the entry is filled and `placeholder` is set to `false` (or removed).

## Services page — capability claims to confirm

The /services page now states, in list form, what a client receives for each of
the five services, plus a four-step process. **None of this was supplied by Pink
Tree; it is a considered draft written to industry-standard scope.** It makes
commitments to prospective clients, so every line needs sign-off or editing
before launch. Nothing here invents a client, a result or a metric.

Confirm or strike, per service:

- [ ] **Brand & Design** — logo/wordmark/marque, colour + type systems, art direction, brand guidelines, print and social templates.
- [ ] **Print & Merchandise** — stationery, brochures/menus/lookbooks, packaging, signage and large format, branded merchandise, print management and proofing.
- [ ] **Social Media Marketing** — content planning, photography and art direction, copywriting, scheduling and publishing, **monthly reporting**.
- [ ] **Websites** — design and build, copy/photography direction, **CMS setup and training**, performance and accessibility, **launch and aftercare**.
- [ ] **Digital Marketing** — paid social, **search (paid and organic)**, email campaigns, landing pages, tracking and reporting.

The bolded items are the ones most likely to be wrong: they imply an ongoing
retainer or a skill set the studio may not offer in-house.

Also confirm the process wording ("Conversation, Direction, Production,
Handover"), which promises **one point of contact throughout** and that the
studio **stays reachable after launch**.

## 2. The Chigwell Marquees draft copy

The lead case study uses polished **draft** copy written for layout/tone. Please review and approve or amend:
- The Client / The Challenge / What We Delivered paragraphs.
- Results are **qualitative outcome statements**, not metrics. Replace with real figures if available (e.g. enquiry uplift, booking growth).

## 3. WhatsApp number (planning §13.8)

`src/lib/site.ts → CONTACT.whatsappNumber` is currently the **landline** (`442071931033`) as a placeholder.
- [ ] Confirm whether WhatsApp should use the landline or a dedicated **WhatsApp Business** line, and provide the number in international format.

## 4. Imagery & video

All files in `public/media/**` are **AI-generated placeholders** (Vertex AI **Imagen 4** for stills, **Veo 3** for the ambient hero loop) — photographic and on-brand, but **stand-ins, not real client work**. Replace with real, art-directed client assets per `MEDIA-README.md`. Keep the same file paths/names, or update the case-study data accordingly, then generate blur placeholders per `MEDIA-README.md`.

Regenerate the AI placeholders with:
`VERTEX_TOKEN=$(gcloud auth print-access-token) PROJECT=<gcp-project> node scripts/gen-media-vertex.mjs`
(`scripts/gen-media.mjs` is the original gradient generator, kept as an offline fallback.)
- [ ] Home hero ambient loop (`public/media/hero/home.{mp4,webm,jpg}`).
- [ ] Per-client hero + gallery imagery.
- [ ] About imagery (`public/media/about/*`).

## 5. Brand sign-off (planning §13.2–13.7)

- [ ] **Palette** — confirm the rosewood accent direction (`#A86B72`) or steer warmer/cooler.
- [ ] **Typography** — confirm Fraunces + Inter, or upgrade the grotesque (e.g. Neue Montreal).
- [ ] **Video host** — self-host only (current) or budget for **Mux** on longer clips (recommended; component is ready).
- [ ] **CMS** — keep static typed content (current) or add Sanity for self-service editing (model maps cleanly).
- [ ] **Custom cursor** — currently ON (tasteful, desktop-only). Keep or remove.
- [ ] **WebGL hover-distortion** (Phase 8) — in scope or defer (currently deferred).

## 6. Legal / footer

- [ ] Confirm company registration details, privacy policy and any legal links required in the footer.
- [ ] Confirm the exact studio address line (currently `High Road, Chigwell, IG7 5BD`).

## 7. Email delivery

- [ ] Add `RESEND_API_KEY` in the Vercel project and verify the sending domain so the contact form delivers to `info@pinktreemedia.com`.
