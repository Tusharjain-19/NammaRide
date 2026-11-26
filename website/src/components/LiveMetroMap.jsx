/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Radio, Clock, Users, Navigation, RotateCcw, X, Layers, ArrowRight, Gauge, TrainFront } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import metroPolylines from '../data/metroPolylines.json';
import scheduleData from '../data/scheduleData.json';
import {
  getActiveTrainsAllLines,
  getNextTrainsAtStation,
  getStationCrowd,
  getISTParts,
  getDayType,
} from '../utils/scheduleEngine';

const LINE_CONFIG = [
  { key: 'all', label: 'All Lines', color: '#10B981' },
  { key: 'purple', label: 'Purple', color: '#9333EA' },
  { key: 'green', label: 'Green', color: '#10B981' },
  { key: 'yellow', label: 'Yellow', color: '#EAB308' },
  { key: 'pink', label: 'Pink (Phase 1)', color: '#EC4899' },
];

const BENGALURU_CENTER = [77.5946, 12.9716];

function haversineKm(lon1, lat1, lon2, lat2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function interpolatePointAndBearing(coords, frac) {
  if (!coords || coords.length === 0) return { coords: BENGALURU_CENTER, bearing: 0 };
  if (coords.length === 1) return { coords: coords[0], bearing: 0 };
  const clamped = Math.max(0, Math.min(1, frac));
  const segLens = [];
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const d = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]);
    segLens.push(d);
    total += d;
  }
  const target = clamped * total;
  let acc = 0;
  for (let i = 0; i < segLens.length; i++) {
    const len = segLens[i];
    if (acc + len >= target || i === segLens.length - 1) {
      const t = len > 0 ? Math.max(0, Math.min(1, (target - acc) / len)) : 0;
      const a = coords[i];
      const b = coords[i + 1];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      // Clockwise degrees from North (0 = up)
      const bearing = (Math.atan2(dx, dy) * 180) / Math.PI;
      return {
        coords: [a[0] + dx * t, a[1] + dy * t],
        bearing,
      };
    }
    acc += len;
  }
  return { coords: coords[coords.length - 1], bearing: 0 };
}

function normalizeStationKey(name) {
  const s = String(name || '').toLowerCase();
  if (s.includes('majestic') || s.includes('kempegowda')) return 'majestic';
  if (s.includes('rashtreeya vidyalaya') || s.includes('rv road')) return 'rv_road';
  if (s.includes('jayadeva')) return 'jayadeva';
  if (s.includes('silk board')) return 'silk_board';
  if (s.includes('kr pura')) return 'kr_pura';
  if (s.includes('mg road')) return 'mg_road';
  if (s.includes('nagawara')) return 'nagawara';
  return s.replace(/[^a-z0-9]/g, '');
}

function buildInterchangeLookup() {
  const groups = new Map();
  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    for (const st of lineData.stations || []) {
      const key = normalizeStationKey(st.name);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ lineKey, color: lineData.color, name: st.name });
    }
  }
  return groups;
}

const INTERCHANGE_GROUPS = buildInterchangeLookup();

function buildTrainGeoJson(lineFilter, nowDate) {
  const all = getActiveTrainsAllLines(nowDate);
  const features = [];

  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    if (lineFilter !== 'all' && lineFilter !== lineKey) continue;
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    const stations = lineData.stations || [];
    const cumSec = scheduleData.lines?.[lineKey]?.cumSec || [];
    const trains = all[lineKey] || [];

    for (const tr of trains) {
      const loIdx = Math.max(0, Math.min(stations.length - 1, Math.floor(tr.stationFloatIdx)));
      const hiIdx = Math.max(0, Math.min(stations.length - 1, Math.ceil(tr.stationFloatIdx)));
      const subT = tr.stationFloatIdx - loIdx;
      const fLo = stations[loIdx]?.frac ?? 0;
      const fHi = stations[hiIdx]?.frac ?? fLo;
      const polyFrac = fLo + (fHi - fLo) * subT;
      const { coords, bearing } = interpolatePointAndBearing(lineData.coords, polyFrac);
      const directedBearing = tr.dir === -1 ? (bearing + 180) % 360 : bearing;

      const curSt = stations[tr.currentIdx];
      const nxtSt = stations[tr.nextIdx];
      let speedKmh = 0;
      if (!tr.isDwelling && curSt && nxtSt && tr.currentIdx !== tr.nextIdx) {
        const distKm = haversineKm(curSt.lon, curSt.lat, nxtSt.lon, nxtSt.lat);
        const segSec = Math.abs((cumSec[tr.nextIdx] || 0) - (cumSec[tr.currentIdx] || 0));
        const runSec = Math.max(35, segSec - 22);
        const rawKmh = Math.round((distKm / (runSec / 3600)));
        speedKmh = Math.max(26, Math.min(68, rawKmh || 42));
      }

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coords },
        properties: {
          id: tr.id,
          lineKey,
          color: lineData.color,
          dir: tr.dir,
          bearing: directedBearing,
          speedKmh,
          currentStation: curSt?.name || '',
          nextStation: nxtSt?.name || '',
          secToNextStation: tr.secToNextStation || 0,
          terminalName: tr.terminalName,
          isDwelling: tr.isDwelling ? 1 : 0,
        },
      });
    }
  }

  return { type: 'FeatureCollection', features };
}

function buildLinesGeoJson(lineFilter) {
  const features = [];
  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    if (lineFilter !== 'all' && lineFilter !== lineKey) continue;
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: lineData.coords },
      properties: { lineKey, color: lineData.color, future: 0 },
    });
    if (lineData.futureCoords?.length > 1) {
      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: lineData.futureCoords },
        properties: { lineKey, color: lineData.color, future: 1 },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}

function buildStationsGeoJson(lineFilter) {
  const features = [];
  const seenInterchanges = new Set();

  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    if (lineFilter !== 'all' && lineFilter !== lineKey) continue;
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    for (let i = 0; i < (lineData.stations || []).length; i++) {
      const st = lineData.stations[i];
      const normKey = normalizeStationKey(st.name);
      const group = INTERCHANGE_GROUPS.get(normKey) || [];
      const uniqueLines = [];
      const seenLk = new Set();
      for (const g of group) {
        if (!seenLk.has(g.lineKey)) {
          seenLk.add(g.lineKey);
          uniqueLines.push(g);
        }
      }
      const isInterchange = uniqueLines.length >= 2;
      if (isInterchange && lineFilter === 'all') {
        if (seenInterchanges.has(normKey)) continue;
        seenInterchanges.add(normKey);
      }

      const line1 = uniqueLines[0] || { lineKey, color: lineData.color };
      const line2 = uniqueLines[1] || line1;
      const xferIcon = isInterchange ? `xfer-${line1.lineKey}-${line2.lineKey}` : '';

      const stationCoords =
        typeof st.frac === 'number' && lineData.coords?.length > 1
          ? interpolatePointAndBearing(lineData.coords, st.frac).coords
          : [st.lon, st.lat];

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: stationCoords },
        properties: {
          id: st.id,
          name: st.name,
          lineKey,
          color: lineData.color,
          isInterchange: isInterchange ? 1 : 0,
          color1: line1.color,
          color2: line2.color,
          servedLines: uniqueLines.map((u) => u.lineKey).join(','),
          xferIcon,
          idx: i,
          firstName: lineData.stations[0]?.name || '',
          lastName: lineData.stations[lineData.stations.length - 1]?.name || '',
        },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}

function createTrainSpriteImage(colorHex) {
  const w = 44;
  const h = 72;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.roundRect(9, 7, 28, 60, 9);
  ctx.fill();

  // Stainless steel coach body
  const grad = ctx.createLinearGradient(8, 0, 36, 0);
  grad.addColorStop(0, '#cbd5e1');
  grad.addColorStop(0.5, '#f8fafc');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(8, 4, 28, 62, 9);
  ctx.fill();
  ctx.stroke();

  // Line color roof stripe
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.roundRect(12, 18, 20, 36, 4);
  ctx.fill();

  // Front windshield (top = direction 0 deg North)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(12, 7, 20, 9, 4);
  ctx.fill();

  // Twin warm headlights at front nose
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(14, 7, 2.2, 0, Math.PI * 2);
  ctx.arc(30, 7, 2.2, 0, Math.PI * 2);
  ctx.fill();

  return ctx.getImageData(0, 0, w, h);
}

function createInterchangeSpriteImage(color1, color2) {
  const size = 36;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = 13;

  // Left half = color1
  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.closePath();
  ctx.fill();

  // Right half = color2
  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  // Outer crisp white ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Inner cutout dot
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
  ctx.fill();

  return ctx.getImageData(0, 0, size, size);
}

function registerMapSprites(map) {
  const lineColors = {
    purple: '#9333EA',
    green: '#10B981',
    yellow: '#EAB308',
    pink: '#EC4899',
  };
  for (const [lk, hex] of Object.entries(lineColors)) {
    const id = `train-sprite-${lk}`;
    if (!map.hasImage(id)) {
      const img = createTrainSpriteImage(hex);
      if (img) map.addImage(id, img, { pixelRatio: 2 });
    }
  }
  const keys = Object.keys(lineColors);
  for (const k1 of keys) {
    for (const k2 of keys) {
      if (k1 === k2) continue;
      const id = `xfer-${k1}-${k2}`;
      if (!map.hasImage(id)) {
        const img = createInterchangeSpriteImage(lineColors[k1], lineColors[k2]);
        if (img) map.addImage(id, img, { pixelRatio: 2 });
      }
    }
  }
}

function applyDarkBaseStyling(map, isDark) {
  try {
    const style = map.getStyle();
    if (!style || !Array.isArray(style.layers)) return;
    for (const layer of style.layers) {
      if (layer.id?.startsWith('nr-')) continue;
      if (layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', isDark ? '#09090b' : '#f8fafc');
      } else if (layer.type === 'fill' && /water/i.test(layer.id)) {
        map.setPaintProperty(layer.id, 'fill-color', isDark ? '#0f172a' : '#dbeafe');
      } else if (layer.type === 'fill' && (/park|green|grass|wood|land/i.test(layer.id))) {
        map.setPaintProperty(layer.id, 'fill-color', isDark ? '#0b1611' : '#ecfdf5');
      } else if (layer.type === 'fill') {
        map.setPaintProperty(layer.id, 'fill-color', isDark ? '#141418' : '#f1f5f9');
      } else if (layer.type === 'line' && /road|street|highway|path|bridge|tunnel/i.test(layer.id)) {
        map.setPaintProperty(layer.id, 'line-color', isDark ? '#27272a' : '#e2e8f0');
      } else if (layer.type === 'symbol') {
        if (map.getPaintProperty(layer.id, 'text-color') !== undefined) {
          map.setPaintProperty(layer.id, 'text-color', isDark ? '#94a3b8' : '#475569');
        }
        if (map.getPaintProperty(layer.id, 'text-halo-color') !== undefined) {
          map.setPaintProperty(layer.id, 'text-halo-color', isDark ? '#09090b' : '#ffffff');
        }
      }
    }
  } catch (e) {}
}

export default function LiveMetroMap({ onSelectStationByName }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mapContainerRef = useRef(null);
  const labelCanvasRef = useRef(null);
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);

  const [lineFilter, setLineFilter] = useState('all');
  const [tickNow, setTickNow] = useState(() => new Date());
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [mapError, setMapError] = useState(false);

  const lineFilterRef = useRef(lineFilter);
  lineFilterRef.current = lineFilter;

  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const drawStationLabelsOverlay = () => {
    const map = mapRef.current;
    const canvas = labelCanvasRef.current;
    if (!map || !canvas || !mapReadyRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const zoom = map.getZoom();
    const stations = buildStationsGeoJson(lineFilterRef.current).features;
    const placedBoxes = [];
    const dark = isDarkRef.current;

    // Sort interchanges first so they always win label placement
    stations.sort((a, b) => (b.properties.isInterchange || 0) - (a.properties.isInterchange || 0));

    for (const st of stations) {
      const isXfer = st.properties.isInterchange === 1;
      if (!isXfer && zoom < 10.6 && st.properties.idx % 2 === 1) continue;

      const pt = map.project(st.geometry.coordinates);
      if (pt.x < 10 || pt.x > rect.width - 10 || pt.y < 10 || pt.y > rect.height - 10) continue;

      const label = st.properties.name
        .replace('Nadaprabhu Kempegowda Station, ', '')
        .replace('Rashtreeya Vidyalaya Road', 'RV Road');

      ctx.font = isXfer ? '700 11px Inter, system-ui, sans-serif' : '600 9.5px Inter, system-ui, sans-serif';
      const tw = ctx.measureText(label).width;
      const box = {
        x1: pt.x + 8,
        y1: pt.y - 7,
        x2: pt.x + 12 + tw,
        y2: pt.y + 7,
      };

      const collides = placedBoxes.some(
        (b) => !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2)
      );
      if (collides) continue;
      placedBoxes.push(box);

      ctx.lineWidth = 3;
      ctx.strokeStyle = dark ? 'rgba(9, 9, 11, 0.92)' : 'rgba(255, 255, 255, 0.94)';
      ctx.strokeText(label, pt.x + 9, pt.y + 3);
      ctx.fillStyle = isXfer
        ? (dark ? '#ffffff' : '#0f172a')
        : (dark ? '#cbd5e1' : '#334155');
      ctx.fillText(label, pt.x + 9, pt.y + 3);
    }
  };

  // Update simulation positions every 1.5s while visible
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setTickNow(new Date());
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Initialize MapLibre once with fast local-first style + optional OpenFreeMap enhancement
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const MapCtor = maplibregl?.Map || maplibregl?.default?.Map;
    const NavCtrlCtor = maplibregl?.NavigationControl || maplibregl?.default?.NavigationControl;
    const setWorker = maplibregl?.setWorkerUrl || maplibregl?.default?.setWorkerUrl;
    if (!MapCtor) {
      setMapError(true);
      return;
    }
    if (typeof setWorker === 'function' && maplibreWorkerUrl) {
      try { setWorker(maplibreWorkerUrl); } catch (e) {}
    }

    const fallbackBlankStyle = {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'bg',
          type: 'background',
          paint: { 'background-color': isDarkRef.current ? '#09090b' : '#f8fafc' },
        },
      ],
    };

    let map;
    let resizeObs = null;
    let cancelled = false;

    try {
      map = new MapCtor({
        container: mapContainerRef.current,
        style: fallbackBlankStyle,
        center: BENGALURU_CENTER,
        zoom: 11.2,
        minZoom: 9.5,
        maxZoom: 16.5,
        attributionControl: false,
      });
    } catch (e) {
      setMapError(true);
      return;
    }

    if (NavCtrlCtor) {
      map.addControl(new NavCtrlCtor({ showCompass: false }), 'top-right');
    }
    mapRef.current = map;

    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObs = new ResizeObserver(() => {
        try {
          map.resize();
          drawStationLabelsOverlay();
        } catch (e) {}
      });
      resizeObs.observe(mapContainerRef.current);
    }

    const ensureSourcesAndLayers = () => {
      applyDarkBaseStyling(map, isDarkRef.current);
      registerMapSprites(map);
      if (map.getSource('nr-lines')) {
        drawStationLabelsOverlay();
        return;
      }

      map.addSource('nr-lines', { type: 'geojson', data: buildLinesGeoJson(lineFilterRef.current) });
      map.addSource('nr-stations', { type: 'geojson', data: buildStationsGeoJson(lineFilterRef.current) });
      map.addSource('nr-trains', { type: 'geojson', data: buildTrainGeoJson(lineFilterRef.current, new Date()) });

      // Planned future Pink extension (dashed)
      map.addLayer({
        id: 'nr-lines-future',
        type: 'line',
        source: 'nr-lines',
        filter: ['==', ['get', 'future'], 1],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.45,
          'line-dasharray': [2, 2],
        },
      });

      // Active corridor glow + core
      map.addLayer({
        id: 'nr-lines-glow',
        type: 'line',
        source: 'nr-lines',
        filter: ['==', ['get', 'future'], 0],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 8,
          'line-opacity': 0.22,
        },
      });

      map.addLayer({
        id: 'nr-lines-core',
        type: 'line',
        source: 'nr-lines',
        filter: ['==', ['get', 'future'], 0],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-opacity': 0.92,
        },
      });

      // Regular station circles
      map.addLayer({
        id: 'nr-stations-circle',
        type: 'circle',
        source: 'nr-stations',
        filter: ['==', ['get', 'isInterchange'], 0],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3.5, 14, 6.5],
          'circle-color': isDarkRef.current ? '#09090b' : '#ffffff',
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-width': 2.2,
        },
      });

      // Dual-color split-ring interchange markers
      map.addLayer({
        id: 'nr-stations-interchange',
        type: 'symbol',
        source: 'nr-stations',
        filter: ['==', ['get', 'isInterchange'], 1],
        layout: {
          'icon-image': ['get', 'xferIcon'],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.85, 14, 1.2],
          'icon-allow-overlap': true,
        },
      });

      // Live trains as rotated Metro Train sprites (not plain dots)
      map.addLayer({
        id: 'nr-trains-icon',
        type: 'symbol',
        source: 'nr-trains',
        layout: {
          'icon-image': ['concat', 'train-sprite-', ['get', 'lineKey']],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.58, 14, 0.85],
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });

      const onStationClick = (e) => {
        const feat = e.features?.[0];
        if (!feat) return;
        setSelectedTrain(null);
        setSelectedStation({ ...feat.properties });
      };
      map.on('click', 'nr-stations-circle', onStationClick);
      map.on('click', 'nr-stations-interchange', onStationClick);

      map.on('click', 'nr-trains-icon', (e) => {
        const feat = e.features?.[0];
        if (!feat) return;
        setSelectedStation(null);
        setSelectedTrain({ ...feat.properties });
      });

      for (const layerId of ['nr-stations-circle', 'nr-stations-interchange', 'nr-trains-icon']) {
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      mapReadyRef.current = true;
      drawStationLabelsOverlay();
    };

    map.on('load', ensureSourcesAndLayers);
    map.on('style.load', ensureSourcesAndLayers);
    map.on('move', drawStationLabelsOverlay);
    map.on('zoom', drawStationLabelsOverlay);
    map.on('error', (e) => {
      const msg = String(e?.error?.message || e?.message || '');
      if (!mapReadyRef.current || /worker/i.test(msg)) {
        setMapError(true);
      }
    });

    // Safety watchdog: if MapLibre worker/WebGL fails silently, switch to interactive SVG map
    const readyWatchdog = setTimeout(() => {
      if (!cancelled && !mapReadyRef.current) {
        setMapError(true);
      }
    }, 1800);

    // Upgrade to OpenFreeMap street basemap only if reachable within 2.5s
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 2500) : null;
    fetch('https://tiles.openfreemap.org/styles/positron', { signal: controller?.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((styleJson) => {
        if (cancelled || !styleJson || !mapRef.current) return;
        map.setStyle(styleJson);
      })
      .catch(() => {})
      .finally(() => {
        if (timer) clearTimeout(timer);
      });

    return () => {
      cancelled = true;
      clearTimeout(readyWatchdog);
      if (timer) clearTimeout(timer);
      if (controller) controller.abort();
      if (resizeObs) resizeObs.disconnect();
      mapReadyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync dark/light styling on theme change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    applyDarkBaseStyling(map, isDark);
    try {
      if (map.getLayer('nr-stations-circle')) {
        map.setPaintProperty('nr-stations-circle', 'circle-color', isDark ? '#09090b' : '#ffffff');
      }
      drawStationLabelsOverlay();
    } catch (e) {}
  }, [isDark]);

  // Update GeoJSON sources when filter or tick changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    const linesSrc = map.getSource('nr-lines');
    const stSrc = map.getSource('nr-stations');
    const trSrc = map.getSource('nr-trains');
    if (linesSrc) linesSrc.setData(buildLinesGeoJson(lineFilter));
    if (stSrc) stSrc.setData(buildStationsGeoJson(lineFilter));
    if (trSrc) trSrc.setData(buildTrainGeoJson(lineFilter, tickNow));
    drawStationLabelsOverlay();
  }, [lineFilter, tickNow]);

  const activeCounts = useMemo(() => {
    const all = getActiveTrainsAllLines(tickNow);
    return {
      purple: all.purple.length,
      green: all.green.length,
      yellow: all.yellow.length,
      pink: all.pink.length,
      total: all.purple.length + all.green.length + all.yellow.length + all.pink.length,
    };
  }, [tickNow]);

  const istParts = useMemo(() => getISTParts(tickNow), [tickNow]);
  const dayType = useMemo(() => getDayType(tickNow), [tickNow]);

  const selectedStationDetails = useMemo(() => {
    if (!selectedStation) return null;
    const { id, lineKey, name, firstName, lastName, servedLines } = selectedStation;
    const dirForward = getNextTrainsAtStation({ lineKey, stationId: id, directionSign: 1, date: tickNow, limit: 2 });
    const dirReverse = getNextTrainsAtStation({ lineKey, stationId: id, directionSign: -1, date: tickNow, limit: 2 });
    const crowd = getStationCrowd(id, tickNow);
    return { id, lineKey, name, firstName, lastName, servedLines, dirForward, dirReverse, crowd };
  }, [selectedStation, tickNow]);

  // Keep selected train telemetry live on each 1.5s tick
  const liveSelectedTrain = useMemo(() => {
    if (!selectedTrain) return null;
    const currentFeatures = buildTrainGeoJson('all', tickNow).features;
    const match = currentFeatures.find((f) => f.properties.id === selectedTrain.id);
    return match ? match.properties : selectedTrain;
  }, [selectedTrain, tickNow]);

  const resetViewport = () => {
    mapRef.current?.flyTo({ center: BENGALURU_CENTER, zoom: 11.2, duration: 700 });
  };

  const svgFallbackData = useMemo(() => {
    if (!mapError) return null;
    const lines = buildLinesGeoJson(lineFilter).features;
    const stations = buildStationsGeoJson(lineFilter).features;
    const trains = buildTrainGeoJson(lineFilter, tickNow).features;
    const minLon = 77.45, maxLon = 77.78, minLat = 12.80, maxLat = 13.09;
    const project = ([lon, lat]) => [
      ((lon - minLon) / (maxLon - minLon)) * 800,
      600 - ((lat - minLat) / (maxLat - minLat)) * 600,
    ];
    return { lines, stations, trains, project };
  }, [mapError, lineFilter, tickNow]);

  return (
    <div className="space-y-3 w-full min-w-0">
      {/* Top Control & Telemetry Strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-1 w-full min-w-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
          {LINE_CONFIG.map((l) => {
            const active = lineFilter === l.key;
            const count = l.key === 'all' ? activeCounts.total : activeCounts[l.key];
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => setLineFilter(l.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:border-emerald-500/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span>{l.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 text-[11px] font-bold shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 whitespace-nowrap">
            <Radio className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span>{activeCounts.total} Active · {String(istParts.hour).padStart(2, '0')}:{String(istParts.minute).padStart(2, '0')} IST</span>
          </span>
          <button
            type="button"
            onClick={resetViewport}
            className="p-2 rounded-xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:text-emerald-500 cursor-pointer shrink-0"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative w-full h-[58vh] min-h-[380px] sm:h-[620px] rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-950">
        {!mapError ? (
          <>
            <div ref={mapContainerRef} className="w-full h-full" />
            <canvas ref={labelCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
          </>
        ) : svgFallbackData && (
          <svg viewBox="0 0 800 600" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {svgFallbackData.lines.map((f, idx) => {
              const pts = f.geometry.coordinates.map(svgFallbackData.project).map((p) => p.join(',')).join(' ');
              return (
                <polyline
                  key={idx}
                  points={pts}
                  fill="none"
                  stroke={f.properties.color}
                  strokeWidth={f.properties.future ? 3 : 5}
                  strokeOpacity={f.properties.future ? 0.45 : 0.9}
                  strokeDasharray={f.properties.future ? '6 6' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {svgFallbackData.stations.map((st) => {
              const [cx, cy] = svgFallbackData.project(st.geometry.coordinates);
              const isXfer = st.properties.isInterchange === 1;
              const shortName = st.properties.name
                .replace('Nadaprabhu Kempegowda Station, ', '')
                .replace('Rashtreeya Vidyalaya Road', 'RV Road');
              return (
                <g
                  key={`${st.properties.lineKey}-${st.properties.id}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTrain(null);
                    setSelectedStation({ ...st.properties });
                  }}
                >
                  {isXfer ? (
                    <>
                      <path
                        d={`M ${cx} ${cy - 7} A 7 7 0 0 0 ${cx} ${cy + 7} Z`}
                        fill={st.properties.color1}
                      />
                      <path
                        d={`M ${cx} ${cy - 7} A 7 7 0 0 1 ${cx} ${cy + 7} Z`}
                        fill={st.properties.color2}
                      />
                      <circle cx={cx} cy={cy} r={3} fill={isDark ? '#09090b' : '#ffffff'} />
                    </>
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={isDark ? '#09090b' : '#ffffff'}
                      stroke={st.properties.color}
                      strokeWidth={2}
                    />
                  )}
                  {(isXfer || st.properties.idx % 3 === 0) && (
                    <text
                      x={cx + 8}
                      y={cy + 3}
                      fontSize={isXfer ? 10 : 8}
                      fontWeight={isXfer ? 800 : 600}
                      fill={isDark ? '#e2e8f0' : '#1e293b'}
                      stroke={isDark ? '#09090b' : '#ffffff'}
                      strokeWidth={2.5}
                      paintOrder="stroke"
                    >
                      {shortName}
                    </text>
                  )}
                </g>
              );
            })}
            {svgFallbackData.trains.map((tr) => {
              const [cx, cy] = svgFallbackData.project(tr.geometry.coordinates);
              return (
                <g
                  key={tr.properties.id}
                  transform={`translate(${cx}, ${cy}) rotate(${tr.properties.bearing || 0})`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedStation(null);
                    setSelectedTrain({ ...tr.properties });
                  }}
                >
                  <rect x={-5.5} y={-9.5} width={11} height={19} rx={3.5} fill="#f8fafc" stroke="#0f172a" strokeWidth={1.2} />
                  <rect x={-3.5} y={-5} width={7} height={10} rx={1.5} fill={tr.properties.color} />
                  <rect x={-3.5} y={-8} width={7} height={2.5} rx={1} fill="#0f172a" />
                </g>
              );
            })}
          </svg>
        )}

        {/* Selected Train Speed & Telemetry Popover Card */}
        {liveSelectedTrain && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-auto sm:w-88 z-20 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 shadow-2xl space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
                    style={{ background: liveSelectedTrain.color }}
                  >
                    <TrainFront className="w-3 h-3 inline mr-1 -mt-0.5" />
                    {liveSelectedTrain.lineKey} Line Train
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tabular-nums">
                    <Gauge className="w-3 h-3 inline mr-1 -mt-0.5" />
                    {liveSelectedTrain.speedKmh > 0 ? `${liveSelectedTrain.speedKmh} km/h` : 'Stopped (0 km/h)'}
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                  Towards {liveSelectedTrain.terminalName}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrain(null)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs space-y-1">
              {liveSelectedTrain.isDwelling ? (
                <div className="font-bold text-gray-800 dark:text-gray-200">
                  Doors open at <span className="text-emerald-500">{liveSelectedTrain.currentStation}</span>
                </div>
              ) : (
                <div className="font-bold text-gray-800 dark:text-gray-200">
                  {liveSelectedTrain.currentStation} → <span className="text-emerald-500">{liveSelectedTrain.nextStation}</span>
                </div>
              )}
              <div className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
                {liveSelectedTrain.isDwelling
                  ? 'Departing shortly'
                  : `Reaching next stop in ~${liveSelectedTrain.secToNextStation}s · ${liveSelectedTrain.speedKmh} km/h`}
              </div>
            </div>
          </div>
        )}

        {/* Selected Station Popover Card */}
        {selectedStationDetails && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-auto sm:w-96 max-h-[62%] overflow-y-auto z-20 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-1.5 mb-1">
                  {(selectedStationDetails.servedLines ? selectedStationDetails.servedLines.split(',') : [selectedStationDetails.lineKey]).map((lk) => (
                    <span key={lk} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black capitalize">
                      {lk} Line
                    </span>
                  ))}
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white"
                    style={{ background: selectedStationDetails.crowd.hex }}
                  >
                    <Users className="w-3 h-3 inline mr-1 -mt-0.5" />
                    {selectedStationDetails.crowd.level} ({selectedStationDetails.crowd.score}%)
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-base text-gray-900 dark:text-white truncate">
                  {selectedStationDetails.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStation(null)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {selectedStationDetails.dirForward.trains.length > 0 && (
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] text-gray-500 font-bold uppercase truncate">
                      Towards {selectedStationDetails.lastName}
                    </div>
                    <div className="font-mono text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                      {selectedStationDetails.dirForward.trains.map((t) => t.departureFormatted).join(' • ')}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs shrink-0">
                    {selectedStationDetails.dirForward.trains[0].countdownLabel}
                  </span>
                </div>
              )}

              {selectedStationDetails.dirReverse.trains.length > 0 && (
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] text-gray-500 font-bold uppercase truncate">
                      Towards {selectedStationDetails.firstName}
                    </div>
                    <div className="font-mono text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                      {selectedStationDetails.dirReverse.trains.map((t) => t.departureFormatted).join(' • ')}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-black text-xs shrink-0">
                    {selectedStationDetails.dirReverse.trains[0].countdownLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {onSelectStationByName && (
                <button
                  type="button"
                  onClick={() => onSelectStationByName(selectedStationDetails.name)}
                  className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-500 underline cursor-pointer"
                >
                  View Gate Details
                </button>
              )}
              <Link
                to="/simulator"
                className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Plan Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tap Station or Train Hint Pill */}
        {!selectedStationDetails && !liveSelectedTrain && (
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-neutral-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm pointer-events-none flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tap any train for live speed or any station for ETA ({dayType})</span>
          </div>
        )}
      </div>

      {/* Mandatory Open-Data Attribution Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400 px-1">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Schedule-based live simulation (not official BMRCL train telemetry){mapError ? ' · Interactive SVG mode' : ''}</span>
        </span>
        <span>
          Timetable & Crowd: <a href="https://github.com/Vonter/bmrcl-gtfs" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Vonter (ODbL-1.0)</a> · Map: <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">OpenFreeMap / OSM</a>
        </span>
      </div>
    </div>
  );
}
