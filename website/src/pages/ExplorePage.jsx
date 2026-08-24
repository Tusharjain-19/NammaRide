import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Compass, Navigation, Zap, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landmarkCategories, landmarksData } from '../data/landmarksData';
import { useLanguage } from '../context/LanguageContext';

const getLineStyles = (lineName) => {
  const normalized = lineName.toLowerCase();
  if (normalized.includes('purple')) {
    return { 
      bg: 'bg-[#A855F7]/10 dark:bg-[#A855F7]/25', 
      border: 'border-[#A855F7]/30 dark:border-[#A855F7]/40', 
      text: 'text-[#9333EA] dark:text-[#A855F7]' 
    };
  } else if (normalized.includes('green')) {
    return { 
      bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/25', 
      border: 'border-[#10B981]/30 dark:border-[#10B981]/40', 
      text: 'text-[#16a34a] dark:text-[#10B981]' 
    };
  } else if (normalized.includes('yellow')) {
    return { 
      bg: 'bg-[#EAB308]/10 dark:bg-[#EAB308]/25', 
      border: 'border-[#EAB308]/30 dark:border-[#EAB308]/40', 
      text: 'text-[#D97706] dark:text-[#FBBF24]' 
    };
  } else if (normalized.includes('pink')) {
    return { 
      bg: 'bg-[#EC4899]/10 dark:bg-[#EC4899]/25', 
      border: 'border-[#EC4899]/30 dark:border-[#EC4899]/40', 
      text: 'text-[#F43F5E] dark:text-[#EC4899]' 
    };
  } else if (normalized.includes('blue')) {
    return { 
      bg: 'bg-blue-500/10 dark:bg-blue-500/25', 
      border: 'border-blue-500/30 dark:border-blue-500/40', 
      text: 'text-blue-600 dark:text-blue-400' 
    };
  }
  return { 
    bg: 'bg-gray-100 dark:bg-gray-800', 
    border: 'border-gray-200 dark:border-gray-700', 
    text: 'text-gray-500 dark:text-gray-400' 
  };
};

export default function ExplorePage() {
  const { lang, t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStation, setSelectedStation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extract unique stations
  const uniqueStations = Array.from(new Set(landmarksData.map(item => item.nearest_station))).sort();
  
  // Pagination State: 12 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset page when category, station, or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, selectedStation, searchQuery]);

  // Line Priority: Active operational lines (Purple, Green, Yellow) come first
  const getLinePriority = (line) => {
    const normalized = (line || '').toLowerCase();
    if (normalized.includes('purple')) return 1;
    if (normalized.includes('green')) return 2;
    if (normalized.includes('yellow')) return 3;
    return 4; // non-operational / future lines
  };

  const filteredLandmarks = landmarksData
    .filter((item) => {
      const matchesCat = selectedCat === 'all' || item.category === selectedCat;
      const matchesStation = selectedStation === 'all' || item.nearest_station === selectedStation;
      const nameStr = (item.name_en + ' ' + item.name_kn + ' ' + item.nearest_station).toLowerCase();
      const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
      return matchesCat && matchesStation && matchesSearch;
    })
    .sort((a, b) => getLinePriority(a.line) - getLinePriority(b.line));

  const totalItems = filteredLandmarks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLandmarks = filteredLandmarks.slice(startIndex, endIndex);

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Bengaluru City & Metro Guide</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-gray-900 dark:text-white tracking-tight">
            {t('explore')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Discover top tech hubs, shopping malls, heritage spots, cafes, and nightlife connected directly via active Purple, Green, and Yellow Metro lines.
          </p>
        </motion.div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-6">
          
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech parks, malls, heritage sites, or metro stations..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-lg"
            />
          </div>

          {/* Category Tabs & Station Filter */}
          <div className="flex flex-col xl:flex-row items-center gap-4 justify-between w-full">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-start sm:justify-center w-full xl:w-auto">
              {landmarkCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCat === cat.id
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-100 dark:bg-gray-900/90 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {lang === 'kn' ? cat.label_kn : cat.label_en}
                </button>
              ))}
            </div>

            {/* Station Filter Dropdown */}
            <div className="w-full xl:w-72 shrink-0">
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full p-3 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
              >
                <option value="all">{lang === 'kn' ? 'ಎಲ್ಲಾ ನಿಲ್ದಾಣಗಳು' : 'All Metro Stations'}</option>
                {uniqueStations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Landmarks Grid (12 items per page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLandmarks.map((place, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              key={place.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 editorial-card-tilt flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {(() => {
                    const styles = getLineStyles(place.line);
                    return (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${styles.bg} ${styles.border} ${styles.text}`}>
                        {place.line}
                      </span>
                    );
                  })()}
                  {getLinePriority(place.line) <= 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                      Live Line
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                  {lang === 'kn' ? place.name_kn : place.name_en}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {place.description}
                </p>

                {/* Metro Proximity Details */}
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-800 dark:text-gray-300 font-medium">
                    <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{place.nearest_station}</span>
                    </span>
                    <span className="font-mono text-gray-500 dark:text-gray-400">{place.distance}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-900">
                    <span>Walk: {place.walk_time}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">{place.exit_gate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/simulator"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Plan Route via Metro</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 shadow-sm"
            >
              ← Previous
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 shadow-sm"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
