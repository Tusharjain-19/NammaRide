/**
 * Smart station search with abbreviation matching, comprehensive alias mapping,
 * phonetic/transliteration normalization, Damerau-Levenshtein distance, and relevance scoring.
 */

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
    'indl': 'industrial'
};

export const STATION_ALIASES = {
    'majestic': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'magestic', 'megestic', 'kempegowda', 'kgwa', 'kbs', 'sbc', 'city railway station', 'sangam'],
    'kempegowda': ['nadaprabhu kempegowda stn., majestic', 'majestic', 'kempegowda', 'kgwa'],
    'whitefield': ['whitefield (kadugodi)', 'whitefield', 'whitefeild', 'kadugodi', 'wfd', 'hopefarm', 'itpl'],
    'kadugodi': ['whitefield (kadugodi)', 'whitefield', 'kadugodi', 'wfd'],
    'challaghatta': ['challaghatta', 'chalagatta', 'calaghatta', 'challagatta', 'rajarajeshwari medical college'],
    'indiranagar': ['indiranagar', 'indira nagar', 'indranagar', 'cmh road', '100ft road', 'inr'],
    'mg road': ['mahatma gandhi road', 'mg road', 'm g road', 'mg', 'mgr', 'brigade road', 'church street', 'magr'],
    'vidhana soudha': ['dr. b.r. ambedkar stn., vidhana soudha', 'vidhana soudha', 'vidhan soudha', 'ambedkar', 'high court', 'krs', 'vdsa'],
    'central college': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'vishveshwaraiah', 'visveshvaraya', 'visveswaraiah', 'cc', 'uvce'],
    'visveswaraya': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya', 'vishveshwaraiah', 'visveshvaraya', 'visveswaraiah', 'cc'],
    'vishveshwaraiah': ['sir m. visveswaraya stn., central college', 'central college', 'visveswaraya'],
    'hosahalli': ['sri balagangadharanatha swamiji stn., hosahalli', 'hosahalli', 'balagangadharanatha', 'swamiji', 'hsh', 'tollgate'],
    'mantri square': ['mantri square sampige road', 'mantri mall', 'sampige road', 'sampige', 'malleshwaram'],
    'rajajinagar': ['rajajinagar', 'isro', 'isro rajajinagar', 'rjr'],
    'kuvempu road': ['kuvempu road', 'kuvempuroad', 'navrang'],
    'yeshwanthpur': ['yeshwanthpur', 'yeshwantpur', 'yeshwanthpura', 'yeshvantpur', 'ypr', 'railway station'],
    'sandal soap factory': ['sandal soap factory', 'soap factory', 'mysore sandal', 'ssf'],
    'mahalakshmi': ['mahalakshmi', 'mahalakshmi layout', 'iskcon', 'iskcon temple'],
    'chickpete': ['chickpete', 'chikpet', 'chikpete', 'chickpet', 'market'],
    'kr market': ['krishna rajendra market', 'kr market', 'k.r. market', 'city market', 'krm'],
    'national college': ['national college', 'national clg', 'basavanagudi', 'ncl'],
    'lalbagh': ['lalbagh', 'lal bagh', 'lalbag', 'botanical garden'],
    'south end circle': ['south end circle', 'southend', 'south end'],
    'jayanagar': ['jayanagar', 'jaynagar', '4th block', 'jnr'],
    'rv road': ['rashtreeya vidyalaya road', 'rv road', 'r.v. road', 'r v road', 'rv terminal', 'rvr', 'rv college'],
    'banashankari': ['banashankari', 'banshankari', 'banasankari', 'bsk', 'temple', 'bus stand'],
    'jp nagar': ['jayaprakash nagar', 'jp nagar', 'j.p. nagar', 'j p nagar', 'jpn'],
    'yelachenahalli': ['yelachenahalli', 'puttenahalli', 'ypr'],
    'konanakunte cross': ['konanakunte cross', 'konanakunte', 'forum mall south'],
    'silk institute': ['silk institute', 'anjnapura', 'nice road'],
    'electronic city': ['electronic city', 'e city', 'e-city', 'ecity', 'infosys', 'wipro'],
    'silk board': ['central silk board', 'silk board', 'csb'],
    'kr puram': ['krishnarajapura', 'kr puram', 'k r puram', 'kr pura', 'tin factory', 'krp'],
    'benniganahalli': ['benniganahalli', 'tin factory', 'pai layout'],
    'byappanahalli': ['baiyappanahalli', 'byapanahalli', 'baiyappanahalli railway station', 'bypl'],
    'cubbon park': ['cubbon park', 'cubbon', 'high court', 'chinnaswamy', 'stadium'],
    'halasuru': ['halasuru', 'ulsoor', 'someshwara temple'],
    'trinity': ['trinity', 'trinity circle', 'mg road east'],
    'kadugodi tree park': ['kadugodi tree park', 'tree park'],
    'hopefarm channasandra': ['hopefarm channasandra', 'hopefarm', 'hope farm', 'channasandra', 'hfc'],
    'pattandur agrahara': ['pattanduru agrahara', 'pattandur', 'agrahara', 'itpl back gate'],
    'sri sathya sai hospital': ['sri sathya sai hospital', 'satya sai', 'sai hospital', 'sssh'],
    'nallurhalli': ['nallur halli', 'nallurhalli', 'kundalahalli'],
    'kundalahalli': ['kundalahalli', 'kundalahalli gate'],
    'seetharampalya': ['seetharamapalya', 'seetharampalya', 'ge healthcare'],
    'hoodi': ['hoodi', 'hoodi junction'],
    'garudacharapalya': ['garudachar palya', 'garudacharpalya', 'maheshwari nagar'],
    'singayyanapalya': ['singayyanapalya', 'mahadevapura'],
    'mysuru road': ['mysuru road', 'mysore road', 'satellite bus stand', 'nayandahalli'],
    'pantharapalya': ['pantharapalya-nayandahalli', 'nayandahalli', 'pantharapalya'],
    'rajarajeshwari nagar': ['rajarajeshwari nagar', 'rr nagar', 'r r nagar'],
    'jnanabharathi': ['jnanabharathi', 'bangalore university', 'bu'],
    'pattanagere': ['pattanagere', 'global tech park'],
    'kengeri bus terminal': ['kengeri bus terminal', 'kengeri bus stand', 'kengeri ttmc', 'kengeri'],
    'chikkabidarakallu': ['chikkabidarakallu', 'jindal', 'jindal naturecure'],
    'madavara': ['madavara', 'biec', 'bangalore international exhibition centre'],
    'nagasandra': ['nagasandra', 'ikea', 'ikea nagasandra'],
    'dasarahalli': ['dasarahalli', 'peenya dasarahalli'],
    'jalahalli': ['jalahalli', 'jalahalli cross'],
    'peenya': ['peenya', 'peenya industrial area'],
    'peenya industry': ['peenya industry', 'peenya 1st stage'],
    'goraguntepalya': ['goraguntepalya', 'goragunte palya', 'taj vivanta']
};

const NOISE_WORDS = new Set(['metro', 'station', 'stn', 'stop', 'stand', 'terminal', 'ttmc', 'near', 'halt', 'railway', 'train', 'line']);

export function normalize(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function expandAbbreviations(str) {
    if (!str) return '';
    const words = str.split(/\s+/);
    return words.map(w => ABBREVIATIONS[w] || w).join(' ');
}

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
        .replace(/g(?=[ei])/g, 'j')
        .replace(/iah\b/g, 'ya')
        .replace(/([a-z])\1+/g, '$1');
}

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
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
            }
        }
    }
    return matrix[al][bl];
}

export function getAcronym(str) {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .toLowerCase();
}

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

    // 4. Space-free match
    const qNoSpace = q.replace(/\s+/g, '');
    const sNoSpace = sName.replace(/\s+/g, '');
    const transNoSpace = sTrans.replace(/\s+/g, '');
    if (qNoSpace.length >= 3) {
        if (sNoSpace === qNoSpace || transNoSpace === qNoSpace) return 800;
        if (sNoSpace.includes(qNoSpace) || transNoSpace.includes(qNoSpace)) return 700;
    }

    // 5. Acronym matches
    const acronym = getAcronym(stationName);
    if (acronym.length >= 2 && (acronym === qNoSpace || (qNoSpace.length <= 4 && acronym.startsWith(qNoSpace)))) {
        return 650;
    }

    // 6. Noise words filtering
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
            if (q === aKey || qNoSpace === aKeyNoSpace || queryTokens.includes(aKey)) {
                return 800;
            }
            if (aliasTargets.some(t => normalize(t) === q || normalize(t).replace(/\s+/g, '') === qNoSpace)) {
                return 800;
            }
            if (q.length >= 4) {
                const dist = damerauLevenshtein(q, aKey);
                const maxD = aKey.length <= 5 ? 1 : 2;
                if (dist <= maxD) {
                    return 680 - (dist * 40);
                }
            }
        }
    }

    // 8. Phonetic Matching
    const qPhonetic = cleanPhonetic(q);
    const sPhonetic = cleanPhonetic(sName);
    if (qPhonetic.length >= 3) {
        if (sPhonetic.includes(qPhonetic)) return 620;
        const qPhNoSpace = qPhonetic.replace(/\s+/g, '');
        const sPhNoSpace = sPhonetic.replace(/\s+/g, '');
        if (sPhNoSpace.includes(qPhNoSpace)) return 600;
    }

    // 9. Multi-token matching
    if (queryTokens.length > 0) {
        const sWords = sName.split(/\s+/);
        let allTokensMatched = true;
        let totalTokenDistance = 0;

        for (const token of queryTokens) {
            let tokenBestDist = Infinity;
            
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

    // 10. Full String Fuzzy Damerau-Levenshtein
    if (q.length >= 3) {
        const words = sName.split(/\s+/);
        for (const word of words) {
            if (word.length >= 3) {
                const maxAllowed = word.length <= 4 ? 1 : (word.length <= 7 ? 2 : 3);
                const d = damerauLevenshtein(q, word);
                if (d <= maxAllowed) {
                    return 450 - (d * 50);
                }
            }
        }

        if (Math.abs(sName.length - q.length) <= 4) {
            const fullDist = damerauLevenshtein(sName, q);
            if (fullDist <= 3) {
                return 400 - (fullDist * 50);
            }
        }
    }

    return 0;
}

export function matchStation(stationName, query, translatedName = '', stationCode = '', stationKn = '') {
    return scoreStation(stationName, query, translatedName, stationCode, stationKn) > 0;
}
