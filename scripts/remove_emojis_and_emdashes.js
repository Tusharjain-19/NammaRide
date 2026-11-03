const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../website');

// Emoji replacement mapping
const emojiReplacements = {
  '📖': '',
  '🚀': '',
  '📊': '',
  '🔍': '',
  '🌟': '',
  '📲': '',
  '📷': '',
  '🔄': '',
  '🚪': '',
  '📍': '',
  '♿': '',
  '👆': '',
  '✓': '',
  '✅': '',
  '❌': '',
  '⚡': '',
  '🚆': '',
  '💡': '',
  '🔥': ''
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace emdash
  content = content.replace(/—/g, ' - ');
  // Clean double spaces if any
  content = content.replace(/  -  /g, ' - ');

  // 2. Replace emojis
  for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
    content = content.replaceAll(emoji, replacement);
  }

  // Generic Unicode emoji regex cleanup
  const genericEmojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/ug;
  content = content.replace(genericEmojiRegex, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (['node_modules', '.git', 'dist'].includes(f)) continue;
      walkDir(full);
    } else if (f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html')) {
      processFile(full);
    }
  }
}

// Process website/src and website/index.html
console.log('Starting emoji and emdash cleanup...');
walkDir(path.join(ROOT_DIR, 'src'));
processFile(path.join(ROOT_DIR, 'index.html'));
console.log('Cleanup finished!');
