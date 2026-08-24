/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "emerald-accent": "#10B981",
        "deep-slate": "#0F172A",
        "purple-line": "#8B5CF6",
        "yellow-line": "#EAB308",
        "primary": "#10b981",
        "on-primary": "#ffffff",
        "secondary": "#8B5CF6",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        "section-gap": "120px",
        "container-max": "1440px",
        "component-gap": "24px",
        "gutter-desktop": "32px",
        "margin-desktop": "80px"
      },
      fontFamily: {
        "title-lg": ["Public Sans", "sans-serif"],
        "display-lg": ["Public Sans", "sans-serif"],
        "label-sm": ["Public Sans", "sans-serif"],
        "headline-md": ["Public Sans", "sans-serif"],
        "headline-lg": ["Public Sans", "sans-serif"],
        "body-lg": ["Public Sans", "sans-serif"],
        "display-xl": ["Public Sans", "sans-serif"],
        "label-lg": ["Public Sans", "sans-serif"],
        "body-md": ["Public Sans", "sans-serif"],
        "sans": ["Public Sans", "sans-serif"],
        "heading": ["Public Sans", "sans-serif"],
      },
      fontSize: {
        "title-lg": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.04em", fontWeight: "700" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
      }
    }
  },
  plugins: [],
}
