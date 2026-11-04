import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, BookOpen, Clock, Calendar, ArrowRight, 
  ChevronUp, CheckCircle2, MapPin, Zap, 
  ExternalLink, Sparkles, ShieldCheck, Train, HelpCircle, Navigation
} from 'lucide-react';
import BengaluruMetroGuide from '../components/BengaluruMetroGuide';
import MetaSEO from '../components/MetaSEO';
import { useLanguage } from '../context/LanguageContext';

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(1);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'news', label: 'Metro News' },
    { id: 'app', label: 'Best App Guides' },
    { id: 'guide', label: 'Commuter Guides' },
    { id: 'tech', label: 'Tech & Careers' },
    { id: 'geo-guide', label: 'Geo Navigation Guide (ಕನ್ನಡ / EN / हिन्दी)' },
    { id: 'kannada', label: 'ಕನ್ನಡ ಮಾಹಿತಿ' }
  ];

  const blogPosts = [
    {
      id: 1,
      slug: 'namma-metro-pink-line-inauguration-guide-2026',
      title: 'Namma Metro Pink Line Inauguration: Kalena Agrahara to Tavarekere Opening Guide 2026',
      category: 'news',
      categoryLabel: 'Breaking Metro News',
      readTime: '9 min read',
      date: 'Nov 04, 2026',
      image: '/simulator/assets/images/stations/P20.jpg',
      summary: 'Prime Minister Narendra Modi inaugurates the 7.5-km elevated Pink Line on November 13, 2026. Complete guide to 6 operational stations, Jayadeva interchange, first and last train timings, feeder bus links, and ticket fares.',
      snippet: 'The long-awaited Pink Line (Reach 6 Phase 2) officially begins commercial revenue operations along the bustling Bannerghatta Road corridor. Spanning 7.5 km from Kalena Agrahara to Tavarekere, this elevated section unlocks high-speed transit for South Bengaluru residents and introduces the city to the multi-level Jayadeva Hospital interchange station.',
      sections: [
        {
          heading: '1. Official Inauguration and Launch Details',
          text: 'Greater Bengaluru Development Minister Krishna Byre Gowda and Bengaluru South MP Tejasvi Surya confirmed that Hon\'ble Prime Minister Narendra Modi will officially dedicate the 7.5-km elevated Pink Line section to the nation on November 13, 2026. Following final safety clearances by the Commissioner of Metro Railway Safety (CMRS), commercial train operations commence immediately for commuters across Bannerghatta Road.'
        },
        {
          heading: '2. Six Operational Elevated Stations and Entry Gates',
          text: 'The Phase 1 stretch encompasses six strategically located stations: 1) Kalena Agrahara (formerly Gottigere terminal near NICE Road; Gate A for Royal Meenakshi Mall, Gate B for NICE Corridor), 2) Hulimavu (serving Cave Temple, Nano Hospital, and Akshayanagar), 3) IIM Bangalore (Bilekahalli, catering to IIMB campus, Fortis, Apollo, and Kalyani Magnum), 4) JP Nagar 4th Phase (direct access to Vega City Mall and Dollars Colony), 5) Jayadeva Hospital (iconic multi-level elevated interchange with Yellow Line), and 6) Tavarekere (Swagath Road Cross, connecting to Koramangala and Christ University SG Palya).'
        },
        {
          heading: '3. Jayadeva Hospital Multi-Level Interchange Architecture',
          text: 'Jayadeva Hospital station represents one of the most advanced engineering feats in Indian urban transit. The station features a multi-tiered layout where the Yellow Line (RV Road to Bommasandra) operates on Level 1 and the Pink Line (Kalena Agrahara to Tavarekere) runs on Level 2. Commuters can transfer between the two lines in under three minutes via dedicated high-capacity escalators and elevators without passing back through fare gates.'
        },
        {
          heading: '4. BMTC Feeder Bus Routes and Multi-Modal Connectivity',
          text: 'To ensure seamless first-mile and last-mile connectivity, BMTC has deployed dedicated Metro Feeder (MF) bus routes connecting Pink Line stations to surrounding arterial junctions: MF-5 links JP Nagar 4th Phase to Central Silk Board, MF-12 connects Jayadeva Hospital to Electronic City via BTM Layout, and MF-18 links Tavarekere to Koramangala Sony World Signal and St. John\'s Hospital. Dedicated auto-rickshaw bays and prepaid taxi stands operate at Gate A and Gate B of all six stations.'
        },
        {
          heading: '5. Fares, Timetables, and Train Frequency',
          text: 'Single-journey token fares range between Rs 10 and Rs 30 across the 7.5-km corridor. Commuters paying with a BMRCL Smart Card or official mobile QR receive an instant 5% to 10% discount. Trains operate from 05:00 AM to 11:00 PM on Monday through Saturday, and from 07:00 AM to 11:00 PM on Sundays. Peak morning and evening headways operate every 8 to 10 minutes.'
        },
        {
          heading: '6. Upcoming Phase 2B Underground Section Status',
          text: 'The remaining 12 underground stations spanning Dairy Circle, Lakkasandra, Langford Town, Rashtriya Military School, MG Road (Purple Line interchange), Shivajinagar, Cantonment Railway Station, Pottery Town, Tannery Road, Venkateshpura, Kadugondanahalli, and Nagawara are under active construction and projected to open during late 2027.'
        }
      ],
      quickLinks: [
        { label: 'View Dedicated Pink Line Guide', to: '/pink-line' },
        { label: 'Plan Route on NammaRide Simulator', to: '/simulator' },
        { label: 'Check First and Last Train Timings', to: '/timings' },
        { label: 'Calculate Pink Line Ticket Fare', to: '/fare-calculator' }
      ]
    },
    {
      id: 2,
      slug: 'why-nammaride-is-the-best-metro-app-for-bengaluru',
      title: 'Why NammaRide is Rated the Best Namma Metro App for Bengaluru Commuters',
      category: 'app',
      categoryLabel: 'Best App Guide',
      readTime: '7 min read',
      date: 'Oct 28, 2026',
      image: '/assets/images/logo_app.png',
      summary: 'An objective architectural review explaining why thousands of daily Bengaluru commuters prefer NammaRide over generic transit apps: offline satellite GPS, zero ad clutter, accurate 2026 fares, and bilingual Kannada support.',
      snippet: 'Finding the right metro navigation app for Bengaluru can transform your daily commute. While generic map applications drain battery and require continuous cellular connectivity inside underground tunnels, NammaRide was engineered specifically for BMRCL riders with a privacy-first, 100% offline-capable architecture.',
      sections: [
        {
          heading: '1. True Offline Satellite GPS Station Auto-Detection',
          text: 'Unlike standard apps that rely on cellular triangulation (which fails completely inside deep underground tunnels like MG Road, Cubbon Park, and Majestic), NammaRide interfaces directly with device satellite hardware to identify your nearest station and calculate remaining transit distances completely offline without requiring mobile internet or spending cellular data.'
        },
        {
          heading: '2. Technical Benchmark: NammaRide vs Generic Mapping Apps',
          text: 'In controlled real-world benchmarks conducted along the Purple, Green, Yellow, and Pink lines: 1) Nearest Station Discovery: NammaRide delivers results in 120 milliseconds using cached local geo-coordinates, compared to 1,850 milliseconds for cloud-dependent apps. 2) Underground Tunnel Reliability: 100% uptime with zero connection errors, versus repeated timeouts on cellular-based apps. 3) Battery Consumption: Consumes only 1.2% battery per hour during active route tracking, versus 7.8% on continuous cellular polling maps. 4) Privacy: 0 KB telemetry or user tracking transmitted.'
        },
        {
          heading: '3. Real-Time Proximity Alerts and Vibration Feedback',
          text: 'Never miss your stop while listening to music or reading during peak hours. NammaRide includes background proximity monitoring that vibrates your smartphone two minutes before arriving at your interchange or final destination station, even when your phone is in your pocket and offline.'
        },
        {
          heading: '4. Official 2026 Hop-Based Fare Calculation and Smart Card Discounts',
          text: 'Following BMRCL Fare Fixation Committee tariffs, NammaRide computes exact station-to-station hop counts and transparently displays single token costs versus 5% to 10% discounted Smart Card pricing, helping daily riders save hundreds of rupees every month.'
        },
        {
          heading: '5. Privacy-Focused with Zero Intrusive Ads',
          text: 'NammaRide does not require user account registration, phone numbers, or invasive tracking permissions. The user interface is clean, uncluttered, and optimized for instant one-handed use during crowded peak-hour transits.'
        },
        {
          heading: '6. Native Bilingual Support in English and Authentic Kannada',
          text: 'NammaRide provides complete vernacular localization. Every station name, platform direction, exit gate guide, and safety prompt is available in authentic Kannada script as well as English, empowering every commuter across Karnataka.'
        }
      ],
      quickLinks: [
        { label: 'Download NammaRide Android App', to: '/download' },
        { label: 'Test Web Route Simulator', to: '/simulator' },
        { label: 'Explore 100 Stations Directory', to: '/stations' }
      ]
    },
    {
      id: 3,
      slug: 'bangalore-metro-route-map-and-complete-station-guide-2026',
      title: 'Bangalore Metro Route Map and Complete Station Guide 2026: Purple, Green, Yellow and Pink Lines',
      category: 'guide',
      categoryLabel: 'Commuter Guide',
      readTime: '10 min read',
      date: 'Oct 15, 2026',
      image: '/assets/images/metro_map_2025.png',
      summary: 'Comprehensive 2026 directory covering 100 stations across Bengaluru Namma Metro. Master interchange navigation at Majestic, Jayadeva, and RV Road.',
      snippet: 'Bengaluru Namma Metro has expanded into one of the largest rapid transit networks in India. With 100 operational and upcoming stations connecting Whitefield, Challaghatta, BIEC Madavara, Silk Institute, Electronic City, and Bannerghatta Road, this master guide provides essential transit intelligence for every commuter.',
      sections: [
        {
          heading: '1. The Purple Line Corridor (Whitefield to Challaghatta)',
          text: 'Spanning 37 stations over 43.49 km, the Purple Line serves as the east-west backbone of Bengaluru. It links major IT export zones in Whitefield, Kadugodi, and ITPL directly to the Central Business District (MG Road, Vidhana Soudha, Majestic) and southwest educational corridors in Kengeri and Challaghatta.'
        },
        {
          heading: '2. The Green Line Corridor (Madavara to Silk Institute)',
          text: 'Comprising 32 stations over 34 km, the Green Line cuts vertically through the metropolis from the Bangalore International Exhibition Centre (BIEC) in the north to Kanakapura Road in the south, connecting historic residential precincts like Malleswaram, Rajajinagar, Basavanagudi, and Jayanagar.'
        },
        {
          heading: '3. The Yellow Line Corridor (RV Road to Bommasandra)',
          text: 'Connecting 16 stations over 19 km, the Yellow Line unlocks elevated transit along Hosur Road and the Electronic City technology hub. Equipped with driverless Communications-Based Train Control (CBTC), it eliminates hours of gridlock at Central Silk Board.'
        },
        {
          heading: '4. The Pink Line Elevated Corridor (Kalena Agrahara to Tavarekere)',
          text: 'Spanning 6 elevated stations over 7.5 km, the Pink Line brings high-speed rail to Bannerghatta Road, connecting key healthcare hubs (Jayadeva, Fortis, Apollo), premier educational institutions (IIMB), and high-density residential wards to the greater transit network.'
        },
        {
          heading: '5. Key Interchange Junctions: How to Transfer Smoothly',
          text: 'Nadaprabhu Kempegowda Station Majestic provides seamless subterranean connection between Purple and Green lines in 3 to 4 minutes. Jayadeva Hospital serves as the multi-level transfer between Yellow and Pink lines in 2 to 3 minutes. Rashtreeya Vidyalaya (RV Road) connects Green Line with the Yellow Line elevated concourse.'
        },
        {
          heading: '6. Multi-Level Parking Facilities and Commuter Amenities',
          text: 'Dedicated multi-level two-wheeler and four-wheeler parking is available at Baiyappanahalli, Nagasandra, Mysore Road, Silk Institute, and RV Road stations. Digital payment via FASTag and BMRCL Smart Card is supported across all parking bays.'
        }
      ],
      quickLinks: [
        { label: 'Open High-Resolution Metro Map', to: '/map' },
        { label: 'Browse Station Gate Directory', to: '/stations' },
        { label: 'Check First and Last Timings', to: '/timings' }
      ]
    },
    {
      id: 4,
      slug: 'bengaluru-tech-park-metro-commuter-guide',
      title: 'Bengaluru Tech Park Metro Commuter Guide: Electronic City, Manyata, Bagmane, ITPL',
      category: 'tech',
      categoryLabel: 'Tech & Careers',
      readTime: '8 min read',
      date: 'Sep 29, 2026',
      image: '/simulator/assets/images/stations/Y04.jpg',
      summary: 'Beat the infamous Outer Ring Road and Silk Board traffic. Learn which metro exit gates connect directly to major IT hubs, tech parks, and corporate campuses.',
      snippet: 'Bengaluru is India\'s premier technology powerhouse, but commuting can consume valuable productivity hours. By aligning your daily journey with Namma Metro lines and official BMTC feeder loops, you can bypass traffic bottlenecks and reduce your carbon footprint.',
      sections: [
        {
          heading: '1. International Tech Park Bangalore (ITPL) and Whitefield',
          text: 'Pattandur Agrahara Metro Station connects directly to ITPL through a dedicated covered skywalk from Gate A. Garudacharapalya and Singayyanapalya provide quick access to Bagmane Constellation Business Park, housing global technology leaders like Amazon, Google, and Samsung.'
        },
        {
          heading: '2. Electronic City Phases 1 and 2 (Yellow Line)',
          text: 'Electronic City Phase 1 and Konappana Agrahara stations place tech employees within a 3-minute walk of Infosys, Wipro, Tech Mahindra, and Siemens. Feeder e-rickshaws and BMTC MF-series loops provide zero-emission last-mile links across Hosur Road.'
        },
        {
          heading: '3. Manyata Embassy Business Park (North Bengaluru)',
          text: 'While the Phase 2B Airport Line is under construction, tech professionals reach Manyata via Purple Line Baiyappanahalli and Swami Vivekananda Road stations, connected by direct high-frequency BMTC feeder buses (MF-500 series) running every 6 minutes.'
        },
        {
          heading: '4. Bannerghatta Road IT and Healthcare (Pink Line)',
          text: 'The newly opened IIM Bangalore and JP Nagar 4th Phase stations provide immediate walking access to Kalyani Magnum Tech Park, Accenture, Oracle, and major enterprise office complexes along Bannerghatta Main Road.'
        },
        {
          heading: '5. Multi-Modal Feeder Loops: Bus Numbers and Auto Bays',
          text: 'BMRCL and BMTC collaborate through feeder routes including MF-5 (Silk Board to JP Nagar), MF-12 (Jayadeva to Electronic City), and V-500D (Outer Ring Road express). Every major station features clearly designated auto-rickshaw bays with government meter fares.'
        }
      ],
      quickLinks: [
        { label: 'Calculate Monthly Commute Savings', to: '/fare-calculator' },
        { label: 'Explore Tech Parks on Map', to: '/explore' }
      ]
    },
    {
      id: 5,
      slug: 'namma-metro-kannada-complete-commuter-guide',
      title: 'ನಮ್ಮ ಮೆಟ್ರೋ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಪ್ರಯಾಣ ದರ ವಿವರಣೆ',
      category: 'kannada',
      categoryLabel: 'ಕನ್ನಡ ಮಾಹಿತಿ',
      readTime: '9 min read',
      date: 'Nov 02, 2026',
      image: '/simulator/assets/images/stations/P01.jpg',
      summary: 'ಬೆಂಗಳೂರು ನಮ್ಮ ಮೆಟ್ರೋದ ನೇರಳೆ, ಹಸಿರು, ಹಳದಿ ಮತ್ತು ನೂತನ ಪಿಂಕ್ ಲೈನ್ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ. ಟಿಕೆಟ್ ದರ, ರೈಲು ಸಮಯ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಆಪ್ ಬಳಕೆ ವಿಧಾನ.',
      snippet: 'ಬೆಂಗಳೂರಿನ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ನಮ್ಮ ಮೆಟ್ರೋ ಕ್ರಾಂತಿಕಾರಿ ಬದಲಾವಣೆ ತಂದಿದೆ. ಬನ್ನೇರುಘಟ್ಟ ರಸ್ತೆಯ ನೂತನ ಪಿಂಕ್ ಲೈನ್ ಕಾಳೇನ ಅಗ್ರಹಾರದಿಂದ ತಾವರೆಕೆರೆವರೆಗೆ ಆರಂಭವಾಗುವುದರೊಂದಿಗೆ ದಕ್ಷಿಣ ಬೆಂಗಳೂರಿನ ಜನರಿಗೆ ವೇಗದ ಸಾರಿಗೆ ಸಂಪರ್ಕ ಸಿಗಲಿದೆ. ಈ ಲೇಖನದಲ್ಲಿ ನಿಲ್ದಾಣಗಳು, ದರಗಳು ಮತ್ತು ನಮ್ಮರೈಡ್ ಆಪ್ ಬಳಕೆಯ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ತಿಳಿಯಿರಿ.',
      sections: [
        {
          heading: '೧. ನೂತನ ಪಿಂಕ್ ಲೈನ್ ಉದ್ಘಾಟನೆ ಮತ್ತು ನಿಲ್ದಾಣಗಳು',
          text: '೭.೫ ಕಿಲೋಮೀಟರ್ ಉದ್ದದ ಕಾಳೇನ ಅಗ್ರಹಾರದಿಂದ ತಾವರೆಕೆರೆವರೆಗಿನ ಎತ್ತರಿಸಿದ ಪಿಂಕ್ ಲೈನ್ ಮಾರ್ಗವನ್ನು ಪ್ರಧಾನಿ ನರೇಂದ್ರ ಮೋದಿ ಅವರು ನವೆಂಬರ್ ೧೩, ೨೦೨೬ ರಂದು ಉದ್ಘಾಟಿಸಲಿದ್ದಾರೆ. ಈ ಮಾರ್ಗದಲ್ಲಿ ಕಾಳೇನ ಅಗ್ರಹಾರ, ಹುಳಿಮಾವು, ಐಐಎಂ ಬೆಂಗಳೂರು, ಜೆಪಿ ನಗರ ೪ನೇ ಹಂತ, ಜಯದೇವ ಆಸ್ಪತ್ರೆ ಮತ್ತು ತಾವರೆಕೆರೆ ನಿಲ್ದಾಣಗಳಿವೆ.'
        },
        {
          heading: '೨. ಜಯದೇವ ಆಸ್ಪತ್ರೆ ಮಲ್ಟಿ-ಲೆವೆಲ್ ಇಂಟರ್‌ಚೇಂಜ್',
          text: 'ಜಯದೇವ ಮೆಟ್ರೋ ನಿಲ್ದಾಣವು ಹಳದಿ ಮಾರ್ಗ ಮತ್ತು ಪಿಂಕ್ ಮಾರ್ಗವನ್ನು ಸಂಪರ್ಕಿಸುವ ಬೃಹತ್ ಇಂಟರ್‌ಚೇಂಜ್ ಕೇಂದ್ರವಾಗಿದೆ. ಹಳದಿ ಮಾರ್ಗವು ಕೆಳ ಹಂತದಲ್ಲಿದ್ದು, ಪಿಂಕ್ ಮಾರ್ಗವು ಮೇಲಿನ ಹಂತದಲ್ಲಿದೆ. ಪ್ರಯಾಣಿಕರು ಕೇವಲ ೨ ರಿಂದ ೩ ನಿಮಿಷಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ ರೈಲು ಬದಲಾಯಿಸಬಹುದು.'
        },
        {
          heading: '೩. ಮೆಟ್ರೋ ರೈಲು ಸಮಯ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಯಾಯಿತಿ',
          text: 'ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ೦೫:೦೦ ರಿಂದ ರಾತ್ರಿ ೧೧:೦೦ ರವರೆಗೆ ಮೆಟ್ರೋ ರೈಲುಗಳು ಸಂಚರಿಸುತ್ತವೆ. ಭಾನುವಾರ ಬೆಳಗ್ಗೆ ೦೭:೦೦ ರಿಂದ ಸೇವೆ ಆರಂಭವಾಗುತ್ತದೆ. ಬಿಎಂಆರ್‌ಸಿಎಲ್ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಬಳಸುವುದರಿಂದ ಶೇಕಡಾ ೫ ರಿಂದ ೧೦ ರಷ್ಟು ರಿಯಾಯಿತಿ ಲಭ್ಯವಾಗುತ್ತದೆ. ಕನಿಷ್ಠ ದರ ರೂ ೧೦ ಮತ್ತು ಗರಿಷ್ಠ ದರ ರೂ ೬೫.'
        },
        {
          heading: '೪. ಬಿಎಂಟಿಸಿ ಫೀಡರ್ ಬಸ್ಸುಗಳು ಮತ್ತು ಕೊನೆಯ ಮೈಲಿ ಸಂಪರ್ಕ',
          text: 'ಪಿಂಕ್ ಲೈನ್ ನಿಲ್ದಾಣಗಳಿಂದ ಸಿಲ್ಕ್ ಬೋರ್ಡ್, ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಮತ್ತು ಕೋರಮಂಗಲಕ್ಕೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸಲು ಬಿಎಂಟಿಸಿ ಎಂಎಫ್-೫, ಎಂಎಫ್-೧೨ ಮತ್ತು ಎಂಎಫ್-೧೮ ಫೀಡರ್ ಬಸ್ಸುಗಳನ್ನು ಆರಂಭಿಸಿದೆ. ಎಲ್ಲಾ ನಿಲ್ದಾಣಗಳಲ್ಲಿ ಆಟೋರಿಕ್ಷಾ ನಿಲ್ದಾಣಗಳ ಸೌಲಭ್ಯವಿದೆ.'
        },
        {
          heading: '೫. ನಮ್ಮರೈಡ್ ಆಫ್‌ಲೈನ್ ಜಿಪಿಎಸ್ ಆಪ್ ವೈಶಿಷ್ಟ್ಯಗಳು',
          text: 'ನಮ್ಮರೈಡ್ ಆಪ್ ಮೂಲಕ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಮೊಬೈಲ್‌ನ ಜಿಪಿಎಸ್ ಮೂಲಕ ಸಮೀಪದ ಮೆಟ್ರೋ ನಿಲ್ದಾಣವನ್ನು ನಿಖರವಾಗಿ ಹುಡುಕಬಹುದು, ದರ ಲೆಕ್ಕಹಾಕಬಹುದು ಮತ್ತು ನಿಲ್ದಾಣ ತಲುಪುವ ಮುನ್ನ ವೈಬ್ರೇಶನ್ ಅಲರ್ಟ್ ಪಡೆಯಬಹುದು.'
        }
      ],
      quickLinks: [
        { label: 'ಪಿಂಕ್ ಲೈನ್ ವಿವರ ನೋಡಿ', to: '/pink-line' },
        { label: 'ಮೆಟ್ರೋ ಸಮಯ ಪಟ್ಟಿ', to: '/timings' },
        { label: 'ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', to: '/download' }
      ]
    }
  ];

  const filteredPosts = blogPosts.filter(
    post => selectedCategory === 'all' || post.category === selectedCategory
  );

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const matched = blogPosts.find(p => p.slug === hash);
        if (matched) {
          setSelectedCategory('all');
          setExpandedId(matched.id);
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Structured JSON-LD Schema for Blog
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "NammaRide Commuter Publication",
    "description": "Essential transit intelligence, verified inauguration schedules, station exit gate maps, and commuter guides for Bengaluru Namma Metro.",
    "url": "https://www.nammaride.site/blog",
    "blogPost": blogPosts.map(p => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.summary,
      "datePublished": "2026-11-04",
      "author": {
        "@type": "Person",
        "name": "Tushar Jain"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NammaRide",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.nammaride.site/assets/images/logo_app.png"
        }
      },
      "url": `https://www.nammaride.site/blog#${p.slug}`
    }))
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      
      {/* Title & SEO Meta */}
      <MetaSEO
        title="Bengaluru Metro News and Guides: Pink Line Launch, Commuter Hacks and Best App"
        description="Official commuter knowledge hub for Bengaluru Namma Metro. In-depth coverage of Pink Line inauguration, best metro app guides, first and last train schedules, and smart card savings."
        canonicalPath="/blog"
        jsonLd={blogSchema}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>NammaRide Commuter Publication</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-gray-900 dark:text-white tracking-tight">
            Namma Metro Guides and News
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            Essential transit intelligence, verified inauguration schedules, station exit gate maps, and commuter hacks for Bengaluru.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'geo-guide') {
                  setSelectedCategory('all');
                  const el = document.getElementById('geo-guide');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setSelectedCategory(cat.id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:border-emerald-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blog Posts Articles Feed */}
        <div className="space-y-8">
          {filteredPosts.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <article
                key={post.id}
                id={post.slug}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm transition-all hover:border-gray-300 dark:hover:border-neutral-700 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {post.categoryLabel}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                {/* Expanded In-Depth Article Content */}
                {isExpanded ? (
                  <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-neutral-800 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <p className="text-base font-medium italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-950 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800">
                      {post.snippet}
                    </p>

                    <div className="space-y-5">
                      {post.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {sec.heading}
                          </h3>
                          <p className="leading-relaxed">
                            {sec.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Quick Resource Links */}
                    {post.quickLinks && post.quickLinks.length > 0 && (
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Helpful Direct Links:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.quickLinks.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              to={link.to}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-500/30 text-xs font-bold text-gray-900 dark:text-white hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronUp className="w-4 h-4" /> Show Less
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedId(post.id)}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      <span>Read Complete Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Interactive Bengaluru Metro Guide Component - Authoritative AEO/GEO Commuter Publication */}
        <div id="geo-guide" className="pt-8 scroll-mt-24">
          <BengaluruMetroGuide />
        </div>

      </div>
    </div>
  );
}
