import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Sparkles, ShieldCheck, Download, Share2 } from 'lucide-react';

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Real Play Store reviews list (empty until official store reviews arrive)
  const reviewsList = [];

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: 'offline', label: 'Offline Capability' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'accuracy', label: 'Accuracy & Info' },
    { id: 'ease', label: 'Ease of Use' }
  ];

  const filteredReviews = reviewsList.filter(
    (rev) => activeFilter === 'all' || rev.category === activeFilter
  );

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Commuter Reviews</span>
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            User Reviews & Ratings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Real feedback from Bengaluru daily metro commuters using NammaRide.
          </p>
        </div>

        {/* REVIEWS CONTAINER (EMPTY STATE WHEN NO REVIEWS) */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-10 sm:p-14 text-center space-y-5 shadow-xs max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                Play Store Reviews Opening Soon
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-normal">
                We are launching on the Google Play Store! Genuine commuter reviews will be displayed here directly as daily commuters test the app.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap justify-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=site.nammaride.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Be the First to Review on Google Play</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-white dark:bg-gray-900/60 p-6 rounded-3xl border border-gray-200 dark:border-gray-800/80 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-gray-400">{rev.date}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white leading-snug">"{rev.title}"</h4>
                    <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed">{rev.content}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-850/80 flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white">{rev.name}</span>
                    <span className="mx-1">•</span>
                    <span>{rev.role}</span>
                    <span className="block text-[9px] text-gray-400 mt-0.5">{rev.location}</span>
                  </div>
                  <button className="flex items-center gap-1 hover:text-purple-500 font-bold transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
