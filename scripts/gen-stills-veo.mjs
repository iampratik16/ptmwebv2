/**
 * Elite still imagery via Veo frames.
 *
 * Imagen is 404 for this project on every model name and region tried
 * (imagen-4.0 / 4.0-fast / 3.0 / imagegeneration@006 across us-central1,
 * us-east4, europe-west4), so a still is the best frame of a short Veo clip.
 * If Imagen is ever enabled, gen-media-vertex.mjs renders these natively and
 * sharper — this script is the fallback, not the preference.
 *
 *   VERTEX_TOKEN=$(gcloud auth application-default print-access-token) \
 *   PROJECT=radlabs-497004 node scripts/gen-stills-veo.mjs chigwell aya swifty
 *
 * Writes candidate frames to public/media/_preview/<slug>-{1,2,3}.jpg for
 * curation. Nothing overwrites a live asset until a pick is promoted.
 */
import { execFile } from "node:child_process";
import { mkdir, readdir, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PREVIEW = join(ROOT, "public", "media", "_preview");

// The register, in one string. Photographic is the operative word: the imagery
// this replaces reads as CGI, which is what stops it feeling elite.
const STYLE =
  "Photographed on medium format film, 80mm lens, natural directional window light, " +
  "restrained warm palette of bone, ivory, champagne, oyster and muted rosewood, " +
  "low saturation, no colour cast, soft true-to-life shadows, immaculate surface detail, " +
  "generous negative space, unhurried editorial luxury photography, photorealistic, fine grain. " +
  "No text, no logos, no watermarks, no brand marks, no readable faces.";

const NEGATIVE =
  "3D render, CGI, digital art, illustration, video game render, plastic surfaces, " +
  "oversaturated colours, neon, hot pink, magenta, teal and orange grade, HDR halo, " +
  "lens flare, glossy artificial highlights, cluttered, busy, crowds, stock photo look, " +
  "watermark, text, logo, brand name, distorted hands, extra fingers";

// One entry per case study. Subjects come from the studies themselves; the
// register comes from STYLE, so a subject can be re-shot without drift.
const SPECS = {
  chigwell: {
    w: 2560, h: 1600,
    subject:
      "A clear-span glass marquee at blue hour on an English country estate. Ivory linen tables run " +
      "away from camera, tall pale garden-rose and foliage arrangements, candle hurricanes just lit, " +
      "crystal glassware and brushed brass catching the last light, mown lawn and mature trees beyond. " +
      "Camera low and static, shallow depth of field. Nobody present.",
  },
  aya: {
    w: 2560, h: 1600,
    subject:
      "Editorial beauty still life. Unbranded frosted glass skincare bottles with brushed metal collars " +
      "standing on a warm travertine ledge, one blush garden rose laid beside them, a fold of oyster silk. " +
      "Hard morning window light rakes across from the right, throwing long soft shadows. Deep negative " +
      "space at left. Camera drifts a few millimetres only.",
  },
  swifty: {
    w: 2560, h: 1600,
    subject:
      "A vinyl record resting on a walnut turntable plinth, brushed brass tonearm, in a panelled room at " +
      "dusk. One warm lamp off frame right, the rest of the room falling into shadow. A crystal tumbler " +
      "and a folded charcoal jacket at the edge of frame. Slow, minimal camera drift. Nobody present.",
  },
  central: {
    w: 2560, h: 1600,
    subject:
      "A quiet luxury retail interior at first opening: pale plaster walls, a single travertine plinth, " +
      "one folded cashmere throw in oyster, brushed brass rail, morning light falling through tall glass. " +
      "Immaculate and almost empty. Camera pushes in very slowly.",
  },
  "north-mymms": {
    w: 2560, h: 1600,
    subject:
      "A Georgian country house at golden hour seen across still parkland, warm stone catching low sun, " +
      "long shadows from mature oaks, mist beginning to settle in the hollow. Calm, unpeopled, expensive. " +
      "Camera static or drifting a metre at most.",
  },
};

const TOKEN = process.env.VERTEX_TOKEN;
const PROJECT = process.env.PROJECT ?? "radlabs-497004";
if (!TOKEN) {
  console.error("Missing VERTEX_TOKEN (use: gcloud auth application-default print-access-token)");
  process.exit(1);
}

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error(`Usage: node scripts/gen-stills-veo.mjs <slug>...\nKnown: ${Object.keys(SPECS).join(", ")}`);
  process.exit(1);
}

await mkdir(PREVIEW, { recursive: true });

for (const slug of slugs) {
  const spec = SPECS[slug];
  if (!spec) {
    console.error(`unknown slug: ${slug}`);
    continue;
  }
  const clip = join(PREVIEW, `${slug}.mp4`);
  console.log(`→ ${slug}: generating clip`);
  try {
    await run("node", [join(ROOT, "scripts", "gen-video-veo.mjs"), clip, `${spec.subject} ${STYLE}`], {
      env: { ...process.env, VERTEX_TOKEN: TOKEN, PROJECT, NEGATIVE, ASPECT: "16:9" },
      maxBuffer: 1 << 24,
    });
  } catch (e) {
    console.error(`  clip failed: ${e.message?.slice(0, 200)}`);
    continue;
  }

  // Three candidates across the clip — a drifting camera means the sharpest,
  // best-composed frame is rarely the first one.
  console.log(`→ ${slug}: extracting candidates`);
  for (const [i, t] of [2, 4, 6].entries()) {
    const raw = join(PREVIEW, `${slug}-${i + 1}-raw.png`);
    await run("ffmpeg", ["-v", "error", "-y", "-ss", String(t), "-i", clip, "-frames:v", "1", raw]);
    await sharp(raw)
      .resize(spec.w, spec.h, { fit: "cover", position: "attention", kernel: "lanczos3" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(PREVIEW, `${slug}-${i + 1}.jpg`));
    await unlink(raw);
  }
  console.log(`  ✓ ${slug}-1.jpg ${slug}-2.jpg ${slug}-3.jpg`);
}

const made = (await readdir(PREVIEW)).filter((f) => f.endsWith(".jpg"));
console.log(`\n${made.length} candidates in public/media/_preview/`);
