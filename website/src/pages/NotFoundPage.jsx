import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Navigation,
  Map,
  Search,
  ArrowRight,
  RotateCcw,
  Train,
  Clock,
  Calculator,
  ShieldCheck,
  Download,
  MapPin,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { stationsData } from '../data/stationsData';

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.title = "404 - Out of Track | NammaRide Bengaluru Metro";
  }, []);

  // Filter stations or site sections based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    
    // Key site pages
    const sitePages = [
      { name: 'Route Planner / Home', url: '/', category: 'Page' },
      { name: 'Interactive Metro Map', url: '/map', category: 'Page' },
      { name: 'Fare Calculator', url: '/fare-calculator', category: 'Page' },
      { name: 'Train Timings & Frequency', url: '/timings', category: 'Page' },
      { name: 'Stations Directory', url: '/stations', category: 'Page' },
      { name: 'Explore Bengaluru City', url: '/explore', category: 'Page' },
      { name: 'Web App Simulator', url: '/simulator', category: 'Page' },
      { name: 'Safety & Helpline Contacts', url: '/safety', category: 'Page' },
      { name: 'Download Android App', url: '/download', category: 'Page' }
    ];

    const matchedPages = sitePages.filter(p => p.name.toLowerCase().includes(q));

    const matchedStations = stationsData
      .filter(s => 
        (s.name_en && s.name_en.toLowerCase().includes(q)) || 
        (s.name_kn && s.name_kn.includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map(s => ({
        name: s.name_en,
        subtitle: s.name_kn,
        url: `/stations?query=${encodeURIComponent(s.name_en)}`,
        category: `Station (${s.lines ? s.lines.join(', ') : 'Metro'})`
      }));

    setSearchResults([...matchedPages, ...matchedStations]);
  }, [searchQuery]);

  const content = {
    en: {
      badge: 'Error 404 • Signal Lost',
      title: 'Out of Track!',
      subtitle: 'The station or route you are looking for has departed or does not exist.',
      desc: 'Double check your URL address, search for a station below, or hop back on the main line to navigate Bengaluru Metro.',
      searchPlaceholder: 'Search metro stations, routes, or pages (e.g. Majestic, Indiranagar, Fares)...',
      homeBtn: 'Back to Route Planner',
      mapBtn: 'View Metro Map',
      exploreBtn: 'Explore Bengaluru',
      fareBtn: 'Fare Calculator',
      timingsBtn: 'Train Timings',
      stationsBtn: 'Station Directory',
      downloadBtn: 'Get Android App',
      popularTitle: 'Popular Metro Destinations',
      tagline: 'NammaRide • Bengaluru Smart Transit Companion'
    },
    hi: {
      badge: 'त्रुटि 404 • सिग्नल बंद',
      title: 'गलत रूट पर आ गए!',
      subtitle: 'जिस स्टेशन या पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है या छूट चुका है।',
      desc: 'यूआरएल की जांच करें, नीचे स्टेशन खोजें या बेंगलुरु मेट्रो नेविगेट करने के लिए मुख्य लाइन पर वापस लौटें।',
      searchPlaceholder: 'मेट्रो स्टेशन, रूट या पेज खोजें (जैसे मजेस्टिक, इंदिरा नगर, किराया)...',
      homeBtn: 'रूट प्लानर पर लौटें',
      mapBtn: 'मेट्रो मैप देखें',
      exploreBtn: 'बेंगलुरु एक्सप्लोर करें',
      fareBtn: 'किराया कैलकुलेटर',
      timingsBtn: 'ट्रेन का समय',
      stationsBtn: 'स्टेशन सूची',
      downloadBtn: 'एंड्रॉयड ऐप डाउनलोड करें',
      popularTitle: 'लोकप्रिय मेट्रो स्टेशन',
      tagline: 'नम्मा राइड • बेंगलुरु स्मार्ट ट्रांजिट'
    },
    kn: {
      badge: 'ದೋಷ 404 • ಸಿಗ್ನಲ್ ವ್ಯತ್ಯಯ',
      title: 'ತಪ್ಪು ಮಾರ್ಗ ತಲುಪಿದ್ದೀರಿ!',
      subtitle: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ನಿಲ್ದಾಣ ಅಥವಾ ಪುಟ ಲಭ್ಯವಿಲ್ಲ.',
      desc: 'ದಯವಿಟ್ಟು ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ, ಕೆಳಗೆ ನಿಲ್ದಾಣವನ್ನು ಹುಡುಕಿ ಅಥವಾ ನಮ್ಮ ಮೆಟ್ರೋ ಪ್ರಯಾಣವನ್ನು ಮುಂದುವರಿಸಲು ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
      searchPlaceholder: 'ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಅಥವಾ ಪುಟಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: ಮೆಜೆಸ್ಟಿಕ್, ಇಂದಿರಾನಗರ)...',
      homeBtn: 'ಮಾರ್ಗ ಯೋಜನೆಗೆ ಹಿಂತಿರುಗಿ',
      mapBtn: 'ಮೆಟ್ರೋ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ',
      exploreBtn: 'ಬೆಂಗಳೂರು ಅನ್ವೇಷಿಸಿ',
      fareBtn: 'ಪ್ರಯಾಣ ದರ ಲೆಕ್ಕಾಚಾರ',
      timingsBtn: 'ರೈಲು ಸಮಯ',
      stationsBtn: 'ನಿಲ್ದಾಣಗಳ ಪಟ್ಟಿ',
      downloadBtn: 'ಆಪ್ ಪಡೆಯಿರಿ',
      popularTitle: 'ಜನಪ್ರಿಯ ಮೆಟ್ರೋ ನಿಲ್ದಾಣಗಳು',
      tagline: 'ನಮ್ಮ ರೈಡ್ • ಬೆಂಗಳೂರು ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ'
    }
  };

  const t = content[lang] || content.en;

  const popularStations = [
    { name: 'Nadaprabhu Kempegowda Station, Majestic', line: 'Purple & Green Interchange' },
    { name: 'Indiranagar', line: 'Purple Line' },
    { name: 'MG Road', line: 'Purple Line' },
    { name: 'Whitefield (Kadugodi)', line: 'Purple Line' },
    { name: 'Silk Board', line: 'Yellow Line' },
    { name: 'Electronic City', line: 'Yellow Line' }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-950 dark:to-black flex items-center justify-center transition-colors duration-300">
      <div className="max-w-2xl w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[36px] border border-gray-200/80 dark:border-neutral-800 text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Metro Background Line Glows */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Status & Metro Line Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Purple Line</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Green Line</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Yellow Line</span>
          </div>
        </div>

        {/* Metro Train & 404 Graphic Illustration */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <svg className="w-full h-full text-emerald-500 dark:text-emerald-400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Curved Metro Tracks */}
            <path d="M 15 165 Q 100 135 185 165" stroke="#A855F7" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7" />
            <path d="M 15 175 Q 100 145 185 175" stroke="#10B981" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
            <path d="M 15 185 Q 100 155 185 185" stroke="#EAB308" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7" />

            {/* Glowing Station Signal Ring */}
            <circle cx="100" cy="78" r="46" fill="currentColor" fillOpacity="0.06" />
            <circle cx="100" cy="78" r="34" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: '20s' }} />
            <circle cx="100" cy="78" r="14" fill="currentColor" fillOpacity="0.15" />

            {/* Metro Front Coach Body */}
            <rect x="70" y="52" width="60" height="54" rx="16" fill="#0F172A" stroke="currentColor" strokeWidth="3.5" />
            {/* Panoramic Windshield */}
            <rect x="77" y="60" width="46" height="22" rx="7" fill="#38BDF8" fillOpacity="0.85" />
            <line x1="86" y1="78" x2="98" y2="65" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            {/* Dual Headlights */}
            <circle cx="83" cy="94" r="4.5" fill="#FBBF24" className="animate-pulse" />
            <circle cx="117" cy="94" r="4.5" fill="#FBBF24" className="animate-pulse" />
            {/* Front Bumper Arch */}
            <path d="M 88 106 C 94 102, 106 102, 112 106" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Glowing 404 Floating Pill */}
          <span className="absolute top-1 right-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-xs font-black tracking-widest font-mono shadow-lg shadow-purple-500/30">
            404
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 font-bold text-base leading-relaxed max-w-md mx-auto">
            {t.subtitle}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Interactive Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-100/90 dark:bg-neutral-800/90 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800 text-left">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery('');
                    navigate(item.url);
                  }}
                  className="w-full px-4 py-3 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 transition-colors flex items-center justify-between text-left group"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {item.name}
                    </p>
                    {item.subtitle && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Navigation Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary Call To Action */}
          <Link
            to="/"
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            <Navigation className="w-5 h-5" />
            <span>{t.homeBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Link
              to="/map"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Map className="w-4 h-4 text-purple-500" />
              <span>{t.mapBtn}</span>
            </Link>

            <Link
              to="/fare-calculator"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>{t.fareBtn}</span>
            </Link>

            <Link
              to="/timings"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{t.timingsBtn}</span>
            </Link>

            <Link
              to="/stations"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Train className="w-4 h-4 text-blue-500" />
              <span>{t.stationsBtn}</span>
            </Link>

            <Link
              to="/explore"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Compass className="w-4 h-4 text-pink-500" />
              <span>{t.exploreBtn}</span>
            </Link>

            <Link
              to="/download"
              className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.downloadBtn}</span>
            </Link>
          </div>
        </div>

        {/* Popular Metro Station Pills */}
        <div className="pt-2 border-t border-gray-200/60 dark:border-neutral-800">
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            {t.popularTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularStations.map((st, i) => (
              <Link
                key={i}
                to={`/stations?query=${encodeURIComponent(st.name)}`}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold border border-gray-200 dark:border-neutral-800 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>{st.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">
          {t.tagline}
        </p>

      </div>
    </div>
  );
}
