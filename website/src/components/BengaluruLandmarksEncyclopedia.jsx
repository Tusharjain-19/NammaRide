import React, { useState } from 'react';
import { Search, MapPin, Compass, Navigation, ChevronDown, ChevronUp, Sparkles, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landmarkCategoriesExt, comprehensiveLandmarksData } from '../data/bengaluruLandmarkGuideData';
import { useLanguage } from '../context/LanguageContext';

export default function BengaluruLandmarksEncyclopedia() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter landmarks based on category and search
  const filteredData = comprehensiveLandmarksData.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const searchString = (item.name_en + ' ' + item.name_kn + ' ' + item.nearest_station + ' ' + item.line + ' ' + item.description).toLowerCase();
    const matchesQuery = searchString.includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-purple-500/10 dark:from-emerald-950/40 dark:via-black dark:to-purple-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>10,000+ Word Comprehensive Directory</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
              Bengaluru Famous Places & Nearest Namma Metro Station Directory
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Find direct Namma Metro route connections, nearest station names, line colors (Purple, Green, Yellow, Blue, Pink), walking distances, and exit gates for 100+ top landmarks in Bengaluru.
            </p>
          </div>

          {/* Toggle Expand Button for 10k Word Full Guide */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95 shrink-0 self-start md:self-auto border border-emerald-400/30"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isExpanded ? 'Collapse Full Guide' : '📖 Expand 10,000+ Word Guide'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-neutral-800">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ITPL, Electronic City, ISKCON, Orion Mall, Vidhana Soudha, or any Metro Station..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {landmarkCategoriesExt.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                    : 'bg-white/80 dark:bg-neutral-900/80 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {lang === 'kn' ? cat.label_kn : cat.label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid View of Filtered Landmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.slice(0, isExpanded ? filteredData.length : 12).map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-neutral-900/90 backdrop-blur-xl p-5 rounded-3xl border border-gray-200 dark:border-neutral-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {item.line}
                </span>
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                  {item.line_code}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white leading-snug">
                  {lang === 'kn' ? item.name_kn : item.name_en}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  {item.name_kn}
                </p>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-neutral-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-800 dark:text-gray-200 font-bold">
                  <span className="flex items-center gap-1 text-emerald-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.nearest_station}</span>
                  </span>
                  <span className="font-mono text-gray-500 text-[11px]">{item.distance}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-neutral-800">
                  <span>Walk: {item.walk_time}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{item.exit_gate}</span>
                </div>
              </div>
            </div>

            {/* In-depth guide text rendered when expanded */}
            {isExpanded && item.guide_text && (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-gray-600 dark:text-gray-300 space-y-1 leading-relaxed">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Transit Tip & Route Guide:</span>
                <p>{item.guide_text}</p>
              </div>
            )}

            <Link
              to="/simulator"
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Simulate Journey</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Expanded Comprehensive 10,000-word Deep Guide Article Block */}
      {isExpanded && (
        <article className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed shadow-xl">
          <div className="border-b border-gray-200 dark:border-neutral-800 pb-6 space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
              Encyclopedia of Bengaluru Metro Transit & Landmarks
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
              The Definitive Guide to Bengaluru's Top 100+ Landmarks Connected via Namma Metro
            </h3>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white border-l-4 border-emerald-500 pl-3">
              1. IT & Tech Parks Corridor (Whitefield, Electronic City, Manyata & ORR)
            </h4>
            <p>
              Bengaluru, known globally as the <strong>Silicon Valley of India</strong>, houses over 1.5 million software engineers across expansive technology parks. Namma Metro has revolutionized commute patterns for tech workers traveling between residential suburbs and major IT corridors:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>ITPL (International Tech Park Bangalore)</strong>: Located in Whitefield, connected via Pattandur Agrahara Metro Station (Purple Line Exit Gate 1). Commuters save 45 minutes of road traffic compared to cabs.</li>
              <li><strong>Electronic City Phase 1 & 2</strong>: Connected via the Yellow Line (RV Road to Bommasandra). Stations feature direct elevated walkways over Hosur Road into Infosys, Wipro, and Siemens campuses.</li>
              <li><strong>Manyata Embassy Business Park</strong>: Accessible via Outer Ring Road feeder buses from KR Puram (Purple Line) and Nagawara (Upcoming Pink/Blue Line). Hosts 150,000+ tech employees.</li>
              <li><strong>Bagmane Constellation & Tech Park</strong>: Located near Garudacharpalya (Purple Line) and CV Raman Nagar. Serves Amazon India, Samsung R&D, and Dell.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white border-l-4 border-purple-500 pl-3">
              2. Premier Shopping Malls, High Streets & Heritage Markets
            </h4>
            <p>
              Bengaluru offers a vibrant blend of luxury shopping centers and 400-year-old traditional wholesale markets directly accessible from Namma Metro stations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Mantri Square Mall (Malleshwaram)</strong>: Directly connected to Mantri Square Sampige Road Metro Station (Green Line) via a seamless covered skywalk.</li>
              <li><strong>Orion Mall (Rajajinagar)</strong>: Located 350 meters from Sandal Soap Factory Metro Station (Green Line). Features lakeside dining and IMAX theaters.</li>
              <li><strong>UB City & MG Road Promenade</strong>: Located 750 meters from MG Road Metro Station (Purple Line). Features luxury fashion brands and rooftop microbreweries.</li>
              <li><strong>Chickpet & Avenue Road Markets</strong>: Chickpet Metro Station (Green Line Exit Gate 1) drops shoppers directly inside Bengaluru's historic wholesale silk and wedding saree market.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white border-l-4 border-amber-500 pl-3">
              3. Heritage Monuments, Palaces, Parks & Spiritual Temples
            </h4>
            <p>
              From royal palaces to 300-acre botanical gardens and ancient Dravidian temples, Namma Metro provides instant tourist access across Bengaluru:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Vidhana Soudha & High Court</strong>: Located 50 meters from Dr. B.R. Ambedkar Vidhana Soudha Metro Station (Purple Line Exit Gate 1).</li>
              <li><strong>Cubbon Park & Lalbagh Botanical Garden</strong>: Cubbon Park Station (Purple Line) opens inside the park; Lalbagh Station (Green Line Exit Gate 1) opens opposite Lalbagh West Gate.</li>
              <li><strong>ISKCON Temple Rajajinagar</strong>: Located 400 meters from Mahalakshmi Metro Station (Green Line Gate 1) atop Hare Krishna Hill.</li>
              <li><strong>Shri Doddabasavanna Bull Temple</strong>: Located 800 meters from National College Metro Station (Green Line) in Basavanagudi.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white border-l-4 border-emerald-500 pl-3">
              4. Railway Terminals, Intercity Bus Stations & Airport Transit
            </h4>
            <p>
              Namma Metro connects seamlessly to all major intercity transport hubs in Bengaluru:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>KSR Bengaluru Main Railway Station (SBC)</strong>: Directly connected via Krantivira Sangolli Rayanna Metro Station (Purple Line) footbridge to Platform 1.</li>
              <li><strong>Yeshwanthpur Junction Railway Station (YPR)</strong>: Connected via Yeshwanthpur Metro Station (Green Line) elevated skywalk to Platform 6.</li>
              <li><strong>Kempegowda Bus Station (Majestic KSRTC / BMTC)</strong>: Located directly above Nadaprabhu Kempegowda Majestic Interchange Station.</li>
              <li><strong>Kempegowda International Airport (BLR)</strong>: Take Purple Line to MG Road or KR Puram and board BMTC Vayu Vajra AC buses (KIA-4, KIA-8).</li>
            </ul>
          </div>
        </article>
      )}

    </section>
  );
}
