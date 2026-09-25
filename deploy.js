/**
 * TIS Lab Computer - Smart Deploy Script
 * Automatically updates Service Worker cache version, busts browser cache,
 * and deploys to Firebase Hosting with instant zero-downtime updates.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = __dirname;
const SW_PATH = path.join(BASE_DIR, 'sw.js');
const INDEX_PATH = path.join(BASE_DIR, 'index.html');
const CONFIG_PATH = path.join(BASE_DIR, 'js', 'config.js');

function getTimestamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}_${h}${min}${s}`;
}

function updateCacheVersion() {
  const ts = getTimestamp();
  const newCacheName = `tislab-v2.1.${ts}`;

  console.log(`\n========================================================`);
  console.log(`🚀 TIS Lab Computer Smart Deploy Tool`);
  console.log(`📅 Timestamp Version: ${ts}`);
  console.log(`📦 New Cache Name:    ${newCacheName}`);
  console.log(`========================================================\n`);

  // 1. Update sw.js CACHE_NAME
  if (fs.existsSync(SW_PATH)) {
    let swContent = fs.readFileSync(SW_PATH, 'utf8');
    const regex = /const CACHE_NAME = ["'][^"']+["'];/;
    if (regex.test(swContent)) {
      swContent = swContent.replace(regex, `const CACHE_NAME = "${newCacheName}";`);
      fs.writeFileSync(SW_PATH, swContent, 'utf8');
      console.log(`✅ Updated Service Worker cache name in sw.js`);
    }
  }

  // 2. Update APP_CONFIG.appVersion in js/config.js if exists
  if (fs.existsSync(CONFIG_PATH)) {
    let configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const versionRegex = /appVersion:\s*["'][^"']+["']/;
    if (versionRegex.test(configContent)) {
      configContent = configContent.replace(versionRegex, `appVersion: "2.1.${ts.split('_')[0]}"`);
      fs.writeFileSync(CONFIG_PATH, configContent, 'utf8');
      console.log(`✅ Updated appVersion in js/config.js`);
    }
  }

  // 3. Update ?v= query strings in index.html for all scripts and styles
  if (fs.existsSync(INDEX_PATH)) {
    let indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
    indexContent = indexContent.replace(/\?v=[a-zA-Z0-9_-]+/g, `?v=${ts}`);
    fs.writeFileSync(INDEX_PATH, indexContent, 'utf8');
    console.log(`✅ Updated ?v=${ts} cache busters in index.html`);
  }

  return { ts, newCacheName };
}

async function deploy() {
  const { ts } = updateCacheVersion();

  console.log(`\n🌐 កំពុងបង្ហោះឡើងលើ Firebase Hosting (Public Live)...`);

  let deployed = false;
  // Try 1: Direct Node.js API via firebase-tools
  try {
    let fb;
    try {
      fb = require('firebase-tools');
    } catch (e) {
      fb = require('C:/Users/khien/AppData/Roaming/npm/node_modules/firebase-tools');
    }
    if (fb && typeof fb.deploy === 'function') {
      console.log(`⚡ កំពុងដំណើរការ Native Firebase Engine (Zero Config & Fast)...`);
      await fb.deploy({
        project: 'system-student-c2267',
        only: 'hosting',
        cwd: BASE_DIR
      });
      deployed = true;
    }
  } catch (err) {
    console.warn(`⚠️ Direct Engine Error, trying CLI fallback:`, err.message);
  }

  // Fallback: CLI via cmd.exe
  if (!deployed) {
    try {
      execSync('cmd.exe /c "firebase deploy --only hosting"', {
        cwd: BASE_DIR,
        stdio: 'inherit'
      });
      deployed = true;
    } catch (error) {
      console.error(`\n❌ បរាជ័យក្នុងការ Deploy:`, error.message);
      process.exit(1);
    }
  }

  if (deployed) {
    console.log(`\n========================================================`);
    console.log(`🎉 ការបង្ហោះជោគជ័យ 100%! (Deployment Succeeded)`);
    console.log(`🔗 Public URL:  https://system-student-c2267.web.app`);
    console.log(`🔗 Backup URL:  https://system-student-c2267.firebaseapp.com`);
    console.log(`✨ Version:     ${ts}`);
    console.log(`⚡ Caching:     Browser Cache-Busting & Auto-Update Active`);
    console.log(`========================================================\n`);
  }
}

deploy();

