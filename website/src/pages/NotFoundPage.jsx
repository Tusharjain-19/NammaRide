import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, AlertTriangle, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-[36px] border border-gray-200 dark:border-gray-800 text-center space-y-6 shadow-sm">
        
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-purple-500" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-white">Wrong Route!</h1>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-widest font-mono">Error 404 - Train Departed</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
            The page you are trying to navigate to does not exist. It looks like you've boarded the wrong train or got off at a non-existent station.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-550 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Navigate Back Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
