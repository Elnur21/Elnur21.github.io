// Browser side of the smart answers. A module-level singleton, so the model
// stays loaded when the chat panel is closed and reopened.
import { MODEL, DTYPE, prepareIndex } from "./smart";

const PREFERENCE_KEY = "chat-smart";
const EMBED_TIMEOUT = 5000;

let worker = null;
let index = null;
let modelReady = false;
let status = { state: "off", progress: 0 }; // off | loading | ready | error
const listeners = new Set();
const pending = new Map();
let nextId = 0;

const update = (patch) => {
  status = { ...status, ...patch };
  listeners.forEach((listener) => listener(status));
};

export const getStatus = () => status;
export const getIndex = () => index;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const readPreference = () => {
  try {
    return localStorage.getItem(PREFERENCE_KEY);
  } catch {
    return null;
  }
};

const savePreference = (value) => {
  try {
    localStorage.setItem(PREFERENCE_KEY, value);
  } catch {}
};

// Desktop visitors get smart answers by default; on phones and with
// data saver on, the ~118 MB model is only downloaded when asked for
export const shouldAutoEnable = () => {
  const saved = readPreference();
  if (saved) return saved === "on";
  const saveData = navigator.connection?.saveData;
  const small = window.matchMedia("(max-width: 700px)").matches;
  return !saveData && !small;
};

const checkReady = () => {
  if (modelReady && index) update({ state: "ready", progress: 100 });
};

export const enable = () => {
  savePreference("on");
  if (worker) return;
  update({ state: "loading", progress: 0 });

  worker = new Worker(new URL("./semantic.worker.js", import.meta.url), { type: "module" });
  worker.onmessage = ({ data }) => {
    if (data.type === "progress") update({ progress: data.progress });
    if (data.type === "ready") {
      modelReady = true;
      checkReady();
    }
    if (data.type === "error") update({ state: "error" });
    if (data.type === "vector") {
      pending.get(data.id)?.(data.vector);
      pending.delete(data.id);
    }
  };
  worker.onerror = () => update({ state: "error" });
  worker.postMessage({ type: "load", model: MODEL, dtype: DTYPE });

  fetch("/chat/index.json")
    .then((res) => res.json())
    .then((raw) => {
      index = prepareIndex(raw);
      checkReady();
    })
    .catch(() => update({ state: "error" }));
};

export const disable = () => {
  savePreference("off");
  worker?.terminate();
  worker = null;
  modelReady = false;
  pending.clear();
  update({ state: "off", progress: 0 });
};

// The question as a vector, or null if the model isn't ready or is too slow
export const embed = (text) =>
  new Promise((resolve) => {
    if (status.state !== "ready") return resolve(null);
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      resolve(null);
    }, EMBED_TIMEOUT);
    pending.set(id, (vector) => {
      clearTimeout(timer);
      resolve(vector);
    });
    worker.postMessage({ type: "embed", id, text });
  });
