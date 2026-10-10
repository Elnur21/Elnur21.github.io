// Runs the embedding model off the main thread, so the page never freezes
// while the model loads or a question is embedded.
import { pipeline, env } from "@huggingface/transformers";

// Models come from the Hugging Face hub and are cached by the browser
env.allowLocalModels = false;

let extractor = null;

self.onmessage = async ({ data }) => {
  if (data.type === "load") {
    try {
      const progress = {};
      extractor = await pipeline("feature-extraction", data.model, {
        dtype: data.dtype,
        // Report overall download progress across the model's files
        progress_callback: (p) => {
          if (p.status !== "progress" || !p.total) return;
          progress[p.file] = { loaded: p.loaded, total: p.total };
          const files = Object.values(progress);
          const loaded = files.reduce((sum, f) => sum + f.loaded, 0);
          const total = files.reduce((sum, f) => sum + f.total, 0);
          self.postMessage({ type: "progress", progress: Math.round((loaded / total) * 100) });
        },
      });
      self.postMessage({ type: "ready" });
    } catch (error) {
      self.postMessage({ type: "error", message: String(error?.message || error) });
    }
  }

  if (data.type === "embed" && extractor) {
    // e5 models expect questions to start with "query: "
    const tensor = await extractor(`query: ${data.text}`, { pooling: "mean", normalize: true });
    self.postMessage({ type: "vector", id: data.id, vector: Array.from(tensor.data) });
  }
};
