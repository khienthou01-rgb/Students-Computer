/**
 * TIS Lab Computer - Live Watch & Auto-Deploy
 * Automatically monitors file changes (HTML, CSS, JS) and pushes them live
 * to Firebase Hosting without any manual steps.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BASE_DIR = __dirname;
let debounceTimer = null;
let isDeploying = false;
let pendingDeploy = false;

const WATCH_EXTENSIONS = ['.html', '.css', '.js', '.json', '.svg'];
const IGNORED_DIRS = ['node_modules', '.git', '.firebase', 'google-apps-script'];
const IGNORED_FILES = ['deploy.js', 'watch-deploy.js', 'sw.js', 'config.js'];

console.log(`========================================================`);
console.log(`👀 TIS Lab Computer - Live Watch & Auto-Deploy Active`);
console.log(`📂 Folder: ${BASE_DIR}`);
console.log(`📡 URL:    https://system-student-c2267.web.app`);
console.log(`💡 រាល់ពេលកែសម្រួល Save លើកូដ វានឹង Auto-Deploy ឡើង Live ភ្លាមៗ!`);
console.log(`========================================================\n`);

function triggerDeploy(changedFile) {
  if (isDeploying) {
    pendingDeploy = true;
    return;
  }

  isDeploying = true;
  console.log(`\n🔄 ពិនិត្យឃើញការផ្លាស់ប្តូរឯកសារ: ${changedFile}`);
  console.log(`⏳ កំពុងដំណើរការ Auto-Deploy ឡើង Firebase Hosting...`);

  exec('node deploy.js', { cwd: BASE_DIR }, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Auto-Deploy Error:`, stderr || error.message);
    } else {
      console.log(stdout);
    }
    isDeploying = false;

    if (pendingDeploy) {
      pendingDeploy = false;
      triggerDeploy('pending changes');
    } else {
      console.log(`👀 កំពុងរង់ចាំការកែសម្រួលបន្ទាប់... (Waiting for changes)`);
    }
  });
}

function shouldWatch(filePath) {
  const rel = path.relative(BASE_DIR, filePath);
  const parts = rel.split(path.sep);

  for (const dir of IGNORED_DIRS) {
    if (parts.includes(dir)) return false;
  }

  const basename = path.basename(filePath);
  if (IGNORED_FILES.includes(basename)) return false;

  const ext = path.extname(filePath).toLowerCase();
  return WATCH_EXTENSIONS.includes(ext);
}

fs.watch(BASE_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const fullPath = path.join(BASE_DIR, filename);

  if (!shouldWatch(fullPath)) return;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerDeploy(filename);
  }, 2500); // 2.5 second debounce to wait for user to finish saving
});
