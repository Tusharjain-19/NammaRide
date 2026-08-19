# NammaRide Design System — Bengaluru City Metro (Namma Metro)

## 1. Overview
The design system for **NammaRide** is inspired by the city of Bengaluru and its iconic BMRCL Namma Metro network. It combines a deep pitch-black dark mode with vibrant, authentic Namma Metro line colors and high-contrast, non-glassy controls for ultimate legibility and seamless navigation.

---

## 2. Color Palette & Typography

### Metro Line Color Standards (BMRCL)
- **Purple Line (Namma Metro Purple)**: `#A855F7` / `#9333EA`
- **Green Line (Namma Metro Green)**: `#10B981` / `#22C55E`
- **Yellow Line (Namma Metro Yellow)**: `#EAB308` / `#F59E0B`
- **Pink Line (Upcoming Kalena Agrahara - Nagawara)**: `#EC4899` / `#F43F5E`

> **Note on Color Consistency**: Pink is strictly reserved for the BMRCL Pink Metro Line. Stray or arbitrary pink hues across general UI elements are replaced with unified Bengaluru Metro accent colors (Emerald Green / Deep Sapphire Blue) to maintain strict visual hierarchy.

### Core Dark Mode & App Backgrounds
- **Primary Background**: `#000000` (Pure Pitch Black)
- **Surface & Cards**: Translucent Onyx `rgba(18, 18, 22, 0.75)` with subtle frosted blur.
- **Header & Navigation Bar**: Deep Midnight `#080B10` with subtle border divider.
- **Dropdown & Select Controls**: **Solid Dark Cobalt Blue (`#141E2D` / `#1E293B`)** — strictly opaque with crisp border and subtle shadow for maximum legibility (no transparency or glass blur).

---

## 3. Dropdowns & Controls Specification
- **Station Search Dropdowns & Language Selector**:
  - **Background**: Solid Dark Blue (`#141E2D`)
  - **Border**: `1px solid rgba(59, 130, 246, 0.25)` / `rgba(255, 255, 255, 0.15)`
  - **Text Color**: Pure White (`#FFFFFF`) with `#A1A1AA` placeholders
  - **Selected / Hover States**: `#1E293B` with vibrant blue highlight ring `rgba(59, 130, 246, 0.4)`
  - **Opacity**: 100% Opaque (No glassmorphic blur to avoid text bleed or background distraction)

---

## 4. Typography & Icons
- **Heading / Signage Font**: `'Outfit', sans-serif` — geometric modern transit font inspired by BMRCL signage & station displays.
- **Body & Content Font**: `'Plus Jakarta Sans', sans-serif` — sleek, high-legibility tech hub font.
- **Monospace / Clock & Codes**: `'Space Grotesk', monospace` — sharp, modern digital display font.
- **Iconography**: Lucide SVG Icons, mapped to line-specific colors.
