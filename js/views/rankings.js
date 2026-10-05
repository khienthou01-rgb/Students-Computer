/**
 * View: 3D Podium Student Rankings (តារាងកិត្តិយស & ចំណាត់ថ្នាក់សិស្ស 3D)
 * 2026 Modern EdTech Podium with floating crown, glowing aura, and honor leaderboard.
 */
const RankingsView = {
  filterCourse: "",
  filterShift: "",

  render() {
    return `
      <section id="view-rankings" class="page-view">
        <!-- Header Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #fbbf24;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i>
              <span>តារាងកិត្តិយស & ចំណាត់ថ្នាក់សិស្ស (Honor Roll & Rankings)</span>
              <span class="badge" style="background: rgba(251, 191, 36, 0.15); color: #d97706; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">Top Students</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              ចំណាត់ថ្នាក់សិស្សពូកែតាមពិន្ទុប្រឡង និងការអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab កុំព្យូទ័រ
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" onclick="window.print()" class="btn-secondary" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពតារាងកិត្តិយស</span>
            </button>
          </div>
        </div>

        <!-- Filter Toolbar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 24px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-filter" style="color: #8b5cf6;"></i> តម្រង:
          </div>
          <select id="rankingsCourseFilter" class="form-control" style="width: auto; min-width: 180px; height: 40px; border-radius: 12px;">
            <option value="">-- វគ្គសិក្សាទាំងអស់ --</option>
            <option value="Typing">Typing</option>
            <option value="Word">Microsoft Word</option>
            <option value="Excel">Microsoft Excel</option>
            <option value="PowerPoint">Microsoft PowerPoint</option>
          </select>
          <select id="rankingsShiftFilter" class="form-control" style="width: auto; min-width: 160px; height: 40px; border-radius: 12px;">
            <option value="">-- វេនសិក្សាទាំងអស់ --</option>
            <option value="ព្រឹក">វេនព្រឹក</option>
            <option value="ថ្ងៃ">វេនថ្ងៃ</option>
            <option value="រសៀល">វេនរសៀល</option>
          </select>
        </div>

        <!-- 3D Podium Container -->
        <div class="card" style="padding: 36px 20px 24px; margin-bottom: 28px; border-radius: 24px; background: linear-gradient(180deg, var(--bg-card) 0%, rgba(245, 158, 11, 0.04) 100%); border: 1px solid var(--border-color); text-align: center; position: relative; overflow: hidden;">
          <h3 style="margin: 0 0 28px 0; font-size: 1.25rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; justify-content: center; gap: 10px;">
            <i class="fa-solid fa-crown" style="color: #fbbf24;"></i>
            <span>ជើងឯកឆ្នើមទាំង ៣ រូប (Top 3 Champions)</span>
          </h3>

          <div id="podiumMount">
            <!-- Dynamically injected podium -->
          </div>
        </div>

        <!-- Honor Roll Leaderboard Table -->
        <div class="card" style="padding: 22px; border-radius: 20px; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-list-ol" style="color: #6366f1;"></i>
              <span>តារាងលទ្ធផលចំណាត់ថ្នាក់ទូទៅ (Leaderboard)</span>
            </h3>
            <span id="rankedCountBadge" class="badge" style="background: rgba(99, 102, 241, 0.12); color: #6366f1; font-weight: 700; padding: 4px 12px; border-radius: 16px;">
              0 នាក់
            </span>
          </div>

          <div class="table-responsive">
            <table class="data-table" style="width: 100%;">
              <thead>
                <tr>
                  <th style="width: 70px; text-align: center;">ចំណាត់ថ្នាក់</th>
                  <th>អត្តលេខ & ឈ្មោះសិស្ស</th>
                  <th>ភេទ</th>
                  <th>វគ្គសិក្សា</th>
                  <th>វេន</th>
                  <th style="text-align: center;">ពិន្ទុសរុប</th>
                  <th style="text-align: center;">និទ្ទេស</th>
                  <th style="text-align: center;">កិត្តិយស</th>
                </tr>
              </thead>
              <tbody id="rankingsTableBody">
                <!-- Dynamically filled -->
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  normalizeStudent(s) {
    if (!s) return null;
    return {
      ...s,
      ID: s.ID || s.id || '',
      id: s.ID || s.id || '',
      NameKh: s.NameKh || s.nameKh || '—',
      nameKh: s.NameKh || s.nameKh || '—',
      NameEn: s.NameEn || s.nameEn || '',
      nameEn: s.NameEn || s.nameEn || '',
      Gender: s.Gender || s.gender || 'ប្រុស',
      gender: s.Gender || s.gender || 'ប្រុស',
      Course: s.Course || s.course || 'Typing',
      course: s.Course || s.course || 'Typing',
      Shift: s.Shift || s.shift || 'ព្រឹក',
      shift: s.Shift || s.shift || 'ព្រឹក',
      Status: s.Status || s.status || 'Active',
      status: s.Status || s.status || 'Active',
      Photo: s.Photo || s.Avatar || s.photo || '',
      photo: s.Photo || s.Avatar || s.photo || ''
    };
  },

  getRankedData() {
    const rawStudents = (typeof App !== "undefined" && App.state && App.state.students) ? [...App.state.students] : [];
    const students = rawStudents.map(s => this.normalizeStudent(s));
    const course = (this.filterCourse || "").trim().toLowerCase();
    const shift = (this.filterShift || "").trim();
    const allExams = (typeof StudentAPI !== "undefined" && StudentAPI.getAllExams) ? StudentAPI.getAllExams() : {};

    // Filter active students (exclude dropped)
    let list = students.filter(s => {
      const st = String(s.status || "").toLowerCase();
      return st !== "dropped" && st !== "drop";
    });

    if (course) {
      list = list.filter(s => {
        const sc = (s.course || "").toLowerCase();
        if (course === "word") return sc.includes("word");
        if (course === "excel") return sc.includes("excel");
        if (course === "powerpoint") return sc.includes("powerpoint") || sc.includes("ppt");
        if (course === "typing") return sc.includes("typing") || sc.includes("វាយ");
        return sc === course || sc.includes(course);
      });
    }

    if (shift) {
      list = list.filter(s => (s.shift || "").includes(shift));
    }

    // Calculate real rank scores from actual exam records in StudentAPI
    const ranked = list.map(s => {
      const studentExams = allExams[s.id] || (s.exams && typeof s.exams === "object" ? s.exams : {});
      let validScores = [];

      if (course) {
        // Find exam for this specific course
        const targetKeys = course === "word" ? ["Word", "Microsoft Word"] :
                           (course === "excel" ? ["Excel", "Microsoft Excel"] :
                           (course === "powerpoint" ? ["PowerPoint", "Microsoft PowerPoint"] : ["Typing"]));
        for (const k of targetKeys) {
          const ex = studentExams[k];
          if (ex && typeof ex === "object") {
            const sc = parseFloat(ex.score ?? ex.Score);
            if (!isNaN(sc) && sc >= 0) { validScores.push(sc); break; }
          } else if (typeof ex === "number" && !isNaN(ex)) {
            validScores.push(ex);
            break;
          }
        }
      } else {
        // Overall: average of all taken computer courses
        const checkKeys = [
          ["Typing"],
          ["Word", "Microsoft Word"],
          ["Excel", "Microsoft Excel"],
          ["PowerPoint", "Microsoft PowerPoint"]
        ];

        checkKeys.forEach(variants => {
          for (const k of variants) {
            const ex = studentExams[k];
            if (ex && typeof ex === "object") {
              const sc = parseFloat(ex.score ?? ex.Score);
              if (!isNaN(sc) && sc >= 0) { validScores.push(sc); break; }
            } else if (typeof ex === "number" && !isNaN(ex)) {
              validScores.push(ex);
              break;
            }
          }
        });
      }

      const hasExamData = validScores.length > 0;
      const score = hasExamData ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

      let grade = "— (មិនទាន់ប្រឡង)";
      let badgeColor = "#64748b";
      if (hasExamData) {
        if (score >= 90) { grade = "A (ល្អប្រសើរ)"; badgeColor = "#10b981"; }
        else if (score >= 80) { grade = "B (ល្អណាស់)"; badgeColor = "#3b82f6"; }
        else if (score >= 70) { grade = "C (ល្អ)"; badgeColor = "#f59e0b"; }
        else if (score >= 60) { grade = "D (មធ្យម)"; badgeColor = "#8b5cf6"; }
        else { grade = "E (ខ្សោយ)"; badgeColor = "#ef4444"; }
      }

      return {
        ...s,
        hasExamData,
        finalScore: score,
        scoreDisplay: hasExamData ? `${score}` : "—",
        gradeText: grade,
        gradeColor: badgeColor
      };
    });

    // Sort: Students with real exam scores first (descending by score), then unexamined students
    ranked.sort((a, b) => {
      if (a.hasExamData && !b.hasExamData) return -1;
      if (!a.hasExamData && b.hasExamData) return 1;
      return b.finalScore - a.finalScore;
    });

    return ranked;
  },

  renderRankings() {
    const ranked = this.getRankedData();
    const podiumMount = document.getElementById("podiumMount");
    const tableBody = document.getElementById("rankingsTableBody");
    const countBadge = document.getElementById("rankedCountBadge");

    if (countBadge) countBadge.textContent = `${ranked.length} នាក់`;

    if (ranked.length === 0) {
      if (podiumMount) {
        podiumMount.innerHTML = `
          <div style="padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-trophy" style="font-size: 3rem; opacity: 0.3; margin-bottom: 12px;"></i>
            <p>មិនទាន់មានទិន្នន័យសិស្សសម្រាប់បង្ហាញចំណាត់ថ្នាក់នៅឡើយទេ</p>
          </div>
        `;
      }
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 32px; color: var(--text-muted);">មិនមានទិន្នន័យ</td></tr>`;
      }
      return;
    }

    // Only students with actual completed exams go on the Champions Podium
    const examinedStudents = ranked.filter(s => s.hasExamData && s.finalScore > 0);
    const first = examinedStudents[0] || null;
    const second = examinedStudents[1] || null;
    const third = examinedStudents[2] || null;

    const getAvatar = (s) => {
      if (!s) return "assets/images/default-male.svg";
      if (s.photo) return s.photo;
      return s.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    };

    // Render 3D Podium
    if (podiumMount) {
      if (examinedStudents.length === 0) {
        podiumMount.innerHTML = `
          <div style="padding: 36px 20px; text-align: center; color: var(--text-muted);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(251, 191, 36, 0.12); color: #f59e0b; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              <i class="fa-solid fa-trophy"></i>
            </div>
            <h4 style="margin: 0 0 8px; font-size: 1.05rem; font-weight: 700; color: var(--text-main);">មិនទាន់មានលទ្ធផលប្រឡងបញ្ចប់វគ្គនៅឡើយទេ</h4>
            <p style="margin: 0 0 18px; font-size: 0.85rem; max-width: 480px; margin-inline: auto; color: var(--text-muted);">
              សូមកត់ត្រាពិន្ទុជាក់ស្តែងរបស់សិស្សក្នុងទំព័រ «ប្រឡងបញ្ចប់វគ្គ» ដើម្បីឱ្យប្រព័ន្ធគណនាចំណាត់ថ្នាក់ឆ្នើមនៅលើ Podium ដោយស្វ័យប្រវត្តិ។
            </p>
            <button type="button" class="btn-primary" onclick="App.switchTab('exams')" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; font-size: 0.86rem; border-radius: 10px;">
              <i class="fa-solid fa-award"></i> <span>ទៅកាន់ទំព័រប្រឡង (Exams Portal)</span>
            </button>
          </div>
        `;
      } else {
        podiumMount.innerHTML = `
          <div class="podium-wrapper">
            <!-- Rank 2: Silver (Left) -->
            ${second ? `
              <div class="podium-column podium-rank-2">
                <div class="podium-avatar-wrap">
                  <span class="podium-badge-medal" style="background: #94a3b8; color: #fff;">🥈 #2</span>
                  <img src="${getAvatar(second)}" alt="${second.nameKh}" class="podium-avatar" onerror="this.src='assets/images/default-male.svg'">
                </div>
                <div class="podium-student-name">${second.nameKh}</div>
                <div class="podium-student-score">${second.finalScore} ពិន្ទុ</div>
                <div class="podium-student-course">${second.course} • វេន${second.shift}</div>
                <div class="podium-pedestal pedestal-2">
                  <span class="pedestal-number">2</span>
                </div>
              </div>
            ` : '<div style="flex: 1;"></div>'}

            <!-- Rank 1: Gold (Center) -->
            ${first ? `
              <div class="podium-column podium-rank-1">
                <div class="podium-crown"><i class="fa-solid fa-crown"></i></div>
                <div class="podium-avatar-wrap">
                  <span class="podium-badge-medal" style="background: #f59e0b; color: #fff;">🥇 #1</span>
                  <img src="${getAvatar(first)}" alt="${first.nameKh}" class="podium-avatar rank-1-avatar" onerror="this.src='assets/images/default-male.svg'">
                </div>
                <div class="podium-student-name" style="font-size: 1.15rem; font-weight: 900; color: #d97706;">${first.nameKh}</div>
                <div class="podium-student-score" style="font-size: 1.25rem; font-weight: 900; color: #f59e0b;">${first.finalScore} ពិន្ទុ</div>
                <div class="podium-student-course">${first.course} • វេន${first.shift}</div>
                <div class="podium-pedestal pedestal-1">
                  <span class="pedestal-number">1</span>
                </div>
              </div>
            ` : ''}

            <!-- Rank 3: Bronze (Right) -->
            ${third ? `
              <div class="podium-column podium-rank-3">
                <div class="podium-avatar-wrap">
                  <span class="podium-badge-medal" style="background: #d97706; color: #fff;">🥉 #3</span>
                  <img src="${getAvatar(third)}" alt="${third.nameKh}" class="podium-avatar" onerror="this.src='assets/images/default-male.svg'">
                </div>
                <div class="podium-student-name">${third.nameKh}</div>
                <div class="podium-student-score">${third.finalScore} ពិន្ទុ</div>
                <div class="podium-student-course">${third.course} • វេន${third.shift}</div>
                <div class="podium-pedestal pedestal-3">
                  <span class="pedestal-number">3</span>
                </div>
              </div>
            ` : '<div style="flex: 1;"></div>'}
          </div>
        `;
      }
    }

    // Render Leaderboard Table
    if (tableBody) {
      tableBody.innerHTML = ranked.map((s, idx) => {
        const rank = idx + 1;
        let rankBadge = `<span class="badge" style="background: rgba(0,0,0,0.06); color: var(--text-muted); font-weight: 700; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">${rank}</span>`;
        if (s.hasExamData && rank === 1) rankBadge = `<span style="font-size: 1.2rem;" title="លេខ ១ មេដាយមាស">🥇</span>`;
        else if (s.hasExamData && rank === 2) rankBadge = `<span style="font-size: 1.2rem;" title="លេខ ២ មេដាយប្រាក់">🥈</span>`;
        else if (s.hasExamData && rank === 3) rankBadge = `<span style="font-size: 1.2rem;" title="លេខ ៣ មេដាយសំរឹទ្ធ">🥉</span>`;

        const avatar = getAvatar(s);

        return `
          <tr>
            <td style="text-align: center; vertical-align: middle;">${rankBadge}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${avatar}" alt="${s.nameKh}" style="width: 38px; height: 38px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border-color);" onerror="this.src='assets/images/default-male.svg'">
                <div>
                  <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${s.nameKh}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">${s.id || ''} ${s.nameEn ? '• ' + s.nameEn : ''}</div>
                </div>
              </div>
            </td>
            <td>${s.gender || 'ប្រុស'}</td>
            <td><span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; font-weight: 700; padding: 3px 8px; border-radius: 6px;">${s.course}</span></td>
            <td>វេន${s.shift}</td>
            <td style="text-align: center; font-weight: 800; font-size: 1.05rem; color: ${s.hasExamData ? '#0284c7' : 'var(--text-muted)'};">${s.scoreDisplay}</td>
            <td style="text-align: center;">
              <span class="badge" style="background: ${s.gradeColor}18; color: ${s.gradeColor}; font-weight: 700; padding: 4px 10px; border-radius: 8px;">
                ${s.gradeText}
              </span>
            </td>
            <td style="text-align: center;">
              ${s.hasExamData && rank <= 3 ? '<span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 700; padding: 3px 8px; border-radius: 6px;"><i class="fa-solid fa-star"></i> សិស្សឆ្នើម</span>' : (s.hasExamData ? '<span style="color: var(--text-muted); font-size: 0.8rem;">ល្អ</span>' : '<span style="color: var(--text-muted); font-size: 0.8rem;">រង់ចាំប្រឡង</span>')}
            </td>
          </tr>
        `;
      }).join("");
    }
  },

  initEvents() {
    const courseFilter = document.getElementById("rankingsCourseFilter");
    if (courseFilter) {
      courseFilter.onchange = (e) => {
        this.filterCourse = e.target.value;
        this.renderRankings();
      };
    }

    const shiftFilter = document.getElementById("rankingsShiftFilter");
    if (shiftFilter) {
      shiftFilter.onchange = (e) => {
        this.filterShift = e.target.value;
        this.renderRankings();
      };
    }

    this.renderRankings();
  }
};
