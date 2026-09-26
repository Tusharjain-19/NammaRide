

// ============================================================
// NammaRide — BMRCL Official Fare Pricing Engine
// Based on station-hop-count tariff (FFC Feb 2025 revision)
// ============================================================

// 1. FARE SLAB TABLE (hop-count based, per BMRCL Fare Fixation Committee)
export const FARE_SLABS = [
  { slab: 1,  minHops: 0,  maxHops: 0,   fare: 10,  label: "Same Station"     },
  { slab: 2,  minHops: 1,  maxHops: 2,   fare: 10,  label: "0 – 2 km"        },
  { slab: 3,  minHops: 3,  maxHops: 4,   fare: 20,  label: "2 – 4 km"        },
  { slab: 4,  minHops: 5,  maxHops: 6,   fare: 30,  label: "4 – 6 km"        },
  { slab: 5,  minHops: 7,  maxHops: 8,   fare: 40,  label: "6 – 8 km"        },
  { slab: 6,  minHops: 9,  maxHops: 10,  fare: 50,  label: "8 – 10 km"       },
  { slab: 7,  minHops: 11, maxHops: 15,  fare: 60,  label: "10 – 15 km"      },
  { slab: 8,  minHops: 16, maxHops: 20,  fare: 70,  label: "15 – 20 km"      },
  { slab: 9,  minHops: 21, maxHops: 25,  fare: 80,  label: "20 – 25 km"      },
  { slab: 10, minHops: 26, maxHops: 999, fare: 90,  label: "Above 25 km"     },
];

// Legacy alias for backward compatibility
export const FARE_ZONES = FARE_SLABS.map((s, i) => ({
  zone: `F${i + 1}`,
  minKm: s.minHops,
  maxKm: s.maxHops === 999 ? Infinity : s.maxHops,
  fare: s.fare
}));

export const SMART_CARD_DISCOUNTS = {
  peakHour:        0.05,   // 5% off during weekday peak
  offPeak:         0.10,   // 10% off during off-peak windows
  sunday:          0.10,   // 10% all day Sunday
  nationalHoliday: 0.10,   // 10% all day on Republic Day, Independence Day, Gandhi Jayanti
};

// BMRCL Official Peak Hours (Mon–Sat, excludes Sundays & National Holidays)
export const PEAK_HOURS = [
  { start: "08:00", end: "12:00" },  // Morning peak
  { start: "16:00", end: "21:00" },  // Evening peak
];

export const NATIONAL_HOLIDAYS = [
  { month: 1,  day: 26, name: "Republic Day"     },
  { month: 8,  day: 15, name: "Independence Day" },
  { month: 10, day: 2,  name: "Gandhi Jayanti"   },
];

export const TOURIST_CARDS = [
  { name: "1-Day Pass", validity: 1, smartCard: 300, mobileQR: 250, description: "Unlimited travel for 1 day from first tap" },
  { name: "3-Day Pass", validity: 3, smartCard: 600, mobileQR: 550, description: "Unlimited travel for 3 consecutive days" },
  { name: "5-Day Pass", validity: 5, smartCard: 900, mobileQR: 850, description: "Unlimited travel for 5 consecutive days" },
];

export const SMART_CARD_MIN_BALANCE = 90;

// ─── Core Fare-by-Hops Function ───
export function getFareByHops(hops) {
  if (hops < 0) throw new Error("Hops cannot be negative");
  if (hops === 0) return 10;
  if (hops <= 2) return 10;
  if (hops <= 4) return 20;
  if (hops <= 6) return 30;
  if (hops <= 8) return 40;
  if (hops <= 10) return 50;
  if (hops <= 15) return 60;
  if (hops <= 20) return 70;
  if (hops <= 25) return 80;
  return 90; // H >= 26, capped at ₹90
}

export function getSlabByHops(hops) {
  if (hops === 0) return FARE_SLABS[0];
  return FARE_SLABS.find(s => hops >= s.minHops && hops <= s.maxHops) || FARE_SLABS[FARE_SLABS.length - 1];
}

// ─── Legacy distance-based function (kept for backward compat, now maps to hops) ───
export function getFareByDistance(distanceKm) {
  // Convert approximate km to hop estimate for legacy callers
  // Average inter-station distance is ~1.2 km across all lines
  if (distanceKm < 0) throw new Error("Distance cannot be negative");
  if (distanceKm === 0) return 10;
  const estimatedHops = Math.round(distanceKm / 1.15);
  return getFareByHops(estimatedHops);
}

export function getZoneByDistance(distanceKm) {
  if (distanceKm === 0) return FARE_SLABS[0];
  const estimatedHops = Math.round(distanceKm / 1.15);
  return getSlabByHops(estimatedHops);
}

// ─── Time / Discount Functions ───
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

// ─── Primary Fare Calculator (hop-based) ───
export function calculateFareByHops(hops, travelDate = new Date(), ticketType = 'TOKEN') {
  const isSmart = (ticketType === true || ticketType === 'CARD' || ticketType === 'QR' || ticketType === 'NCMC');

  const baseFare = getFareByHops(hops);
  const slabInfo = getSlabByHops(hops);
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
    stationHops: hops,
    zone: `F${slabInfo.slab}`,
    slab: slabInfo,
    baseFare: baseFare,
    finalFare: finalFare,
    payableFare: finalFare,
    appliedDiscount: saving,
    saving: saving,
    discountLabel: discountLabel,
    ticketType: isSmart ? "Smart Card / NCMC" : "Token",
    isPeakHour: peakIdx,
    isSunday: sunday,
    isNationalHoliday: holiday
  };
}

/**
 * calculateFare - Legacy compatibility layer (accepts distanceKm OR hops)
 * Now internally converts to hops for accurate BMRCL pricing
 */
export function calculateFare(distanceOrHops, travelDate = new Date(), ticketType = 'TOKEN') {
  // If called from calculateJourney, this receives stationHops directly
  // If called from legacy code, receives distanceKm (we estimate hops)
  const hops = Number.isInteger(distanceOrHops) ? distanceOrHops : Math.round(distanceOrHops / 1.15);
  
  const result = calculateFareByHops(hops, travelDate, ticketType);
  // Add legacy distanceKm field for backward compat
  result.distanceKm = Number.isInteger(distanceOrHops) ? (distanceOrHops * 1.15).toFixed(2) : Number(distanceOrHops).toFixed(2);
  return result;
}

// ─── Utility: Haversine distance (kept for GPS features) ───
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

// ─── Legacy route distance accumulator (kept for backward compat) ───
export function routeDistance(fromId, toId, lineData) {
  const stations = lineData.stations;
  const fromIdx = stations.findIndex((s) => s.id === fromId);
  const toIdx = stations.findIndex((s) => s.id === toId);
  if (fromIdx === -1 || toIdx === -1) return null;
  const startIdx = Math.min(fromIdx, toIdx);
  const endIdx = Math.max(fromIdx, toIdx);
  return stations.slice(startIdx, endIdx).reduce((sum, s) => sum + s.distanceToNext, 0);
}

// ─── Hop-count calculator between any two station IDs ───
export function countStationHops(fromId, toId, metroData) {
  const purple = metroData.purple;
  const green = metroData.green;
  const yellow = metroData.yellow;

  const MAJESTIC_PURPLE_ID = "P23";
  const MAJESTIC_GREEN_ID = "G17";
  const RV_ROAD_GREEN_ID = "G24";
  const RV_ROAD_YELLOW_ID = "Y01";

  const inLine = (id, line) => line.stations.some(s => s.id === id);
  const indexOf = (id, line) => line.stations.findIndex(s => s.id === id);

  const majesticPurpleIdx = indexOf(MAJESTIC_PURPLE_ID, purple); // 22 (0-indexed from Whitefield end)
  const majesticGreenIdx = indexOf(MAJESTIC_GREEN_ID, green);     // 16
  const rvRoadGreenIdx = indexOf(RV_ROAD_GREEN_ID, green);        // 23
  const rvRoadYellowIdx = indexOf(RV_ROAD_YELLOW_ID, yellow);     // 0

  const GREEN_TRUNK_HOPS = Math.abs(rvRoadGreenIdx - majesticGreenIdx); // 7

  if (fromId === toId) return 0;

  const fromPurple = inLine(fromId, purple);
  const fromGreen = inLine(fromId, green);
  const fromYellow = inLine(fromId, yellow);
  const toPurple = inLine(toId, purple);
  const toGreen = inLine(toId, green);
  const toYellow = inLine(toId, yellow);

  let minHops = Infinity;

  // Same-line direct travel
  if (fromPurple && toPurple) {
    minHops = Math.min(minHops, Math.abs(indexOf(fromId, purple) - indexOf(toId, purple)));
  }
  if (fromGreen && toGreen) {
    minHops = Math.min(minHops, Math.abs(indexOf(fromId, green) - indexOf(toId, green)));
  }
  if (fromYellow && toYellow) {
    minHops = Math.min(minHops, Math.abs(indexOf(fromId, yellow) - indexOf(toId, yellow)));
  }

  // Purple ↔ Green (via Majestic)
  if (fromPurple && toGreen) {
    const h = Math.abs(indexOf(fromId, purple) - majesticPurpleIdx) + Math.abs(indexOf(toId, green) - majesticGreenIdx);
    minHops = Math.min(minHops, h);
  }
  if (fromGreen && toPurple) {
    const h = Math.abs(indexOf(fromId, green) - majesticGreenIdx) + Math.abs(indexOf(toId, purple) - majesticPurpleIdx);
    minHops = Math.min(minHops, h);
  }

  // Green ↔ Yellow (via RV Road)
  if (fromGreen && toYellow) {
    const h = Math.abs(indexOf(fromId, green) - rvRoadGreenIdx) + Math.abs(indexOf(toId, yellow) - rvRoadYellowIdx);
    minHops = Math.min(minHops, h);
  }
  if (fromYellow && toGreen) {
    const h = Math.abs(indexOf(fromId, yellow) - rvRoadYellowIdx) + Math.abs(indexOf(toId, green) - rvRoadGreenIdx);
    minHops = Math.min(minHops, h);
  }

  // Purple ↔ Yellow (via Majestic → Green trunk → RV Road)
  if (fromPurple && toYellow) {
    const h = Math.abs(indexOf(fromId, purple) - majesticPurpleIdx) + GREEN_TRUNK_HOPS + Math.abs(indexOf(toId, yellow) - rvRoadYellowIdx);
    minHops = Math.min(minHops, h);
  }
  if (fromYellow && toPurple) {
    const h = Math.abs(indexOf(fromId, yellow) - rvRoadYellowIdx) + GREEN_TRUNK_HOPS + Math.abs(indexOf(toId, purple) - majesticPurpleIdx);
    minHops = Math.min(minHops, h);
  }

  // Handle interchange stations that exist on multiple lines (RV Road is G24 and Y01)
  // If fromId is on Green and also is RV Road, try Yellow direct
  if (fromId === RV_ROAD_GREEN_ID && toYellow) {
    const h = Math.abs(indexOf(toId, yellow) - rvRoadYellowIdx);
    minHops = Math.min(minHops, h);
  }
  if (toId === RV_ROAD_GREEN_ID && fromYellow) {
    const h = Math.abs(indexOf(fromId, yellow) - rvRoadYellowIdx);
    minHops = Math.min(minHops, h);
  }

  return minHops === Infinity ? 0 : minHops;
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
    return { from: fromStation.name, to: toStation.name, routeDistanceKm: 0, stationHops: 0, path: [], zone: "F1", baseFare: 10, payableFare: smartCard ? 9 : 10, saving: smartCard ? 1 : 0, discountLabel: smartCard ? "Smart Card discount" : "No discount", ticketType: smartCard ? "Smart Card / NCMC" : "Token", isPeakHour: isPeakHour(travelDate), isSunday: isSunday(travelDate), isNationalHoliday: isNationalHoliday(travelDate), travelDate };
  }

  const result = interLineDistance(fromId, toId, purpleLine, greenLine);
  if (!result) throw new Error("Route not found");
  
  // Count actual station hops for accurate pricing
  const metroDataForHops = { purple: purpleLine, green: greenLine, yellow: { stations: [] } };
  const hops = countStationHops(fromId, toId, metroDataForHops);
  const fareResult = calculateFareByHops(hops, travelDate, smartCard);
  
  return { from: fromStation.name, to: toStation.name, routeDistanceKm: +result.distance.toFixed(2), stationHops: hops, path: result.path, ...fareResult, travelDate };
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
  lastChecked: "26 September 2026",
  pricingMethod: "station-hop-count",
  slabs: FARE_SLABS,
  zones: FARE_ZONES,
  touristCards: TOURIST_CARDS,
  discounts: SMART_CARD_DISCOUNTS,
  minSmartCardBalance: SMART_CARD_MIN_BALANCE
};
