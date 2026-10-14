import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="w-full flex-grow flex flex-col relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
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
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 w-full overflow-x-hidden">
            <Navbar />
            <main className="flex-grow flex flex-col w-full">
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
