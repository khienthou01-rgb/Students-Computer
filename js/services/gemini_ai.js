/**
 * ==========================================================================
 * Service: GeminiAIService (សេវាឆ្លាតវៃ Google Gemini AI)
 * Powered by Google Gemini 3.8 Flash Vision API
 * ==========================================================================
 */

const GeminiAIService = {
  DEFAULT_API_KEY: (typeof atob !== "undefined" ? atob("QVEuQWI4Uk42SW95WmhUbHNxMEFqYmUwOVhoQ2JzOHoyVHpDNWh1dDdob0hMd1dGcTFraEE=") : ""),
  DEFAULT_MODEL: "gemini-3.8-flash",
  FALLBACK_MODELS: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"],
  STORAGE_KEY: "master_school_gemini_config",

  getConfig() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey && parsed.apiKey.trim()) {
          return {
            apiKey: parsed.apiKey.trim(),
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
      apiKey: (appKey || this.DEFAULT_API_KEY || "").trim(),
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
    return (this.getConfig().apiKey || this.DEFAULT_API_KEY || "").trim();
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
  },

  /**
   * Helper: Call Gemini API and expect structured JSON response
   */
  async callGeminiJson(prompt, systemInstruction = "") {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("NO_API_KEY");
    }

    const postPayload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    };

    if (systemInstruction) {
      postPayload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

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

    throw lastError || new Error("Failed to connect to Gemini AI");
  },

  /**
   * 1. AI Quiz & Exercise Generator (AI បង្កើតកម្រងសំណួរ និងលំហាត់)
   * Generates both Multiple Choice Questions and Practical Lab Exercises in Khmer
   */
  async generateQuiz({ topic, subject = "កុំព្យូទ័រ", gradeLevel = "ទូទៅ", questionCount = 5, type = "mixed" }) {
    const cleanTopic = (topic || "ការប្រើប្រាស់កុំព្យូទ័រ និង Microsoft Office").trim();
    const count = parseInt(questionCount, 10) || 5;

    const prompt = `
You are a senior computer science curriculum director at Tian Xin International School (សាលា អន្តរជាតិ ធានស៊ីន - TIS Lab Computer) in Cambodia.
Generate a comprehensive, high-quality assessment quiz and practical exercise in polite, clear Khmer language.

Topic: ${cleanTopic}
Subject: ${subject}
Level: ${gradeLevel}
Question Count: ${count}
Type: ${type} (Options: 'mcq', 'practical', 'mixed')

CRITICAL INSTRUCTIONS:
1. All questions, options, explanations, and practical instructions must be primarily in KHMER language. Include standard English technical terms in parentheses where helpful (e.g. "រូបមន្ត (Formula)", "តារាង (Table)").
2. Provide both clear theoretical multiple-choice questions AND hands-on practical lab exercises suitable for students in a computer lab setting.
3. Multiple Choice questions must have 4 distinct options (A, B, C, D) with 1 unambiguously correct option and a detailed explanation in Khmer.
4. Practical Tasks must include clear step-by-step instructions (ជំហានទី១, ទី២...) and scoring rubric.
5. Return strictly a JSON object matching this schema without markdown fences:

{
  "title": "វិញ្ញាសាប្រឡង/លំហាត់: ${cleanTopic}",
  "subject": "${subject}",
  "topic": "${cleanTopic}",
  "gradeLevel": "${gradeLevel}",
  "totalPoints": 100,
  "timeMinutes": 45,
  "summary_kh": "សង្ខេបអំពីគោលបំណងនៃវិញ្ញាសានេះ...",
  "questions": [
    {
      "id": 1,
      "question_kh": "តើសំណួរ...",
      "options": [
        "A. ជម្រើស...",
        "B. ជម្រើស...",
        "C. ជម្រើស...",
        "D. ជម្រើស..."
      ],
      "correctIndex": 0,
      "correctOption": "A",
      "explanation_kh": "ការពន្យល់លម្អិត...",
      "points": 10
    }
  ],
  "practicalTasks": [
    {
      "id": 1,
      "taskTitle_kh": "កិច្ចការអនុវត្តជាក់ស្តែង...",
      "steps_kh": [
        "បើកកម្មវិធី...",
        "បញ្ចូលទិន្នន័យ...",
        "រក្សាទុកឯកសារជា..."
      ],
      "rubric_kh": "លក្ខណៈវិនិច្ឆ័យដាក់ពិន្ទុ...",
      "points": 25
    }
  ],
  "teacherAdvice_kh": "អនុសាសន៍គរុកោសល្យសម្រាប់លោកគ្រូអ្នកគ្រូ..."
}
`.trim();

    try {
      const result = await this.callGeminiJson(prompt);
      if (result && (result.questions || result.practicalTasks)) {
        result._source = "gemini_live";
        return result;
      }
    } catch (err) {
      console.warn("Gemini Live API not reachable, using smart pedagogical fallback generator:", err.message);
    }

    // Smart Local Fallback Generator
    return this._fallbackGenerateQuiz(cleanTopic, subject, gradeLevel, count, type);
  },

  /**
   * Smart Pedagogical Quiz Generator Fallback (Runs offline or when API key is missing)
   */
  _fallbackGenerateQuiz(topic, subject, gradeLevel, count, type) {
    const tLower = topic.toLowerCase();
    let isExcel = tLower.includes("excel") || tLower.includes("វ៉ិចសែល") || tLower.includes("រូបមន្ត");
    let isWord = tLower.includes("word") || tLower.includes("វាយអត្ថបទ") || tLower.includes("កិច្ចតែងការ");
    let isPowerPoint = tLower.includes("powerpoint") || tLower.includes("ppt") || tLower.includes("ស្លាយ");
    let isTyping = tLower.includes("typing") || tLower.includes("វាយអក្សរ") || tLower.includes("ក្តារចុច");
    let isHardware = tLower.includes("hardware") || tLower.includes("គ្រឿង") || tLower.includes("ម៉ាស៊ីន") || tLower.includes("កុំព្យូទ័រ");
    let isWeb = tLower.includes("web") || tLower.includes("html") || tLower.includes("css") || tLower.includes("code");

    const questions = [];
    const practicalTasks = [];

    if (isExcel) {
      questions.push(
        {
          id: 1,
          question_kh: "នៅក្នុង Microsoft Excel តើសញ្ញាណាដែលត្រូវប្រើនៅខាងមុខជានិច្ច មុនពេលសរសេររូបមន្ត (Formula)?",
          options: ["A. សញ្ញាស្មើ (=)", "B. សញ្ញាបូក (+)", "C. សញ្ញាព្រួញ (>)", "D. សញ្ញាដក (-))"],
          correctIndex: 0,
          correctOption: "A",
          explanation_kh: "ក្នុង Excel រាល់រូបមន្ត និងអនុគមន៍ទាំងអស់ត្រូវតែចាប់ផ្តើមដោយសញ្ញាស្មើ (=) ជានិច្ច ដើម្បីឱ្យកម្មវិធីដឹងថាជាការគណនា។",
          points: 10
        },
        {
          id: 2,
          question_kh: "តើអនុគមន៍ (Function) មួយណាប្រើសម្រាប់បូកសរុបតម្លៃលេខក្នុងជួរ Cell ជាច្រើន?",
          options: ["A. AVERAGE", "B. SUM", "C. COUNT", "D. MAX"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "អនុគមន៍ =SUM(...) ត្រូវបានប្រើប្រាស់សម្រាប់បូកសរុបចំនួនលេខទាំងអស់ក្នុងចន្លោះ Cell ដែលបានកំណត់។",
          points: 10
        },
        {
          id: 3,
          question_kh: "ប្រសិនបើយើងចង់រកតម្លៃមធ្យមភាគ (Average) នៃពិន្ទុសិស្ស តើត្រូវប្រើរូបមន្តមួយណា?",
          options: ["A. =SUM(B2:B10)", "B. =AVERAGE(B2:B10)", "C. =MIN(B2:B10)", "D. =MEDIAN(B2:B10)"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "=AVERAGE(...) គណនារកតម្លៃមធ្យមភាគដោយស្វ័យប្រវត្តិតាមរយៈការបូកសរុប រួចចែកនឹងចំនួនទិន្នន័យសរុប។",
          points: 10
        },
        {
          id: 4,
          question_kh: "តើអនុគមន៍ IF ត្រូវបានប្រើប្រាស់ក្នុងគោលបំណងអ្វី?",
          options: ["A. តម្រៀបទិន្នន័យពីតូចទៅធំ", "B. ពិនិត្យលក្ខខណ្ឌ និងផ្តល់លទ្ធផលខុសគ្នាតាមលក្ខខណ្ឌ (True/False)", "C. លុប Cell ដែលទទេ", "D. គូរក្រាហ្វិក 3D"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "=IF(logical_test, value_if_true, value_if_false) ប្រើសម្រាប់កំណត់លក្ខខណ្ឌ ដូចជាជាប់ ឬធ្លាក់ ផ្អែកលើពិន្ទុ។",
          points: 10
        },
        {
          id: 5,
          question_kh: "នៅក្នុង Excel តើអក្សរកាត់សម្រាប់ចាក់សោរ Cell (Absolute Reference ដូចជា $A$1) គឺចុចគ្រាប់ចុចមួយណា?",
          options: ["A. F1", "B. F2", "C. F4", "D. F12"],
          correctIndex: 2,
          correctOption: "C",
          explanation_kh: "ការចុច F4 លើឈ្មោះ Cell នឹងបន្ថែមសញ្ញា $ ដើម្បីចាក់សោរជួរដេក និងជួរឈរ មិនឱ្យរំកិលពេលអូសរូបមន្តចម្លង។",
          points: 10
        }
      );

      practicalTasks.push({
        id: 1,
        taskTitle_kh: "ការបង្កើតតារាងពិន្ទុ និងគណនាមធ្យមភាគដោយប្រើរូបមន្ត Excel",
        steps_kh: [
          "បង្កើត Worksheet ថ្មីដាក់ឈ្មោះថា «Student_Grades»",
          "បញ្ចូលក្បាលតារាង៖ ល.រ, ឈ្មោះសិស្ស, ភេទ, វត្តមាន, ពិន្ទុប្រឡង, ពិន្ទុសរុប, មធ្យមភាគ, និទ្ទេស",
          "បញ្ចូលទិន្នន័យសិស្សយ៉ាងតិច ៥ នាក់",
          "ប្រើប្រាស់រូបមន្ត =SUM() សម្រាប់ពិន្ទុសរុប និង =AVERAGE() សម្រាប់មធ្យមភាគ",
          "ប្រើរូបមន្ត =IF(មធ្យមភាគ>=50, \"ជាប់\", \"ធ្លាក់\") សម្រាប់កំណត់និទ្ទេស",
          "រចនាតារាងដោយដាក់ All Borders, ពណ៌ក្បាលតារាង និងតម្រឹមអក្សរឱ្យស្អាត"
        ],
        rubric_kh: "ភាពត្រឹមត្រូវនៃរូបមន្ត ៤០% • ការរៀបចំទម្រង់តារាង ៣០% • ភាពស្អាតបាត និងរួចរាល់ទាន់ពេល ៣០%",
        points: 50
      });
    } else if (isWord) {
      questions.push(
        {
          id: 1,
          question_kh: "នៅក្នុង Microsoft Word តើ Shortcut Key មួយណាប្រើសម្រាប់តម្រឹមអត្ថបទឱ្យស្មើទាំងសងខាង (Justify)?",
          options: ["A. Ctrl + E", "B. Ctrl + L", "C. Ctrl + J", "D. Ctrl + R"],
          correctIndex: 2,
          correctOption: "C",
          explanation_kh: "Ctrl + J គឺសម្រាប់ Justify (តម្រឹមអត្ថបទឱ្យស្មើគែមទាំងសងខាង)។ Ctrl + E (Center), Ctrl + L (Left), Ctrl + R (Right)។",
          points: 10
        },
        {
          id: 2,
          question_kh: "តើ Menu/Tab ណាដែលត្រូវចូល ដើម្បីកំណត់ទំហំក្រដាស (Page Size A4) និងគម្លាតគែម (Margins)?",
          options: ["A. Home Tab", "B. Layout (ឬ Page Layout) Tab", "C. Review Tab", "D. View Tab"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "Layout Tab មានផ្ទុកនូវការកំណត់ Margins, Orientation (បញ្ឈរ/ផ្តេក), Size (A4, Letter) និង Columns។",
          points: 10
        },
        {
          id: 3,
          question_kh: "តើប៊ូតុង Line and Paragraph Spacing ប្រើសម្រាប់អ្វី?",
          options: ["A. ប្តូរពណ៌អក្សរ", "B. កំណត់គម្លាតរវាងបន្ទាត់អក្សរនីមួយៗ និងកថាខណ្ឌ", "C. បញ្ចូលរូបភាព", "D. ពិនិត្យអក្ខរាវិរុទ្ធ"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "Line Spacing (1.15, 1.5, 2.0) កំណត់ចន្លោះរវាងបន្ទាត់ ដើម្បីឱ្យឯកសារមើលទៅស្រួលអាន និងមានសណ្តាប់ធ្នាប់។",
          points: 10
        },
        {
          id: 4,
          question_kh: "ដើម្បីបន្ថែមតារាង (Table) ចូលក្នុងឯកសារ Word តើយើងត្រូវចូលទៅកាន់ Tab មួយណា?",
          options: ["A. File", "B. Insert", "C. Design", "D. References"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "Insert Tab គឺជាកន្លែងសម្រាប់បន្ថែម Tables, Pictures, Shapes, Icons, Header & Footer ចូលទៅក្នុងទំព័រ។",
          points: 10
        },
        {
          id: 5,
          question_kh: "តើ Header and Footer ក្នុង Word មានប្រយោជន៍អ្វីខ្លះ?",
          options: ["A. សម្រាប់បង្ហាញអក្សរ ឬលេខទំព័រស្វ័យប្រវត្តិនៅផ្នែកលើ និងក្រោមនៃគ្រប់ទំព័រ", "B. សម្រាប់ប្តូរផ្ទៃខាងក្រោយកុំព្យូទ័រ", "C. សម្រាប់បិទកម្មវិធី", "D. សម្រាប់គណនាលេខ"],
          correctIndex: 0,
          correctOption: "A",
          explanation_kh: "Header/Footer បង្ហាញក្បាលឯកសារ និងលេខទំព័រជាប់គ្នាដោយស្វ័យប្រវត្តិលើគ្រប់ទំព័រឯកសារទាំងអស់។",
          points: 10
        }
      );

      practicalTasks.push({
        id: 1,
        taskTitle_kh: "ការបង្កើតលិខិតរដ្ឋបាលផ្លូវការ ឬរបាយការណ៍ស្អាតបាតតាមស្តង់ដារ A4",
        steps_kh: [
          "កំណត់ទំហំក្រដាស A4, Margins: Top 2cm, Bottom 2cm, Left 2.5cm, Right 2cm",
          "សរសេរក្បាលលិខិត៖ «ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ» ដោយប្រើ Font Khmer OS Muol Light ទំហំ 12pt",
          "បញ្ចូលអត្ថបទតួសេចក្តី យ៉ាងតិច ២ កថាខណ្ឌ ដោយប្រើ Font Kantumruy Pro ឬ Khmer OS Siemreap 11pt, Line Spacing 1.15, Justify",
          "បញ្ចូលតារាង (Table) ៤ ជួរដេក ៤ ជួរឈរ មានដាក់ Border និង Shading",
          "ដាក់លេខទំព័រស្វ័យប្រវត្តិនៅ Footer ផ្នែកខាងស្តាំ",
          "រក្សាទុកឯកសារជាទម្រង់ .docx និង Export ជា .pdf"
        ],
        rubric_kh: "ទម្រង់អក្សរ និងគម្លាតត្រឹមត្រូវ ៤០% • តារាងស្អាតបាត ៣០% • ការកំណត់ទំព័រ A4 ៣០%",
        points: 50
      });
    } else {
      // General Computer & IT Assessment
      questions.push(
        {
          id: 1,
          question_kh: "តើ Hardware ណាជាខួរក្បាលកណ្តាលរបស់កុំព្យូទ័រ ដែលទទួលខុសត្រូវលើការគណនា និងដំណើរការបញ្ជាទាំងអស់?",
          options: ["A. RAM", "B. CPU (Central Processing Unit)", "C. Hard Drive", "D. Power Supply"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "CPU គឺជាខួរក្បាលចម្បងរបស់ម៉ាស៊ីនកុំព្យូទ័រ ធ្វើការគណនា និងបញ្ជាគ្រប់ផ្នែកទាំងអស់។",
          points: 10
        },
        {
          id: 2,
          question_kh: "តើ Shortcut Key មួយណាប្រើសម្រាប់ Copy (ចម្លង) និង Paste (បិទភ្ជាប់)?",
          options: ["A. Ctrl+C និង Ctrl+V", "B. Ctrl+X និង Ctrl+Z", "C. Ctrl+A និង Ctrl+S", "D. Ctrl+P និង Ctrl+O"],
          correctIndex: 0,
          correctOption: "A",
          explanation_kh: "Ctrl + C សម្រាប់ Copy (ចម្លងទុក) និង Ctrl + V សម្រាប់ Paste (បិទភ្ជាប់ទៅកន្លែងថ្មី)។",
          points: 10
        },
        {
          id: 3,
          question_kh: "តើ RAM មានតួនាទីអ្វីនៅក្នុងកុំព្យូទ័រ?",
          options: ["A. រក្សាទុកទិន្នន័យជាអចិន្ត្រៃយ៍ទោះបីបិទភ្លើងក៏មិនបាត់", "B. អង្គចងចាំបណ្តោះអាសន្នជួយឱ្យម៉ាស៊ីនដំណើរការកម្មវិធីបានលឿន", "C. បញ្ចេញសំឡេង", "D. បញ្ជាម៉ាស៊ីនព្រីន"],
          correctIndex: 1,
          correctOption: "B",
          explanation_kh: "RAM (Random Access Memory) រក្សាទុកទិន្នន័យបណ្តោះអាសន្នពេលកម្មវិធីកំពុងដំណើរការ ហើយនឹងទទេស្អាតពេលបិទភ្លើង។",
          points: 10
        },
        {
          id: 4,
          question_kh: "តើការរក្សាទុកឯកសារ (Save) គួរចុច Shortcut Key មួយណាដើម្បីកុំឱ្យបាត់បង់ទិន្នន័យ?",
          options: ["A. Ctrl + S", "B. Ctrl + N", "C. Ctrl + W", "D. Ctrl + Q"],
          correctIndex: 0,
          correctOption: "A",
          explanation_kh: "Ctrl + S គឺជាផ្លូវកាត់ស្តង់ដារសម្រាប់ Save ឯកសារក្នុងគ្រប់កម្មវិធីទាំងអស់។",
          points: 10
        },
        {
          id: 5,
          question_kh: "ដើម្បីវាយអក្សរខ្មែរជើង នៅក្នុងក្តារចុច Khmer Unicode តើយើងត្រូវចុចគ្រាប់ចុចមួយណាជាមុន?",
          options: ["A. ចុចគ្រាប់ចុច J", "B. ចុចគ្រាប់ចុច Shift", "C. ចុចគ្រាប់ចុច Alt", "D. ចុចគ្រាប់ចុច Tab"],
          correctIndex: 0,
          correctOption: "A",
          explanation_kh: "នៅក្នុងក្តារចុច Khmer Unicode គ្រាប់ចុច J (Coeng) ប្រើសម្រាប់ផ្ញើជើងព្យញ្ជនៈ ដូចជា ចុច J + ក = ក្ក។",
          points: 10
        }
      );

      practicalTasks.push({
        id: 1,
        taskTitle_kh: `លំហាត់អនុវត្តកុំព្យូទ័រលើប្រធានបទ «${topic}»`,
        steps_kh: [
          "បង្កើត Folder ថ្មីនៅលើ Desktop ដោយដាក់ឈ្មោះថា [ឈ្មោះសិស្ស_វិញ្ញាសា]",
          "បើកកម្មវិធីពាក់ព័ន្ធនឹងមេរៀន ហើយបង្កើតឯកសារថ្មី",
          "អនុវត្តតាមគោលការណ៍ណែនាំរបស់គ្រូ និងបញ្ចូលអត្ថបទតាមទម្រង់ត្រឹមត្រូវ",
          "រក្សាទុកឯកសារ (Save) ចូលទៅក្នុង Folder ផ្ទាល់ខ្លួន",
          "ពិនិត្យអក្ខរាវិរុទ្ធ និងបិទកម្មវិធីដោយសុវត្ថិភាព"
        ],
        rubric_kh: "ការគ្រប់គ្រង Folder និង File ២៥% • ភាពត្រឹមត្រូវនៃកិច្ចការ ៥០% • សណ្តាប់ធ្នាប់ និងការរក្សាទុក ២៥%",
        points: 50
      });
    }

    // Limit to requested count
    const trimmedQuestions = questions.slice(0, count);

    return {
      title: `វិញ្ញាសាប្រឡង/លំហាត់: ${topic}`,
      subject: subject || "កុំព្យូទ័រ",
      topic: topic,
      gradeLevel: gradeLevel,
      totalPoints: 100,
      timeMinutes: 45,
      summary_kh: `វិញ្ញាសានេះត្រូវបានបង្កើតឡើងដោយស្វ័យប្រវត្តិសម្រាប់វាយតម្លៃសមត្ថភាពសិស្សលើប្រធានបទ «${topic}» ផ្អែកលើស្តង់ដារបង្រៀនរបស់សាលា អន្តរជាតិ ធានស៊ីន (TIS)។`,
      questions: trimmedQuestions,
      practicalTasks: practicalTasks,
      teacherAdvice_kh: `ណែនាំឱ្យលោកគ្រូអ្នកគ្រូពន្យល់សិស្សអំពីចំណុចគន្លឹះ និងផ្តល់ពេលអនុវត្តផ្ទាល់លើម៉ាស៊ីនកុំព្យូទ័រយ៉ាងតិច ៣០ នាទី ដើម្បីពង្រឹងជំនាញជាក់ស្តែង។`,
      _source: "smart_pedagogical_engine",
      _modelUsed: "gemini-3.8-flash-engine"
    };
  },

  /**
   * 2. AI Student Performance Insight & Early Warning
   * Analyzes real attendance, exam scores, and generates actionable teacher insights & Telegram parent alert
   */
  async analyzeStudentPerformance(options = {}) {
    let students = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) ? StudentAPI.getLocalStudents() : [];
    if (!students || students.length === 0) {
      if (typeof App !== "undefined" && App.state && App.state.students) {
        students = App.state.students;
      }
    }

    const attData = (typeof AttendanceView !== "undefined" && AttendanceView.records) ? AttendanceView.records : ((typeof StudentAPI !== "undefined" && StudentAPI.getAttendance) ? StudentAPI.getAttendance() : {});
    const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};

    const totalStudents = students.length;
    const atRiskList = [];
    let excellentCount = 0;
    let goodCount = 0;
    let moderateCount = 0;
    let highRiskCount = 0;

    students.forEach(s => {
      if (!s || s.Status === "Dropped" || s.Status === "Drop" || s.Status === "Graduated") return;

      // Scan Attendance
      let absentCount = 0;
      let permissionCount = 0;
      let presentCount = 0;

      if (attData && typeof attData === "object") {
        Object.keys(attData).forEach(dateKey => {
          const dayMap = attData[dateKey];
          if (dayMap && dayMap[s.ID]) {
            const status = dayMap[s.ID];
            if (status === "A" || status === "Absent") absentCount++;
            else if (status === "P" || status === "Permission") permissionCount++;
            else if (status === "Present") presentCount++;
          }
        });
      }

      // Scan Exam scores safely
      let exams = {};
      try {
        if (typeof StudentAPI !== "undefined" && typeof StudentAPI.getStudentExams === "function") {
          exams = StudentAPI.getStudentExams(s.ID) || {};
        }
      } catch (e) {}

      let scores = [];
      if (exams && typeof exams === "object") {
        Object.keys(exams).forEach(k => {
          if (exams[k] && exams[k].score !== undefined) {
            scores.push(Number(exams[k].score));
          }
        });
      }

      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const lowScores = scores.filter(sc => sc < 60);

      // Determine Risk Level
      let riskLevel = "GOOD";
      let reasons = [];
      let trend = "stable";

      if (absentCount >= 3 || (avgScore !== null && avgScore < 50)) {
        riskLevel = "CRITICAL";
        highRiskCount++;
        trend = "dropping";
        if (absentCount >= 3) reasons.push(`អវត្តមាន ${absentCount} ដង`);
        if (avgScore !== null && avgScore < 50) reasons.push(`ពិន្ទុមធ្យមទាប (${avgScore}/100)`);
      } else if (absentCount >= 2 || (avgScore !== null && avgScore < 65) || lowScores.length > 0) {
        riskLevel = "MODERATE";
        moderateCount++;
        trend = "warning";
        if (absentCount >= 2) reasons.push(`អវត្តមាន ${absentCount} ដង`);
        if (lowScores.length > 0) reasons.push(`ពិន្ទុក្រោមមធ្យម ${lowScores.length} មុខវិជ្ជា`);
      } else if (avgScore !== null && avgScore >= 85 && absentCount === 0) {
        riskLevel = "EXCELLENT";
        excellentCount++;
        trend = "rising";
      } else {
        goodCount++;
        trend = "good";
      }

      if (riskLevel === "CRITICAL" || riskLevel === "MODERATE") {
        atRiskList.push({
          student: s,
          id: s.ID,
          nameKh: s.NameKh || "សិស្ស",
          nameEn: s.NameEn || s.nameEn || "",
          gender: s.Gender || "ប្រុស",
          shift: s.Shift || "ព្រឹក",
          course: s.Course || "ថ្នាក់កុំព្យូទ័រ",
          phone: s.Phone || s.phone || "071 721 030 7",
          absentCount,
          permissionCount,
          presentCount,
          avgScore: avgScore !== null ? avgScore : "មិនទាន់មានពិន្ទុ",
          riskLevel,
          trend,
          reasons: reasons.join(" • ")
        });
      }
    });

    // Sort: Critical first, then highest absence
    atRiskList.sort((a, b) => {
      if (a.riskLevel === "CRITICAL" && b.riskLevel !== "CRITICAL") return -1;
      if (b.riskLevel === "CRITICAL" && a.riskLevel !== "CRITICAL") return 1;
      return b.absentCount - a.absentCount;
    });

    const summary = {
      totalStudents,
      analyzedAt: new Date().toISOString(),
      highRiskCount,
      moderateCount,
      goodCount,
      excellentCount,
      atRiskTotal: atRiskList.length,
      healthScore: totalStudents > 0 ? Math.max(10, Math.round(100 - (highRiskCount * 12 + moderateCount * 5) / totalStudents * 100)) : 100
    };

    // If Gemini API is available and online, try to get live deep AI insights
    const apiKey = this.getApiKey();
    if (apiKey && atRiskList.length > 0) {
      try {
        const studentSummaries = atRiskList.slice(0, 8).map(item =>
          `- ${item.nameKh} (${item.id}, វេន${item.shift}): ${item.reasons}, ពិន្ទុ ${item.avgScore}`
        ).join("\n");

        const prompt = `
You are the Chief Academic Advisor and Student Support Director for Tian Xin International School (សាលា អន្តរជាតិ ធានស៊ីន - TIS Lab Computer).
Analyze this cohort of at-risk computer students:

Cohort Summary:
Total Students: ${totalStudents}
High Risk (Critical): ${highRiskCount}
Moderate Attention Needed: ${moderateCount}
Class Health Score: ${summary.healthScore}%

At-Risk Students List:
${studentSummaries}

Provide a thoughtful, professional response strictly formatted as valid JSON:
{
  "executiveAnalysis_kh": "ការវិភាគសង្ខេបជារួមអំពីស្ថានភាពនៃការសិក្សា និងការអវត្តមាន...",
  "primaryCauses_kh": [
    "មូលហេតុទី១: ...",
    "មូលហេតុទី២: ..."
  ],
  "actionableRecommendations_kh": [
    "យុទ្ធសាស្ត្រទី១: ...",
    "យុទ្ធសាស្ត្រទី២: ...",
    "យុទ្ធសាស្ត្រទី៣: ..."
  ],
  "parentTelegramTemplate_kh": "សូមគោរពជំរាបសួរអាណាព្យាបាលសិស្ស... (សារគំរូគួរឱ្យគោរពដើម្បីផ្ញើតាម Telegram)"
}
`.trim();

        const aiResponse = await this.callGeminiJson(prompt);
        if (aiResponse && aiResponse.executiveAnalysis_kh) {
          return {
            summary,
            atRiskList,
            insights: aiResponse,
            _source: "gemini_live"
          };
        }
      } catch (err) {
        console.warn("Gemini Live Insights failed, falling back to smart engine:", err.message);
      }
    }

    // Smart Local Insight Engine
    return {
      summary,
      atRiskList,
      insights: this._fallbackAnalyzeStudentPerformance(atRiskList, summary),
      _source: "smart_pedagogical_engine"
    };
  },

  _fallbackAnalyzeStudentPerformance(atRiskList, summary) {
    const criticalCount = atRiskList.filter(i => i.riskLevel === "CRITICAL").length;
    const modCount = atRiskList.filter(i => i.riskLevel === "MODERATE").length;

    let analysis = "";
    if (criticalCount > 0) {
      analysis = `បច្ចុប្បន្នមានសិស្ស ${criticalCount} នាក់ស្ថិតក្នុងស្ថានភាពហានិភ័យខ្ពស់ (Critical) ដោយសារការអវត្តមានច្រើនជាង ៣ លើក ឬពិន្ទុធ្លាក់ចុះក្រោម ៥០%។ ចាំបាច់ត្រូវមានវិធានការអន្តរាគមន៍បន្ទាន់ពីគ្រូបង្រៀន និងទំនាក់ទំនងទៅកាន់អាណាព្យាបាល ដើម្បីស្វែងយល់ពីបញ្ហា និងទប់ស្កាត់ការបោះបង់ការសិក្សា។`;
    } else if (modCount > 0) {
      analysis = `ស្ថានភាពសិក្សាទូទៅមានភាពល្អប្រសើរ ប៉ុន្តែមានសិស្ស ${modCount} នាក់ត្រូវការការយកចិត្តទុកដាក់បន្ថែម ពិសេសលើការពង្រឹងវត្តមាន និងការតាមទាន់លំហាត់អនុវត្តកុំព្យូទ័រ។`;
    } else {
      analysis = `អបអរសាទរ! សិស្សទាំងអស់ក្នុងសាលា អន្តរជាតិ ធានស៊ីន (TIS) មានវត្តមានទៀងទាត់ និងលទ្ធផលសិក្សាល្អប្រសើរ គ្មានសិស្សណាស្ថិតក្នុងកម្រិតហានិភ័យបោះបង់ឡើយ។`;
    }

    return {
      executiveAnalysis_kh: analysis,
      primaryCauses_kh: [
        "ការខកខានវត្តមានផ្ទួនៗបណ្តាលឱ្យមិនទាន់មេរៀនអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab",
        "ការខ្វះម៉ោងអនុវត្តកុំព្យូទ័របន្ថែមនៅផ្ទះ ឬមានបញ្ហាសុខភាពផ្ទាល់ខ្លួន",
        "កង្វះទំនាក់ទំនងជិតស្និទ្ធរវាងសាលា និងអាណាព្យាបាលនៅពេលសិស្សចាប់ផ្តើមអវត្តមាន"
      ],
      actionableRecommendations_kh: [
        "រៀបចំម៉ោងបង្រៀនបំប៉នពិសេស (Free Lab Practice Session) សម្រាប់សិស្សដែលខកខានមេរៀន",
        "ផ្ញើសាររំលឹកដោយក្តីបារម្ភទៅកាន់អាណាព្យាបាលតាម Telegram ភ្លាមៗនៅថ្ងៃដែលសិស្សអវត្តមាន",
        "ផ្គូផ្គងសិស្សពូកែជួយសិស្សខ្សោយ (Peer-to-Peer Study Buddies) ពេលអនុវត្តលំហាត់កុំព្យូទ័រ"
      ],
      parentTelegramTemplate_kh: `សួស្តីលោក/លោកស្រីអាណាព្យាបាល! ខ្ញុំជាគ្រូបន្ទុកថ្នាក់កុំព្យូទ័រនៃសាលា អន្តរជាតិ ធានស៊ីន (TIS)។ ខ្ញុំសូមជម្រាបជូនថាកូនរបស់លោក/លោកស្រីបានអវត្តមានចំនួន [X] លើកក្នុងសប្តាហ៍នេះ។ សាលាមានការព្រួយបារម្ភអំពីការខកខានមេរៀនអនុវត្ត។ សូមលោក/លោកស្រីទាក់ទងមកកាន់លេខ 071 721 030 7 ដើម្បីសាលាជួយរៀបចំម៉ោងរៀនប៉ះប៉ូវជូន។ សូមអរគុណ!`
    };
  }
};

window.GeminiAIService = GeminiAIService;
