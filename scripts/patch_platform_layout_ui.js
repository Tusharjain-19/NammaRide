const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to inject Platform Layout into sections.js
const sectionsFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/js/ui/sections.js'),
    path.join(ROOT_DIR, 'website/js/ui/sections.js')
];

const platformLayoutFunction = `
function getStationPlatformLayout(station) {
    if (!station) return null;
    const name = station.name || '';
    const id = station.id || '';

    // Jayadeva Hospital (Interchange between Pink Line Level 6 and Yellow Line Level 5)
    if (name === 'Jayadeva Hospital' || id === 'PK05' || id === 'Y03') {
        return {
            isMultiLevel: true,
            title: 'Platform Layout',
            subtitle: 'Jayadeva Multi-Tier Elevated Interchange',
            levels: [
                {
                    levelName: 'Pink Line (Level 6)',
                    lineName: 'Pink Line',
                    color: '#EC4899',
                    corridor: 'North-South along Bannerghatta Road',
                    platforms: [
                        {
                            number: '3',
                            direction: 'Northbound',
                            destination: 'For trains heading towards Tavarekere / Nagawara',
                            badgeClass: 'bg-pink-500 text-white'
                        },
                        {
                            number: '4',
                            direction: 'Southbound',
                            destination: 'For trains heading towards JP Nagar 4th Phase / Kalena Agrahara',
                            badgeClass: 'bg-pink-500 text-white'
                        }
                    ]
                },
                {
                    levelName: 'Yellow Line (Level 5)',
                    lineName: 'Yellow Line',
                    color: '#EAB308',
                    corridor: 'East-West along Outer Ring Road & Hosur Road',
                    platforms: [
                        {
                            number: '1',
                            direction: 'Westbound',
                            destination: 'For trains heading towards RV Road',
                            badgeClass: 'bg-yellow-500 text-black'
                        },
                        {
                            number: '2',
                            direction: 'Eastbound',
                            destination: 'For trains heading towards Bommasandra / Electronic City',
                            badgeClass: 'bg-yellow-500 text-black'
                        }
                    ]
                }
            ]
        };
    }

    // Tavarekere (Pink Line Elevated Terminus)
    if (name === 'Tavarekere' || id === 'PK06') {
        return {
            isMultiLevel: false,
            title: 'Tavarekere Station Platform Layout',
            subtitle: 'Pink Line Elevated Terminus',
            platforms: [
                {
                    number: '1',
                    direction: 'Northbound',
                    destination: 'For trains heading toward Nagawara',
                    badgeClass: 'bg-pink-500 text-white'
                },
                {
                    number: '2',
                    direction: 'Southbound',
                    destination: 'For trains heading toward Kalena Agrahara (via Jayadeva Hospital)',
                    badgeClass: 'bg-pink-500 text-white'
                }
            ]
        };
    }

    // Majestic (Nadaprabhu Kempegowda Stn. Majestic)
    if (name.includes('Majestic') || name.includes('Kempegowda') || id === 'P16' || id === 'G12') {
        return {
            isMultiLevel: true,
            title: 'Platform Layout',
            subtitle: 'Majestic Underground Interchange',
            levels: [
                {
                    levelName: 'Purple Line (Underground Level 2)',
                    lineName: 'Purple Line',
                    color: '#A855F7',
                    corridor: 'East-West Corridor',
                    platforms: [
                        { number: '1', direction: 'Eastbound', destination: 'For trains heading towards Whitefield (Kadugodi)', badgeClass: 'bg-purple-500 text-white' },
                        { number: '2', direction: 'Westbound', destination: 'For trains heading towards Challaghatta', badgeClass: 'bg-purple-500 text-white' }
                    ]
                },
                {
                    levelName: 'Green Line (Underground Level 1)',
                    lineName: 'Green Line',
                    color: '#10B981',
                    corridor: 'North-South Corridor',
                    platforms: [
                        { number: '1', direction: 'Northbound', destination: 'For trains heading towards Madavara (BIEC)', badgeClass: 'bg-emerald-500 text-white' },
                        { number: '2', direction: 'Southbound', destination: 'For trains heading towards Silk Institute', badgeClass: 'bg-emerald-500 text-white' }
                    ]
                }
            ]
        };
    }

    // Standard 2-Platform Stations
    const lineKey = (station.line || '').toLowerCase();
    let termA = 'Terminal A', termB = 'Terminal B';
    if (lineKey.includes('pink')) { termA = 'Kalena Agrahara'; termB = 'Tavarekere / Nagawara'; }
    else if (lineKey.includes('yellow')) { termA = 'RV Road'; termB = 'Bommasandra / Electronic City'; }
    else if (lineKey.includes('green')) { termA = 'Silk Institute'; termB = 'Madavara'; }
    else { termA = 'Challaghatta'; termB = 'Whitefield (Kadugodi)'; }

    return {
        isMultiLevel: false,
        title: 'Platform Layout',
        subtitle: \`\${station.line || 'Metro'} Platform Guide\`,
        platforms: [
            {
                number: '1',
                direction: 'Platform 1',
                destination: \`For trains heading towards \${termB}\`,
                badgeClass: 'bg-emerald-500 text-white'
            },
            {
                number: '2',
                direction: 'Platform 2',
                destination: \`For trains heading towards \${termA}\`,
                badgeClass: 'bg-emerald-500 text-white'
            }
        ]
    };
}
`;

sectionsFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');

        // 1. Add getStationPlatformLayout if not already present
        if (!content.includes('function getStationPlatformLayout(')) {
            content = platformLayoutFunction + '\n' + content;
        }

        // 2. Inject platform layout block right before Station Exit Gates in renderStationDetail
        const targetGateHeader = '// Station Exit Gates & Street Directory';
        const platformRenderBlock = `// Station Platform Layout
    const platformLayout = getStationPlatformLayout(station);
    if (platformLayout) {
        if (platformLayout.isMultiLevel) {
            html += \`<div class="detail-section">
                <h4 class="detail-section-title"><i data-lucide="layers" class="w-4 h-4 text-primary"></i> \${platformLayout.title}</h4>
                <p class="detail-section-sub">\${platformLayout.subtitle}</p>
                <div class="space-y-3 pt-1">
                    \${platformLayout.levels.map(lvl => \`
                        <div class="p-3 rounded-2xl bg-card-subtle border border-subtle" style="border-left: 3px solid \${lvl.color};">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style="color: \${lvl.color};">
                                    <span class="w-2 h-2 rounded-full" style="background:\${lvl.color}"></span> \${lvl.levelName}
                                </span>
                                <span class="text-[10px] font-bold text-secondary">\${lvl.corridor}</span>
                            </div>
                            <div class="space-y-2">
                                \${lvl.platforms.map(p => \`
                                    <div class="p-2 bg-card rounded-xl border border-subtle flex items-start gap-2.5">
                                        <span class="platform-pill text-[10px] py-0.5 px-2 font-black shrink-0 \${p.badgeClass}">P\${p.number}</span>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs font-black text-primary">\${p.direction}</div>
                                            <p class="text-[11px] text-secondary mt-0.5">\${p.destination}</p>
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \`).join('')}
                </div>
            </div>\`;
        } else {
            html += \`<div class="detail-section">
                <h4 class="detail-section-title"><i data-lucide="train" class="w-4 h-4 text-primary"></i> \${platformLayout.title}</h4>
                <p class="detail-section-sub">\${platformLayout.subtitle}</p>
                <div class="space-y-2 pt-1">
                    \${platformLayout.platforms.map(p => \`
                        <div class="p-2.5 bg-card-subtle rounded-xl border border-subtle flex items-start gap-2.5">
                            <span class="platform-pill text-[10px] py-1 px-2 font-black shrink-0 \${p.badgeClass}">Platform \${p.number}</span>
                            <div class="flex-1 min-w-0">
                                <div class="text-xs font-black text-primary">\${p.direction}</div>
                                <p class="text-[11px] text-secondary mt-0.5">\${p.destination}</p>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            </div>\`;
        }
    }

    // Station Exit Gates & Street Directory`;

        if (content.includes(targetGateHeader) && !content.includes('const platformLayout = getStationPlatformLayout(station);')) {
            content = content.replace(targetGateHeader, platformRenderBlock);
            fs.writeFileSync(f, content, 'utf8');
            console.log(`Injected platform layout UI in ${f}`);
        }
    }
});

// 3. Update PinkLinePage.jsx
const pinkLinePage = path.join(ROOT_DIR, 'website/src/pages/PinkLinePage.jsx');
if (fs.existsSync(pinkLinePage)) {
    let content = fs.readFileSync(pinkLinePage, 'utf8');

    // Update PK05 platforms
    content = content.replace(
        /platforms:\s*"Level 2 \(Pink Line\): Plat 1 & 2 • Level 1 \(Yellow Line Y03\): Plat 3 & 4"/,
        `platforms: "Pink Line (Level 6): Platform 3 (Northbound to Tavarekere / Nagawara), Platform 4 (Southbound to JP Nagar 4th Phase / Kalena Agrahara) • Yellow Line (Level 5): Platform 1 (Westbound to RV Road), Platform 2 (Eastbound to Bommasandra / Electronic City)"`
    );

    // Update PK06 platforms
    content = content.replace(
        /platforms:\s*"Plat 1: Reversal & Arrival • Plat 2: Towards Kalena Agrahara"/,
        `platforms: "Platform 1 (Northbound): For trains heading toward Nagawara • Platform 2 (Southbound): For trains heading toward Kalena Agrahara (via Jayadeva Hospital)"`
    );

    // Update Spotlight text
    content = content.replace(
        /Bengaluru’s tallest metro station structure connects the <strong>Pink Line \(Level 2\)<\/strong> with the <strong>Yellow Line \(Level 1\)<\/strong>\./,
        `Bengaluru’s tallest metro station structure connects the <strong>Pink Line (Level 6)</strong> with the <strong>Yellow Line (Level 5)</strong>. <strong>Pink Line (Level 6):</strong> Platform 3 for Tavarekere / Nagawara (Northbound) and Platform 4 for JP Nagar 4th Phase / Kalena Agrahara (Southbound). <strong>Yellow Line (Level 5):</strong> Platform 1 for RV Road (Westbound) and Platform 2 for Bommasandra / Electronic City (Eastbound).`
    );

    // Update FAQ text
    content = content.replace(
        /Level 1 accommodates the Yellow Line \(RV Road to Bommasandra \/ Electronic City\), while Level 2 hosts the Pink Line \(Kalena Agrahara to Tavarekere\)\./,
        `Level 5 accommodates the Yellow Line (Platform 1 for RV Road Westbound, Platform 2 for Bommasandra / Electronic City Eastbound), while Level 6 hosts the Pink Line (Platform 3 for Tavarekere / Nagawara Northbound, Platform 4 for JP Nagar 4th Phase / Kalena Agrahara Southbound).`
    );

    fs.writeFileSync(pinkLinePage, content, 'utf8');
    console.log('Updated PinkLinePage.jsx');
}

// 4. Update BengaluruMetroGuide.jsx
const guidePage = path.join(ROOT_DIR, 'website/src/components/BengaluruMetroGuide.jsx');
if (fs.existsSync(guidePage)) {
    let content = fs.readFileSync(guidePage, 'utf8');
    content = content.replace(
        /Level 1 accommodates the Yellow Line \(RV Road to Bommasandra\), while Level 2 hosts the Pink Line \(Kalena Agrahara to Tavarekere\)\./,
        `Level 5 accommodates the Yellow Line with Platform 1 (Westbound to RV Road) and Platform 2 (Eastbound to Bommasandra / Electronic City), while Level 6 hosts the Pink Line with Platform 3 (Northbound to Tavarekere / Nagawara) and Platform 4 (Southbound to JP Nagar 4th Phase / Kalena Agrahara). Tavarekere station features Platform 1 (Northbound to Nagawara) and Platform 2 (Southbound to Kalena Agrahara via Jayadeva).`
    );
    fs.writeFileSync(guidePage, content, 'utf8');
    console.log('Updated BengaluruMetroGuide.jsx');
}

// 5. Update BlogPage.jsx
const blogPage = path.join(ROOT_DIR, 'website/src/pages/BlogPage.jsx');
if (fs.existsSync(blogPage)) {
    let content = fs.readFileSync(blogPage, 'utf8');
    content = content.replace(
        /The station features a multi-tiered layout where the Yellow Line \(RV Road to Bommasandra\) operates on Level 1 and the Pink Line \(Kalena Agrahara to Tavarekere\) runs on Level 2\./,
        `The station features an iconic multi-tiered layout where the Yellow Line operates on Level 5 with Platform 1 (Westbound to RV Road) and Platform 2 (Eastbound to Bommasandra / Electronic City), while the Pink Line operates on Level 6 with Platform 3 (Northbound to Tavarekere / Nagawara) and Platform 4 (Southbound to JP Nagar 4th Phase / Kalena Agrahara). Tavarekere station operates Platform 1 (Northbound towards Nagawara) and Platform 2 (Southbound towards Kalena Agrahara via Jayadeva Hospital).`
    );
    fs.writeFileSync(blogPage, content, 'utf8');
    console.log('Updated BlogPage.jsx');
}

// 6. Update llms.txt and llms-full.txt
const llmsFiles = [
    path.join(ROOT_DIR, 'website/public/llms.txt'),
    path.join(ROOT_DIR, 'website/public/llms-full.txt')
];

llmsFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(
            /Level 1 accommodates the Yellow Line \(RV Road to Bommasandra \/ Electronic City\), while Level 2 hosts the Pink Line \(Kalena Agrahara to Tavarekere\)\./,
            `Yellow Line operates on Level 5: Platform 1 (Westbound to RV Road) and Platform 2 (Eastbound to Bommasandra / Electronic City). Pink Line operates on Level 6: Platform 3 (Northbound to Tavarekere / Nagawara) and Platform 4 (Southbound to JP Nagar 4th Phase / Kalena Agrahara). Tavarekere station features Platform 1 (Northbound to Nagawara) and Platform 2 (Southbound to Kalena Agrahara via Jayadeva).`
        );
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated ${f}`);
    }
});

console.log('Platform layout patching script finished successfully.');
