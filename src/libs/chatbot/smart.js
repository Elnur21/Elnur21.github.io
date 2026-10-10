// "Smart" answers: semantic matching with a multilingual embedding model
// (Transformers.js, run in a Web Worker; see semantic.worker.js).
//
// The rule-based engine always answers first. The smart layer only steps in
// when the rules were unsure, or when it finds a specific passage that answers
// the question better than a broad topic menu. It never generates text: every
// answer is the site's own content, so it can't make anything up.

import { normalize, tokenize } from "./engine";

export const MODEL = "Xenova/multilingual-e5-small";
export const DTYPE = "q8";
export const MODEL_SIZE_MB = 118;

// Thresholds calibrated on English, Azerbaijani and Russian questions
// (e5 similarities sit in a narrow band: unrelated text still scores ~0.80)
const INTENT_STRONG = 0.93;
const INTENT_OK = 0.9;
const INTENT_MARGIN = 0.02; // over the next-best intent
const PASSAGE_OK = 0.86;
const PASSAGE_OVER_TOPIC = 0.88; // to replace a broad keyword topic
const OVERLAP_WEIGHT = 0.06; // bonus for sharing actual words with the passage
const TOPIC_ITSELF = 0.91; // the question is about the matched topic as a whole

// Answers the rules already got right; the smart layer leaves these alone
const CONFIDENT = ["small", "company", "specific", "tech"];
// Keyword answers that are only loosely related (a topic menu, a hobby matched
// by one word); a precise passage is a better answer
const BROAD = ["projects", "skills", "experience", "blog", "about", "pages", "ml", "mobile", "research"];

const decode = (b64) => {
  const binary = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const bytes = new Int8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = (binary.charCodeAt(i) << 24) >> 24;
  return bytes;
};

// Turns public/chat/index.json into typed arrays ready for search
export const prepareIndex = (raw) => ({
  dims: raw.dims,
  // Words of the passage plus its context (post title, section heading)
  chunks: raw.chunks.map((chunk) => ({ ...chunk, plain: normalize(`${chunk.c || ""} ${chunk.t}`) })),
  passages: decode(raw.vectors),
  intentIds: raw.intents.ids,
  intents: decode(raw.intents.vectors),
});

const similarity = (query, matrix, row, dims) => {
  let sum = 0;
  for (let i = 0, offset = row * dims; i < dims; i++) sum += query[i] * matrix[offset + i];
  return sum / 127;
};

// Share of the question's words (by their first 5 letters, to survive
// endings like imbalanced/imbalance) that appear in the passage
const overlap = (words, plain) => {
  if (!words.length) return 0;
  return words.filter((w) => plain.includes(w.slice(0, 5))).length / words.length;
};

export const bestIntent = (index, vector) => {
  const best = {};
  index.intentIds.forEach((id, row) => {
    const s = similarity(vector, index.intents, row, index.dims);
    if (!(id in best) || s > best[id]) best[id] = s;
  });
  const [first, second] = Object.entries(best).sort((a, b) => b[1] - a[1]);
  return { id: first[0], score: first[1], margin: first[1] - (second?.[1] ?? 0) };
};

export const bestPassage = (index, vector, text, lang) => {
  const words = tokenize(text, lang).map(normalize).filter((w) => w.length >= 3);
  let best = null;
  index.chunks.forEach((chunk, row) => {
    if (chunk.l !== lang) return;
    const score = similarity(vector, index.passages, row, index.dims) + OVERLAP_WEIGHT * overlap(words, chunk.plain);
    if (!best || score > best.score) best = { chunk, score };
  });
  return best;
};

// rule: the rule-based answer (with .kind, .intent, .lang); vector: the
// embedded question. Returns a better answer, or null to keep the rule's.
export function smartAnswer({ bot, index, vector, text, rule }) {
  if (CONFIDENT.includes(rule.kind)) return null;
  const lang = rule.lang;
  const intent = bestIntent(index, vector);
  const passage = bestPassage(index, vector, text, lang);
  const clearIntent = intent.margin >= INTENT_MARGIN;
  const smart = (answer) => answer && { ...answer, lang, smart: true };

  // The rules found a broad topic by keyword: only a very good passage beats it
  if (rule.kind === "topic" || rule.kind === "hobby") {
    // "chess" or "шахматы" is about the hobby, so the hobby answer stays; a real
    // question that merely contains a hobby word ("…в игре UNO") may get a passage
    const aboutHobby = passage?.chunk.k === "hobby" || text.trim().split(/\s+/).length <= 2;
    if (rule.kind === "hobby" && aboutHobby) return null;
    // A different, specific intent the model is sure about ("how was this website built?")
    if (clearIntent && intent.score >= INTENT_STRONG && intent.id !== rule.intent && !BROAD.includes(intent.id))
      return smart(bot.intent(intent.id, lang));
    // Short requests ("блог", "mobile apps") and questions the model also reads
    // as that same topic want the topic overview, not one paragraph
    const words = text.trim().split(/\s+/).length;
    const isQuestion = words >= 4 || (words >= 3 && text.trim().endsWith("?"));
    const askedForTopic = intent.id === rule.intent && intent.score >= TOPIC_ITSELF;
    const loose = rule.kind === "hobby" || BROAD.includes(rule.intent);
    if (loose && isQuestion && !askedForTopic && passage?.score >= PASSAGE_OVER_TOPIC)
      return smart(bot.passage(passage.chunk, lang));
    return null;
  }

  // The rules were unsure (search results, "did you mean", or nothing)
  if (clearIntent && intent.score >= INTENT_STRONG) return smart(bot.intent(intent.id, lang));
  if (passage?.score >= PASSAGE_OK) return smart(bot.passage(passage.chunk, lang));
  if (clearIntent && intent.score >= INTENT_OK) return smart(bot.intent(intent.id, lang));
  return null;
}
