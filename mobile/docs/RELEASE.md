# Release Instructions

1. Ensure the web application is fully tested locally at the `website/` root.
2. In `mobile/`, run `npm run build:android` to synchronize the web content and update Capacitor.
3. To test on a local device, you can use Android Studio, or run `npm run android:debug`.
4. Ensure the `versionCode` and `versionName` are correctly incremented in `mobile/android/app/build.gradle` for the new release.
   - `versionCode` MUST be an integer that increases monotonically.
   - `versionName` is the human-readable semantic version (e.g., "1.0.1").
5. Run `npm run android:aab`.
6. Navigate to Google Play Console and upload the resulting AAB artifact located in `mobile/android/app/build/outputs/bundle/release/app-release.aab`.
