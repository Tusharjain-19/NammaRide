import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Compass, Shield, Cpu, Sparkles, Map, Users, ArrowRight, ExternalLink, Calendar, Linkedin, Globe, Mail } from 'lucide-react';
import creatorPhoto from '../../assets/images/logo_app.png';

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'Privacy First',
      description: 'We never track location, never show ads, and never collect personal data. Your commute history stays on your phone.'
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      title: 'Offline First',
      description: 'Works completely offline in underground metro tunnels where cell service drops. Designed for speed and consistency.'
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-500" />,
      title: 'Delightful Design',
      description: 'Simple, accessible layout that respects your time. Metro navigation should take 5 seconds, not 5 minutes.'
    },
    {
      icon: <Map className="w-6 h-6 text-blue-500" />,
      title: 'Local First',
      description: 'Built for Bengaluru by locals who love the city. Contains curated landmarks, interchanges, and cultural tips.'
    },
    {
      icon: <Users className="w-6 h-6 text-pink-500" />,
      title: 'Community Driven',
      description: 'Commuter feedback dictates every single update. Built to improve daily transit for 500,000+ citizens.'
    }
  ];

  const timelineEvents = [
    { 
      date: 'June 2025', 
      title: 'Project Inception & Commuter Research', 
      desc: 'Project started to solve daily metro delays. Initial architecture mapping for offline routing across Purple, Green & Yellow lines.' 
    },
    { 
      date: 'October 2025', 
      title: 'Prototype 1 Alpha Release', 
      desc: 'Launched first internal prototype with offline fare matrix calculation and basic station lookup.' 
    },
    { 
      date: 'January 2026', 
      title: 'Prototype 2 Beta Launch', 
      desc: 'BMSCE student beta testing, QR ticket vault integration, tech park landmark directory, and Divyangjan accessibility tools.' 
    },
    { 
      date: 'September 2026', 
      title: 'Official Play Store Launch', 
      desc: 'Public release of NammaRide Android App on Google Play Store with zero ads, 100% offline navigation, and live updates.' 
    },
    { 
      date: '2027 & Beyond', 
      title: 'National Metro Expansion', 
      desc: 'Expanding offline route engines, iOS app release, and mapping new metro extensions across major Indian cities.' 
    }
  ];

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            About NammaRide
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Built out of daily commuting frustration. Designed to give Bengaluru a fast, offline-first, ad-free metro guide.
          </p>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <Heart className="w-4 h-4" />
            <span>Our Core Mission</span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-lg sm:text-xl font-medium leading-relaxed">
            To make Bengaluru Metro navigation effortless, 100% private, and accessible to everyone, daily office goers, weekend shoppers, and tourists alike.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            We envision an ecosystem where public utility transit apps respect user privacy, work offline-first, celebrate local city culture, and remain free of ad noise.
          </p>
        </motion.div>

        {/* Founder & Developer Section (Clean Human Design, No Image, No AI Gradients) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10 shadow-sm space-y-6"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white">Tushar Jain</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Computer Science & Business Systems (CS & BS) Student</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Founder & Lead Developer
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
              I am a student at <strong>BMS College of Engineering (BMSCE)</strong>, Bengaluru. As a daily metro commuter myself, I built NammaRide to address the delays, fumbling, and tracking concerns present in traditional solutions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="https://www.linkedin.com/in/tushar-jain-781149322/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 active:scale-95"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
              <a 
                href="https://www.tusharjain.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Portfolio (tusharjain.in)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <a 
                href="mailto:jaint0910@gmail.com" 
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <div className="space-y-6">
          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white text-center">Core Pillars</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200 dark:border-gray-800 editorial-card-tilt flex items-start gap-4 shadow-xs"
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl shrink-0 border border-gray-100 dark:border-gray-850">
                  {val.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">{val.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{val.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white text-center">Timeline & Milestones</h3>
          <div className="relative pl-6 border-l border-gray-200 dark:border-gray-800 space-y-8 max-w-2xl mx-auto">
            {timelineEvents.map((ev, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="relative space-y-1.5"
              >
                <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-black border-2 border-purple-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/5 dark:bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  <Calendar className="w-3 h-3" /> {ev.date}
                </span>
                <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">{ev.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{ev.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-[36px] bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/25 text-center space-y-5"
        >
          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white">Have feedback or suggestions?</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            NammaRide is community-driven. If you want to request a feature, report a station details bug, or explore sponsorships, get in touch with us!
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/contact" className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5">
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
