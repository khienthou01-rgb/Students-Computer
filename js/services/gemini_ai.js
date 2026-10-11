/**
 * ==========================================================================
 * Service: GeminiAIService (សេវាឆ្លាតវៃ Google Gemini AI)
 * Powered by Google Gemini 3.8 Flash Vision API
 * ==========================================================================
 */

const GeminiAIService = {
  DEFAULT_API_KEY: "",
  DEFAULT_MODEL: "gemini-3.8-flash",
  FALLBACK_MODELS: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"],
  STORAGE_KEY: "master_school_gemini_config",

  getConfig() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey) {
          return {
            apiKey: parsed.apiKey.trim() || this.DEFAULT_API_KEY,
            model: parsed.model || this.DEFAULT_MODEL,
            enabled: parsed.enabled !== false
          };
        }
      }
    } catch (e) {}

    const appKey = (typeof APP_CONFIG !== "undefined" && (APP_CONFIG.geminiApiKey || (APP_CONFIG.geminiConfig && APP_CONFIG.geminiConfig.apiKey)))
      ? (APP_CONFIG.geminiApiKey || APP_CONFIG.geminiConfig.apiKey)
      : this.DEFAULT_API_KEY;

    return {
      apiKey: appKey || this.DEFAULT_API_KEY,
      model: this.DEFAULT_MODEL,
      enabled: true
    };
  },

  saveConfig(config) {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  getApiKey() {
    return this.getConfig().apiKey || this.DEFAULT_API_KEY;
  },

  getModel() {
    return this.getConfig().model || this.DEFAULT_MODEL;
  },

  /**
   * Test connection to Gemini API
   */
  async testConnection(customKey = null) {
    const apiKey = (customKey || this.getApiKey()).trim();
    if (!apiKey) {
      return { success: false, error: "សូមបញ្ចូល API Key ជាមុនសិន" };
    }

    const startTime = performance.now();
    const model = this.getModel();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello! Respond with OK." }] }]
        })
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        const errMsg = (errJson.error && errJson.error.message) ? errJson.error.message : `HTTP error ${resp.status}`;
        return { success: false, error: errMsg, status: resp.status };
      }

      const data = await resp.json();
      return {
        success: true,
        latencyMs,
        model,
        reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "OK"
      };
    } catch (err) {
      return { success: false, error: err.message || "Failed to reach Gemini API" };
    }
  },

  /**
   * Convert Canvas or Image to clean JPEG base64 (stripped of data url prefix)
   */
  prepareBase64Image(source, maxWidth = 800) {
    let canvas = null;
    if (source instanceof HTMLCanvasElement) {
      canvas = source;
    } else if (source instanceof HTMLImageElement) {
      canvas = document.createElement("canvas");
      canvas.width = source.naturalWidth || source.width || 600;
      canvas.height = source.naturalHeight || source.height || 800;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(source, 0, 0);
    } else if (typeof source === "string" && source.startsWith("data:")) {
      const match = source.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        return { mimeType: `image/${match[1]}`, base64Data: match[2] };
      }
    }

    if (canvas) {
      let w = canvas.width;
      let h = canvas.height;
      if (w > maxWidth) {
        const scale = maxWidth / w;
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const sc = document.createElement("canvas");
        sc.width = w;
        sc.height = h;
        const sctx = sc.getContext("2d");
        sctx.drawImage(canvas, 0, 0, w, h);
        canvas = sc;
      }
      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      return { mimeType: "image/jpeg", base64Data };
    }

    return null;
  },

  /**
   * Smart Portrait & Background Analysis with Gemini 3.8 Flash Vision
   */
  async analyzePortrait(source, options = {}) {
    const prep = this.prepareBase64Image(source);
    if (!prep) {
      throw new Error("Invalid image source for AI analysis");
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("Gemini API Key is not configured");
    }

    // Direct Gemini Vision API call with model fallback chain
    const prompt = `
You are a master photographer and studio director for Tian Xin International School.
Analyze this student portrait image specifically for Cambodian School ID Card and Passport standards:
1. Face framing & posture (Centered, head straight, shoulders balanced)
2. Background cleanliness (Uniform vs messy, easy to remove/mat)
3. Lighting & shadows (Even illumination, no harsh contrast)
4. Recommend best school studio background color: Studio Blue (#1e40af), Navy (#1e3a8a), Pure White (#ffffff), or Transparent PNG.
5. Provide precise auto-tune parameter adjustments.

Return strictly a valid JSON object matching this schema without any markdown formatting:
{
  "score": 88,
  "summary_kh": "រូបថតមានពន្លឺច្បាស់ស្មើល្អ សមស្របសម្រាប់ធ្វើកាតសិស្ស និងលុប Background",
  "background_quality": "good",
  "background_advice_kh": "ផ្ទៃក្រោយងាយស្រួលកាត់។ ណែនាំឱ្យដាក់ពណ៌ខៀវ Studio Blue (#1e40af) ឬកាត់ជា Transparent PNG",
  "lighting_quality": "good",
  "lighting_advice_kh": "ពន្លឺលើផ្ទៃមុខភ្លឺស្មើ គ្មានស្រមោលរំខាន",
  "recommended_bg": "studio_blue",
  "suggested_settings": {
    "bgType": "color",
    "bgColor": "#1e40af",
    "bgColor2": "#38bdf8",
    "exposure": 2,
    "contrast": 4,
    "sharpness": 22,
    "bgThreshold": 35,
    "bgFeather": 2
  },
  "tips_kh": [
    "ប្រើជម្រើស Studio Blue សម្រាប់កាតសិស្សផ្លូវការ",
    "ចុច 1-Click AI Remove ដើម្បីទទួលបាន Transparent PNG កម្រិតខ្ពស់"
  ]
}
`.trim();

    const postPayload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: prep.mimeType, data: prep.base64Data } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    let lastError = null;
    for (const model of this.FALLBACK_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload)
        });

        if (resp.status === 503 || resp.status === 429) {
          continue;
        }

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API Error ${resp.status}`);
        }

        const data = await resp.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Empty response from Gemini AI");

        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
        const parsed = JSON.parse(cleaned);
        parsed._modelUsed = model;
        return parsed;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to process image with Gemini AI");
  }
};

window.GeminiAIService = GeminiAIService;
