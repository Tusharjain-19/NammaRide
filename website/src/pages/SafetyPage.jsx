import React from 'react';
import { ShieldCheck, Phone, HeartHandshake, Eye, Volume2, Moon, Lock, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MetaSEO from '../components/MetaSEO';

export default function SafetyPage() {
  const { lang, t } = useLanguage();

  const helplines = [
    { title: 'BMRCL Control Room', phone: '080-4100-4100', desc: 'Central emergency response & lost-and-found' },
    { title: 'Metro Police Helpline', phone: '080-4100-5555', desc: 'On-station security & law enforcement' },
    { title: 'Women Safety Helpline', phone: '1800-425-2257', desc: 'Toll-free 24/7 women commuter assistance' },
    { title: 'Commuter Support Email', phone: 'submit.bmrcl@gmail.com', desc: 'BMRCL feedback & grievance portal', isEmail: true }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <MetaSEO
        title="Safety Guidelines & Emergency Helplines — Bengaluru Namma Metro"
        description="Official BMRCL helpline numbers (080-4100-4100), women's safety coach details, lost & found instructions, and Divyangjan accessibility features."
        canonicalPath="/safety"
      />
      <div className="max-w-5xl mx-auto space-y-12 pt-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500 dark:text-red-400" />
            <span>Inclusive Transit & Emergency Portal</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            {t('safety')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Emergency contacts, wheelchair accessibility features, and safety guidelines for Bengaluru Metro.
          </p>
        </div>

        {/* WOMEN'S COACH GUIDE & EMERGENCY SAFETY BAR */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-500 flex items-center justify-center shrink-0 border border-pink-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-wider mb-1">
                  High Priority Safety
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white">
                  Coach 1: Women's Reserved Coach & Safety Bar
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:1091"
                className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Women SOS 1091</span>
              </a>
              <a
                href="tel:112"
                className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95 font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <span>Police 112</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-pink-500/20 space-y-2">
              <div className="text-xs font-black uppercase text-pink-600 dark:text-pink-400">1. Platform Location</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Coach 1 is positioned at the <strong>front / leading end</strong> of the train in the direction of travel. Follow pink platform floor decals for boarding.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-pink-500/20 space-y-2">
              <div className="text-xs font-black uppercase text-pink-600 dark:text-pink-400">2. Emergency PEA Intercom</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Passenger Emergency Alarm (PEA) handles are installed next to every door. Pull the handle to speak directly with the train operator in real time.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-pink-500/20 space-y-2">
              <div className="text-xs font-black uppercase text-pink-600 dark:text-pink-400">3. BMRCL 24/7 Rapid Response</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Station controllers and female security marshals are stationed on all operational platforms. Dial <a href="tel:08022969555" className="text-pink-500 font-bold hover:underline">080-22969555</a> for instant help.
              </p>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACTS GRID */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500 dark:text-red-400" />
            <span>{t('emergencyHelplines')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helplines.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-3">
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">{item.desc}</p>
                <div className="pt-2">
                  {item.isEmail ? (
                    <a
                      href={`mailto:${item.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800 font-mono font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </a>
                  ) : (
                    <a
                      href={`tel:${item.phone.replace(/-/g, '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-300 border border-red-500/40 font-mono font-extrabold text-sm"
                    >
                      <Phone className="w-4 h-4 text-red-500 dark:text-red-400" />
                      <span>{item.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACCESSIBILITY & INCLUSIVITY FEATURES */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-8">
          <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            <span>Divyangjan Accessibility Features ♿</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Wheelchair */}
            <div className="space-y-3 bg-gray-50 dark:bg-neutral-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span>♿ Wheelchair Friendly</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>3 to 6 elevator units per station</li>
                <li>Ramp access from street level to concourse</li>
                <li>Level platform boarding with zero gap</li>
                <li>Accessible restrooms at concourse level</li>
              </ul>
            </div>

            {/* Visual Impairment */}
            <div className="space-y-3 bg-gray-50 dark:bg-neutral-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>Visual Assistance</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>Tactile yellow pathways from entrance to platforms</li>
                <li>Bilingual audio announcements inside trains & stations</li>
                <li>Braille buttons inside elevators</li>
              </ul>
            </div>

            {/* Hearing & Elderly */}
            <div className="space-y-3 bg-gray-50 dark:bg-neutral-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Hearing & Priority Seats</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>Digital LED route maps inside train coaches</li>
                <li>Designated priority seating for seniors & pregnant women</li>
                <li>Women-only designated front coach in every train</li>
              </ul>
            </div>

          </div>
        </div>

        {/* NIGHT TRAVEL SAFETY */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
          <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>Night Commuting Safety Tips</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside">
            <li><strong>CCTV Coverage:</strong> 100% of platforms, concourses, and train coaches are monitored live by security personnel.</li>
            <li><strong>Women Compartment:</strong> The first coach in the direction of train travel is reserved exclusively for women.</li>
            <li><strong>Emergency Alarm Buttons:</strong> Located every 50 meters on platforms and near train doors for instant driver contact.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
