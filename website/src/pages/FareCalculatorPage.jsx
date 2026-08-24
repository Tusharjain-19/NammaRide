import React, { useState } from 'react';
import { Zap, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stationsData } from '../data/stationsData';
import { useLanguage } from '../context/LanguageContext';

export default function FareCalculatorPage() {
  const { lang, t } = useLanguage();
  const [fromStation, setFromStation] = useState('whitefield');
  const [toStation, setToStation] = useState('majestic');
  const [commuteDays, setCommuteDays] = useState(22);

  const baseFare = 50; 
  const smartCardFare = Math.round(baseFare * 0.9); // 10% discount per design.md
  const savingsPerTrip = baseFare - smartCardFare;
  const monthlySavings = savingsPerTrip * 2 * commuteDays;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] py-12 px-4 sm:px-6 lg:px-8 bg-ambient-grid transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Smart Card & Pass Optimizer</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
            {t('fareCalculator')}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">
            Compare cash token prices against 10% Smart Card / QR discounts and calculate your monthly commuter savings.
          </p>
        </div>

        {/* CALCULATOR WIDGET CARD */}
        <div className="glass-panel p-8 sm:p-10 rounded-[36px] border border-amber-500/30 space-y-8 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Station - Solid Dropdown per design.md */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">From Station</label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full p-4 rounded-2xl dropdown-opaque font-bold text-sm focus:outline-none transition-colors shadow-md"
              >
                {stationsData.map((st) => (
                  <option key={st.id} value={st.id}>
                    {lang === 'kn' ? st.name_kn : st.name_en} ({st.code})
                  </option>
                ))}
              </select>
            </div>

            {/* To Station - Solid Dropdown per design.md */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">To Station</label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full p-4 rounded-2xl dropdown-opaque font-bold text-sm focus:outline-none transition-colors shadow-md"
              >
                {stationsData.map((st) => (
                  <option key={st.id} value={st.id}>
                    {lang === 'kn' ? st.name_kn : st.name_en} ({st.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FARE RESULTS DISPLAY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            
            {/* Token Cash Fare */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center space-y-2">
              <div className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">{t('cashToken')}</div>
              <div className="text-4xl font-mono font-black text-[var(--text-primary)]">₹{baseFare}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">Single trip token price</div>
            </div>

            {/* Smart Card Discounted Fare */}
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/40 text-center space-y-2 relative overflow-hidden">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-gray-950 font-extrabold text-[9px] uppercase">
                Save 10%
              </span>
              <div className="text-xs text-amber-500 font-bold uppercase tracking-wider">{t('smartCard')}</div>
              <div className="text-4xl font-mono font-black text-amber-500">₹{smartCardFare}</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-300">Save ₹{savingsPerTrip} every single trip</div>
            </div>

          </div>

          {/* MONTHLY SAVINGS CALCULATOR */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Monthly Commuter Savings</h3>
              <span className="text-xs font-mono font-bold text-emerald-500">₹{monthlySavings} Saved / Month</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span>Commute Days Per Month:</span>
              <input
                type="number"
                value={commuteDays}
                onChange={(e) => setCommuteDays(Number(e.target.value))}
                className="w-20 p-2 rounded-xl dropdown-opaque text-center font-mono font-bold"
                min="1"
                max="31"
              />
            </div>
          </div>

        </div>

        {/* TOURIST PASS RECOMMENDATIONS */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">BMRCL Unlimited Tourist Passes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-heading font-bold text-lg text-[var(--text-primary)]">1-Day Unlimited Pass</h4>
                <span className="text-emerald-500 font-mono font-black text-xl">₹150</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Unlimited metro rides across Purple, Green & Yellow lines for 1 full calendar day. ₹50 refundable card deposit included.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-heading font-bold text-lg text-[var(--text-primary)]">3-Day Unlimited Pass</h4>
                <span className="text-emerald-500 font-mono font-black text-xl">₹350</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Ideal for weekend tourists and business travelers. Unlimited rides across the entire network for 3 consecutive days.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
