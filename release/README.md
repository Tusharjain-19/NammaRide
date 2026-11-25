# NammaRide Android Releases

Official signed release binaries for **NammaRide - Bengaluru Metro Transit Guide**.

## Latest Release: v2.0.0 (Build 21)
- **Application ID:** `site.nammaride.app`
- **Version Code:** `21`
- **Version Name:** `2.0.0`
- **Signature:** Release signed with production upload keystore (`nammaride-upload`)
- **Key Enhancements in v2.0.0:**
  - **Moving Train & Auto-Pruning of Crossed Previous Stations (`trainTrackerEngine.js`, `route.js`):** Automatically collapses (`320ms`) and removes upstream stops as soon as the train crosses them, with DOM-measured pixel-exact centering of the train sprite on the track line.
  - **Interchange Transfer Confirmation & Live Connecting Train Tracking (`boardingHud.js`, `scheduleEngine.js`, `route.js`):** At interchange stations (e.g., Green Line → Majestic → Purple Line), asks *"Did you change?"*, switches the live incoming-train tracker to the connecting leg, shows where the incoming train currently is, and supports **"Yes, I boarded"** / **"Missed · Next"** / **`NO_SERVICE` (first train tomorrow)**.
  - **Adaptive 5–10s Location Refresh Algorithm (`TrainLocationRefresher`):** `5s` cadence when approaching/on-board and `8.5s` when waiting longer, plus automatic missed-train rollover.
  - **Dual Destination & 30-Second Arrival Notifications (`notificationEngine.js`):** Fires `@capacitor/local-notifications` (`POST_NOTIFICATIONS` + `nammaride_train_alerts` channel), haptic pulse, optional chime, and HUD banners at both `<= 30s` pre-arrival (`BOARDING_30S`, `INTERCHANGE_30S`, `DEST_30S`) and upon reaching the destination (`DEST_ARRIVED`).
  - **4-Tier Offline Cache & Modular Architecture:** Bounded `expandedCache` LRU, `StorageManager` schema `2.0.0` migration, complete `sw.js` (`nammaride-offline-v2.0.0`) precaching, surgical DOM HUD patching, website/simulator schedule parity, and `17` automated `node --test` unit/integration checks.

## Previous Highlights: v1.9.0 (Build 20)
- **Application ID:** `site.nammaride.app`
- **Version Code:** `20`
- **Version Name:** `1.9.0`
- **Signature:** Release signed with production upload keystore (`nammaride-upload`)
- **Key Enhancements in v1.9.0:**
  - **Unified Vertical Approach + Ride Live Timeline:**
    - Removed the detached horizontal mini-radar and cryptic alphanumeric codes (`G16`, `G20`) in favor of full station names and plain commuter phrasing across every card.
    - Displays 2 upstream approach stations directly *above* your boarding stop along a **desaturated colorless dashed track** before transitioning cleanly into your **bright colored metro corridor** at boarding.
    - Features a custom high-DPI **3D Stainless-Steel Metro Train Coach Sprite (`metro_train_marker.png`)** gliding along the vertical rail with live status (*"Coming Train · Just left Lalbagh · 2 min away"*).
  - **Opt-In Battery-Safe Live Speedometer (`km/h`):**
    - Added `[Speed]` toggle in the live ride bar using EMA-smoothed GPS Doppler speed + Haversine fallback and underground segment estimates (`~km/h est.`).
  - **Persistent Multi-Tab Live Ride Navigation:**
    - Switching back to Plan, Stations, Timings, Explore, or Safety preserves active journeys behind a **Floating Active-Ride Resume Bar** above the bottom nav.

## Previous Highlights: v1.8.0 (Build 19)
- **Key Enhancements in v1.8.0:**
  - **Intelligent BMRCL Timetable Engine (GTFS + Pink Line Phase 1):**
    - Replaced static 5-minute rounding with real BMRCL headway bands, Monday early-bird runs (`04:15 AM`), Saturday/Sunday/Public Holiday rules, and short-loop destination filtering (`GDCP`, `ITPL`, `MYRD`, `BYPH`, `KGWA`, `PYID`).
    - Shows real `DUE NOW / In X min`, secondary upcoming departures (`then Y min`), and hourly station crowd badges (`Quiet / Moderate / Busy / Peak` from open BMRCL hourly curves) cleanly on trip cards and Timings view.
  - **Smart Offline-First Cache & Soft-TTL Connectivity Monitor:**
    - Upgraded Service Worker (`nammaride-offline-v1.8.0`) to Stale-While-Revalidate for shell assets + Cache-First for transit datasets so offline launch stays instant and cached schedules/overrides are never erased when offline.
    - Displays subtle `Live Schedule` vs `Offline Mode · Cached X ago` sync pill.
  - **Interactive 4-State Boarding Assistant & Offline 2D Line Radar:**
    - When approaching departure (`<= 40s`), prompts **"Train arriving at [Station]! Did you enter?"** with 1-tap **`Yes, I boarded`** or **`Missed · Next Train`** (cleanly shifts without re-planning), plus GPS velocity auto-boarding and `-1 Stop / +1 Stop` manual resync controls for underground tunnels.
    - Added pure 2D SVG **Offline Line Radar** on the active journey screen showing live simulated train positions along the corridor with zero network/tile overhead.
  - **Battery & Power Optimization + 3-Tier Adaptive GNSS:**
    - Replaced continuous 60-120 FPS `requestAnimationFrame` loop with visibility-aware `1s / 4s` adaptive timer that pauses completely when backgrounded, plus cached station DOM lookups.
    - Upgraded geolocation watcher to 3 tiers (`CRUISE` coarse 20s, `APPROACH` high-accuracy within 2 stops, and `TUNNEL_BACKOFF` 45s cache in underground sections).
  - **Redesigned App Launch & 400fps GPU Top-to-Down Theme Wipe:**
    - Smooth OS-default Light/Dark theme detection with GPU-composited top-to-down `clip-path` + sweep-beam transition on toggle.
    - Redesigned launch animation featuring the 3-coach metro train gliding left-to-right across the 4-line corridor revealing the `NammaRide` wordmark.

## Available Binaries

| File | Type | Target Use |
| :--- | :--- | :--- |
| [`NammaRide-v2.0.0.apk`](file:///d:/NammaRide/NammaRide-main/release/NammaRide-v2.0.0.apk) | Signed APK (`v2.0.0`) | Sideload directly on Android phones for testing and offline distribution. |
| [`NammaRide-v2.0.0.aab`](file:///d:/NammaRide/NammaRide-main/release/NammaRide-v2.0.0.aab) | Signed App Bundle (`v2.0.0`) | Upload directly to the Google Play Console for Play Store production release. |
