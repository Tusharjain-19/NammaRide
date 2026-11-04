const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const files = [
    path.join(ROOT_DIR, 'website/public/simulator/js/main.js'),
    path.join(ROOT_DIR, 'website/js/main.js')
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // Replace dangling old button
    const danglingRegex = /<span>\$\{T\('bookOnWhatsApp'\) \|\| 'WhatsApp Ticket'\}<\/span>\s*<\/button>\s*<\/div>\s*<span class="text-xs font-black text-emerald-500[\s\S]*?<span>WhatsApp Ticket<\/span>\s*<\/button>\s*<\/div>/;

    const cleanReplacement = `<span>WhatsApp Ticket</span>
                </button>
            </div>`;

    if (danglingRegex.test(content)) {
        content = content.replace(danglingRegex, cleanReplacement);
        fs.writeFileSync(f, content, 'utf8');
        console.log('Cleaned up dangling button in', f);
    } else {
        console.log('Regex did not match in', f);
    }
});
