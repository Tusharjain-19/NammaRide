import React from 'react';
import { Shield, EyeOff, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs text-gray-600 dark:text-gray-400">
        
        <div className="text-center space-y-3 pb-4 border-b border-gray-100 dark:border-gray-850">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Effective Date: August 22, 2026</p>
        </div>

        <div className="space-y-4 leading-relaxed">
          <p>
            At <strong>NammaRide</strong>, user privacy is our core value. NammaRide is designed to work completely offline, storing databases locally on your Android device. We believe you should own your commuter data and travel in confidence.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2 flex items-center gap-1.5">
            <EyeOff className="w-4 h-4 text-purple-500" />
            <span>1. Zero Personal Data Collection</span>
          </h3>
          <p>
            NammaRide does not collect, record, or transmit any personal identifiable information (PII). We do not request your name, telephone number, account credentials, or email addresses during standard offline operations.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-500" />
            <span>2. Offline Proximity & Location Permissions</span>
          </h3>
          <p>
            The app requests optional device location access strictly for displaying your current position on the metro line map and sorting nearest stations. Your GPS coordinates are processed entirely on-device and are never uploaded to any remote server or shared with third parties.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">3. Storage of Saved QR Tickets</h3>
          <p>
            Commuters can screenshot and store turnstile gate QR tickets in NammaRide for quick gate verification. These screenshots are stored directly inside the application sandbox cache on your phone and are automatically deleted when cleared or when the app is uninstalled.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">4. Zero Third-Party Advertising & Trackers</h3>
          <p>
            We run no display ads, native tracking scripts, or commercial analytical frameworks (such as Facebook SDK) that profile your behavior. We monitor simple, aggregated, non-PII downloads and active user statistics on Google Play.
          </p>

          <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white pt-2">5. Updates and Contact</h3>
          <p>
            Any policy revisions will be pushed via application updates. For questions regarding code security or privacy, reach us directly at <a href="mailto:jaint0910@gmail.com" className="font-bold text-purple-600 dark:text-purple-400 underline">jaint0910@gmail.com</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
