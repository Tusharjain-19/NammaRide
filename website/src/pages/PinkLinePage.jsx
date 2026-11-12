import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, MapPin, Clock, ArrowRightLeft, ShieldCheck, Zap, 
  ChevronRight, Calendar, AlertTriangle, CheckCircle2, 
  ExternalLink, Sparkles, Compass, Building, HelpCircle, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MetaSEO from '../components/MetaSEO';
import { useLanguage } from '../context/LanguageContext';

export default function PinkLinePage() {
  const { lang, t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedStation, setSelectedStation] = useState('PK05');

  const elevatedStations = [
    {
      id: "PK01",
      code: "KLNA",
      name_en: "Kalena Agrahara",
      name_kn: "ಕಾಳೇನ ಅಗ್ರಹಾರ",
      type: "Elevated Terminal",
      lat: 12.8647,
      lon: 77.5975,
      platforms: "Plat 1: Towards Tavarekere • Plat 2: Terminal Arrival",
      landmarks: ["Royal Meenakshi Mall", "Gottigere BMTC Bus Depot", "Meenakshi Sundareswarar Temple", "AMC Engineering College", "NICE Ring Road Junction"],
      gates: [
        { gate: "A", name: "Royal Meenakshi Mall & Gottigere Depot side" },
        { gate: "B", name: "Meenakshi Temple & NICE Corridor link" }
      ],
      description: "Southern elevated terminus on Bannerghatta Main Road. Serves Gottigere, NICE Road commuters, and major shopping hubs."
    },
    {
      id: "PK02",
      code: "HLMV",
      name_en: "Hulimavu",
      name_kn: "ಹುಳಿಮಾವು",
      type: "Elevated Station",
      lat: 12.8782,
      lon: 77.5982,
      platforms: "Plat 1: Towards Tavarekere • Plat 2: Towards Kalena Agrahara",
      landmarks: ["Sri Ramalingeshwara Cave Temple", "Decathlon Bannerghatta", "Nano Hospital", "BGS National Public School", "Akshayanagar Link Rd"],
      gates: [
        { gate: "A", name: "Decathlon & Hulimavu Cave Temple side" },
        { gate: "B", name: "Nano Hospital & Akshayanagar road" }
      ],
      description: "Convenient access to heritage cave temples, multi-speciality healthcare, and retail centers on Bannerghatta road."
    },
    {
      id: "PK03",
      code: "IIMB",
      name_en: "IIM Bangalore (Bilekahalli)",
      name_kn: "ಐಐಎಂ ಬೆಂಗಳೂರು (ಬಿಳೇಕಹಳ್ಳಿ)",
      type: "Elevated Station",
      lat: 12.8931,
      lon: 77.5990,
      platforms: "Plat 1: Towards Tavarekere • Plat 2: Towards Kalena Agrahara",
      landmarks: ["Indian Institute of Management Bangalore", "Fortis Hospital Bannerghatta", "Apollo Hospitals", "Kalyani Magnum Tech Park", "Bilekahalli Junction"],
      gates: [
        { gate: "A", name: "IIM Bangalore Campus main entrance" },
        { gate: "B", name: "Fortis & Apollo Hospitals medical corridor" }
      ],
      description: "High-footfall station catering to India's premier management institute, major tertiary hospitals, and tech workforce."
    },
    {
      id: "PK04",
      code: "JPN4",
      name_en: "JP Nagar 4th Phase",
      name_kn: "ಜೆಪಿ ನಗರ ೪ನೇ ಹಂತ",
      type: "Elevated Station",
      lat: 12.9068,
      lon: 77.5998,
      platforms: "Plat 1: Towards Tavarekere • Plat 2: Towards Kalena Agrahara",
      landmarks: ["Vega City Mall", "Shoppers Stop Bannerghatta", "Dollars Colony JP Nagar", "Ranga Shankara (1.6 km)", "Outer Ring Road Junction"],
      gates: [
        { gate: "A", name: "Vega City Mall & Shoppers Stop direct concourse" },
        { gate: "B", name: "JP Nagar 4th Phase residential & Outer Ring Rd" }
      ],
      description: "Direct connection to major retail hubs like Vega City Mall and south Bengaluru's upscale residential pockets."
    },
    {
      id: "PK05",
      code: "JYDV",
      name_en: "Jayadeva Hospital",
      name_kn: "ಜಯದೇವ ಆಸ್ಪತ್ರೆ",
      type: "Multi-Level Elevated Interchange",
      lat: 12.9161,
      lon: 77.6015,
      platforms: "Pink Line (Level 6): Platform 3 (Northbound to Tavarekere / Nagawara), Platform 4 (Southbound to JP Nagar 4th Phase / Kalena Agrahara) • Yellow Line (Level 5): Platform 1 (Westbound to RV Road), Platform 2 (Eastbound to Bommasandra / Electronic City)",
      landmarks: ["Sri Jayadeva Institute of Cardiovascular Sciences", "Yellow Line Interchange", "BTM Layout 1st & 2nd Stage", "East End Circle Jayanagar"],
      gates: [
        { gate: "A", name: "Jayadeva Cardiac Institute main entrance & emergency bay" },
        { gate: "B", name: "Yellow Line direct interchange concourse" },
        { gate: "C", name: "BTM Layout Ring Road & 16th Main commercial area" }
      ],
      description: "Bengaluru's iconic multi-level interchange linking Pink Line (Bannerghatta corridor) with Yellow Line (Electronic City & Silk Board)."
    },
    {
      id: "PK06",
      code: "TVRK",
      name_en: "Tavarekere (Swagath Road)",
      name_kn: "ತಾವರೆಕೆರೆ",
      type: "Elevated Station (Phase 1 Terminus)",
      lat: 12.9258,
      lon: 77.6052,
      platforms: "Platform 1 (Northbound): For trains heading toward Nagawara • Platform 2 (Southbound): For trains heading toward Kalena Agrahara (via Jayadeva Hospital)",
      landmarks: ["Tavarekere Park", "Nexus Koramangala (Forum Mall)", "Christ University (SG Palya)", "St. John's Medical College", "Madiwala"],
      gates: [
        { gate: "A", name: "Tavarekere Park & SG Palya / Christ University link" },
        { gate: "B", name: "BTM Layout 1st Stage & Koramangala link" }
      ],
      description: "Elevated northern terminus for Phase 1. Quick access to Koramangala, SG Palya, student hubs, and healthcare institutes."
    }
  ];

  const undergroundStations = [
    { id: "PK07", name: "Dairy Circle", kn: "ಡೈರಿ ವೃತ್ತ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK08", name: "Lakkasandra", kn: "ಲಕ್ಕಸಂದ್ರ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK09", name: "Langford Town", kn: "ಲ್ಯಾಂಗ್‌ಫೋರ್ಡ್ ಟೌನ್", type: "Underground", status: "Upcoming 2027" },
    { id: "PK10", name: "Rashtriya Military School", kn: "ರಾಷ್ಟ್ರೀಯ ಮಿಲಿಟರಿ ಶಾಲೆ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK11", name: "MG Road (Purple Line Interchange)", kn: "ಮಹಾತ್ಮ ಗಾಂಧಿ ರಸ್ತೆ", type: "Underground Interchange", status: "Upcoming 2027" },
    { id: "PK12", name: "Shivajinagar", kn: "ಶಿವಾಜಿನಗರ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK13", name: "Cantonment Railway Station", kn: "ಕಂಟೋನ್ಮೆಂಟ್ ರೈಲ್ವೆ", type: "Underground Railway Link", status: "Upcoming 2027" },
    { id: "PK14", name: "Pottery Town", kn: "ಪಾಟರಿ ಟೌನ್", type: "Underground", status: "Upcoming 2027" },
    { id: "PK15", name: "Tannery Road", kn: "ಟ್ಯಾನರಿ ರಸ್ತೆ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK16", name: "Venkateshpura", kn: "ವೆಂಕಟೇಶಪುರ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK17", name: "Kadugondanahalli", kn: "ಕಾಡುಗೊಂಡನಹಳ್ಳಿ", type: "Underground", status: "Upcoming 2027" },
    { id: "PK18", name: "Nagawara (Airport Blue Line Interchange)", kn: "ನಾಗವಾರ", type: "Underground Northern Terminus", status: "Upcoming 2027" }
  ];

  const faqs = [
    {
      q: "When is the Namma Metro Pink Line opening?",
      a: "The 7.5-km elevated section of the Pink Line (Kalena Agrahara to Tavarekere) is scheduled for inauguration on November 13, 2026, by Prime Minister Narendra Modi, as announced by Greater Bengaluru Development Minister Krishna Byre Gowda and Bengaluru South MP Tejasvi Surya."
    },
    {
      q: "Which stations are operational on the Pink Line initially?",
      a: "The Phase 1 stretch comprises 6 elevated stations: 1) Kalena Agrahara, 2) Hulimavu, 3) IIM Bangalore (Bilekahalli), 4) JP Nagar 4th Phase, 5) Jayadeva Hospital (Interchange), and 6) Tavarekere."
    },
    {
      q: "How does the interchange work at Jayadeva Hospital station?",
      a: "Jayadeva Hospital is a massive multi-level elevated interchange station. Level 5 accommodates the Yellow Line (Platform 1 for RV Road Westbound, Platform 2 for Bommasandra / Electronic City Eastbound), while Level 6 hosts the Pink Line (Platform 3 for Tavarekere / Nagawara Northbound, Platform 4 for JP Nagar 4th Phase / Kalena Agrahara Southbound). Commuters can transfer between lines within 2-3 minutes using high-speed elevators and dedicated escalators without exiting the fare gates."
    },
    {
      q: "What are the first and last train timings on the Pink Line?",
      a: "Trains operate from 05:00 AM to 11:00 PM on Mondays through Saturdays, and from 07:00 AM to 11:00 PM on Sundays. Peak hour headway is 8 to 10 minutes, and non-peak frequency is 12 to 15 minutes."
    },
    {
      q: "What is the metro fare between Kalena Agrahara and Tavarekere?",
      a: "Fares adhere to the standard BMRCL distance/hop tariff: ₹10 for up to 2 km (1-2 stations), ₹20 for 2-4 km (3-4 stations), and ₹30 for the complete 7.5 km stretch (5 stations). Smart Card and QR ticket holders receive an instant 5% to 10% discount."
    },
    {
      q: "When will the underground section from Dairy Circle to Nagawara open?",
      a: "The remaining 12 underground stations (from Dairy Circle through MG Road, Shivajinagar, Cantonment, to Nagawara) are under active construction as Phase 2B and are projected to open in late 2027."
    }
  ];

  // Schema.org Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TransitLine",
        "name": "Namma Metro Pink Line (Line 4)",
        "alternateName": ["Bengaluru Pink Line Metro", "Reach 6 Elevated Metro", "ನಮ್ಮ ಮೆಟ್ರೋ ಪಿಂಕ್ ಲೈನ್"],
        "description": "7.5 km elevated rapid transit corridor along Bannerghatta Road connecting Kalena Agrahara to Tavarekere with interchange at Jayadeva Hospital.",
        "provider": {
          "@type": "GovernmentOrganization",
          "name": "Bangalore Metro Rail Corporation Limited (BMRCL)"
        },
        "hasMap": "https://www.nammaride.site/map"
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.nammaride.site/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pink Line Metro",
            "item": "https://www.nammaride.site/pink-line"
          }
        ]
      }
    ]
  };

  const currentStnObj = elevatedStations.find(s => s.id === selectedStation) || elevatedStations[4];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 flex flex-col space-y-16">
      
      {/* Dynamic SEO Meta */}
      <MetaSEO
        title="Namma Metro Pink Line: Kalena Agrahara to Tavarekere Opening, Route and Fares"
        description="Complete guide to Bengaluru Namma Metro Pink Line 7.5 km elevated corridor opening Nov 13, 2026. Stations list, Jayadeva interchange, first and last train timings, and ticket fares."
        canonicalPath="/pink-line"
        jsonLd={jsonLdData}
      />

      {/* ════════════ HERO BANNER ════════════ */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-pink-900/30 via-neutral-900 to-black border border-pink-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-3xl">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>Dedicated to Nation by PM Narendra Modi: November 13, 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Namma Metro <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Pink Line</span> Corridor
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Hon'ble Prime Minister Narendra Modi officially inaugurates the <strong>7.5-km elevated Pink Line section</strong> from <strong>Kalena Agrahara to Tavarekere</strong> on November 13, 2026. Bringing rapid rail transit to Bannerghatta Road, unlocking high-speed travel to Royal Meenakshi Mall, IIMB, Fortis, Apollo, Vega City, and the multi-level interchange with the Yellow Line at <strong>Jayadeva Hospital</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stretch</div>
              <div className="text-xl font-mono font-black text-white mt-0.5">7.5 km</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Live Stations</div>
              <div className="text-xl font-mono font-black text-pink-400 mt-0.5">6 Elevated</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Travel Time</div>
              <div className="text-xl font-mono font-black text-emerald-400 mt-0.5">~13 mins</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Interchange</div>
              <div className="text-xl font-mono font-black text-amber-400 mt-0.5">Jayadeva (Y03)</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/simulator"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Navigation className="w-4 h-4" /> Plan Pink Line Trip
            </Link>
            <Link
              to="/map"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" /> View Metro Map
            </Link>
          </div>

        </div>
      </div>

      {/* ════════════ JAYADEVA INTERCHANGE SPOTLIGHT ════════════ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Key Hub Spotlight
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Multi-Level Flyover + Metro</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Jayadeva Hospital Multi-Level Interchange Station
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Bengaluru’s tallest metro station structure connects the <strong>Pink Line (Level 6)</strong> with the <strong>Yellow Line (Level 5)</strong>. <strong>Pink Line (Level 6):</strong> Platform 3 for Tavarekere / Nagawara (Northbound) and Platform 4 for JP Nagar 4th Phase / Kalena Agrahara (Southbound). <strong>Yellow Line (Level 5):</strong> Platform 1 for RV Road (Westbound) and Platform 2 for Bommasandra / Electronic City (Eastbound). Commuters from Bannerghatta Road can smoothly change trains to reach <strong>Silk Board, Electronic City, BTM Layout, and RV Road</strong> in under 3 minutes walking transfer time.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-500/20 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Transfer Walk</div>
            <div className="text-2xl font-mono font-black text-amber-500 mt-1">2 - 3 min</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-500/20 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Direct To</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">Electronic City & RV Rd</div>
          </div>
        </div>
      </div>

      {/* ════════════ ELEVATED STATIONS DIRECTORY ════════════ */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Phase 1 Stations (Opening Nov 13, 2026)
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select any station below to view platform directions, entry/exit gates, and nearby hospitals & malls.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-pink-500">
            6 Stations Operational • 7.5 km
          </span>
        </div>

        {/* Station Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {elevatedStations.map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border flex items-center gap-2 ${
                selectedStation === st.id
                  ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/25'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:border-pink-500/40'
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">{st.code}</span>
              <span>{lang === 'kn' ? st.name_kn : st.name_en}</span>
            </button>
          ))}
        </div>

        {/* Active Station Card Detail */}
        {currentStnObj && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl space-y-6">
            {/* Station Real Photo Banner */}
            <div className="w-full h-48 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 relative shadow-md">
              <img 
                src={`/simulator/assets/images/stations/${currentStnObj.id}.jpg`} 
                alt={currentStnObj.name_en} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/simulator/assets/images/stations/PK03.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EC4899] shadow-sm"></span>
                  <span className="font-extrabold text-sm sm:text-base drop-shadow-md">{currentStnObj.name_en} Metro Station</span>
                </div>
                <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                  {currentStnObj.code}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-black bg-pink-500/10 text-pink-500 border border-pink-500/20">
                    {currentStnObj.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Live Operational
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {lang === 'kn' ? currentStnObj.name_kn : currentStnObj.name_en}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentStnObj.type}</p>
              </div>

              <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-950 px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-800">
                GPS: {currentStnObj.lat.toFixed(4)}° N, {currentStnObj.lon.toFixed(4)}° E
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentStnObj.description}
            </p>

            {/* Platform & Gates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-500 uppercase">
                  <Train className="w-4 h-4" /> Platform Layout
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {currentStnObj.platforms}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase">
                  <ArrowRightLeft className="w-4 h-4" /> Station Exit Gates
                </div>
                <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {currentStnObj.gates.map(g => (
                    <div key={g.gate} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-500">Gate {g.gate}:</span>
                      <span>{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Places Badges */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Major Landmarks & Transit Links
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStnObj.landmarks.map((place, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-neutral-700"
                  >
                     {place}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════════════ TIMINGS & FARE ESTIMATES ════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Timings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-500 uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Operating Timetable
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Pink Line Train Schedules
          </h3>
          <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span className="font-bold">Monday - Saturday</span>
              <span className="font-mono font-bold text-emerald-500">05:00 AM - 11:00 PM</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span className="font-bold">Sunday & Public Holidays</span>
              <span className="font-mono font-bold text-emerald-500">07:00 AM - 11:00 PM</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span className="font-bold">Morning Peak (08:30 - 11:30 AM)</span>
              <span className="font-mono font-bold text-pink-500">Every 8 - 10 mins</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span className="font-bold">Evening Peak (04:30 - 08:30 PM)</span>
              <span className="font-mono font-bold text-pink-500">Every 8 - 10 mins</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span className="font-bold">Non-Peak Midday & Late Night</span>
              <span className="font-mono font-bold text-gray-400">Every 12 - 15 mins</span>
            </div>
          </div>
        </div>

        {/* Fares */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            <Zap className="w-4 h-4" /> BMRCL Tariff
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Pink Line Ticket Prices
          </h3>
          <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span>Kalena Agrahara ↔ Hulimavu (1 hop)</span>
              <span className="font-mono font-bold text-emerald-500">₹10 (Smart Card: ₹9.50)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span>Kalena Agrahara ↔ IIM Bangalore (2 hops)</span>
              <span className="font-mono font-bold text-emerald-500">₹10 (Smart Card: ₹9.50)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span>Kalena Agrahara ↔ JP Nagar 4th Phase (3 hops)</span>
              <span className="font-mono font-bold text-emerald-500">₹20 (Smart Card: ₹19.00)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span>Kalena Agrahara ↔ Jayadeva Hospital (4 hops)</span>
              <span className="font-mono font-bold text-emerald-500">₹20 (Smart Card: ₹19.00)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-950">
              <span>Kalena Agrahara ↔ Tavarekere (5 hops full line)</span>
              <span className="font-mono font-bold text-pink-500 font-black">₹30 (Smart Card: ₹28.50)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ════════════ UNDERGROUND PHASE 2B UPCOMING ════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 text-gray-300 border border-neutral-700">
            Phase 2B (Underground Stretch)
          </span>
          <span className="text-xs text-gray-500">Scheduled for 2027</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          12 Underground Stations Under Active Construction
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          The northern underground stretch continues from Dairy Circle through the Central Business District (MG Road, Shivajinagar, Cantonment) up to Nagawara. These stations are currently disabled in the NammaRide route calculator and will go live once civil and signaling clearances are issued.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {undergroundStations.map(st => (
            <div
              key={st.id}
              className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 opacity-60 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-pink-400">{st.id}</span>
                <div className="text-xs font-bold text-gray-200 mt-0.5">{st.name}</div>
                <div className="text-[10px] text-gray-500">{st.kn}</div>
              </div>
              <span className="mt-2 text-[9px] font-semibold text-gray-500 uppercase">{st.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ FAQ SECTION (FEATURED SNIPPETS) ════════════ */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-pink-500" /> Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Everything commuters need to know about the Pink Line launch, stations, and transfers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-neutral-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════ APP DOWNLOAD / SIMULATOR CTA ════════════ */}
      <div className="rounded-[32px] p-8 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-black">Plan Your Pink Line Journey on NammaRide</h3>
          <p className="text-white/80 text-sm max-w-xl">
            Live GPS train countdowns, platform exit guidance, and offline maps available on Web and Android.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            to="/simulator"
            className="px-6 py-3 rounded-2xl bg-white text-gray-950 font-bold text-sm hover:bg-gray-100 transition-all shadow-md active:scale-95"
          >
            Launch Route Planner
          </Link>
          <Link
            to="/download"
            className="px-6 py-3 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
          >
            Get Mobile App
          </Link>
        </div>
      </div>

    </div>
  );
}
