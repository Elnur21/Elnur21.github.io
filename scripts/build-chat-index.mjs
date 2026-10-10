// Builds the semantic index the chat assistant uses for "smart" answers.
//
//   npm run chat-index
//
// Splits the site's content (blog posts, experience, projects, hobbies) into
// passages in English, Azerbaijani and Russian, embeds them together with the
// example questions in src/libs/chatbot/intentExamples.mjs, and writes
// public/chat/index.json. Run it again after editing content.
//
// The browser loads the same model to embed the visitor's question, so only
// one sentence is embedded client-side; everything else is precomputed here.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "@huggingface/transformers";

import { INTENT_EXAMPLES } from "../src/libs/chatbot/intentExamples.mjs";

export const MODEL = "Xenova/multilingual-e5-small";
export const DTYPE = "q8";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = path.join(ROOT, "src/pages/api");
const OUT = path.join(ROOT, "public/chat/index.json");
const LANGS = ["en", "az", "ru"];

const read = (file) => JSON.parse(fs.readFileSync(path.join(API, file), "utf8"));
const localize = (item, lang) => {
  const { az, ru, ...base } = item;
  return { ...base, ...({ az, ru }[lang] || {}) };
};
const blogsIn = (lang) => {
  const posts = read("blogs.json");
  if (lang === "en") return posts;
  const translated = Object.fromEntries(read(`blogs.${lang}.json`).map((p) => [p.slug, p]));
  return posts.map((p) => translated[p.slug] || p);
};

/* ---------- Passages ---------- */

// k: kind, r: reference (post slug, job id, project source URL), t: text shown
// as the answer, c: context (post title, section heading) used for matching
const chunks = [];
const add = (lang, k, r, t, c = "") => {
  if (t && t.trim().length > 25) chunks.push({ l: lang, k, r, t: t.trim(), c });
};

for (const lang of LANGS) {
  for (const post of blogsIn(lang)) {
    add(lang, "post", post.slug, post.summary, post.title);
    let heading = "";
    for (const block of post.body) {
      if (typeof block === "string") add(lang, "post", post.slug, block, `${post.title}. ${heading}`);
      else if (block.h) heading = block.h;
      else if (block.list) add(lang, "post", post.slug, block.list.map((i) => `• ${i}`).join("\n"), `${post.title}. ${heading}`);
      else if (block.img && block.caption) add(lang, "post", post.slug, block.caption, post.title);
    }
  }
  for (const job of read("experience.json").map((j) => localize(j, lang)))
    add(lang, "job", String(job.id), `${job.role} — ${job.company}, ${job.period}. ${job.description}`, job.tags.join(", "));
  for (const file of ["js-projects.json", "ml-projects.json", "bots-projects.json"])
    for (const p of read(file).map((x) => localize(x, lang)))
      add(lang, "project", p.source_code, `${p.name}: ${p.description}`, p.tags.join(", "));
  for (const h of read("hobbies.json").map((x) => localize(x, lang)))
    add(lang, "hobby", String(h.id), `${h.title}: ${h.description}`, h.tags.join(", "));
}

const intents = Object.entries(INTENT_EXAMPLES).flatMap(([id, examples]) => examples.map((text) => ({ id, text })));

/* ---------- Embedding ---------- */

console.log(`Loading ${MODEL} (${DTYPE})...`);
const embed = await pipeline("feature-extraction", MODEL, { dtype: DTYPE });

// e5 models expect "query: " for questions and "passage: " for documents
const vectors = async (texts, prefix) => {
  const out = [];
  for (let i = 0; i < texts.length; i += 32) {
    const batch = texts.slice(i, i + 32).map((t) => prefix + t);
    const tensor = await embed(batch, { pooling: "mean", normalize: true });
    out.push(...tensor.tolist());
    process.stdout.write(`\r  ${prefix}${Math.min(i + 32, texts.length)}/${texts.length}`);
  }
  process.stdout.write("\n");
  return out;
};

const passageVectors = await vectors(chunks.map((c) => `${c.c ? `${c.c}. ` : ""}${c.t}`), "passage: ");
const intentVectors = await vectors(intents.map((i) => i.text), "query: ");

// Normalised vectors are in [-1, 1]; store them as int8 to keep the file small
const pack = (rows) => {
  const bytes = new Int8Array(rows.length * rows[0].length);
  rows.forEach((row, r) => row.forEach((v, i) => (bytes[r * row.length + i] = Math.round(v * 127))));
  return Buffer.from(bytes.buffer).toString("base64");
};

const index = {
  model: MODEL,
  dtype: DTYPE,
  dims: passageVectors[0].length,
  intents: { ids: intents.map((i) => i.id), vectors: pack(intentVectors) },
  chunks,
  vectors: pack(passageVectors),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(index));
console.log(`Wrote ${path.relative(ROOT, OUT)}: ${chunks.length} passages, ${intents.length} intent examples, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
