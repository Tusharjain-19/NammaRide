import React from 'react';
import { ShieldAlert, BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs text-gray-600 dark:text-gray-400">
        
        <div className="text-center space-y-3 pb-4 border-b border-gray-100 dark:border-gray-850">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-purple-500" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last Updated: August 22, 2026</p>
        </div>

        <div className="space-y-4 leading-relaxed">
          <p>
            By downloading, installing, or browsing the <strong>NammaRide</strong> application and promo website, you agree to comply with the terms of usage detailed below.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-500" />
            <span className="text-amber-500">1. Official BMRCL Affiliation Disclaimer</span>
          </h3>
          <p>
            <strong>IMPORTANT:</strong> NammaRide is a completely independent commuter transit guide developed by students. It is <strong>NOT affiliated with, sponsored by, or endorsed by Bangalore Metro Rail Corporation Limited (BMRCL)</strong>. 
          </p>
          <p>
            All station routes, fare structures, platform details, and timings are fetched from public timetables. While we strive to maintain high accuracy, BMRCL schedules can shift due to maintenance or demand. Always follow official station displays and staff directions inside metro zones.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">2. Accuracy of Timetable & Fares</h3>
          <p>
            NammaRide calculates fares (including BMRCL 5% Smart Card discounts) and routes offline. These values are estimates. We are not responsible for any financial losses, delayed commutes, missed flights, or ticketing disputes arising from BMRCL transit delays.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">3. Acceptable Use</h3>
          <p>
            You agree to use NammaRide strictly for personal, non-commercial transit planning. You must not reverse-engineer, modify, or scrape route databases to build copycat commercial transit products.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">4. Support & Disclosures</h3>
          <p>
            This app is provided "as is" without warranty of any kind. For feature adjustments or inquiries, contact our support team at <a href="mailto:jaint0910@gmail.com" className="font-bold text-purple-600 dark:text-purple-400 underline">jaint0910@gmail.com</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
