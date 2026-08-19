# Build Instructions

## Environment Requirements
To build this application locally, you must install:
- **Node.js**: (v18 or higher recommended)
- **npm**: Comes with Node.js
- **Java**: JDK 17
- **Android Studio**: Including Android SDK, Build Tools, and Platform Tools

## Automated Build Scripts
All commands must be run from inside the `mobile/` directory:

1. **`npm run web:sync`**: Syncs the frontend from `../website` into `mobile-web` and injects Capacitor logic.
2. **`npm run cap:sync`**: Syncs the frontend into the native Android structure.
3. **`npm run build:android`**: Performs both steps 1 and 2 automatically.
4. **`npm run android:debug`**: Compiles a debug APK locally via Gradle.
5. **`npm run android:release`**: Compiles an unsigned release APK.
6. **`npm run android:aab`**: Compiles a release Android App Bundle (AAB).

## Build Output
- The Debug APK will be output to: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`
- The Release AAB will be output to: `mobile/android/app/build/outputs/bundle/release/app-release.aab`
