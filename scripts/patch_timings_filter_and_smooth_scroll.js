const fs = require('fs');
const path = require('path');

console.log('--- Applying Precise Timings Line Filter & Explore Smooth Scroll Patches ---');

const filesToUpdate = [
    path.join(__dirname, '../website/public/simulator/js/ui/sections.js'),
    path.join(__dirname, '../website/js/ui/sections.js')
];

// Helper to normalize line endings
function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = normalize(fs.readFileSync(filePath, 'utf8'));

    // 1. Add makeSmoothScrollable helper at the top if not present
    if (!code.includes('function makeSmoothScrollable(')) {
        const smoothHelper = `// Smooth Momentum & Drag Horizontal Scroll Helper
function makeSmoothScrollable(el) {
    if (!el || el._smoothScrollEnabled) return;
    el._smoothScrollEnabled = true;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDown = true;
        hasMoved = false;
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    const finishDrag = () => {
        if (!isDown) return;
        isDown = false;
        setTimeout(() => { hasMoved = false; }, 50);
    };

    el.addEventListener('mouseleave', finishDrag);
    el.addEventListener('mouseup', finishDrag);

    el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.6;
        if (Math.abs(walk) > 4) {
            hasMoved = true;
            e.preventDefault();
            el.scrollLeft = scrollLeft - walk;
        }
    });

    // Support horizontal wheel event
    el.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}

`;
        code = smoothHelper + code;
    }

    // 2. Add line filter bar to renderTimings
    const oldHeader = `        let html = \`<div class="section-header">
            <h2 class="section-title">\${T_fn('timings') || 'Timings'}</h2>
            <p class="section-subtitle">Official BMRCL Schedule • 2025-26</p>
        </div>`;

    const newHeader = `        const activeTimingLine = container._activeTimingLine || 'all';

        let html = \`<div class="section-header">
            <h2 class="section-title">\${T_fn('timings') || 'Timings'}</h2>
            <p class="section-subtitle">Official BMRCL Schedule • 2025-26</p>
            <div class="flex gap-2.5 mt-3 mb-2 overflow-x-auto py-1 px-1 smooth-pill-scroll" id="timing-line-filters">
                <button class="timing-line-btn \${activeTimingLine === 'all' ? 'active' : ''}" data-line="all">\${T_fn('lineAll') || 'All Lines'}</button>
                <button class="timing-line-btn \${activeTimingLine === 'pink' ? 'active' : ''}" data-line="pink">\${T_fn('linePink') || 'Pink Line'}</button>
                <button class="timing-line-btn \${activeTimingLine === 'purple' ? 'active' : ''}" data-line="purple">\${T_fn('linePurple') || 'Purple Line'}</button>
                <button class="timing-line-btn \${activeTimingLine === 'green' ? 'active' : ''}" data-line="green">\${T_fn('lineGreen') || 'Green Line'}</button>
                <button class="timing-line-btn \${activeTimingLine === 'yellow' ? 'active' : ''}" data-line="yellow">\${T_fn('lineYellow') || 'Yellow Line'}</button>
            </div>
        </div>`;

    if (code.includes(oldHeader)) {
        code = code.replace(oldHeader, newHeader);
        console.log('Successfully replaced timings header in', filePath);
    } else {
        console.log('Warning: oldHeader not found in', filePath);
    }

    // 3. Add data-timing-line to timing-card
    code = code.replace('<div class="timing-card" style="border-left: 3px solid ${line.color || \'#10B981\'}">', '<div class="timing-card" data-timing-line="${key}" style="border-left: 3px solid ${line.color || \'#10B981\'}">');

    // 4. Update attachTimingsEvents
    const oldAttachTimings = `function attachTimingsEvents(container) {
    if (!container) return;
    container.querySelectorAll('.timing-tab-btn').forEach(btn => {`;

    const newAttachTimings = `function attachTimingsEvents(container) {
    if (!container) return;

    // Line Filter Handling
    const timingFilterBar = container.querySelector('#timing-line-filters');
    if (timingFilterBar) {
        makeSmoothScrollable(timingFilterBar);
        const filterBtns = timingFilterBar.querySelectorAll('.timing-line-btn');
        const cards = container.querySelectorAll('.timing-card');

        function applyTimingFilter(targetLine) {
            container._activeTimingLine = targetLine;
            filterBtns.forEach(b => {
                if (b.dataset.line === targetLine) b.classList.add('active');
                else b.classList.remove('active');
            });
            cards.forEach(card => {
                if (targetLine === 'all' || card.dataset.timingLine === targetLine) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const line = btn.dataset.line;
                applyTimingFilter(line);
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
        });

        if (container._activeTimingLine) {
            applyTimingFilter(container._activeTimingLine);
        }
    }

    // Enable smooth scrolling on tab strips
    container.querySelectorAll('.timing-tabs').forEach(tabStrip => {
        makeSmoothScrollable(tabStrip);
    });

    container.querySelectorAll('.timing-tab-btn').forEach(btn => {`;

    if (code.includes(oldAttachTimings)) {
        code = code.replace(oldAttachTimings, newAttachTimings);
        console.log('Successfully updated attachTimingsEvents in', filePath);
    } else {
        console.log('Warning: oldAttachTimings not found in', filePath);
    }

    // 5. Update Explore container classes
    code = code.replace('class="flex gap-2.5 mt-4 overflow-x-auto py-1 px-1 custom-scrollbar" id="explore-category-filters"', 'class="flex gap-2.5 mt-4 overflow-x-auto py-1 px-1 smooth-pill-scroll" id="explore-category-filters"');
    code = code.replace('class="flex gap-2.5 mt-3 mb-2 overflow-x-auto py-1 px-1 custom-scrollbar" id="explore-line-filters"', 'class="flex gap-2.5 mt-3 mb-2 overflow-x-auto py-1 px-1 smooth-pill-scroll" id="explore-line-filters"');
    code = code.replace('class="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar" id="line-filters"', 'class="flex gap-2 mt-3 overflow-x-auto pb-1 smooth-pill-scroll" id="line-filters"');

    // 6. Update attachExploreEvents
    const oldExploreEvents = `    if (searchInput) searchInput.addEventListener('input', filterExplore);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');
            currentCategory = clickedBtn.dataset.cat;
            filterExplore();
        });
    });

    lineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lineBtns.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');
            currentLine = clickedBtn.dataset.line;
            filterExplore();
        });
    });`;

    const newExploreEvents = `    if (searchInput) searchInput.addEventListener('input', filterExplore);

    const catFilters = container.querySelector('#explore-category-filters');
    const lineFilters = container.querySelector('#explore-line-filters');
    if (catFilters) makeSmoothScrollable(catFilters);
    if (lineFilters) makeSmoothScrollable(lineFilters);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');
            currentCategory = clickedBtn.dataset.cat;
            filterExplore();
            clickedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    lineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lineBtns.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');
            currentLine = clickedBtn.dataset.line;
            filterExplore();
            clickedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });`;

    if (code.includes(oldExploreEvents)) {
        code = code.replace(oldExploreEvents, newExploreEvents);
        console.log('Successfully updated attachExploreEvents in', filePath);
    } else {
        console.log('Warning: oldExploreEvents not found in', filePath);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Saved', filePath);
});

console.log('--- Finished Precise Patch ---');
