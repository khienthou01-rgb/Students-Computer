/**
 * ==========================================================================
 * Service: AzureTTSService (សេវាសម្លេងស្រីមុំ ភាសាខ្មែរ Azure Neural TTS)
 * Powered by Microsoft Azure Cognitive Services Text-to-Speech
 * Voice: km-KH-SreymomNeural (សម្លេងស្រីមុំ ១០០% ភាសាខ្មែរ)
 * ==========================================================================
 */

const AzureTTSService = {
  STORAGE_KEY: "tis_azure_tts_config",
  DEFAULT_VOICE: "km-KH-SreymomNeural",
  DEFAULT_VOICE_MALE: "km-KH-PisethNeural",
  DEFAULT_REGION: "southeastasia",
  DEFAULT_RATE: "0%",      // Speaking rate: -50% to +100%
  DEFAULT_PITCH: "+0Hz",   // Pitch adjustment

  // Available Khmer voices
  VOICES: {
    "km-KH-SreymomNeural": {
      name: "ស្រីមុំ (Sreymom)",
      gender: "ស្រី",
      genderEn: "Female",
      icon: "fa-venus",
      color: "#ec4899",
      description: "សម្លេងស្រីមុំ ទន់ភ្លន់ រាក់ទាក់ សម្រាប់អានមេរៀន និងជូនដំណឹង"
    },
    "km-KH-PisethNeural": {
      name: "ពិសិដ្ឋ (Piseth)",
      gender: "ប្រុស",
      genderEn: "Male",
      icon: "fa-mars",
      color: "#3b82f6",
      description: "សម្លេងប្រុស ច្បាស់លាស់ សម្រាប់ការបង្រៀន និងប្រកាស"
    }
  },

  // State
  state: {
    isPlaying: false,
    currentAudio: null,
    audioQueue: [],
    cachedToken: null,
    tokenExpiresAt: 0
  },

  /**
   * Get saved config or defaults
   */
  getConfig() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.subscriptionKey) {
          return {
            subscriptionKey: parsed.subscriptionKey,
            region: parsed.region || this.DEFAULT_REGION,
            voice: parsed.voice || this.DEFAULT_VOICE,
            rate: parsed.rate || this.DEFAULT_RATE,
            pitch: parsed.pitch || this.DEFAULT_PITCH,
            enabled: parsed.enabled !== false
          };
        }
      }
    } catch (e) {}

    // Fallback: check APP_CONFIG
    if (typeof APP_CONFIG !== "undefined" && APP_CONFIG.azureTtsConfig) {
      return {
        subscriptionKey: APP_CONFIG.azureTtsConfig.subscriptionKey || "",
        region: APP_CONFIG.azureTtsConfig.region || this.DEFAULT_REGION,
        voice: APP_CONFIG.azureTtsConfig.voice || this.DEFAULT_VOICE,
        rate: APP_CONFIG.azureTtsConfig.rate || this.DEFAULT_RATE,
        pitch: APP_CONFIG.azureTtsConfig.pitch || this.DEFAULT_PITCH,
        enabled: APP_CONFIG.azureTtsConfig.enabled !== false
      };
    }

    return {
      subscriptionKey: "",
      region: this.DEFAULT_REGION,
      voice: this.DEFAULT_VOICE,
      rate: this.DEFAULT_RATE,
      pitch: this.DEFAULT_PITCH,
      enabled: true
    };
  },

  /**
   * Save config to localStorage
   */
  saveConfig(config) {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  /**
   * Check if Azure TTS is configured and available
   */
  isAvailable() {
    const config = this.getConfig();
    return !!(config.subscriptionKey && config.subscriptionKey.trim() && config.enabled);
  },

  /**
   * Get access token from Azure (tokens are valid for 10 minutes)
   */
  async getAccessToken() {
    const config = this.getConfig();
    if (!config.subscriptionKey) {
      throw new Error("Azure TTS Subscription Key មិនទាន់បានកំណត់");
    }

    // Reuse cached token if still valid (refresh 1 minute before expiry)
    if (this.state.cachedToken && Date.now() < this.state.tokenExpiresAt - 60000) {
      return this.state.cachedToken;
    }

    const tokenUrl = `https://${config.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;

    try {
      const resp = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": config.subscriptionKey,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        if (resp.status === 401) {
          throw new Error("Azure API Key មិនត្រឹមត្រូវ ឬផុតកំណត់ (401 Unauthorized)");
        }
        throw new Error(`Azure Token Error: ${resp.status} ${errText}`);
      }

      const token = await resp.text();
      this.state.cachedToken = token;
      this.state.tokenExpiresAt = Date.now() + 9 * 60 * 1000; // 9 minutes
      return token;
    } catch (err) {
      this.state.cachedToken = null;
      this.state.tokenExpiresAt = 0;
      throw err;
    }
  },

  /**
   * Synthesize speech from text using Azure Neural TTS or multi-tier fallback
   * Tier 1: Azure Neural TTS (km-KH-SreymomNeural) - Studio Quality HD
   * Tier 2: Microsoft Edge Native Sreymom (Natural Online) - Free on Edge
   * Tier 3: Google Khmer Audio Voice - Free, natural Khmer female voice
   * Tier 4: Browser SpeechSynthesis
   * @param {string} text - Text to speak (Khmer or English)
   * @param {Object} options - { voice, rate, pitch, onStart, onEnd, onError }
   * @returns {Promise<HTMLAudioElement|void>}
   */
  async speak(text, options = {}) {
    if (!text || !text.trim()) {
      throw new Error("សូមបញ្ចូលអត្ថបទដែលចង់ឱ្យអាន");
    }

    const config = this.getConfig();
    const voice = options.voice || config.voice || this.DEFAULT_VOICE;
    const rate = options.rate || config.rate || this.DEFAULT_RATE;
    const pitch = options.pitch || config.pitch || this.DEFAULT_PITCH;

    // Stop any currently playing audio
    this.stop();

    // If Azure key is not configured or disabled, seamlessly use free Khmer audio engine!
    if (!config.subscriptionKey || !config.subscriptionKey.trim() || !config.enabled) {
      return this._fallbackBrowserSpeak(text, options);
    }

    // Clean text for SSML (escape XML special characters)
    const cleanText = text.trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    // Build SSML payload
    const ssml = `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="km-KH">
  <voice name="${voice}">
    <prosody rate="${rate}" pitch="${pitch}">
      ${cleanText}
    </prosody>
  </voice>
</speak>`.trim();

    let token;
    try {
      token = await this.getAccessToken();
    } catch (err) {
      // If Azure token fails, fall back to free Khmer voice
      console.warn("[AzureTTS] Azure key error, falling back to free Khmer voice:", err.message);
      return this._fallbackBrowserSpeak(text, options);
    }

    const ttsUrl = `https://${config.region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    try {
      const resp = await fetch(ttsUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
          "User-Agent": "TISLabComputer/1.0"
        },
        body: ssml
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Azure TTS Error: ${resp.status} ${errText}`);
      }

      const audioBlob = await resp.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Set up event handlers
      audio.onplay = () => {
        this.state.isPlaying = true;
        if (options.onStart) options.onStart();
      };

      audio.onended = () => {
        this.state.isPlaying = false;
        this.state.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        if (options.onEnd) options.onEnd();
        // Process next in queue
        this._processQueue();
      };

      audio.onerror = (err) => {
        this.state.isPlaying = false;
        this.state.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        if (options.onError) options.onError(err);
      };

      this.state.currentAudio = audio;
      await audio.play();
      return audio;
    } catch (err) {
      console.warn("[AzureTTS] Synthesis failed, falling back to free Khmer voice:", err.message);
      return this._fallbackBrowserSpeak(text, options);
    }
  },

  /**
   * Speak text with smart chunking for long texts
   * Azure TTS has a ~10 minute / 10,000 character limit per request
   * @param {string} text - Long text to speak
   * @param {Object} options - Same as speak()
   */
  async speakLong(text, options = {}) {
    if (!text || !text.trim()) return;

    const MAX_CHUNK = 3000; // characters per chunk (safe limit)
    const chunks = this._splitTextIntoChunks(text.trim(), MAX_CHUNK);

    if (chunks.length <= 1) {
      return this.speak(text, options);
    }

    // Queue all chunks
    this.state.audioQueue = chunks.map((chunk, idx) => ({
      text: chunk,
      options: {
        ...options,
        onStart: idx === 0 ? options.onStart : undefined,
        onEnd: idx === chunks.length - 1 ? options.onEnd : undefined
      }
    }));

    // Start first chunk
    return this._processQueue();
  },

  /**
   * Process next item in audio queue
   */
  async _processQueue() {
    if (this.state.audioQueue.length === 0) return;

    const next = this.state.audioQueue.shift();
    try {
      await this.speak(next.text, next.options);
    } catch (err) {
      console.warn("[AzureTTS] Queue item failed:", err.message);
    }
  },

  /**
   * Split text into natural chunks (at sentence/paragraph boundaries)
   */
  _splitTextIntoChunks(text, maxLen) {
    if (text.length <= maxLen) return [text];

    const chunks = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxLen) {
        chunks.push(remaining);
        break;
      }

      // Try to split at paragraph, then sentence, then word boundary
      let splitIdx = -1;
      const searchArea = remaining.substring(0, maxLen);

      // Try paragraph break
      splitIdx = searchArea.lastIndexOf("\n\n");
      if (splitIdx < maxLen * 0.3) splitIdx = -1;

      // Try sentence end (Khmer ។ or ៕ or English period)
      if (splitIdx === -1) {
        splitIdx = searchArea.lastIndexOf("។");
        if (splitIdx < maxLen * 0.3) splitIdx = -1;
      }
      if (splitIdx === -1) {
        splitIdx = searchArea.lastIndexOf(". ");
        if (splitIdx < maxLen * 0.3) splitIdx = -1;
      }

      // Try space
      if (splitIdx === -1) {
        splitIdx = searchArea.lastIndexOf(" ");
        if (splitIdx < maxLen * 0.3) splitIdx = -1;
      }

      // Hard split
      if (splitIdx === -1) {
        splitIdx = maxLen - 1;
      }

      chunks.push(remaining.substring(0, splitIdx + 1).trim());
      remaining = remaining.substring(splitIdx + 1).trim();
    }

    return chunks.filter(c => c.length > 0);
  },

  /**
   * Stop current playback and clear queue
   */
  stop() {
    this.state.audioQueue = [];
    if (this.state.currentAudio) {
      try {
        this.state.currentAudio.pause();
        this.state.currentAudio.currentTime = 0;
        if (this.state.currentAudio.src && this.state.currentAudio.src.startsWith("blob:")) {
          URL.revokeObjectURL(this.state.currentAudio.src);
        }
      } catch (e) {}
      this.state.currentAudio = null;
    }
    this.state.isPlaying = false;

    // Also stop browser fallback if active
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Pause current playback
   */
  pause() {
    if (this.state.currentAudio && this.state.isPlaying) {
      this.state.currentAudio.pause();
      this.state.isPlaying = false;
    }
  },

  /**
   * Resume paused playback
   */
  resume() {
    if (this.state.currentAudio && !this.state.isPlaying) {
      this.state.currentAudio.play();
      this.state.isPlaying = true;
    }
  },

  /**
   * Fallback engine when Azure Speech key is not set
   * Tier 2: Microsoft Edge Native Sreymom (Natural Online)
   * Tier 3: Google Khmer Audio Voice (Natural Khmer Female Voice, 100% Free)
   * Tier 4: Browser SpeechSynthesis
   */
  async _fallbackBrowserSpeak(text, options = {}) {
    // 1. Try Microsoft Edge Native Sreymom / Khmer SpeechSynthesis
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const sreymomVoice = voices.find(v =>
        v.name.toLowerCase().includes("sreymom") ||
        ((v.lang.includes("km") || v.lang.includes("kh")) && (v.name.toLowerCase().includes("female") || v.name.includes("ស្រី")))
      );
      const khmerVoice = voices.find(v => v.lang.includes("km") || v.lang.includes("kh"));

      if (sreymomVoice || khmerVoice) {
        return this._speakWithBrowserVoice(text, sreymomVoice || khmerVoice, options);
      }
    }

    // 2. Try Google Khmer Audio Voice (Natural Khmer Female Voice, Free & zero configuration)
    try {
      return await this._googleKhmerSpeak(text, options);
    } catch (err) {
      console.warn("[AzureTTS] Google Khmer TTS fallback failed, using generic speech synthesis:", err);
    }

    // 3. Fallback to generic browser SpeechSynthesis
    return this._speakWithBrowserVoice(text, null, options);
  },

  /**
   * Google Khmer Audio Voice — plays natural female Khmer speech via Audio element
   */
  async _googleKhmerSpeak(text, options = {}) {
    const chunks = this._splitTextIntoChunks(text, 160);
    if (!chunks || chunks.length === 0) return;

    return new Promise((resolve, reject) => {
      let currentIdx = 0;
      let hasStarted = false;

      const playNextChunk = () => {
        if (currentIdx >= chunks.length) {
          this.state.isPlaying = false;
          this.state.currentAudio = null;
          if (options.onEnd) options.onEnd();
          resolve();
          return;
        }

        const chunkText = chunks[currentIdx];
        currentIdx++;

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=km&client=tw-ob&q=${encodeURIComponent(chunkText)}`;
        const audio = new Audio(url);
        this.state.currentAudio = audio;

        audio.onplay = () => {
          this.state.isPlaying = true;
          if (!hasStarted) {
            hasStarted = true;
            if (options.onStart) options.onStart();
          }
        };

        audio.onended = () => {
          playNextChunk();
        };

        audio.onerror = (e) => {
          console.warn("[AzureTTS] Google TTS chunk error, attempting next:", e);
          playNextChunk();
        };

        audio.play().catch(err => {
          console.warn("[AzureTTS] Google audio play error:", err);
          // If audio play was blocked or network offline, try speech synthesis
          this._speakWithBrowserVoice(text, null, options).then(resolve).catch(reject);
        });
      };

      playNextChunk();
    });
  },

  /**
   * Speak using browser SpeechSynthesis with specific voice
   */
  _speakWithBrowserVoice(text, selectedVoice, options = {}) {
    return new Promise((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        const err = new Error("Browser does not support SpeechSynthesis");
        if (options.onError) options.onError(err);
        reject(err);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || "km-KH";
      } else {
        const voices = window.speechSynthesis.getVoices();
        const khmerAny = voices.find(v => v.lang.includes("km") || v.lang.includes("kh"));
        const femaleAny = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("woman"));
        if (khmerAny) {
          utterance.voice = khmerAny;
          utterance.lang = "km-KH";
        } else if (femaleAny) {
          utterance.voice = femaleAny;
        }
      }

      utterance.onstart = () => {
        this.state.isPlaying = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.state.isPlaying = false;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        this.state.isPlaying = false;
        if (options.onError) options.onError(e);
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  },

  /**
   * Test Azure TTS connection (speak a short greeting)
   */
  async testConnection(customKey = null, customRegion = null) {
    const config = this.getConfig();
    const key = customKey || config.subscriptionKey;
    const region = customRegion || config.region || this.DEFAULT_REGION;

    if (!key) {
      return { success: false, error: "សូមបញ្ចូល Azure Subscription Key" };
    }

    // Test by getting a token
    const tokenUrl = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;

    try {
      const startMs = performance.now();
      const resp = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const latencyMs = Math.round(performance.now() - startMs);

      if (!resp.ok) {
        return {
          success: false,
          error: resp.status === 401
            ? "API Key មិនត្រឹមត្រូវ ឬផុតកំណត់"
            : `Error ${resp.status}`,
          status: resp.status
        };
      }

      const token = await resp.text();
      if (token && token.length > 50) {
        return {
          success: true,
          latencyMs,
          region,
          voice: this.DEFAULT_VOICE,
          voiceName: "ស្រីមុំ (SreymomNeural)",
          message: "✅ Azure TTS តភ្ជាប់ជោគជ័យ! សម្លេងស្រីមុំ ១០០% ភាសាខ្មែរ រួចរាល់"
        };
      }

      return { success: false, error: "Token ទទេ" };
    } catch (err) {
      return { success: false, error: err.message || "Failed to connect" };
    }
  },

  /**
   * Get the voice info object for current or specified voice
   */
  getVoiceInfo(voiceName = null) {
    const name = voiceName || this.getConfig().voice || this.DEFAULT_VOICE;
    return this.VOICES[name] || this.VOICES[this.DEFAULT_VOICE];
  },

  /**
   * Get active engine description for UI display
   */
  getActiveEngineName() {
    if (this.isAvailable()) {
      return "Azure Neural (HD Studio)";
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices() || [];
      const sreymom = voices.find(v => v.name.toLowerCase().includes("sreymom"));
      if (sreymom) return "Edge Sreymom (Natural)";
    }
    return "Sreymom Web Voice (Free)";
  },

  /**
   * Render Azure TTS Settings Panel (for embedding in Settings page)
   */
  renderSettingsPanel() {
    const config = this.getConfig();
    const isConfigured = !!(config.subscriptionKey && config.subscriptionKey.trim());
    const voiceInfo = this.getVoiceInfo(config.voice);
    const engineMode = this.getActiveEngineName();

    return `
      <div class="card mt-4" style="border: 1px solid rgba(236, 72, 153, 0.4); border-radius: var(--border-radius); padding: 22px; background: linear-gradient(135deg, rgba(88, 28, 135, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #ec4899, #f43f5e); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #fff; box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <span>Azure TTS សម្លេងស្រីមុំ ១០០% ភាសាខ្មែរ</span>
                <span class="badge" style="background: rgba(236, 72, 153, 0.15); color: #ec4899; font-size: 0.75rem;"><i class="fa-solid fa-sparkles"></i> ${engineMode}</span>
              </h3>
              <p style="margin: 3px 0 0; font-size: 0.8rem; color: var(--text-muted);">
                Microsoft Azure Neural TTS & Smart Khmer Audio — ${voiceInfo.name} (${voiceInfo.genderEn})
              </p>
            </div>
          </div>
          <div>
            ${isConfigured
              ? '<span class="badge" style="background: rgba(16, 185, 129, 0.18); color: #10b981; font-weight: 700; padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-circle-check"></i> Azure Key Active</span>'
              : '<span class="badge" style="background: rgba(14, 165, 233, 0.18); color: #0284c7; font-weight: 700; padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-bolt"></i> Auto Khmer Free Voice</span>'
            }
          </div>
        </div>

        <!-- Info Tip Box -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5;">
          <strong style="color: #f472b6; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <i class="fa-solid fa-circle-info"></i> របៀបដំណើរការសម្លេងស្រីមុំ៖
          </strong>
          <span>• <b>ឥតគិតថ្លៃ (Free 100%)</b>៖ ប្រព័ន្ធបានភ្ជាប់សម្លេងខ្មែរ Google & Edge រួចជាស្រេច អាចចុចស្តាប់បានភ្លាមៗដោយមិនបាច់មាន Key!</span><br>
          <span>• <b>កម្រិត Studio HD (Azure Speech)</b>៖ ប្រសិនបើចង់បានសម្លេង Neural កាន់តែច្បាស់ទន់ភ្លន់កម្រិតខ្ពស់ សូមបង្កើត <b>Free Azure Speech Key</b> (ឥតគិតថ្លៃ 500,000 តួអក្សរ/ខែ) នៅ Microsoft Azure រួចបញ្ចូល Key ខាងក្រោម។</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: block;">
              <i class="fa-solid fa-key" style="color: #ec4899;"></i> Azure Speech Subscription Key:
            </label>
            <input type="password" id="inputAzureTtsKey" class="form-control font-mono" value="${config.subscriptionKey || ''}"
              placeholder="បញ្ចូល Azure Speech Service Key (ឬទុកទទេដើម្បីប្រើ Free Khmer Voice)..." 
              style="font-size: 0.86rem;">
            <small style="color: var(--text-muted); font-size: 0.74rem;">បង្កើត Key ឥតគិតថ្លៃនៅ <a href="https://portal.azure.com/" target="_blank" style="color: #ec4899; font-weight: 600;">Azure Portal ➔ Speech Services</a></small>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: block;">
                <i class="fa-solid fa-globe" style="color: #06b6d4;"></i> Azure Region:
              </label>
              <select id="selectAzureTtsRegion" class="form-control font-mono" style="font-size: 0.84rem;">
                <option value="southeastasia" ${config.region === 'southeastasia' ? 'selected' : ''}>southeastasia (Singapore)</option>
                <option value="eastasia" ${config.region === 'eastasia' ? 'selected' : ''}>eastasia (Hong Kong)</option>
                <option value="japaneast" ${config.region === 'japaneast' ? 'selected' : ''}>japaneast (Tokyo)</option>
                <option value="koreacentral" ${config.region === 'koreacentral' ? 'selected' : ''}>koreacentral (Seoul)</option>
                <option value="eastus" ${config.region === 'eastus' ? 'selected' : ''}>eastus (United States)</option>
                <option value="westeurope" ${config.region === 'westeurope' ? 'selected' : ''}>westeurope (Netherlands)</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: block;">
                <i class="fa-solid fa-${voiceInfo.icon}" style="color: ${voiceInfo.color};"></i> សម្លេង Voice៖
              </label>
              <select id="selectAzureTtsVoice" class="form-control" style="font-size: 0.84rem;">
                <option value="km-KH-SreymomNeural" ${config.voice === 'km-KH-SreymomNeural' ? 'selected' : ''}>🎀 ស្រីមុំ (Sreymom) — សម្លេងស្រី (Khmer Female)</option>
                <option value="km-KH-PisethNeural" ${config.voice === 'km-KH-PisethNeural' ? 'selected' : ''}>👨 ពិសិដ្ឋ (Piseth) — សម្លេងប្រុស (Khmer Male)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px;">
            <button type="button" class="btn-primary" onclick="AzureTTSService.handleSaveSettings()" 
              style="background: linear-gradient(135deg, #ec4899, #f43f5e); border: none; padding: 10px 20px; font-weight: 700; font-size: 0.85rem; border-radius: 10px; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);">
              <i class="fa-solid fa-floppy-disk"></i> រក្សាទុកការកំណត់
            </button>
            <button type="button" class="btn-secondary" onclick="AzureTTSService.handleTestConnection()" 
              style="padding: 10px 18px; font-size: 0.85rem; border-radius: 10px;" id="btnTestAzureTts">
              <i class="fa-solid fa-satellite-dish"></i> ពិនិត្យតភ្ជាប់ Azure
            </button>
            <button type="button" class="btn-secondary" onclick="AzureTTSService.handleTestSpeak()" 
              style="padding: 10px 18px; font-size: 0.85rem; border-radius: 10px; color: #ec4899; border-color: rgba(236, 72, 153, 0.4);">
              <i class="fa-solid fa-volume-high"></i> សាកល្បងស្តាប់សម្លេងស្រីមុំ
            </button>
          </div>
        </div>

        <div id="azureTtsTestResult" style="margin-top: 14px; display: none;"></div>
      </div>
    `;
  },

  /**
   * Handle Settings Save
   */
  handleSaveSettings() {
    const key = document.getElementById("inputAzureTtsKey")?.value?.trim() || "";
    const region = document.getElementById("selectAzureTtsRegion")?.value || this.DEFAULT_REGION;
    const voice = document.getElementById("selectAzureTtsVoice")?.value || this.DEFAULT_VOICE;

    this.saveConfig({
      subscriptionKey: key,
      region: region,
      voice: voice,
      enabled: true
    });

    // Clear cached token since key may have changed
    this.state.cachedToken = null;
    this.state.tokenExpiresAt = 0;

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("✅ បានរក្សាទុកការកំណត់ Azure TTS សម្លេងស្រីមុំ ជោគជ័យ!", "success");
    }
  },

  /**
   * Handle Test Connection button
   */
  async handleTestConnection() {
    const btn = document.getElementById("btnTestAzureTts");
    const resultDiv = document.getElementById("azureTtsTestResult");

    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងពិនិត្យ...';
    if (resultDiv) {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = '<div style="padding: 10px; background: rgba(30, 41, 59, 0.6); border-radius: 10px; font-size: 0.85rem; color: #94a3b8;"><i class="fa-solid fa-spinner fa-spin"></i> កំពុងពិនិត្យការតភ្ជាប់ Azure TTS...</div>';
    }

    const key = document.getElementById("inputAzureTtsKey")?.value?.trim() || "";
    const region = document.getElementById("selectAzureTtsRegion")?.value || this.DEFAULT_REGION;

    const result = await this.testConnection(key, region);

    if (btn) btn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> ពិនិត្យតភ្ជាប់';

    if (resultDiv) {
      if (result.success) {
        resultDiv.innerHTML = `
          <div style="padding: 12px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; font-size: 0.85rem; color: #34d399;">
            <i class="fa-solid fa-check-circle"></i> <strong>${result.message}</strong><br>
            <span style="color: #94a3b8; font-size: 0.78rem;">Region: ${result.region} • Latency: ${result.latencyMs}ms • Voice: ${result.voiceName}</span>
          </div>`;
      } else {
        resultDiv.innerHTML = `
          <div style="padding: 12px 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; font-size: 0.85rem; color: #f87171;">
            <i class="fa-solid fa-circle-exclamation"></i> <strong>បរាជ័យក្នុងការតភ្ជាប់:</strong> ${result.error}
          </div>`;
      }
    }
  },

  /**
   * Handle Test Speak button - speak a short Khmer greeting
   */
  async handleTestSpeak() {
    const greeting = "សួស្តីលោកគ្រូ និងប្អូនៗសិស្សទាំងអស់គ្នា! ខ្ញុំគឺជាស្រីមុំ ជំនួយការ AI សម្រាប់សាលា អន្តរជាតិ ធានស៊ីន។ ខ្ញុំអាចអានមេរៀនជាសំឡេង ១០០ ភាគរយភាសាខ្មែរ ជូនលោកគ្រូ និងប្អូនៗបានគ្រប់ពេល។";

    try {
      await this.speak(greeting, {
        onStart: () => {
          if (typeof App !== "undefined" && App.showToast) {
            App.showToast("🎀 ស្រីមុំ កំពុងនិយាយ...", "info");
          }
        },
        onEnd: () => {
          if (typeof App !== "undefined" && App.showToast) {
            App.showToast("✅ សម្លេងស្រីមុំបានបញ្ចប់", "success");
          }
        }
      });
    } catch (err) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("⚠️ មិនអាចបញ្ចេញសំឡេង: " + err.message, "error");
      }
    }
  }
};
