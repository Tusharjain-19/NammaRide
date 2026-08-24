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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
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
            className={`px-6 py-3 rounded-none text-xs font-black uppercase tracking-wider transition-all border ${
              selectedLineFilter === 'all'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:border-emerald-500/50'
            }`}
          >
            All Lines (3)
          </button>
          <button
            onClick={() => setSelectedLineFilter('purple')}
            className={`px-6 py-3 rounded-none text-xs font-black uppercase tracking-wider transition-all border ${
              selectedLineFilter === 'purple'
                ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-md'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:border-purple-500/50'
            }`}
          >
            Purple Line
          </button>
          <button
            onClick={() => setSelectedLineFilter('green')}
            className={`px-6 py-3 rounded-none text-xs font-black uppercase tracking-wider transition-all border ${
              selectedLineFilter === 'green'
                ? 'bg-[#10B981] text-white border-[#10B981] shadow-md'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:border-emerald-500/50'
            }`}
          >
            Green Line
          </button>
          <button
            onClick={() => setSelectedLineFilter('yellow')}
            className={`px-6 py-3 rounded-none text-xs font-black uppercase tracking-wider transition-all border ${
              selectedLineFilter === 'yellow'
                ? 'bg-[#EAB308] text-white border-[#EAB308] shadow-md'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:border-yellow-500/50'
            }`}
          >
            Yellow Line
          </button>
        </motion.div>

        {/* TIMING CARDS GRID */}
        <div className={`grid grid-cols-1 ${selectedLineFilter === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-4xl mx-auto'} gap-8 items-stretch`}>
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
                className="bg-white dark:bg-black p-6 sm:p-7 rounded-none border border-gray-200 dark:border-neutral-800 flex flex-col justify-between space-y-6 shadow-sm hover:border-gray-300 dark:hover:border-neutral-700 transition-all duration-300 relative overflow-hidden h-full"
              >
                {/* Top Colored Accent Line */}
                <div 
                  className="absolute top-0 inset-x-0 h-1" 
                  style={{ backgroundColor: line.color }} 
                />

                <div className="space-y-6 pt-1 flex-grow flex flex-col justify-between">
                  
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 min-h-[56px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-none shrink-0" 
                          style={{ backgroundColor: line.color }} 
                        />
                        <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white tracking-tight">
                          {line.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {line.route}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-none bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-[11px] font-bold text-gray-700 dark:text-gray-300 shrink-0">
                      {line.stations} Stations
                    </span>
                  </div>

                  {/* Summary Highlights Cards (Uniform Heights) */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900/90 rounded-none border border-gray-200 dark:border-neutral-800 text-center flex flex-col justify-center h-16">
                      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider block">First Train</span>
                      <div className="text-sm font-black mt-0.5 whitespace-nowrap" style={{ color: line.color }}>{firstTrainStart}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900/90 rounded-none border border-gray-200 dark:border-neutral-800 text-center flex flex-col justify-center h-16">
                      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider block">Last Train</span>
                      <div className="text-sm font-black mt-0.5 whitespace-nowrap" style={{ color: line.color }}>{lastTrainEnd}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900/90 rounded-none border border-gray-200 dark:border-neutral-800 text-center flex flex-col justify-center h-16">
                      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider block">Peak Freq</span>
                      <div className="text-sm font-black mt-0.5 whitespace-nowrap" style={{ color: line.color }}>{peakFreq}</div>
                    </div>
                  </div>

                  {/* Schedule Selection Tabs (Rectangular Uniform Buttons) */}
                  <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-gray-200 dark:border-neutral-800">
                    {Object.keys(line.schedules).map((dayKey) => {
                      const daySchedule = line.schedules[dayKey];
                      const isActive = activeDayKey === dayKey;
                      const dayTitle = daySchedule.title.split(' (')[0];
                      return (
                        <button
                          key={dayKey}
                          onClick={() => handleDayChange(key, dayKey)}
                          style={isActive ? { backgroundColor: line.color, color: '#ffffff' } : {}}
                          className={`px-3 py-2 rounded-none text-[11px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                            isActive
                              ? 'border-transparent text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-800'
                          }`}
                        >
                          {dayTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* Frequency Schedule Tables */}
                  {schedule && (
                    <div className="space-y-4 pt-1 flex-grow">
                      {(() => {
                        const terminals = line.route.split(' ↔ ');
                        const termA = terminals[0]?.trim() || 'Terminal A';
                        const termB = terminals[1]?.trim() || 'Terminal B';

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                            
                            {/* Direction A */}
                            <div className="space-y-2">
                              <div className="text-xs uppercase font-black text-gray-800 dark:text-gray-200 tracking-wider p-2.5 rounded-none bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center gap-2 min-h-[44px]">
                                <span className="w-2.5 h-2.5 rounded-none shrink-0" style={{ backgroundColor: line.color }} />
                                <span className="leading-tight truncate">From {termB}</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-neutral-900 border-t border-b border-gray-100 dark:border-neutral-900">
                                {schedule.from_start.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-2 text-xs h-9 gap-2">
                                    <span className="text-gray-700 dark:text-gray-300 font-mono font-bold whitespace-nowrap shrink-0">
                                      {item.range.replace('-', '–')}
                                    </span>
                                    <span 
                                      className="px-2.5 py-1 rounded-none font-extrabold text-[11px] tracking-wide whitespace-nowrap shrink-0 text-center min-w-[72px]"
                                      style={{ backgroundColor: `${line.color}15`, color: line.color, border: `1px solid ${line.color}30` }}
                                    >
                                      {item.frequency.replace('-', '–')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Direction B */}
                            <div className="space-y-2">
                              <div className="text-xs uppercase font-black text-gray-800 dark:text-gray-200 tracking-wider p-2.5 rounded-none bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center gap-2 min-h-[44px]">
                                <span className="w-2.5 h-2.5 rounded-none shrink-0" style={{ backgroundColor: line.color }} />
                                <span className="leading-tight truncate">From {termA}</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-neutral-900 border-t border-b border-gray-100 dark:border-neutral-900">
                                {schedule.from_end.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-2 text-xs h-9 gap-2">
                                    <span className="text-gray-700 dark:text-gray-300 font-mono font-bold whitespace-nowrap shrink-0">
                                      {item.range.replace('-', '–')}
                                    </span>
                                    <span 
                                      className="px-2.5 py-1 rounded-none font-extrabold text-[11px] tracking-wide whitespace-nowrap shrink-0 text-center min-w-[72px]"
                                      style={{ backgroundColor: `${line.color}15`, color: line.color, border: `1px solid ${line.color}30` }}
                                    >
                                      {item.frequency.replace('-', '–')}
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
                    <div className="p-4 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-none space-y-2">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
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
          className="bg-white dark:bg-black p-8 sm:p-10 rounded-none border border-gray-200 dark:border-neutral-800 space-y-6 shadow-sm"
        >
          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-emerald-500" />
            <span>Bengaluru Metro Peak vs Off-Peak Operations</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Bengaluru Metro (BMRCL) adjusts train frequency dynamically based on rush-hour commuter density. During peak office travel hours, trains depart as frequently as every 3 to 5 minutes on high-traffic sections like Majestic, MG Road, and Indiranagar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-none bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 space-y-2">
              <h4 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Peak Hours (Mon - Fri)</span>
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                08:00 AM – 11:30 AM & 05:00 PM – 08:30 PM. Maximum operational capacity with reduced headway intervals to serve tech park and central business district commuters.
              </p>
            </div>
            <div className="p-6 rounded-none bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 space-y-2">
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

