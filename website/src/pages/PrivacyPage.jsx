/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
import React from 'react';
import { Shield, EyeOff, Lock, Bell, Database, Trash2, Mail } from 'lucide-react';
import MetaSEO from '../components/MetaSEO';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <MetaSEO
        title="NammaRide Privacy Policy: Zero Data Collection, On-Device GPS & Offline Security"
        description="Detailed NammaRide privacy policy: zero personal data collection, 100% on-device Geo GPS & speed processing, local-only notifications, offline cache controls, and zero third-party ad trackers."
        canonicalPath="/privacy"
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        
        <div className="text-center space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Effective Date: November 26, 2026 · Version 2.0.0
          </p>
        </div>

        <div className="space-y-5 leading-relaxed">
          <p>
            At <strong>NammaRide</strong> (operated independently by <strong>Tushar Jain</strong>, available on{' '}
            <a href="https://www.nammaride.site/" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">www.nammaride.site</a>{' '}
            and Google Play as <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">site.nammaride.app</code>), user privacy is our foundational engineering principle.
            NammaRide is architected to operate offline-first with 100% on-device computation so your daily commute stays completely private.
          </p>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-500 shrink-0" />
              <span>1. Zero Personal Data Collection (No Account, No PII)</span>
            </h2>
            <p>
              NammaRide does <strong>not</strong> collect, store on external servers, sell, or share any Personally Identifiable Information (PII).
              You are never required to create an account, verify a phone number, sign in with email, or grant contacts/SMS access to use route planning, fare calculation, timings, or live station tracking.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500 shrink-0" />
              <span>2. On-Device Geo GPS Location & Speed Validation</span>
            </h2>
            <p>
              When you explicitly enable GPS tracking or Nearest Station Radar, NammaRide requests standard device location permission (via browser Geolocation API or Android <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">@capacitor/geolocation</code>).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Coordinates are processed <strong>strictly in memory on your device</strong> to identify nearby stations, confirm boarding, validate live train speed, and track interchange/destination progress.</li>
              <li>Your GPS coordinates and travel history are <strong>never transmitted</strong> to any remote server, analytics backend, or third party.</li>
              <li>You can revoke location permission at any time in your browser or Android Settings and continue using timetable-based navigation offline.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-500 shrink-0" />
              <span>3. Local Notifications & Arrival Alerts</span>
            </h2>
            <p>
              On Android 13+ and supported browsers, NammaRide requests optional notification permission (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">POST_NOTIFICATIONS</code>) solely to deliver <strong>local, on-device alerts</strong> 30 seconds before your train arrives, at interchange stations, and upon reaching your destination. No push-notification tokens, Firebase device IDs, or remote marketing notifications are used.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500 shrink-0" />
              <span>4. Local Storage, Offline Cache & Saved QR Tickets</span>
            </h2>
            <p>
              NammaRide stores preferences and offline transit data locally on your device using <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">localStorage</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">sessionStorage</code>, and the offline Service Worker cache (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">nammaride-offline-v2.0.0</code>):
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>User Preferences</strong>: Selected theme (Light/Dark), language (English, ಕನ್ನಡ, हिन्दी), alert chime mute state, and favorite routes.</li>
              <li><strong>Saved QR Tickets</strong>: Any metro QR screenshot you upload stays strictly inside your device&apos;s local sandbox and is never uploaded to the cloud.</li>
              <li><strong>Timetable Overrides</strong>: When online, the app may fetch a small static JSON timetable override (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">live-overrides.json</code>) via a read-only GET request containing zero user identifiers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-500 shrink-0" />
              <span>5. Zero Third-Party Advertising, Trackers, or Data Brokers</span>
            </h2>
            <p>
              NammaRide contains <strong>zero ad networks</strong>, zero behavioral profiling SDKs, zero cross-app tracking identifiers, and zero data-broker integrations. Aggregated, anonymous store install counts are provided solely by Google Play Console.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>6. Your Data Controls, Deletion & Children&apos;s Privacy</span>
            </h2>
            <p>
              Because all data resides locally on your device, you have full control at all times: clearing your browser site data, clearing Android App Storage, or uninstalling NammaRide permanently erases every saved route, QR image, and cached schedule. NammaRide does not knowingly collect any personal information from children under 13 (or under 18 under applicable Indian DPDP Act rules), as no personal data is collected from any user.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white pt-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500 shrink-0" />
              <span>7. Policy Updates & Contact</span>
            </h2>
            <p>
              We may update this Privacy Policy when new offline features are added. Material changes will be reflected by updating the Effective Date above. For privacy, security, or licensing inquiries, contact the developer (<strong>Tushar Jain</strong>) directly at{' '}
              <a href="mailto:jaint0910@gmail.com" className="font-bold text-purple-600 dark:text-purple-400 underline">jaint0910@gmail.com</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
