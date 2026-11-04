# NammaRide Android Releases

Official signed release binaries for **NammaRide - Bengaluru Metro Transit Guide**.

## Latest Release: v1.7.5 (Build 18)
- **Application ID:** `site.nammaride.app`
- **Version Code:** `18`
- **Version Name:** `1.7.5`
- **Signature:** Release signed with production upload keystore (`nammaride-upload`)
- **Key Enhancements in v1.7.5:**
  - **Timings Page Line Filtering:**
    - Added dedicated line filter pill strip (`All Lines`, `Pink Line`, `Purple Line`, `Green Line`, `Yellow Line`) at the top of the Timings page.
    - Commuters can instantly filter and view schedule tables for specific lines without endlessly scrolling through all lines.
    - Active filter is remembered when switching between tabs.
  - **Silky Smooth Horizontal Scroll in Explore and Filter Sections:**
    - Completely suppressed the rigid default scrollbar track that appeared below the filter pills.
    - Implemented hardware-accelerated momentum touch scrolling (`-webkit-overflow-scrolling: touch`, `overscroll-behavior-x: contain`, `scroll-behavior: smooth`).
    - Added desktop and mouse-wheel drag momentum navigation so swiping and trackpad panning feel natural and fluid.
    - Tapping any filter pill smoothly glides and centers it into the viewport.
  - **Jayadeva Hospital Multi-Level Platform Layout:**
    - Level 6 Pink Line (Platform 3 Northbound to Tavarekere/Nagawara, Platform 4 Southbound to JP Nagar 4th Phase/Kalena Agrahara).
    - Level 5 Yellow Line (Platform 1 Westbound to RV Road, Platform 2 Eastbound to Bommasandra/Electronic City).
    - Tavarekere Station (Platform 1 Northbound to Nagawara, Platform 2 Southbound to Kalena Agrahara via Jayadeva Hospital).

## Available Binaries

| File | Type | Target Use |
| :--- | :--- | :--- |
| [`app-release.apk`](file:///d:/NammaRide/release/app-release.apk) | Direct APK | Sideload directly on Android phones for testing and offline distribution. |
| [`app-release.aab`](file:///d:/NammaRide/release/app-release.aab) | Android App Bundle | Upload directly to the Google Play Console for Play Store production release. |
| [`NammaRide-v1.7.5.apk`](file:///d:/NammaRide/release/NammaRide-v1.7.5.apk) | Versioned APK | Archived build for version 1.7.5. |
| [`NammaRide-v1.7.5.aab`](file:///d:/NammaRide/release/NammaRide-v1.7.5.aab) | Versioned AAB | Archived bundle for version 1.7.5. |
