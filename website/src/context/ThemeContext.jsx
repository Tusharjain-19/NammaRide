import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'nammaride_theme';
const MANUAL_KEY = 'nammaride_theme_manual';
const ThemeContext = createContext();

// Resolve initial theme synchronously: respect manual override first, else match OS / mobile theme
function getSystemTheme() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {}
  return 'light';
}

function getInitialTheme() {
  try {
    const isManual = localStorage.getItem(MANUAL_KEY) === '1';
    const saved = localStorage.getItem(THEME_KEY)
      || localStorage.getItem('nammaride_app_theme')
      || localStorage.getItem('appTheme');
    if (isManual && (saved === 'dark' || saved === 'light')) {
      return saved;
    }
  } catch (e) {}

  return getSystemTheme();
}

// Apply theme class to <html> synchronously (also called from inline script in index.html)
function applyThemeToDOM(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    if (document.body) document.body.classList.remove('light-mode');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    if (document.body) document.body.classList.add('light-mode');
  }
}

function runTopDownSweepBeam(isDark) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const existing = document.getElementById('nr-theme-sweep-beam');
    if (existing) existing.remove();
    const beam = document.createElement('div');
    beam.id = 'nr-theme-sweep-beam';
    beam.setAttribute('aria-hidden', 'true');
    beam.className = isDark ? 'nr-sweep-beam nr-sweep-to-dark' : 'nr-sweep-beam nr-sweep-to-light';
    document.body.appendChild(beam);
    setTimeout(() => {
      if (beam.parentNode) beam.parentNode.removeChild(beam);
    }, 480);
  } catch (e) {}
}

function runFallbackCurtain(isDark, onMidpoint) {
  try {
    const existing = document.getElementById('nr-theme-curtain');
    if (existing) existing.remove();
    const curtain = document.createElement('div');
    curtain.id = 'nr-theme-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.style.cssText = `position:fixed;inset:0;z-index:2147483646;pointer-events:none;will-change:transform,opacity;transform:translate3d(0,-100%,0);background:${isDark ? 'linear-gradient(180deg,#020408 0%,#0b1322 92%,rgba(16,185,129,0.45) 100%)' : 'linear-gradient(180deg,#f8fafc 0%,#ffffff 92%,rgba(16,185,129,0.35) 100%)'};transition:transform 300ms cubic-bezier(0.22,1,0.36,1),opacity 200ms ease;`;
    document.body.appendChild(curtain);
    requestAnimationFrame(() => {
      curtain.style.transform = 'translate3d(0,0,0)';
      setTimeout(() => {
        onMidpoint();
        curtain.style.opacity = '0';
        setTimeout(() => {
          if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
        }, 220);
      }, 210);
    });
  } catch (e) {
    onMidpoint();
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const initial = getInitialTheme();
    applyThemeToDOM(initial);
    return initial;
  });

  // Follow system Light/Dark changes automatically when user hasn't manually overridden
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOsChange = (e) => {
      try {
        if (localStorage.getItem(MANUAL_KEY) !== '1') {
          const next = e.matches ? 'dark' : 'light';
          applyThemeToDOM(next);
          setThemeState(next);
        }
      } catch (err) {}
    };
    if (mq.addEventListener) mq.addEventListener('change', onOsChange);
    else if (mq.addListener) mq.addListener(onOsChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onOsChange);
      else if (mq.removeListener) mq.removeListener(onOsChange);
    };
  }, []);

  // Listen for theme sync from simulator iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NAMMARIDE_THEME_SYNC' && event.data.theme) {
        const next = event.data.theme === 'dark' ? 'dark' : 'light';
        if (event.data.manual) {
          try {
            localStorage.setItem(MANUAL_KEY, '1');
            localStorage.setItem(THEME_KEY, next);
            localStorage.setItem('nammaride_app_theme', next);
            localStorage.setItem('appTheme', next);
          } catch (e) {}
        }
        applyThemeToDOM(next);
        setThemeState(next);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const applyWithTopDownWipe = useCallback((nextTheme, isManual = true) => {
    if (isManual) {
      try {
        localStorage.setItem(MANUAL_KEY, '1');
        localStorage.setItem(THEME_KEY, nextTheme);
        localStorage.setItem('nammaride_app_theme', nextTheme);
        localStorage.setItem('appTheme', nextTheme);
      } catch (e) {}
    }

    const isDark = nextTheme === 'dark';
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || typeof document === 'undefined') {
      applyThemeToDOM(nextTheme);
      setThemeState(nextTheme);
      return;
    }

    if (typeof document.startViewTransition === 'function') {
      document.documentElement.classList.add('nr-theme-wiping');
      runTopDownSweepBeam(isDark);
      try {
        const transition = document.startViewTransition(() => {
          applyThemeToDOM(nextTheme);
          setThemeState(nextTheme);
        });
        transition.finished.finally(() => {
          document.documentElement.classList.remove('nr-theme-wiping');
        });
      } catch (e) {
        document.documentElement.classList.remove('nr-theme-wiping');
        applyThemeToDOM(nextTheme);
        setThemeState(nextTheme);
      }
    } else {
      document.documentElement.classList.add('nr-theme-wiping');
      runFallbackCurtain(isDark, () => {
        applyThemeToDOM(nextTheme);
        setThemeState(nextTheme);
        document.documentElement.classList.remove('nr-theme-wiping');
      });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyWithTopDownWipe(next, true);
  }, [theme, applyWithTopDownWipe]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      applyWithTopDownWipe(newTheme, true);
    }
  }, [applyWithTopDownWipe]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
