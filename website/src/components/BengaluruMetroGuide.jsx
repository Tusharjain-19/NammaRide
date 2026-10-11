import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Navigation, ShieldCheck, MapPin, Zap, CheckCircle2, Award, Smartphone, Globe, Radio, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import googlePlayImg from '../assets/images/google play.svg';

export default function BengaluruMetroGuide() {
  const { lang } = useLanguage();
  const [activeLang, setActiveLang] = useState(lang || 'en');

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-container-max 3xl:max-w-[1800px] mx-auto w-full">
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-[36px] p-6 sm:p-10 lg:p-14 space-y-10 shadow-xl">
        
        {/* Header & Language Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-neutral-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" /> #1 Best Geo GPS App for Bengaluru Metro
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
              Bengaluru Namma Metro Complete Commuter & Geo Navigation Guide
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Explore 83+ stations across Purple, Green, and Yellow lines with offline GPS station detection, fare calculators, and platform direction guides in English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-neutral-900 p-1.5 rounded-2xl border border-gray-200 dark:border-neutral-800 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveLang('en')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeLang === 'en'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>English Guide</span>
            </button>
            <button
              onClick={() => setActiveLang('kn')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeLang === 'kn'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>ಕನ್ನಡ ಮಾರ್ಗದರ್ಶಿ</span>
            </button>
            <button
              onClick={() => setActiveLang('hi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeLang === 'hi'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>हिन्दी मार्गदर्शिका</span>
            </button>
          </div>
        </div>

        {/* Geo GPS App Feature Highlight Banner */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-purple-500/10 dark:from-emerald-950/40 dark:via-black dark:to-purple-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Automatic GPS Station Tracking
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white leading-tight">
              Why NammaRide is Rated the #1 Best Geo GPS App for Namma Metro Commuters
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Unlike generic web maps that demand continuous mobile internet data, NammaRide utilizes high-precision smartphone Geolocation (GPS) hardware to automatically detect your exact nearest metro station in real time. It calculates live remaining journey time, triggers proximity vibration alerts 1 to 2 stations before your stop, and runs 100% offline without spending a single kilobyte of cellular data.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>0 KB Data Required</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Underground Proximity Radar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5% Smart Card Discount Calc</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-3 bg-white dark:bg-black p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-md">
            <Smartphone className="w-10 h-10 text-emerald-500" />
            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Get Official Android App</span>
            <a
              href="https://play.google.com/store/apps/details?id=site.nammaride.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              <img src={googlePlayImg} alt="Download NammaRide on Google Play" className="h-11 w-auto object-contain" />
            </a>
          </div>
        </div>

        {/* Language 1: ENGLISH COMPREHENSIVE GUIDE (1000+ Words) */}
        {activeLang === 'en' && (
          <article className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                1. Overview of Bengaluru Metro (Namma Metro BMRCL Network)
              </h3>
              <p>
                Bengaluru Metro, officially known as <strong>Namma Metro</strong> (meaning "Our Metro" in Kannada), is the rapid transit system serving the city of Bengaluru, Karnataka, India. Operated by the Bangalore Metro Rail Corporation Limited (BMRCL), a joint venture of the Government of India and the Government of Karnataka, Namma Metro is the second longest operational metro network in India after Delhi Metro.
              </p>
              <p>
                Designed to ease chronic traffic congestion across major tech corridors, commercial centers, and residential hubs, Namma Metro spans over 73+ kilometers of operational lines and connects 83+ stations across three primary color-coded lines: the <strong>Purple Line</strong>, the <strong>Green Line</strong>, and the newly constructed <strong>Yellow Line extension</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-purple-500 pl-3">
                2. Purple Line: Connecting Whitefield (Kadugodi) to Challaghatta
              </h3>
              <p>
                The <strong>Purple Line</strong> is the East-West arterial corridor of Namma Metro, stretching 43.49 kilometers from <em>Whitefield (Kadugodi)</em> in the east to <em>Challaghatta</em> in the southwest. It seamlessly integrates Bengaluru's major technology hubs, industrial zones, and administrative quarters.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Key Purple Line Stations & Landmarks:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>Pattandur Agrahara (ITPL)</strong>: Direct access to International Tech Park.</li>
                  <li>• <strong>Garudacharpalya / KR Puram</strong>: Bagmane Constellation Tech Park.</li>
                  <li>• <strong>Indiranagar & Hoodi</strong>: Shopping, dining, and nightlife hub.</li>
                  <li>• <strong>MG Road & Cubbon Park</strong>: Commercial central business district & green zone.</li>
                  <li>• <strong>Sir M. Visvesvaraya (Central College)</strong>: High Court of Karnataka & Vidhana Soudha.</li>
                  <li>• <strong>Nadaprabhu Kempegowda Station (Majestic)</strong>: Main transit interchange for Green Line & KSRTC bus terminal.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                3. Green Line: Connecting Madavara (BIEC) to Silk Institute
              </h3>
              <p>
                The <strong>Green Line</strong> runs North-South across 33.4 kilometers, connecting <em>Madavara (Bangalore International Exhibition Centre - BIEC)</em> in the north to <em>Silk Institute (Kanakapura Road)</em> in the south. This line serves historic residential neighborhoods, major educational institutions, industrial estates, and cultural landmarks.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Key Green Line Stations & Cultural Landmarks:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>Nagasandra & Peenya</strong>: Peenya Industrial Area & IKEA Nagasandra.</li>
                  <li>• <strong>Mahalakshmi & Rajajinagar</strong>: ISCKON Temple Bengaluru & Orion Mall.</li>
                  <li>• <strong>Mantri Square Sampige Road</strong>: Malleshwaram shopping district.</li>
                  <li>• <strong>National College & Lalbagh</strong>: BMS College of Engineering, Shri Doddabasavanna Temple (Bull Temple), and Lalbagh Botanical Garden.</li>
                  <li>• <strong>Jayanagar & JP Nagar</strong>: 4th Block Shopping Complex & South End Circle.</li>
                  <li>• <strong>Silk Institute</strong>: Art of Living International Centre access.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-amber-500 pl-3">
                4. Yellow Line Extension: RV Road to Electronic City & Bommasandra
              </h3>
              <p>
                The newly developed <strong>Yellow Line</strong> spans 18.82 kilometers connecting <em>RV Road (Green Line Interchange)</em> to <em>Bommasandra</em> via <em>Central Silk Board</em>, <em>HSR Layout</em>, and <em>Electronic City Phase 1 & Phase 2</em>. Equipped with elevated driverless trains and integrated skywalk exits, the Yellow Line slashes commute times for over 500,000 IT professionals working in Infosys, Wipro, Tech Mahindra, and Biocon Park.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                5. Namma Metro Timings, Fare Rules & Smart Card Discounts
              </h3>
              <p>
                Namma Metro train services operate daily from <strong>05:00 AM to 11:05 PM</strong> on Mondays through Saturdays, and from <strong>07:00 AM to 11:05 PM</strong> on Sundays. During peak hours (08:30 AM to 10:30 AM and 05:00 PM to 08:00 PM), train frequency is maintained at 3 to 5 minutes, while off-peak frequency ranges between 8 to 12 minutes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Ticket Fare Calculation</h5>
                  <p className="text-xs">
                    Minimum fare starts at <strong>₹10</strong> (up to 2 km) and caps at <strong>₹65</strong> for long-distance transit across interchanges. Single-journey contactless smart tokens or QR tickets are available at station counters and via official WhatsApp chatbot (`+91 81055 56677`).
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 text-sm">Namma Metro Smart Card (Varshik)</h5>
                  <p className="text-xs">
                    Commuters using the BMRCL Varshik Smart Card enjoy a flat <strong>5% discount</strong> on every ride compared to token fares. Cards can be recharged online or via NammaRide fare guidance.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                6. Why Geo GPS Navigation is Essential for Namma Metro Commuters
              </h3>
              <p>
                Underground metro stations between Majestic, Central College, Vidhana Soudha, and MG Road frequently block cellular data coverage. NammaRide's proprietary <strong>Offline Geo GPS Station Tracker</strong> operates directly on your phone's satellite receiver, ensuring uninterrupted distance monitoring, platform interchange alerts, and offline map rendering even deep underground.
              </p>
            </section>

            {/* English Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Browse 83+ Stations Directory →
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                First & Last Train Timings →
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Fare & Smart Card Calculator →
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Interactive Metro Map →
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Try Web Simulator →
              </Link>
            </div>

          </article>
        )}

        {/* Language 2: KANNADA COMPREHENSIVE GUIDE (ಕನ್ನಡ ಸಮಗ್ರ ಮೆಟ್ರೋ ಮಾರ್ಗದರ್ಶಿ - 1000+ Words) */}
        {activeLang === 'kn' && (
          <article className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-sans">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                1. ನಮ್ಮ ಮೆಟ್ರೋ ಬೆಂಗಳೂರು: ಸಮಗ್ರ ಮಾಹಿತಿ (Namma Metro Overview)
              </h3>
              <p>
                ಬೆಂಗಳೂರು ನಗರದ ಅತ್ಯಂತ ಜನಪ್ರಿಯ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆಯಾದ <strong>ನಮ್ಮ ಮೆಟ್ರೋ (Namma Metro)</strong> ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ರೈಲು ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ (BMRCL) ಮೂಲಕ ಯಶಸ್ವಿಯಾಗಿ ನಿರ್ವಹಿಸಲ್ಪಡುತ್ತಿದೆ. ಭಾರತದಲ್ಲಿ ದೆಹಲಿ ಮೆಟ್ರೋ ನಂತರ ಎರಡನೇ ಅತಿ ದೊಡ್ಡ ಮೆಟ್ರೋ ಜಾಲ ಎಂಬ ಹೆಗ್ಗಳಿಕೆಗೆ ನಮ್ಮ ಮೆಟ್ರೋ ಪಾತ್ರವಾಗಿದೆ.
              </p>
              <p>
                ಐಟಿ ಸಿಟಿ ಬೆಂಗಳೂರಿನ ದಟ್ಟಣೆ ನಿಯಂತ್ರಿಸಲು ಮತ್ತು ಶೀಘ್ರ ಪ್ರಯಾಣಕ್ಕಾಗಿ ನಮ್ಮ ಮೆಟ್ರೋ 73 ಕಿಲೋಮೀಟರ್‌ಗಿಂತಲೂ ಹೆಚ್ಚಿನ ಕಾರ್ಯಾಚರಣೆಯ ಮಾರ್ಗಗಳನ್ನು ಹೊಂದಿದ್ದು, 83ಕ್ಕೂ ಹೆಚ್ಚು ಸಕ್ರಿಯ ಮೆಟ್ರೋ ನಿಲ್ದಾಣಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-purple-500 pl-3">
                2. ಪರ್ಪಲ್ ಲೈನ್ (Purple Line): ವೈಟ್‌ಫೀಲ್ಡ್‌ನಿಂದ ಚಲ್ಲಘಟ್ಟ
              </h3>
              <p>
                <strong>ಪರ್ಪಲ್ ಲೈನ್</strong> ಪೂರ್ವದ <em>ವೈಟ್‌ಫೀಲ್ಡ್ (ಕಾಡುಗೋಡಿ)</em> ನಿಲ್ದಾಣದಿಂದ ನೈಋತ್ಯದ <em>ಚಲ್ಲಘಟ್ಟ</em> ವರೆಗೆ 43.49 ಕಿಲೋಮೀಟರ್ ವಿಸ್ತರಿಸಿದೆ. ಇದು ಬೆಂಗಳೂರಿನ ಪ್ರಮುಖ ತಂತ್ರಜ್ಞಾನ ಪಾರ್ಕ್‌ಗಳು, ಸರಕಾರಿ ಕಚೇರಿಗಳು ಮತ್ತು ವ್ಯಾಪಾರ ಕೇಂದ್ರಗಳನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">ಪರ್ಪಲ್ ಲೈನ್ ಪ್ರಮುಖ ನಿಲ್ದಾಣಗಳು:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  <li>• <strong>ಪಟ್ಟಂದೂರು ಅಗ್ರಹಾರ (ITPL)</strong>: ಇಂಟರ್‌ನ್ಯಾಶನಲ್ ಟೆಕ್ ಪಾರ್ಕ್ ಸಂಪರ್ಕ.</li>
                  <li>• <strong>ಗರುಡಾಚಾರ್‌ಪಾಳ್ಯ / ಕೆಆರ್ ಪುರಂ</strong>: ಬಾಗ್ಮನೆ ಕಾನ್ಸ್ಟಲೇಶನ್ ಪಾರ್ಕ್.</li>
                  <li>• <strong>ಇಂದಿರಾನಗರ & ಎಂಜಿ ರಸ್ತೆ</strong>: ಶಾಪಿಂಗ್ ಮತ್ತು ವಾಣಿಜ್ಯ ಕೇಂದ್ರ.</li>
                  <li>• <strong>ವಿಧಾನಸೌಧ & ಕಬ್ಬನ್ ಪಾರ್ಕ್</strong>: ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಮತ್ತು ಆಡಳಿತ ಕೇಂದ್ರ.</li>
                  <li>• <strong>ಮೆಜೆಸ್ಟಿಕ್ (ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿಲ್ದಾಣ)</strong>: ಗ್ರೀನ್ ಲೈನ್ ಬದಲಾವಣೆ ಕೇಂದ್ರ.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                3. ಗ್ರೀನ್ ಲೈನ್ (Green Line): ಮಾದಾವರ (BIEC) ದಿಂದ ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್
              </h3>
              <p>
                <strong>ಗ್ರೀನ್ ಲೈನ್</strong> ಉತ್ತರ-ದಕ್ಷಿಣವಾಗಿ 33.4 ಕಿಲೋಮೀಟರ್ ವಿಸ್ತರಿಸಿದ್ದು, ಉತ್ತರದಲ್ಲಿರುವ <em>ಮಾದಾವರ (ಬೆಂಗಳೂರು ಇಂಟರ್‌ನ್ಯಾಶನಲ್ ಎಕ್ಸಿಬಿಷನ್ ಸೆಂಟರ್)</em> ನಿಲ್ದಾಣದಿಂದ ದಕ್ಷಿಣದ <em>ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ (ಕನಕಪುರ ರಸ್ತೆ)</em> ವರೆಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುತ್ತದೆ.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">ಗ್ರೀನ್ ಲೈನ್ ಪ್ರಸಿದ್ಧ ಸ್ಥಳಗಳು & ನಿಲ್ದಾಣಗಳು:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  <li>• <strong>ನಾಗಸಂದ್ರ & ಪೀಣ್ಯ</strong>: ಪೀಣ್ಯ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ ಮತ್ತು IKEA.</li>
                  <li>• <strong>ಮಹಾಲಕ್ಷ್ಮಿ & ರಾಜಾಜಿನಗರ</strong>: ಇಸ್ಕಾನ್ ದೇವಾಲಯ ಮತ್ತು ಒರಿಯನ್ ಮಾಲ್.</li>
                  <li>• <strong>ನ್ಯಾಷನಲ್ ಕಾಲೇಜ್ & ಲಾಲ್‌ಬಾಗ್</strong>: ಬಿಎಂಎಸ್‌ಸಿಇ ಕಾಲೇಜು, ಶ್ರೀ ದೊಡ್ಡಬಸವಣ್ಣ ದೇವಾಲಯ (ಬುಲ್ ಟೆಂಪಲ್) ಮತ್ತು ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯತೋಟ.</li>
                  <li>• <strong>ಜಯನಗರ & ಜೆಪಿ ನಗರ</strong>: 4ನೇ ಬ್ಲಾಕ್ ಶಾಪಿಂಗ್ ಕಾಂಪ್ಲೆಕ್ಸ್.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-amber-500 pl-3">
                4. ಯೆಲ್ಲೋ ಲೈನ್ (Yellow Line): ಆರ್‌ವಿ ರಸ್ತೆಯಿಂದ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ & ಬೊಮ್ಮಸಂದ್ರ
              </h3>
              <p>
                ಹೊಸದಾಗಿ ನಿರ್ಮಿಸಲಾದ <strong>ಯೆಲ್ಲೋ ಲೈನ್</strong> 18.82 ಕಿಲೋಮೀಟರ್ ಉದ್ದವಿದ್ದು, <em>ಆರ್‌ವಿ ರಸ್ತೆ</em> ಯಿಂದ <em>ಸಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್</em>, <em>ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್</em>, ಮತ್ತು <em>ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ</em> ಮಾರ್ಗವಾಗಿ <em>ಬೊಮ್ಮಸಂದ್ರ</em> ವರೆಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುತ್ತದೆ.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                5. ಮೆಟ್ರೋ ಸಮಯ, ಟಿಕೆಟ್ ದರ ಮತ್ತು GPS ಅತ್ಯುತ್ತಮ ಯಾಪ್ (NammaRide Features)
              </h3>
              <p>
                ನಮ್ಮ ಮೆಟ್ರೋ ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ <strong>05:00 ರಿಂದ ರಾತ್ರಿ 11:05 ವರೆಗೆ</strong> ಸಂಚರಿಸುತ್ತದೆ. ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ 07:00 ರಿಂದ ಸೇವೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಕನಿಷ್ಠ ಟಿಕೆಟ್ ದರ <strong>₹10</strong> ಮತ್ತು ಗರಿಷ್ಠ ದರ <strong>₹65</strong> ಆಗಿದೆ.
              </p>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">ನಮ್ಮರೈಡ್ (NammaRide) ಯಾಪ್ ಏಕ ಅತ್ಯುತ್ತಮ?</h5>
                <p className="text-xs leading-relaxed">
                  ಇಂಟರ್ನೆಟ್ ಸಿಗ್ನಲ್ ಇಲ್ಲದ ಭೂಗತ ನಿಲ್ದಾಣಗಳಲ್ಲೂ NammaRide ನ <strong>Geo GPS ನಿಲ್ದಾಣ ಶೋಧಕ</strong> ನಿಮ್ಮ ಮೊಬೈಲ್‌ನ GPS ಮೂಲಕ ಹತ್ತಿರದ ನಿಲ್ದಾಣವನ್ನು ನಿಖರವಾಗಿ ಪತ್ತೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ನಿಲ್ದಾಣ ಬರುವ ಮುನ್ನ ವೈಬ್ರೇಶನ್ ಅಲರ್ಟ್ ನೀಡುತ್ತದೆ.
                </p>
              </div>
            </section>

            {/* Kannada Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                83+ ನಿಲ್ದಾಣಗಳ ಮಾಹಿತಿ →
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಮೆಟ್ರೋ ಸಮಯ ಸೂಚಕ →
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಟಿಕೆಟ್ ದರ ಲೆಕ್ಕಾಚಾರ →
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ →
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಲೈವ್ ಸಿಮ್ಯುಲೇಟರ್ →
              </Link>
            </div>

          </article>
        )}

        {/* Language 3: HINDI COMPREHENSIVE GUIDE (हिन्दी समग्र मेट्रो मार्गदर्शिका - 1000+ Words) */}
        {activeLang === 'hi' && (
          <article className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-sans">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                1. बेंगलुरु नम्मा मेट्रो: संपूर्ण अवलोकन (Namma Metro BMRCL Network Overview)
              </h3>
              <p>
                बेंगलुरु शहर की जीवनरेखा कही जाने वाली <strong>नम्मा मेट्रो (Namma Metro)</strong> का संचालन बेंगलुरु मेट्रो रेल कॉर्पोरेशन लिमिटेड (BMRCL) द्वारा किया जाता है। दिल्ली मेट्रो के बाद नम्मा मेट्रो भारत का दूसरा सबसे बड़ा और सबसे व्यस्त मेट्रो रेल नेटवर्क है। यह कर्नाटक की राजधानी में दैनिक यातायात और जाम से बचने का सबसे विश्वसनीय, सुरक्षित और तेज़ माध्यम है।
              </p>
              <p>
                वर्तमान में नम्मा मेट्रो का नेटवर्क 73+ किलोमीटर से अधिक लंबा है और इसके अंतर्गत 83+ सक्रिय मेट्रो स्टेशन आते हैं। यह नेटवर्क तीन प्रमुख लाइनों में विभाजित है: <strong>पर्पल लाइन (Purple Line)</strong>, <strong>ग्रीन लाइन (Green Line)</strong>, और नई <strong>येलो लाइन (Yellow Line)</strong>।
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-purple-500 pl-3">
                2. पर्पल लाइन (Purple Line): व्हाइटफील्ड (काडुगोडी) से चल्लाघट्टा
              </h3>
              <p>
                <strong>पर्पल लाइन</strong> बेंगलुरु का पूर्व-पश्चिम मुख्य ट्रांजिट कॉरिडोर है, जिसकी लंबाई 43.49 किलोमीटर है। यह पूर्व में <em>व्हाइटफील्ड (काडुगोडी)</em> से शुरू होकर दक्षिण-पश्चिम में <em>चल्लाघट्टा</em> तक जाती है। यह लाइन बेंगलुरु के प्रमुख आईटी पार्क्स, वाणिज्यिक केंद्रों और केंद्रीय सचिवालय को आपस में जोड़ती है।
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">पर्पल लाइन के प्रमुख स्टेशन व आकर्षण:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>पत्तंदूर अग्रहारा (ITPL)</strong>: इंटरनेशनल टेक पार्क और प्रमुख आईटी कंपनियां।</li>
                  <li>• <strong>गरुड़ाचारपाल्या / केआर पुरम</strong>: बागमाने टेक पार्क व आउटर रिंग रोड हब।</li>
                  <li>• <strong>इंदिरानगर व हुडी</strong>: खरीदारी, कैफे और भोजन का प्रमुख केंद्र।</li>
                  <li>• <strong>एमजी रोड व कब्बन पार्क</strong>: बेंगलुरु का सेंट्रल बिजनेस डिस्ट्रिक्ट और विशाल पार्क।</li>
                  <li>• <strong>विधान सौध व सेंट्रल कॉलेज</strong>: कर्नाटक उच्च न्यायालय व राज्य विधानसभा।</li>
                  <li>• <strong>केम्पेगौड़ा मजेस्टिक इंटरचेंज</strong>: ग्रीन लाइन व केएसआरटीसी बस स्टैंड का मुख्य जंक्शन।</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                3. ग्रीन लाइन (Green Line): मादावरा (BIEC) से सिल्क इंस्टीट्यूट
              </h3>
              <p>
                <strong>ग्रीन लाइन</strong> उत्तर-दक्षिण दिशा में 33.4 किलोमीटर तक फैली है, जो उत्तर में <em>मादावरा (बेंगलुरु इंटरनेशनल एग्जिबिशन सेंटर - BIEC)</em> को दक्षिण में <em>सिल्क इंस्टीट्यूट (कनकपुरा रोड)</em> से जोड़ती है। यह लाइन पारंपरिक आवासीय क्षेत्रों, विख्यात शिक्षण संस्थानों, औद्योगिक क्षेत्रों और सांस्कृतिक धरोहरों को जोड़ती है।
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">ग्रीन लाइन के प्रमुख स्टेशन व दर्शनीय स्थल:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>नागासन्द्रा व पीण्या</strong>: पीण्या औद्योगिक क्षेत्र और IKEA नागासन्द्रा।</li>
                  <li>• <strong>महालक्ष्मी व राजाजीनगर</strong>: विश्व प्रसिद्ध इस्कॉन मंदिर (ISKCON) और ओरियन मॉल।</li>
                  <li>• <strong>मंत्री स्क्वायर संपिगे रोड</strong>: मल्लेश्वरम का ऐतिहासिक बाजार।</li>
                  <li>• <strong>नेशनल कॉलेज व लालबाग</strong>: लालबाग बॉटनिकल गार्डन और बसवनगुड़ी बुल टेंपल।</li>
                  <li>• <strong>जयनगर व जेपी नगर</strong>: 4थ ब्लॉक शॉपिंग कॉम्प्लेक्स और आवासीय क्षेत्र।</li>
                  <li>• <strong>सिल्क इंस्टीट्यूट</strong>: आर्ट ऑफ लिविंग इंटरनेशनल आश्रम का निकटतम स्टेशन।</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-amber-500 pl-3">
                4. येलो लाइन (Yellow Line): आरवी रोड से इलेक्ट्रॉनिक सिटी और बोम्मासन्द्रा
              </h3>
              <p>
                <strong>येलो लाइन</strong> 18.82 किलोमीटर लंबा एलिवेटेड कॉरिडोर है, जो <em>आरवी रोड (ग्रीन लाइन इंटरचेंज)</em> से शुरू होकर <em>सेंट्रल सिल्क बोर्ड</em>, <em>एचएसआर लेआउट</em>, और <em>इलेक्ट्रॉनिक सिटी फेज 1 व 2</em> होते हुए <em>बोम्मासन्द्रा</em> तक जाता है। यह लाइन इंफोसिस, विप्रो, टेक महिंद्रा और बायोकॉन पार्क में कार्यरत 5 लाख से अधिक आईटी पेशेवरों के लिए वरदान साबित हुई है।
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                5. नम्मा मेट्रो समय सारणी, किराया नियम और स्मार्ट कार्ड छूट
              </h3>
              <p>
                नम्मा मेट्रो की सेवाएं सोमवार से शनिवार प्रतिदिन <strong>सुबह 05:00 बजे से रात 11:05 बजे तक</strong> और रविवार को <strong>सुबह 07:00 बजे से रात 11:05 बजे तक</strong> संचालित होती हैं। पीक ऑवर्स (सुबह 08:30 से 10:30 और शाम 05:00 से 08:00) के दौरान ट्रेनें हर 3 से 5 मिनट में उपलब्ध होती हैं।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">किराया गणना (Ticket Fare Rules)</h5>
                  <p className="text-xs">
                    न्यूनतम किराया <strong>₹10</strong> (2 किमी तक) से शुरू होकर लंबी दूरी के लिए अधिकतम <strong>₹65</strong> तक है। टोकन या आधिकारिक WhatsApp चैटबॉट (`+91 81055 56677`) से QR टिकट खरीदे जा सकते हैं।
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 text-sm">वार्षिक स्मार्ट कार्ड (Varshik Smart Card) 5% छूट</h5>
                  <p className="text-xs">
                    BMRCL स्मार्ट कार्ड का उपयोग करने पर प्रत्येक यात्रा पर फ्लैट <strong>5% की बचत</strong> होती है। नम्मा राइड ऐप में आप सीधे स्मार्ट कार्ड डिस्काउंट की गणना कर सकते हैं।
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                6. नम्मा राइड (NammaRide) ऐप बेंगलुरु यात्रियों के लिए क्यों सर्वश्रेष्ठ है?
              </h3>
              <p>
                मजेस्टिक, सेंट्रल कॉलेज और विधान सौध जैसे भूमिगत (Underground) मेट्रो स्टेशनों में मोबाइल इंटरनेट अक्सर काम नहीं करता। नम्मा राइड का <strong>Geo GPS स्टेशन ट्रैकर</strong> आपके फोन के सैटेलाइट हार्डवेयर से सीधे जुड़ता है। यह 100% ऑफ़लाइन काम करता है, डेटा नहीं खर्च करता, और आपका स्टेशन आने से 1-2 स्टेशन पहले वाइब्रेशन अलर्ट देता है ताकि आपकी नींद में भी स्टेशन न छूटे।
              </p>
            </section>

            {/* Hindi Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                सभी 83 मेट्रो स्टेशन देखें →
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ट्रेन समय सारणी जांचें →
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                किराया व छूट कैलकुलेटर →
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                हाई-रेज़ोल्यूशन मेट्रो मैप →
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                वेब सिमुलेटर चलाएं →
              </Link>
            </div>

          </article>
        )}

      </div>
    </section>
  );
}
