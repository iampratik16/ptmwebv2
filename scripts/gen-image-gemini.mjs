/**
 * Generates a still via Vertex AI Gemini image generation.
 * Imagen 404s on this project in every region tried, so this is the image path
 * for the whole site. Note the shape differs from the Imagen scripts: Gemini
 * uses :generateContent with responseModalities, not :predict.
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
// Required, not defaulted. A silent default bills a generation and returns
// artwork nobody asked for — same rule as gen-video-veo.mjs.
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
