# Permissions
This document explains the Android permissions required by the NammaRide app.

| Permission | Purpose | When requested | Why required |
|---|---|---|---|
| `INTERNET` | Required to access online APIs and routing. | Automatically at startup | The app needs to calculate routes, fetch live transit info and load maps. |
| `ACCESS_FINE_LOCATION` | Required to locate the user's nearest metro station. | When the user explicitly taps "Use my location". | To accurately track user journey and assist when GPS is active. |

> **Note:** Background location is explicitly NOT requested. Location is only tracked while the app is actively used in the foreground.
