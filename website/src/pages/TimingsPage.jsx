import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Info, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { timingsData } from '../data/timingsData';

export default function TimingsPage() {
  const { lang, t } = useLanguage();
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');
  
  // State to track active timing schedules for each line independently
  const [activeDays, setActiveDays] = useState({
    purple: 'mon_fri',
    green: 'mon_fri',
    yellow: 'mon_sat'
  });

  const handleDayChange = (lineKey, dayKey) => {
    setActiveDays((prev) => ({
      ...prev,
      [lineKey]: dayKey
    }));
  };

  const filteredLines = Object.entries(timingsData).filter(([key]) => 
    selectedLineFilter === 'all' || key === selectedLineFilter
  );

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Official BMRCL Metro Timetable 2025</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-gray-900 dark:text-white tracking-tight">
            {t('timings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            Real-time headway intervals, first and last train schedules, and weekend travel frequency across all active Bengaluru Metro corridors.
          </p>
        </motion.div>

        {/* Top Line Filter Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => setSelectedLineFilter('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedLineFilter === 'all'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            All Lines (3)
          </button>
          <button
            onClick={() => setSelectedLineFilter('purple')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedLineFilter === 'purple'
                ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-lg shadow-purple-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            Purple Line
          </button>
          <button
            onClick={() => setSelectedLineFilter('green')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedLineFilter === 'green'
                ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            Green Line
          </button>
          <button
            onClick={() => setSelectedLineFilter('yellow')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedLineFilter === 'yellow'
                ? 'bg-[#EAB308] text-white border-[#EAB308] shadow-lg shadow-yellow-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            Yellow Line
          </button>
        </motion.div>

        {/* TIMING CARDS GRID */}
        <div className={`grid grid-cols-1 ${selectedLineFilter === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-4xl mx-auto'} gap-8`}>
          {filteredLines.map(([key, line], index) => {
            const activeDayKey = activeDays[key];
            const schedule = line.schedules[activeDayKey];
            
            const firstTrainStart = line.weekday.firstTrain.from_start;
            const lastTrainEnd = line.weekday.lastTrain.from_end;
            const peakFreq = line.weekday.peakFrequency;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-[36px] border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Colored Accent Bar */}
                <div 
                  className="absolute top-0 inset-x-0 h-1.5" 
                  style={{ backgroundColor: line.color }} 
                />

                <div className="space-y-6 pt-2">
                  
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: line.color }} 
                        />
                        <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white tracking-tight">
                          {line.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {line.route}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
                      {line.stations} Stations
                    </span>
                  </div>

                  {/* Summary Highlights Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-950/80 rounded-2xl border border-gray-200/60 dark:border-gray-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">First Train</span>
                      <div className="text-sm sm:text-base font-bold mt-1" style={{ color: line.color }}>{firstTrainStart}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-950/80 rounded-2xl border border-gray-200/60 dark:border-gray-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Last Train</span>
                      <div className="text-sm sm:text-base font-bold mt-1" style={{ color: line.color }}>{lastTrainEnd}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-950/80 rounded-2xl border border-gray-200/60 dark:border-gray-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Peak Freq</span>
                      <div className="text-sm sm:text-base font-bold mt-1" style={{ color: line.color }}>{peakFreq}</div>
                    </div>
                  </div>

                  {/* Schedule Selection Tabs (Clean Pill Buttons, NO horizontal scroll) */}
                  <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-gray-200 dark:border-gray-800">
                    {Object.keys(line.schedules).map((dayKey) => {
                      const daySchedule = line.schedules[dayKey];
                      const isActive = activeDayKey === dayKey;
                      const dayTitle = daySchedule.title.split(' (')[0];
                      return (
                        <button
                          key={dayKey}
                          onClick={() => handleDayChange(key, dayKey)}
                          style={isActive ? { backgroundColor: line.color, color: '#ffffff' } : {}}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            isActive
                              ? 'shadow-md border-transparent text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {dayTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* Frequency Schedule Tables */}
                  {schedule && (
                    <div className="space-y-4 pt-1">
                      {(() => {
                        const terminals = line.route.split(' ↔ ');
                        const termA = terminals[0]?.trim() || 'Terminal A';
                        const termB = terminals[1]?.trim() || 'Terminal B';

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            
                            {/* Direction A */}
                            <div className="space-y-2.5">
                              <div className="text-xs uppercase font-bold text-gray-800 dark:text-gray-200 tracking-wide py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-750 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                                <span className="leading-tight">From {termB}</span>
                              </div>
                              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                {schedule.from_start.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-mono font-medium">{item.range}</span>
                                    <span 
                                      className="px-2.5 py-0.5 rounded-md font-bold text-[11px] tracking-wide"
                                      style={{ backgroundColor: `${line.color}18`, color: line.color }}
                                    >
                                      {item.frequency}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Direction B */}
                            <div className="space-y-2.5">
                              <div className="text-xs uppercase font-bold text-gray-800 dark:text-gray-200 tracking-wide py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-750 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                                <span className="leading-tight">From {termA}</span>
                              </div>
                              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                {schedule.from_end.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-mono font-medium">{item.range}</span>
                                    <span 
                                      className="px-2.5 py-0.5 rounded-md font-bold text-[11px] tracking-wide"
                                      style={{ backgroundColor: `${line.color}18`, color: line.color }}
                                    >
                                      {item.frequency}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>

                {/* Line Notes Advisory */}
                {line.notes && line.notes.length > 0 && (
                  <div className="pt-2">
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Info className="w-4 h-4 shrink-0" style={{ color: line.color }} />
                        <span className="text-[11px] font-black uppercase tracking-wider">Line Advisory</span>
                      </div>
                      <ul className="list-disc pl-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {line.notes.map((note, idx) => (
                          <li key={idx} className="leading-relaxed">{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </motion.div>
            );
          })}
        </div>

        {/* Global Operational Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-[36px] border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm"
        >
          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-emerald-500" />
            <span>Bengaluru Metro Peak vs Off-Peak Operations</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Bengaluru Metro (BMRCL) adjusts train frequency dynamically based on rush-hour commuter density. During peak office travel hours, trains depart as frequently as every 3 to 5 minutes on high-traffic sections like Majestic, MG Road, and Indiranagar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200/80 dark:border-gray-800 space-y-2">
              <h4 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Peak Hours (Mon - Fri)</span>
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                08:00 AM – 11:30 AM & 05:00 PM – 08:30 PM. Maximum operational capacity with reduced headway intervals to serve tech park and central business district commuters.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200/80 dark:border-gray-800 space-y-2">
              <h4 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Weekend & Public Holidays</span>
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Sunday services begin strictly at 07:00 AM across all corridors. Saturday trains run extra evening trips matching retail and leisure travel demand.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

