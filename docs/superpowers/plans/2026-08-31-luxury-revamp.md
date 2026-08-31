# Pink Tree Media Luxury Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing "Atelier" design system into a champagne/serif ultra-luxury consultancy site with reference-grade scroll choreography, without adding a single dependency or losing the current performance scores.

**Architecture:** Token-level palette swap plus a typography inversion in `globals.css`, three new motion primitives (one GSAP, two pure CSS), one new data-derived `Sectors` section, a recomposed home page, and regenerated media from Veo + Gemini. Inner pages inherit everything through tokens.

**Tech Stack:** Next.js 15 (App Router) · React 19 · Tailwind v4 (`@theme`) · GSAP + ScrollTrigger (code-split) · Lenis · `next/font` (Fraunces, Archivo, Hanken Grotesk) · Vertex AI (Veo 3 Fast, Gemini 2.5 Flash Image) · sharp · ffmpeg

**Spec:** `docs/superpowers/specs/2026-08-31-luxury-revamp-design.md`

## Global Constraints

- **No new npm dependencies.** GSAP, Lenis, sharp, zod, and all three fonts are already installed. If a task seems to need a package, solve it with stdlib, CSS, or an installed package instead.
- **Verification gate (this repo has no test runner; do not add one):** every task ends green on
  `npm run typecheck && npm run lint && npm run build`.
- Tasks with real logic additionally ship a `node:assert` self-check runnable with plain `node`.
- **CLS must stay 0.** Every image/video keeps explicit `width`/`height`.
- **GSAP stays code-split** — only ever imported through `loadGsap()` in `src/lib/gsap.ts`, inside an effect.
- **Every motion must no-op** under `usePrefersReducedMotion()` from `src/lib/hooks.ts`.
- **Video is poster-first**: loops lazy-mount, pause off-screen, degrade to poster under reduced-motion, Save-Data and ≤767px. Handled by the existing `<Video>`; do not bypass it.
- **Accent contrast is a hard gate:** small accent text ≥ 4.5:1, large display accent ≥ 3.0:1 against its own background.
- **No invented content.** No new metrics, no fabricated client outcomes. Placeholder flags in `src/content/case-studies/*` stay as they are.
- **WebGL stays deferred.** Do not enable the OGL hover distortion.
- **Never push to the remote.** Local commits only.
- Bump `CACHE_V` in `src/lib/media.ts` whenever media is regenerated in place.

---

### Task 1: Champagne palette + contrast guard

Replaces rosewood with a three-token champagne ramp. The guard script exists because gold is intrinsically light — the naive champagne (`#b08d4f`) fails AA, and a future edit could silently reintroduce that.

**Files:**
- Modify: `src/app/globals.css:18-26` (the `@theme` colour block)
- Create: `scripts/check-contrast.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--color-accent` `#a8823f`, `--color-accent-ink` `#7f5f2a`, `--color-accent-on-dark` `#bfa06a`, `--color-accent-soft` `#e6d9bd`. Later tasks reference these names exactly.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-contrast.mjs`:

```js
/** Asserts the accent ramp meets WCAG AA against its intended background. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tok = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `missing token --color-${name}`);
  return m[1];
};

const lin = (c) => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const paper = tok("paper");
const ink = tok("ink");

const checks = [
  ["accent-ink on paper (small text)", tok("accent-ink"), paper, 4.5],
  ["accent on paper (large display)", tok("accent"), paper, 3.0],
  ["accent-on-dark on ink (small text)", tok("accent-on-dark"), ink, 4.5],
  ["ink on paper (body)", ink, paper, 4.5],
];

for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  assert.ok(r >= min, `${label}: ${fg} on ${bg} = ${r.toFixed(2)}:1, need ${min}:1`);
  console.log(`  ok  ${label} — ${r.toFixed(2)}:1`);
}
console.log("contrast: all pass");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/check-contrast.mjs`
Expected: FAIL — `missing token --color-accent-on-dark` (the token does not exist yet).

- [ ] **Step 3: Swap the tokens**

In `src/app/globals.css`, replace the three accent lines in `@theme` with:

```css
  --color-accent: #a8823f; /* champagne — hairlines, hover, LARGE display (3.17:1 on paper) */
  --color-accent-ink: #7f5f2a; /* deep champagne — small accent TEXT on paper (5.26:1, AA) */
  --color-accent-on-dark: #bfa06a; /* light champagne — accent on ink sections (7.57:1) */
  --color-accent-soft: #e6d9bd; /* champagne tint — fills, subtle washes */
```

Leave `--color-paper`, `--color-ink`, `--color-ink-soft`, `--color-hairline`, `--color-paper-on-dark` and `--color-hairline-dark` untouched.

- [ ] **Step 4: Run the check and the build**

Run: `node scripts/check-contrast.mjs && npm run typecheck && npm run lint && npm run build`
Expected: contrast prints four `ok` lines then `contrast: all pass`; build green.

- [ ] **Step 5: Find every remaining rosewood reference**

Run: `grep -rniE "a86b72|8e4f57|d8c2c5|rosewood" src/ --include=*.tsx --include=*.ts --include=*.css`
Expected: only comments in `src/app/globals.css` describing the old system; update that prose to say champagne. Any hard-coded hex found in a component must become the matching token.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css scripts/check-contrast.mjs
git commit -m "design: champagne accent ramp with AA contrast guard"
```

---

### Task 2: Promote Fraunces to display

Fraunces is currently spent on pull-quotes while Archivo carries headlines. The references (DM Serif Display, Playfair Display) put a high-contrast serif at display size; Fraunces does it better because its `opsz` axis adds stroke contrast as size grows.

**Files:**
- Modify: `src/app/globals.css` — `@theme` font vars and the `h1,h2,h3,h4` base rule
- Modify: `src/lib/fonts.ts` — add the `opsz` range comment; no API change

**Interfaces:**
- Consumes: Task 1's tokens.
- Produces: `--font-display` now resolves to Fraunces; `.eyebrow` is Archivo. No component API changes.

- [ ] **Step 1: Swap the font role variables**

In `src/app/globals.css` `@theme`:

```css
  /* Display: high-contrast editorial serif (the DM Serif / Playfair register,
     done with a variable face whose opsz axis grows contrast with size).
     Label: wide grotesque. Body: clean grotesque. */
  --font-display: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-hanken), ui-sans-serif, system-ui, sans-serif;
  --font-label: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
```

- [ ] **Step 2: Retune the heading base rule**

Replace the `h1, h2, h3, h4` block in `@layer base`. Fraunces is a serif, so the old `font-stretch: 112%` (a width axis Archivo had and Fraunces does not) must go, or headings render at a default width with a meaningless declaration attached:

```css
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    font-weight: 400;
    font-variation-settings: "opsz" 96; /* max optical size = display contrast */
    letter-spacing: -0.015em;
    text-wrap: balance;
    margin: 0;
  }
```

- [ ] **Step 3: Point `.eyebrow` at the label face**

Find the `.eyebrow` rule in `globals.css` and set `font-family: var(--font-label);` on it, keeping its existing uppercase/tracking/size declarations.

- [ ] **Step 4: Verify build and look at it**

Run: `npm run typecheck && npm run lint && npm run build`
Then with the dev server up, screenshot `http://localhost:3000` at 1440×900 and confirm: headlines are serif, eyebrows are wide sans, nothing overflows its container, and no heading has collapsed to a fallback face.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/lib/fonts.ts
git commit -m "design: promote Fraunces to display, Archivo to labels"
```

---

### Task 3: Gemini image generation script

Every existing image script targets Imagen, which returns 404 on project `radlabs-497004` in every region tried. Gemini 2.5 Flash Image is the working substitute, and it uses `:generateContent` with `responseModalities`, not the `:predict` shape the old scripts assume — so this is a new script, not an edit.

**Files:**
- Create: `scripts/gen-image-gemini.mjs`

**Interfaces:**
- Consumes: env `VERTEX_TOKEN`, `PROJECT`, optional `LOCATION` (default `us-central1`), optional `NEGATIVE`.
- Produces: CLI `node scripts/gen-image-gemini.mjs <out.png> "<prompt>"`, writes a PNG and prints `DONE:<path>`. Task 7 calls this.

- [ ] **Step 1: Write the script**

```js
/**
 * Generates a still via Vertex AI Gemini image generation.
 * Imagen 404s on this project, so this is the image path for the whole site.
 *
 *   node scripts/gen-image-gemini.mjs <out.png> "<prompt>"
 */
import { writeFile } from "node:fs/promises";

const TOKEN = process.env.VERTEX_TOKEN;
const PROJECT = process.env.PROJECT;
const LOCATION = process.env.LOCATION ?? "us-central1";
const MODEL = process.env.IMAGE_MODEL ?? "gemini-2.5-flash-image";

const OUT = process.argv[2];
const PROMPT = process.argv[3];
// Required, not defaulted — a silent default bills a generation and returns
// artwork nobody asked for. Same rule as gen-video-veo.mjs.
if (!OUT || !PROMPT) {
  console.error('usage: node scripts/gen-image-gemini.mjs <out.png> "<prompt>"');
  process.exit(1);
}
if (!TOKEN || !PROJECT) {
  console.error("set VERTEX_TOKEN and PROJECT");
  process.exit(1);
}

const url =
  `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}` +
  `/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

const text = process.env.NEGATIVE
  ? `${PROMPT}\n\nAvoid entirely: ${process.env.NEGATIVE}`
  : PROMPT;

const res = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(2);
}

const data = await res.json();
const parts = data.candidates?.[0]?.content?.parts ?? [];
const inline = parts.find((p) => p.inlineData)?.inlineData;
if (!inline) {
  // A safety block returns text instead of an image; surface it rather than
  // writing a zero-byte file that fails much later in the pipeline.
  const said = parts.find((p) => p.text)?.text ?? JSON.stringify(data).slice(0, 200);
  console.error(`no image returned: ${said}`);
  process.exit(3);
}

await writeFile(OUT, Buffer.from(inline.data, "base64"));
console.log(`DONE:${OUT}`);
```

- [ ] **Step 2: Prove it works on one real generation**

```bash
cd /Users/iam_pratik.p_/Downloads/new_ptmweb/pinktree-proto
mkdir -p public/media/_gen
VERTEX_TOKEN="$(gcloud auth application-default print-access-token)" PROJECT=radlabs-497004 \
  node scripts/gen-image-gemini.mjs public/media/_gen/probe.png \
  "Extreme macro of brushed champagne-gold metal against deep black lacquer, single raking key light, shallow depth of field, haute horlogerie product photography, abstract material study."
```

Expected: prints `DONE:public/media/_gen/probe.png`; `file public/media/_gen/probe.png` reports a PNG over 100 KB.

- [ ] **Step 3: Prove it refuses to bill on a missing prompt**

Run: `node scripts/gen-image-gemini.mjs out.png`
Expected: exit 1, usage line, no network call.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-image-gemini.mjs
git commit -m "feat(scripts): Gemini image generation, Imagen is 404 on this project"
```

---

### Task 4: Motion primitives — one GSAP component, one hook, zero-JS layouts

Applying the ladder: sticky-stacked cards are `position: sticky` and the sector rail is `overflow-x` + `scroll-snap`, both native and both zero JS. Only the pinned manifesto needs ScrollTrigger.

**Files:**
- Create: `src/components/motion/PinnedStatement.tsx`
- Create: `src/lib/use-scroll-velocity.ts`
- Modify: `src/app/globals.css` (append the `.rail` / `.sticky-stack` utility rules)

**Interfaces:**
- Consumes: `loadGsap()` from `src/lib/gsap.ts`; `usePrefersReducedMotion()` from `src/lib/hooks.ts`.
- Produces:
  - `<PinnedStatement className?: string; children: React.ReactNode>` — default export, client component. Pins its section and resolves child words on scroll progress.
  - `useScrollVelocity(): number` — named export from `src/lib/use-scroll-velocity.ts`, returns a clamped −1…1 signal.
  - CSS classes `.rail`, `.rail-item`, `.sticky-stack`, `.sticky-stack-item`.

- [ ] **Step 1: Write `PinnedStatement`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Pins a statement and resolves it word-by-word against scroll progress —
 * the 303.london manifesto beat. Under reduced motion it renders as plain
 * static text with no pin and no ScrollTrigger instance at all.
 */
export default function PinnedStatement({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const el = root.current;
    let ctx: { revert: () => void } | undefined;

    loadGsap().then(({ gsap, ScrollTrigger, SplitText }) => {
      // The element can unmount during the dynamic import.
      if (!el.isConnected) return;
      ctx = gsap.context(() => {
        const target = el.querySelector("[data-pin-text]");
        if (!target) return;
        const split = new SplitText(target, { type: "words" });
        gsap.set(split.words, { opacity: 0.14 });
        gsap.to(split.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 0.6,
          },
        });
        ScrollTrigger.refresh();
      }, el);
    });

    return () => ctx?.revert();
  }, [reduced]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write the velocity hook**

```ts
"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Clamped −1…1 scroll-velocity signal for lean/skew effects. Reads plain
 * scroll position rather than subscribing to Lenis, so it stays correct
 * whether or not smooth scroll is mounted, and decays to 0 when scrolling
 * stops. Returns a constant 0 under reduced motion.
 */
export function useScrollVelocity(): number {
  const [v, setV] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let last = window.scrollY;
    let raf = 0;
    let current = 0;

    const tick = () => {
      const now = window.scrollY;
      const delta = now - last;
      last = now;
      // Ease toward the new delta, then decay — avoids a jittery raw value.
      current += (Math.max(-1, Math.min(1, delta / 60)) - current) * 0.12;
      if (Math.abs(current) < 0.001) current = 0;
      setV(current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return v;
}
```

- [ ] **Step 3: Add the zero-JS layout utilities**

Append to `src/app/globals.css`:

```css
/* Horizontal sector rail — native overflow + snap. This is what the reference
   sites use Swiper for; the platform does it with no JS and no dependency. */
.rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(15rem, 26vw);
  gap: clamp(0.75rem, 1.5vw, 1.5rem);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-inline: var(--gutter);
  scroll-padding-inline: var(--gutter);
}
.rail::-webkit-scrollbar {
  display: none;
}
.rail-item {
  scroll-snap-align: start;
}

/* Sticky-stacked work cards. position: sticky does the whole effect; the
   parent must NOT have overflow clipping or sticky silently stops working. */
.sticky-stack > .sticky-stack-item {
  position: sticky;
  top: calc(var(--header-h) + 1.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .sticky-stack > .sticky-stack-item {
    position: static;
  }
  .rail {
    scroll-snap-type: none;
  }
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/PinnedStatement.tsx src/lib/use-scroll-velocity.ts src/app/globals.css
git commit -m "feat(motion): pinned statement, velocity hook, native rail + sticky stack"
```

---

### Task 5: Sectors section

The one structural gap versus every reference site. Derived from the existing `sector` field on each case study — no invented taxonomy.

**Files:**
- Create: `src/components/sections/Sectors.tsx`
- Read (do not modify): `src/content/index.ts`, `src/content/schema.ts`

**Interfaces:**
- Consumes: `getAllCaseStudies()` from `@/content`; the `.rail` / `.rail-item` classes from Task 4.
- Produces: `<Sectors />` — default export, server component, no props. Task 6 renders it.

- [ ] **Step 1: Note the data overlap before writing code**

Run: `grep -h "sector:" src/content/case-studies/*.ts | sort | uniq -c`
Expected: `"Luxury Events & Hospitality"` ×2, plus `"Beauty & Lifestyle"`, `"Hospitality"`, `"Music & Entertainment"`. Group by the exact string — do **not** merge `"Hospitality"` into `"Luxury Events & Hospitality"`. Merging is a content decision for the client; report it instead.

- [ ] **Step 2: Write the component**

```tsx
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { getAllCaseStudies } from "@/content";

/**
 * Sector rail. Every reference site segments by sector; ours is derived from
 * the `sector` field already on each case study, so it can never drift from
 * the work. Grouping is by exact string — near-duplicates like "Hospitality"
 * vs "Luxury Events & Hospitality" are a content question, not a code one.
 */
export default function Sectors() {
  const bySector = new Map<string, { client: string; slug: string }[]>();
  for (const cs of getAllCaseStudies()) {
    const list = bySector.get(cs.sector) ?? [];
    list.push({ client: cs.client, slug: cs.slug });
    bySector.set(cs.sector, list);
  }
  const sectors = [...bySector.entries()];

  return (
    <section className="section border-y border-(--color-hairline)">
      <div className="container-page">
        <Reveal as="p" className="eyebrow">
          Sectors
        </Reveal>
      </div>

      <ul className="rail mt-10" aria-label="Sectors we work in">
        {sectors.map(([sector, studies], i) => (
          <li key={sector} className="rail-item">
            <TransitionLink href="/work" className="group block">
              <span
                aria-hidden
                className="block font-(family-name:--font-label) text-(--color-accent) text-[clamp(2.5rem,5vw,4rem)] leading-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-h3 transition-colors duration-500 group-hover:text-(--color-accent-ink)">
                {sector}
              </h3>
              <p className="mt-2 text-sm text-(--color-ink-soft)">
                {studies.map((s) => s.client).join(" · ")}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-(--color-ink-soft)">
                View work
                <ArrowUpRight className="size-3.5" />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Verify it renders every sector and scrolls**

Run: `npm run typecheck && npm run lint && npm run build`, then load the home page (after Task 6 wires it in) and confirm the rail scrolls horizontally with the trackpad and snaps.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Sectors.tsx
git commit -m "feat: sector rail derived from case-study data"
```

---

### Task 6: Recompose the home page

**Files:**
- Modify: `src/app/page.tsx` (whole file)
- Modify: `src/components/sections/Hero.tsx:8` (alt text still says "Rosewood ink")

**Interfaces:**
- Consumes: `<Sectors />` (Task 5), `<PinnedStatement>` (Task 4), `.sticky-stack` (Task 4).
- Produces: the new home section order.

- [ ] **Step 1: Reorder to the reference rhythm**

Target order, replacing the current Hero → Who we are → What we do → Selected work → Approach:

1. `<Hero />` — unchanged markup, new media in Task 7
2. **Manifesto** — the existing "Who we are" copy, wrapped in `<PinnedStatement>`
3. `<Sectors />` — new
4. **Selected work** — the existing grid, converted to `.sticky-stack`
5. **Capabilities** — the existing "What we do" cards, moved below work
6. **Approach / CTA** — unchanged

Keep every existing `Reveal`, `SplitHeading`, `TransitionLink` and `WorkCard` usage; this is a reordering plus two wrappers, not a rewrite.

- [ ] **Step 2: Wrap the manifesto**

```tsx
<PinnedStatement className="section container-page">
  <div className="grid gap-y-10 md:grid-cols-12">
    <p className="eyebrow md:col-span-3">Who we are</p>
    <div className="md:col-span-8 md:col-start-5">
      <p
        data-pin-text
        className="font-serif text-h2 font-light leading-[1.15] tracking-tight"
      >
        A luxury creative consultancy handling every aspect of a brand&rsquo;s
        marketing under one roof, quietly, and exceptionally well.
      </p>
    </div>
  </div>
</PinnedStatement>
```

Note the `data-pin-text` hook — `PinnedStatement` looks for exactly this attribute and does nothing without it. `SplitHeading` is removed here because SplitText would run twice on the same node.

- [ ] **Step 3: Convert Selected work to a sticky stack**

Change the work grid wrapper from `grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3` to a single column stack:

```tsx
<div className="sticky-stack mt-8 flex flex-col gap-[15vh]">
  {studies.map((study, i) => (
    <div key={study.slug} className="sticky-stack-item">
      <WorkCard study={study} index={i + 1} ratio="16 / 9" sizes="(min-width: 1024px) 70vw, 100vw" />
    </div>
  ))}
</div>
```

Then check every ancestor of `.sticky-stack` for `overflow-x: clip` or `overflow: hidden` — `body` has `overflow-x: clip` in `globals.css`, which is fine, but a section wrapper with `overflow-hidden` will silently kill sticky. Fix any that do by removing the clip or moving it to a child.

- [ ] **Step 4: Fix the stale hero alt text**

In `src/components/sections/Hero.tsx:8`, replace `"Rosewood ink billowing through water, an ambient brand film."` with alt text describing the new champagne footage, e.g. `"Light travelling slowly across brushed champagne metal, an ambient brand film."`

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run lint && npm run build`, then screenshot the home page and scroll it. Confirm: the manifesto pins and releases, the rail snaps, work cards stack and release, nothing jumps (CLS 0).

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/sections/Hero.tsx
git commit -m "design: recompose home to manifesto / sectors / sticky work"
```

---

### Task 7: Generate and optimise the media set

Budget-approved at roughly $15–25. Generate, review, then optimise — do not wire unreviewed footage into the site.

**Files:**
- Create: `public/media/_gen/**` (working directory, not shipped)
- Modify: `public/media/hero/home.{mp4,webm,jpg}`, `public/media/capabilities/0{1..4}.*`
- Modify: `src/lib/media-blur.json`
- Modify: `src/lib/media.ts` (`CACHE_V`)

**Interfaces:**
- Consumes: `scripts/gen-video-veo.mjs`, `scripts/gen-image-gemini.mjs` (Task 3).
- Produces: replaced assets at existing paths, so no component needs changing.

- [ ] **Step 1: Set the shared art direction**

Every prompt uses this register, and this negative list:

```
NEGATIVE="text, watermark, logo, letters, numbers, people, hands, faces, fast motion, hard cuts, glitch, oversaturated, cartoon, plastic CGI, stock-photo look"
```

Direction: extreme macro, warm metal against near-black, single raking key light, shallow depth of field, imperceptibly slow drift, haute horlogerie product cinematography. Abstract material studies only — never a depicted client, product or person.

- [ ] **Step 2: Generate the five loops**

One hero plus four capability loops matching `CAPABILITIES` in `src/lib/site.ts` (Design & Branding, Print & Merchandise, Websites & Digital, Social Media). Example:

```bash
export VERTEX_TOKEN="$(gcloud auth application-default print-access-token)"
export PROJECT=radlabs-497004 LOCATION=us-central1 ASPECT="16:9"
export NEGATIVE="text, watermark, logo, letters, numbers, people, hands, faces, fast motion, hard cuts, glitch, oversaturated, cartoon, plastic CGI, stock-photo look"

node scripts/gen-video-veo.mjs public/media/_gen/cap-01.mp4 \
  "Extreme macro, imperceptibly slow drift across a foil-embossed champagne monogram pressed into heavy black cotton stock. Single raking key light picks out the debossed edge. Shallow depth of field, haute horlogerie product cinematography, seamless loop."
```

Stop after each and look at the file before generating the next. Re-roll a bad shot rather than accepting it — re-rolls are already in the budget.

- [ ] **Step 3: Encode to the site's format contract**

Per `MEDIA-README.md`, every loop needs MP4 + WebM + a poster, under ~2–3 MB:

```bash
B=public/media/hero/home; S=public/media/_gen/hero-champagne.mp4
ffmpeg -y -i "$S" -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -an -movflags +faststart "$B.mp4"
ffmpeg -y -i "$S" -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -an "$B.webm"
ffmpeg -y -i "$S" -vf "scale=1920:-2" -frames:v 1 -q:v 3 "$B.jpg"
```

- [ ] **Step 4: Generate the stills**

Around 25 via `scripts/gen-image-gemini.mjs` — work heroes, about imagery, footer, sector rail. Resize each to a 2560px master JPEG:

```bash
ffmpeg -y -i public/media/_gen/work-aya.png -vf "scale='min(2560,iw)':-2" -q:v 3 public/media/work/aya/hero.jpg
```

- [ ] **Step 5: Regenerate every blur placeholder**

`src/lib/media-blur.json` is keyed by `/media/...` path with no query string. Regenerate for all shipped images:

```bash
node -e '
const sharp = require("sharp");
const { readdirSync, statSync, writeFileSync } = require("fs");
const { join } = require("path");
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
(async () => {
  const out = {};
  for (const p of walk("public/media").filter((f) => f.endsWith(".jpg"))) {
    const b = await sharp(p).resize(20).blur(1).jpeg({ quality: 40 }).toBuffer();
    out["/" + p.replace(/^public\//, "")] = "data:image/jpeg;base64," + b.toString("base64");
  }
  writeFileSync("src/lib/media-blur.json", JSON.stringify(out, null, 2) + "\n");
  console.log("blur entries:", Object.keys(out).length);
})();
'
```

- [ ] **Step 6: Bust the media cache**

In `src/lib/media.ts`, bump `const CACHE_V = "4"` to `"5"`. Every asset was replaced in place, so without this bump stale optimised variants keep being served.

- [ ] **Step 7: Check the weight budget**

Run: `du -sh public/media && find public/media -name "*.mp4" -size +3M`
Expected: total not meaningfully above the current 23 MB; the `find` prints nothing. Re-encode at a higher CRF anything it lists.

- [ ] **Step 8: Delete the working directory and commit**

```bash
rm -rf public/media/_gen
git add public/media src/lib/media-blur.json src/lib/media.ts
git commit -m "media: champagne-graded loops and stills from Veo + Gemini"
```

---

### Task 8: Sharpen the copy

Structure and claims unchanged; register tightened to match the references. No new metrics.

**Files:**
- Modify: `src/components/sections/Hero.tsx`, `src/app/page.tsx`, `src/lib/site.ts:14`

- [ ] **Step 1: Rewrite only the display lines**

Reference register is short declaratives ("Digital Marketing for Premium & Luxury Brands", "Connecting Premium Brands with High-Net-Worth Audiences"). Tighten the H1 and section headings to that length and confidence. Keep `SITE.description` factually identical — it is used for SEO and structured data.

- [ ] **Step 2: Confirm nothing factual moved**

Run: `git diff --stat` and read the full `git diff` of `src/lib/site.ts`.
Expected: no change to contact details, address, social handles, or any claim about results.

- [ ] **Step 3: Verify and commit**

```bash
npm run typecheck && npm run lint && npm run build
git add src/components/sections/Hero.tsx src/app/page.tsx src/lib/site.ts
git commit -m "copy: tighten display lines to the luxury register"
```

---

### Task 9: Carry inner pages and verify the whole site

**Files:**
- Modify (as needed): `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/components/work/WorkCard.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Header.tsx`

- [ ] **Step 1: Find anything still on the old system**

Run: `grep -rniE "a86b72|8e4f57|d8c2c5|rosewood|font-display" src/ --include=*.tsx --include=*.ts`
Expected: no stale hexes. Every `font-display` usage should now read as serif — check each one still suits a serif face, and switch label-like usages to `font-(family-name:--font-label)`.

- [ ] **Step 2: Walk all five pages**

Screenshot at 1440×900 and 390×844: `/`, `/work`, `/work/the-chigwell-marquees`, `/about`, `/contact`.
Confirm on each: champagne accents only, serif headings, no overflow, no layout jump.

- [ ] **Step 3: Verify reduced motion genuinely disables everything**

Emulate `prefers-reduced-motion: reduce`, reload `/`, and confirm: no pin, no snap, work cards static, video shows poster only.

- [ ] **Step 4: Full gate**

Run: `node scripts/check-contrast.mjs && npm run typecheck && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 5: Confirm performance held**

Run a production Lighthouse (`npm run build && npm start`, then audit `/`).
Expected: desktop performance/a11y/best-practices/SEO at or above the `HANDOFF.md` baseline of 100/100/100/100, CLS still 0. If performance dropped, the likely causes in order are: video weight (Task 7 Step 7), the ScrollTrigger pin forcing layout, and the rail's image `sizes`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "design: carry champagne system across work, about and contact"
```

---

## Self-Review

**Spec coverage:** palette → Task 1 · typography → Task 2 · motion → Tasks 4, 6 · sectors → Task 5 · media → Tasks 3, 7 · copy → Task 8 · inner pages → Task 9 · constraints → Global Constraints, gated in Tasks 1, 4, 9.

**Type consistency:** `--color-accent-on-dark` is introduced in Task 1 and used in Tasks 2 and 9. `data-pin-text` is defined by `PinnedStatement` (Task 4) and supplied in Task 6. `.rail`/`.rail-item` are defined in Task 4 and consumed in Task 5. `.sticky-stack`/`.sticky-stack-item` are defined in Task 4 and consumed in Task 6. `gen-image-gemini.mjs`'s CLI contract is defined in Task 3 and called in Task 7.

**Known gap, deliberate:** the `"Hospitality"` vs `"Luxury Events & Hospitality"` overlap is surfaced in Task 5 Step 1 and left unresolved — merging sectors is the client's content decision, not an implementation detail.
