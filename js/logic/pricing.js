

// 1. FARE ZONE TABLE (10 zones, distance-slab based)
export const FARE_ZONES = [
  { zone: "F1",  minKm: 0,   maxKm: 2,        fare: 10 },
  { zone: "F2",  minKm: 2,   maxKm: 4,        fare: 20 },
  { zone: "F3",  minKm: 4,   maxKm: 6,        fare: 30 },
  { zone: "F4",  minKm: 6,   maxKm: 8,        fare: 40 },
  { zone: "F5",  minKm: 8,   maxKm: 10,       fare: 50 },
  { zone: "F6",  minKm: 10,  maxKm: 15,       fare: 60 },
  { zone: "F7",  minKm: 15,  maxKm: 20,       fare: 70 },
  { zone: "F8",  minKm: 20,  maxKm: 25,       fare: 80 },
  { zone: "F9",  minKm: 25,  maxKm: 30,       fare: 90 },
  { zone: "F10", minKm: 30,  maxKm: Infinity, fare: 90 },
];

export const SMART_CARD_DISCOUNTS = {
  peakHour:    0.05,   
  offPeak:     0.10,   
  sunday:      0.10,   
  nationalHoliday: 0.10,
};

export const PEAK_HOURS = [
  { start: "07:00", end: "10:00" }, 
  { start: "17:00", end: "20:00" }, 
];

export const NATIONAL_HOLIDAYS = [
  { month: 1,  day: 26, name: "Republic Day"       },
  { month: 8,  day: 15, name: "Independence Day"   },
  { month: 10, day: 2,  name: "Gandhi Jayanti"     },
];

export const TOURIST_CARDS = [
  { name: "1-Day Pass", validity: 1, smartCard: 300, mobileQR: 250, description: "Unlimited travel for 1 day from first tap" },
  { name: "3-Day Pass", validity: 3, smartCard: 600, mobileQR: 550, description: "Unlimited travel for 3 consecutive days" },
  { name: "5-Day Pass", validity: 5, smartCard: 900, mobileQR: 850, description: "Unlimited travel for 5 consecutive days" },
];

export const SMART_CARD_MIN_BALANCE = 90; 

/**
 * calculateFare - Compatibility layer for existing main.js
 */
export function calculateFare(distanceKm, travelDate = new Date(), ticketType = 'TOKEN') {
  const isSmart = (ticketType === true || ticketType === 'CARD' || ticketType === 'QR' || ticketType === 'NCMC');
  
  const baseFare = getFareByDistance(distanceKm);
  const zoneInfo = getZoneByDistance(distanceKm);
  const peakIdx = isPeakHour(travelDate);
  const sunday = isSunday(travelDate);
  const holiday = isNationalHoliday(travelDate);

  let finalFare = baseFare;
  let saving = 0;
  let discountLabel = "No discount (Token)";

  if (isSmart) {
    const scResult = calculateSmartCardFare(baseFare, travelDate);
    finalFare = scResult.discountedFare;
    saving = scResult.saving;
    discountLabel = scResult.discountLabel;
  }

  return {
    distanceKm: Number(distanceKm).toFixed(2),
    zone: zoneInfo.zone,
    baseFare: baseFare,
    finalFare: finalFare, // Alias for payableFare for main.js compatibility
    payableFare: finalFare,
    appliedDiscount: saving, // Alias for saving for main.js compatibility
    saving: saving,
    discountLabel: discountLabel,
    ticketType: isSmart ? "Smart Card / NCMC" : "Token",
    isPeakHour: peakIdx,
    isSunday: sunday,
    isNationalHoliday: holiday
  };
}

export function getFareByDistance(distanceKm) {
  if (distanceKm < 0) throw new Error("Distance cannot be negative");
  if (distanceKm === 0) return FARE_ZONES[0].fare;
  const zone = FARE_ZONES.find((z) => distanceKm > z.minKm && distanceKm <= z.maxKm);
  return zone ? zone.fare : FARE_ZONES[FARE_ZONES.length - 1].fare;
}

export function getZoneByDistance(distanceKm) {
  if (distanceKm === 0) return FARE_ZONES[0];
  return (FARE_ZONES.find((z) => distanceKm > z.minKm && distanceKm <= z.maxKm) || FARE_ZONES[FARE_ZONES.length - 1]);
}

export function isSunday(date) { return date.getDay() === 0; }

export function isNationalHoliday(date) {
  return NATIONAL_HOLIDAYS.some((h) => h.month === date.getMonth() + 1 && h.day === date.getDate());
}

export function isPeakHour(date) {
  const day = date.getDay();
  if (day === 0 || isNationalHoliday(date)) return false;
  const hhmm = date.getHours() * 100 + date.getMinutes();
  return PEAK_HOURS.some((p) => {
    const [sh, sm] = p.start.split(":").map(Number);
    const [eh, em] = p.end.split(":").map(Number);
    const start = sh * 100 + sm;
    const end = eh * 100 + em;
    return hhmm >= start && hhmm < end;
  });
}

export function getSmartCardDiscount(date) {
  if (isSunday(date)) return { rate: SMART_CARD_DISCOUNTS.sunday, label: "Sunday (10% off)" };
  if (isNationalHoliday(date)) return { rate: SMART_CARD_DISCOUNTS.nationalHoliday, label: "National Holiday (10% off)" };
  if (isPeakHour(date)) return { rate: SMART_CARD_DISCOUNTS.peakHour, label: "Peak Hour (5% off)" };
  return { rate: SMART_CARD_DISCOUNTS.offPeak, label: "Off-Peak (10% off)" };
}

export function calculateSmartCardFare(baseFare, date) {
  const { rate, label } = getSmartCardDiscount(date);
  const discount = Math.floor(baseFare * rate); 
  const discountedFare = baseFare - discount;
  return { discountedFare, saving: discount, discountLabel: label };
}

export function haversineDistance(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinA = Math.sin(dLat / 2);
  const sinB = Math.sin(dLon / 2);
  const c = sinA * sinA + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinB * sinB;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}

function toRad(deg) { return (deg * Math.PI) / 180; }

export function routeDistance(fromId, toId, lineData) {
  const stations = lineData.stations;
  const fromIdx = stations.findIndex((s) => s.id === fromId);
  const toIdx = stations.findIndex((s) => s.id === toId);
  if (fromIdx === -1 || toIdx === -1) return null;
  const startIdx = Math.min(fromIdx, toIdx);
  const endIdx = Math.max(fromIdx, toIdx);
  return stations.slice(startIdx, endIdx).reduce((sum, s) => sum + s.distanceToNext, 0);
}

export function interLineDistance(fromId, toId, purpleLine, greenLine) {
  const MAJESTIC_PURPLE = "P23";
  const MAJESTIC_GREEN = "G17";
  const inPurple = (id) => purpleLine.stations.some((s) => s.id === id);
  const inGreen = (id) => greenLine.stations.some((s) => s.id === id);

  if (inPurple(fromId) && inPurple(toId)) return { distance: routeDistance(fromId, toId, purpleLine), path: ["Purple Line"] };
  if (inGreen(fromId) && inGreen(toId)) return { distance: routeDistance(fromId, toId, greenLine), path: ["Green Line"] };

  if (inPurple(fromId) && inGreen(toId)) {
    const seg1 = routeDistance(fromId, MAJESTIC_PURPLE, purpleLine) || 0;
    const seg2 = routeDistance(MAJESTIC_GREEN, toId, greenLine) || 0;
    return { distance: seg1 + seg2, path: ["Purple Line", "↔ Interchange at Majestic", "Green Line"] };
  }
  if (inGreen(fromId) && inPurple(toId)) {
    const seg1 = routeDistance(fromId, MAJESTIC_GREEN, greenLine) || 0;
    const seg2 = routeDistance(MAJESTIC_PURPLE, toId, purpleLine) || 0;
    return { distance: seg1 + seg2, path: ["Green Line", "↔ Interchange at Majestic", "Purple Line"] };
  }
  return null;
}

export function calculateTripFare(fromId, toId, purpleLine, greenLine, travelDate = new Date(), smartCard = false) {
  const allStations = [...purpleLine.stations, ...greenLine.stations];
  const fromStation = allStations.find((s) => s.id === fromId);
  const toStation = allStations.find((s) => s.id === toId);
  if (!fromStation || !toStation) throw new Error("Station not found");

  if (fromId === toId) {
    return { from: fromStation.name, to: toStation.name, routeDistanceKm: 0, path: [], zone: "F1", baseFare: 10, payableFare: smartCard ? 9 : 10, saving: smartCard ? 1 : 0, discountLabel: smartCard ? "Smart Card discount" : "No discount", ticketType: smartCard ? "Smart Card / NCMC" : "Token", isPeakHour: isPeakHour(travelDate), isSunday: isSunday(travelDate), isNationalHoliday: isNationalHoliday(travelDate), travelDate };
  }

  const result = interLineDistance(fromId, toId, purpleLine, greenLine);
  if (!result) throw new Error("Route not found");
  const fareResult = calculateFare(result.distance, travelDate, smartCard);
  return { from: fromStation.name, to: toStation.name, routeDistanceKm: +result.distance.toFixed(2), path: result.path, ...fareResult, travelDate };
}

export function evaluateTouristCard(tripDistances, days, useMobileQR = false) {
  const card = TOURIST_CARDS.find((c) => c.validity === days);
  if (!card) throw new Error("Card not found");
  const tokenTotal = tripDistances.reduce((sum, d) => sum + getFareByDistance(d), 0);
  const passCost = useMobileQR ? card.mobileQR : card.smartCard;
  const saving = tokenTotal - passCost;
  return { tokenTotal, passCost, saving: saving > 0 ? saving : 0, recommendation: saving > 0 ? `✅ Buy the ${card.name} — saves ₹${saving}` : `❌ Token tickets cheaper by ₹${Math.abs(saving)}` };
}

export const FARE_CHART = {
  effectiveFrom: "09 February 2025",
  status: "Active (Feb 2026 hike kept on hold by BMRCL)",
  lastChecked: "15 March 2026",
  zones: FARE_ZONES,
  touristCards: TOURIST_CARDS,
  discounts: SMART_CARD_DISCOUNTS,
  minSmartCardBalance: SMART_CARD_MIN_BALANCE
};
