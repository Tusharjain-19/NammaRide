import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Monitor, RefreshCw, ExternalLink, Download, Zap, Navigation, MapPin, Clock, Compass, ShieldCheck, Phone, ArrowRight, Wifi, WifiOff, BatteryCharging, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import googlePlaySvg from '../../assets/images/google play.svg';
import { useTheme } from '../context/ThemeContext';

const appTabs = [
  {
    id: 'planner',
    label: 'Journey Planner',
    icon: <Navigation className="w-5 h-5" />,
    description: 'Plan routes between any two Bengaluru Metro stations with real-time fare estimates, travel duration, interchange guidance, and platform directions. The algorithm calculates the optimal path across Purple, Green, and Yellow lines.',
    nativeBenefit: 'GPS-Powered Nearest Station Detection',
    features: ['Multi-line interchange routing', 'Real-time fare calculation', 'Platform & exit gate directions', 'Offline route cache']
  },
  {
    id: 'stations',
    label: 'Metro Stations',
    icon: <MapPin className="w-5 h-5" />,
    description: 'Browse all 83 stations across 3 metro lines with detailed information including accessibility features, nearby landmarks, exit gates, ATM locations, and real-time crowd levels.',
    nativeBenefit: 'Location-Based Station Proximity Alerts',
    features: ['83 stations with full details', 'Accessibility & facility info', 'Exit gate navigation', 'Nearby landmark discovery']
  },
  {
    id: 'timings',
    label: 'Metro Timings',
    icon: <Clock className="w-5 h-5" />,
    description: 'Check first and last train schedules, peak vs off-peak frequency data, and Sunday/holiday special timetables for all BMRCL metro lines. Never miss a train again.',
    nativeBenefit: 'Smart Notification for Last Train Alerts',
    features: ['First & last train times', 'Peak/off-peak frequencies', 'Sunday schedule toggle', 'Holiday special timetables']
  },
  {
    id: 'explore',
    label: 'Explore Bengaluru',
    icon: <Compass className="w-5 h-5" />,
    description: 'Discover tech parks, shopping malls, heritage sites, cafes, and nightlife spots directly connected to metro stations. Each landmark includes walking distance, nearest exit gate, and user ratings.',
    nativeBenefit: 'Geo-Fenced Landmark Recommendations',
    features: ['Categorized city landmarks', 'Walking distance & time', 'Exit gate directions', 'User ratings & reviews']
  },
  {
    id: 'safety',
    label: 'Safety & Helpline',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'Features direct dialing buttons for BMRCL safety control rooms, metro police stations, ambulance networks, and women\'s safety helplines. The Play Store app supports direct system dialer triggers for emergency calls even in offline scenarios.',
    nativeBenefit: 'One-Tap Direct Dial System Integration',
    features: ['BMRCL control room hotline', 'Metro police contact', 'Women\'s safety helpline', 'Emergency ambulance access']
  }
];

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('planner');
  const iframeRef = useRef(null);
  const { theme } = useTheme();

  // Sync theme to simulator iframe when theme changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_THEME_CHANGED', theme: theme }, '*');
      } catch (e) {
        // Safe fallback
      }
    }
  }, [theme]);

  // Sync state from iframe view updates (e.g. clicking bottom navigation inside mockup)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NAMMARIDE_VIEW_CHANGED') {
        const view = event.data.view;
        const tabId = view === 'plan' ? 'planner' : view;
        setActiveTab(tabId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const viewName = tabId === 'planner' ? 'plan' : tabId;
      try {
        if (typeof iframeRef.current.contentWindow.navigateToView === 'function') {
          iframeRef.current.contentWindow.navigateToView(viewName);
        }
      } catch (e) {
        // Safe fallback if iframe is cross-origin or not loaded
      }
    }
  };

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const viewName = activeTab === 'planner' ? 'plan' : activeTab;
      try {
        if (typeof iframeRef.current.contentWindow.navigateToView === 'function') {
          iframeRef.current.contentWindow.navigateToView(viewName);
        }
        // Send theme configuration
        iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_THEME_CHANGED', theme: theme }, '*');
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const currentTab = appTabs.find(t => t.id === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const renderFeatureExploration = () => {
    return (
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            How App Tabs Work on Google Play
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click any feature below to interact with it in the simulator and explore its native Android capabilities.
          </p>
        </motion.div>

        {/* Feature Cards List with stagger slide-in animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-4"
        >
          {appTabs.map((tab) => {
            const isExpanded = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabSelect(tab.id);
                }}
                className={`cursor-pointer rounded-3xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-white dark:bg-gray-900 border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                    : 'bg-white/60 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm'
                }`}
              >
                <div className="p-6 flex items-start gap-4 select-none">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors border ${
                    isExpanded
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {tab.icon}
                  </div>

                  {/* Header & Tagline */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">{tab.label}</h3>
                      {isExpanded && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 animate-pulse">
                          Active Tab
                        </span>
                      )}
                    </div>
                    
                    {!isExpanded && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">
                        {tab.description.slice(0, 80)}...
                      </p>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-5"
                      >
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {tab.description}
                        </p>

                        {/* Native Benefit Badge */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-400 mb-0.5">
                              Native Play Store Benefit
                            </p>
                            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                              {tab.nativeBenefit}
                            </p>
                          </div>
                        </div>

                        {/* Key Capabilities */}
                        <div className="space-y-2.5 pt-2">
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Key Capabilities
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {tab.features.map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                              >
                                <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-black min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Live Web App Simulation
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            NammaRide Web Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            Test the core transit utility directly in your browser. Check routes, ticket rates, and station directions inside our smartphone mockup interface.
          </p>
        </motion.div>

        {/* Always Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Phone simulator with entry scroll animation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
              className="w-[300px] h-[600px] sm:w-[330px] sm:h-[650px] bg-gray-900 dark:bg-black rounded-[48px] p-2 relative shadow-[0_30px_50px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.9)] flex flex-col ring-1 ring-gray-200/50 dark:ring-neutral-800 transition-all duration-300"
            >
              {/* Power / Volume Buttons */}
              <div className="absolute top-28 -right-1 w-1 h-14 bg-gray-300 dark:bg-neutral-800 rounded-r-md"></div>
              <div className="absolute top-48 -right-1 w-1 h-20 bg-gray-300 dark:bg-neutral-800 rounded-r-md"></div>
              <div className="absolute top-28 -left-1 w-1 h-10 bg-gray-300 dark:bg-neutral-800 rounded-l-md"></div>

              {/* Screen Content Wrapper */}
              <div className="flex-grow relative bg-gray-100 dark:bg-black flex flex-col overflow-hidden rounded-[38px] shadow-inner border border-gray-200 dark:border-neutral-800">
                <iframe
                  ref={iframeRef}
                  src="/simulator/index.html"
                  title="NammaRide Mobile App Simulator"
                  className="w-full h-full border-0 rounded-[38px] bg-white dark:bg-black pointer-events-auto"
                  onLoad={handleIframeLoad}
                />

                {/* Bottom indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-32 bg-gray-400/50 dark:bg-gray-500/50 rounded-full z-40 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed feature explanations */}
          <div className="lg:col-span-7">
            {renderFeatureExploration()}
          </div>

        </div>

        {/* Native App Banner featuring QR Code Scan & Big Play Store Download */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[36px] p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Left: App Highlights & Download Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                  <WifiOff className="w-4 h-4 text-emerald-500" />
                  <span>100% Offline Android Engine</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span>Battery Saver</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900 dark:text-white font-heading font-black text-2xl sm:text-4xl tracking-tight leading-tight">
                  Ready for the Full Offline Experience?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                  Download the official NammaRide app from Google Play or scan the QR code to unlock continuous location proximity alerts, platform interchange guidance, and offline route calculations across Purple, Green, and Yellow lines.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Instant Station Fare Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Exit Gate & ATM Directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Divyangjan Ramps & Elevators</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>0 KB Personal Data Tracking</span>
                </div>
              </div>

              {/* BIG GOOGLE PLAY BUTTON WITHOUT OUTER WRAPPER BOX */}
              <div className="pt-2">
                <a
                  href="https://play.google.com/store/apps/details?id=site.nammaride.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform hover:scale-105 active:scale-95 drop-shadow-lg"
                >
                  <img src={googlePlaySvg} alt="Get it on Google Play" className="h-14 sm:h-16 w-auto object-contain" />
                </a>
              </div>
            </div>

            {/* Right: Scan QR Code (Clean & Borderless) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-md">
                <img 
                  src="/assets/images/nammaride_qr.png" 
                  alt="Scan QR Code to Download NammaRide App" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl" 
                />
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Scan QR Code to Install App
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
