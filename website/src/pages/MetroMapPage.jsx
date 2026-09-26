import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, MapPin, Zap, Clock, Bus, Accessibility, Building2, Banknote, Wifi, Utensils, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { stationsData } from '../data/stationsData';
import MetaSEO from '../components/MetaSEO';

export default function MetroMapPage() {
  const { lang, t } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [activeStation, setActiveStation] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Panning & Autocomplete Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollTopState, setScrollTopState] = useState(0);

  // Close search dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setShowResults(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Mobile default zoom adaptation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setZoomLevel(0.85);
    }
  }, []);

  const quickStationChips = [
    { name: 'Majestic', id: 'g17' },
    { name: 'MG Road', id: 'p10' },
    { name: 'Whitefield', id: 'p01' },
    { name: 'Electronic City', id: 'y09' },
    { name: 'Indiranagar', id: 'p08' }
  ];

  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.type !== 'touchstart') return;
    const container = containerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setStartX(clientX - container.offsetLeft);
    setStartY(clientY - container.offsetTop);
    setScrollLeftState(container.scrollLeft);
    setScrollTopState(container.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - container.offsetLeft;
    const y = clientY - container.offsetTop;
    
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    
    container.scrollLeft = scrollLeftState - walkX;
    container.scrollTop = scrollTopState - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const centerOnStation = (station, targetZoom = 1.2) => {
    setZoomLevel(targetZoom);
    setActiveStation(station);
  };

  const stationDescriptions = {
    "Nadaprabhu Kempegowda Stn., Majestic": "Nadaprabhu Kempegowda Station (Majestic) is the primary interchange terminal of Bengaluru Metro, connecting the Purple Line and Green Line. It is a massive underground station that spans across multiple levels, facilitating tens of thousands of daily commuters switching between east-west and north-south corridors. It is directly linked to KSR Bengaluru Railway Station and the Kempegowda Bus Station.",
    "MG Road": "Mahatma Gandhi Road Metro Station is one of the busiest elevated stations, located right in the heart of Bengaluru's retail and commercial district. It features a direct walkway to the popular Brigade Road, Church Street, and is adjacent to the beautiful boulevard. It serves as a major hub for shopping, dining, and colonial-era heritage landmarks.",
    "Dr. B.R. Ambedkar Stn., Vidhana Soudha": "This iconic underground station is located directly in front of the Vidhana Soudha, the state legislature of Karnataka, and the High Court. Built with high-security Dravidian architectural aesthetics, it serves the state administrative core of Bengaluru and provides instant access to Cubbon Park.",
    "Indiranagar": "Indiranagar Metro Station is located on the busy Chinmaya Mission Hospital (CMH) Road. It is the gateway to Bengaluru's premium culinary, pub, and fashion district on 100 Feet Road. The station is highly popular among tech professionals, tourists, and youth.",
    "Whitefield (Kadugodi)": "Whitefield (Kadugodi) is the eastern terminal station of the Purple Line, serving the massive IT corridor of Whitefield. It connects directly to major tech parks like ITPL, shopping centers, and residential townships, significantly reducing commute times for tech professionals.",
    "Rashtreeya Vidyalaya Road": "Rashtreeya Vidyalaya Road (RV Road) is a key interchange station located in Jayanagar. It connects the Green Line with the newly constructed Yellow Line, serving as a vital link for south Bengaluru residents commuting towards Electronic City and Bommasandra.",
    "Jayadeva Hospital": "Jayadeva Hospital Metro Station is a multi-level interchange hub serving the Green Line and Yellow Line. Situated near the famous Sri Jayadeva Institute of Cardiovascular Sciences, it handles massive passenger footfalls and connects the residential areas of Jayanagar, JP Nagar, and BTM Layout.",
    "Central Silk Board": "Central Silk Board Metro Station is a critical junction serving the Yellow Line and the upcoming Blue Line. Known for its historically heavy road traffic, the metro station provides a fast, elevated transit bypass for commuters travelling between HSR Layout, Electronic City, and the outer ring road tech corridors.",
    "KR Pura": "Krishnarajapura (KR Pura) Metro Station is an important elevated station on the Purple Line, serving as an interchange link to the upcoming airport line (Blue Line). It is located directly opposite the KR Puram Railway Station, facilitating seamless multimodal transit connections for long-distance rail passengers."
  };

  const getAboutStation = (st) => {
    if (stationDescriptions[st.name_en]) {
      return stationDescriptions[st.name_en];
    }
    const linesStr = st.lines.join(' and ');
    return `${lang === 'kn' ? st.name_kn : st.name_en} is a modern transit station on the ${linesStr}. Fully equipped with premium facilities, it supports smooth commuter flow with ${st.accessibility.elevator_count} elevators and ${st.accessibility.escalator_count} escalators. The station provides instant access to local landmarks and exits lead directly to ${st.exit_gates.map(g => g.destination).join(' and ')}.`;
  };

  return (
    <div className="min-h-screen pt-32 pb-section-gap px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full relative z-10 flex flex-col">
      <MetaSEO
        title="High-Res Interactive Bengaluru Metro Map 2026 — Vector PDF Download"
        description="Explore official 2026 BMRCL Bengaluru Metro map covering Purple, Green, Yellow, Blue (Airport), and Pink lines. Features high-res zoom, dark mode inversion, and PDF download."
        canonicalPath="/map"
      />
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-gray-200 dark:border-neutral-800 pb-6">
          <div>
            <h1 className="font-display-xl text-[36px] sm:text-display-xl text-gray-900 dark:text-white tracking-tight font-bold">
              {t('map')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Official BMRCL 2025 Metro Map visualizer with pan, zoom, and pitch-black dark mode inversion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* Download PDF Button */}
            <a
              href="/assets/images/Metro_Map_2025_-_Bengaluru_City.pdf"
              download="Metro_Map_2025_Bengaluru_City.pdf"
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <span>Download BMRCL PDF</span>
            </a>

            {/* Search Station Input */}
            <div 
              className="relative w-full sm:w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'kn' ? "ನಿಲ್ದಾಣ ಹುಡುಕಿ..." : "Search station..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Results */}
              {showResults && searchQuery.trim() && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800">
                  {stationsData
                    .filter((st) => {
                      const nameEn = st.name_en.toLowerCase();
                      const nameKn = st.name_kn.toLowerCase();
                      const query = searchQuery.toLowerCase();
                      return nameEn.includes(query) || nameKn.includes(query);
                    })
                    .slice(0, 8)
                    .map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          centerOnStation(st, 1.2);
                          setSearchQuery('');
                          setShowResults(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center justify-between gap-3 text-xs font-semibold text-gray-900 dark:text-white"
                      >
                        <div>
                          <div>{lang === 'kn' ? st.name_kn : st.name_en}</div>
                          <div className="text-[10px] text-gray-400 font-bold mt-0.5">{st.lines.join(' • ')}</div>
                        </div>
                        {st.interchange && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                            Interchange
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              )}
              {/* Quick Station Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 custom-scrollbar">
                {quickStationChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      const found = stationsData.find(s => s.name_en.toLowerCase().includes(chip.name.toLowerCase()));
                      if (found) centerOnStation(found, 1.2);
                    }}
                    className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-emerald-500/10 text-gray-700 dark:text-gray-300 hover:text-emerald-500 font-bold text-[10px] whitespace-nowrap transition-all border border-gray-200 dark:border-neutral-700 shrink-0 active:scale-95 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{chip.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* MAP CONTAINER & TOOLBAR */}
        <div className="rounded-3xl p-3 sm:p-6 relative overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 shadow-xl space-y-3">
          
          {/* Mobile & Desktop Line Legend Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-b border-gray-100 dark:border-neutral-900 text-[11px] font-bold">
            <span className="text-gray-400 text-[10px] uppercase font-mono shrink-0">Lines:</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 whitespace-nowrap shrink-0 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Purple Line</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Green Line</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap shrink-0 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Yellow Line</span>
            <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-dashed border-pink-500/40 whitespace-nowrap shrink-0 italic flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-400"></span> Pink (Upcoming)</span>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500 border border-dashed border-sky-500/40 whitespace-nowrap shrink-0 italic flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Blue (Airport)</span>
          </div>

          <div className="relative">
            {/* Map Zoom Controls (Touch Friendly) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/95 dark:bg-neutral-900/95 p-2 rounded-2xl border border-gray-200 dark:border-neutral-800 backdrop-blur-md shadow-xl">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.8))}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-800 hover:bg-emerald-500/10 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all active:scale-90"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-emerald-500" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.4))}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-800 hover:bg-emerald-500/10 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all active:scale-90"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-emerald-500" />
              </button>
              <button
                onClick={() => setZoomLevel(typeof window !== 'undefined' && window.innerWidth < 640 ? 0.85 : 0.75)}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-800 hover:bg-emerald-500/10 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all active:scale-90"
                title="Fit Screen"
              >
                <Maximize2 className="w-5 h-5 text-emerald-500" />
              </button>
            </div>

            {/* MAP CANVAS VIEW (EXPANDED SCROLL CONTAINER WITH DEFAULTS ZOOMED OUT) */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUpOrLeave}
            className={`w-full h-[65vh] sm:h-[840px] overflow-auto flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-neutral-800 p-2 sm:p-4 custom-scrollbar ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            <div
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.3s ease-out' }}
              className="origin-center transition-all duration-300 flex items-center justify-center min-w-full min-h-full"
            >
              {/* Official BMRCL 2025 Map PNG (Extracted from PDF with pitch-black dark mode inversion) */}
              <img
                src="/assets/images/metro_map_2025.png"
                alt="Official BMRCL Metro Map 2025"
                className="max-w-none w-[1050px] sm:w-[1250px] h-auto object-contain transition-all duration-500 dark:invert dark:hue-rotate-180 dark:contrast-125 dark:brightness-95 select-none rounded-xl"
                draggable={false}
              />
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED STATION MODAL */}
      {activeStation && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[36px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto custom-scrollbar">
            
            <button
              onClick={() => setActiveStation(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-neutral-800 transition-all hover:scale-105 active:scale-95 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Station Image */}
            {!imageError && (
              <div className="w-full h-56 rounded-[28px] overflow-hidden mb-4 relative border border-gray-200 dark:border-neutral-800 shadow-sm bg-gray-50 dark:bg-neutral-950 select-none">
                <img 
                  src={`/simulator/assets/images/stations/${activeStation.code}.jpg`} 
                  alt={activeStation.name_en} 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-white/10">
                  <span>📷 Station Photo</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-black border border-emerald-500/20">
                  CODE: {activeStation.code}
                </span>
                {activeStation.interchange && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-black border border-purple-500/20">
                    🔄 Interchange Station
                  </span>
                )}
              </div>
              <h2 className="font-display-xl text-3xl font-black text-gray-900 dark:text-white">
                {lang === 'kn' ? activeStation.name_kn : activeStation.name_en}
              </h2>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{activeStation.lines.join(' • ')}</p>
            </div>

            {/* About Station Description */}
            <div className="bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-3xl p-5 space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">About the Station</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {getAboutStation(activeStation)}
              </p>
            </div>

            {/* 11 Fields Grid */}
            <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300">
              
              {/* Field 1 & 2: Hours & Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900">
                  <div className="text-gray-400 font-bold mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-500" /> {t('operatingHours')}</div>
                  <div className="text-gray-900 dark:text-white font-mono text-sm font-bold">{activeStation.operating_hours.first_train} - {activeStation.operating_hours.last_train}</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900">
                  <div className="text-gray-400 font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-500" /> GPS Coordinates</div>
                  <div className="text-gray-900 dark:text-white font-mono text-sm font-bold">{activeStation.latitude}, {activeStation.longitude}</div>
                </div>
              </div>

              {/* Field 3: Platform Configuration */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 space-y-1">
                <div className="text-gray-400 font-bold flex items-center gap-1.5"><Bus className="w-3.5 h-3.5 text-amber-500" /> Platform Configuration</div>
                <div className="text-gray-900 dark:text-white text-xs font-semibold">{activeStation.platform_count} Platforms • Platform 1 (Towards Terminal A) & Platform 2 (Towards Terminal B)</div>
              </div>

              {/* Field 4: Accessibility */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 space-y-2">
                <div className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
                  <Accessibility className="w-4 h-4" /> <span className="uppercase tracking-wider text-[11px]">Divyangjan Accessibility Checklist</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-900 dark:text-white text-xs">
                  <div>Elevators: <strong className="text-emerald-500">{activeStation.accessibility.elevator_count} units</strong></div>
                  <div>Escalators: <strong className="text-emerald-500">{activeStation.accessibility.escalator_count} units</strong></div>
                  <div>Accessible Restrooms: <strong className="text-emerald-500">Yes</strong></div>
                  <div>Wheelchair Ramps: <strong className="text-emerald-500">Yes</strong></div>
                </div>
              </div>

              {/* Field 5: Facilities */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 space-y-2">
                <div className="text-gray-400 font-bold flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-blue-500" /> Station Facilities</div>
                {activeStation.facilities.atms.length > 0 && (
                  <div className="text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-black p-3 rounded-xl border border-gray-100 dark:border-neutral-900 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-500" />
                    <span>ATMs: {activeStation.facilities.atms.join(', ')}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-gray-900 dark:text-white">
                  <span className="px-3 py-1 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-900 flex items-center gap-1.5 text-xs">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" /> WiFi: {activeStation.facilities.has_wifi ? 'Free RailTel WiFi' : 'Available'}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-900 flex items-center gap-1.5 text-xs">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" /> Food: {activeStation.facilities.has_food_court ? 'Food Court' : 'Snack Stalls'}
                  </span>
                </div>
              </div>

              {/* Field 6: Exit Gates */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 space-y-2">
                <div className="text-gray-400 font-bold">🚪 Exit Gates Directory</div>
                <div className="space-y-1">
                  {activeStation.exit_gates.map((g, i) => (
                    <div key={i} className="text-gray-900 dark:text-white text-xs">
                      <strong className="text-emerald-500">Gate {g.gate}:</strong> {g.destination}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 justify-end">
              <Link
                to={`/explore?station=${encodeURIComponent(activeStation.name_en)}`}
                className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 border border-gray-200 dark:border-neutral-800"
              >
                <MapPin className="w-4 h-4 text-purple-500" />
                Explore Places Near Station
              </Link>
              <Link
                to="/simulator"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs glow-button flex items-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <Zap className="w-4 h-4" />
                Plan Journey From Here
              </Link>
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
