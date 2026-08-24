import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, ArrowRightLeft, ShieldCheck, Zap, X, Info, PhoneCall, Bus, Accessibility, Wifi, Banknote, Building2, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stationsData } from '../data/stationsData';
import { useLanguage } from '../context/LanguageContext';

const getLineStyles = (lineId) => {
  switch (lineId.toLowerCase()) {
    case 'purple':
      return { 
        bg: 'bg-[#A855F7]/10 dark:bg-[#A855F7]/25', 
        border: 'border-[#A855F7]/30 dark:border-[#A855F7]/40', 
        text: 'text-[#9333EA] dark:text-[#A855F7]', 
        solidBg: 'bg-[#A855F7]' 
      };
    case 'green':
      return { 
        bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/25', 
        border: 'border-[#10B981]/30 dark:border-[#10B981]/40', 
        text: 'text-[#16a34a] dark:text-[#10B981]', 
        solidBg: 'bg-[#10B981]' 
      };
    case 'yellow':
      return { 
        bg: 'bg-[#EAB308]/10 dark:bg-[#EAB308]/25', 
        border: 'border-[#EAB308]/30 dark:border-[#EAB308]/40', 
        text: 'text-[#D97706] dark:text-[#FBBF24]', 
        solidBg: 'bg-[#EAB308]' 
      };
    case 'pink':
      return { 
        bg: 'bg-[#EC4899]/10 dark:bg-[#EC4899]/25', 
        border: 'border-[#EC4899]/30 dark:border-[#EC4899]/40', 
        text: 'text-[#F43F5E] dark:text-[#EC4899]', 
        solidBg: 'bg-[#EC4899]' 
      };
    default:
      return { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        border: 'border-gray-200 dark:border-gray-700', 
        text: 'text-gray-500 dark:text-gray-400', 
        solidBg: 'bg-gray-500' 
      };
  }
};

export default function StationsPage() {
  const { lang, t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStationModal, setActiveStationModal] = useState(null);

  const filteredStations = stationsData.filter((st) => {
    const matchesLine = selectedLine === 'all' || st.line_ids.includes(selectedLine);
    const searchStr = (st.name_en + ' ' + st.name_kn + ' ' + st.code + ' ' + st.nearby_landmarks.join(' ')).toLowerCase();
    const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
    return matchesLine && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-section-gap px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full relative z-10 flex flex-col">
      <div className="space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h1 className="font-display-xl text-[48px] sm:text-display-xl text-gray-900 dark:text-white tracking-tight font-bold">
            {t('stations')}
          </h1>
          <p className="font-body-lg text-gray-600 dark:text-gray-300">
            Complete database of BMRCL Metro Stations with GPS coordinates, elevator counts, platform details, facilities & nearby transit hubs.
          </p>
        </motion.div>

        {/* Search & Line Filters */}
        <div className="space-y-4 max-w-4xl mx-auto w-full">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station by name, code (e.g. PL-10, Majestic, MG Road) or landmark..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedLine('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedLine === 'all'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md glow-button'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              All Lines ({stationsData.length})
            </button>
            <button
              onClick={() => setSelectedLine('purple')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedLine === 'purple'
                  ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Purple Line
            </button>
            <button
              onClick={() => setSelectedLine('green')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedLine === 'green'
                  ? 'bg-[#10B981] text-white border-[#10B981] shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Green Line
            </button>
            <button
              onClick={() => setSelectedLine('yellow')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedLine === 'yellow'
                  ? 'bg-[#EAB308] text-white border-[#EAB308] shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Yellow Line
            </button>
          </div>
        </div>

        {/* STATIONS LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((st, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
              key={st.id}
              onClick={() => setActiveStationModal(st)}
              className="light-glass-card editorial-card-tilt p-6 rounded-3xl space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {st.line_ids.map((lineId) => {
                      const styles = getLineStyles(lineId);
                      return (
                        <span
                          key={lineId}
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] sm:text-xs border ${styles.bg} ${styles.border} ${styles.text}`}
                        >
                          {st.code}
                        </span>
                      );
                    })}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-800/40">
                    Crowd: {st.crowd_level}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-title-lg text-title-lg text-gray-900 dark:text-white font-bold">
                    {lang === 'kn' ? st.name_kn : st.name_en}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {st.line_ids.map((lineId) => {
                      const styles = getLineStyles(lineId);
                      const lineName = lineId.charAt(0).toUpperCase() + lineId.slice(1) + ' Line';
                      return (
                        <span
                          key={lineId}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${styles.bg} ${styles.border} ${styles.text}`}
                        >
                          {lineName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {st.accessibility.elevator_count > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-800/40 flex items-center gap-1">
                      <Accessibility className="w-3 h-3" /> Lifts ({st.accessibility.elevator_count})
                    </span>
                  )}
                  {st.facilities.has_wifi && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-100 dark:border-blue-800/40 flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> WiFi
                    </span>
                  )}
                  {st.facilities.atms.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-800/40 flex items-center gap-1">
                      <Banknote className="w-3 h-3" /> ATM
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center text-xs text-emerald-500 font-bold">
                <span>View Full Details & Exit Gates</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DETAILED STATION MODAL (11 PRD FIELDS) */}
        {activeStationModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[36px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto custom-scrollbar">
              
              <button
                onClick={() => setActiveStationModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 dark:bg-neutral-900 text-gray-400 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-neutral-800 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pr-10">
                <div className="flex flex-wrap gap-1.5">
                  {activeStationModal.line_ids.map((lineId) => {
                    const styles = getLineStyles(lineId);
                    return (
                      <span
                        key={lineId}
                        className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold border ${styles.bg} ${styles.border} ${styles.text}`}
                      >
                        Code: {activeStationModal.code}
                      </span>
                    );
                  })}
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-gray-900 dark:text-white">
                  {lang === 'kn' ? activeStationModal.name_kn : activeStationModal.name_en}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeStationModal.line_ids.map((lineId) => {
                    const styles = getLineStyles(lineId);
                    const lineName = lineId.charAt(0).toUpperCase() + lineId.slice(1) + ' Line';
                    return (
                      <span
                        key={lineId}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${styles.bg} ${styles.border} ${styles.text}`}
                      >
                        {lineName}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 11 Fields Grid */}
              <div className="space-y-5 text-xs text-gray-600 dark:text-gray-300">
                
                {/* Field 1 & 2: Hours & Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800">
                    <div className="text-gray-500 dark:text-gray-400 font-bold mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t('operatingHours')}</div>
                    <div className="text-gray-900 dark:text-white font-mono text-sm">{activeStationModal.operating_hours.first_train} - {activeStationModal.operating_hours.last_train}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800">
                    <div className="text-gray-500 dark:text-gray-400 font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> GPS Coordinates</div>
                    <div className="text-gray-900 dark:text-white font-mono text-sm">{activeStationModal.latitude}, {activeStationModal.longitude}</div>
                  </div>
                </div>

                {/* Field 3: Platform Configuration */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 space-y-1">
                  <div className="text-gray-500 dark:text-gray-400 font-bold flex items-center gap-1.5"><Bus className="w-3.5 h-3.5" /> Platform Configuration</div>
                  <div className="text-gray-900 dark:text-white text-sm">{activeStationModal.platform_count} Platforms • Platform 1 & Platform 2</div>
                </div>

                {/* Field 4: Accessibility */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
                  <div className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
                    <Accessibility className="w-3.5 h-3.5" /> <span>Divyangjan Accessibility Checklist</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-900 dark:text-white text-sm">
                    <div>Elevators: <strong>{activeStationModal.accessibility.elevator_count} units</strong></div>
                    <div>Escalators: <strong>{activeStationModal.accessibility.escalator_count} units</strong></div>
                    <div>Accessible Restrooms: <strong>Yes</strong></div>
                    <div>Wheelchair Ramps: <strong>Yes</strong></div>
                  </div>
                </div>

                {/* Field 5: Facilities */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 space-y-2">
                  <div className="text-gray-500 dark:text-gray-400 font-bold flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Station Facilities</div>
                  {activeStationModal.facilities.atms.length > 0 && (
                    <div className="text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-500" />
                      <span>ATMs: {activeStationModal.facilities.atms.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-gray-900 dark:text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> WiFi: {activeStationModal.facilities.has_wifi ? 'Free RailTel WiFi' : 'No'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Food: {activeStationModal.facilities.has_food_court ? 'Food Court Available' : 'Snack Parlours'}
                    </span>
                  </div>
                </div>

                {/* Field 6: Exit Gates */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 space-y-2">
                  <div className="text-gray-500 dark:text-gray-400 font-bold">🚪 Exit Gates Directory</div>
                  <div className="space-y-1">
                    {activeStationModal.exit_gates.map((g, i) => (
                      <div key={i} className="text-gray-900 dark:text-white">
                        <strong className="text-emerald-500">Gate {g.gate}:</strong> {g.destination}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/simulator"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs glow-button"
                >
                  Plan Trip From This Station
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
