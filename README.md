# ប្រព័ន្ធគ្រប់គ្រងសិស្សទំនើប (TIS Lab Computer - Modern Student Management System)

ប្រព័ន្ធគ្រប់គ្រងសិស្ស (Student Management System) កម្រិតខ្ពស់ និងស្រស់ស្អាត (Modern UI/UX) ដែលរចនាឡើងតាមស្តង់ដារ **Modular Architecture** ដោយបំបែកកូដតាមផ្នែកច្បាស់លាស់ ងាយស្រួលថែទាំ (Maintainable) ភ្ជាប់ទិន្នន័យផ្ទាល់ជាមួយ **Firebase Cloud Realtime Database** និង **Telegram Bot Notification**។

---

## 🌟 លក្ខណៈពិសេសចម្បងៗ (Key Features)

1. **ផ្ទាំងគ្រប់គ្រងទិន្នន័យ (Dashboard & Analytics)**:
   - បង្ហាញស្ថិតិ KPI សំខាន់ៗ៖ សិស្សសរុប, សិស្សប្រុស, សិស្សស្រី, សិស្សកំពុងសិក្សា និងសិស្សចុះឈ្មោះថ្មីប្រចាំខែ (មាន Dynamic Animated Counters)។
   - ក្រាហ្វស្ថិតិទាក់ទាញ (Interactive Charts ជាមួយ Chart.js)៖ កម្រិតថ្នាក់, សមាមាត្រយេនឌ័រ, ស្ថិតិវេនសិក្សា។
   - បញ្ជីសិស្សដែលទើបចុះឈ្មោះថ្មីៗ (Recent Registrations)។

2. **ទម្រង់ចុះឈ្មោះសិស្សថ្មី & HostImg Pro (Smart Image Hosting)**:
   - បញ្ចូលឈ្មោះខ្មែរ, ឈ្មោះឡាតាំង, ភេទ, ថ្ងៃកំណើត, ថ្នាក់, វេន, លេខទូរស័ព្ទ, លេខអាណាព្យាបាល, អាសយដ្ឋាន និងរូបថត។
   - **បច្ចេកវិទ្យា HostImg Pro** កាត់សមាមាត្រ 3:4 Passport ស្វ័យប្រវត្តិតម្រឹមផ្ទៃមុខ និង Upload ទៅកាន់ Local Server / Cloud CDN ដោយស្វ័យប្រវត្តិ។
   - កាត់បន្ថយទំហំ Database ដល់ទៅ 90% ការពារបញ្ហា Browser QuotaExceededError ទាំងស្រុង។

3. **ការគ្រប់គ្រងវត្តមាន QR Code & ការជូនដំណឹងតាម Telegram Bot**:
   - ស្កេន QR Code កាតសិស្ស ឬ Check វត្តមានរហ័សតាមវេន (ព្រឹក • រសៀល • យប់)។
   - ផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិចូលគ្រុប Telegram ទាំង ៣ វេន។
   - របាយការណ៍វត្តមានប្រចាំថ្ងៃស្វ័យប្រវត្តិនៅម៉ោង ៧:០០ យប់ (19:00 Daily Summary)។

4. **គ្រប់គ្រងការប្រឡង & ចេញវិញ្ញាបនបត្រ (Certificates & ID Cards)**:
   - បញ្ចូលពិន្ទុប្រឡងតាមមុខវិជ្ជា (Word, Excel, PowerPoint, Network, Maintenance) គណនាចំណាត់ថ្នាក់ និងនិទ្ទេសស្វ័យប្រវត្តិ។
   - បោះពុម្ពកាតសិស្ស (Student ID Card) មាន QR Code។
   - បោះពុម្ពវិញ្ញាបនបត្រផ្លូវការ (Official Certificate) មានបោះត្រាសាលា និងហត្ថលេខាឌីជីថលស្វ័យប្រវត្តិ។

---

## 🚀 ការ Hosting & ដាក់ឱ្យដំណើរការប្រព័ន្ធ (Full Hosting Architecture)

ប្រព័ន្ធត្រូវបានរៀបចំឡើងយ៉ាងល្អឥតខ្ចោះ គាំទ្រការ Hosting ទាំង **Online លើពពក (Cloud)** និង **Local ក្នុងបណ្តាញសាលា (Wi-Fi/LAN)**៖

### ១. Online Cloud Hosting (ដំណើរការលើអ៊ីនធឺណិត ២៤/៧ តាម GitHub Pages)
ប្រព័ន្ធត្រូវបានដាក់ឱ្យដំណើរការផ្ទាល់នៅលើ **GitHub Pages Global CDN** ជាមួយ SSL Certificate សុវត្ថិភាពខ្ពស់ និងល្បឿនលឿនបំផុត៖
- 🔗 **តំណភ្ជាប់ផ្លូវការ (Live URL):** [https://khienthou01-rgb.github.io/Students-Computer/](https://khienthou01-rgb.github.io/Students-Computer/)
- 📦 **GitHub Repository:** [https://github.com/khienthou01-rgb/Students-Computer](https://github.com/khienthou01-rgb/Students-Computer)
- ⚡ **របៀប Deploy កូដថ្មីដោយចុចតែម្តង (1-Click GitHub Deploy):**
  - គ្រាន់តែ **Double-click លើ `Deploy-GitHub.bat`**
  - ប្រព័ន្ធនឹងស្វ័យប្រវត្តិ Commit និង Push ឡើង GitHub Pages ភ្លាមៗក្នុងរយៈពេលត្រឹមតែ ២ វិនាទី!
- 🌐 **គាំទ្រ Multi-Cloud Hosting (Vercel & Netlify):**
  - មានភ្ជាប់ស្រេចនូវ `vercel.json` និង `_redirects` អាចយកទៅភ្ជាប់ជាមួយ Vercel ឬ Netlify បានដោយចុចតែ ១ Click ប៉ុណ្ណោះ។

---

### ២. Local School / Wi-Fi Network Hosting (ប្រើក្នុងបន្ទប់កុំព្យូទ័រ & សាលារៀន)
សម្រាប់សាលារៀន ឬបន្ទប់អនុវត្តកុំព្យូទ័រដែលចង់ឱ្យកុំព្យូទ័រទាំងអស់ និងទូរស័ព្ទដៃរបស់លោកគ្រូអ្នកគ្រូអាចចូលប្រើបានក្នុង Wi-Fi តែមួយ៖
- 💻 **លើកុំព្យូទ័រមេ (Host Machine):** [http://localhost:8080/](http://localhost:8080/)
- 📱 **លើទូរស័ព្ទដៃ & កុំព្យូទ័រសិស្សក្នុង Wi-Fi:** `http://192.168.1.2:8080/` (ឬតាម Local IPv4 ដែលបង្ហាញពេលបើក Server)
- 🚀 **របៀបបើក Server:**
  - វិធីធម្មតា៖ Double-click លើ `Start-Server.bat` (បើក Terminal បង្ហាញព័ត៌មានបណ្តាញ)
  - វិធី Silent Background៖ Double-click លើ `Start-Background.vbs` (រត់ស្ងាត់ក្នុង Background ដោយមិនបាច់បើកផ្ទាំងខ្មៅ CMD ឡើយ)
- 🛑 **របៀបបិទ Server:**
  - Double-click លើ `Stop-Server.bat`

---

### ៣. សេវាផ្ទុករូបភាព HostImg Pro (Smart Image Hosting)
- **Local Endpoint:** `POST http://localhost:8080/api/upload` រក្សាទុករូបភាពចូល Folder `uploads/images/` លើ Disk ដោយស្វ័យប្រវត្តិ។
- **Multi-Tier Fallback:** ដំណើរការ Local Server ➔ ImgBB CDN ➔ FreeImage CDN ➔ Telegram Bot CDN ធានាថារូបភាព Upload បានជោគជ័យ ១០០%។
- **1-Click Base64 Migration:** ក្នុងម៉ឺនុយ **Settings (ការកំណត់)** មានប៊ូតុងស្កេន និងបំលែងរូបភាព Base64 ចាស់ៗទាំងអស់ទៅជា Hosted URLs ដើម្បីសន្សំទំហំ Browser LocalStorage បានដល់ទៅ 90%។

---

### ៤. ដំឡើងជា Native Mobile & Desktop App (PWA)
- បើកតំណភ្ជាប់ `https://system-student-c2267.web.app` ឬ `http://192.168.1.2:8080/` លើទូរស័ព្ទ Android/iOS ឬកុំព្យូទ័រ។
- ចុចលើ **"Install App"** ឬ **"Add to Home Screen"** ដើម្បីដំឡើងជា App ផ្លូវការលើអេក្រង់ទូរស័ព្ទ ដែលអាចដំណើរការបានលឿន និងចងចាំទិន្នន័យ Offline យ៉ាងរលូន។
