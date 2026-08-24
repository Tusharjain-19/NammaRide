<div align="center">

  <img src="website/public/simulator/assets/images/logo_app.png" alt="NammaRide Logo" width="120" />

  # 🚇 NammaRide: Official Bengaluru Metro Guide & App

  **The ultimate offline-first transit navigation system for Bengaluru Namma Metro (BMRCL).**

  [![Live Website](https://img.shields.io/badge/Live_Website-nammaride.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nammaride.vercel.app/)
  [![App Domain](https://img.shields.io/badge/App_Domain-site.nammaride.app-10B981?style=for-the-badge&logo=googleplay&logoColor=white)](https://site.nammaride.app/)
  [![Google Play](https://img.shields.io/badge/Google_Play-Get_App-34A853?style=for-the-badge&logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=site.nammaride.app)

</div>

---

## 🛠️ Technology Stack & Badges

NammaRide is engineered using cutting-edge web and native technologies optimized for ultra-fast performance, low latency, and 100% offline availability.

| Category | Technologies & Tools Used |
| :--- | :--- |
| **Frontend Framework** | ![React](https://img.shields.io/badge/React_18.3-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite_5.4-646CFF?style=flat-square&logo=vite&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| **Styling & Design System** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| **Icons & Visuals** | ![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F59E0B?style=flat-square&logo=lucide&logoColor=white) ![Canvas API](https://img.shields.io/badge/HTML5_Canvas-000000?style=flat-square&logo=html5&logoColor=white) |
| **Deployment & Hosting** | ![Vercel](https://img.shields.io/badge/Vercel_Hosting-000000?style=flat-square&logo=vercel&logoColor=white) ![Service Worker](https://img.shields.io/badge/PWA_Offline_Worker-10B981?style=flat-square&logo=pwa&logoColor=white) |
| **Form Backend & Webhooks** | ![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat-square&logo=google&logoColor=white) ![Google Sheets API](https://img.shields.io/badge/Google_Sheets_API-34A853?style=flat-square&logo=googlesheets&logoColor=white) |
| **Mobile App Engine** | ![Android](https://img.shields.io/badge/Android_7.0+-3DDC84?style=flat-square&logo=android&logoColor=white) ![Capacitor](https://img.shields.io/badge/Capacitor_Native-119EFF?style=flat-square&logo=capacitor&logoColor=white) |

---

## 🔥 Key Features & Capabilities

- ⚡ **100% Offline Route Calculation**: Instantly compute shortest paths, interchange connections (Majestic, RV Road, Jayadeva, KR Pura, Silk Board), and travel duration without any cellular data connection.
- 🗺️ **Official 2025 BMRCL Metro Map Visualizer**: High-resolution official vector/PDF metro map visualizer with 2D smooth drag panning, zoom range (`0.35x` to `2.8x`), and pitch-black dark mode color inversion.
- 📱 **Interactive Web App Simulator (`/simulator`)**: Fully interactive web replica of the native mobile app, allowing commuters to simulate routes, view fare matrices, exit gate numbers, and nearby ATMs.
- 🌙 **Pitch Black Dark Mode**: Curated high-contrast OLED black theme (`#000000`) with smooth theme switcher and persistent state.
- 🌐 **Multilingual Support (Kannada & English)**: 1-click instant language translation across all 66+ metro stations, landmarks, and timings.
- 📍 **Bengaluru IT Hub & Landmark Finder**: Integrated directory of 100+ popular Bengaluru destinations (Electronic City, ITPL Whitefield, MG Road, Brigade Road, Orion Mall, Kempegowda Bus Station).
- ♿ **Divyangjan Accessibility Directory**: Station-by-station breakdown of elevators, escalators, wheelchair ramps, and accessible restrooms.
- 🔒 **Zero Data Tracking**: 100% privacy guaranteed with zero personal tracking, zero ad trackers, and 0 KB telemetry collection.

---

## 🗺️ Metro Line Coverage (2025 Phase)

- 🟣 **Purple Line**: Kadugodi (Whitefield) ↔ Challaghatta (Full Operational Corridor)
- 🟢 **Green Line**: Nagasandra ↔ Silk Institute (Full Operational Corridor)
- 🟡 **Yellow Line**: RV Road ↔ Electronic City ↔ Bommasandra (Phase 1 Corridor)
- 🔴 **Pink Line**: Kalena Agrahara ↔ Nagawara *(Under Construction / Inactive Guide)*
- 🔵 **Blue Line**: Central Silk Board ↔ Outer Ring Road ↔ KIA Airport *(Under Construction / Inactive Guide)*

---

## 📂 Repository Directory Structure

```
NammaRide/
├── README.md                          # Comprehensive project documentation
├── NammaRide_App_Promotion_Website_PRD.md # Product Requirements Document
├── vercel.json                        # Vercel deployment routing & headers
├── website/                           # Web Application Source
│   ├── index.html                     # Main entry HTML with OpenGraph & Schema metadata
│   ├── package.json                   # Dependencies & Build scripts
│   ├── vite.config.js                 # Vite build optimization settings
│   ├── tailwind.config.js             # Tailwind CSS theme tokens & colors
│   ├── .env.example                   # Environment variable template
│   ├── public/
│   │   ├── sitemap.xml                # SEO Sitemap for nammaride.vercel.app & site.nammaride.app
│   │   ├── robots.txt                 # Search Engine Crawler directives
│   │   └── simulator/                 # Standalone web app simulator assets
│   └── src/
│       ├── main.jsx                   # React entrypoint
│       ├── App.jsx                    # Router & Layout wrapper
│       ├── components/                # Modular React components (Navbar, Footer, Modals)
│       ├── context/                   # Global State (ThemeContext, LanguageContext)
│       ├── data/                      # BMRCL Metro Stations, Fare Tables, & Timings JSON
│       ├── pages/                     # Application pages (HomePage, MetroMapPage, SimulatorPage, etc.)
│       └── styles/                    # Design system tokens & index.css
└── mobile/                            # Native Android Capacitor Wrapper Source
```

---

## 🚀 Local Development Setup

Follow these steps to run NammaRide locally on your machine:

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tusharjain-19/NammaRide.git
   cd NammaRide/website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `website/` directory based on `.env.example`:
   ```env
   VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🛡️ Security & Privacy Guarantee

- **No Sensitive Files in Git**: Keystore files, signing certificates (`.keystore`, `.jks`), production API keys, and build binaries (`.apk`, `.aab`) are strictly ignored via `.gitignore` and excluded from repository history.
- **Secure Webhooks**: Contact form submissions are routed securely via serverless Google Apps Script webhooks with sanitization.

---

## 🌐 Live Web Deployment

- **Vercel Web App**: [https://nammaride.vercel.app/](https://nammaride.vercel.app/)
- **Production Web Domain**: [https://site.nammaride.app/](https://site.nammaride.app/)
- **Google Play Store**: [Download NammaRide Android App](https://play.google.com/store/apps/details?id=site.nammaride.app)

---

## 📄 License & Attribution

- **Developed with ❤️ for Namma Bengaluru Metro Commuters.**
- Metro Map visualizer and transit data reference official BMRCL (Bangalore Metro Rail Corporation Limited) public guides.
