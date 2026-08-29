import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'nammaride_theme';
const ThemeContext = createContext();

// Resolve initial theme synchronously to avoid flash
function getInitialTheme() {
  try {
    // Check new key first, then migrate from old keys
    const saved = localStorage.getItem(THEME_KEY)
      || localStorage.getItem('nammaride_app_theme')
      || localStorage.getItem('appTheme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (e) {}

  // First launch — use system preference
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {}

  return 'light';
}

// Apply theme class to <html> synchronously (also called from inline script in index.html)
function applyThemeToDOM(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    document.body.classList.remove('light-mode');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    document.body.classList.add('light-mode');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const initial = getInitialTheme();
    // Apply immediately to prevent flash
    applyThemeToDOM(initial);
    return initial;
  });

  // Persist and apply whenever theme changes
  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
      // Keep old keys in sync for mobile app compatibility
      localStorage.setItem('nammaride_app_theme', theme);
      localStorage.setItem('appTheme', theme);
    } catch (e) {}
  }, [theme]);

  // Listen for theme sync from simulator iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NAMMARIDE_THEME_SYNC' && event.data.theme) {
        setThemeState(event.data.theme);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  }, []);

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
