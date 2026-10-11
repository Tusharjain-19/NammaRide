import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Clock, Calendar, ArrowRight, Bookmark, ChevronUp, CheckCircle2, MapPin, Zap, ExternalLink } from 'lucide-react';
import BengaluruMetroGuide from '../components/BengaluruMetroGuide';
import MetaSEO from '../components/MetaSEO';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

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
      slug: 'bengaluru-metro-guide-first-timers',
      title: 'Complete Guide to Bengaluru Metro for First-Time Users',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '8 min read',
      date: 'Aug 22, 2026',
      summary: 'A comprehensive onboarding guide covering Purple, Green, and upcoming Yellow line maps, smart card deposits, tokens, turnstile operations, and commuter etiquettes.',
      snippet: 'Welcome to Bengaluru! Navigating the Namma Metro for the first time can seem daunting. With over 83+ stations spread across multiple lines, understanding the system is key. In this guide, we break down ticket types, interchanges like Kempegowda Majestic, BMRCL guidelines, and smart tricks to save time on your very first transit.',
      sections: [
        {
          heading: '1. Understanding the Color-Coded Lines',
          text: 'Bengaluru Metro (BMRCL) is organized into high-capacity color-coded corridors. The Purple Line connects the East (Whitefield) to the Southwest (Challaghatta), cutting through the central business district. The Green Line runs North-South from Madavara (BIEC) down to Silk Institute on Kanakapura Road. The Yellow Line connects RV Road with the tech epicenter of Electronic City.'
        },
        {
          heading: '2. Ticketing Options & How to Enter',
          text: 'You have three primary ticketing choices: Single-journey QR Tokens (purchased at station counters or automated vending machines), WhatsApp QR tickets via BMRCL chatbot (+91 81055 56677), or the reusable Varshik Smart Card. Hold your token or card against the sensor on the automated AFC gates to enter; insert tokens or tap cards again to exit at your destination.'
        },
        {
          heading: '3. Platform Navigation & Boarding Etiquette',
          text: 'Station signs clearly display train destination and platform numbers. Stand behind the yellow tactile safety strip until the train comes to a complete halt. Allow deboarding passengers to exit through the center before boarding from the sides.'
        }
      ],
      quickLinks: [
        { label: 'Check 83+ Stations Directory', to: '/stations' },
        { label: 'View First & Last Train Timings', to: '/timings' },
        { label: 'Calculate Ticket Fare', to: '/fare-calculator' }
      ]
    },
    {
      id: 2,
      slug: 'top-20-tech-offices-metro',
      title: 'Top 20 Tech Offices Near Bengaluru Metro Stations',
      category: 'tech',
      categoryLabel: 'Tech & Careers',
      readTime: '6 min read',
      date: 'Aug 19, 2026',
      summary: 'Avoid the infamous Silk Board and Outer Ring Road traffic. Here are 20 major tech parks and MNC campuses located within 500m of a metro station.',
      snippet: 'Bengaluru is India\'s tech capital, but commuting can be stressful. Did you know that major companies like TCS, Oracle, Infosys, and SAP have offices directly connected by the metro? In this post, we map out the tech offices in Whitefield, Electronic City, and Indiranagar accessible within a 5-minute walk from the exit gates.',
      sections: [
        {
          heading: '1. Whitefield & ITPL Tech Hubs (Purple Line)',
          text: 'Pattandur Agrahara (ITPL) Station provides direct covered walkway access to International Tech Park Bangalore, housing TCS, Mu Sigma, and Xerox. Garudacharpalya connects directly to Bagmane Constellation Business Park (Amazon, Google, Samsung). Hoodi and Kundalahalli stations cater to SAP Labs and Qualcomm.'
        },
        {
          heading: '2. Electronic City & Hosur Road (Yellow Line)',
          text: 'Electronic City Phase 1 and Phase 2 metro stations sit right at the doorsteps of Infosys Gate 1, Wipro Campus, Tech Mahindra, and Siemens. Skipping the Silk Board flyover gridlock saves commuters over 60 minutes each morning.'
        },
        {
          heading: '3. Central Business District Tech Campuses',
          text: 'MG Road and Trinity stations connect to Raheja Towers, WeWork Galaxy, and British Council. Sir M. Visvesvaraya Central College station provides immediate proximity to government IT directorates.'
        }
      ],
      quickLinks: [
        { label: 'Explore Tech Parks on Map', to: '/explore' },
        { label: 'Calculate Commute Fare', to: '/fare-calculator' },
        { label: 'Try Commute Simulator', to: '/simulator' }
      ]
    },
    {
      id: 3,
      slug: 'best-restaurants-cafes-metro',
      title: 'Best Restaurants & Cafes Accessible via Metro',
      category: 'lifestyle',
      categoryLabel: 'Food & Lifestyle',
      readTime: '7 min read',
      date: 'Aug 15, 2026',
      summary: 'A curated dining guide featuring legendary breweries, old school cafes, and gourmet eateries accessible directly off the metro lines.',
      snippet: 'Dine around the city without fumbling for parking. From legendary 70-year-old Koshy\'s Cafe off MG Road to flagship craft breweries like Toit in Indiranagar, Bengaluru\'s food culture is closely tied to transit. We highlight the top 15 foodie spots that require zero driving.',
      sections: [
        {
          heading: '1. 100ft Road Indiranagar Dining Hub',
          text: 'Alight at Indiranagar Metro Station (Purple Line) and take Exit B. Within a 400-meter stroll, you will reach iconic brewpubs including Toit, Glen\'s Bakehouse, and artisanal filter coffee roasters.'
        },
        {
          heading: '2. Church Street & Brigade Road Heritage Trail',
          text: 'MG Road Metro Station Exit 2 opens right onto Church Street. Enjoy bookstore browsing at Blossom, followed by cold coffee at Matteo Coffea or classic Anglo-Indian breakfast at Koshy\'s on St. Mark\'s Road.'
        },
        {
          heading: '3. South Bengaluru Traditional Tiffin Centers',
          text: 'Take the Green Line to National College or South End Circle to taste authentic benne masala dose at Vidyarthi Bhavan (Gandhi Bazaar) and Brahmin\'s Coffee Bar in Shankarapuram.'
        }
      ],
      quickLinks: [
        { label: 'Explore Dining Attractions', to: '/explore' },
        { label: 'Interactive Metro Map', to: '/map' }
      ]
    },
    {
      id: 4,
      slug: 'safety-tips-women-commuters',
      title: 'Safety Tips for Women Commuting via Metro',
      category: 'safety',
      categoryLabel: 'Safety & Help',
      readTime: '5 min read',
      date: 'Aug 10, 2026',
      summary: 'Essential guidelines, BMRCL helplines, ladies coach details, and security features inside metro stations for safe late-night travel.',
      snippet: 'Bengaluru Metro is widely regarded as one of the safest modes of urban transit. However, knowing helper contact numbers, BMRCL security guidelines, ladies-only coaches (typically the first coach of the train), and exits can make night commutes completely stress-free.',
      sections: [
        {
          heading: '1. First Coach Reserved Exclusively for Women',
          text: 'Every 6-coach train on Namma Metro has its leading coach designated exclusively for women. Clear overhead platform indicators mark the exact waiting bay for this ladies coach.'
        },
        {
          heading: '2. 24x7 Security & Emergency Helplines',
          text: 'Every station has Karnataka State Industrial Security Force (KSISF) personnel stationed at platform ends and entry gates. For immediate assistance, commuters can dial BMRCL Security Control at 080-22969200 or the toll-free helpline at 1800-425-12345.'
        },
        {
          heading: '3. Well-Lit Skywalks and Feeder Auto Stands',
          text: 'Stations like Majestic, Indiranagar, and Whitefield feature dedicated security patrols and pre-paid auto counters outside primary exit gates for secure last-mile transit.'
        }
      ],
      quickLinks: [
        { label: 'Emergency Safety Helplines', to: '/safety' },
        { label: 'Station Accessibility Guide', to: '/stations' }
      ]
    },
    {
      id: 5,
      slug: 'budget-travel-metro-edition',
      title: 'Budget Travel in Bengaluru: Metro Edition',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '6 min read',
      date: 'Aug 05, 2026',
      summary: 'Maximize smart card discounts, choose the right tourist passes, and plan routes to reduce daily transit costs by up to 30%.',
      snippet: 'Commuting daily adds up, but fumbling with single tokens is both expensive and time-consuming. Switching to BMRCL Smart Cards instantly saves you 5% per trip. We review tourist passes (1-day and 3-day options) and fare calculator tips to minimize your BMRCL bills.',
      sections: [
        {
          heading: '1. Why the Varshik Smart Card is Essential',
          text: 'The BMRCL Varshik Smart Card costs ₹50 as a one-time refundable deposit. It grants an automatic 5% fare rebate on every trip compared to cash tokens. For regular office-goers, this saves ₹300 to ₹600 each month.'
        },
        {
          heading: '2. Unlimited 1-Day & 3-Day Tourist Day Passes',
          text: 'Exploring the city on a weekend? Purchase the BMRCL 1-Day Tourist Pass for ₹200 (including ₹50 refundable card security) to ride unlimited metro journeys across Purple, Green, and Yellow lines for the entire operating day.'
        },
        {
          heading: '3. Trip Planning to Avoid Surcharges',
          text: 'Remember that staying inside the paid station concourse for over 120 minutes incurs an overstay penalty under BMRCL rules. Plan your transfers smoothly using NammaRide offline time estimations.'
        }
      ],
      quickLinks: [
        { label: 'Calculate Fare & Savings', to: '/fare-calculator' },
        { label: 'First & Last Train Timings', to: '/timings' }
      ]
    },
    {
      id: 6,
      slug: 'electronic-city-yellow-line-guide',
      title: 'BMRCL Yellow Line (2026): RV Road to Electronic City Route, Stations & IT Commute Guide',
      category: 'tech',
      categoryLabel: 'Tech & Careers',
      readTime: '7 min read',
      date: 'Oct 08, 2026',
      summary: 'A complete breakdown of the 18.82 km elevated driverless Yellow Line connecting RV Road, Central Silk Board, and Electronic City IT parks.',
      snippet: 'Say goodbye to the Central Silk Board choke point. The newly operational Yellow Line connects RV Road Green Line Interchange to Bommasandra via 16 elevated stations. Learn how to reach Infosys, Wipro, and Biocon campuses in under 25 minutes without burning fuel in traffic.',
      sections: [
        {
          heading: '1. Yellow Line Route & Key Interchanges',
          text: 'Spanning 18.82 kilometers, the Yellow Line starts at RV Road (interchange with Green Line) and runs through Ragigudda, Jayadeva Hospital (interchange with Pink Line), BTM Layout, and Central Silk Board (future interchange with Blue Line). It then travels down the Hosur Road elevated highway to Electronic City Phase 1 & 2, ending at Bommasandra.'
        },
        {
          heading: '2. Driverless CBTC Train Technology',
          text: 'The Yellow Line utilizes Communication-Based Train Control (CBTC) GoA4 driverless signaling technology supplied by CRRC and Titagarh Rail Systems. This allows tight headway intervals of under 4 minutes during peak morning and evening IT office hours.'
        },
        {
          heading: '3. Skywalk Connections to IT Campuses',
          text: 'Electronic City stations feature direct elevated pedestrian walkways connecting to Infosys Gate 1, Wipro, and Velankani tech campuses. Commuters no longer need to cross the bustling Hosur Road highway on foot.'
        }
      ],
      quickLinks: [
        { label: 'View Yellow Line Stations', to: '/stations' },
        { label: 'Calculate Yellow Line Fares', to: '/fare-calculator' },
        { label: 'Interactive Route Map', to: '/map' }
      ]
    },
    {
      id: 7,
      slug: 'majestic-interchange-guide',
      title: 'Kempegowda Majestic Interchange Masterclass: How to Switch Between Purple & Green Lines in 3 Minutes',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '6 min read',
      date: 'Oct 02, 2026',
      summary: 'Step-by-step navigation through India\'s largest underground metro hub: platform levels, escalator shortcuts, and KSRTC bus terminal skywalks.',
      snippet: 'Nadaprabhu Kempegowda Station Majestic handles over 250,000 daily commuters. Knowing which staircase to take between the Purple Line (Level 2) and Green Line (Level 3) can save you 10 minutes during rush hour. Here is the insider commuter guide.',
      sections: [
        {
          heading: '1. Station Anatomy & Multi-Level Layout',
          text: 'Majestic is an underground 3-level interchange. Concourse Level 1 is the ticketing and frisking floor. Level 2 houses the Purple Line (Platforms 1 & 2 for Whitefield and Challaghatta). Level 3, situated directly underneath, houses the Green Line (Platforms 3 & 4 for Madavara and Silk Institute).'
        },
        {
          heading: '2. Quick Transfer Escalator Shortcut',
          text: 'When getting off a Purple Line train at Majestic, do NOT take the escalators heading UP to the ticket concourse if you need the Green Line! Look for the central stairs and escalators labeled "Green Line Interchange - Level 3" that take you directly down in under 60 seconds.'
        },
        {
          heading: '3. Connecting to KSR Railway Station & KSRTC Buses',
          text: 'Take Exit 3 or Exit 5 to enter the underground pedestrian subway leading directly to the Krantivira Sangolli Rayanna (KSR) Railway Station ticket counters and the Majestic BMTC/KSRTC bus stands without stepping onto street traffic.'
        }
      ],
      quickLinks: [
        { label: 'Majestic Station Details', to: '/stations' },
        { label: 'Train Timings Schedule', to: '/timings' },
        { label: 'Offline GPS Simulator', to: '/simulator' }
      ]
    },
    {
      id: 8,
      slug: 'smart-card-vs-qr-ticket',
      title: 'BMRCL Smart Card (Varshik) vs WhatsApp QR Ticket: Fare Rules, 5% Discount Hacks & Top-Up Guide',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '5 min read',
      date: 'Sep 28, 2026',
      summary: 'Comprehensive comparison of ticket options: why daily commuters save hundreds of rupees with 5% Varshik card discounts vs single-use QR tokens.',
      snippet: 'Standing in token queues wastes up to 20 minutes every morning. Compare the 5% discount on BMRCL Varshik Smart Cards with the convenience of BMRCL WhatsApp QR tickets (+91 81055 56677) and discover the best payment method for your commute pattern.',
      sections: [
        {
          heading: '1. Varshik Smart Card: The Daily Commuter Choice',
          text: 'The physical contactless Varshik Smart Card provides a guaranteed 5% discount on every ride. You can recharge it online via official portals, Paytm, or Namma Metro app, and validate the recharge at any station balance check terminal (AFTM) in seconds.'
        },
        {
          heading: '2. WhatsApp QR Ticketing (+91 81055 56677)',
          text: 'If you forgot your smart card, simply send "Hi" to BMRCL\'s official WhatsApp chatbot (+91 81055 56677). Select your origin and destination, pay via UPI, and receive a digital QR code that scans directly at the AFC gates.'
        },
        {
          heading: '3. National Common Mobility Card (NCMC)',
          text: 'RuPay NCMC cards issued by SBI, Canara Bank, and other banks are fully accepted across all Namma Metro turnstiles, allowing seamless transit payments nationwide across Delhi, Mumbai, and Bengaluru.'
        }
      ],
      quickLinks: [
        { label: 'Calculate Smart Card Savings', to: '/fare-calculator' },
        { label: 'Check First & Last Trains', to: '/timings' },
        { label: 'Download NammaRide Android App', to: '/download' }
      ]
    }
  ];

  const filteredPosts = blogPosts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <MetaSEO
        title="Bengaluru Metro Travel Blog & Commuter Guides — NammaRide"
        description="Read comprehensive guides for Bengaluru Namma Metro: Yellow Line Electronic City transit, Majestic interchange navigation, smart card 5% discount hacks, and top 20 office hubs."
        canonicalPath="/blog"
      />
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Namma Transit Blog & Guides</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            Bengaluru Metro Guides & Travel Tips
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto font-medium">
            Stay updated with transit guidelines, tech park connections, dining guides, and smart card saving tips.
          </p>
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 dark:border-gray-800 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {filteredPosts.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <article
                key={post.id}
                id={post.slug}
                className="bg-white dark:bg-gray-900/80 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md scroll-mt-28"
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
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-gray-900 dark:text-white leading-tight">
                    {post.title}
                  </h2>

                  {/* Summarized content */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                    {post.summary}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-800">
                    {post.snippet}
                  </p>

                </div>

                {/* Expanded Full Article Reader */}
                {isExpanded && post.sections && (
                  <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-6 animate-fadeIn">
                    {post.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{sec.heading}</span>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-6">
                          {sec.text}
                        </p>
                      </div>
                    ))}

                    {/* Quick Internal Navigation Buttons for high SEO & AEO interlinking */}
                    {post.quickLinks && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2.5">
                        <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> Related Transit Tools & Live Guides
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.quickLinks.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              to={link.to}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-black text-gray-900 dark:text-white text-xs font-bold hover:text-emerald-500 border border-gray-200 dark:border-neutral-800 transition-colors shadow-xs"
                            >
                              {link.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-500" /> Bookmarked & offline-ready in NammaRide App
                  </span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-extrabold hover:text-blue-500 transition-colors"
                  >
                    <span>{isExpanded ? 'Close Article' : 'Read Full Article'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

              </article>
            );
          })}
        </div>

        {/* 1000+ Word Comprehensive Trilingual Guide Component */}
        <div className="pt-8">
          <BengaluruMetroGuide />
        </div>

      </div>
    </div>
  );
}
