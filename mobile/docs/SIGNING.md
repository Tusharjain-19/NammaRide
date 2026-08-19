# Application Signing

To deploy to Google Play, the AAB must be cryptographically signed using a permanent Keystore.

## Keystore Location
The Upload Keystore will be stored locally on your machine at `mobile/secure/nammaride-upload-key.jks`.
**This file is strictly ignored by Git. NEVER upload it to the repository.**

## Generating the Keystore (One-Time)
Run the following command from the `mobile/secure/` directory to create a keystore. Keep the password extremely safe!
```bash
keytool -genkey -v -keystore nammaride-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

## Extracting the Public Certificate
Run the following to extract the PEM certificate for Google Play App Signing enrollment:
```bash
keytool -export -rfc -keystore nammaride-upload-key.jks -alias upload -file nammaride-upload-certificate.pem
```

## Configuring Gradle
In `mobile/android/app/build.gradle`, you must define the `signingConfigs` to reference the `.jks` file and read your password locally via a secure environment variable or a local property file (`local.properties`).

**DO NOT** hardcode the password inside `build.gradle`!
