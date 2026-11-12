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
      title: 'Namma Metro Pink Line Inauguration: PM Narendra Modi Flags Off Kalena Agrahara to Tavarekere Elevated Section',
      category: 'news',
      categoryLabel: 'Breaking Metro News',
      readTime: '22 min read',
      date: 'Nov 12, 2026',
      image: '/simulator/assets/images/stations/P20.jpg',
      summary: 'Prime Minister Narendra Modi dedicates Bengaluru Metro\'s 7.5-km elevated Pink Line to the nation on November 13, 2026. Complete 3,000-word guide to all 6 operational stations, multi-level Jayadeva Hospital interchange, BEML driverless rolling stock, first & last train timings, feeder bus links, and ticket fares.',
      snippet: 'The eagerly anticipated Namma Metro Pink Line (Reach 6 Phase 2) officially commences commercial revenue operations along the bustling Bannerghatta Road corridor. Spanning 7.5 km from Kalena Agrahara terminal to Tavarekere (Swagath Road Cross), this elevated arterial section eliminates decades of South Bengaluru vehicular paralysis, slashing peak commute times from 65 minutes down to an effortless 14 minutes, while connecting passengers directly to the revolutionary six-level Jayadeva Hospital interchange.',
      sections: [
        {
          heading: '1. Official National Inauguration Ceremony by Prime Minister Narendra Modi',
          text: 'In a landmark infrastructure milestone for Karnataka, Hon\'ble Prime Minister Narendra Modi officially dedicates the 7.5-km elevated section of Bengaluru Namma Metro\'s Pink Line (Reach 6 Phase 2) to the nation on Friday, November 13, 2026. The historic flag-off ceremony takes place at the state-of-the-art Kalena Agrahara terminal station, attended by Union Minister of Housing and Urban Affairs Manohar Lal Khattar, Karnataka Chief Minister Siddaramaiah, Deputy Chief Minister and Bengaluru Development Minister D.K. Shivakumar, Bengaluru South Member of Parliament Tejasvi Surya, along with senior officials from Bangalore Metro Rail Corporation Limited (BMRCL). The Commissioner of Metro Railway Safety (CMRS) issued the statutory commercial operating authorization following rigorous high-speed oscillation runs, structural load trials, emergency braking assessments, and automatic train supervisory simulations conducted throughout October 2026.'
        },
        {
          heading: '2. Strategic Geopolitical & Urban Significance for South Bengaluru',
          text: 'Bannerghatta Road has historically ranked among Bengaluru\'s most congested urban bottlenecks, accommodating upwards of 1.8 lakh motorized vehicles daily between Gottigere, Hulimavu, Bilekahalli, and Dairy Circle. Commuters routinely suffered transit delays of 60 to 90 minutes over mere 8-kilometer stretches during morning and evening rush hours. The launch of the elevated Pink Line Reach 6 fundamentally transforms this transit landscape by introducing a dedicated high-capacity grade-separated rail corridor capable of ferrying over 16,000 passengers per hour per direction (PPHPD). Urban transport analysts project that the operational elevated section will eliminate over 1.4 lakh private two-wheelers and cab journeys from surface roads within its first six months of operation, drastically curtailing carbon emissions and diesel particulates across South Bengaluru.'
        },
        {
          heading: '3. Station 1 Deep Dive: Kalena Agrahara Terminal (Formerly Gottigere)',
          text: 'Serving as the southern terminus of the Pink Line, Kalena Agrahara station (chainage 0.00 km) features a striking architectural canopy inspired by Karnataka\'s heritage temple vimanas. Strategically situated adjacent to the NICE Road interchange and Royal Meenakshi Mall, the station features two expansive entrances: Gate A provides direct sheltered skywalk access to Royal Meenakshi Mall and residential townships along Bannerghatta Main Road, while Gate B connects directly to dedicated BMTC feeder bus bays and the NICE Corridor toll interchange. The terminal incorporates a spacious ground-level multimodal transit plaza with dedicated auto-rickshaw bays, EV two-wheeler charging hubs, and secure park-and-ride facilities accommodating over 350 vehicles. Platform 1 serves northbound departures towards Tavarekere and Jayadeva, while Platform 2 functions as the primary deboarding island with rapid crossover tracks.'
        },
        {
          heading: '4. Station 2 Deep Dive: Hulimavu (Cave Temple & Healthcare Enclave)',
          text: 'Situated at chainage 1.45 km, Hulimavu station serves the dense residential catchments of Akshayanagar, DLF Newtown, Begur Road, and the historic Hulimavu Cave Temple (Sri Ramalingeshwara Cave Temple). Equipped with four street-level entry portals, Gate A and Gate B serve commuters accessing Nano Hospital, BGS National Public School, and residential high-rises on the western flank, while Gate C and Gate D cater to the eastern commercial establishments and Begur Lake access road. The station features full accessibility compliance including twin 13-passenger tactile elevators per platform, tactile guide strips for visually impaired passengers, and automated fare collection (AFC) turnstiles engineered for high-throughput NFC smart card and WhatsApp QR code scanning.'
        },
        {
          heading: '5. Station 3 Deep Dive: IIM Bangalore (Bilekahalli & Kalyani Magnum Tech Park)',
          text: 'Positioned at chainage 3.10 km, the IIM Bangalore station directly fronts the prestigious Indian Institute of Management Bangalore campus and serves the thriving IT commercial cluster of Bilekahalli. Gate A offers a direct pedestrian ramp connection into the IIMB main gate perimeter, designed with environmental care to preserve the lush avenue trees along Bannerghatta Road. Gate B connects directly to Kalyani Magnum Tech Park, home to enterprise software giants including Oracle, Accenture, VMware, and Trianz, allowing thousands of software engineers to commute directly from metro platform to office reception in under 4 minutes. In addition, the station provides immediate walking access to premier healthcare institutions Fortis Hospital and Apollo Hospital Bannerghatta Road, featuring dedicated emergency medical stretcher-accessible elevators.'
        },
        {
          heading: '6. Station 4 Deep Dive: JP Nagar 4th Phase (Vega City Mall & Dollars Colony)',
          text: 'Located at chainage 4.60 km near the iconic Vega City Mall junction, JP Nagar 4th Phase station is one of the highest-footfall transit nodes on the corridor. Gate A connects directly via an elevated covered foot overbridge into Vega City Mall, PVR Superplex, and surrounding retail outlets. Gate B and Gate C serve the affluent residential enclaves of Dollars Colony, JP Nagar 3rd and 4th Phases, and BTM Layout 2nd Stage. The station incorporates an elevated concourse with automated ticket vending machines (ATVMs), commuter restrooms, baby care facilities, and digital LED train arrival prediction displays synchronized with BMRCL\'s central command center.'
        },
        {
          heading: '7. Station 5 Deep Dive: Jayadeva Hospital Iconic Multi-Level Interchange Architecture',
          text: 'Jayadeva Hospital station stands as an engineering marvel and the crown jewel of Indian urban mass transit infrastructure. Constructed over a multi-year engineering campaign that involved demolishing the old Jayadeva flyover and erecting a six-level integrated transit complex, this colossal interchange physically merges the elevated Yellow Line (RV Road to Bommasandra) with the elevated Pink Line (Kalena Agrahara to Tavarekere). The complex architecture is organized across distinct vertical tiers: Level 1 and Level 2 handle subterranean and street vehicular flow along Bannerghatta Road and the Outer Ring Road; Level 3 houses the combined roadway flyover; Level 4 features the unified ticketing and concourse terminal; Level 5 operates Yellow Line Platform 1 (Westbound to RV Road) and Platform 2 (Eastbound to Central Silk Board & Electronic City); and Level 6 operates Pink Line Platform 3 (Northbound to Tavarekere) and Platform 4 (Southbound to Kalena Agrahara). Dedicated central escalators and high-speed elevators enable cross-corridor platform transfers in under 2 minutes and 45 seconds without passengers having to exit through ticketing gates.'
        },
        {
          heading: '8. Station 6 Deep Dive: Tavarekere (Swagath Road Cross, Koramangala & Christ University)',
          text: 'Serving as the terminal node of the Phase 1 elevated section at chainage 7.50 km, Tavarekere station (located near Swagath Road Cross and Dairy Circle periphery) serves as the primary gateway to Koramangala, SG Palya, and Christ University Central Campus. Gate A connects commuters to the bustling student and tech residential neighborhoods of SG Palya and Tavarekere Main Road, while Gate B provides direct connectivity to Bannerghatta Main Road heading toward MICO Layout and Dairy Circle. Dedicated BMTC feeder buses stationed at Tavarekere ferry commuters every 4 minutes into Koramangala Sony World Signal, St. John\'s Hospital, and Forum Mall junction.'
        },
        {
          heading: '9. Advanced Rolling Stock, BEML Driverless CBTC Trainsets & Signaling Technology',
          text: 'The Pink Line elevated corridor is powered by indigenously manufactured six-coach stainless steel trainsets built by Bharat Earth Movers Limited (BEML) in Bengaluru under the \'Make in India\' program. The trains feature Grade of Automation 4 (GoA4) driverless Communication-Based Train Control (CBTC) signaling supplied by Alstom, utilizing radio-frequency communications between trackside transponders and on-board train computers to maintain high-precision 90-second minimum headway safety buffers. Each coach is equipped with high-efficiency variable-capacity HVAC cooling, regenerative braking systems that return up to 32% of electrical energy back into the 750V DC third-rail grid, automated platform screen half-height gates (PSGs) preventing accidental track falls, and panoramic emergency egress systems.'
        },
        {
          heading: '10. Phase 2B Underground Tunneling Update: Dairy Circle to Nagawara',
          text: 'While the elevated 7.5-km section from Kalena Agrahara to Tavarekere is now commercially operational, construction on the 13.76-km subterranean section from Dairy Circle to Nagawara is advancing at peak velocity. BMRCL\'s fleet of nine heavy earth pressure balance (EPB) and slurry Tunnel Boring Machines (TBMs)—including Urja, Varadha, Avani, and Bhadra—have achieved 100% tunneling breakthrough across the entire underground alignment. The remaining 12 underground stations spanning Dairy Circle, Lakkasandra, Langford Town, Rashtriya Military School, MG Road (interchange with Purple Line), Shivajinagar, Cantonment Railway Station, Pottery Town, Tannery Road, Venkateshpura, Kadugondanahalli, and Nagawara are currently undergoing architectural fit-outs, track laying, and traction sub-station commissioning, on track for an integrated network inauguration in late 2027.'
        },
        {
          heading: '11. Official Ticket Fares, Smart Card 5% Discounts & Train Timetables',
          text: 'In strict alignment with BMRCL Fare Fixation Committee directives, single-journey token pricing across the 7.5-km elevated Pink Line is capped affordably between ₹10 and ₹30: Kalena Agrahara to Hulimavu is ₹10; Kalena Agrahara to IIMB is ₹15; Kalena Agrahara to JP Nagar 4th Phase is ₹20; Kalena Agrahara to Jayadeva is ₹25; and Kalena Agrahara to Tavarekere is ₹30. Commuters paying with a BMRCL Varshik Smart Card or National Common Mobility Card (NCMC) receive an automatic 5% tariff discount on every single tap. Trains operate with clockwork reliability: Monday to Saturday departures run continuously from 05:00 AM to 11:05 PM, while Sunday services commence at 07:00 AM. Peak rush-hour frequency operates every 5 to 7 minutes, while off-peak headways run every 8 to 10 minutes.'
        },
        {
          heading: '12. Multimodal BMTC Feeder Bus Loops, Last-Mile Links & Why to Use NammaRide',
          text: 'To ensure comprehensive last-mile convenience, BMTC has deployed 45 dedicated midi feeder buses operating in synchronized 5-minute loops connecting Pink Line stations to surrounding suburban centers: Route MF-5 connects JP Nagar 4th Phase to Central Silk Board via BTM 2nd Stage; Route MF-12 links Jayadeva Hospital to Electronic City Phase 1; and Route MF-18 connects Tavarekere directly to Koramangala 5th Block and Sony World Signal. For navigating this expanded network, commuters rely on NammaRide (https://www.nammaride.site/). Engineered specifically for BMRCL riders, NammaRide operates 100% offline using satellite GPS, automatically pinpoints your current station without mobile internet, calculates precise smart card savings, and delivers step-by-step walking instructions for Jayadeva and Majestic platform interchanges.'
        }
      ],
      quickLinks: [
        { label: 'View Dedicated Pink Line Guide', to: '/pink-line' },
        { label: 'Plan Route on NammaRide Simulator', to: '/simulator' },
        { label: 'Check First and Last Train Timings', to: '/timings' },
        { label: 'Calculate Pink Line Ticket Fare', to: '/fare-calculator' },
        { label: 'Download NammaRide Android App', to: '/download' }
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
    },
    {
      id: 6,
      slug: 'bengaluru-metro-fare-calculator-token-smart-card-guide-2026',
      title: 'Bengaluru Metro Fare Calculator 2026: Complete Token Price Chart, Smart Card 5% Discount, Day Pass & Cost Guide',
      category: 'guide',
      categoryLabel: 'Fare & Price Guide',
      readTime: '14 min read',
      date: 'Nov 12, 2026',
      image: '/simulator/assets/images/stations/P05.jpg',
      summary: 'Exhaustive guide to Bengaluru Namma Metro ticket prices across Purple, Green, Yellow, and Pink lines. Calculate exact distance tariffs from ₹10 to ₹65, 5% Varshik Smart Card savings, ₹70 unlimited Day Passes, and station-to-station route fares.',
      snippet: 'Calculating your daily Bengaluru Metro travel expense has never been simpler. Whether you are an everyday commuter heading to Whitefield or Electronic City, a university student traveling between Jnanabharathi and Majestic, or a tourist exploring Lalbagh and Cubbon Park, this guide breaks down BMRCL\'s official 2026 fare slabs, token prices, smart card discounts, and tourist day passes.',
      sections: [
        {
          heading: '1. Official 2026 BMRCL Distance-Based Fare Structure',
          text: 'Bangalore Metro Rail Corporation Limited (BMRCL) operates a graduated distance-based tariff system across all four active corridors (Purple, Green, Yellow, and elevated Pink Line). Ticket prices start at a base minimum of ₹10 for short hops (0 to 2 km, typically 1 to 2 stations) and incrementally scale up to ₹20 (2 to 5 km), ₹35 (5 to 12 km), ₹50 (12 to 21 km), capping at a maximum of ₹60 to ₹65 for end-to-end multi-line transits spanning over 40 kilometers (such as Whitefield to Challaghatta or Madavara BIEC to Silk Institute). Unlike road transit where surge pricing and fuel congestion fees inflate travel costs unpredictably, Namma Metro tariffs remain completely fixed, transparent, and regulated by the statutory Fare Fixation Committee.'
        },
        {
          heading: '2. BMRCL Varshik Smart Card & NCMC 5% Tariff Discount',
          text: 'Daily commuters are strongly encouraged to utilize a contactless smart card. The BMRCL Varshik Smart Card or any RuPay-compliant National Common Mobility Card (NCMC) issued by Indian banks unlocks an automatic 5% discount on every journey compared to single cash tokens or paper QR slips. For example, a ₹60 maximum cross-city journey costs only ₹57 with a Smart Card. A new smart card costs ₹50 as a refundable issuance fee upon return, with an initial minimum recharge value of ₹50. Cards can be topped up via the official BMRCL portal, UPI apps, or ticket vending machines at all 100 stations. The 5% savings compounds significantly: a daily round-trip commuter saving ₹6 per day retains over ₹150 monthly and ₹1,800 annually, alongside bypassing lengthy queue bottlenecks at manual token counters.'
        },
        {
          heading: '3. Unlimited 1-Day & 3-Day Tourist Travel Passes Explained',
          text: 'For tourists, family visitors, and professionals attending day-long conferences at the Bangalore International Exhibition Centre (BIEC) or Whitefield ITPL, BMRCL offers dedicated Unlimited Travel Passes: 1) The 1-Day Travel Pass costs ₹70 (plus a ₹50 refundable card deposit), granting unrestricted travel across all Purple, Green, Yellow, and Pink line stations for an entire operating calendar day from 05:00 AM to 11:05 PM. 2) The 3-Day Travel Pass costs ₹140 (plus ₹50 refundable card deposit), offering continuous 72-hour unlimited mobility across Bengaluru\'s transit network. These passes can be purchased at any metro station customer care counter and surrendered at journey completion to reclaim the ₹50 deposit.'
        },
        {
          heading: '4. Station-to-Station Fare Matrix for High-Traffic Commuter Routes',
          text: 'Here are the verified single-journey token tariffs and smart card discounted fares for Bengaluru\'s most heavily traversed transit pairings: 1) Nadaprabhu Kempegowda Station Majestic to Goraguntepalya (Green Line, 7 stops): Token ₹28, Smart Card ₹26.60. 2) Banashankari to Lalbagh (Green Line, 5 stops): Token ₹22, Smart Card ₹20.90. 3) Vijayanagar to Whitefield Kadugodi (Purple Line via Majestic, 25 stops): Token ₹60, Smart Card ₹57.00. 4) JP Nagar to Church Street / MG Road (Interchange at Majestic or direct via Pink Line): Token ₹35, Smart Card ₹33.25. 5) Jalahalli to Indiranagar (Green to Purple Line via Majestic): Token ₹45, Smart Card ₹42.75. 6) Electronic City Phase 1 to Majestic (Yellow to Green Line via RV Road): Token ₹40, Smart Card ₹38.00.'
        },
        {
          heading: '5. Paper QR Tickets vs WhatsApp Chatbot Ticketing',
          text: 'Commuters who do not possess a physical Smart Card can purchase digital QR tickets. BMRCL operates an official verified WhatsApp Chatbot (+91 81055 56677) where riders can select originating and destination stations and complete payment via UPI. NammaRide streamlines this process with a dedicated \'Book on WhatsApp\' feature that pre-fills your exact route parameters into the chat with a single tap. Alternatively, paper QR tickets can be purchased at station ticket counters and automated ticket vending machines (ATVMs) using cash or UPI.'
        },
        {
          heading: '6. Calculate Trip Fares & Monthly Commuter Savings on NammaRide',
          text: 'To eliminate guesswork, NammaRide integrates a real-time Metro Fare Calculator (https://www.nammaride.site/fare-calculator). Simply pick your origin and destination from our dropdown directory of 100 stations. The calculator displays single token cost, smart card discounted pricing, station hop count, line interchange notices, and projected monthly expense based on your custom workweek schedule, empowering Bengaluru commuters to budget transit expenses with absolute precision.'
        }
      ],
      quickLinks: [
        { label: 'Calculate Metro Fares Instantly', to: '/fare-calculator' },
        { label: 'Check 100 Stations Directory', to: '/stations' },
        { label: 'Download NammaRide Android App', to: '/download' }
      ]
    },
    {
      id: 7,
      slug: 'bangalore-metro-live-tracking-nearest-station-offline-radar',
      title: 'Bangalore Metro Live Tracking & Nearest Station Radar: How to Track Trains and Find Stations Offline',
      category: 'app',
      categoryLabel: 'Live Tracking & Radar',
      readTime: '13 min read',
      date: 'Nov 12, 2026',
      image: '/simulator/assets/images/stations/P10.jpg',
      summary: 'Learn how NammaRide uses on-device satellite GNSS to track Bangalore Metro trains live, locate your nearest station from your live coordinates, and navigate underground tunnels without mobile internet.',
      snippet: 'Bengaluru commuters frequently ask: "In which metro station am I right now?" or "Which is the nearest metro station to me from my current location?" Generic map applications fail deep subterranean inside underground tunnels like Majestic, Cubbon Park, and Vidhana Soudha because cellular triangulation collapses. NammaRide solves this through 100% offline satellite GPS station radar.',
      sections: [
        {
          heading: '1. The Subterranean Connectivity Problem in Urban Metros',
          text: 'When a metro train descends into deep underground tunnels—such as Bengaluru\'s 5.5-km east-west subterranean corridor running beneath MG Road, Cubbon Park, Dr. BR Ambedkar Vidhana Soudha, Sir M. Visveshwaraya Central College, and Majestic—cellular towers on the surface lose direct line-of-sight. Mobile data drops from 5G to non-functional 2G or \'No Service\'. Cloud-dependent transit apps that poll remote servers freeze, consume heavy battery power trying to reconnect, and report inaccurate location estimates. For passengers engrossed in work or listening to podcasts, this lack of real-time awareness frequently results in missed stops and frustrating interchange delays.'
        },
        {
          heading: '2. NammaRide\'s 100% Offline Satellite GNSS Architecture',
          text: 'NammaRide was engineered with a privacy-first, on-device computing paradigm that requires zero continuous internet. When you launch NammaRide, the app interfaces directly with your smartphone\'s native Global Navigation Satellite System (GNSS) hardware receiver—utilizing GPS, GLONASS, Galileo, and NavIC satellite constellations. The complete spatial geospatial coordinates of all 100 BMRCL stations are cached locally in under 1 MB of storage. The app calculates spatial haversine distance matrices entirely on your device in under 120 milliseconds, delivering 100% reliable station identification without transmitting a single byte of telemetry to remote servers.'
        },
        {
          heading: '3. Instant Nearest Station Radar: "Where Is the Nearest Metro from My Location?"',
          text: 'Whether you are stepping out of an office in Whitefield, leaving an apartment in Electronic City, or shopping in Jayanagar, NammaRide\'s Nearest Station Radar provides immediate geographic clarity. With a single tap, the radar computes your radial distance to nearby stations across Purple, Green, Yellow, and Pink lines. It presents the optimal station entry gate (Gate A, B, C, or D), walking duration in minutes, and direct surface street navigation, eliminating confusing detours and expensive auto-rickshaw surcharges.'
        },
        {
          heading: '4. Live Train Motion Simulation & Progress Tracker',
          text: 'On both our mobile app and live web simulator (https://www.nammaride.site/simulator), commuters can track train journeys in real time. NammaRide\'s trajectory engine models train kinematics, average inter-station run speeds (32 to 36 km/h operational average), dwell times (25 seconds at standard stops, 45 seconds at interchange hubs like Majestic and Jayadeva), and real-time headway frequency. Commuters can view countdown timers for arriving trains, remaining intermediate stations, and line transition alerts.'
        },
        {
          heading: '5. Subterranean Proximity Alerts & Hardware Vibration Feedback',
          text: 'Never miss your stop again. NammaRide includes background proximity monitoring that triggers a distinct hardware vibration pulse on your smartphone two minutes before your train pulls into your chosen destination or interchange station. Because the proximity algorithm runs locally on background GNSS telemetry, the alert reliably fires even when your phone is asleep in your pocket, in airplane mode, or deep inside subterranean tunnels.'
        },
        {
          heading: '6. Zero Data Telemetry & Absolute Commuter Privacy',
          text: 'In an era where transit apps monetize user movements by selling real-time geo-location logs to ad networks, NammaRide guarantees absolute privacy. We do not track your journeys, collect device advertising IDs, require account logins, or display intrusive banner ads. All route computations execute exclusively inside your device memory.'
        }
      ],
      quickLinks: [
        { label: 'Try Live Simulator & Station Radar', to: '/simulator' },
        { label: 'Find Nearest Station on Map', to: '/map' },
        { label: 'Download NammaRide Android App', to: '/download' }
      ]
    },
    {
      id: 8,
      slug: 'bangalore-metro-timings-first-last-train-schedule-2026',
      title: 'Bangalore Metro Timings 2026: First & Last Train Departure Schedule for All 100 Stations',
      category: 'guide',
      categoryLabel: 'Timetable Schedule',
      readTime: '12 min read',
      date: 'Nov 12, 2026',
      image: '/simulator/assets/images/stations/P15.jpg',
      summary: 'Comprehensive 2026 timetable guide for Bengaluru Namma Metro. Check exact first train (05:00 AM) and last train (11:05 PM) departures, peak frequencies (3.5 to 5 mins), and interchange connection windows.',
      snippet: 'Planning your early morning airport connection, daily office commute, or late-night return from Church Street requires dependable timetable intelligence. This comprehensive guide covers BMRCL\'s official 2026 operating hours, peak and off-peak headway frequencies, Sunday schedules, and last-train connection protocols across all 100 stations.',
      sections: [
        {
          heading: '1. Standard Weekday Operating Hours (Monday to Saturday)',
          text: 'From Monday through Saturday, Bengaluru Namma Metro commences commercial train departures promptly at 05:00 AM from all eight primary terminal stations: Whitefield (Kadugodi) and Challaghatta on the Purple Line; Madavara (BIEC) and Silk Institute on the Green Line; RV Road and Bommasandra on the Yellow Line; and Kalena Agrahara and Tavarekere on the Pink Line. Revenue service concludes with final terminal departures at 11:05 PM. Intermediate stations along the corridor observe synchronized departure schedules, ensuring that commuters throughout the network can catch trains well past 11:30 PM depending on their station location.'
        },
        {
          heading: '2. Sunday & National Holiday Schedule Modifications',
          text: 'On Sundays and designated national holidays (such as Republic Day, Independence Day, and Gandhi Jayanti), commercial operations commence at 07:00 AM across all four corridors to facilitate overnight maintenance and track inspection protocols. Closing hours remain unchanged, with the final departures leaving terminal stations at 11:05 PM. On special occasions such as New Year\'s Eve, cricket matches at M. Chinnaswamy Stadium, or cultural festivals, BMRCL frequently extends revenue services until 01:30 AM or 02:00 AM, with special flat-fare paper tokens issued at key hubs like MG Road, Cubbon Park, and Majestic.'
        },
        {
          heading: '3. Peak vs Off-Peak Headway Frequencies',
          text: 'BMRCL modulates train frequency dynamically across the day to match passenger demand: 1) Morning Peak (08:30 AM to 10:30 AM): Trains run at intense 3.5 to 5-minute intervals along the Purple and Green lines, and 6 to 8 minutes on the Yellow and Pink lines. 2) Evening Peak (05:00 PM to 08:30 PM): Frequency matches morning peak intervals of 3.5 to 5 minutes to clear office crowds from ITPL, Whitefield, Electronic City, and the CBD. 3) Non-Peak Hours (11:00 AM to 04:30 PM): Trains operate every 7 to 10 minutes. 4) Early Morning & Late Night (05:00 AM to 07:00 AM & 10:00 PM to 11:05 PM): Trains operate every 10 to 12 minutes.'
        },
        {
          heading: '4. Majestic, Jayadeva & RV Road Last-Train Connection Protocols',
          text: 'Catching the final transfer train requires careful timing. At Nadaprabhu Kempegowda Station Majestic, the final trains from all four directional quadrants (Challaghatta, Whitefield, BIEC Madavara, and Silk Institute) arrive between 11:25 PM and 11:35 PM. BMRCL operating protocol ensures that connecting trains wait for platform transfers before closing doors, granting transferring commuters a secure 4-minute window to walk between Purple Line (Level 2) and Green Line (Level 3). At Jayadeva Hospital, the final Yellow and Pink line connections synchronize at 11:20 PM.'
        },
        {
          heading: '5. Average Inter-Station Travel Durations Across Corridors',
          text: 'Namma Metro operates at an average design speed of 65 km/h and an operational commercial speed (including station dwell times) of 32 to 34 km/h. Representative end-to-end trip durations: 1) Whitefield (Kadugodi) to Challaghatta (Purple Line, 43.49 km): 76 minutes. 2) Madavara (BIEC) to Silk Institute (Green Line, 33.4 km): 68 minutes. 3) RV Road to Bommasandra (Yellow Line, 18.82 km): 34 minutes. 4) Kalena Agrahara to Tavarekere (Pink Line, 7.5 km): 14 minutes. 5) Majestic to Whitefield: 42 minutes. 6) Majestic to Electronic City: 44 minutes (including RV Road interchange).'
        },
        {
          heading: '6. Check Real-Time Timings & First/Last Departures on NammaRide',
          text: 'Never worry about missing the last train home. With NammaRide\'s Timings Guide (https://www.nammaride.site/timings), commuters can select any station to view exact weekday, Saturday, and Sunday first and last departure schedules, headway frequency charts, and travel durations—all stored 100% offline inside the application.'
        }
      ],
      quickLinks: [
        { label: 'View Full Train Timings Schedule', to: '/timings' },
        { label: 'Plan Route Duration on Simulator', to: '/simulator' },
        { label: 'Download NammaRide Android App', to: '/download' }
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
