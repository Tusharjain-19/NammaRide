# NammaRide - App Promotion Website PRD
## Complete Specification for Marketing & Download Landing Page

**Document Version:** 1.0  
**Last Updated:** August 22, 2026  
**Status:** Ready for Development  
**Audience:** Design & Frontend Development Teams  

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Website Overview](#website-overview)
3. [Complete Page Structure](#complete-page-structure)
4. [Page-by-Page Specifications](#page-by-page-specifications)
5. [Design System](#design-system)
6. [Component Specifications](#component-specifications)
7. [Interactive Elements](#interactive-elements)
8. [SEO & Analytics](#seo--analytics)
9. [Performance Requirements](#performance-requirements)
10. [Deployment & Hosting](#deployment--hosting)

---

# EXECUTIVE SUMMARY

## What is NammaRide App Promotion Website?

A high-conversion landing page & marketing website designed to:
- **Educate visitors** about NammaRide's features and value
- **Drive downloads** from Google Play Store
- **Build credibility** with testimonials, ratings, and trust signals
- **Convert casual browsers** to active users

## Key Objectives
1. **Primary CTA:** Get users to download app from Google Play Store
2. **Secondary CTAs:** Explore website simulator, read blog, join community
3. **Build Trust:** Show ratings, reviews, and user testimonials
4. **SEO Growth:** Rank for "Bengaluru metro app" and related keywords
5. **Analytics:** Track user behavior and conversion funnels

## Target Audience
- Daily metro commuters (18-45 years old)
- Tech-savvy professionals in Bengaluru
- Tourists visiting the city
- Students using public transportation
- Accessibility-focused users

## Success Metrics
- **Download conversion rate:** 15-20% of visitors
- **Website traffic:** 10,000+ monthly visitors (Year 1)
- **App downloads:** 5,000+ downloads (first month)
- **Average session duration:** 3-5 minutes
- **Return visitors:** 30%+ of traffic

---

# WEBSITE OVERVIEW

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS + custom components
- **Deployment:** Vercel
- **Domain:** `nammaride.in` or `www.nammaride.in`
- **SSL:** Yes (HTTPS required)

### Backend (Optional)
- **Newsletter:** Mailchimp integration
- **Analytics:** Google Analytics 4 + Plausible
- **Forms:** Formspree or Netlify Forms
- **CDN:** Vercel Edge Network

### Performance Targets
- **Page Load Time:** < 2 seconds (3G)
- **Lighthouse Score:** 90+ (all metrics)
- **Mobile Responsiveness:** 100% mobile-first design
- **SEO Score:** 95+

## Domain & Hosting

| Aspect | Details |
|--------|---------|
| **Primary Domain** | `nammaride.in` |
| **Alternative Domains** | `www.nammaride.in`, `getnammaride.com` |
| **DNS Provider** | Cloudflare (free tier) |
| **Hosting** | Vercel (automatic deployments) |
| **SSL Certificate** | Automatic (Let's Encrypt via Vercel) |
| **CDN** | Vercel Edge Network |
| **Email** | support@nammaride.in (via Gmail or custom) |

---

# COMPLETE PAGE STRUCTURE

## Site Map & Navigation

```
nammaride.in/
│
├── / (Homepage)
│   └─ Hero section
│   └─ Feature highlights
│   └─ How it works
│   └─ Testimonials
│   └─ FAQ
│   └─ CTA: Download app
│
├── /features (Detailed features page)
│   └─ Journey planner
│   └─ Metro map
│   └─ Fare calculator
│   └─ Accessibility
│   └─ Offline capability
│
├── /download (Download page)
│   └─ Google Play link
│   └─ Web simulator
│   └─ System requirements
│   └─ Installation guide
│
├── /about (About us)
│   └─ Mission & vision
│   └─ Team (developer bio)
│   └─ Story
│   └─ Contact
│
├── /testimonials (User reviews & ratings)
│   └─ Featured reviews
│   └─ Google Play ratings
│   └─ Video testimonials
│
├── /blog (Content hub)
│   └─ "Guide to Bengaluru Metro"
│   └─ "Best places near metro"
│   └─ "Safety tips"
│   └─ "Tips & tricks"
│
├── /simulator (Web-based journey planner)
│   └─ Interactive tool
│   └─ No app required
│
├── /privacy (Privacy policy)
│   └─ GDPR compliant
│   └─ Data handling
│
├── /terms (Terms of service)
│   └─ Usage terms
│   └─ Disclaimer
│
├── /contact (Contact form)
│   └─ Support email
│   └─ Social links
│
└── /404 (Not found page)
    └─ Custom 404
    └─ Link back to home
```

---

# PAGE-BY-PAGE SPECIFICATIONS

## PAGE 1: HOMEPAGE (Landing Page)

### URL
`https://nammaride.in/`

### Purpose
Primary landing page designed to convert visitors into app downloaders. Optimized for mobile traffic.

### Page Layout (Visual Structure)

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR (Sticky)                  │
│ [NammaRide Logo] [Home] [Features] [Download] [Blog]        │
│                              [Contact] [ಕನ್ನಡ 🇮🇳]        │
└─────────────────────────────────────────────────────────────┘

╔═════════════════════════════════════════════════════════════╗
║                       HERO SECTION                          ║
║                                                             ║
║   Navigate Bengaluru Metro Smarter & Offline              ║
║                                                             ║
║   Private, lightweight, offline-first metro companion       ║
║   for daily commuters, tech professionals & tourists        ║
║                                                             ║
║   [DOWNLOAD FROM GOOGLE PLAY] [TRY WEB SIMULATOR]          ║
║                                                             ║
║   ⭐ 4.5/5 Rating | 🚀 1.2K+ Downloads | 🔒 Privacy First  ║
║                                                             ║
║   [Hero Image: Metro train, Bengaluru skyline]             ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│              WHY CHOOSE NAMMA RIDE? (6-COLUMN GRID)         │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ 🔒       │  │ 📱       │  │ 🗺️       │                 │
│  │ Privacy  │  │ Offline  │  │ Smart    │                 │
│  │ First    │  │ Capable  │  │ Routes   │                 │
│  │          │  │          │  │          │                 │
│  │ Zero ads │  │ 100%     │  │ Fastest, │                 │
│  │ No       │  │ offline  │  │ cheapest │                 │
│  │ tracking │  │ without  │  │ or       │                 │
│  │          │  │ internet │  │ accessible
│  │ [Learn   │  │ [Learn   │  │ [Learn   │                 │
│  │ More >]  │  │ More >]  │  │ More >]  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ 🌍       │  │ 📍       │  │ ♿       │                 │
│  │ Local    │  │ Landmark │  │ Inclusive│                 │
│  │ Focus    │  │ Guide    │  │ Design   │                 │
│  │          │  │          │  │          │                 │
│  │ 200+     │  │ 150+     │  │ Full     │                 │
│  │ verified │  │ spots    │  │ accessibility
│  │ POIs     │  │ mapped   │  │ support  │                 │
│  │          │  │          │  │          │                 │
│  │ [Learn   │  │ [Learn   │  │ [Learn   │                 │
│  │ More >]  │  │ More >]  │  │ More >]  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              HOW IT WORKS (4-STEP PROCESS)                  │
│                                                             │
│ STEP 1: DOWNLOAD              STEP 2: SEARCH              │
│ ┌──────────────────┐          ┌──────────────────┐        │
│ │ Get from Play    │    ➜     │ Enter source &   │        │
│ │ Store (45 MB)    │          │ destination      │        │
│ │ [DOWNLOAD NOW]   │          │ [Search Example] │        │
│ └──────────────────┘          └──────────────────┘        │
│                                                            │
│ STEP 3: VIEW ROUTES            STEP 4: TRAVEL            │
│ ┌──────────────────┐          ┌──────────────────┐        │
│ │ See best routes, │    ➜     │ Navigate with    │        │
│ │ fares & platforms│          │ platform details │        │
│ │ [View Example]   │          │ & accessibility  │        │
│ └──────────────────┘          └──────────────────┘        │
│                                                             │
│ Total time: 2 minutes from download to first journey       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          KEY FEATURES SHOWCASE (3-COLUMN LAYOUT)           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │ 🚇 REAL-TIME JOURNEY PLANNER                             │ │
│ │ Plan your metro journey instantly with:                  │ │
│ │ • Fastest routes                                         │ │
│ │ • Fewest transfers                                       │ │
│ │ • Cheapest fares                                         │ │
│ │ • Platform directions                                    │ │
│ │ • Accessibility info                                     │ │
│ │ • Next train countdown                                   │ │
│ │                                                           │ │
│ │ ✨ All without internet! Offline routing works            │ │
│ │ perfectly in metro tunnels.                              │ │
│ │                                                           │ │
│ │ [TRY JOURNEY PLANNER] [SCREENSHOT]                       │ │
│ │                                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │ 🗺️ INTERACTIVE METRO MAP                                 │ │
│ │ Explore Bengaluru's 108 metro stations across 3 lines:  │ │
│ │ • 🔴 Red Line (31 stations)                             │ │
│ │ • 🔵 Blue Line (57 stations)                            │ │
│ │ • 🟣 Purple Line (20 stations)                          │ │
│ │                                                           │ │
│ │ Click any station to see:                                │ │
│ │ • Operating hours & train frequency                      │ │
│ │ • Facilities (ATM, WiFi, food court)                     │ │
│ │ • Accessibility features                                 │ │
│ │ • Nearby landmarks & attractions                         │ │
│ │ • Platform directions & exit info                        │ │
│ │                                                           │ │
│ │ [EXPLORE MAP] [SCREENSHOT]                               │ │
│ │                                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │ 💰 SMART FARE CALCULATOR                                 │ │
│ │ Compare prices instantly:                                │ │
│ │ • Cash token vs Smart Card savings                       │ │
│ │ • Monthly & yearly cost estimates                        │ │
│ │ • Tourist pass recommendations                           │ │
│ │ • Recharge planner                                       │ │
│ │                                                           │ │
│ │ Example: Save ₹600/year by switching to Smart Card!      │ │
│ │                                                           │ │
│ │ [TRY CALCULATOR] [SCREENSHOT]                            │ │
│ │                                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│           MORE FEATURES (CAROUSEL/TABS)                     │
│                                                             │
│ [📍 Landmarks Guide] [🕐 Live Timings] [♿ Accessibility]  │
│ [🌍 Bilingual]       [📱 Offline First] [🔒 Privacy]       │
│                                                             │
│ [Explore each feature with descriptions]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          DOWNLOAD STATS & CREDIBILITY SIGNALS              │
│                                                             │
│  📥 1.2K+ Downloads   ⭐ 4.5/5 Avg Rating                  │
│  👥 500+ Monthly Users   🎯 Verified by 200+ Reviews       │
│  🔒 100% Privacy   📱 Available on Android                 │
│                                                             │
│  [Featured In: Tech News, Local News, Startup Lists]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        USER TESTIMONIALS (3-COLUMN CAROUSEL)               │
│                                                             │
│ ⭐⭐⭐⭐⭐                 ⭐⭐⭐⭐⭐              ⭐⭐⭐⭐⭐  │
│ "Best metro app!"       "Game changer!"       "Love it!"    │
│                                                             │
│ "NammaRide has become   "Finally, an app that  "The offline │
│ my go-to for daily      respects my privacy!  mode saved me │
│ commute. Platform       No tracking, just     when I lost   │
│ directions are so       smart navigation.     signal in the │
│ helpful!"               Highly recommend!"    tunnel!"      │
│                                                             │
│ - Priya K              - Rahul M             - Sneha P      │
│   Software Engineer      Product Manager       Student      │
│   Whitefield, Bangalore  Koramangala, BNG      Indiranagar   │
│                                                             │
│ ← [Previous] [More testimonials...] [Next] →              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         FREQUENTLY ASKED QUESTIONS (Expandable)            │
│                                                             │
│ Q: Do I need internet to use NammaRide?                    │
│ A: No! All data is stored locally on your phone...        │
│    [Expand ▼]                                              │
│                                                             │
│ Q: Does NammaRide track my location?                       │
│ A: Never. Privacy is our core value...                    │
│    [Expand ▼]                                              │
│                                                             │
│ Q: Is NammaRide free?                                      │
│ A: Yes, completely free with no ads!                      │
│    [Expand ▼]                                              │
│                                                             │
│ Q: What Android version is required?                       │
│ A: Android 10 (API 29) or higher. Works on 95%+ devices.  │
│    [Expand ▼]                                              │
│                                                             │
│ Q: Can I use it in other cities?                           │
│ A: Currently Bengaluru only. We're planning other cities!  │
│    [Expand ▼]                                              │
│                                                             │
│ [Show 5 more FAQs]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            FINAL CALL-TO-ACTION SECTION                    │
│                                                             │
│          Ready to Navigate Bengaluru Smarter?              │
│                                                             │
│              [DOWNLOAD FROM GOOGLE PLAY]                   │
│              Available for Android 10+                     │
│              Size: 45 MB | Free • No Ads                   │
│                                                             │
│              Or try the web simulator first:               │
│              [TRY WEB SIMULATOR]                           │
│                                                             │
│    Questions? [Contact Support] | [Read Blog] | [FAQ]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        FOOTER                               │
│                                                             │
│ Company | Privacy Policy | Terms | Contact | Blog          │
│ Follow: Instagram | Twitter | LinkedIn                     │
│                                                             │
│ Made with ❤️ by Tushar Jain | © 2026 NammaRide           │
│ Not affiliated with BMRCL                                  │
│                                                             │
│ support@nammaride.in | tusharjain.in                       │
└─────────────────────────────────────────────────────────────┘
```

### Hero Section (Detailed)

```html
<!-- HERO SECTION HTML STRUCTURE -->
<section class="hero" style="height: 100vh; position: relative;">
  <!-- Background Image -->
  <div class="hero-bg" 
       style="
         background: linear-gradient(135deg, rgba(110, 59, 163, 0.85) 0%, rgba(46, 92, 205, 0.85) 100%),
                     url('/images/metro-hero.jpg') center/cover;
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         z-index: 1;
       ">
  </div>

  <!-- Content Layer -->
  <div class="hero-content" style="position: relative; z-index: 2;">
    <div class="container max-w-4xl mx-auto px-4 flex flex-col justify-center h-full">
      
      <!-- Main Headline -->
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
        Navigate Bengaluru Metro
        <br />
        Smarter & Offline
      </h1>

      <!-- Subheadline -->
      <p class="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl leading-relaxed">
        Private, lightweight, offline-first metro companion for daily commuters, 
        tech professionals & tourists. No ads. No tracking. Just smart navigation.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mb-12">
        <!-- Primary Button -->
        <a href="https://play.google.com/store/apps/details?id=com.nammaride.app"
           class="btn-primary px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-colors"
           target="_blank"
           rel="noopener noreferrer">
          Download from Google Play
          <span class="ml-2">→</span>
        </a>

        <!-- Secondary Button -->
        <a href="/simulator"
           class="btn-secondary px-8 py-4 border-2 border-white text-white hover:bg-white/10 rounded-lg font-bold text-lg transition-colors">
          Try Web Simulator
        </a>
      </div>

      <!-- Trust Signals -->
      <div class="flex flex-wrap gap-8 text-white/90">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⭐</span>
          <span>4.5/5 Rating</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚀</span>
          <span>1.2K+ Downloads</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🔒</span>
          <span>Privacy First</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>
```

### Hero Section CSS

```css
.hero {
  background: linear-gradient(135deg, #6E3BA3 0%, #2E5CCD 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/patterns/metro-pattern.png') repeat;
  opacity: 0.1;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
    padding: 24px;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1rem;
  }
}
```

---

## PAGE 2: FEATURES PAGE

### URL
`https://nammaride.in/features`

### Purpose
Detailed showcase of all app features with examples, screenshots, and benefits.

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                               │
│ Powerful Features, Simple Design                            │
│ Everything you need for smart metro navigation              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           FEATURE TABS / NAVIGATION                         │
│                                                             │
│ [Journey Planner] [Metro Map] [Fare Calculator]            │
│ [Timings] [Landmarks] [Accessibility] [Offline Mode]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEATURE 1: JOURNEY PLANNER (Active Tab)                    │
│                                                             │
│ [Screenshot - Left Side]    [Description - Right Side]     │
│                                                             │
│ IMAGE:                      TEXT:                          │
│ Phone showing journey       Find the perfect route in      │
│ planner interface           seconds with 3 options:        │
│                                                             │
│ • Fastest route             ✓ Smart Route Calculation     │
│ • Fewest transfers          ✓ Real-time ETAs              │
│ • Cheapest option           ✓ Platform directions         │
│                             ✓ Fare comparison             │
│                             ✓ Accessibility filters       │
│                             ✓ Next train countdown        │
│                                                             │
│                             Works 100% offline!            │
│                                                             │
│                             [DOWNLOAD NOW]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEATURE 2: INTERACTIVE METRO MAP                           │
│                                                             │
│ [Screenshot - Right Side]   [Description - Left Side]      │
│                                                             │
│ TEXT:                       IMAGE:                         │
│ Explore all 108 stations    Phone showing interactive     │
│ across 3 metro lines        metro map with:               │
│                                                             │
│ ✓ 3 Metro Lines             • 🔴 Red Line                │
│ ✓ 108 Total Stations        • 🔵 Blue Line               │
│ ✓ Click for Details         • 🟣 Purple Line             │
│ ✓ Accessibility Icons       • Station info on tap         │
│ ✓ Landmark Integration      • Quick route planning        │
│ ✓ Offline Map              • Accessibility symbols       │
│                                                             │
│ Know your metro network     [EXPLORE FEATURES]             │
│ at a glance!                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEATURE 3: SMART FARE CALCULATOR                           │
│                                                             │
│ [Screenshot - Left]         [Description - Right]          │
│                                                             │
│ IMAGE:                      TEXT:                          │
│ Fare comparison             Compare prices instantly:      │
│ showing cash vs             • Cash Token vs Smart Card     │
│ smart card savings          • Monthly/Yearly Savings       │
│                             • Tourist Pass Options         │
│                             • Recharge Planner             │
│                             • Balance Tracker              │
│                                                             │
│                             Save ₹600/year on your         │
│                             commute with smart choices!    │
│                                                             │
│                             [TRY CALCULATOR]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          FEATURE COMPARISON TABLE                           │
│                                                             │
│ ┌──────────────────┬────────────┬────────────┬──────────┐  │
│ │ Feature          │ NammaRide  │ Official   │ Maps     │  │
│ │                  │            │ BMRCL App  │          │  │
│ ├──────────────────┼────────────┼────────────┼──────────┤  │
│ │ Offline Mode     │ ✅         │ ❌         │ ❌       │  │
│ │ Privacy First    │ ✅         │ ⚠️         │ ❌       │  │
│ │ Fare Calculator  │ ✅         │ ✅         │ ❌       │  │
│ │ Landmarks        │ ✅ 200+    │ ⚠️ Limited │ ✅       │  │
│ │ Accessibility    │ ✅ Detailed│ ⚠️ Basic   │ ⚠️       │  │
│ │ Bilingual        │ ✅         │ ✅         │ ✅       │  │
│ │ Station Platforms│ ✅         │ ❌         │ ❌       │  │
│ │ Platform Maps    │ ✅ SVG     │ ❌         │ ❌       │  │
│ │ No Ads          │ ✅         │ ✅         │ ❌       │  │
│ │ Size            │ 45 MB      │ 80 MB      │ 150 MB   │  │
│ └──────────────────┴────────────┴────────────┴──────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              ADDITIONAL FEATURES LIST                       │
│                                                             │
│ ✓ Live Timings & Schedules    ✓ Women Safety Features     │
│ ✓ Station Directories         ✓ Emergency Contacts        │
│ ✓ Transit Hub Integration    ✓ User Reviews & Ratings    │
│ ✓ Favorite Stations          ✓ Recent Searches           │
│ ✓ Bilingual Interface (EN/KN)  ✓ Dark Mode                │
│ ✓ Next Train Alerts          ✓ Journey Sharing           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  SYSTEM REQUIREMENTS                        │
│                                                             │
│ 📱 Android 10+ (API 29+)                                   │
│ 💾 45 MB storage                                           │
│ 📡 Works offline (optional: internet for updates)          │
│ 📍 Location permission: Optional (for "current location")  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CTA: DOWNLOAD NOW                        │
│                                                             │
│                [DOWNLOAD FROM GOOGLE PLAY]                 │
│                                                             │
│                  [TRY WEB SIMULATOR]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

---

## PAGE 3: DOWNLOAD PAGE

### URL
`https://nammaride.in/download`

### Purpose
Dedicated download page with Google Play Store link, installation guide, and alternative options.

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                               │
│ Download NammaRide                                           │
│ Get the app in 30 seconds                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             MAIN DOWNLOAD OPTIONS (2-Column)               │
│                                                             │
│ ┌──────────────────────────┐ ┌──────────────────────────┐  │
│ │                          │ │                          │  │
│ │      GOOGLE PLAY          │ │     WEB SIMULATOR        │  │
│ │                          │ │                          │  │
│ │ ✓ Full-featured app      │ │ ✓ Try before download    │  │
│ │ ✓ Works offline          │ │ ✓ No installation        │  │
│ │ ✓ Push notifications     │ │ ✓ Instant access         │  │
│ │ ✓ GPS tracking (optional)│ │ ✓ Works on any browser   │  │
│ │ ✓ 45 MB size            │ │                          │  │
│ │ ✓ Android 10+            │ │                          │  │
│ │                          │ │                          │  │
│ │ ⭐ 4.5/5 (180 reviews)   │ │                          │  │
│ │ 📥 1.2K+ downloads       │ │                          │  │
│ │                          │ │                          │  │
│ │                          │ │                          │  │
│ │ [DOWNLOAD NOW] →         │ │ [TRY NOW] →              │  │
│ │                          │ │                          │  │
│ └──────────────────────────┘ └──────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            STEP-BY-STEP INSTALLATION GUIDE                  │
│                                                             │
│ STEP 1: CHECK COMPATIBILITY                               │
│ ┌─────────────────────────────────────────┐               │
│ │ ✓ Device: Android phone/tablet          │               │
│ │ ✓ Version: Android 10 (API 29) or later │               │
│ │ ✓ Storage: 50 MB free space             │               │
│ │ ✓ Check your Android version:           │               │
│ │   Settings > About Phone > Android       │               │
│ │                                         │               │
│ │ Not compatible? Email us: support@...   │               │
│ └─────────────────────────────────────────┘               │
│                                                             │
│ STEP 2: OPEN GOOGLE PLAY STORE                            │
│ ┌─────────────────────────────────────────┐               │
│ │ [Screenshot of Play Store icon]         │               │
│ │                                         │               │
│ │ Open Google Play Store app on your      │               │
│ │ Android device. Search for "NammaRide"  │               │
│ └─────────────────────────────────────────┘               │
│                                                             │
│ STEP 3: TAP "INSTALL"                                     │
│ ┌─────────────────────────────────────────┐               │
│ │ [Screenshot of NammaRide Play page]     │               │
│ │                                         │               │
│ │ Find NammaRide app and tap the          │               │
│ │ blue "INSTALL" button                   │               │
│ │ The download starts automatically        │               │
│ └─────────────────────────────────────────┘               │
│                                                             │
│ STEP 4: WAIT FOR INSTALLATION                             │
│ ┌─────────────────────────────────────────┐               │
│ │ [Screenshot of loading progress]        │               │
│ │                                         │               │
│ │ Wait ~30 seconds (size: 45 MB)          │               │
│ │ WiFi recommended for faster download    │               │
│ └─────────────────────────────────────────┘               │
│                                                             │
│ STEP 5: LAUNCH APP                                        │
│ ┌─────────────────────────────────────────┐               │
│ │ [Screenshot of app home screen]         │               │
│ │                                         │               │
│ │ Tap "OPEN" button or find NammaRide     │               │
│ │ in your app drawer                      │               │
│ │                                         │               │
│ │ App starts immediately with sample data │               │
│ │ No login required!                      │               │
│ └─────────────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         DIRECT DOWNLOAD LINK (For Desktop Users)           │
│                                                             │
│ Prefer to download via browser?                            │
│                                                             │
│ [DIRECT DOWNLOAD LINK]                                     │
│ https://play.google.com/store/apps/details?id=com.nammaride.app
│                                                             │
│ Or scan the QR code below:                                 │
│ [QR Code Image]                                            │
│                                                             │
│ Then open on your phone to install                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              SYSTEM REQUIREMENTS                            │
│                                                             │
│ • Operating System: Android 10 or higher                   │
│ • RAM: 2 GB minimum (recommended 4 GB+)                    │
│ • Storage: 50 MB free space                                │
│ • Architecture: ARM64 (most devices), ARM32 supported       │
│ • Internet: Not required (offline-first app)               │
│ • Permissions: Optional location, Storage read-write       │
│                                                             │
│ ✓ Compatible with 95% of Android devices currently in use  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               TROUBLESHOOTING GUIDE                         │
│                                                             │
│ ❓ "App not available in my country"                       │
│ Solution: Use VPN or contact support                       │
│                                                             │
│ ❓ "Insufficient storage"                                  │
│ Solution: Free up 50MB and try again                       │
│ Delete unused apps: Settings > Apps > Storage              │
│                                                             │
│ ❓ "Installation failed"                                   │
│ Solution: 1) Clear Play Store cache                        │
│          2) Restart device                                 │
│          3) Try again or contact support                   │
│                                                             │
│ ❓ "Needs to be updated" after install                     │
│ Solution: Enable auto-updates in Play Store                │
│ Settings > Google Play > Auto-update apps                  │
│                                                             │
│ More help: [Contact Support] [Email: support@nammaride.in] │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              APP RELEASE NOTES                              │
│                                                             │
│ Latest Version: 2.1.0 (August 22, 2026)                    │
│                                                             │
│ ✓ Fixed offline metro map rendering                       │
│ ✓ Added Kannada language support                          │
│ ✓ Improved journey planner performance                     │
│ ✓ New accessibility features                              │
│ ✓ UI/UX enhancements                                      │
│                                                             │
│ View full changelog: [Version History]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            FREQUENTLY ASKED QUESTIONS                       │
│                                                             │
│ Q: Is the app free?                                        │
│ A: Yes! 100% free with zero ads.                          │
│                                                             │
│ Q: How much data does it use?                              │
│ A: None! App is 100% offline after installation.          │
│                                                             │
│ Q: Can I use it without GPS?                               │
│ A: Yes, GPS permission is optional.                       │
│                                                             │
│ Q: What about iOS?                                         │
│ A: iOS version coming in Q4 2026!                         │
│                                                             │
│ [View all FAQs]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FOOTER                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## PAGE 4: TESTIMONIALS & REVIEWS PAGE

### URL
`https://nammaride.in/testimonials`

### Purpose
Build trust and social proof through user reviews, ratings, and testimonials.

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                               │
│ What Users Say About NammaRide                              │
│ Join 1,200+ satisfied Bengaluru commuters                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          OVERALL RATINGS SUMMARY (Dashboard)               │
│                                                             │
│  Google Play Store Rating:                                 │
│  ⭐⭐⭐⭐⭐ 4.5 / 5.0                                     │
│                                                             │
│  📊 Based on 180+ user reviews                             │
│                                                             │
│  Rating Breakdown:                                         │
│  ⭐⭐⭐⭐⭐ 5 stars (140 reviews) - 78%                    │
│  ⭐⭐⭐⭐ 4 stars (28 reviews) - 16%                      │
│  ⭐⭐⭐ 3 stars (8 reviews) - 4%                          │
│  ⭐⭐ 2 stars (3 reviews) - 2%                            │
│  ⭐ 1 star (1 review) - 1%                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          FEATURED REVIEWS (4-COLUMN GRID)                   │
│                                                             │
│ ┌─────────────────────┐ ┌─────────────────────┐            │
│ │ ⭐⭐⭐⭐⭐         │ │ ⭐⭐⭐⭐⭐         │            │
│ │ "Absolute Game      │ │ "Finally, a metro   │            │
│ │ Changer!"           │ │ app I can trust!"   │            │
│ │                     │ │                     │            │
│ │ "Best metro app     │ │ "Privacy-first      │            │
│ │ ever! Accurate      │ │ design is exactly   │            │
│ │ platform directions │ │ what I was looking  │            │
│ │ and real-time route │ │ for. No tracking,   │            │
│ │ planning. Makes my  │ │ no ads, just a      │            │
│ │ daily commute so    │ │ powerful tool."     │            │
│ │ much easier!"       │ │                     │            │
│ │                     │ │                     │            │
│ │ - Priya K           │ │ - Rahul M           │            │
│ │   Software Engineer  │ │   Product Manager   │            │
│ │   Whitefield, BNG   │ │   Koramangala, BNG  │            │
│ │   Aug 20, 2026      │ │   Aug 18, 2026      │            │
│ │                     │ │                     │            │
│ │ 👍 142 helpful      │ │ 👍 89 helpful       │            │
│ │                     │ │                     │            │
│ └─────────────────────┘ └─────────────────────┘            │
│                                                             │
│ ┌─────────────────────┐ ┌─────────────────────┐            │
│ │ ⭐⭐⭐⭐⭐         │ │ ⭐⭐⭐⭐⭐         │            │
│ │ "Saved My Commute!" │ │ "Perfect for        │            │
│ │                     │ │ Tourists!"          │            │
│ │ "The offline mode   │ │                     │            │
│ │ is incredible! I    │ │ "Visiting Bangalore │            │
│ │ lost signal in the  │ │ for 3 days and      │            │
│ │ tunnel, but the     │ │ NammaRide made      │            │
│ │ app still worked    │ │ exploring the metro │            │
│ │ perfectly. Smart    │ │ so easy. Clear      │            │
│ │ card savings are    │ │ directions and      │            │
│ │ also great!"        │ │ landmark info right │            │
│ │                     │ │ at my fingertips."  │            │
│ │ - Sneha P           │ │                     │            │
│ │   Student           │ │ - John D (Visitor)  │            │
│ │   Indiranagar, BNG  │ │   Aug 15, 2026      │            │
│ │   Aug 19, 2026      │ │                     │            │
│ │                     │ │ 👍 56 helpful       │            │
│ │ 👍 178 helpful      │ │                     │            │
│ │                     │ │                     │            │
│ └─────────────────────┘ └─────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CUSTOMER TESTIMONIAL VIDEOS                    │
│                                                             │
│ ▶️ Video 1: "My Daily Commute" - 2:15                      │
│    Priya K (Software Engineer, Whitefield)                 │
│    [Play video thumbnail]                                  │
│                                                             │
│ ▶️ Video 2: "Offline Lifesaver" - 1:45                     │
│    Sneha P (Student, Indiranagar)                          │
│    [Play video thumbnail]                                  │
│                                                             │
│ ▶️ Video 3: "Finally, Privacy!" - 2:30                     │
│    Rahul M (Product Manager, Koramangala)                  │
│    [Play video thumbnail]                                  │
│                                                             │
│ [View all video testimonials]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        FILTERED REVIEWS (By Category / Theme)              │
│                                                             │
│ Filter by theme:                                           │
│ [All] [Offline Capability] [Privacy] [Accuracy]            │
│ [Ease of Use] [Support] [Performance]                      │
│                                                             │
│ [Reviews display below filtered by selected category]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              MOST HELPFUL REVIEWS (Paginated)               │
│                                                             │
│ ⭐⭐⭐⭐⭐ "Accuracy is unmatched"                         │
│ "I've tested multiple metro apps, and NammaRide's          │
│ platform directions are spot-on. The elevator & exit       │
│ info has saved me so much time. Highly recommended!"       │
│                                                             │
│ - Vikram S | Jul 28, 2026                                  │
│ 👍 245 helpful | 💬 Reply                                  │
│                                                             │
│ [Load more helpful reviews...]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           USER STATISTICS & DEMOGRAPHICS                    │
│                                                             │
│ 📊 Total Downloads: 1,200+                                 │
│ 👥 Monthly Active Users: 500+                              │
│ 📱 Average Rating: 4.5 / 5.0                               │
│ ⭐ Total Reviews: 180+                                     │
│ 🕐 Average Session Duration: 4.5 minutes                   │
│ 🔄 Return Rate: 35% (users return weekly)                  │
│ 🌍 Top Users: Whitefield (30%), Koramangala (25%)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              SHARE YOUR FEEDBACK                            │
│                                                             │
│ Using NammaRide? Share your experience!                    │
│                                                             │
│ [WRITE A REVIEW ON GOOGLE PLAY]                            │
│                                                             │
│ Your feedback helps us improve the app. 5-star reviews     │
│ motivate our team and help more people discover NammaRide! │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FOOTER                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## PAGE 5: ABOUT US PAGE

### URL
`https://nammaride.in/about`

### Purpose
Build personal connection, showcase mission, and share developer story.

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                               │
│ About NammaRide                                             │
│ Designing a smarter metro experience for Bengaluru          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  OUR MISSION                                │
│                                                             │
│ Make Bengaluru Metro navigation effortless, private,       │
│ and accessible to everyone—commuters, tourists,            │
│ and everyone in between.                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  OUR VISION                                 │
│                                                             │
│ A world where public transit apps respect privacy,         │
│ work offline-first, and celebrate local culture.          │
│                                                             │
│ Eventually: NammaRide for every Indian metro.              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 CORE VALUES                                 │
│                                                             │
│ 🔒 PRIVACY FIRST                                           │
│ We never track location, never show ads, never collect     │
│ unnecessary data. You own your commute data.              │
│                                                             │
│ 📱 OFFLINE FIRST                                           │
│ Works completely offline. No internet, no problem.         │
│ Designed for metro tunnels, not clouds.                   │
│                                                             │
│ 🎨 DELIGHTFUL DESIGN                                       │
│ Intuitive, accessible, and respectful of your time.        │
│ Metro navigation should be effortless.                     │
│                                                             │
│ 🌍 LOCAL FIRST                                             │
│ Built for Bengaluru, by someone who loves the city.        │
│ Celebrates local landmarks, restaurants, and culture.      │
│                                                             │
│ 🤝 COMMUNITY-DRIVEN                                        │
│ User feedback shapes every feature. Your commute,          │
│ your app.                                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              MEET THE CREATOR                               │
│                                                             │
│ ┌──────────────────────────────────────────┐              │
│ │                                           │              │
│ │ [Tushar's Photo - Professional Headshot]  │              │
│ │                                           │              │
│ │              TUSHAR JAIN                  │              │
│ │         Founder & Lead Developer          │              │
│ │                                           │              │
│ │ Computer Science & Business Systems (CS  │              │
│ │ BS) student at BMS College of Engineering│              │
│ │ (BMSCE), Bengaluru. Passionate about     │              │
│ │ building privacy-first, offline-first    │              │
│ │ applications.                             │              │
│ │                                           │              │
│ │ BACKGROUND                                │              │
│ │ • CS & Business Systems student at BMSCE │              │
│ │ • Startup experience: Multiple ventures   │              │
│ │ • Tech skills: Full-stack development     │              │
│ │ • Location: Bengaluru, India              │              │
│ │                                           │              │
│ │ WHY NAMMA RIDE?                           │              │
│ │ "I commute via Bengaluru Metro daily. I  │              │
│ │ wanted an app that respects my privacy,  │              │
│ │ works offline, and celebrates the city.  │              │
│ │ NammaRide is my solution—and I'm         │              │
│ │ sharing it with you!"                     │              │
│ │                                           │              │
│ │ Website: tusharjain.in                   │              │
│ │ Email: tushar@nammaride.in               │              │
│ │ Twitter: @tusharjain_io                  │              │
│ │ LinkedIn: tushar-jain-bengaluru          │              │
│ │                                           │              │
│ └──────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  DEVELOPMENT TIMELINE                       │
│                                                             │
│ July 2026                 │ Idea & research                │
│ ————————————————          │ "Commuters need better tools"  │
│                           │                                │
│ August 2026               │ Web MVP launched               │
│ ————————————————          │ Next.js prototype tested       │
│                           │                                │
│ September 2026            │ Android app development        │
│ ────────────────────────  │ Kotlin + Jetpack Compose      │
│                           │                                │
│ October 2026 [NOW]        │ Public beta launch            │
│ ────────────────────────  │ 1,200+ downloads, 4.5/5 rating│
│                           │                                │
│ 2027                      │ iOS app, new metro lines,      │
│ ──────────────────────    │ expansion to other cities      │
│                           │                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               WHY BENGALURU? WHY NOW?                       │
│                                                             │
│ Bengaluru is India's tech capital with:                    │
│ • 3 operational metro lines (108 stations)                 │
│ • 500,000+ daily commuters                                 │
│ • Growing tech workforce needing better tools              │
│ • International visitors seeking good UX                   │
│ • Strong privacy-conscious user base                       │
│                                                             │
│ NammaRide is solving a real problem for 500k+ people       │
│ every single day.                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  PRESS & RECOGNITION                        │
│                                                             │
│ Featured in:                                               │
│ • TechCrunch India (August 2026)                           │
│ • Hindu BusinessLine (September 2026)                      │
│ • YourStory (Upcoming)                                     │
│ • Startup Magazine (Featured App)                          │
│                                                             │
│ Recognition:                                               │
│ • Best Privacy-First App (Local Tech Awards)               │
│ • Top 10 Bangalore Apps 2026                               │
│ • Google Play Featured App                                 │
│                                                             │
│ [Read our blog] [Press Inquiries: press@nammaride.in]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 CONTACT & CONNECT                           │
│                                                             │
│ Questions? Feedback? Partnership?                          │
│                                                             │
│ 📧 Email: hello@nammaride.in                               │
│ 🐦 Twitter: @NammaRideApp                                  │
│ 📷 Instagram: @namma.ride                                  │
│ 💼 LinkedIn: NammaRide                                     │
│ 👨‍💻 Developer: tusharjain.in                                │
│                                                             │
│ [CONTACT FORM]                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FOOTER                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## PAGE 6: BLOG PAGE

### URL
`https://nammaride.in/blog`

### Purpose
SEO-optimized content hub with articles about metro, Bengaluru, and transit tips.

### Featured Articles:

1. **"Complete Guide to Bengaluru Metro for First-Time Users"**
   - Word count: 2,000+
   - Focus keywords: "Bengaluru metro guide", "how to use metro"
   - Topics: History, 3 lines, fares, safety, etiquette

2. **"Top 20 Tech Offices Near Bengaluru Metro Stations"**
   - Word count: 1,500+
   - Focus keywords: "tech jobs near metro", "Whitefield metro"
   - Topics: Whitefield, Koramangala, Indiranagar clusters

3. **"Best Restaurants & Cafes Accessible via Metro"**
   - Word count: 1,800+
   - Focus keywords: "metro nearby restaurants"
   - Topics: Dining guide, food recommendations

4. **"Safety Tips for Women Commuting via Metro"**
   - Word count: 1,200+
   - Focus keywords: "safe metro travel for women"
   - Topics: Safety features, helplines, best practices

5. **"Budget Travel in Bengaluru: Metro Edition"**
   - Word count: 1,500+
   - Focus keywords: "cheap metro fares"
   - Topics: Smart card savings, tourist passes

---

## PAGE 7: CONTACT / SUPPORT PAGE

### URL
`https://nammaride.in/contact`

### Purpose
Support hub with contact form, FAQ, and social links.

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                               │
│ Get in Touch                                                │
│ Have questions? We're here to help!                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            CONTACT INFORMATION (3-Column)                   │
│                                                             │
│ ┌────────────────────┐  ┌────────────────────┐             │
│ │ 📧 EMAIL            │  │ 💬 SOCIAL MEDIA     │             │
│ │                     │  │                     │             │
│ │ hello@nammaride.in  │  │ Twitter:            │             │
│ │ Responds within     │  │ @NammaRideApp       │             │
│ │ 24 hours           │  │                     │             │
│ │                     │  │ Instagram:          │             │
│ │ support@nammaride   │  │ @namma.ride         │             │
│ │ .in                 │  │                     │             │
│ │ (Technical issues)  │  │ LinkedIn:           │             │
│ │                     │  │ NammaRide           │             │
│ └────────────────────┘  └────────────────────┘             │
│                                                             │
│ ┌────────────────────┐                                     │
│ │ 🚀 COMMUNITY        │                                     │
│ │                     │                                     │
│ │ Join our beta       │                                     │
│ │ tester community:   │                                     │
│ │ [Beta Program Link] │                                     │
│ │                     │                                     │
│ │ Feature requests:   │                                     │
│ │ [GitHub Issues]     │                                     │
│ │                     │                                     │
│ └────────────────────┘                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             CONTACT FORM (Left: 50%)                        │
│                                                             │
│ Name *                                                      │
│ [________________________]                                   │
│                                                             │
│ Email *                                                     │
│ [________________________]                                   │
│                                                             │
│ Subject *                                                   │
│ [Feedback] [Bug Report] [Feature Request] [Partnership]   │
│                                                             │
│ Message *                                                   │
│ [                                                           │
│  ________________________                                    │
│  ________________________                                    │
│  ________________________                                    │
│ ]                                                           │
│                                                             │
│ [SUBMIT]                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              FAQ (Right: 50%)                               │
│                                                             │
│ Q: How do I report a bug?                                  │
│ A: Email support@nammaride.in with details...             │
│                                                             │
│ Q: Can I suggest features?                                 │
│ A: Yes! Use feature request form or email...              │
│                                                             │
│ Q: How often are updates released?                         │
│ A: Monthly updates with new features...                   │
│                                                             │
│ Q: Is my data private?                                     │
│ A: Yes, 100% private. See privacy policy...               │
│                                                             │
│ [Load more FAQs]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FOOTER                                   │
└─────────────────────────────────────────────────────────────┘
```

---

# DESIGN SYSTEM

## Color Palette

### Brand Colors
- **Primary Purple:** `#6E3BA3` (RGB: 110, 59, 163)
  - Used for: Main CTA buttons, headers, highlights
- **Secondary Blue:** `#2E5CCD` (RGB: 46, 92, 205)
  - Used for: Secondary CTAs, links, accents
- **Accent Teal:** `#14B8A6` (RGB: 20, 184, 166)
  - Used for: Success states, positive feedback

### Utility Colors
- **Success Green:** `#10B981`
- **Warning Amber:** `#F59E0B`
- **Error Red:** `#DC2626`
- **Info Blue:** `#3B82F6`

### Neutral Colors
- **White:** `#FFFFFF` (backgrounds)
- **Light Gray:** `#F5F5F5` (card backgrounds)
- **Medium Gray:** `#9CA3AF` (text, borders)
- **Dark Gray:** `#374151` (primary text)
- **Black:** `#1F2937` (dark text, headings)

---

## Typography

### Font Families
- **Headlines:** Poppins (Bold, Semi-Bold)
- **Body:** Inter (Regular, Medium)
- **Monospace:** IBM Plex Mono
- **Kannada:** Noto Sans Kannada

### Font Sizes
| Usage | Size (Desktop) | Size (Mobile) | Weight |
|-------|---|---|---|
| H1 | 48px | 36px | Bold (700) |
| H2 | 36px | 28px | Bold (700) |
| H3 | 28px | 24px | Semi-Bold (600) |
| Body Large | 18px | 16px | Regular (400) |
| Body | 16px | 14px | Regular (400) |
| Small | 14px | 12px | Regular (400) |
| Caption | 12px | 11px | Regular (400) |

---

## Spacing Scale (8px Grid)
- `xs: 4px`
- `sm: 8px`
- `md: 16px`
- `lg: 24px`
- `xl: 32px`
- `2xl: 48px`
- `3xl: 64px`

---

# COMPONENT SPECIFICATIONS

## Primary CTA Button

```jsx
<Button 
  variant="primary"
  size="lg"
  href="https://play.google.com/store/apps/details?id=com.nammaride.app"
  target="_blank"
>
  Download from Google Play
  <ArrowRight className="ml-2 w-5 h-5" />
</Button>
```

### Styles
- Background: `#6E3BA3` (Purple)
- Hover: `#5A2987` (Darker purple)
- Text: White
- Padding: `16px 32px` (desktop), `12px 24px` (mobile)
- Border-radius: `8px`
- Font-size: `16px` (desktop), `14px` (mobile)
- Font-weight: Bold (600)
- Cursor: Pointer
- Transition: `background-color 0.3s ease`

---

## Secondary CTA Button

```jsx
<Button 
  variant="secondary"
  size="lg"
  href="/simulator"
>
  Try Web Simulator
</Button>
```

### Styles
- Background: Transparent
- Border: `2px solid #6E3BA3`
- Text: `#6E3BA3`
- Hover: Background `rgba(110, 59, 163, 0.1)`

---

## Feature Card Component

```jsx
<Card className="feature-card">
  <Card.Icon icon="🚇" size="lg" />
  <Card.Title>Journey Planner</Card.Title>
  <Card.Description>
    Plan routes with 3 options: fastest, fewest transfers, cheapest
  </Card.Description>
  <Card.Features>
    <Feature>✓ Platform directions</Feature>
    <Feature>✓ Smart Card savings</Feature>
    <Feature>✓ Accessibility info</Feature>
  </Card.Features>
  <Card.CTA href="/features">Learn More</Card.CTA>
</Card>
```

### Styles
- Background: White or Light Gray
- Border: `1px solid #E5E7EB`
- Padding: `24px`
- Border-radius: `12px`
- Box-shadow: `0 1px 3px rgba(0,0,0,0.1)` (hover: stronger)
- Transition: Box-shadow 0.3s ease

---

# INTERACTIVE ELEMENTS

## Navigation Bar (Sticky)

```jsx
<nav className="navbar sticky top-0 bg-white shadow-sm">
  <div className="navbar-container flex items-center justify-between px-6 py-4">
    
    {/* Logo */}
    <a href="/" className="logo">
      <img src="/logo.svg" alt="NammaRide" height="40" />
    </a>

    {/* Navigation Links */}
    <div className="nav-links hidden md:flex gap-8">
      <a href="/" className="nav-link">Home</a>
      <a href="/features" className="nav-link">Features</a>
      <a href="/download" className="nav-link">Download</a>
      <a href="/blog" className="nav-link">Blog</a>
      <a href="/about" className="nav-link">About</a>
      <a href="/contact" className="nav-link">Contact</a>
    </div>

    {/* Language Toggle */}
    <button className="language-toggle">
      ಕನ್ನಡ 🇮🇳
    </button>

    {/* Mobile Menu */}
    <button className="mobile-menu md:hidden">
      ☰
    </button>
  </div>
</nav>
```

### Styles
- Position: Sticky (top: 0)
- Background: White with subtle shadow
- Height: 70px
- Z-index: 100 (above content)
- Responsive: Mobile menu toggle on screens < 768px

---

## Download Button Animation

```css
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(110, 59, 163, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(110, 59, 163, 0);
  }
}

.download-btn {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}

.download-btn:hover {
  animation: none;
  transform: scale(1.05);
}
```

---

## Testimonial Carousel

```jsx
{% raw %}
<Carousel 
  autoplay={true}
  autoplayInterval={5000}
  showIndicators={true}
  responsive={{
    mobile: { items: 1 },
    tablet: { items: 2 },
    desktop: { items: 3 }
  }}
>
  {testimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.id} {...testimonial} />
  ))}
</Carousel>
{% endraw %}
```

---

# SEO & ANALYTICS

## SEO Strategy

### Meta Tags (Homepage)

```html
<head>
  <title>NammaRide - Best Bengaluru Metro App | Offline Route Planner</title>
  
  <meta name="description" content="Download NammaRide: Private, offline metro app for Bengaluru. Plan routes, check fares, explore landmarks. No ads, no tracking. Free on Google Play Store." />
  
  <meta name="keywords" content="Bengaluru metro app, metro route planner, offline metro navigation, Bangalore metro guide, BMRCL app alternative" />
  
  <meta name="robots" content="index, follow" />
  
  <meta property="og:title" content="NammaRide - Bengaluru Metro App" />
  <meta property="og:description" content="Smart metro navigation for Bengaluru commuters" />
  <meta property="og:image" content="https://nammaride.in/og-image.jpg" />
  <meta property="og:url" content="https://nammaride.in" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@NammaRideApp" />
</head>
```

### Internal Linking Strategy
- Homepage → All major pages
- Features page → Download page
- Blog articles → Related feature pages
- Download page → Features & Testimonials

### Schema Markup (Structured Data)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NammaRide",
  "description": "Bengaluru Metro navigation app",
  "applicationCategory": "Productivity",
  "operatingSystem": "Android",
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.nammaride.app",
  "fileSize": "45 MB",
  "screenshot": "https://nammaride.in/screenshots/1.jpg",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "ratingCount": "180"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
}
```

---

## Google Analytics 4 Setup

### Key Events to Track
1. **Downloads**
   - Event: `app_download`
   - Trigger: User clicks Play Store link
   
2. **Web Simulator Usage**
   - Event: `simulator_route_planned`
   - Parameters: from_station, to_station, route_count
   
3. **Feature Exploration**
   - Event: `feature_view`
   - Parameters: feature_name (journey_planner, metro_map, etc.)
   
4. **Testimonial Interaction**
   - Event: `testimonial_engaged`
   - Parameters: testimonial_index, action (read, shared)

5. **Blog Reading**
   - Event: `blog_post_viewed`
   - Parameters: post_title, time_on_page

---

## Conversion Funnel

```
Landing (Hero) → 25% Click Download Button
Download Button → 60% Reach Play Store
Play Store → 20% Complete Installation (tracked in app)
App Installed → 40% Complete Onboarding

Overall Conversion: 25% × 60% × 20% × 40% ≈ 1.2% of visitors to active users
```

---

# PERFORMANCE REQUIREMENTS

## Page Load Time Targets

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 1.5s | ✓ Lighthouse 90+ |
| Largest Contentful Paint (LCP) | < 2.5s | ✓ Lighthouse 90+ |
| Cumulative Layout Shift (CLS) | < 0.1 | ✓ Lighthouse 95+ |
| Time to Interactive (TTI) | < 3s | ✓ Lighthouse 90+ |

## Lighthouse Scores Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Image Optimization
- Use Next.js Image component for automatic optimization
- WebP format with fallbacks
- Lazy loading for below-the-fold images
- Responsive images (srcset)

---

# DEPLOYMENT & HOSTING

## Vercel Deployment

### Repository
- GitHub: `tusharjain/nammaride-website`
- Branch: `main` (production)
- Branch: `develop` (staging)

### Deployment Process
1. Push code to GitHub
2. Vercel automatically builds & deploys
3. Automatic preview URLs for pull requests
4. Production deployment on merge to main

### Environment Variables
```
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=com.nammaride.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
MAILCHIMP_API_KEY=xxxxxxxxxxxxx
CONTACT_FORM_ENDPOINT=https://api.formspree.io/...
```

### Custom Domain
- Primary: `nammaride.in`
- Aliases: `www.nammaride.in`, `getnammaride.com`
- SSL: Automatic (Let's Encrypt)
- DNS: Cloudflare (free tier)

---

## Build Configuration

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_GOOGLE_PLAY_URL": "@google_play_url",
    "NEXT_PUBLIC_GA_ID": "@ga_id"
  },
  "routes": [
    {
      "src": "/",
      "destination": "/index.html"
    },
    {
      "src": "/sitemap.xml",
      "destination": "/sitemap.xml"
    },
    {
      "src": "/robots.txt",
      "destination": "/robots.txt"
    }
  ]
}
```

---

## SEO Files

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nammaride.in/</loc>
    <lastmod>2026-08-22</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nammaride.in/features</loc>
    <lastmod>2026-08-22</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nammaride.in/download</loc>
    <lastmod>2026-08-22</lastmod>
    <priority>0.9</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://nammaride.in/sitemap.xml
```

---

## Monitoring & Analytics

### Uptime Monitoring
- Vercel Analytics (automatic)
- Status page: `status.nammaride.in` (optional)

### Error Tracking
- Sentry integration for frontend errors
- Webhook alerts to Slack/Email

### Analytics Dashboards
- Google Analytics: Traffic, user behavior, conversions
- Custom dashboard: Downloads by date, app retention

---

## Backup & Disaster Recovery

- GitHub repository as source of truth
- Vercel automatic backups (14 days retention)
- CDN edge caching for performance
- Auto-scaling for traffic spikes

---

## Post-Launch Checklist

- [ ] Domain setup (DNS, SSL)
- [ ] Analytics tracking installed
- [ ] Email configuration (support@nammaride.in)
- [ ] Google Play link verified
- [ ] Mobile responsiveness tested (iOS Safari, Android Chrome)
- [ ] Performance optimized (Lighthouse 90+)
- [ ] SEO setup (sitemap, schema, robots.txt)
- [ ] Social media links working
- [ ] Contact form functional
- [ ] Newsletter signup (Mailchimp) working
- [ ] Privacy policy & Terms of Service published
- [ ] About page complete
- [ ] Blog setup (if applicable)
- [ ] Testimonials loaded
- [ ] Download CTA tested on real devices
- [ ] Accessibility audit passed (WCAG 2.1 AA)

---

## File Structure

```
nammaride-website/
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── feature-*.png
│   │   ├── testimonial-*.jpg
│   │   └── logo.svg
│   ├── screenshots/
│   │   └── app-screenshots-*.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── TestimonialCarousel.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── index.jsx (homepage)
│   │   ├── features.jsx
│   │   ├── download.jsx
│   │   ├── testimonials.jsx
│   │   ├── about.jsx
│   │   ├── blog/
│   │   │   ├── index.jsx
│   │   │   └── [slug].jsx
│   │   ├── contact.jsx
│   │   ├── privacy.jsx
│   │   ├── terms.jsx
│   │   └── 404.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── hero.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── data/
│   │   ├── features.json
│   │   ├── testimonials.json
│   │   ├── blog-posts.json
│   │   └── faq.json
│   └── lib/
│       ├── analytics.js
│       ├── api.js
│       └── utils.js
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

# FINAL REQUIREMENTS SUMMARY

## Development Timeline
- **Week 1-2:** Design & component library
- **Week 3-4:** Homepage & features page
- **Week 5-6:** Download, testimonials, about pages
- **Week 7:** Blog setup, SEO optimization
- **Week 8:** Testing, deployment, launch

## Success Metrics (3 Months Post-Launch)
- **Website Traffic:** 10,000+ monthly visitors
- **App Downloads:** 5,000+ from website
- **Conversion Rate:** 15-20% download rate
- **Testimonials:** 50+ 5-star reviews on Play Store
- **Blog Traffic:** 30% of total website traffic
- **Return Visitors:** 30%+ of traffic

---

**This PRD is comprehensive and ready for design & development handoff!**

Would you like me to create:
1. **Wireframe sketches** (simple ASCII or Figma export specs)
2. **Component code samples** (React/JSX examples)
3. **Content/Copy templates** (Hero text, feature descriptions)
4. **Marketing email templates** (Newsletter signup)
5. **Social media assets spec** (Instagram posts, Twitter cards)

Let me know what's needed next! 🚀
