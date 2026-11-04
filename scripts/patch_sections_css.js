const fs = require('fs');

const files = [
  'website/public/simulator/css/sections.css',
  'website/css/sections.css'
];

const pinkLineCss = `
.explore-line-btn[data-line="pink"].active,
body.light-mode .explore-line-btn[data-line="pink"].active { 
    background: #EC4899 !important; 
    color: #FFFFFF !important; 
    border-color: #EC4899 !important;
    box-shadow: none !important;
}

.explore-line-btn[data-line="pink"]:not(.active),
body.light-mode .explore-line-btn[data-line="pink"]:not(.active) {
    color: #EC4899 !important;
    border-color: rgba(236, 72, 153, 0.35) !important;
    background: rgba(236, 72, 153, 0.08) !important;
}
.explore-line-btn[data-line="pink"]:not(.active):hover,
body.light-mode .explore-line-btn[data-line="pink"]:not(.active):hover {
    border-color: #EC4899 !important;
    background: rgba(236, 72, 153, 0.18) !important;
}
`;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(\.explore-cat-btn,\s*\.explore-line-btn\s*\{[^}]*?)text-transform:\s*uppercase;/s, '$1text-transform: none;');
  
  if (!content.includes('data-line="pink"')) {
    content = content.replace(
      /body\.light-mode\s+\.explore-line-btn\[data-line="yellow"\]:not\(\.active\):hover\s*\{[^}]*?\}/s,
      (match) => match + '\n' + pinkLineCss
    );
  }
  
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated', f);
}
