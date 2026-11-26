import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Radio, Clock, Users, Navigation, RotateCcw, X, Layers, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import metroPolylines from '../data/metroPolylines.json';
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

function interpolatePointOnLine(coords, frac) {
  if (!coords || coords.length === 0) return BENGALURU_CENTER;
  if (coords.length === 1) return coords[0];
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
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    acc += len;
  }
  return coords[coords.length - 1];
}

function buildTrainGeoJson(lineFilter, nowDate) {
  const all = getActiveTrainsAllLines(nowDate);
  const features = [];

  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    if (lineFilter !== 'all' && lineFilter !== lineKey) continue;
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    const stations = lineData.stations || [];
    const trains = all[lineKey] || [];

    for (const tr of trains) {
      const loIdx = Math.max(0, Math.min(stations.length - 1, Math.floor(tr.stationFloatIdx)));
      const hiIdx = Math.max(0, Math.min(stations.length - 1, Math.ceil(tr.stationFloatIdx)));
      const subT = tr.stationFloatIdx - loIdx;
      const fLo = stations[loIdx]?.frac ?? 0;
      const fHi = stations[hiIdx]?.frac ?? fLo;
      const polyFrac = fLo + (fHi - fLo) * subT;
      const coords = interpolatePointOnLine(lineData.coords, polyFrac);

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coords },
        properties: {
          id: tr.id,
          lineKey,
          color: lineData.color,
          dir: tr.dir,
          label: tr.dir === 1 ? '▶' : '◀',
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
  for (const lineKey of ['purple', 'green', 'yellow', 'pink']) {
    if (lineFilter !== 'all' && lineFilter !== lineKey) continue;
    const lineData = metroPolylines.lines?.[lineKey];
    if (!lineData) continue;
    for (let i = 0; i < (lineData.stations || []).length; i++) {
      const st = lineData.stations[i];
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [st.lon, st.lat] },
        properties: {
          id: st.id,
          name: st.name,
          lineKey,
          color: lineData.color,
          idx: i,
          firstName: lineData.stations[0]?.name || '',
          lastName: lineData.stations[lineData.stations.length - 1]?.name || '',
        },
      });
    }
  }
  return { type: 'FeatureCollection', features };
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
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);

  const [lineFilter, setLineFilter] = useState('all');
  const [tickNow, setTickNow] = useState(() => new Date());
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapError, setMapError] = useState(false);

  const lineFilterRef = useRef(lineFilter);
  lineFilterRef.current = lineFilter;

  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

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
    if (!MapCtor) {
      setMapError(true);
      return;
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
        try { map.resize(); } catch (e) {}
      });
      resizeObs.observe(mapContainerRef.current);
    }

    const ensureSourcesAndLayers = () => {
      applyDarkBaseStyling(map, isDarkRef.current);
      if (map.getSource('nr-lines')) return;

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

      // Station circles
      map.addLayer({
        id: 'nr-stations-circle',
        type: 'circle',
        source: 'nr-stations',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3.5, 14, 6.5],
          'circle-color': isDarkRef.current ? '#09090b' : '#ffffff',
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-width': 2.2,
        },
      });

      // Live trains halo + marker
      map.addLayer({
        id: 'nr-trains-halo',
        type: 'circle',
        source: 'nr-trains',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 8, 14, 12],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.28,
        },
      });

      map.addLayer({
        id: 'nr-trains-dot',
        type: 'circle',
        source: 'nr-trains',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 14, 7.5],
          'circle-color': ['get', 'color'],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.8,
        },
      });

      map.on('click', 'nr-stations-circle', (e) => {
        const feat = e.features?.[0];
        if (!feat) return;
        setSelectedStation({ ...feat.properties });
      });

      map.on('mouseenter', 'nr-stations-circle', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'nr-stations-circle', () => {
        map.getCanvas().style.cursor = '';
      });

      mapReadyRef.current = true;
    };

    map.on('load', ensureSourcesAndLayers);
    map.on('style.load', ensureSourcesAndLayers);
    map.on('error', () => {
      if (!mapReadyRef.current) {
        setMapError(true);
      }
    });

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
    const { id, lineKey, name, firstName, lastName } = selectedStation;
    const dirForward = getNextTrainsAtStation({ lineKey, stationId: id, directionSign: 1, date: tickNow, limit: 2 });
    const dirReverse = getNextTrainsAtStation({ lineKey, stationId: id, directionSign: -1, date: tickNow, limit: 2 });
    const crowd = getStationCrowd(id, tickNow);
    return { id, lineKey, name, firstName, lastName, dirForward, dirReverse, crowd };
  }, [selectedStation, tickNow]);

  const resetViewport = () => {
    mapRef.current?.flyTo({ center: BENGALURU_CENTER, zoom: 11.2, duration: 700 });
  };

  const svgFallbackData = useMemo(() => {
    if (!mapError) return null;
    const lines = buildLinesGeoJson(lineFilter).features;
    const stations = buildStationsGeoJson(lineFilter).features;
    const trains = buildTrainGeoJson(lineFilter, tickNow).features;
    let minLon = 77.45, maxLon = 77.78, minLat = 12.80, maxLat = 13.09;
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
          <div ref={mapContainerRef} className="w-full h-full" />
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
              return (
                <circle
                  key={`${st.properties.lineKey}-${st.properties.id}`}
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  fill={isDark ? '#09090b' : '#ffffff'}
                  stroke={st.properties.color}
                  strokeWidth={2}
                  className="cursor-pointer"
                  onClick={() => setSelectedStation({ ...st.properties })}
                />
              );
            })}
            {svgFallbackData.trains.map((tr) => {
              const [cx, cy] = svgFallbackData.project(tr.geometry.coordinates);
              return (
                <g key={tr.properties.id}>
                  <circle cx={cx} cy={cy} r={10} fill={tr.properties.color} fillOpacity={0.28} />
                  <circle cx={cx} cy={cy} r={5.5} fill={tr.properties.color} stroke="#ffffff" strokeWidth={1.8} />
                </g>
              );
            })}
          </svg>
        )}

        {/* Selected Station Popover Card */}
        {selectedStationDetails && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-auto sm:w-96 max-h-[62%] overflow-y-auto z-20 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black capitalize">
                    {selectedStationDetails.lineKey} Line
                  </span>
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

        {/* Tap Station Hint Pill */}
        {!selectedStationDetails && (
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-neutral-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm pointer-events-none flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tap any station for next train ETA & crowd level ({dayType} timetable)</span>
          </div>
        )}
      </div>

      {/* Mandatory Open-Data Attribution Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400 px-1">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Schedule-based live simulation (not official BMRCL train telemetry){mapError ? ' · Fallback grid active' : ''}</span>
        </span>
        <span>
          Timetable & Crowd: <a href="https://github.com/Vonter/bmrcl-gtfs" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Vonter (ODbL-1.0)</a> · Map: <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">OpenFreeMap / OSM</a>
        </span>
      </div>
    </div>
  );
}
