import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

export async function generateWithFallback(prompt) {
  let lastErr = null;
  for (const model of FALLBACK_MODELS) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      if (res?.text) {
        return res.text;
      }
    } catch (err) {
      lastErr = err;
      // Continue to next fallback model if 404, 503, or 429 occurs
      console.warn(`[Gemini] Model ${model} failed, trying fallback:`, err.message || err);
    }
  }
  throw lastErr || new Error("All Gemini models failed to respond");
}

export default ai;