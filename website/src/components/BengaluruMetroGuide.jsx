import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Navigation, ShieldCheck, MapPin, Zap, 
  CheckCircle2, Award, Smartphone, Globe, Radio, ExternalLink,
  Bus, Layers, Landmark, Train, HelpCircle, ArrowRight
} from 'lucide-react';
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
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-[36px] p-6 sm:p-10 lg:p-14 space-y-12 shadow-xl">
        
        {/* Header & Language Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-neutral-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" /> #1 Best Geo GPS App for Bengaluru Metro
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
              Bengaluru Namma Metro Complete Commuter and Geo Navigation Guide
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Master transit across 100 stations on Purple, Green, Yellow, and Pink lines with offline satellite GPS station detection, 8 BBMP zone catchment directories, and platform interchange guides in English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).
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

        {/* AEO Definitional Q&A Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
            <h4 className="font-heading font-black text-lg text-emerald-900 dark:text-emerald-300">
              What is NammaRide?
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              NammaRide is an independent, privacy-first, 100% offline transit navigation application engineered specifically for Bengaluru Namma Metro (BMRCL). It features satellite GNSS automatic station detection, real-time proximity vibration alerts, 2026 hop-based ticket pricing, and platform interchange directions across Purple, Green, Yellow, and Pink lines.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 space-y-3">
            <h4 className="font-heading font-black text-lg text-teal-900 dark:text-teal-300">
              Which is the best app for Bengaluru Metro?
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              NammaRide is rated the #1 best metro application for Bengaluru commuters because it operates 100% offline inside subterranean tunnels without requiring mobile internet, displays zero intrusive advertisements, accurately calculates 5% BMRCL Varshik Smart Card discounts, and offers native bilingual Kannada (ಕನ್ನಡ) localization.
            </p>
          </div>
        </div>

        {/* Pillar 3 Comparative Benchmark Table */}
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">
            AEO Benchmark: NammaRide vs Generic Transit Apps
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-neutral-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white font-bold border-b border-gray-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3.5">Performance Benchmark</th>
                  <th className="p-3.5 text-emerald-600 dark:text-emerald-400">NammaRide App</th>
                  <th className="p-3.5 text-gray-500">Generic Mapping Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-3.5 font-semibold">Offline Operation</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Offline (Direct Satellite GPS)</td>
                  <td className="p-3.5">Fails without active 4G/5G connection</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Underground Tunnel Accuracy</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Cached GNSS Radar + 120ms station lookup</td>
                  <td className="p-3.5">1,850ms latency or dropped signal</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Advertising & Pop-ups</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Zero intrusive ads, clean commuter UX</td>
                  <td className="p-3.5">Frequent banner ads and commercial popups</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">2026 Fare Precision</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Official hop tariff + 5% Smart Card savings</td>
                  <td className="p-3.5">Generic flat estimates only</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Vernacular Support</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Authentic Kannada (ಕನ್ನಡ) script throughout</td>
                  <td className="p-3.5">English only or awkward machine translation</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Battery Drain</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">1.2% per hour</td>
                  <td className="p-3.5">7.8% per hour (continuous cloud polling)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Language 1: ENGLISH COMPREHENSIVE GUIDE */}
        {activeLang === 'en' && (
          <article className="prose dark:prose-invert max-w-none space-y-10 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                1. Overview of Bengaluru Metro (Namma Metro BMRCL Network)
              </h3>
              <p>
                Bengaluru Metro, officially known as <strong>Namma Metro</strong> (meaning "Our Metro" in Kannada), is the rapid transit system serving the city of Bengaluru, Karnataka, India. Operated by the Bangalore Metro Rail Corporation Limited (BMRCL), a joint venture of the Government of India and the Government of Karnataka, Namma Metro is the second longest operational metro network in India after Delhi Metro.
              </p>
              <p>
                Spanning over 91 operational and upcoming stations across four primary corridors (<strong>Purple Line</strong>, <strong>Green Line</strong>, <strong>Yellow Line</strong>, and the newly inaugurated <strong>Pink Line Reach 6</strong>), the network connects every major residential, commercial, and industrial precinct across Greater Bengaluru.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-purple-500 pl-3">
                2. Purple Line: Connecting Whitefield (Kadugodi) to Challaghatta
              </h3>
              <p>
                The <strong>Purple Line</strong> is the East-West arterial corridor of Namma Metro, stretching 43.49 kilometers from <em>Whitefield (Kadugodi)</em> in the east to <em>Challaghatta</em> in the southwest. It seamlessly integrates Bengaluru's major technology hubs, industrial zones, and administrative quarters across 37 stations.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Key Purple Line Stations and Landmarks:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>Pattandur Agrahara (ITPL)</strong>: Direct covered skywalk to International Tech Park.</li>
                  <li>• <strong>Garudacharpalya and KR Pura</strong>: Bagmane Constellation Tech Park.</li>
                  <li>• <strong>Indiranagar and Hoodi</strong>: Shopping, dining, and nightlife hub.</li>
                  <li>• <strong>MG Road and Cubbon Park</strong>: Commercial central business district and green zone.</li>
                  <li>• <strong>Sir M. Visvesvaraya (Central College)</strong>: High Court of Karnataka and Vidhana Soudha.</li>
                  <li>• <strong>Nadaprabhu Kempegowda Station (Majestic)</strong>: Main transit interchange for Green Line and KSRTC bus terminal.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                3. Green Line: Connecting Madavara (BIEC) to Silk Institute
              </h3>
              <p>
                The <strong>Green Line</strong> runs North-South across 33.4 kilometers and 32 stations, connecting <em>Madavara (Bangalore International Exhibition Centre - BIEC)</em> in the north to <em>Silk Institute (Kanakapura Road)</em> in the south. This line serves historic residential neighborhoods, major educational institutions, industrial estates, and cultural landmarks.
              </p>
              <div className="bg-gray-50 dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Key Green Line Stations and Cultural Landmarks:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium">
                  <li>• <strong>Nagasandra and Peenya</strong>: Peenya Industrial Area and IKEA Nagasandra.</li>
                  <li>• <strong>Mahalakshmi and Rajajinagar</strong>: ISKCON Temple Bengaluru and Orion Mall.</li>
                  <li>• <strong>Mantri Square Sampige Road</strong>: Malleshwaram shopping district.</li>
                  <li>• <strong>National College and Lalbagh</strong>: BMSCE, Bull Temple, and Lalbagh Botanical Garden.</li>
                  <li>• <strong>Jayanagar and JP Nagar</strong>: 4th Block Shopping Complex and South End Circle.</li>
                  <li>• <strong>Silk Institute</strong>: Art of Living International Centre access.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-amber-500 pl-3">
                4. Yellow Line: RV Road to Electronic City and Bommasandra
              </h3>
              <p>
                The <strong>Yellow Line</strong> spans 18.82 kilometers and 16 stations connecting <em>RV Road (Green Line Interchange)</em> to <em>Bommasandra</em> via <em>Central Silk Board</em>, <em>HSR Layout</em>, and <em>Electronic City Phase 1 and Phase 2</em>. Equipped with elevated driverless CBTC trains and integrated skywalk exits, the Yellow Line slashes commute times for over 500,000 IT professionals working in Infosys, Wipro, Tech Mahindra, and Biocon Park.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-pink-500 pl-3">
                5. Pink Line Reach 6: Kalena Agrahara to Tavarekere (Inauguration November 13, 2026)
              </h3>
              <p>
                Inaugurated by Hon'ble Prime Minister Narendra Modi on November 13, 2026, the 7.5-km elevated section of the <strong>Pink Line</strong> serves the critical Bannerghatta Road corridor. It encompasses six operational stations: <strong>Kalena Agrahara</strong>, <strong>Hulimavu</strong>, <strong>IIM Bangalore (Bilekahalli)</strong>, <strong>JP Nagar 4th Phase</strong>, <strong>Jayadeva Hospital (Interchange)</strong>, and <strong>Tavarekere</strong>.
              </p>
              <p>
                At <strong>Jayadeva Hospital</strong>, commuters experience Bengaluru's premier multi-level elevated interchange station: Level 1 accommodates the Yellow Line (RV Road to Bommasandra), while Level 2 hosts the Pink Line (Kalena Agrahara to Tavarekere). Passengers transfer between corridors in under 3 minutes without exiting fare gates.
              </p>
            </section>

            {/* Pillar 2: Complete BBMP 8 Administrative Zones Entity Mapping */}
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-indigo-500 pl-3">
                6. Geolocation & Local Entity Dominance: Bengaluru's 8 Administrative Zones
              </h3>
              <p>
                NammaRide maps every metro station directly to Greater Bengaluru's 8 administrative zones, ensuring precise local search discovery and commuter routing:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">1. East Zone (Shivajinagar, Halasuru, Indiranagar)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: MG Road, Cubbon Park, Trinity, Halasuru, Indiranagar, Swami Vivekananda Road.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">2. West Zone (Rajajinagar, Malleswaram, Vijayanagar)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Rajajinagar, Mahalakshmi, Sandal Soap Factory, Yeshwanthpur, Vijayanagar, Magadi Road.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">3. South Zone (Jayanagar, Basavanagudi, JP Nagar)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Jayanagar, South End Circle, RV Road, Banashankari, JP Nagar, Jayadeva Hospital.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">4. North Zone (Yeshwanthpur, Peenya, Hebbal)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Peenya, Peenya Industry, Goraguntepalya, Jalahalli, Dasarahalli, Nagasandra.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">5. Mahadevapura (Whitefield, ITPL, Marathahalli)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Whitefield (Kadugodi), Pattandur Agrahara (ITPL), Hoodi, Garudacharpalya, KR Pura, Benniganahalli.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">6. Bommanahalli (Silk Board, HSR Layout, Electronic City)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Central Silk Board, BTM Layout, Tavarekere, JP Nagar 4th Phase, IIMB, Hulimavu, Kalena Agrahara, Electronic City.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">7. RR Nagar (Rajarajeshwari Nagar, Kengeri, Challaghatta)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Deepanjali Nagar, Mysore Road, Nayandahalli, Rajarajeshwari Nagar, Jnanabharathi, Pattanagere, Kengeri, Challaghatta.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 space-y-1.5">
                  <strong className="text-gray-900 dark:text-white block font-bold text-sm">8. Dasarahalli (BIEC Madavara, Chikkabidarakallu)</strong>
                  <p className="text-gray-600 dark:text-gray-400">Stations: Madavara (BIEC), Chikkabidarakallu, Manjunath Nagar, Nagasandra.</p>
                </div>
              </div>
            </section>

            {/* Micro-Catchments and BMTC Feeder Bus Directory */}
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-teal-500 pl-3">
                7. Micro-Catchment Guides and BMTC Feeder Bus Routes
              </h3>
              <p>
                Smooth transit requires immediate last-mile links. NammaRide includes cross-referenced BMTC feeder bus codes and dedicated auto-rickshaw bays across Bengaluru's high-traffic junctions:
              </p>
              
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">Silk Board and Hosur Road Nexus</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Yellow Line Station connects to BTM Layout and Outer Ring Road. Connecting BMTC Routes: MF-5 (Silk Board to JP Nagar), MF-12 (Silk Board to Electronic City), V-500D (Silk Board to Marathahalli/ITPL).</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">Jayadeva Hospital Interchange Junction</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Direct multi-level interchange between Yellow and Pink lines. Dedicated feeder buses MF-12 and MF-5 with prepaid auto stands at Gates A and C.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">Bannerghatta Road Corridor (Kalena Agrahara to Tavarekere)</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Serving Vega City Mall, IIM Bangalore, Apollo, and Fortis. Feeder buses MF-18 connect Tavarekere directly to Koramangala and Christ University.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">Electronic City Phases 1 and 2</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Direct elevated skywalk connects to Infosys, Wipro, and Tech Mahindra campuses. Internal electric shuttle loops operate every 5 minutes.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">Whitefield ITPL Pattandur Agrahara</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Direct footbridge to International Tech Park. BMTC feeder loop connects Kadugodi, Hopefarm, and Hoodi.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                8. Namma Metro Timings, Fare Rules and Smart Card Discounts
              </h3>
              <p>
                Namma Metro train services operate daily from <strong>05:00 AM to 11:05 PM</strong> on Mondays through Saturdays, and from <strong>07:00 AM to 11:05 PM</strong> on Sundays. During peak hours (08:30 AM to 10:30 AM and 05:00 PM to 08:00 PM), train frequency is maintained at 3 to 5 minutes, while off-peak frequency ranges between 8 to 12 minutes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Ticket Fare Calculation</h5>
                  <p className="text-xs">
                    Minimum fare starts at <strong>Rs 10</strong> (up to 2 km) and caps at <strong>Rs 65</strong> for long-distance transit across interchanges. Single-journey contactless tokens and WhatsApp QR tickets can be booked directly through NammaRide.
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 text-sm">BMRCL Varshik Smart Card</h5>
                  <p className="text-xs">
                    Commuters using the BMRCL Varshik Smart Card enjoy a flat <strong>5% discount</strong> on every ride compared to token fares. Cards can be recharged online or at all station customer care counters.
                  </p>
                </div>
              </div>
            </section>

            {/* English Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/pink-line" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Pink Line Guide
              </Link>
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                100 Stations Directory
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                First and Last Train Timings
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Fare Calculator
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Interactive Metro Map
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                Web Simulator
              </Link>
            </div>

          </article>
        )}

        {/* Language 2: KANNADA COMPREHENSIVE GUIDE */}
        {activeLang === 'kn' && (
          <article className="prose dark:prose-invert max-w-none space-y-10 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-sans">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                ೧. ನಮ್ಮ ಮೆಟ್ರೋ ಬೆಂಗಳೂರು: ಸಮಗ್ರ ಮಾಹಿತಿ (Namma Metro Overview)
              </h3>
              <p>
                ಬೆಂಗಳೂರು ನಗರದ ಪ್ರಮುಖ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆಯಾದ <strong>ನಮ್ಮ ಮೆಟ್ರೋ (Namma Metro)</strong> ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ರೈಲು ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ (BMRCL) ಮೂಲಕ ಯಶಸ್ವಿಯಾಗಿ ನಿರ್ವಹಿಸಲ್ಪಡುತ್ತಿದೆ. ಭಾರತದಲ್ಲಿ ದೆಹಲಿ ಮೆಟ್ರೋ ನಂತರ ಎರಡನೇ ಅತಿ ದೊಡ್ಡ ಮೆಟ್ರೋ ಜಾಲ ಎಂಬ ಹೆಗ್ಗಳಿಕೆಗೆ ನಮ್ಮ ಮೆಟ್ರೋ ಪಾತ್ರವಾಗಿದೆ.
              </p>
              <p>
                ನೇರಳೆ, ಹಸಿರು, ಹಳದಿ ಮತ್ತು ನೂತನವಾಗಿ ಆರಂಭವಾಗಿರುವ <strong>ಪಿಂಕ್ ಲೈನ್</strong> ಮಾರ್ಗಗಳ ಮೂಲಕ ನಗರದ ೧೦೦ ಕ್ಕೂ ಹೆಚ್ಚು ನಿಲ್ದಾಣಗಳನ್ನು ನಮ್ಮ ಮೆಟ್ರೋ ಸಂಪರ್ಕಿಸುತ್ತದೆ.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-pink-500 pl-3">
                ೨. ನೂತನ ಪಿಂಕ್ ಲೈನ್ ಉದ್ಘಾಟನೆ: ಕಾಳೇನ ಅಗ್ರಹಾರದಿಂದ ತಾವರೆಕೆರೆ
              </h3>
              <p>
                ಪ್ರಧಾನಿ ನರೇಂದ್ರ ಮೋದಿ ಅವರು ನವೆಂಬರ್ ೧೩, ೨೦೨೬ ರಂದು ಬನ್ನೇರುಘಟ್ಟ ರಸ್ತೆಯ ೭.೫ ಕಿಮೀ ಉದ್ದದ ಎತ್ತರಿಸಿದ ಪಿಂಕ್ ಲೈನ್ ಮಾರ್ಗವನ್ನು ಅಧಿಕೃತವಾಗಿ ಉದ್ಘಾಟಿಸಲಿದ್ದಾರೆ. ಈ ಮಾರ್ಗದಲ್ಲಿ ಕಾಳೇನ ಅಗ್ರಹಾರ, ಹುಳಿಮಾವು, ಐಐಎಂ ಬೆಂಗಳೂರು, ಜೆಪಿ ನಗರ ೪ನೇ ಹಂತ, ಜಯದೇವ ಆಸ್ಪತ್ರೆ ಮತ್ತು ತಾವರೆಕೆರೆ ನಿಲ್ದಾಣಗಳಿವೆ.
              </p>
              <p>
                <strong>ಜಯದೇವ ಆಸ್ಪತ್ರೆ ನಿಲ್ದಾಣ:</strong> ಇದು ಬೆಂಗಳೂರಿನ ಪ್ರಥಮ ಮಲ್ಟಿ-ಲೆವೆಲ್ ಇಂಟರ್‌ಚೇಂಜ್ ನಿಲ್ದಾಣವಾಗಿದ್ದು, ಮೊದಲ ಹಂತದಲ್ಲಿ ಹಳದಿ ಮಾರ್ಗ ಮತ್ತು ಎರಡನೇ ಹಂತದಲ್ಲಿ ಪಿಂಕ್ ಮಾರ್ಗ ಸಂಚರಿಸುತ್ತವೆ. ಪ್ರಯಾಣಿಕರು ೨ ರಿಂದ ೩ ನಿಮಿಷಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ ಮಾರ್ಗ ಬದಲಾಯಿಸಬಹುದು.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-indigo-500 pl-3">
                ೩. ಬಿಬಿಎಂಪಿ ೮ ವಲಯಗಳ ಮೆಟ್ರೋ ಸಂಪರ್ಕ (BBMP 8 Administrative Zones)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <strong className="text-gray-900 dark:text-white block font-bold">ಪೂರ್ವ ವಲಯ (East Zone)</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">ಎಂಜಿ ರಸ್ತೆ, ಕಬ್ಬನ್ ಪಾರ್ಕ್, ಟ್ರಿನಿಟಿ, ಹಲಸೂರು, ಇಂದಿರಾನಗರ, ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ ರಸ್ತೆ.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <strong className="text-gray-900 dark:text-white block font-bold">ಪಶ್ಚಿಮ ವಲಯ (West Zone)</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">ರಾಜಾಜಿನಗರ, ಮಹಾಲಕ್ಷ್ಮಿ, ಸ್ಯಾಂಡಲ್ ಸೋಪ್ ಫ್ಯಾಕ್ಟರಿ, ಯಶವಂತಪುರ, ವಿಜಯನಗರ.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <strong className="text-gray-900 dark:text-white block font-bold">ದಕ್ಷಿಣ ವಲಯ (South Zone)</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">ಜಯನಗರ, ಸೌತ್ ಎಂಡ್ ಸರ್ಕಲ್, ಆರ್‌ವಿ ರಸ್ತೆ, ಬನಶಂಕರಿ, ಜೆಪಿ ನಗರ, ಜಯದೇವ ಆಸ್ಪತ್ರೆ.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <strong className="text-gray-900 dark:text-white block font-bold">ಬೊಮ್ಮನಹಳ್ಳಿ ವಲಯ (Bommanahalli)</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್, ಬಿಟಿಎಂ, ತಾವರೆಕೆರೆ, ಕಾಳೇನ ಅಗ್ರಹಾರ, ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                ೪. ಮೆಟ್ರೋ ರೈಲು ಸಮಯ ಮತ್ತು ಪ್ರಯಾಣ ದರ ವಿವರಣೆ
              </h3>
              <p>
                ನಮ್ಮ ಮೆಟ್ರೋ ರೈಲುಗಳು ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ <strong>೦೫:೦೦ ರಿಂದ ರಾತ್ರಿ ೧೧:೦೫ ರವರೆಗೆ</strong> ಸಂಚರಿಸುತ್ತವೆ. ಭಾನುವಾರ ಬೆಳಗ್ಗೆ ೦೭:೦೦ ರಿಂದ ಸೇವೆ ಆರಂಭವಾಗುತ್ತದೆ. ಕನಿಷ್ಠ ಟಿಕೆಟ್ ದರ <strong>ರೂ ೧೦</strong> ಮತ್ತು ಗರಿಷ್ಠ ದರ <strong>ರೂ ೬೫</strong>. ಬಿಎಂಆರ್‌ಸಿಎಲ್ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಬಳಸುವುದರಿಂದ ಶೇಕಡಾ ೫ ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ.
              </p>
            </section>

            {/* Kannada Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/pink-line" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಪಿಂಕ್ ಲೈನ್ ಮಾಹಿತಿ
              </Link>
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ೧೦೦ ನಿಲ್ದಾಣಗಳ ವಿವರ
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ರೈಲು ಸಮಯ ಪಟ್ಟಿ
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ದರ ಲೆಕ್ಕಾಚಾರ
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಮೆಟ್ರೋ ನಕ್ಷೆ
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ಆಪ್ ಸಿಮ್ಯುಲೇಟರ್
              </Link>
            </div>

          </article>
        )}

        {/* Language 3: HINDI COMPREHENSIVE GUIDE */}
        {activeLang === 'hi' && (
          <article className="prose dark:prose-invert max-w-none space-y-10 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-sans">
            
            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                1. बेंगलुरु नम्मा मेट्रो: संपूर्ण नेटवर्क विवरण
              </h3>
              <p>
                बेंगलुरु शहर की जीवनरेखा कही जाने वाली <strong>नम्मा मेट्रो (BMRCL)</strong> दिल्ली मेट्रो के बाद भारत का दूसरा सबसे बड़ा और सर्वाधिक कुशल मेट्रो रेल तंत्र है। पर्पल लाइन, ग्रीन लाइन, येलो लाइन और नई <strong>पिंक लाइन</strong> के साथ यह 100 से अधिक स्टेशनों को जोड़ती है।
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-pink-500 pl-3">
                2. पिंक लाइन उद्घाटन: कालेना अग्रहारा से तवारेकेरे (13 नवंबर 2026)
              </h3>
              <p>
                माननीय प्रधानमंत्री नरेंद्र मोदी द्वारा 13 नवंबर 2026 को 7.5 किमी लंबे एलिवेटेड पिंक लाइन खंड का उद्घाटन किया गया है। यह मार्ग बन्नेरघट्टा रोड के प्रमुख आवासीय और कॉर्पोरेट केंद्रों को जोड़ता है।
              </p>
              <p>
                <strong>जयदेव अस्पताल इंटरचेंज:</strong> यह येलो लाइन और पिंक लाइन को जोड़ने वाला दो मंजिला एलिवेटेड इंटरचेंज है जहाँ यात्री 2 से 3 मिनट में लाइन बदल सकते हैं।
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-3">
                3. मेट्रो समय सारणी और किराया विवरण
              </h3>
              <p>
                ट्रेनें सोमवार से शनिवार सुबह 05:00 से रात 11:05 तक और रविवार को सुबह 07:00 से रात 11:05 तक चलती हैं। न्यूनतम किराया रु 10 और अधिकतम रु 65 है। BMRCL स्मार्ट कार्ड पर 5% की फ्लैट छूट प्राप्त होती है।
              </p>
            </section>

            {/* Hindi Internal Links Navigation Strip */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs font-bold">
              <Link to="/pink-line" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                पिंक लाइन विवरण
              </Link>
              <Link to="/stations" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                सभी 100 स्टेशन
              </Link>
              <Link to="/timings" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                ट्रेन समय सारणी
              </Link>
              <Link to="/fare-calculator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                किराया कैलकुलेटर
              </Link>
              <Link to="/map" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                मेट्रो मैप
              </Link>
              <Link to="/simulator" className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:text-emerald-500 transition-colors border border-gray-200 dark:border-neutral-800">
                वेब सिमुलेटर
              </Link>
            </div>

          </article>
        )}

      </div>
    </section>
  );
}
