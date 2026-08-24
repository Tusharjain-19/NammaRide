import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Zap, QrCode, Clock, Smartphone, Compass, ShieldCheck, Globe, Moon, Download, ArrowRight } from 'lucide-react';
import googlePlayImg from '../../assets/images/google play.svg';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: <Navigation className="w-7 h-7 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      title: 'Smart Route Finder & Interchange Advice',
      description: 'Calculates the fastest route between any two Bengaluru Metro stations, specifying exact interchange stations (like Nadaprabhu Kempegowda Station Majestic), platforms, and total journey duration.',
      badge: 'Core Feature'
    },
    {
      icon: <Zap className="w-7 h-7 text-amber-400" />,
      iconBg: 'bg-amber-500/10 border-amber-500/30',
      title: 'Live Fare Calculator',
      description: 'Provides exact BMRCL fare breakdowns (ranging from ₹10 minimum fare to ₹60 maximum cross-city fare) including 5% discounts for Smart Card and QR ticket users.',
      badge: 'Fare System'
    },
    {
      icon: <QrCode className="w-7 h-7 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/30',
      title: 'Turnstile QR Ticket Saver & 100% Brightness Gate View',
      description: 'Never fumble with your gallery at turnstile gates. Store your QR ticket screenshot in NammaRide and launch the fullscreen scanner with 100% automatic brightness boost.',
      badge: 'Exclusive'
    },
    {
      icon: <Clock className="w-7 h-7 text-blue-400" />,
      iconBg: 'bg-blue-500/10 border-blue-500/30',
      title: 'First & Last Train Schedules',
      description: 'Accurate morning 05:00 AM start times and late night 11:05 PM terminal departure schedules across Purple, Green, and Yellow lines.',
      badge: 'Timings'
    },
    {
      icon: <Smartphone className="w-7 h-7 text-pink-400" />,
      iconBg: 'bg-pink-500/10 border-pink-500/30',
      title: '100% Offline Underground Operation',
      description: 'No network signal underground? No problem. Route data, station maps, fares, and saved QR tickets work completely offline without internet connection.',
      badge: 'Offline Mode'
    },
    {
      icon: <Compass className="w-7 h-7 text-teal-400" />,
      iconBg: 'bg-teal-500/10 border-teal-500/30',
      title: 'Station Places & City Landmarks',
      description: 'Explore tourist attractions, tech parks (Whitefield, Electronic City), shopping centers, and hospitals near each metro station.',
      badge: 'City Guide'
    },
    {
      icon: <Globe className="w-7 h-7 text-indigo-400" />,
      iconBg: 'bg-indigo-500/10 border-indigo-500/30',
      title: 'Multi-Language Support (EN, HI, KN)',
      description: 'Seamlessly switch between English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ) for native station names and transit navigation.',
      badge: 'Accessibility'
    },
    {
      icon: <Moon className="w-7 h-7 text-yellow-400" />,
      iconBg: 'bg-yellow-500/10 border-yellow-500/30',
      title: 'Dark & Light Mode System',
      description: 'Designed for ultimate readability under bright Bengaluru sunlight or low-light evening commutes.',
      badge: 'UI Design'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-section-gap px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>Built For Namma Bengaluru</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            Features & Capabilities
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Discover why thousands of Bengaluru commuters rely on NammaRide for daily transit.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((item, index) => (
            <div
              key={index}
              className="glass-panel p-8 rounded-3xl border border-gray-800 glass-panel-hover space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-13 h-13 p-3 rounded-2xl border flex items-center justify-center shadow-md ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-2xl text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-panel p-10 rounded-[36px] border border-emerald-500/30 text-center space-y-6">
          <h2 className="font-heading font-extrabold text-3xl text-white">Experience all features live</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/simulator"
              className="h-12 px-8 rounded-[14px] bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Test Web Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=site.nammaride.app"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 drop-shadow-md"
            >
              <img src={googlePlayImg} alt="Get it on Google Play" className="h-12 w-auto object-contain" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
