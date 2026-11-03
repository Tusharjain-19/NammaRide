const fs = require('fs');
const path = require('path');

const sectionsPaths = [
  path.join(__dirname, '../website/public/simulator/js/ui/sections.js'),
  path.join(__dirname, '../website/js/ui/sections.js')
];

sectionsPaths.forEach(sp => {
  if (!fs.existsSync(sp)) return;
  let content = fs.readFileSync(sp, 'utf8');

  // 1. In renderStationsList: add pink line config
  const targetLinesConfig = /const lines = \[\s*\{\s*key:\s*'purple'[\s\S]*?\{\s*key:\s*'yellow'[\s\S]*?\}\s*\];/;
  const replacementLinesConfig = `const lines = [
        { key: 'purple', name: 'Purple Line', color: '#8B5CF6' },
        { key: 'green', name: 'Green Line', color: '#22C55E' },
        { key: 'yellow', name: 'Yellow Line', color: '#FBBF24' },
        { key: 'pink', name: 'Pink Line', color: '#EC4899' }
    ];`;

  if (targetLinesConfig.test(content)) {
    content = content.replace(targetLinesConfig, replacementLinesConfig);
    console.log(`Updated lines config in ${sp}`);
  }

  // 2. Add Pink Line filter button in renderStationsList
  const targetFilterBtn = /<button class="line-filter-btn shrink-0 px-3 py-1\.5 rounded-full text-xs font-semibold bg-\[#FBBF24\]\/10 text-\[#D97706\] border border-\[#FBBF24\]\/20 transition-opacity opacity-70 hover:opacity-100" data-line="Yellow Line">\$\{T_fn\('lineYellow'\) \|\| 'Yellow'\}<\/button>/;
  const replacementFilterBtn = `<button class="line-filter-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FBBF24]/10 text-[#D97706] border border-[#FBBF24]/20 transition-opacity opacity-70 hover:opacity-100" data-line="Yellow Line">\${T_fn('lineYellow') || 'Yellow'}</button>
            <button class="line-filter-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20 transition-opacity opacity-70 hover:opacity-100" data-line="Pink Line">\${T_fn('linePink') || 'Pink'}</button>`;

  if (targetFilterBtn.test(content)) {
    content = content.replace(targetFilterBtn, replacementFilterBtn);
    console.log(`Updated line filter buttons in ${sp}`);
  }

  // 3. In station card rendering: add status badge if upcoming
  const targetCardSub = /\$\{knName && l === 'en' \? `<div class="station-card-sub">\$\{knName\}<\/div>` : ''\}/;
  const replacementCardSub = `\${knName && l === 'en' ? \`<div class="station-card-sub">\${knName}</div>\` : ''}
                    \${station.isActive === false || station.status === 'under_construction' ? \`<div class="mt-1"><span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/25">Upcoming (Phase 2 Underground 2027)</span></div>\` : ''}`;

  if (targetCardSub.test(content)) {
    content = content.replace(targetCardSub, replacementCardSub);
    console.log(`Updated station card badge in ${sp}`);
  }

  // 4. In renderExplore: add Pink line button
  const targetExploreBtn = /<button class="explore-line-btn" data-line="yellow">\$\{T_fn\('lineYellow'\) \|\| 'Yellow Line'\}<\/button>/;
  const replacementExploreBtn = `<button class="explore-line-btn" data-line="yellow">\${T_fn('lineYellow') || 'Yellow Line'}</button>
            <button class="explore-line-btn" data-line="pink">\${T_fn('linePink') || 'Pink Line'}</button>`;

  if (targetExploreBtn.test(content)) {
    content = content.replace(targetExploreBtn, replacementExploreBtn);
    console.log(`Updated explore line filter button in ${sp}`);
  }

  fs.writeFileSync(sp, content, 'utf8');
});
