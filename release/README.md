# NammaRide Android Releases

Official signed release binaries for **NammaRide - Bengaluru Metro Transit Guide**.

## Latest Release: v1.7.4 (Build 17)
- **Application ID:** `site.nammaride.app`
- **Version Code:** `17`
- **Version Name:** `1.7.4`
- **Signature:** Release signed with production upload keystore (`nammaride-upload`)
- **Key Enhancements in v1.7.4:**
  - **Jayadeva Hospital Multi-Level Interchange Platform Logic:**
    - **Pink Line (Level 6):** Routes traffic north-south along Bannerghatta Road.
      - **Platform 3 (Northbound):** For trains heading towards Tavarekere / Nagawara.
      - **Platform 4 (Southbound):** For trains heading towards JP Nagar 4th Phase / Kalena Agrahara.
    - **Yellow Line (Level 5):** Routes traffic east-west along Outer Ring Road and Hosur Road.
      - **Platform 1 (Westbound):** For trains heading towards RV Road.
      - **Platform 2 (Eastbound):** For trains heading towards Bommasandra / Electronic City.
  - **Tavarekere Station Platform Layout:**
    - **Platform 1 (Northbound):** For trains heading toward Nagawara.
    - **Platform 2 (Southbound):** For trains heading toward Kalena Agrahara (via Jayadeva Hospital).
  - **Visual Platform and Multi-Level Layout in App and Simulator:**
    - Station detail view displays multi-level platform cards with explicit line badges, level descriptions, and destination routing.
    - Route itinerary dynamically routes passengers to Platform 3 or 4 at Jayadeva Hospital and Platform 1 or 2 at Tavarekere according to journey direction.

## Available Binaries

| File | Type | Target Use |
| :--- | :--- | :--- |
| [`app-release.apk`](file:///d:/NammaRide/release/app-release.apk) | Direct APK | Sideload directly on Android phones for testing and offline distribution. |
| [`app-release.aab`](file:///d:/NammaRide/release/app-release.aab) | Android App Bundle | Upload directly to the Google Play Console for Play Store production release. |
| [`NammaRide-v1.7.4.apk`](file:///d:/NammaRide/release/NammaRide-v1.7.4.apk) | Versioned APK | Archived build for version 1.7.4. |
| [`NammaRide-v1.7.4.aab`](file:///d:/NammaRide/release/NammaRide-v1.7.4.aab) | Versioned AAB | Archived bundle for version 1.7.4. |
