/**
 * Smart station search with abbreviation matching, comprehensive alias mapping,
 * phonetic/transliteration normalization, Damerau-Levenshtein distance, and relevance scoring.
 */

// Common Bengaluru transit abbreviations and shorthand contractions
export const ABBREVIATIONS = {
    'clg': 'college',
    'rd': 'road',
    'stn': 'station',
    'hosp': 'hospital',
    'med': 'medical',
    'univ': 'university',
    'apt': 'apartment',
    'inst': 'institute',
    'dept': 'department',
    'cent': 'central',
    'pk': 'park',
    'ind': 'industry',
    'indl': 'industrial',
    'ngr': 'nagar',
    'halli': 'halli',
    'palya': 'palya',
    'pura': 'pura',
    'gudi': 'gudi',
    'kr': 'krishna rajendra',
    'mg': 'mahatma gandhi',
    'rr': 'rajarajeshwari',
    'jp': 'jayaprakash',
    'rv': 'rashtreeya vidyalaya',
    'blr': 'bangalore',
    'sbc': 'majestic',
    'bglr': 'bangalore'
};

// Common Bengaluru Metro station aliases, shortcuts, colloquial landmarks, and typo mappings
export const STATION_ALIASES = {
    'majestic': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'magestic', 'megestic', 'majestik', 'mejestic', 'majstic', 'majesitc', 'majastic', 'majistic', 'magistic', 'mejestik', 'kempegowda', 'kempegoda', 'kempgowda', 'kgwa', 'kbs', 'sbc', 'city railway station', 'sangam', 'city station', 'central station'],
    'kempegowda': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'kempegowda', 'kempegoda', 'kempgowda', 'kempe gowda', 'kgwa'],
    'whitefield': ['whitefield (kadugodi)', 'whitefield', 'whitefeild', 'whitfield', 'whitefeld', 'kadugodi', 'wfd', 'hopefarm', 'itpl', 'white field'],
    'kadugodi': ['whitefield (kadugodi)', 'whitefield', 'kadugodi', 'kadugodu', 'wfd'],
    'challaghatta': ['challaghatta', 'chalagatta', 'calaghatta', 'challagatta', 'chalaghatta', 'challaghata', 'challghatta', 'rajarajeshwari medical college'],
    'indiranagar': ['indiranagar', 'indira nagar', 'indranagar', 'indiranagr', 'indranagr', 'indirnagar', 'cmh road', '100ft road', 'inr'],
    'mg road': ['mahatma gandhi road', 'mg road', 'm g road', 'mg', 'mgr', 'brigade road', 'church street', 'magr', 'em gee road'],
    'vidhana soudha': ['dr. b.r. ambedkar stn., vidhana soudha', 'vidhana soudha', 'vidhan soudha', 'vidhansoudha', 'vidhan souda', 'vidhana souda', 'ambedkar', 'high court', 'krs', 'vdsa'],
    'central college': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'vishveshwaraiah', 'visveshvaraya', 'visveswaraiah', 'vishweshwaraya', 'cc', 'uvce'],
    'visveswaraya': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'vishveshwaraiah', 'visveshvaraya', 'visveswaraiah', 'vishweshwaraya', 'cc'],
    'vishveshwaraiah': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'vishweshwaraya'],
    'hosahalli': ['sri balagangadharanatha swamiji stn., hosahalli', 'hosahalli', 'hosahali', 'balagangadharanatha', 'swamiji', 'hsh', 'tollgate'],
    'mantri square': ['mantri square sampige road', 'mantri mall', 'sampige road', 'sampige', 'malleshwaram', 'mantri', 'sampigeroad'],
    'rajajinagar': ['rajajinagar', 'isro', 'isro rajajinagar', 'rjr', 'rajaji nagar', 'rajajinagr'],
    'kuvempu road': ['kuvempu road', 'kuvempuroad', 'navrang', 'kuvempu'],
    'yeshwanthpur': ['yeshwanthpur', 'yeshwantpur', 'yeshwanthpura', 'yeshvantpur', 'yeshvanthpur', 'yeshwantpura', 'ypr', 'railway station'],
    'sandal soap factory': ['sandal soap factory', 'soap factory', 'mysore sandal', 'ssf', 'sandal soap'],
    'mahalakshmi': ['mahalakshmi', 'mahalakshmi layout', 'iskcon', 'iskcon temple', 'mahalaxmi'],
    'chickpete': ['chickpete', 'chikpet', 'chikpete', 'chickpet', 'chick pet', 'chickapet', 'market'],
    'kr market': ['krishna rajendra market', 'kr market', 'k.r. market', 'city market', 'krm', 'kr mkt'],
    'national college': ['national college', 'national clg', 'basavanagudi', 'ncl', 'national colg'],
    'lalbagh': ['lalbagh', 'lal bagh', 'lalbag', 'botanical garden', 'lalbaug', 'lal bag'],
    'south end circle': ['south end circle', 'southend', 'south end', 'south circle'],
    'jayanagar': ['jayanagar', 'jaynagar', '4th block', 'jnr', 'jaya nagar', 'jayangr'],
    'rv road': ['rashtreeya vidyalaya road', 'rv road', 'r.v. road', 'r v road', 'rv terminal', 'rvr', 'rv college'],
    'banashankari': ['banashankari', 'banshankari', 'banasankari', 'bsk', 'banashankri', 'banashnkari', 'temple', 'bus stand'],
    'jp nagar': ['jayaprakash nagar', 'jp nagar', 'j.p. nagar', 'j p nagar', 'jpn', 'jp nagr'],
    'yelachenahalli': ['yelachenahalli', 'puttenahalli', 'yelchenahalli', 'yelachenhalli', 'ypr'],
    'konanakunte cross': ['konanakunte cross', 'konanakunte', 'konankunte', 'konnanakunte', 'forum mall south'],
    'silk institute': ['silk institute', 'anjnapura', 'nice road', 'silk inst', 'silkinstitute'],
    'electronic city': ['electronic city', 'e city', 'e-city', 'ecity', 'infosys', 'wipro', 'el city'],
    'silk board': ['central silk board', 'silk board', 'csb', 'silkboard'],
    'kr puram': ['krishnarajapura', 'kr puram', 'k r puram', 'kr pura', 'tin factory', 'krp', 'krpuram'],
    'benniganahalli': ['benniganahalli', 'tin factory', 'pai layout', 'benniganahali'],
    'byappanahalli': ['baiyappanahalli', 'byapanahalli', 'byappanahali', 'bayappanahalli', 'baiyappanahalli railway station', 'bypl'],
    'cubbon park': ['cubbon park', 'cubbon', 'cubon park', 'cubonpark', 'high court', 'chinnaswamy', 'stadium'],
    'halasuru': ['halasuru', 'ulsoor', 'ulsur', 'someshwara temple', 'halasoor'],
    'trinity': ['trinity', 'trinity circle', 'mg road east', 'trinty'],
    'kadugodi tree park': ['kadugodi tree park', 'tree park', 'treepark'],
    'hopefarm channasandra': ['hopefarm channasandra', 'hopefarm', 'hope farm', 'channasandra', 'hfc', 'channasndra'],
    'pattandur agrahara': ['pattanduru agrahara', 'pattandur', 'agrahara', 'itpl back gate', 'pattandur agrahara'],
    'sri sathya sai hospital': ['sri sathya sai hospital', 'satya sai', 'sai hospital', 'sssh', 'sathya sai'],
    'nallurhalli': ['nallur halli', 'nallurhalli', 'nallurhali', 'kundalahalli'],
    'kundalahalli': ['kundalahalli', 'kundalahalli gate', 'kundalahali', 'kundanahalli'],
    'seetharampalya': ['seetharamapalya', 'seetharampalya', 'sitarampalya', 'ge healthcare'],
    'hoodi': ['hoodi', 'hoodi junction', 'hudi'],
    'garudacharapalya': ['garudachar palya', 'garudacharpalya', 'garudacharapalya', 'maheshwari nagar', 'garudcharpalya'],
    'singayyanapalya': ['singayyanapalya', 'mahadevapura', 'singayanapalya', 'mahadevpura'],
    'mysuru road': ['mysuru road', 'mysore road', 'satellite bus stand', 'nayandahalli', 'mysore rd'],
    'pantharapalya': ['pantharapalya-nayandahalli', 'nayandahalli', 'pantharapalya', 'pantarapalya'],
    'rajarajeshwari nagar': ['rajarajeshwari nagar', 'rr nagar', 'r r nagar', 'rajrajeshwari', 'rrnagar'],
    'jnanabharathi': ['jnanabharathi', 'bangalore university', 'bu', 'gnanabharathi', 'jnanabharti'],
    'pattanagere': ['pattanagere', 'global tech park', 'pattnagere', 'pattangere'],
    'kengeri bus terminal': ['kengeri bus terminal', 'kengeri bus stand', 'kengeri ttmc', 'kengeri', 'kangeri'],
    'chikkabidarakallu': ['chikkabidarakallu', 'jindal', 'jindal naturecure', 'chikkabidarkallu', 'chikabidarkallu'],
    'madavara': ['madavara', 'biec', 'bangalore international exhibition centre', 'madhavara'],
    'nagasandra': ['nagasandra', 'ikea', 'ikea nagasandra', 'nagasndra'],
    'dasarahalli': ['dasarahalli', 'peenya dasarahalli', 'dasrahalli', 'dasarahali'],
    'jalahalli': ['jalahalli', 'jalahalli cross', 'jalahali'],
    'peenya': ['peenya', 'peenya industrial area', 'pinya', 'penya'],
    'peenya industry': ['peenya industry', 'peenya 1st stage', 'pinya industry'],
    'goraguntepalya': ['goraguntepalya', 'goragunte palya', 'taj vivanta', 'goraguntpalya', 'goraguntepalya']
};

const NOISE_WORDS = new Set(['metro', 'station', 'stn', 'stop', 'stand', 'terminal', 'ttmc', 'near', 'halt', 'railway', 'train', 'line']);

/**
 * Normalizes input text for resilient matching
 */
export function normalize(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Expands common abbreviations (e.g. 'clg' -> 'college')
 */
export function expandAbbreviations(str) {
    if (!str) return '';
    const words = str.split(/\s+/);
    return words.map(w => ABBREVIATIONS[w] || w).join(' ');
}

/**
 * Normalizes South Indian / Kannada English transliterations and common sounds
 */
export function cleanPhonetic(str) {
    if (!str) return '';
    return normalize(str)
        .replace(/ph/g, 'f')
        .replace(/th/g, 't')
        .replace(/gh/g, 'g')
        .replace(/dh/g, 'd')
        .replace(/bh/g, 'b')
        .replace(/kh/g, 'k')
        .replace(/sh/g, 's')
        .replace(/ch/g, 'c')
        .replace(/w/g, 'v')
        .replace(/ee/g, 'i')
        .replace(/oo/g, 'u')
        .replace(/g(?=[ei])/g, 'j') // e.g. "magestic" -> "majestic"
        .replace(/iah\b/g, 'ya')
        .replace(/ie/g, 'i')   // e.g. "whitefeild"
        .replace(/ei/g, 'i')   // e.g. "feild" -> "fild"
        .replace(/ou/g, 'o')   // e.g. "soudha" -> "soda"
        .replace(/aa/g, 'a')   // double vowels
        .replace(/ii/g, 'i')
        .replace(/uu/g, 'u')
        .replace(/([a-z])\1+/g, '$1'); // drop double consonants (ll->l, tt->t, etc.)
}

/**
 * Calculates Damerau-Levenshtein distance (handles character swaps/transpositions as 1 edit)
 */
export function damerauLevenshtein(a, b) {
    const al = a.length, bl = b.length;
    if (!al) return bl;
    if (!bl) return al;
    const matrix = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0));
    for (let i = 0; i <= al; i++) matrix[i][0] = i;
    for (let j = 0; j <= bl; j++) matrix[0][j] = j;

    for (let i = 1; i <= al; i++) {
        for (let j = 1; j <= bl; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,       // deletion
                matrix[i][j - 1] + 1,       // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1); // transposition
            }
        }
    }
    return matrix[al][bl];
}

/**
 * Computes initials/acronyms of a multi-word string (e.g. "Mahatma Gandhi Road" -> "mgr")
 */
export function getAcronym(str) {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .toLowerCase();
}

/**
 * Calculates a match relevance score from 0 (no match) to 1000 (perfect exact match).
 */
export function scoreStation(stationName, query, translatedName = '', stationCode = '', stationKn = '') {
    const qRaw = (query || '').trim().toLowerCase();
    if (!qRaw) return 1;

    let q = normalize(qRaw);
    if (!q) return 0;
    q = expandAbbreviations(q);

    const sName = normalize(stationName);
    const sTrans = normalize(translatedName);
    const sCode = normalize(stationCode);
    const sKn = (stationKn || '').toLowerCase();

    // 1. Direct Exact matches
    if (sName === q || sTrans === q || sCode === q) return 1000;
    if (sKn && sKn === qRaw) return 1000;

    // 2. Direct startsWith
    if (sName.startsWith(q) || sTrans.startsWith(q) || (sCode && sCode.startsWith(q))) return 850;

    // 3. Substring match
    if (sName.includes(q) || sTrans.includes(q) || (sCode && sCode.includes(q)) || (sKn && sKn.includes(qRaw))) {
        return 750;
    }

    // 4. Space-free match (e.g. "mgroad" -> "mg road", "cubbonpark" -> "cubbon park")
    const qNoSpace = q.replace(/\s+/g, '');
    const sNoSpace = sName.replace(/\s+/g, '');
    const transNoSpace = sTrans.replace(/\s+/g, '');
    if (qNoSpace.length >= 3) {
        if (sNoSpace === qNoSpace || transNoSpace === qNoSpace) return 800;
        if (sNoSpace.includes(qNoSpace) || transNoSpace.includes(qNoSpace)) return 700;
    }

    // 5. Acronym matches (e.g. "mg", "mgr", "krp", "rv")
    const acronym = getAcronym(stationName);
    if (acronym.length >= 2 && (acronym === qNoSpace || (qNoSpace.length <= 4 && acronym.startsWith(qNoSpace)))) {
        return 650;
    }

    // 6. Noise words filtering for multi-word queries (e.g., "majestic metro" -> "majestic")
    const qTokens = q.split(/\s+/).filter(Boolean);
    const usefulTokens = qTokens.filter(t => !NOISE_WORDS.has(t));
    const queryTokens = usefulTokens.length > 0 ? usefulTokens : qTokens;

    // 7. Alias / Nickname matching (bidirectional)
    for (const [aliasKey, aliasTargets] of Object.entries(STATION_ALIASES)) {
        const aKey = normalize(aliasKey);
        const aKeyNoSpace = aKey.replace(/\s+/g, '');
        const targetMatchesStation = aliasTargets.some(t => {
            const nt = normalize(t);
            return sName.includes(nt) || nt.includes(sName);
        });

        if (targetMatchesStation) {
            // Direct alias match
            if (q === aKey || qNoSpace === aKeyNoSpace || queryTokens.includes(aKey)) {
                return 800;
            }
            // Check if any alias target exactly matches query
            if (aliasTargets.some(t => normalize(t) === q || normalize(t).replace(/\s+/g, '') === qNoSpace)) {
                return 800;
            }
            // Fuzzy alias match (e.g. "magestic" -> alias "majestic")
            if (q.length >= 4) {
                const dist = damerauLevenshtein(q, aKey);
                const maxD = aKey.length <= 5 ? 1 : 2;
                if (dist <= maxD) {
                    return 680 - (dist * 40);
                }
            }
        }
    }

    // 8. Phonetic Matching (soundex/transliteration)
    const qPhonetic = cleanPhonetic(q);
    const sPhonetic = cleanPhonetic(sName);
    if (qPhonetic.length >= 3) {
        if (sPhonetic.includes(qPhonetic)) return 620;
        const qPhNoSpace = qPhonetic.replace(/\s+/g, '');
        const sPhNoSpace = sPhonetic.replace(/\s+/g, '');
        if (sPhNoSpace.includes(qPhNoSpace)) return 600;
    }

    // 9. Multi-token matching (all useful query tokens must match some word in station name or alias)
    if (queryTokens.length > 0) {
        const sWords = sName.split(/\s+/);
        let allTokensMatched = true;
        let totalTokenDistance = 0;

        for (const token of queryTokens) {
            let tokenBestDist = Infinity;
            
            // Check direct word match or prefix match
            for (const word of sWords) {
                if (word === token) {
                    tokenBestDist = 0;
                    break;
                }
                if (word.startsWith(token) && token.length >= 3) {
                    tokenBestDist = Math.min(tokenBestDist, 0.5);
                } else if (token.length >= 3 && word.length >= 3) {
                    const d = damerauLevenshtein(token, word);
                    const allowedD = token.length <= 4 ? 1 : (token.length <= 7 ? 2 : 3);
                    if (d <= allowedD) {
                        tokenBestDist = Math.min(tokenBestDist, d);
                    }
                }
            }

            // Also check phonetic token match
            if (tokenBestDist > 1 && token.length >= 3) {
                const tokenPh = cleanPhonetic(token);
                for (const word of sWords) {
                    const wordPh = cleanPhonetic(word);
                    if (wordPh === tokenPh || wordPh.includes(tokenPh)) {
                        tokenBestDist = Math.min(tokenBestDist, 1);
                        break;
                    }
                }
            }

            if (tokenBestDist === Infinity) {
                allTokensMatched = false;
                break;
            } else {
                totalTokenDistance += tokenBestDist;
            }
        }

        if (allTokensMatched) {
            return Math.max(150, 500 - (totalTokenDistance * 60));
        }
    }

    // 10. Full String Fuzzy Damerau-Levenshtein (more forgiving thresholds)
    if (q.length >= 3) {
        const words = sName.split(/\s+/);
        for (const word of words) {
            if (word.length >= 3) {
                const maxAllowed = word.length <= 4 ? 1 : (word.length <= 6 ? 2 : 3);
                const d = damerauLevenshtein(q, word);
                if (d <= maxAllowed) {
                    return 450 - (d * 50);
                }
            }
        }

        if (Math.abs(sName.length - q.length) <= 5) {
            const fullDist = damerauLevenshtein(sName, q);
            if (fullDist <= 4) {
                return 400 - (fullDist * 40);
            }
        }
    }

    // 11. N-gram partial match (catches partial word matches for very misspelled queries)
    if (q.length >= 4) {
        const qGrams = getNGrams(q, 3);
        const sGrams = getNGrams(sName, 3);
        const overlap = qGrams.filter(g => sGrams.includes(g)).length;
        const similarity = overlap / Math.max(qGrams.length, 1);
        if (similarity >= 0.5) {
            return Math.round(120 + (similarity * 200));
        }
        // Also check against alias targets
        for (const [, aliasTargets] of Object.entries(STATION_ALIASES)) {
            for (const alias of aliasTargets) {
                const aGrams = getNGrams(normalize(alias), 3);
                const aOverlap = qGrams.filter(g => aGrams.includes(g)).length;
                const aSim = aOverlap / Math.max(qGrams.length, 1);
                if (aSim >= 0.6) {
                    const targetMatchesStation = aliasTargets.some(t => {
                        const nt = normalize(t);
                        return sName.includes(nt) || nt.includes(sName);
                    });
                    if (targetMatchesStation) {
                        return Math.round(100 + (aSim * 180));
                    }
                }
            }
        }
    }

    return 0;
}

/**
 * Generate character n-grams from a string
 */
function getNGrams(str, n) {
    const grams = [];
    const s = str.replace(/\s+/g, '');
    for (let i = 0; i <= s.length - n; i++) {
        grams.push(s.substring(i, i + n));
    }
    return grams;
}

/**
 * Boolean helper for simple filtering checks
 */
export function matchStation(stationName, query, translatedName = '', stationCode = '', stationKn = '') {
    return scoreStation(stationName, query, translatedName, stationCode, stationKn) > 0;
}

/**
 * Filter and sort stations array by relevance score
 */
export function searchStations(stations, query, getStationProps) {
    if (!query || !query.trim()) {
        return [...stations];
    }
    const scored = [];
    for (const stn of stations) {
        const props = getStationProps ? getStationProps(stn) : {
            name: stn.name || stn.name_en || '',
            translated: stn.translatedName || '',
            code: stn.code || '',
            kn: stn.name_kn || ''
        };
        const score = scoreStation(props.name, query, props.translated, props.code, props.kn);
        if (score > 0) {
            scored.push({ station: stn, score });
        }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.station);
}

// Backwards-compatibility alias
export function levenshteinDistance(a, b) {
    return damerauLevenshtein(a, b);
}
