import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileAppBanner from './components/MobileAppBanner';
import HomePage from './pages/HomePage';
import SimulatorPage from './pages/SimulatorPage';
import FeaturesPage from './pages/FeaturesPage';
import StationsPage from './pages/StationsPage';
import MetroMapPage from './pages/MetroMapPage';
import ExplorePage from './pages/ExplorePage';
import FareCalculatorPage from './pages/FareCalculatorPage';
import TimingsPage from './pages/TimingsPage';
import SafetyPage from './pages/SafetyPage';
import DownloadPage from './pages/DownloadPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

function AnimatedRoutes() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  return (
    <div 
      className={`relative w-full flex-grow flex flex-col ${isTransitioning ? 'pointer-events-none' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <AnimatePresence 
        mode="wait" 
        initial={false}
        onExitComplete={() => {
          setIsTransitioning(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.995 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => setIsTransitioning(false)}
          style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}
          className="w-full flex-grow flex flex-col"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/stations" element={<StationsPage />} />
            <Route path="/map" element={<MetroMapPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/fare-calculator" element={<FareCalculatorPage />} />
            <Route path="/timings" element={<TimingsPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300">
            <Navbar />
            <main className="flex-grow flex flex-col">
              <AnimatedRoutes />
            </main>
            <Footer />
            <MobileAppBanner />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
