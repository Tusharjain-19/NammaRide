# NammaRide Android Releases

Official signed release binaries for **NammaRide - Bengaluru Metro Transit Guide**.

## Latest Release: v1.7.3 (Build 16)
- **Application ID:** `site.nammaride.app`
- **Version Code:** `16`
- **Version Name:** `1.7.3`
- **Signature:** Release signed with production upload keystore (`nammaride-upload`)
- **Key Enhancements in v1.7.3:**
  - **Fixed Timings Section in APK/AAB:** Resolved schedule key evaluation and safely extracted train start/end frequencies across all lines (Pink, Purple, Green, Yellow), preventing any null reference crashes.
  - **Updated IIM Bangalore Station Image in Explore:** Replaced the incorrect screenshot card with an authentic, high-resolution exterior photograph of the elevated IIM Bangalore (Bilekahalli) Metro Station on Bannerghatta Road.
  - **Re-engineered Home Route Result Card UI/UX:**
    - Integrated stops count, distance, and transfer summary badge (`15 Stops • 16.50 km • 3 Transfers`) centrally between Total Time (`44 min`) and Fare (`₹60`).
    - Extended Platform & Direction box width (~68%) to display full station names without truncation; compacted Next Train box (~32%).
    - Stacked WhatsApp booking ticket button cleanly below passenger count and total fare, completely preventing horizontal UI leaks and overflows on all mobile screens.

## Available Binaries

| File | Type | Target Use |
| :--- | :--- | :--- |
| [`app-release.apk`](file:///d:/NammaRide/release/app-release.apk) | Direct APK | Sideload directly on Android phones for testing and offline distribution. |
| [`app-release.aab`](file:///d:/NammaRide/release/app-release.aab) | Android App Bundle | Upload directly to the Google Play Console for Play Store production release. |
| [`NammaRide-v1.7.3.apk`](file:///d:/NammaRide/release/NammaRide-v1.7.3.apk) | Versioned APK | Archived build for version 1.7.3. |
| [`NammaRide-v1.7.3.aab`](file:///d:/NammaRide/release/NammaRide-v1.7.3.aab) | Versioned AAB | Archived bundle for version 1.7.3. |
