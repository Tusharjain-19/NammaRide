import React from 'react';
import { ShieldCheck, Phone, HeartHandshake, Eye, Volume2, Moon, Lock, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SafetyPage() {
  const { lang, t } = useLanguage();

  const helplines = [
    { title: 'BMRCL Control Room', phone: '080-4100-4100', desc: 'Central emergency response & lost-and-found' },
    { title: 'Metro Police Helpline', phone: '080-4100-5555', desc: 'On-station security & law enforcement' },
    { title: 'Women Safety Helpline', phone: '1800-425-2257', desc: 'Toll-free 24/7 women commuter assistance' },
    { title: 'Commuter Support Email', phone: 'submit.bmrcl@gmail.com', desc: 'BMRCL feedback & grievance portal', isEmail: true }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-ambient-grid">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Inclusive Transit & Emergency Portal</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
            {t('safety')}
          </h1>
          <p className="text-gray-300 text-sm">
            Emergency contacts, wheelchair accessibility features, and safety guidelines for Bengaluru Metro.
          </p>
        </div>

        {/* EMERGENCY CONTACTS GRID */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            <span>{t('emergencyHelplines')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helplines.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-3">
                <h3 className="font-heading font-bold text-lg text-white">{item.title}</h3>
                <p className="text-xs text-gray-300">{item.desc}</p>
                <div className="pt-2">
                  {item.isEmail ? (
                    <a
                      href={`mailto:${item.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-emerald-400 border border-gray-800 font-mono font-bold text-xs hover:bg-gray-800"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </a>
                  ) : (
                    <a
                      href={`tel:${item.phone.replace(/-/g, '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 font-mono font-extrabold text-sm"
                    >
                      <Phone className="w-4 h-4 text-red-400" />
                      <span>{item.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACCESSIBILITY & INCLUSIVITY FEATURES */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-8">
          <h2 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            <span>Divyangjan Accessibility Features ♿</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Wheelchair */}
            <div className="space-y-3 bg-gray-900/80 p-5 rounded-2xl border border-gray-800">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <span>♿ Wheelchair Friendly</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                <li>3 to 6 elevator units per station</li>
                <li>Ramp access from street level to concourse</li>
                <li>Level platform boarding with zero gap</li>
                <li>Accessible restrooms at concourse level</li>
              </ul>
            </div>

            {/* Visual Impairment */}
            <div className="space-y-3 bg-gray-900/80 p-5 rounded-2xl border border-gray-800">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Visual Assistance</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                <li>Tactile yellow pathways from entrance to platforms</li>
                <li>Bilingual audio announcements inside trains & stations</li>
                <li>Braille buttons inside elevators</li>
              </ul>
            </div>

            {/* Hearing & Elderly */}
            <div className="space-y-3 bg-gray-900/80 p-5 rounded-2xl border border-gray-800">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>Hearing & Priority Seats</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                <li>Digital LED route maps inside train coaches</li>
                <li>Designated priority seating for seniors & pregnant women</li>
                <li>Women-only designated front coach in every train</li>
              </ul>
            </div>

          </div>
        </div>

        {/* NIGHT TRAVEL SAFETY */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400" />
            <span>Night Commuting Safety Tips</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-300 leading-relaxed list-disc list-inside">
            <li><strong>CCTV Coverage:</strong> 100% of platforms, concourses, and train coaches are monitored live by security personnel.</li>
            <li><strong>Women Compartment:</strong> The first coach in the direction of train travel is reserved exclusively for women.</li>
            <li><strong>Emergency Alarm Buttons:</strong> Located every 50 meters on platforms and near train doors for instant driver contact.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
