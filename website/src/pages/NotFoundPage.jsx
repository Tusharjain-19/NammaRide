import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Navigation, Map, MapPin, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { lang } = useLanguage();

  const content = {
    en: {
      badge: 'Error 404 • Signal Lost',
      title: 'Out of Track!',
      subtitle: 'The station or route you are looking for has departed or does not exist.',
      desc: 'Double check the station URL or hop back on the main line to continue navigating Bengaluru Metro.',
      homeBtn: 'Back to Route Planner',
      mapBtn: 'View Metro Map',
      exploreBtn: 'Explore Bengaluru',
      tagline: 'NammaRide Bengaluru Transit System'
    },
    hi: {
      badge: 'त्रुटि 404 • सिग्नल बंद',
      title: 'गलत रूट पर आ गए!',
      subtitle: 'जिस स्टेशन या पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है या छूट चुका है।',
      desc: 'यूआरएल की जांच करें या बेंगलुरु मेट्रो नेविगेट करने के लिए मुख्य लाइन पर वापस लौटें।',
      homeBtn: 'रूट प्लानर पर लौटें',
      mapBtn: 'मेट्रो मैप देखें',
      exploreBtn: 'बेंगलुरु एक्सप्लोर करें',
      tagline: 'नम्मा राइड बेंगलुरु ट्रांजिट'
    },
    kn: {
      badge: 'ದೋಷ 404 • ಸಿಗ್ನಲ್ ವ್ಯತ್ಯಯ',
      title: 'ತಪ್ಪು ಮಾರ್ಗ ತಲುಪಿದ್ದೀರಿ!',
      subtitle: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ನಿಲ್ದಾಣ ಅಥವಾ ಪುಟ ಲಭ್ಯವಿಲ್ಲ.',
      desc: 'ದಯವಿಟ್ಟು ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ನಮ್ಮ ಮೆಟ್ರೋ ಪ್ರಯಾಣವನ್ನು ಮುಂದುವರಿಸಲು ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
      homeBtn: 'ಮಾರ್ಗ ಯೋಜನೆಗೆ ಹಿಂತಿರುಗಿ',
      mapBtn: 'ಮೆಟ್ರೋ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ',
      exploreBtn: 'ಬೆಂಗಳೂರು ಅನ್ವೇಷಿಸಿ',
      tagline: 'ನಮ್ಮ ರೈಡ್ ಬೆಂಗಳೂರು ಸಾರಿಗೆ'
    }
  };

  const t = content[lang] || content.en;

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-950 dark:to-black flex items-center justify-center transition-colors duration-300">
      <div className="max-w-lg w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[40px] border border-gray-200/80 dark:border-neutral-800 text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Metro Background Line Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Metro Train animated SVG illustration */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full text-emerald-500 dark:text-emerald-400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Metro Track Lines */}
            <path d="M 20 160 Q 100 130 180 160" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" opacity="0.6" />
            <path d="M 20 170 Q 100 140 180 170" stroke="#10B981" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
            <path d="M 20 180 Q 100 150 180 180" stroke="#EAB308" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" opacity="0.6" />

            {/* Glowing 404 Pin */}
            <circle cx="100" cy="80" r="45" fill="currentColor" fillOpacity="0.08" />
            <circle cx="100" cy="80" r="32" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
            <circle cx="100" cy="80" r="12" fill="currentColor" fillOpacity="0.2" />

            {/* Metro Front Body */}
            <rect x="72" y="55" width="56" height="50" rx="14" fill="#0F172A" stroke="currentColor" strokeWidth="3" />
            {/* Windshield */}
            <rect x="79" y="63" width="42" height="20" rx="6" fill="#38BDF8" fillOpacity="0.8" />
            {/* Headlights */}
            <circle cx="84" cy="94" r="4" fill="#FBBF24" />
            <circle cx="116" cy="94" r="4" fill="#FBBF24" />
          </svg>

          <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20 font-mono shadow-sm">
            404
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {t.badge}
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm leading-relaxed max-w-sm mx-auto">
            {t.subtitle}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to="/"
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            <Navigation className="w-4 h-4" />
            <span>{t.homeBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/map"
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Map className="w-3.5 h-3.5 text-purple-500" />
              <span>{t.mapBtn}</span>
            </Link>

            <Link
              to="/explore"
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-neutral-700"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.exploreBtn}</span>
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">
          {t.tagline}
        </p>

      </div>
    </div>
  );
}
