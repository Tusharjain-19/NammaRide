import React, { useEffect } from 'react';

const DEFAULT_TITLE = "NammaRide: #1 Best Metro App for Bengaluru (Bangalore) | Geo GPS Route & Timings";
const DEFAULT_DESC = "NammaRide is rated the #1 Best Geo GPS App for Bengaluru Namma Metro (BMRCL). Features 100% offline satellite GPS station detection, Purple, Green & Yellow line maps, fare calculator with 5% smart card discount, and bilingual English & Kannada guides.";
const DEFAULT_KEYWORDS = "best app metro app for bengaluru, best app metro app for bangalore, bengaluru metro app, bangalore metro route map, namma metro gps tracking app, offline metro app bengaluru, bmrcl metro app free download, namma metro ticket fare calculator, namma metro timings 2026, purple line metro app, green line metro app, yellow line metro app, majestic metro station guide, bengaluru metro card discount app, bengalaru metro, bengalooru metro, UT metro app, union territory traveler metro app";
const SITE_URL = "https://www.nammaride.site";

export default function MetaSEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Update Document Title
    const finalTitle = title ? `${title} | NammaRide` : DEFAULT_TITLE;
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
    const finalDesc = description || DEFAULT_DESC;
    const finalKeywords = keywords || DEFAULT_KEYWORDS;
    updateMeta('meta[name="description"]', 'content', finalDesc);
    updateMeta('meta[name="keywords"]', 'content', finalKeywords);

    // 3. Update Open Graph
    const pageUrl = `${SITE_URL}${canonicalPath}`;
    updateMeta('meta[property="og:title"]', 'content', finalTitle);
    updateMeta('meta[property="og:description"]', 'content', finalDesc);
    updateMeta('meta[property="og:url"]', 'content', pageUrl);

    // 4. Update Twitter Cards
    updateMeta('meta[property="twitter:title"]', 'content', finalTitle);
    updateMeta('meta[property="twitter:description"]', 'content', finalDesc);
    updateMeta('meta[property="twitter:url"]', 'content', pageUrl);

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
