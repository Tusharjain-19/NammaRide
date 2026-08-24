import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation & Header
    appName: 'NammaRide',
    subtitle: 'Bengaluru Transit Guide',
    tagline: 'Navigate Bengaluru Smartly, Offline Always',
    home: 'Home',
    simulator: 'Web Simulator',
    stations: 'Stations',
    map: 'Interactive Map',
    explore: 'Explore City',
    fareCalculator: 'Fare Calculator',
    timings: 'Timings',
    safety: 'Safety & Help',
    features: 'Features',
    about: 'About Us',
    blog: 'Blog & Guide',
    contact: 'Contact',
    download: 'Download App',
    getApp: 'Get Android App',
    language: 'Language',
    developedBy: 'Developed by Tushar Jain',

    // Hero Section
    heroTitle1: 'Navigate Bengaluru Metro',
    heroTitleHighlight: 'Smartly',
    heroTitle2: 'Offline Always',
    heroDesc: 'Your daily Bengaluru Metro companion: plan routes in seconds, save on fares with Smart Card tips, and navigate 83 stations effortlessly. No internet needed.',
    all3Lines: 'All 3 Lines Covered',
    purpleLine: 'Purple Line',
    greenLine: 'Green Line',
    yellowLine: 'Yellow Line',
    liveSimulationRunning: 'Live Simulation Running',

    // Feature Highlights & USPs Comparison Table
    builtForRealCommuters: 'Built for Real Commuters, Not Just Maps',
    whyCommutersSwitched: 'Why 1000+ Commuters Switched to NammaRide',
    whyCommutersDesc: 'See how NammaRide stacks up against the competition: feature by feature.',
    feature: 'Feature',
    nammaride: 'NammaRide',
    bmrclOfficial: 'BMRCL Official',
    googleMaps: 'Google Maps',

    // Express Tech Park Navigator
    techParkExpress: 'Tech Park & Commute Hub Express',
    techParkExpressTitle: 'Direct Metro Routes to Bengaluru\'s Top Tech Hubs',
    techParkExpressDesc: 'Tap any major tech park or educational campus below to view nearest metro station, line color, and walking shuttle connectivity.',
    nearestMetro: 'Nearest Metro',
    lineConnectivity: 'Line & Connectivity',
    walkingShuttle: 'Walking / Shuttle',
    estTicketFare: 'Est. Ticket Fare',

    // Live Metrics Dashboard
    activeStationsCount: '83',
    activeStationsLabel: 'Active Stations',
    activeStationsSub: 'Purple, Green & Yellow Lines',
    offlineFirstCount: '100%',
    offlineFirstLabel: 'Offline First',
    offlineFirstSub: 'Zero Internet Required',
    smartCardSavingsCount: '10%',
    smartCardSavingsLabel: 'Smart Card Savings',
    smartCardSavingsSub: 'Instant Discount Rates',
    zeroDataTrackingCount: '0 KB',
    zeroDataTrackingLabel: 'Data Tracking',
    zeroDataTrackingSub: 'Strict Privacy Guarantee',

    // Scan QR Code & App Download Section
    scanQrTitle: 'Get the NammaRide Android App',
    scanQrSubTitle: 'Scan QR Code & Get NammaRide Android App',
    scanQrDesc: 'Point your smartphone camera at the QR code to open the Google Play Store directly. Enjoy 100% offline transit guidance, platform interchange maps, and automatic station alerts.',
    scanWithCamera: 'Scan with Camera or Lens',
    directPlayDownload: 'Direct Google Play Download',
    instantPlayScan: 'Instant Google Play Scan',

    // Stations Page
    browseStationsTitle: 'Bengaluru Metro Stations Directory',
    browseStationsDesc: 'Explore detailed platform maps, wheelchair accessibility, elevator locations, and connecting bus routes for all 83 stations.',
    searchStationPlaceholder: 'Search station by name, line, or landmark...',
    allLinesFilter: 'All Metro Lines',
    stationFacilities: 'Station Facilities',
    accessibilityDetails: 'Accessibility & Divyangjan Details',
    elevatorsLifts: 'Elevators (Lifts)',
    escalators: 'Escalators',
    accessibleRestroom: 'Accessible Restroom',
    firstTrainLabel: 'First Train',
    lastTrainLabel: 'Last Train',

    // Timings Page
    timingsTitle: 'Bengaluru Namma Metro Train Schedules & Frequencies',
    timingsDesc: 'Check first & last train departure times from terminal stations across Purple, Green, and Yellow lines.',
    weekdaySatSchedule: 'Monday to Saturday Schedule',
    sundaySchedule: 'Sunday & Public Holiday Schedule',
    peakFrequency: 'Peak Hours Frequency (3–5 min)',
    offPeakFrequency: 'Off-Peak Hours Frequency (8–12 min)',

    // Explore City Page
    exploreCityTitle: 'Explore Bengaluru City via Metro',
    exploreCityDesc: 'Discover top attractions, tech parks, shopping malls, heritage temples, and parks located near Namma Metro stations.',
    allCategories: 'All Categories',
    heritageCulture: 'Heritage & Culture',
    shoppingMalls: 'Shopping & Malls',
    natureParks: 'Nature & Parks',
    techWork: 'Tech Parks & Offices',
    foodDining: 'Food & Dining',

    // Fare Calculator Page
    fareCalcTitle: 'Namma Metro Fare & Smart Card Savings Calculator',
    fareCalcDesc: 'Select your origin and destination station to calculate token fares, smart card discount rates, and total travel time.',
    selectOrigin: 'Select Origin Station',
    selectDestination: 'Select Destination Station',
    calculateFareBtn: 'Calculate Route & Fare',
    totalDistance: 'Total Distance',
    estimatedTime: 'Estimated Time',
    tokenFareLabel: 'Standard Token Fare',
    smartCardFareLabel: 'Smart Card Fare (5% Discount)',

    // Safety & Helpline Page
    safetyTitle: 'Commuter Safety, Security & Helplines',
    safetyDesc: 'Emergency contacts, security helpline numbers, women safety coaches, and lost & found procedures for BMRCL passengers.',
    bmrclHelpline: 'BMRCL Customer Helpline: 1800-425-12345',
    womenSafetyInfo: 'First Coach Reserved for Women',
    securityControlRoom: 'Metro Security Control: 080-22969200',

    // Footer & Mobile Banner
    footerTagline: 'Built for Bengaluru commuters. Fast, reliable, 100% offline metro guidance.',
    quickLinks: 'Quick Links',
    legal: 'Legal & Privacy',
    allRightsReserved: 'All rights reserved.',
    downloadAppMobileBanner: 'Download NammaRide App',
    mobileBannerMessage: '100% Offline Maps & Live Alerts'
  },
  kn: {
    // Navigation & Header
    appName: 'ನಮ್ಮರೈಡ್',
    subtitle: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಮಾರ್ಗದರ್ಶಿ',
    tagline: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಪ್ರಯಾಣ, ಸದಾ ಆಫ್‌ಲೈನ್',
    home: 'ಮುಖಪುಟ',
    simulator: 'ವೆಬ್ ಸಿಮ್ಯುಲೇಟರ್',
    stations: 'ನಿಲ್ದಾಣಗಳು',
    map: 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    explore: 'ನಗರ ಅನ್ವೇಷಣೆ',
    fareCalculator: 'ಪ್ರಯಾಣ ದರ ಲೆಕ್ಕಾಚಾರ',
    timings: 'ಸಮಯ ಸೂಚಕ',
    safety: 'ಸುರಕ್ಷತೆ ಮತ್ತು ಸಹಾಯ',
    features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    blog: 'ಬ್ಲಾಗ್ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    download: 'ಆಪ್ ಡೌನ್‌ಲೋಡ್',
    getApp: 'ಆಂಡ್ರಾಯ್ಡ್ ಆಪ್ ಪಡೆಯಿರಿ',
    language: 'ಭಾಷೆ',
    developedBy: 'ತುಷಾರ್ ಜೈನ್ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ್ದಾರೆ',

    // Hero Section
    heroTitle1: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಪ್ರಯಾಣ',
    heroTitleHighlight: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ',
    heroTitle2: 'ಸದಾ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ',
    heroDesc: 'ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಬೆಂಗಳೂರು ನಮ್ಮ ಮೆಟ್ರೋ ಸಂಗಾತಿ: ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮಾರ್ಗ ಯೋಜಿಸಿ, ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ ಮತ್ತು 83 ನಿಲ್ದಾಣಗಳನ್ನು ಸುಲಭವಾಗಿ ಅನ್ವೇಷಿಸಿ. ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿಲ್ಲ.',
    all3Lines: 'ಎಲ್ಲಾ 3 ಮಾರ್ಗಗಳ ಮಾಹಿತಿ',
    purpleLine: 'ನೇರಳೆ ಮಾರ್ಗ',
    greenLine: 'ಹಸಿರು ಮಾರ್ಗ',
    yellowLine: 'ಹಳದಿ ಮಾರ್ಗ',
    liveSimulationRunning: 'ಲೈವ್ ಸಿಮ್ಯುಲೇಶನ್ ಚಾಲನೆಯಲ್ಲಿದೆ',

    // Feature Highlights & USPs Comparison Table
    builtForRealCommuters: 'ನೈಜ ಪ್ರಯಾಣಿಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    whyCommutersSwitched: '1000+ ಪ್ರಯಾಣಿಕರು ನಮ್ಮರೈಡ್‌ಗೆ ಏಕೆ ಬದಲಾಯಿಸಿದರು',
    whyCommutersDesc: 'ನಮ್ಮರೈಡ್ ಇತರ ಆಪ್‌ಗಳಿಗಿಂತ ಹೇಗೆ ಉತ್ತಮವಾಗಿದೆ ಎಂಬುದನ್ನು ನೋಡಿ.',
    feature: 'ವೈಶಿಷ್ಟ್ಯ',
    nammaride: 'ನಮ್ಮರೈಡ್',
    bmrclOfficial: 'BMRCL ಅಧಿಕೃತ',
    googleMaps: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್',

    // Express Tech Park Navigator
    techParkExpress: 'ಟೆಕ್ ಪಾರ್ಕ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಮಾರ್ಗದರ್ಶಿ',
    techParkExpressTitle: 'ಬೆಂಗಳೂರಿನ ಪ್ರಮುಖ ಟೆಕ್ ಪಾರ್ಕ್‌ಗಳಿಗೆ ಮೆಟ್ರೋ ಮಾರ್ಗಗಳು',
    techParkExpressDesc: 'ಹತ್ತಿರದ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ, ಮಾರ್ಗದ ಬಣ್ಣ ಮತ್ತು ನಡಿಗೆಯ ಸಮಯ ತಿಳಿಯಲು ಕೆಳಗಿನ ಯಾವುದೇ ಟೆಕ್ ಪಾರ್ಕ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    nearestMetro: 'ಹತ್ತಿರದ ಮೆಟ್ರೋ',
    lineConnectivity: 'ಮಾರ್ಗ ಮತ್ತು ಸಂಪರ್ಕ',
    walkingShuttle: 'ನಡಿಗೆ / ಶಟಲ್ ಸಮಯ',
    estTicketFare: 'ಅಂದಾಜು ಟಿಕೆಟ್ ದರ',

    // Live Metrics Dashboard
    activeStationsCount: '83',
    activeStationsLabel: 'ಸಕ್ರಿಯ ನಿಲ್ದಾಣಗಳು',
    activeStationsSub: 'ನೇರಳೆ, ಹಸಿರು ಮತ್ತು ಹಳದಿ ಮಾರ್ಗಗಳು',
    offlineFirstCount: '100%',
    offlineFirstLabel: 'ಸದಾ ಆಫ್‌ಲೈನ್',
    offlineFirstSub: 'ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿಲ್ಲ',
    smartCardSavingsCount: '10%',
    smartCardSavingsLabel: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಉಳಿತಾಯ',
    smartCardSavingsSub: 'ತ್ವರಿತ ರಿಯಾಯಿತಿ ದರಗಳು',
    zeroDataTrackingCount: '0 KB',
    zeroDataTrackingLabel: 'ಡೇಟಾ ಟ್ರ್ಯಾಕಿಂಗ್',
    zeroDataTrackingSub: 'ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆಯ ಭರವಸೆ',

    // Scan QR Code & App Download Section
    scanQrTitle: 'ನಮ್ಮರೈಡ್ ಆಂಡ್ರಾಯ್ಡ್ ಆಪ್ ಪಡೆಯಿರಿ',
    scanQrSubTitle: 'QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಮ್ಮರೈಡ್ ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    scanQrDesc: 'ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಟೋರ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ತೆರೆಯಲು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಕ್ಯಾಮೆರಾವನ್ನು QR ಕೋಡ್‌ಗೆ ತೋರಿಸಿ. 100% ಆಫ್‌ಲೈನ್ ಮೆಟ್ರೋ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಲೈವ್ ಅಲರ್ಟ್‌ಗಳನ್ನು ಆನಂದಿಸಿ.',
    scanWithCamera: 'ಕ್ಯಾಮೆರಾದೊಂದಿಗೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    directPlayDownload: 'ನೇರ ಗೂಗಲ್ ಪ್ಲೇ ಡೌನ್‌ಲೋಡ್',
    instantPlayScan: 'ತ್ವರಿತ ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಕ್ಯಾನ್',

    // Stations Page
    browseStationsTitle: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ನಿಲ್ದಾಣಗಳ ಪಟ್ಟಿ',
    browseStationsDesc: 'ಎಲ್ಲಾ 83 ನಿಲ್ದಾಣಗಳ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ನಕ್ಷೆಗಳು, ವೀಲ್‌ಚೇರ್ ಸೌಲಭ್ಯಗಳು, ಲಿಫ್ಟ್‌ಗಳು ಮತ್ತು ಬಸ್ ಸಂಪರ್ಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
    searchStationPlaceholder: 'ನಿಲ್ದಾಣದ ಹೆಸರು ಅಥವಾ ಮಾರ್ಗದಿಂದ ಹುಡುಕಿ...',
    allLinesFilter: 'ಎಲ್ಲಾ ಮೆಟ್ರೋ ಮಾರ್ಗಗಳು',
    stationFacilities: 'ನಿಲ್ದಾಣದ ಸೌಲಭ್ಯಗಳು',
    accessibilityDetails: 'ದಿವ್ಯಾಂಗ ಸೌಲಭ್ಯಗಳು',
    elevatorsLifts: 'ಎಲಿವೇಟರ್‌ಗಳು (ಲಿಫ್ಟ್)',
    escalators: 'ಎಸ್ಸಲೇಟರ್‌ಗಳು',
    accessibleRestroom: 'ಸುಸಜ್ಜಿತ ಶೌಚಾಲಯ',
    firstTrainLabel: 'ಮೊದಲ ರೈಲು',
    lastTrainLabel: 'ಕೊನೆಯ ರೈಲು',

    // Timings Page
    timingsTitle: 'ಬೆಂಗಳೂರು ನಮ್ಮ ಮೆಟ್ರೋ ರೈಲು ಸಮಯ ಮತ್ತು ಆವರ್ತನ',
    timingsDesc: 'ನೇರಳೆ, ಹಸಿರು ಮತ್ತು ಹಳದಿ ಮಾರ್ಗಗಳ ಟರ್ಮಿನಲ್ ನಿಲ್ದಾಣಗಳಿಂದ ಮೊದಲ ಮತ್ತು ಕೊನೆಯ ರೈಲು ಹೊರಡುವ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ.',
    weekdaySatSchedule: 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ಸಮಯ',
    sundaySchedule: 'ಭಾನುವಾರ ಮತ್ತು ಸಾರ್ವಜನಿಕ ರಜಾದಿನಗಳ ಸಮಯ',
    peakFrequency: 'ಪೀಕ್ ಅವಧಿಯ ಆವರ್ತನ (3-5 ನಿಮಿಷ)',
    offPeakFrequency: 'ಸಾಮಾನ್ಯ ಅವಧಿಯ ಆವರ್ತನ (8-12 ನಿಮಿಷ)',

    // Explore City Page
    exploreCityTitle: 'ಮೆಟ್ರೋ ಮೂಲಕ ಬೆಂಗಳೂರು ನಗರವನ್ನು ಅನ್ವೇಷಿಸಿ',
    exploreCityDesc: 'ನಮ್ಮ ಮೆಟ್ರೋ ನಿಲ್ದಾಣಗಳ ಹತ್ತಿರವಿರುವ ಪ್ರಸಿದ್ಧ ಪ್ರವಾಸಿ ಸ್ಥಳಗಳು, ಟೆಕ್ ಪಾರ್ಕ್‌ಗಳು, ಶಾಪಿಂಗ್ ಮಾಲ್‌ಗಳು ಮತ್ತು ಉದ್ಯಾನವನಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.',
    allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    heritageCulture: 'ಪಾರಂಪರಿಕ & ಸಾಂಸ್ಕೃತಿಕ',
    shoppingMalls: 'ಶಾಪಿಂಗ್ & ಮಾಲ್‌ಗಳು',
    natureParks: 'ಪ್ರಕೃತಿ & ಉದ್ಯಾನವನಗಳು',
    techWork: 'ಟೆಕ್ ಪಾರ್ಕ್ & ಕಚೇರಿಗಳು',
    foodDining: 'ಆಹಾರ & ಉಪಹಾರ',

    // Fare Calculator Page
    fareCalcTitle: 'ನಮ್ಮ ಮೆಟ್ರೋ ಟಿಕೆಟ್ ದರ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಲೆಕ್ಕಾಚಾರ',
    fareCalcDesc: 'ಪ್ರಯಾಣ ದರ, ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಯಾಯಿತಿ ಮತ್ತು ಒಟ್ಟು ಪ್ರಯಾಣ ಸಮಯವನ್ನು ಲೆಕ್ಕಹಾಕಲು ನಿಮ್ಮ ನಿಲ್ದಾಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
    selectOrigin: 'ಪ್ರಾರಂಭದ ನಿಲ್ದಾಣ ಆಯ್ಕೆಮಾಡಿ',
    selectDestination: 'ತಲುಪುವ ನಿಲ್ದಾಣ ಆಯ್ಕೆಮಾಡಿ',
    calculateFareBtn: 'ಮಾರ್ಗ ಮತ್ತು ದರ ಲೆಕ್ಕಹಾಕಿ',
    totalDistance: 'ಒಟ್ಟು ದೂರ',
    estimatedTime: 'ಅಂದಾಜು ಸಮಯ',
    tokenFareLabel: 'ಸಾಮಾನ್ಯ ಟೋಕನ್ ದರ',
    smartCardFareLabel: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ದರ (5% ರಿಯಾಯಿತಿ)',

    // Safety & Helpline Page
    safetyTitle: 'ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆ ಮತ್ತು ಸಹಾಯವಾಣಿ',
    safetyDesc: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು, ಭದ್ರತಾ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಮಹಿಳಾ ಭದ್ರತಾ ಮಾರ್ಗದರ್ಶಿಗಳು.',
    bmrclHelpline: 'BMRCL ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ: 1800-425-12345',
    womenSafetyInfo: 'ಮೊದಲ ಬೋಗಿ ಮಹಿಳೆಯರಿಗೆ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
    securityControlRoom: 'ಮೆಟ್ರೋ ಭದ್ರತಾ ನಿಯಂತ್ರಣ: 080-22969200',

    // Footer & Mobile Banner
    footerTagline: 'ಬೆಂಗಳೂರು ಪ್ರಯಾಣಿಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ. ವೇಗದ, ಸುರಕ್ಷಿತ, 100% ಆಫ್‌ಲೈನ್ ಮೆಟ್ರೋ ಮಾರ್ಗದರ್ಶಿ.',
    quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    legal: 'ಕಾನೂನು ಮತ್ತು ಗೌಪ್ಯತೆ',
    allRightsReserved: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    downloadAppMobileBanner: 'ನಮ್ಮರೈಡ್ ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    mobileBannerMessage: '100% ಆಫ್‌ಲೈನ್ ನಕ್ಷೆಗಳು ಮತ್ತು ಲೈವ್ ಅಲರ್ಟ್‌ಗಳು'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('nammaride_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nammaride_lang', lang);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
