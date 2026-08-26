import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Zap, Navigation, MapPin, QrCode, Clock, Compass, ShieldCheck, ChevronRight, CheckCircle2, ChevronDown, Smartphone, Sparkles, ArrowRight, Shield, Globe, Lock, WifiOff, Accessibility, Phone, XCircle, AlertTriangle, Search, Menu, Filter, ArrowDownUp, Route, Star, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import BengaluruMetroGuide from '../components/BengaluruMetroGuide';
import GooglePreferredSourceCard from '../components/GooglePreferredSourceCard';
import googlePlayImg from '../../assets/images/google play.svg';

function HeroSimulation() {
  const [activeStep, setActiveStep] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Real app color tokens synced to website theme
  const t = {
    bg: isLight ? '#F0F4F8' : '#000000',
    card: isLight ? 'rgba(255,255,255,0.75)' : 'rgba(18,18,22,0.65)',
    cardSolid: isLight ? '#FFFFFF' : '#12121A',
    text: isLight ? '#0F172A' : '#F8FAFC',
    textSec: isLight ? '#475569' : '#A1A1AA',
    border: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
    inputBg: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(12,12,16,0.7)',
    accent: '#10B981',
  };

  // Bottom Nav (matches real app: Plan, Stations, Timings, Explore, Safety)
  const navTabs = [
    { icon: <Route className="w-[18px] h-[18px]" />, label: 'Plan', frame: 0 },
    { icon: <MapPin className="w-[18px] h-[18px]" />, label: 'Stations', frame: -1 },
    { icon: <Clock className="w-[18px] h-[18px]" />, label: 'Timings', frame: 3 },
    { icon: <Compass className="w-[18px] h-[18px]" />, label: 'Explore', frame: 2 },
    { icon: <ShieldCheck className="w-[18px] h-[18px]" />, label: 'Safety', frame: -1 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ background: t.bg, transition: 'background 0.4s ease' }}>

      {/* ─── App Header Bar ─── */}
      <div className="absolute top-0 inset-x-0 z-30 flex justify-between items-center px-4 py-3" style={{ background: isLight ? 'rgba(240,244,248,0.85)' : 'rgba(0,0,0,0.75)', borderBottom: `1px solid ${t.border}`, backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2">
          <img src="/simulator/assets/images/logo_app.png" alt="NammaRide" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm tracking-tight" style={{ color: t.text }}>NammaRide</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: t.card, border: `1px solid ${t.border}` }}>
            {isLight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </div>
          <div className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ background: t.card, border: `1px solid ${t.border}`, color: t.textSec }}>EN</div>
        </div>
      </div>

      {/* ─── FRAME 0: Plan Trip (the main screen) ─── */}
      <div className={`absolute inset-0 pt-14 pb-16 px-5 flex flex-col transition-opacity duration-700 ${activeStep === 0 ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
        <div className="flex-grow flex flex-col pt-4 max-w-full">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6 leading-tight" style={{ color: t.text }}>Where to go<br/>today?</h2>
          
          {/* Station Inputs */}
          <div className="relative flex flex-col gap-4 mb-5">
            {/* Origin */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: t.inputBg, border: `1px solid ${t.border}` }}>
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] shrink-0"></span>
              <span className="text-sm font-medium" style={{ color: t.text }}>Attiguppe</span>
            </div>
            {/* Swap */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-10">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: t.cardSolid, border: `1px solid ${t.border}` }}>
                <ArrowDownUp className="w-4 h-4" style={{ color: t.textSec }} />
              </div>
            </div>
            {/* Destination */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: t.inputBg, border: `1px solid ${t.border}` }}>
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0"></span>
              <span className="text-sm font-medium animate-pulse" style={{ color: t.textSec }}>Select destination...</span>
            </div>
          </div>

          {/* Journey Summary Hint */}
          <div className="p-3.5 rounded-xl mb-5 text-center" style={{ background: t.card, border: `1px solid ${t.border}` }}>
            <span className="text-xs font-medium" style={{ color: t.textSec }}>Select stations to see the fastest route.</span>
          </div>

          {/* I am at... Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: isLight ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: t.text }}>I am at...</div>
                <div className="text-[10px] font-medium" style={{ color: t.textSec }}>Find nearest station & navigate</div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="mt-auto pt-4">
            <p className="text-center text-[9px] font-medium" style={{ color: t.textSec, opacity: 0.6 }}>Disclaimer: Timings and fare are estimates.</p>
          </div>
        </div>
      </div>

      {/* ─── FRAME 1: Route Result ─── */}
      <div className={`absolute inset-0 pt-14 pb-16 px-5 flex flex-col transition-opacity duration-700 overflow-hidden ${activeStep === 1 ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
        <div className="flex-grow flex flex-col pt-3">
          {/* Trip Summary Card */}
          <div className="p-5 rounded-3xl mb-4 shadow-lg" style={{ background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(20px)' }}>
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: t.textSec }}>Total Time</p>
                <h3 className="text-3xl font-black" style={{ color: t.text }}>57 min</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: t.textSec }}>Est. Fare</p>
                <h3 className="text-3xl font-black text-emerald-500">₹90</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl text-[11px] font-medium" style={{ background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', color: t.textSec }}>
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Next Train: 03:05 PM (Platform 2)</span>
            </div>
          </div>

          {/* Route Timeline */}
          <div className="relative pl-7 space-y-7 flex-grow">
            <div className="absolute top-2 bottom-2 left-[11px] w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, #A855F7, #A855F7 45%, #10B981 55%, #10B981)' }}></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-4 h-4 rounded-full border-[3px] border-purple-500 -ml-[23px] shadow-[0_0_10px_rgba(168,85,247,0.6)]" style={{ background: t.bg }}></div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: t.text }}>Attiguppe</h4>
                <p className="text-[10px]" style={{ color: t.textSec }}>Board Platform 2 · Purple Line</p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-4 h-4 rounded-full border-[3px] -ml-[23px]" style={{ borderColor: t.textSec, background: t.bg }}></div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: t.text }}>Majestic</h4>
                <p className="text-[10px] text-amber-500 font-semibold">⇌ Change to Green Line</p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-4 h-4 rounded-full border-[3px] border-emerald-500 -ml-[23px] shadow-[0_0_10px_rgba(16,185,129,0.6)]" style={{ background: t.bg }}></div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: t.text }}>Yelachenahalli</h4>
                <p className="text-[10px]" style={{ color: t.textSec }}>Destination · Green Line</p>
              </div>
            </div>
          </div>

          {/* QR Ticket Floating Button */}
          <div className="flex justify-end mt-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold" style={{ background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(20px)' }}>
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span style={{ color: t.text }}>QR Ticket</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FRAME 2: Explore Screen ─── */}
      <div className={`absolute inset-0 pt-14 pb-16 px-5 flex flex-col transition-opacity duration-700 overflow-hidden ${activeStep === 2 ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
        <div className="flex-grow flex flex-col pt-3">
          <h2 className="text-xl font-extrabold tracking-tight mb-1" style={{ color: t.text }}>Explore Bengaluru</h2>
          <p className="text-[10px] font-medium mb-4 flex items-center gap-1.5" style={{ color: t.accent }}>
            <Compass className="w-3 h-3" /> Discover nearby landmarks
          </p>

          {/* Category Pills */}
          <div className="flex gap-2 mb-4 overflow-hidden">
            {['All', 'Tech Hubs', 'Shopping', 'Heritage'].map((cat, i) => (
              <span key={cat} className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0" style={{
                background: i === 0 ? t.accent : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'),
                color: i === 0 ? '#fff' : t.textSec,
                border: i === 0 ? 'none' : `1px solid ${t.border}`,
              }}>{cat}</span>
            ))}
          </div>

          {/* Explore Cards */}
          <div className="space-y-3 flex-grow">
            {[
              { name: 'Orion Mall', station: 'Sandal Soap Factory', line: 'Green Line', dist: '300m', lineColor: '#10B981' },
              { name: 'Vidhana Soudha', station: 'Dr. B.R. Ambedkar Stn.', line: 'Purple Line', dist: '150m', lineColor: '#A855F7' },
            ].map((place) => (
              <div key={place.name} className="p-4 rounded-2xl" style={{ background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase" style={{ background: `${place.lineColor}15`, color: place.lineColor, border: `1px solid ${place.lineColor}30` }}>{place.line}</span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> 4.5
                  </div>
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: t.text }}>{place.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: t.accent }}>
                  <MapPin className="w-3 h-3" />
                  <span>{place.station}</span>
                  <span style={{ color: t.textSec }}>· {place.dist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FRAME 3: Timings Screen ─── */}
      <div className={`absolute inset-0 pt-14 pb-16 px-5 flex flex-col transition-opacity duration-700 overflow-hidden ${activeStep === 3 ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
        <div className="flex-grow flex flex-col pt-3">
          <h2 className="text-xl font-extrabold tracking-tight mb-1" style={{ color: t.text }}>Train Timings</h2>
          <p className="text-[10px] font-medium mb-4" style={{ color: t.textSec }}>First & last train schedule for all lines</p>

          {/* Line Selector Pills */}
          <div className="flex gap-2 mb-4">
            {[{ name: 'Purple', color: '#A855F7', active: true }, { name: 'Green', color: '#10B981' }, { name: 'Yellow', color: '#EAB308' }].map((line) => (
              <span key={line.name} className="px-3.5 py-1.5 rounded-full text-[10px] font-bold" style={{
                background: line.active ? line.color : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'),
                color: line.active ? '#fff' : t.textSec,
                border: line.active ? 'none' : `1px solid ${t.border}`,
              }}>{line.name} Line</span>
            ))}
          </div>

          {/* Mini Timetable */}
          <div className="rounded-2xl overflow-hidden" style={{ background: t.card, border: `1px solid ${t.border}` }}>
            {/* Table Header */}
            <div className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wider px-4 py-2.5" style={{ background: isLight ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.15)', color: '#A855F7' }}>
              <span>Station</span>
              <span className="text-center">First</span>
              <span className="text-right">Last</span>
            </div>
            {/* Rows */}
            {[
              { name: 'Whitefield', first: '05:00', last: '23:00' },
              { name: 'Majestic', first: '05:00', last: '23:05' },
              { name: 'Mysuru Road', first: '05:12', last: '23:10' },
              { name: 'Kengeri', first: '05:00', last: '23:00' },
            ].map((row, i) => (
              <div key={row.name} className="grid grid-cols-3 px-4 py-2.5 text-[11px]" style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? 'transparent' : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)') }}>
                <span className="font-semibold truncate pr-1" style={{ color: t.text }}>{row.name}</span>
                <span className="text-center font-mono font-medium" style={{ color: t.textSec }}>{row.first}</span>
                <span className="text-right font-mono font-medium" style={{ color: t.textSec }}>{row.last}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3">
            <p className="text-center text-[9px]" style={{ color: t.textSec, opacity: 0.5 }}>Weekday schedule · BMRCL 2025</p>
          </div>
        </div>
      </div>

      {/* ─── Bottom Navigation Bar (matches real app) ─── */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex items-center justify-around px-1 pt-2 pb-4" style={{ background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.92)', borderTop: `1px solid ${t.border}`, backdropFilter: 'blur(20px)' }}>
        {navTabs.map((tab) => {
          const isActive = tab.frame === activeStep;
          return (
            <div key={tab.label} className="flex flex-col items-center gap-0.5" style={{ color: isActive ? t.accent : t.textSec }}>
              {tab.icon}
              <span className="text-[9px] font-semibold" style={{ color: isActive ? t.accent : t.textSec }}>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {/* Android bottom nav indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 rounded-full z-40" style={{ background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)' }}></div>
    </div>
  );
}

export default function HomePage() {
  const { lang, t } = useLanguage();

  const usps = [
    { feature: '100% Offline Mode', nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Offline</span>, bmrcl: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No (Needs Net)</span>, google: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No (Needs Net)</span> },
    { feature: 'Privacy (No Location Tracking)', nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Tracking</span>, bmrcl: <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Possible Tracking</span>, google: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> Tracks Location</span> },
    { feature: 'Local POI & Tech Parks Guide', nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 50+ Verified Hubs</span>, bmrcl: <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Limited</span>, google: <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Generic</span> },
    { feature: <span className="flex items-center gap-1.5"><Accessibility className="w-4 h-4 text-emerald-500" /> Accessibility Details (Lifts/Ramps)</span>, nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detailed Counts</span>, bmrcl: <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Basic</span>, google: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No</span> },
    { feature: 'Smart Card 10% Savings Calculator', nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Optimized</span>, bmrcl: <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Basic</span>, google: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No</span> },
    { feature: 'Turnstile QR Code Storage', nammaride: <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Brightness</span>, bmrcl: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No</span>, google: <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> No</span> }
  ];

  const features = [
    {
      icon: <Navigation className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: 'Smart Route Planner',
      description: 'Calculates the fastest metro route, platform interchanges, trip duration, and intermediate stations.',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 border-emerald-500/20 dark:border-emerald-500/40',
      color: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/30'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      title: 'Live Fare Calculator',
      description: 'Know your exact ticket price before you travel — from ₹10 to ₹90 across all stations, with 10% Smart Card savings shown instantly.',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 border-amber-500/20 dark:border-amber-500/40',
      color: 'from-amber-500/20 to-yellow-500/5',
      border: 'border-amber-500/30'
    },
    {
      icon: <QrCode className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      title: 'QR Ticket at Your Fingertips',
      description: 'Save your WhatsApp or BMRCL QR ticket inside the app. Walk up to the turnstile, scan instantly at max brightness — no fumbling.',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 border-purple-500/20 dark:border-purple-500/40',
      color: 'from-purple-500/20 to-indigo-500/5',
      border: 'border-purple-500/30'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: 'Never Miss Your Train',
      description: 'Check first train (5:30 AM) and last train (11:45 PM) schedules for every station. Plan your morning or late-night commute with confidence.',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 border-blue-500/20 dark:border-blue-500/40',
      color: 'from-blue-500/20 to-cyan-500/5',
      border: 'border-blue-500/30'
    },
    {
      icon: <Smartphone className="w-6 h-6 text-pink-500 dark:text-pink-400" />,
      title: 'Works Underground, Always',
      description: 'No internet? No problem. NammaRide works perfectly in metro tunnels, basements, and anywhere without Wi-Fi or mobile data.',
      iconBg: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-500 border-pink-500/20 dark:border-pink-500/40',
      color: 'from-pink-500/20 to-rose-500/5',
      border: 'border-pink-500/30'
    },
    {
      icon: <Compass className="w-6 h-6 text-teal-500 dark:text-teal-400" />,
      title: 'Discover What\'s Nearby',
      description: 'Find the best tech parks, cafes, malls, and tourist spots within walking distance of every metro station.',
      iconBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-500 border-teal-500/20 dark:border-teal-500/40',
      color: 'from-teal-500/20 to-emerald-500/5',
      border: 'border-teal-500/30'
    }
  ];
  return (
    <div className="min-h-screen pt-32 flex flex-col relative overflow-x-hidden">
      
{/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pb-section-gap px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-container-max 3xl:max-w-[1800px] mx-auto w-full"
      >
        <div className="grid grid-cols-12 gap-gutter-desktop items-center">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7 flex flex-col gap-8 pr-0 md:pr-8"
          >
            <div className="flex flex-col gap-4">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-3.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full font-label-sm text-xs font-bold w-max uppercase tracking-widest border border-emerald-500/20 shadow-xs"
              >
                {t('tagline')}
              </motion.span>
              
              <h1 className="font-display-xl text-[36px] sm:text-display-xl 2xl:text-7xl 3xl:text-8xl text-gray-900 dark:text-white leading-tight tracking-tight">
                {t('heroTitle1')}{' '}
                <span className="text-emerald-500 relative inline-block">
                  {t('heroTitleHighlight')}
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 opacity-50 z-[-1]" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="4"></path>
                  </svg>
                </span>
                , {t('heroTitle2')}
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-body-lg text-base sm:text-body-lg 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-2xl 2xl:max-w-3xl leading-relaxed"
              >
                {t('heroDesc')}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 items-center mt-2"
            >
              <a
                href="https://play.google.com/store/apps/details?id=site.nammaride.app"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 drop-shadow-md"
              >
                <img src={googlePlayImg} alt="Get it on Google Play" className="h-12 w-auto object-contain" />
              </a>
              <Link
                to="/simulator"
                className="h-12 px-6 rounded-[14px] light-glass-card text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105"
              >
                <Zap className="w-4.5 h-4.5 text-emerald-500" />
                <span>{t('simulator')}</span>
              </Link>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
            >
              <p className="font-label-sm text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">{t('all3Lines')}</p>
              <div className="flex flex-wrap gap-4">
                <div className="light-glass-card rounded-full px-4 py-2 flex items-center gap-3 border-l-4 border-l-purple-line shadow-xs">
                  <span className="w-3 h-3 rounded-full bg-purple-line"></span>
                  <span className="font-label-lg text-xs font-bold text-gray-900 dark:text-white">{t('purpleLine')}</span>
                </div>
                <div className="light-glass-card rounded-full px-4 py-2 flex items-center gap-3 border-l-4 border-l-emerald-500 shadow-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="font-label-lg text-xs font-bold text-gray-900 dark:text-white">{t('greenLine')}</span>
                </div>
                <div className="light-glass-card rounded-full px-4 py-2 flex items-center gap-3 border-l-4 border-l-yellow-line shadow-xs">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="font-label-lg text-xs font-bold text-gray-900 dark:text-white">{t('yellowLine')}</span>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Android Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="col-span-12 md:col-span-5 flex flex-col items-center justify-center mt-12 md:mt-0 relative select-none"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-purple-500/10 rounded-[3rem] transform rotate-3 scale-105 border border-white/20 shadow-sm z-0 blur-xl"></div>
            
            {/* Phone shell */}
            <div className="w-[280px] h-[560px] sm:w-[330px] sm:h-[650px] 2xl:w-[380px] 2xl:h-[750px] 3xl:w-[410px] 3xl:h-[810px] bg-gray-950 rounded-[48px] p-2 relative shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.9)] flex flex-col ring-1 ring-gray-800/80 transition-all duration-300">
              
              {/* Power / Volume Buttons */}
              <div className="absolute top-28 -right-1 w-1 h-14 bg-gray-800 rounded-r-md"></div>
              <div className="absolute top-48 -right-1 w-1 h-20 bg-gray-800 rounded-r-md"></div>
              <div className="absolute top-28 -left-1 w-1 h-10 bg-gray-800 rounded-l-md"></div>

              {/* Screen Content Wrapper */}
              <div className="flex-grow relative bg-[#0B0F19] flex flex-col overflow-hidden rounded-[38px] shadow-inner border border-gray-900/50">

                {/* Animated Simulation Content Here */}
                <HeroSimulation />

                {/* Android Bottom Nav Bar indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-32 bg-gray-500/50 rounded-full z-40 pointer-events-none"></div>
              </div>
            </div>
            {/* Feature Label below phone */}
            <div className="mt-4 text-center z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 px-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Live Simulation Running</span>
            </div>

          </motion.div>
        </div>
      </motion.section>

      {/* PRD USPs COMPARISON TABLE */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full"
      >
        <div className="light-glass-card p-8 rounded-[36px] space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="font-headline-lg text-headline-lg font-bold text-gray-900 dark:text-white">{t('whyCommutersSwitched')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('whyCommutersDesc')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 uppercase font-mono text-xs">
                  <th className="py-3 px-4">{t('feature')}</th>
                  <th className="py-3 px-4 text-emerald-accent font-bold">{t('nammaride')}</th>
                  <th className="py-3 px-4">{t('bmrclOfficial')}</th>
                  <th className="py-3 px-4">{t('googleMaps')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300">
                {usps.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">{row.nammaride}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{row.bmrcl}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{row.google}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* FEATURES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <h2 className="font-headline-lg text-headline-lg font-bold text-gray-900 dark:text-white">
            {t('builtForRealCommuters')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={i}
              className="light-glass-card editorial-card-tilt p-8 rounded-3xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-colors ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="font-body-md text-gray-600 dark:text-gray-300 leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CRAZY SECTION 1: INTERACTIVE TECH PARK & MAJOR HUB EXPRESS NAVIGATOR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full">
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-purple-500/10 dark:from-emerald-950/30 dark:via-black dark:to-purple-950/30 border border-emerald-500/20 dark:border-emerald-500/30 rounded-[40px] p-8 sm:p-12 space-y-8 shadow-lg">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Compass className="w-4 h-4" />
              <span>Tech Park & Commute Hub Express</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
              Direct Metro Routes to Bengaluru's Top Tech Hubs
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Tap any major tech park or educational campus below to view nearest metro station, line color, and walking shuttle connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                park: 'ITPL (International Tech Park)',
                station: 'Pattandur Agrahara (ITPL)',
                line: 'Purple Line',
                color: '#A855F7',
                walk: '2 min walk via Gate 2',
                fare: '₹10 - ₹60',
                hubs: 'TCS, SAP, Mu Sigma, Oracle'
              },
              {
                park: 'Manyata Tech Park',
                station: 'Nagawara Metro Station',
                line: 'Green Line',
                color: '#10B981',
                walk: '5 min feeder shuttle',
                fare: '₹15 - ₹65',
                hubs: 'Cognizant, IBM, Target, L&T'
              },
              {
                park: 'Electronic City Phase 1 & 2',
                station: 'Electronic City Metro Station',
                line: 'Yellow Line (Elevated)',
                color: '#EAB308',
                walk: 'Direct skywalk connect',
                fare: '₹15 - ₹60',
                hubs: 'Infosys, Wipro, Tech Mahindra, HCL'
              },
              {
                park: 'Bagmane Constellation Park',
                station: 'Garudacharpalya / KR Puram',
                line: 'Purple Line',
                color: '#A855F7',
                walk: '3 min auto / 8 min walk',
                fare: '₹10 - ₹55',
                hubs: 'Amazon, Samsung, Dell, EMC'
              },
              {
                park: 'MG Road & Church Street Promenade',
                station: 'MG Road Metro Station',
                line: 'Purple Line',
                color: '#A855F7',
                walk: 'Direct exit to Church Street',
                fare: '₹10 - ₹50',
                hubs: 'Shopping, Dining, Hard Rock Cafe, Metro Art Center'
              },
              {
                park: 'BMS College of Engineering',
                station: 'National College / Lalbagh',
                line: 'Green Line',
                color: '#10B981',
                walk: '4 min walk to campus gate',
                fare: '₹10 - ₹45',
                hubs: 'Basavanagudi Campus, Bull Temple'
              },
              {
                park: 'Shri Doddabasavanna Temple (Bull Temple)',
                station: 'National College Metro Station',
                line: 'Green Line',
                color: '#10B981',
                walk: '10 min walk / 3 min auto',
                fare: '₹10 - ₹45',
                hubs: 'Bull Temple Road, Basavanagudi'
              },
              {
                park: 'Central Silk Board & HSR Layout Hub',
                station: 'Central Silk Board Interchange',
                line: 'Yellow Line',
                color: '#EAB308',
                walk: 'Direct Interchange Skywalk',
                fare: '₹15 - ₹60',
                hubs: 'HSR Layout, BTM Layout, Tech Startups'
              },
              {
                park: 'ISCKON Temple & Orion Mall',
                station: 'Mahalakshmi / Rajajinagar',
                line: 'Green Line',
                color: '#10B981',
                walk: '3 min walk via Gate A',
                fare: '₹10 - ₹50',
                hubs: 'ISCKON Temple, Orion Mall, WTC Bengaluru'
              }
            ].map((hub, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-neutral-900/90 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white leading-snug">{hub.park}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{hub.hubs}</p>
                  </div>
                  <span className="w-3 h-3 rounded-full shrink-0 mt-1 shadow-xs" style={{ backgroundColor: hub.color }} />
                </div>

                <div className="p-3 bg-gray-50 dark:bg-neutral-950 rounded-2xl border border-gray-100 dark:border-neutral-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Nearest Metro:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{hub.station}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Line & Connectivity:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{hub.line}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Walking / Shuttle:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{hub.walk}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 dark:border-neutral-800">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Est. Ticket Fare:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{hub.fare}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 📊 CRAZY SECTION 2: BENGALURU METRO LIVE NETWORK METRICS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 space-y-2 shadow-xs">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-500">83</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Active Stations</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Purple, Green & Yellow Lines</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 space-y-2 shadow-xs">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-purple-500">100%</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Offline First</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Zero Internet Required</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 space-y-2 shadow-xs">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-500">10%</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Smart Card Savings</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Instant Discount Rates</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 space-y-2 shadow-xs">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-blue-500">0 KB</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Data Tracking</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Strict Privacy Guarantee</p>
          </div>
        </div>
      </section>

      {/* 🔍 CRAZY SECTION 3: SEO & GEO-TARGETED COMMUTER TRANSIT GUIDE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full">
        <div className="bg-white dark:bg-neutral-900 rounded-[36px] border border-gray-200 dark:border-neutral-800 p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Bengaluru Namma Metro 2026 Commuter & Transit Guide
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              NammaRide is the ultimate privacy-first offline guide for the Bengaluru Namma Metro transit network (operated by BMRCL). Whether you commute daily between <strong>Whitefield (Kadugodi) and Challaghatta</strong> on the Purple Line, or travel from <strong>Nagasandra to Silk Institute</strong> on the Green Line, NammaRide provides real-time route calculations, first/last train timetables, and platform interchange directions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-purple-600 dark:text-purple-400 uppercase tracking-wider">Purple Line Route & Fares</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Connects East and West Bengaluru from Whitefield (Kadugodi), ITPL, Hoodi, Benniganahalli, Indiranagar, MG Road, Nadaprabhu Kempegowda Station Majestic, Vijayanagar, Kengeri to Challaghatta. Smart card fares start from ₹9.50.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Green Line Route & Fares</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Connects North and South Bengaluru from Nagasandra, Yeshwanthpur, Malleshwaram, Chikpet, National College, Jayanagar, Banashankari, JP Nagar, to Silk Institute. Full interchange support at Nadaprabhu Kempegowda Station Majestic.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider">Yellow Line Tech Park Extension</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Elevated transit line connecting RV Road, Central Silk Board, HSR Layout, Electronic City Phase 1 & 2, and Bommasandra. Direct access to IT corridors with integrated skywalk exits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 GOOGLE PREFERRED SOURCE BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full">
        <GooglePreferredSourceCard />
      </section>

      {/* 📖 BENGALURU METRO BILINGUAL SEO & GEO GPS GUIDE */}
      <BengaluruMetroGuide />

      {/* 📲 CRAZY SECTION 4: SCAN QR CODE TO INSTALL NAMMARIDE APP */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/40 dark:via-black dark:to-emerald-950/40 rounded-[36px] border border-emerald-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>Instant Google Play Scan</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Scan QR Code & Get NammaRide Android App
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Point your smartphone camera at the QR code to open the Google Play Store directly. Enjoy 100% offline transit guidance, platform interchange maps, and automatic station alerts.
            </p>
            <div className="pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=site.nammaride.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105 active:scale-95 drop-shadow-lg"
              >
                <img src={googlePlayImg} alt="Get it on Google Play" className="h-14 sm:h-16 w-auto object-contain" />
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center space-y-3 shadow-2xl shrink-0">
            <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-md glow-button">
              <img src="/assets/images/nammaride_qr.png" alt="Scan QR Code to Download NammaRide App" className="w-36 h-36 object-contain rounded-xl" />
            </div>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">Scan with Camera or Lens</p>
          </div>
        </div>
      </section>

    </div>
  );
}
