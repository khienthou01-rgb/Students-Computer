/**
 * ==========================================================================
 * Service: ImageHostService (សេវាផ្ទុករូបភាព HostImg Pro)
 * TIS Lab Computer - Modern Student Management System
 * Multi-Tier Smart Image Hosting: Local Server + Cloud CDN + Telegram CDN
 * ==========================================================================
 */

const ImageHostService = {
  STORAGE_KEY_CONFIG: "tis_image_host_config",
  DEFAULT_IMGBB_KEY: "6f8eb281cca8e6bd73075dc7c714c1e5",
  DEFAULT_FREEIMAGE_KEY: "6d207e02198a847e52c0a97b014a6e95",

  getConfig() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.imgbbApiKey || parsed.imgbbApiKey === "542a20e405d4be630d70bcefc2d7a9ee") {
          parsed.imgbbApiKey = this.DEFAULT_IMGBB_KEY;
        }
        return parsed;
      }
    } catch (e) {}

    return {
      provider: "auto", // "auto" | "server" | "imgbb" | "freeimage" | "telegram" | "base64"
      imgbbApiKey: "6f8eb281cca8e6bd73075dc7c714c1e5",
      targetWidth: 320,
      targetHeight: 420,
      quality: 0.85,
      autoCropPassport: true
    };
  },

  saveConfig(config) {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    try {
      localStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  /**
   * Smart 3:4 Passport Aspect Ratio Cropper (Canvas Client-Side)
   * Focuses on face/head and crops to exact 3x4 passport proportions
   */
  async cropToPassport(source, targetWidth = 320, targetHeight = 420, quality = 0.85) {
    return new Promise((resolve, reject) => {
      let dataUrl = "";
      if (typeof source === "string") {
        dataUrl = source;
        processImage(dataUrl);
      } else if (source instanceof Blob || source instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => processImage(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(source);
      } else {
        return reject(new Error("Invalid image source"));
      }

      function processImage(src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");

          const targetRatio = targetWidth / targetHeight; // ~0.76
          const imgRatio = img.width / img.height;

          let sWidth, sHeight, sx, sy;

          if (imgRatio > targetRatio) {
            // Wider image: crop horizontal sides, center vertically
            sHeight = img.height;
            sWidth = img.height * targetRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            // Taller image: focus on top 15% (head/portrait)
            sWidth = img.width;
            sHeight = img.width / targetRatio;
            sx = 0;
            sy = Math.max(0, (img.height - sHeight) * 0.15);
          }

          // Fill smooth white background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw high quality cropped portrait
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

          const finalDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(finalDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = src;
      }
    });
  },

  /**
   * Main Upload Function (HostImg Smart Dispatcher)
   * Auto falls back through tiers: Server -> ImgBB -> FreeImage -> Telegram -> Compressed DataURL
   */
  async upload(source, nameHint = "student_photo") {
    const config = this.getConfig();
    let preparedDataUrl = source;

    // 1. Auto Crop to Passport if enabled
    if (config.autoCropPassport !== false) {
      try {
        preparedDataUrl = await this.cropToPassport(source, config.targetWidth, config.targetHeight, config.quality);
      } catch (e) {
        console.warn("Passport cropping fallback to raw source:", e);
      }
    }

    const provider = config.provider || "auto";

    // Direct provider requested
    if (provider === "server") {
      const res = await this.uploadToServer(preparedDataUrl, nameHint);
      if (res.success) return res;
    } else if (provider === "imgbb") {
      const res = await this.uploadToImgBB(preparedDataUrl, nameHint);
      if (res.success) return res;
    } else if (provider === "freeimage") {
      const res = await this.uploadToFreeImage(preparedDataUrl, nameHint);
      if (res.success) return res;
    } else if (provider === "telegram") {
      const res = await this.uploadToTelegram(preparedDataUrl, nameHint);
      if (res.success) return res;
    } else if (provider === "base64") {
      return { success: true, url: preparedDataUrl, provider: "base64", size: preparedDataUrl.length };
    }

    // "auto" Fallback Chain: Local Server -> ImgBB -> FreeImage -> Telegram -> Base64
    // Tier 1: Try Local Server
    try {
      const srvRes = await this.uploadToServer(preparedDataUrl, nameHint);
      if (srvRes && srvRes.success && srvRes.url) {
        return srvRes;
      }
    } catch (e) {}

    // Tier 2: Try ImgBB
    try {
      const imgbbRes = await this.uploadToImgBB(preparedDataUrl, nameHint);
      if (imgbbRes && imgbbRes.success && imgbbRes.url) {
        return imgbbRes;
      }
    } catch (e) {}

    // Tier 3: Try FreeImage.host
    try {
      const freeRes = await this.uploadToFreeImage(preparedDataUrl, nameHint);
      if (freeRes && freeRes.success && freeRes.url) {
        return freeRes;
      }
    } catch (e) {}

    // Tier 4: Try Telegram Bot CDN
    try {
      const tgRes = await this.uploadToTelegram(preparedDataUrl, nameHint);
      if (tgRes && tgRes.success && tgRes.url) {
        return tgRes;
      }
    } catch (e) {}

    // Tier 5: Safe Optimized DataURL
    return {
      success: true,
      url: preparedDataUrl,
      provider: "base64_fallback",
      size: preparedDataUrl.length,
      note: "Offline DataURL Fallback"
    };
  },

  /**
   * Tier 1: Local Server Hosting (/api/upload)
   */
  async uploadToServer(dataUrl, nameHint = "photo") {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          name: nameHint
        })
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data && data.success && data.url) {
        return {
          success: true,
          url: data.url,
          fullUrl: data.fullUrl,
          provider: "server",
          filename: data.filename,
          size: data.size
        };
      }
      throw new Error(data.error || "Server upload failed");
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Tier 2: ImgBB Cloud Hosting
   */
  async uploadToImgBB(dataUrl, nameHint = "photo") {
    try {
      const config = this.getConfig();
      const apiKey = (config.imgbbApiKey && config.imgbbApiKey.trim()) || this.DEFAULT_IMGBB_KEY;

      const base64Pure = dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");
      const formData = new FormData();
      formData.append("key", apiKey);
      formData.append("image", base64Pure);
      formData.append("name", nameHint);

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data && data.success && data.data && data.data.url) {
        return {
          success: true,
          url: data.data.url,
          displayUrl: data.data.display_url,
          thumbUrl: data.data.thumb?.url || data.data.url,
          provider: "imgbb",
          size: data.data.size
        };
      }
      throw new Error(data.error?.message || "ImgBB upload failed");
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Tier 3: FreeImage.host Cloud Hosting
   */
  async uploadToFreeImage(dataUrl, nameHint = "photo") {
    try {
      const base64Pure = dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");
      const formData = new FormData();
      formData.append("key", this.DEFAULT_FREEIMAGE_KEY);
      formData.append("action", "upload");
      formData.append("source", base64Pure);
      formData.append("format", "json");

      const res = await fetch("https://freeimage.host/api/1/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data && (data.status_code === 200 || data.success) && data.image && data.image.url) {
        return {
          success: true,
          url: data.image.url,
          displayUrl: data.image.display_url,
          provider: "freeimage",
          size: data.image.size
        };
      }
      throw new Error(data.error?.message || "FreeImage upload failed");
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Tier 4: Telegram Cloud CDN Storage
   */
  async uploadToTelegram(dataUrl, nameHint = "photo") {
    try {
      if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
        throw new Error("Telegram bot not configured");
      }

      const tgConfig = TelegramService.getConfig();
      const token = tgConfig.botToken;
      const chatId = tgConfig.chatId || tgConfig.shiftChatIds?.morning;

      if (!token || !chatId) throw new Error("Missing Telegram token or chatId");

      // Convert dataUrl to Blob
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", blob, `${nameHint}.jpg`);
      formData.append("caption", `🖼️ TIS Lab HostImg: ${nameHint}`);

      const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: formData
      });
      const sendData = await sendRes.json();
      if (!sendData.ok || !sendData.result || !sendData.result.photo) {
        throw new Error(sendData.description || "Telegram photo upload failed");
      }

      // Pick highest resolution photo
      const photos = sendData.result.photo;
      const bestPhoto = photos[photos.length - 1];

      // Get direct file path
      const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${bestPhoto.file_id}`);
      const fileData = await fileRes.json();
      if (!fileData.ok || !fileData.result || !fileData.result.file_path) {
        throw new Error(fileData.description || "Could not retrieve Telegram file path");
      }

      const directCdnUrl = `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`;

      return {
        success: true,
        url: directCdnUrl,
        provider: "telegram",
        size: bestPhoto.file_size
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Storage Statistics & Health Analysis
   */
  getStorageStats() {
    const students = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents)
      ? StudentAPI.getLocalStudents()
      : (App.state.students || []);

    let totalStudents = students.length;
    let base64Count = 0;
    let hostedCount = 0;
    let noAvatarCount = 0;
    let base64Bytes = 0;

    students.forEach(s => {
      const av = s.Avatar || "";
      if (!av) {
        noAvatarCount++;
      } else if (av.startsWith("data:image/")) {
        base64Count++;
        base64Bytes += av.length;
      } else {
        hostedCount++;
      }
    });

    let localStorageTotalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k) || "";
      localStorageTotalBytes += (k.length + v.length) * 2;
    }

    const localStorageMb = (localStorageTotalBytes / (1024 * 1024)).toFixed(2);
    const base64Mb = (base64Bytes / (1024 * 1024)).toFixed(2);
    const percentQuota = Math.min(100, Math.round((localStorageTotalBytes / (5 * 1024 * 1024)) * 100));

    return {
      totalStudents,
      base64Count,
      hostedCount,
      noAvatarCount,
      base64Bytes,
      base64Mb,
      localStorageTotalBytes,
      localStorageMb,
      percentQuota
    };
  },

  /**
   * Batch Avatar Migration (One-Click HostImg Converter)
   * Converts all heavy base64 student avatars into hosted URLs
   */
  async migrateAllStudentAvatars(onProgress = null) {
    let students = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents)
      ? StudentAPI.getLocalStudents()
      : (App.state.students || []);

    const toMigrate = students.filter(s => s.Avatar && s.Avatar.startsWith("data:image/"));
    if (toMigrate.length === 0) {
      return { success: true, migrated: 0, total: 0, message: "គ្មានរូបភាព Base64 ដែលត្រូវបំលែងទេ! រូបទាំងអស់ត្រូវបាន Host រួចជាស្រេច។" };
    }

    let successCount = 0;
    let failCount = 0;
    let totalBytesSaved = 0;

    for (let i = 0; i < toMigrate.length; i++) {
      const s = toMigrate[i];
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: toMigrate.length,
          studentName: s.NameKh || s.NameEn || s.ID
        });
      }

      const origLength = s.Avatar.length;
      const res = await this.upload(s.Avatar, `${s.ID}_${s.NameKh || 'student'}`);

      if (res.success && res.url && !res.url.startsWith("data:image/")) {
        s.Avatar = res.url;
        totalBytesSaved += Math.max(0, origLength - res.url.length);
        successCount++;

        // Save student individually to Firebase
        if (typeof StudentAPI !== "undefined" && StudentAPI.updateStudent) {
          try {
            await StudentAPI.updateStudent(s.ID, s);
          } catch (e) {}
        }
      } else {
        failCount++;
      }
    }

    // Save full database to localStorage
    if (typeof StudentAPI !== "undefined" && StudentAPI.saveLocalStudents) {
      StudentAPI.saveLocalStudents(students);
    } else {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_STUDENTS, JSON.stringify(students));
    }

    if (typeof App !== "undefined" && App.state) {
      App.state.students = students;
    }

    const savedMb = (totalBytesSaved / (1024 * 1024)).toFixed(2);
    return {
      success: true,
      migrated: successCount,
      failed: failCount,
      total: toMigrate.length,
      bytesSaved: totalBytesSaved,
      savedMb,
      message: `បានបំលែង ${successCount}/${toMigrate.length} រូបភាពទៅជា Hosted URLs ជោគជ័យ! សន្សំទំហំ Database បាន ${savedMb} MB!`
    };
  }
};

// Export to window
window.ImageHostService = ImageHostService;
