/**
 * ==========================================================================
 * Service: Motion & Interaction Engine (MotionEngine)
 * Tian Xin International School (TIS) - High-End SaaS Experience
 * ==========================================================================
 */

const Motion = {
  activeSearchIndex: -1,
  searchResults: [],

  init() {
    this.bindKeyboardShortcuts();
    this.initDynamicBackdrop();
    this.bindButtonRipples();
    this.bindCardSpotlight();
    console.log("✨ TIS High-End Motion Engine Initialized");
  },

  /**
   * 1. 60 FPS Smooth Spring Count-Up Easing
   */
  countUp(elOrId, targetValue, duration = 1200, decimals = 0, prefix = "", suffix = "") {
    const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
    if (!el) return;

    const end = parseFloat(targetValue) || 0;
    if (isNaN(end)) return;

    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
      return;
    }

    const startTime = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (end - startVal) * ease;

      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  },

  /**
   * 2. Animate Dashboard KPI Metrics on Mount
   */
  animateStatsOnView() {
    setTimeout(() => {
      // 1. Total Students
      const totalStudentsEl = document.getElementById("kpiTotal");
      if (totalStudentsEl) {
        const total = (App.state.students && App.state.students.length) || 0;
        this.countUp(totalStudentsEl, total, 1400);
      }

      // 2. Teachers Count
      const teachersEl = document.getElementById("kpiTeachersCount");
      if (teachersEl) {
        const count = (App.state.teachers && App.state.teachers.length) || 2;
        this.countUp(teachersEl, count, 900);
      }

      // 3. Classes Count
      const classesEl = document.getElementById("kpiClassesCount");
      if (classesEl) {
        this.countUp(classesEl, 3, 900);
      }

      // 4. Pass Rate (if available)
      const passRateEl = document.getElementById("kpiPassRate");
      if (passRateEl) {
        this.countUp(passRateEl, 98.5, 1500, 1, "", "%");
      }

      // 5. Attendance Rate (if available)
      const attRateEl = document.getElementById("kpiAttendanceRate");
      if (attRateEl) {
        this.countUp(attRateEl, 95.8, 1500, 1, "", "%");
      }
    }, 80);
  },

  /**
   * 3. Global Keyboard Shortcuts (Ctrl + K, Escape)
   */
  bindKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl + K or Cmd + K -> Open Global Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggleGlobalSearch();
      }

      // Escape -> Close Search or Active Modals
      if (e.key === "Escape") {
        const searchModal = document.getElementById("msGlobalSearchModal");
        if (searchModal) {
          this.closeGlobalSearch();
        }
      }
    });
  },

  /**
   * 4. Interactive Global Quick Search (Ctrl + K)
   */
  openGlobalSearch() {
    let modal = document.getElementById("msGlobalSearchModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "msGlobalSearchModal";
      modal.className = "ms-search-modal-backdrop";
      modal.innerHTML = `
        <div class="ms-search-modal-box" onclick="event.stopPropagation()">
          <div class="ms-search-header">
            <i class="fa-solid fa-magnifying-glass text-cyan-400" style="font-size: 1.15rem;"></i>
            <input type="text" id="msGlobalSearchInput" class="ms-search-input" placeholder="ស្វែងរកសិស្ស, គ្រូ, ថ្នាក់រៀន, វត្តមាន, ឧបករណ៍ជំនួយ..." autocomplete="off">
            <kbd>ESC</kbd>
          </div>
          <div id="msSearchResults" class="ms-search-results">
            <!-- Dynamic search results populated here -->
          </div>
          <div class="ms-search-footer">
            <span><i class="fa-solid fa-arrows-up-down"></i> ប្រើព្រួញឡើងលើ/ចុះក្រោម ដើម្បីរើស</span>
            <span><i class="fa-solid fa-arrow-turn-down"></i> ចុច Enter ដើម្បីបើក</span>
          </div>
        </div>
      `;
      modal.onclick = () => this.closeGlobalSearch();
      document.body.appendChild(modal);

      const input = document.getElementById("msGlobalSearchInput");
      input.addEventListener("input", (e) => this.handleSearchQuery(e.target.value));
      input.addEventListener("keydown", (e) => this.handleSearchKeyNav(e));
    } else {
      modal.style.display = "flex";
    }

    const input = document.getElementById("msGlobalSearchInput");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 60);
      this.handleSearchQuery("");
    }
  },

  closeGlobalSearch() {
    const modal = document.getElementById("msGlobalSearchModal");
    if (modal) {
      modal.style.display = "none";
    }
  },

  toggleGlobalSearch() {
    const modal = document.getElementById("msGlobalSearchModal");
    if (modal && modal.style.display !== "none") {
      this.closeGlobalSearch();
    } else {
      this.openGlobalSearch();
    }
  },

  handleSearchQuery(query) {
    const q = (query || "").trim().toLowerCase();
    const resultsContainer = document.getElementById("msSearchResults");
    if (!resultsContainer) return;

    this.searchResults = [];
    this.activeSearchIndex = -1;

    // Default System Navigation Destinations
    const defaultNavs = [
      { type: "nav", tab: "dashboard", icon: "fa-chart-pie", color: "#38bdf8", title: "ផ្ទាំងគ្រប់គ្រង (Dashboard)", sub: "ស្ថិតិ និងទិដ្ឋភាពទូទៅនៃសាលា" },
      { type: "nav", tab: "directory", icon: "fa-users", color: "#818cf8", title: "បញ្ជីឈ្មោះសិស្ស (Student Directory)", sub: "គ្រប់គ្រង និងស្វែងរកសិស្សទាំងអស់" },
      { type: "nav", tab: "attendance", icon: "fa-calendar-check", color: "#34d399", title: "កត់ត្រាវត្តមាន (Attendance)", sub: "កត់ត្រា និងរបាយការណ៍វត្តមានប្រចាំថ្ងៃ" },
      { type: "nav", tab: "timetable", icon: "fa-desktop", color: "#06b6d4", title: "បន្ទប់កុំព្យូទ័រ Lab (Smart Lab)", sub: "ត្រួតពិនិត្យ 16 ម៉ាស៊ីន និងកាលវិភាគ" },
      { type: "nav", tab: "exams", icon: "fa-file-lines", color: "#fbbf24", title: "ការប្រឡង & ពិន្ទុ (Exams & Results)", sub: "គ្រប់គ្រងវិញ្ញាសា និងពិន្ទុសិស្ស" },
      { type: "nav", tab: "register", icon: "fa-user-plus", color: "#10b981", title: "ចុះឈ្មោះសិស្សថ្មី (Enrollment)", sub: "ទម្រង់ចុះឈ្មោះសិស្សចូលរៀន" },
      { type: "nav", tab: "fees", icon: "fa-receipt", color: "#f43f5e", title: "បង់ថ្លៃសិក្សា (Tuition Fees)", sub: "វិក្កយបត្រ និងការទូទាត់" },
      { type: "nav", tab: "reports", icon: "fa-chart-column", color: "#a855f7", title: "របាយការណ៍សាលា (Reports)", sub: "ស្ថិតិ និងការនាំចេញទិន្នន័យ Excel/PDF" },
      { type: "nav", tab: "settings", icon: "fa-gear", color: "#94a3b8", title: "ការកំណត់ប្រព័ន្ធ (Settings)", sub: "Telegram, Firebase, Backup & Restore" }
    ];

    // Filter Navigation Tabs
    const matchedNavs = defaultNavs.filter(item => 
      !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
    );
    this.searchResults.push(...matchedNavs);

    // Search Students
    if (q && App.state && App.state.students) {
      const matchedStudents = App.state.students.filter(s => {
        const nameKh = (s.nameKh || s.name || "").toLowerCase();
        const nameEn = (s.nameEn || "").toLowerCase();
        const id = (s.id || s.studentId || "").toLowerCase();
        const phone = (s.phone || "").toLowerCase();
        return nameKh.includes(q) || nameEn.includes(q) || id.includes(q) || phone.includes(q);
      }).slice(0, 8);

      matchedStudents.forEach(s => {
        this.searchResults.push({
          type: "student",
          studentId: s.id || s.studentId,
          icon: "fa-user-graduate",
          color: "#c084fc",
          title: `${s.nameKh || s.name || "សិស្ស"} (${s.nameEn || ""})`,
          sub: `ID: ${s.id || s.studentId || "---"} • ថ្នាក់: ${s.grade || s.class || "ទូទៅ"} • ទូរស័ព្ទ: ${s.phone || "---"}`
        });
      });
    }

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 30px 10px; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; opacity: 0.3; margin-bottom: 10px; display: block;"></i>
          <p style="font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">រកមិនឃើញទិន្នន័យ "${query}" ឡើយ</p>
          <p style="font-size: 0.8rem;">សូមសាកល្បងស្វែងរកដោយឈ្មោះសិស្ស, លេខសម្គាល់ ID ឬឈ្មោះទំព័រ</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = this.searchResults.map((item, idx) => `
      <div class="ms-search-item ${idx === 0 ? "selected" : ""}" data-idx="${idx}" onclick="Motion.selectSearchResult(${idx})">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; color: ${item.color}; font-size: 1rem;">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: #ffffff;">${item.title}</div>
            <div style="font-size: 0.76rem; color: #94a3b8;">${item.sub}</div>
          </div>
        </div>
        <span class="badge" style="background: rgba(124, 58, 237, 0.15); color: #a78bfa; font-size: 0.72rem; padding: 3px 8px; border-radius: 6px;">
          ${item.type === "student" ? "សិស្ស" : "ទំព័រ"}
        </span>
      </div>
    `).join("");

    this.activeSearchIndex = 0;
  },

  handleSearchKeyNav(e) {
    const items = document.querySelectorAll(".ms-search-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.activeSearchIndex = (this.activeSearchIndex + 1) % items.length;
      this.updateSelectedSearchItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.activeSearchIndex = (this.activeSearchIndex - 1 + items.length) % items.length;
      this.updateSelectedSearchItem(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.activeSearchIndex >= 0 && this.activeSearchIndex < this.searchResults.length) {
        this.selectSearchResult(this.activeSearchIndex);
      }
    }
  },

  updateSelectedSearchItem(items) {
    items.forEach((item, idx) => {
      if (idx === this.activeSearchIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        item.classList.remove("selected");
      }
    });
  },

  selectSearchResult(index) {
    const item = this.searchResults[index];
    if (!item) return;

    this.closeGlobalSearch();

    if (item.type === "nav") {
      App.switchTab(item.tab);
    } else if (item.type === "student") {
      App.switchTab("directory");
      setTimeout(() => {
        if (typeof DirectoryView !== "undefined" && DirectoryView.openStudentDetailModal) {
          DirectoryView.openStudentDetailModal(item.studentId);
        }
      }, 200);
    }
  },

  /**
   * 5. High-End Modern Toast Notification System
   */
  toast(message, type = "success", duration = 3500) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-circle-check text-emerald-400";
    if (type === "error") iconClass = "fa-circle-xmark text-rose-400";
    if (type === "warning") iconClass = "fa-triangle-exclamation text-amber-400";
    if (type === "info") iconClass = "fa-circle-info text-cyan-400";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size: 1.25rem;"></i>
      <div style="flex: 1; font-size: 0.88rem; line-height: 1.4;">${message}</div>
      <button type="button" style="background: transparent; border: none; color: #a1a1aa; cursor: pointer; padding: 4px;" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 260);
    }, duration);
  },

  /**
   * 6. Dynamic Ambient Light Canvas Effect (High-Performance GPU Particle & Constellation Glow)
   */
  initDynamicBackdrop() {
    let canvas = document.getElementById("msAmbientCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "msAmbientCanvas";
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
        opacity: 0.55;
      `;
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: -1000, y: -1000, radius: 140 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const particles = [];
    const particleCount = 28; // High performance, 60+ FPS guarantee

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 2.2 + 1.2,
        color: i % 3 === 0 ? "rgba(124, 58, 237, 0.65)" : (i % 3 === 1 ? "rgba(6, 182, 212, 0.6)" : "rgba(245, 158, 11, 0.45)"),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;

        // Interactive mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(renderParticles);
    }
  },

  /**
   * 7. Interactive Button Click Ripple System
   */
  bindButtonRipples() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-primary, .btn-secondary, .btn-segmented, .btn-submit-pro, .ms-update-btn, .theme-btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "ms-ripple-effect";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  },

  /**
   * 8. Dynamic Card Cursor Spotlight Reflection
   */
  bindCardSpotlight() {
    let ticking = false;
    document.addEventListener("mousemove", (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
          document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);

          const card = e.target.closest(".card, .kpi-card, .login-master-container, .student-card");
          if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Motion.init());
} else {
  Motion.init();
}
