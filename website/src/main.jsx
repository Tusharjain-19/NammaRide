// Sanitize origin storage from sibling dev project leaks (e.g., JaipurRide)
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.toLowerCase().includes('jaipur')) {
        toRemove.push(k);
      } else if (k) {
        const v = localStorage.getItem(k);
        if (typeof v === 'string' && v.toLowerCase().includes('jaipur')) {
          toRemove.push(k);
        }
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }
} catch (e) {}

function purgeForeignOriginStorage() {}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
