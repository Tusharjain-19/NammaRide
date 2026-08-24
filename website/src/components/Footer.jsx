import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Code, ShieldCheck, MapPin, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import googlePlayImg from '../../assets/images/google play.svg';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--bg-color)] border-t border-[var(--border-color)] text-[var(--text-secondary)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-color)]">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <img 
                  src="/simulator/assets/images/logo_app.png" 
                  alt="NammaRide Logo" 
                  className="w-6 h-6 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <span className="font-heading font-extrabold text-xl text-[var(--text-primary)]">NammaRide</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Bengaluru Transit Companion. Fast, accurate, and offline-ready route planning for Purple, Green, Yellow, Red & Blue Metro lines.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#eab308]"></span>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider ml-1">Purple • Green • Yellow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[var(--text-primary)] tracking-wider uppercase mb-4">Transit Companion</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/simulator" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <span>Web App Simulator</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-500 rounded font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/stations" className="hover:text-emerald-500 transition-colors">Metro Stations Directory</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-emerald-500 transition-colors">Interactive Metro Map</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-emerald-500 transition-colors">Explore Landmarks Guide</Link>
              </li>
              <li>
                <Link to="/timings" className="hover:text-emerald-500 transition-colors">Metro Train Timetable</Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-emerald-500 transition-colors">Safety Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[var(--text-primary)] tracking-wider uppercase mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-emerald-500 transition-colors">Content Blog</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-emerald-500 transition-colors">User Testimonials</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Download & Developer Credit */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[var(--text-primary)] tracking-wider uppercase mb-4">Download NammaRide</h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Get the native Android app for 100% offline access, turnstile QR gate storage, and fast navigation.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=site.nammaride.app"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 drop-shadow-sm shrink-0"
              >
                <img src={googlePlayImg} alt="Get it on Google Play" className="h-11 w-auto object-contain" />
              </a>
              <div className="p-1.5 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm shrink-0" title="Scan QR Code to download NammaRide App">
                <img src="/assets/images/nammaride_qr.png" alt="Scan QR Code" className="w-10 h-10 object-contain rounded-lg" />
              </div>
            </div>

            {/* Developer Credit per design.md */}
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] space-y-2">
              <div>
                <a 
                  href="https://www.tusharjain.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-emerald-500 transition-colors group font-medium"
                >
                  <Code className="w-4 h-4 text-emerald-500 opacity-70 group-hover:opacity-100" />
                  <span className="underline underline-offset-4 decoration-emerald-500/30 group-hover:decoration-emerald-500">Developed by Tushar Jain (tusharjain.in)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                <a href="https://www.linkedin.com/in/tushar-jain-781149322/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 underline font-medium flex items-center gap-1">
                  <span>LinkedIn Profile</span>
                </a>
                <span>•</span>
                <a href="mailto:jaint0910@gmail.com" className="hover:text-emerald-500 underline font-medium">
                  jaint0910@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-[var(--text-secondary)]">
          <p>
            © {new Date().getFullYear()} NammaRide. All rights reserved. 
            <span className="block sm:inline sm:ml-2">Disclaimer: Timings and fare are estimates. Independent transit guide, not an official BMRCL site.</span>
          </p>
          <div className="flex items-center gap-4 font-medium">
            <Link to="/simulator" className="hover:text-emerald-500">App Simulator</Link>
            <span>•</span>
            <a href="https://play.google.com/store/apps/details?id=site.nammaride.app" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">Google Play Store</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
