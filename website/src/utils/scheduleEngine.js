/**
 * Website ESM Wrapper around BMRCL Deterministic Schedule & Crowd Engine
 * Imports bundled Vite JSON/JS data modules directly without touching /public.
 */
import SCHEDULE_DATA from '../data/scheduleData.json';
import CROWD_HOURLY from '../data/crowdHourly.json';
import { stationsData } from '../data/stationsData.js';

const IST_OFFSET_MS = 5.5 * 3600 * 1000;
const DAY_SEC = 86400;
const expandedCache = new Map();

const STATION_NAMES = (() => {
  const map = { purple: {}, green: {}, yellow: {}, pink: {} };
  for (const st of stationsData || []) {
    const lk = (st.line || '').toLowerCase();
    if (map[lk]) map[lk][st.code] = st.name_en || st.name || st.code;
  }
  return map;
})();

export function getISTParts(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  const year = ist.getUTCFullYear();
  const month = ist.getUTCMonth() + 1;
  const day = ist.getUTCDate();
  const weekday = ist.getUTCDay();
  const hour = ist.getUTCHours();
  const minute = ist.getUTCMinutes();
  const second = ist.getUTCSeconds();
  const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const secOfDay = hour * 3600 + minute * 60 + second;
  return { year, month, day, weekday, hour, minute, second, ymd, minOfDay: hour * 60 + minute, secOfDay };
}

export function isHolidayDate(ymd, overrides = null) {
  if ((SCHEDULE_DATA.holidays || []).includes(ymd)) return true;
  return Array.isArray(overrides?.holidayOverrides) && overrides.holidayOverrides.includes(ymd);
}

export function getDayType(date = new Date(), overrides = null) {
  const parts = getISTParts(date);
  if (isHolidayDate(parts.ymd, overrides)) return 'sunday';
  if (parts.weekday === 0) return 'sunday';
  if (parts.weekday === 1) return 'monday';
  if (parts.weekday === 6) return 'saturday';
  return 'weekday';
}

function parseHmToSec(hm) {
  const [h, m] = String(hm).split(':').map(Number);
  return (Number.isFinite(h) ? h : 0) * 3600 + (Number.isFinite(m) ? m : 0) * 60;
}

export function formatISTTime(secOfDay) {
  const norm = ((Math.round(secOfDay) % DAY_SEC) + DAY_SEC) % DAY_SEC;
  let h = Math.floor(norm / 3600);
  const m = Math.floor((norm % 3600) / 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatCountdownLabel(secUntil) {
  if (secUntil <= 30) return 'Arriving';
  if (secUntil <= 40) return 'Arriving soon';
  const mins = Math.ceil(secUntil / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function computeOffsetSec(meta, fromIdx, stopIdx, toIdx) {
  if (stopIdx === fromIdx) return 0;
  const rawCum = Math.abs(meta.cumSec[stopIdx] - meta.cumSec[fromIdx]);
  if (stopIdx === toIdx) return rawCum;
  const prevIdx = stopIdx > fromIdx ? stopIdx - 1 : stopIdx + 1;
  const prevSeg = Math.abs(meta.cumSec[stopIdx] - meta.cumSec[prevIdx]);
  const dwell = Math.min(meta.dwellSec || 25, Math.floor(prevSeg * 0.3));
  return rawCum - dwell;
}

export function getStationCrowd(stationId, date = new Date()) {
  const parts = getISTParts(date);
  const isWeekend = parts.weekday === 0 || parts.weekday === 6;
  const entry = CROWD_HOURLY?.[stationId];
  const arr = entry ? (isWeekend ? entry.we : entry.wd) : null;
  const score = arr ? (arr[parts.hour] ?? 20) : (parts.hour >= 8 && parts.hour <= 20 ? 35 : 10);

  if (score >= 70) return { score, level: 'Peak Crowd', shortLabel: 'Peak', hex: '#F43F5E' };
  if (score >= 45) return { score, level: 'Busy', shortLabel: 'Busy', hex: '#F59E0B' };
  if (score >= 22) return { score, level: 'Moderate', shortLabel: 'Moderate', hex: '#0EA5E9' };
  return { score, level: 'Quiet', shortLabel: 'Quiet', hex: '#10B981' };
}

function expandLineTrips(lineKey, dayType, overrides = null) {
  const cacheKey = `${lineKey}_${dayType}_${overrides?.updatedAt || 'base'}`;
  if (expandedCache.has(cacheKey)) return expandedCache.get(cacheKey);

  const meta = SCHEDULE_DATA.lines?.[lineKey];
  const sched = SCHEDULE_DATA.schedules?.[lineKey]?.[dayType] || SCHEDULE_DATA.schedules?.[lineKey]?.weekday;
  if (!meta || !sched) return [];

  const rawTrips = [];
  const seen = new Map();

  const pushTrip = (fromIdx, toIdx, depSec, isShortLoop) => {
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const bk = `${fromIdx}_${toIdx}`;
    if (!seen.has(bk)) seen.set(bk, []);
    const list = seen.get(bk);
    for (let i = 0; i < list.length; i++) {
      if (Math.abs(list[i] - depSec) < 35) return;
    }
    list.push(depSec);
    const dir = toIdx > fromIdx ? 1 : -1;
    const totalDurationSec = Math.abs(meta.cumSec[toIdx] - meta.cumSec[fromIdx]);
    rawTrips.push({
      id: `${lineKey}_${dayType}_${fromIdx}_${toIdx}_${Math.round(depSec)}`,
      lineKey,
      dir,
      fromIdx,
      toIdx,
      fromId: meta.ids[fromIdx],
      toId: meta.ids[toIdx],
      terminalName: STATION_NAMES[lineKey]?.[meta.ids[toIdx]] || meta.ids[toIdx],
      depSec,
      endSec: depSec + totalDurationSec,
      isShortLoop,
    });
  };

  for (const fg of sched.frequency || []) {
    const fIdx = meta.ids.indexOf(fg.from);
    const tIdx = meta.ids.indexOf(fg.toward);
    if (fIdx === -1 || tIdx === -1 || fIdx === tIdx) continue;
    const isShortLoop = !((fIdx === 0 && tIdx === meta.ids.length - 1) || (fIdx === meta.ids.length - 1 && tIdx === 0));
    for (const band of fg.bands || []) {
      const sSec = parseHmToSec(band.s);
      const eSec = parseHmToSec(band.e);
      const hSec = Math.round(Number(band.h) * 60);
      if (!hSec || hSec <= 0) continue;
      for (let t = sSec; t <= eSec + 1; t += hSec) pushTrip(fIdx, tIdx, t, isShortLoop);
    }
  }

  for (const tr of sched.trips || []) {
    const fIdx = meta.ids.indexOf(tr.from);
    const tIdx = meta.ids.indexOf(tr.to);
    if (fIdx === -1 || tIdx === -1 || fIdx === tIdx) continue;
    const isShortLoop = !((fIdx === 0 && tIdx === meta.ids.length - 1) || (fIdx === meta.ids.length - 1 && tIdx === 0));
    for (const tm of tr.times || []) pushTrip(fIdx, tIdx, parseHmToSec(tm), isShortLoop);
  }

  rawTrips.sort((a, b) => a.depSec - b.depSec);
  if (expandedCache.size > 24) expandedCache.clear();
  expandedCache.set(cacheKey, rawTrips);
  return rawTrips;
}

export function getNextTrainsAtStation({ lineKey, stationId, directionSign = 1, date = new Date(), limit = 2, overrides = null }) {
  const meta = SCHEDULE_DATA.lines?.[lineKey];
  const parts = getISTParts(date);
  const dayType = getDayType(date, overrides);
  const crowd = getStationCrowd(stationId, date);
  if (!meta) return { dayType, crowd, trains: [] };

  const stIdx = meta.ids.indexOf(stationId);
  if (stIdx === -1) return { dayType, crowd, trains: [], isUpcoming: true };

  const collect = (trips, dayOffset) => {
    const out = [];
    for (const tr of trips) {
      if (tr.dir !== directionSign) continue;
      if (directionSign === 1 ? (stIdx < tr.fromIdx || stIdx >= tr.toIdx) : (stIdx > tr.fromIdx || stIdx <= tr.toIdx)) continue;
      const offset = computeOffsetSec(meta, tr.fromIdx, stIdx, tr.toIdx);
      const depSec = tr.depSec + offset + dayOffset;
      out.push({ depSec, terminalName: tr.terminalName, isShortLoop: tr.isShortLoop, isTomorrow: dayOffset > 0 });
    }
    return out;
  };

  const todayList = collect(expandLineTrips(lineKey, dayType, overrides), 0);
  const tomDate = new Date(date.getTime() + DAY_SEC * 1000);
  const tomList = collect(expandLineTrips(lineKey, getDayType(tomDate, overrides), overrides), DAY_SEC);

  const upcoming = [...todayList.filter((t) => t.depSec >= parts.secOfDay - 10), ...tomList]
    .sort((a, b) => a.depSec - b.depSec)
    .slice(0, limit)
    .map((item) => {
      const secUntil = Math.max(0, Math.round(item.depSec - parts.secOfDay));
      return {
        ...item,
        secUntil,
        countdownLabel: formatCountdownLabel(secUntil),
        isDue: secUntil <= 40,
        departureFormatted: formatISTTime(item.depSec),
      };
    });

  return { lineKey, stationId, dayType, crowd, trains: upcoming };
}

export function getActiveTrainsOnLine(lineKey, date = new Date(), overrides = null) {
  const meta = SCHEDULE_DATA.lines?.[lineKey];
  if (!meta) return [];
  const parts = getISTParts(date);
  const active = [];

  const checkTrips = (trips, dayShiftSec) => {
    const relNow = parts.secOfDay - dayShiftSec;
    for (const tr of trips) {
      if (relNow < tr.depSec || relNow > tr.endSec) continue;
      const elapsed = relNow - tr.depSec;
      const originCum = meta.cumSec[tr.fromIdx];
      let k = tr.fromIdx;
      const step = tr.dir;

      while (k !== tr.toIdx) {
        const nextK = k + step;
        const totalOffsetNext = Math.abs(meta.cumSec[nextK] - originCum);
        const segSec = Math.abs(meta.cumSec[nextK] - meta.cumSec[k]);
        const isLastHop = nextK === tr.toIdx;
        const dwell = isLastHop ? 0 : Math.min(meta.dwellSec || 25, Math.floor(segSec * 0.3));
        const arrOffsetNext = totalOffsetNext - dwell;
        const prevOffset = Math.abs(meta.cumSec[k] - originCum);

        if (elapsed <= arrOffsetNext) {
          const runDur = Math.max(1, arrOffsetNext - prevOffset);
          const u = Math.max(0, Math.min(1, (elapsed - prevOffset) / runDur));
          const eased = u * u * (3 - 2 * u);
          active.push({
            id: `${tr.id}_${dayShiftSec}`,
            lineKey,
            dir: tr.dir,
            currentIdx: k,
            nextIdx: nextK,
            currentId: meta.ids[k],
            nextId: meta.ids[nextK],
            stationFloatIdx: k + step * eased,
            isDwelling: false,
            secToNextStation: Math.max(0, Math.round(arrOffsetNext - elapsed)),
            terminalName: tr.terminalName,
            isShortLoop: tr.isShortLoop,
          });
          break;
        } else if (elapsed <= totalOffsetNext) {
          active.push({
            id: `${tr.id}_${dayShiftSec}`,
            lineKey,
            dir: tr.dir,
            currentIdx: nextK,
            nextIdx: nextK,
            currentId: meta.ids[nextK],
            nextId: meta.ids[nextK],
            stationFloatIdx: nextK,
            isDwelling: true,
            secToNextStation: 0,
            terminalName: tr.terminalName,
            isShortLoop: tr.isShortLoop,
          });
          break;
        }
        k = nextK;
      }
    }
  };

  const todayTrips = expandLineTrips(lineKey, getDayType(date, overrides), overrides);
  checkTrips(todayTrips, 0);
  if (parts.secOfDay < 3600) {
    const yestDate = new Date(date.getTime() - DAY_SEC * 1000);
    checkTrips(expandLineTrips(lineKey, getDayType(yestDate, overrides), overrides), -DAY_SEC);
  }
  return active;
}

export function getActiveTrainsAllLines(date = new Date(), overrides = null) {
  return {
    purple: getActiveTrainsOnLine('purple', date, overrides),
    green: getActiveTrainsOnLine('green', date, overrides),
    yellow: getActiveTrainsOnLine('yellow', date, overrides),
    pink: getActiveTrainsOnLine('pink', date, overrides),
  };
}


/**
 * Returns the first scheduled train of tomorrow for a given line/station.
 * Provides the "first train tomorrow" data for the NO_SERVICE boarding HUD card.
 * @param {string} lineKey - Metro line key e.g. 'purple' | 'green'
 * @param {string} stationId - Origin station ID
 * @param {number} directionSign - Travel direction (1 or -1)
 * @param {object|null} overrides - Live schedule overrides
 * @returns {object|null} Train object with departureFormatted, secUntil etc.
 */
export function getTomorrowFirstTrainAtStation(lineKey, stationId, directionSign = 1, overrides = null) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const tomorrowIST = new Date(tomorrow.getTime() - (5.5 * 3600 * 1000));
  const res = getNextTrainsAtStation({ lineKey, stationId, directionSign, date: tomorrowIST, limit: 1, overrides });
  return res?.trains?.[0] || null;
}
