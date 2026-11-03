import React, { useEffect } from 'react';

const DEFAULT_TITLE = "Best Bengaluru Metro App: Offline GPS Route Planner, Fares and Timings | NammaRide";
const DEFAULT_DESC = "NammaRide is rated the #1 best offline Geo GPS app for Bengaluru Namma Metro (BMRCL). Plan routes across Purple, Green, Yellow, and Pink lines with live fares, 100 stations guide, platform interchange transfer, and train timings in English and Kannada.";
const DEFAULT_KEYWORDS = "best metro app for bengaluru, best metro app bangalore, namma metro app, namma ride, namma ride app download, bengaluru metro route map, pink line metro bangalore, kalena agrahara to tavarekere, jayadeva interchange, namma metro ticket fare calculator, namma metro timings 2026, offline metro app bengaluru, bmrcl smart card discount, purple line, green line, yellow line, electronic city metro, majestic last train timings, ನಮ್ಮ ಮೆಟ್ರೋ ಅತ್ಯುತ್ತಮ ಆಪ್, ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಮಾರ್ಗ ನಕ್ಷೆ, ಪಿಂಕ್ ಲೈನ್ ಉದ್ಘಾಟನೆ, ನಮ್ಮ ಮೆಟ್ರೋ ಟಿಕೆಟ್ ದರ, ಮೆಜೆಸ್ಟಿಕ್ ಇಂಟರ್‌ಚೇಂಜ್, ಜಯದೇವ ಮೆಟ್ರೋ, ಕಾಳೇನ ಅಗ್ರಹಾರ, bengaluru metro app apk";
const SITE_URL = "https://www.nammaride.site";

// Clean typography helper: strictly devoid of emojis and emdashes
function sanitizeText(str) {
  if (!str) return "";
  return str
    .replace(/[\u2014]/g, " - ")
    .replace(/[\u2013]/g, "-")
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\u2300-\u23FF\u2B50-\u2B55]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function MetaSEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Clean and enforce strict title formatting: Primary Keyword: Secondary Benefit | NammaRide
    let rawTitle = sanitizeText(title);
    let finalTitle = DEFAULT_TITLE;
    if (rawTitle) {
      if (rawTitle.endsWith("| NammaRide")) {
        finalTitle = rawTitle;
      } else if (rawTitle.includes("NammaRide")) {
        finalTitle = `${rawTitle.replace(/\s*\|\s*NammaRide/g, "")} | NammaRide`;
      } else {
        finalTitle = `${rawTitle} | NammaRide`;
      }
    }
    document.title = finalTitle;

    // Helper for Meta Tags
    const updateMeta = (selector, attr, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 2. Update Description & Keywords
    const finalDesc = sanitizeText(description) || DEFAULT_DESC;
    const finalKeywords = sanitizeText(keywords) || DEFAULT_KEYWORDS;
    updateMeta('meta[name="description"]', 'content', finalDesc);
    updateMeta('meta[name="keywords"]', 'content', finalKeywords);

    // 3. Update Open Graph
    const pageUrl = `${SITE_URL}${canonicalPath}`;
    updateMeta('meta[property="og:title"]', 'content', finalTitle);
    updateMeta('meta[property="og:description"]', 'content', finalDesc);
    updateMeta('meta[property="og:url"]', 'content', pageUrl);

    // 4. Update Twitter Cards
    updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'content', finalTitle);
    updateMeta('meta[name="twitter:description"]', 'content', finalDesc);
    updateMeta('meta[name="twitter:url"]', 'content', pageUrl);
    updateMeta('meta[name="twitter:image"]', 'content', `${SITE_URL}/assets/images/logo_app.png`);

    // 5. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // 6. Dynamic JSON-LD Schema Injection
    let pageScript = document.getElementById('dynamic-page-jsonld');
    if (jsonLd) {
      if (!pageScript) {
        pageScript = document.createElement('script');
        pageScript.id = 'dynamic-page-jsonld';
        pageScript.type = 'application/ld+json';
        document.head.appendChild(pageScript);
      }
      pageScript.text = JSON.stringify(jsonLd);
    } else if (pageScript) {
      pageScript.remove();
    }
  }, [title, description, keywords, canonicalPath, jsonLd]);

  return null;
}
