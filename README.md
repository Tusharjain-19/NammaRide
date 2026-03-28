<p align="center">
  <img src="assets/images/logo_app.png" alt="NammaRide Logo" width="100" />
</p>

<h1 align="center">NammaRide</h1>

<p align="center">
  <strong>Your Smart Companion for Bengaluru's Namma Metro</strong>
</p>

<p align="center">
  <a href="https://www.nammaride.site/"><img src="https://img.shields.io/badge/🌐_Live_App-nammaride.site-6366f1?style=for-the-badge" alt="Live App" /></a>
  <a href="https://github.com/Tusharjain-19/NammaRide"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

## 📖 About

**NammaRide** is a fast, offline-capable web application that helps commuters navigate Bengaluru's Namma Metro system with confidence. Unlike generic navigation apps that lose GPS accuracy underground, NammaRide uses **time-based prediction heuristics** and a curated metro-specific dataset to deliver reliable journey information — even in tunnels.

Built as a lightweight Progressive Web App with zero dependencies on heavy frameworks, it loads instantly and works seamlessly on any device.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Journey Planner** | Plan multi-line routes across Purple, Green, and Yellow lines with accurate fare estimates, travel times, and interchange guidance |
| 🚉 **Live Journey Simulation** | Board a train and track your progress station-by-station with real-time countdown and announcements |
| 🔄 **Smart Interchange** | Detailed platform-level directions for seamless transitions at interchange stations like Majestic |
| 📍 **Nearest Station Finder** | GPS-based detection of the closest metro station with one-tap Google Maps navigation |
| 🏛️ **Explore Nearby** | Discover 230+ landmarks, hospitals, malls, parks, and transit hubs near every station with photos and walking directions |
| 🕒 **Train Timings** | First/last train schedules for all lines and directions |
| 🛡️ **Safety Info** | Emergency contacts, helpline numbers, and safety guidelines |
| 🌍 **Trilingual Support** | Full localization in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)** |
| 🌙 **Dark & Light Mode** | Automatic theme detection with manual toggle — optimized for readability and battery life |
| 📱 **Mobile-First Design** | Responsive layout designed for on-the-go use, with touch-optimized controls |

---

## 🖼️ Screenshots

<p align="center">
  <em>Premium dark-mode UI · Journey planner · Station explorer · Live route tracking</em>
</p>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 with semantic elements & JSON-LD structured data |
| **Styling** | Tailwind CSS (CDN) + custom CSS modules (base, layout, components, sections, metro-route) |
| **Logic** | Vanilla ES6+ JavaScript (ES Modules) — zero framework overhead |
| **Icons** | Lucide Icons |
| **Data** | Hand-curated JSON datasets for stations, fares, timings, and nearby places |
| **Routing** | Custom Dijkstra-based pathfinding with interchange cost modeling |
| **Deployment** | Vercel (edge network, automatic SSL) |
| **SEO** | Open Graph, Twitter Cards, JSON-LD WebApplication schema, canonical URLs, sitemap |

---

## 📂 Project Structure

```
NammaRide/
├── index.html              # Application entry point
├── css/
│   ├── base.css            # CSS variables, resets, global tokens
│   ├── layout.css          # App shell, header, navigation
│   ├── components.css      # Buttons, cards, modals, dropdowns
│   ├── metro-route.css     # Route timeline & station indicators
│   └── sections.css        # View-specific styles (explore, timings, etc.)
├── js/
│   ├── main.js             # App initialization, view controller, event bus
│   ├── data/
│   │   ├── stations.js     # Metro network graph (lines, connections, distances)
│   │   ├── stationsMeta.js # Station metadata (coordinates, line colors, platforms)
│   │   ├── stationPlaces.js# 230+ nearby places with photos, descriptions, maps links
│   │   ├── timings.js      # First/last train schedules per line
│   │   └── safety.js       # Emergency contacts & safety info
│   ├── logic/
│   │   └── pricing.js      # Fare calculation engine (distance-based slab pricing)
│   ├── ui/
│   │   ├── dropdown.js     # Searchable station selector component
│   │   ├── route.js        # Route visualization & live journey simulation
│   │   └── sections.js     # Dynamic view rendering (stations, timings, explore, safety)
│   └── utils/
│       └── helpers.js      # Shared utility functions
├── assets/
│   └── images/             # 25+ curated place images, logos, and graphics
├── mobile/                 # Privacy policy & mobile-specific assets
├── robots.txt              # Crawler directives
├── sitemap.xml             # XML sitemap for search engines
└── vercel.json             # Deployment & routing configuration
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools, package managers, or servers required

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Tusharjain-19/NammaRide.git

# 2. Navigate to the project
cd NammaRide

# 3. Open directly in browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux

# — OR use a local server for ES module support —
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

---

## 🧠 How It Works

### Route Calculation
NammaRide models the entire metro network as a weighted graph. Each station is a node, and edges carry distance/time weights. A modified **Dijkstra's algorithm** with interchange penalties finds the optimal path, accounting for:
- Line transfers (added wait time at interchange stations)
- Peak vs. off-peak adjustments
- Distance-based BMRCL fare slabs

### Live Journey Simulation
Once a route is calculated, the **Live Journey** mode simulates train movement using estimated inter-station travel times. The UI updates in real-time showing:
- Current station and next stop
- Estimated time of arrival
- Interchange alerts with platform directions

### Nearest Station Detection
Uses the browser's Geolocation API to calculate Haversine distances to all metro stations, surfacing the closest one with walking distance and a direct Google Maps link.

---

## 🗺️ Metro Lines Covered

| Line | Color | Route |
|---|---|---|
| **Purple Line** | 🟣 | Challaghatta ↔ Whitefield (Kadugodi) |
| **Green Line** | 🟢 | Nagasandra ↔ Silk Institute |
| **Yellow Line** | 🟡 | RV Road ↔ Bommasandra |

> Coverage includes all operational and newly opened extension stations as of 2025.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Ideas
- 🆕 Add new station data as BMRCL expands the network
- 🌐 Add support for more languages
- ♿ Improve accessibility (ARIA labels, keyboard navigation)
- 📊 Add usage analytics dashboard
- 🗺️ Integrate official BMRCL real-time API (when available)

---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <strong>Tushar Jain</strong><br/>
      <em>Computer Science & Business Systems</em><br/>
      <em>BMS College of Engineering, Bengaluru</em><br/><br/>
      <a href="https://www.tusharjain.in/">🌐 Portfolio</a> · 
      <a href="https://www.linkedin.com/in/tushar-jain-781149322/">LinkedIn</a> · 
      <a href="https://github.com/Tusharjain-19">GitHub</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

NammaRide is an **independent, community-driven project** and is **not affiliated with, endorsed by, or connected to** the Bangalore Metro Rail Corporation Limited (BMRCL). All fares, timings, and station information are estimates intended for planning purposes only. Always verify with official BMRCL sources before travel.

---

<p align="center">
  <sub>Built with ❤️ for Bengaluru · © 2025 NammaRide</sub>
</p>
