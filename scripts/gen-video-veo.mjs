/**
 * Generates a hero video via Vertex AI Veo. Text-to-video by default; set
 * INIT_IMAGE=<path> for image-to-video (e.g. from the hero still, so the clip
 * matches its poster). Auth via env VERTEX_TOKEN + PROJECT.
 *
 *   node scripts/gen-video-veo.mjs <out.mp4> "<prompt>"
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = process.env.VERTEX_TOKEN;
const PROJECT = process.env.PROJECT;
const LOCATION = process.env.LOCATION ?? "us-central1";
const OUT = process.argv[2] ?? join(ROOT, "public", "media", "hero", "home-veo.mp4");
const ASPECT = process.env.ASPECT ?? "16:9";

const MODELS = ["veo-3.0-fast-generate-001", "veo-2.0-generate-001"];
// Required, not defaulted. A silent fallback here bills a full generation and
// returns footage nobody asked for — which is exactly what happened when a
// caller was run against the older copy of this script that ignored argv.
const PROMPT = process.argv[3];
if (!PROMPT) {
  console.error("no prompt: pass it as argv[3]. Refusing to bill a generation for a default.");
  process.exit(1);
}

const base = (m) =>
  `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${m}`;

async function tryModel(model, imgB64) {
  const body = {
    instances: [
      imgB64
        ? { prompt: PROMPT, image: { bytesBase64Encoded: imgB64, mimeType: "image/jpeg" } }
        : { prompt: PROMPT },
    ],
    parameters: {
      aspectRatio: ASPECT,
      sampleCount: 1,
      generateAudio: false,
      // Veo 3 renders 1080p natively; Veo 2 rejects the field, and the caller
      // already falls back to it on a 4xx.
      ...(model.startsWith("veo-3") ? { resolution: "1080p" } : {}),
      // Shared reject-list (env NEGATIVE) — one string for every shot in a pack,
      // so six separate generations fail the same way or not at all.
      ...(process.env.NEGATIVE ? { negativePrompt: process.env.NEGATIVE } : {}),
    },
  };
  const submit = await fetch(`${base(model)}:predictLongRunning`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!submit.ok) {
    console.log(`  ${model}: submit HTTP ${submit.status} — ${(await submit.text()).slice(0, 160)}`);
    return null;
  }
  const { name } = await submit.json();
  console.log(`  ${model}: op submitted, polling…`);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const poll = await fetch(`${base(model)}:fetchPredictOperation`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ operationName: name }),
    });
    if (!poll.ok) {
      console.log(`  poll HTTP ${poll.status}`);
      continue;
    }
    const op = await poll.json();
    if (op.done) {
      if (op.error) {
        console.log(`  ${model}: op error ${JSON.stringify(op.error).slice(0, 200)}`);
        return null;
      }
      const r = op.response ?? {};
      const sample =
        r.videos?.[0]?.bytesBase64Encoded ??
        r.generatedSamples?.[0]?.video?.uri ??
        r.predictions?.[0]?.bytesBase64Encoded;
      const gcs = r.videos?.[0]?.gcsUri ?? r.generatedSamples?.[0]?.video?.uri;
      if (sample && sample.length > 500) {
        await writeFile(OUT, Buffer.from(sample, "base64"));
        console.log(`  ✓ ${model}: wrote ${OUT}`);
        return OUT;
      }
      if (gcs) {
        console.log(`  ${model}: video at GCS ${gcs}`);
        await writeFile(OUT + ".gcs.txt", gcs);
        return OUT + ".gcs.txt";
      }
      console.log(`  ${model}: done but no video payload: ${JSON.stringify(op).slice(0, 200)}`);
      return null;
    }
    console.log(`  …polling (${(i + 1) * 10}s)`);
  }
  console.log(`  ${model}: timed out`);
  return null;
}

async function main() {
  const initImage = process.env.INIT_IMAGE;
  const imgB64 = initImage
    ? (await readFile(initImage)).toString("base64")
    : null;
  for (const model of MODELS) {
    const out = await tryModel(model, imgB64);
    if (out) {
      console.log(`DONE:${out}`);
      return;
    }
  }
  console.log("VEO_FAILED");
  process.exit(2);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
