/**
 * Smart station search with abbreviation matching, alias mapping,
 * and fuzzy Levenshtein distance matching.
 */

// Common Bengaluru Metro station aliases, shortcuts, and typo mappings
export const STATION_ALIASES = {
    'mg road': ['mahatma gandhi road', 'mg road', 'm g road', 'magr'],
    'mg': ['mahatma gandhi road', 'mg road', 'm g road'],
    'kr puram': ['krishnarajapura', 'kr puram', 'k r puram', 'kr pura', 'krp'],
    'kr pura': ['krishnarajapura', 'kr puram', 'k r puram', 'kr pura', 'krp'],
    'majestic': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'kempegowda', 'kgwa'],
    'kempegowda': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'kempegowda'],
    'ksr': ['ksr city railway station', 'ksr', 'sbc', 'city railway station'],
    'city railway station': ['ksr city railway station', 'ksr', 'sbc', 'city railway station'],
    'rv road': ['rashtreeya vidyalaya road', 'rv road', 'r.v. road', 'r v road'],
    'r.v. road': ['rashtreeya vidyalaya road', 'rv road', 'r.v. road', 'r v road'],
    'vidhana soudha': ['dr. b.r. ambedkar stn., vidhana soudha', 'vidhana soudha', 'ambedkar stn', 'vdsa'],
    'central college': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'cc'],
    'visveswaraya': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'cc'],
    'hosahalli': ['sri balagangadharanatha swamiji stn., hosahalli', 'hosahalli', 'hsh'],
    'isro': ['isro rajajinagar', 'rajajinagar'],
    'mantri square': ['mantri square sampige road', 'mantri mall', 'sampige road'],
    'sampige road': ['mantri square sampige road', 'mantri mall', 'sampige road'],
    'ecity': ['electronic city', 'e city', 'e-city'],
    'e city': ['electronic city', 'e city', 'e-city'],
    'silk board': ['central silk board', 'silk board'],
    'whitefield': ['whitefield (kadugodi)', 'whitefield', 'kadugodi', 'wfd'],
    'kadugodi': ['whitefield (kadugodi)', 'whitefield', 'kadugodi', 'wfd'],
    'hope farm': ['hopefarm channasandra', 'hope farm', 'channasandra', 'hfc'],
    'hopefarm': ['hopefarm channasandra', 'hope farm', 'channasandra', 'hfc']
};

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,       // deletion
                matrix[i][j - 1] + 1,       // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return matrix[a.length][b.length];
}

/**
 * Computes initials/acronyms of a multi-word string (e.g. "Mahatma Gandhi Road" -> "mgr")
 */
function getAcronym(str) {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .toLowerCase();
}

/**
 * Normalizes input text for resilient matching
 */
function normalize(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Smart matching algorithm: checks exact substring, alias mapping, acronyms, and fuzzy distance.
 */
export function matchStation(stationName, query, translatedName = '', stationCode = '', stationKn = '') {
    const qRaw = query.trim().toLowerCase();
    if (!qRaw) return true;

    const q = normalize(qRaw);
    const sName = normalize(stationName);
    const sTrans = normalize(translatedName);
    const sCode = normalize(stationCode);

    // 1. Direct substring match on station name, translated name, or code
    if (sName.includes(q) || sTrans.includes(q) || sCode.includes(q) || (stationKn && stationKn.toLowerCase().includes(qRaw))) {
        return true;
    }

    // 2. Acronym match (e.g., "mg" or "mgr" matches "Mahatma Gandhi Road", "krp" matches "KR Pura")
    const acronym = getAcronym(stationName);
    if (acronym.length >= 2 && (acronym === q || (q.length <= 4 && acronym.startsWith(q)))) {
        return true;
    }

    // 3. Alias / Synonym lookup
    for (const [aliasKey, aliasTargets] of Object.entries(STATION_ALIASES)) {
        if (aliasKey === q || (q.length >= 2 && (q.startsWith(aliasKey) || aliasKey.startsWith(q)))) {
            if (aliasTargets.some(target => sName.includes(target) || target.includes(sName))) {
                return true;
            }
        }
    }

    // 4. Fuzzy Levenshtein Distance for typos (for query >= 3 chars)
    if (q.length >= 3) {
        // Compare query against words in station name
        const words = sName.split(' ');
        for (const word of words) {
            if (word.length >= 3) {
                const maxDist = word.length <= 4 ? 1 : 2;
                if (levenshteinDistance(word, q) <= maxDist) {
                    return true;
                }
            }
        }

        // Compare query against full station name if query is long enough
        if (q.length >= 5 && Math.abs(sName.length - q.length) <= 4) {
            if (levenshteinDistance(sName, q) <= 3) {
                return true;
            }
        }
    }

    return false;
}
