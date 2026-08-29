import React, { useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Download, Menu, X, Zap, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import googlePlayImg from '../../assets/images/google play.svg';

function ThemeToggleButton({ theme, toggleTheme, size = 'normal' }) {
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    // Theme changes IMMEDIATELY
    toggleTheme();
    
    // Trigger icon entrance animation (visual only)
    setAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnimating(false), 250);
  };

  const isSmall = size === 'small';
  const iconClass = `${isSmall ? 'w-4 h-4' : 'w-4 h-4'} ${animating ? 'theme-toggle-icon-enter' : ''}`;

  return (
    <button
      onClick={handleClick}
      className={`${isSmall ? 'p-1.5 min-w-[36px] min-h-[36px]' : 'p-2 min-w-[44px] min-h-[44px]'} rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center active:scale-90`}
      title="Toggle Theme"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' 
        ? <Sun className={`${iconClass} text-amber-500`} /> 
        : <Moon className={`${iconClass} text-indigo-500`} />
      }
    </button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('simulator'), path: '/simulator', badge: 'Live' },
    { name: t('stations'), path: '/stations' },
    { name: t('map'), path: '/map' },
    { name: t('explore'), path: '/explore' },
    { name: t('timings'), path: '/timings' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full h-20 bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl border-b border-gray-200 dark:border-gray-800 z-50 shadow-sm transition-colors">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto h-full">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/simulator/assets/images/logo_app.png" 
              alt="NammaRide Logo" 
              className="w-7 h-7 object-contain"
            />
            <span className="font-display-lg text-[24px] font-bold text-gray-900 dark:text-white leading-none tracking-tight">NammaRide</span>
          </Link>
 
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-label-lg text-label-lg transition-colors pb-1 border-b-2 ${
                    isActive
                      ? 'text-emerald-500 font-bold border-emerald-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 border-transparent'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
 
          {/* Controls: Language Switcher, Theme Switcher, Google Play SVG */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Language Switcher Toggle (EN / ಕನ್ನಡ) */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Theme Switcher Toggle — Premium Animated */}
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
 
            {/* Google Play SVG Badge (No background box) */}
            <a
              href="https://play.google.com/store/apps/details?id=site.nammaride.app"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 drop-shadow-xs"
            >
              <img src={googlePlayImg} alt="Get it on Google Play" className="h-11 w-auto object-contain" />
            </a>
          </div>
 
          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} size="small" />
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-emerald-500 font-bold text-xs"
            >
              {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
 
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
 
      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur-2xl px-4 py-5 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-2">
            <a
              href="https://play.google.com/store/apps/details?id=site.nammaride.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-sm text-center flex items-center justify-center gap-2 glow-button"
            >
              <Download className="w-4 h-4" />
              <span>{t('getApp')}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
