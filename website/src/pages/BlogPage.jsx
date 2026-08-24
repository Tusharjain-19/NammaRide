import React, { useState } from 'react';
import { Compass, BookOpen, Clock, Calendar, ArrowRight, Bookmark } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'guide', label: 'Commuter Guides' },
    { id: 'tech', label: 'Tech & Careers' },
    { id: 'lifestyle', label: 'Food & Lifestyle' },
    { id: 'safety', label: 'Safety & Help' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Bengaluru Metro for First-Time Users',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '8 min read',
      date: 'Aug 22, 2026',
      summary: 'A comprehensive onboarding guide covering Purple, Green, and upcoming Yellow line maps, smart card deposits, tokens, turnstile operations, and commuter etiquettes.',
      snippet: 'Welcome to Bengaluru! Navigating the Namma Metro for the first time can seem daunting. With over 108 stations spread across multiple lines, understanding the system is key. In this guide, we break down ticket types, interchanges like Kempegowda Majestic, BMRCL guidelines, and smart tricks to save time on your very first transit.'
    },
    {
      id: 2,
      title: 'Top 20 Tech Offices Near Bengaluru Metro Stations',
      category: 'tech',
      categoryLabel: 'Tech & Careers',
      readTime: '6 min read',
      date: 'Aug 19, 2026',
      summary: 'Avoid the infamous Silk Board and Outer Ring Road traffic. Here are 20 major tech parks and MNC campuses located within 500m of a metro station.',
      snippet: 'Bengaluru is India\'s tech capital, but commuting can be stressful. Did you know that major companies like TCS, Oracle, Infosys, and SAP have offices directly connected by the metro? In this post, we map out the tech offices in Whitefield, Electronic City, and Indiranagar accessible within a 5-minute walk from the exit gates.'
    },
    {
      id: 3,
      title: 'Best Restaurants & Cafes Accessible via Metro',
      category: 'lifestyle',
      categoryLabel: 'Food & Lifestyle',
      readTime: '7 min read',
      date: 'Aug 15, 2026',
      summary: 'A curated dining guide featuring legendary breweries, old school cafes, and gourmet eateries accessible directly off the metro lines.',
      snippet: 'Dine around the city without fumbling for parking. From legendary 70-year-old Koshy\'s Cafe off MG Road to flagship craft breweries like Toit in Indiranagar, Bengaluru\'s food culture is closely tied to transit. We highlight the top 15 foodie spots that require zero driving.'
    },
    {
      id: 4,
      title: 'Safety Tips for Women Commuting via Metro',
      category: 'safety',
      categoryLabel: 'Safety & Help',
      readTime: '5 min read',
      date: 'Aug 10, 2026',
      summary: 'Essential guidelines, BMRCL helplines, ladies coach details, and security features inside metro stations for safe late-night travel.',
      snippet: 'Bengaluru Metro is widely regarded as one of the safest modes of urban transit. However, knowing helper contact numbers, BMRCL security guidelines, ladies-only coaches (typically the first coach of the train), and exits can make night commutes completely stress-free.'
    },
    {
      id: 5,
      title: 'Budget Travel in Bengaluru: Metro Edition',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '6 min read',
      date: 'Aug 05, 2026',
      summary: 'Maximize smart card discounts, choose the right tourist passes, and plan routes to reduce daily transit costs by up to 30%.',
      snippet: 'Commuting daily adds up, but fumbling with single tokens is both expensive and time-consuming. Switching to BMRCL Smart Cards instantly saves you 5% per trip. We review tourist passes (1-day and 3-day options) and fare calculator tips to minimize your BMRCL bills.'
    }
  ];

  const filteredPosts = blogPosts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Namma Blog</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            Bengaluru Metro Guides & Travel Tips
          </h1>
          <p className="text-gray-655 dark:text-gray-300 text-sm max-w-xl mx-auto">
            Stay updated with transit guidelines, tech park connections, dining guides, and smart card saving tips.
          </p>
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 dark:border-gray-805 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                  : 'bg-white dark:bg-gray-900 text-gray-550 dark:text-gray-455 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-900/80 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-400">
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 dark:text-blue-400 uppercase tracking-wider border border-blue-500/15">
                    {post.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white leading-tight">
                  {post.title}
                </h3>

                {/* Summarized content */}
                <p className="text-xs text-gray-550 dark:text-gray-400 font-semibold leading-relaxed">
                  {post.summary}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-800">
                  {post.snippet}
                </p>

              </div>

              {/* Action */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-850/80 flex items-center justify-between">
                <span className="text-[10px] text-gray-450 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" /> Bookmarked & offline-ready in NammaRide App
                </span>
                <button className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-extrabold hover:text-blue-500 transition-colors">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
