import React, { useEffect, useState } from 'react';
import { BarChart3, Users, CreditCard, QrCode, Ticket, RefreshCw } from 'lucide-react';
import ridershipFallback from '../data/ridershipFallback.json';

const CSV_URL = 'https://raw.githubusercontent.com/thecont1/namma-metro-ridership-tracker/main/NammaMetro_Ridership_Dataset.csv';
const CACHE_KEY = 'nammaride_web_ridership_v1';
const SOFT_TTL_MS = 3 * 3600 * 1000;

function parseRidershipCsv(csvText) {
  const lines = String(csvText || '').trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 14) continue;
    const smartCards = Number(cols[1] || 0);
    const tokens = Number(cols[6] || 0);
    const ncmc = Number(cols[7] || 0);
    const groupTicket = Number(cols[8] || 0);
    const qr = Number(cols[9] || 0);
    const total = smartCards + tokens + ncmc + groupTicket + qr;
    if (!total) continue;
    rows.push({
      date: cols[0],
      total,
      smartCards,
      tokens,
      ncmc,
      qr,
      groupTicket,
      qrBreakdown: {
        nammaMetro: Number(cols[10] || 0),
        whatsapp: Number(cols[11] || 0),
        ondc: Number(cols[13] || 0),
      },
    });
  }
  if (!rows.length) return null;
  return { latest: rows[rows.length - 1], recent30: rows.slice(-30) };
}

export default function RidershipStatsCard() {
  const [stats, setStats] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.payload?.latest) return parsed.payload;
      }
    } catch (e) {}
    return ridershipFallback;
  });
  const [syncLabel, setSyncLabel] = useState('Open Data Snapshot');

  useEffect(() => {
    let cancelled = false;

    const loadFresh = async () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.savedAt && Date.now() - parsed.savedAt < SOFT_TTL_MS && parsed?.payload?.latest) {
            if (!cancelled) setStats(parsed.payload);
            setSyncLabel('Synced Open Archive');
            return;
          }
        }
      } catch (e) {}

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSyncLabel('Offline Cached Snapshot');
        return;
      }

      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4500);
        const res = await fetch(CSV_URL, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) return;
        const text = await res.text();
        const parsed = parseRidershipCsv(text);
        if (parsed && !cancelled) {
          setStats(parsed);
          setSyncLabel('Live Archive Synced');
          localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload: parsed }));
        }
      } catch (e) {
        if (!cancelled) setSyncLabel('Cached Archive');
      }
    };

    loadFresh();
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = stats?.latest || ridershipFallback.latest;
  const recent14 = (stats?.recent30 || ridershipFallback.recent30 || []).slice(-14);
  const maxTotal = Math.max(...recent14.map((r) => r.total), 1);

  const pct = (val) => ((val / (latest.total || 1)) * 100).toFixed(1);
  const inFmt = (n) => Number(n || 0).toLocaleString('en-IN');

  return (
    <div className="rounded-3xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Namma Metro Daily Ridership Analytics</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            {inFmt(latest.total)} Passengers
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Recorded on <strong className="text-gray-800 dark:text-gray-200">{latest.date}</strong> • Web-exclusive commuter insights
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-[11px] font-bold text-gray-600 dark:text-gray-300">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
          <span>{syncLabel}</span>
        </span>
      </div>

      {/* Ticket & Fare Mix Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>Smart Cards</span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white">{inFmt(latest.smartCards)}</div>
          <div className="text-[11px] font-bold text-purple-500 mt-0.5">{pct(latest.smartCards)}% share</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>NCMC RuPay</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white">{inFmt(latest.ncmc)}</div>
          <div className="text-[11px] font-bold text-sky-500 mt-0.5">{pct(latest.ncmc)}% share</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>QR Tickets</span>
            <QrCode className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white">{inFmt(latest.qr)}</div>
          <div className="text-[11px] font-bold text-emerald-500 mt-0.5">
            {pct(latest.qr)}% · WhatsApp {inFmt(latest.qrBreakdown?.whatsapp)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>Tokens Sold</span>
            <Ticket className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white">{inFmt(latest.tokens)}</div>
          <div className="text-[11px] font-bold text-amber-500 mt-0.5">{pct(latest.tokens)}% share</div>
        </div>
      </div>

      {/* 14-Day Trend Bar Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
          <span>14-Day Daily Ridership Trend</span>
          <span>Peak: {inFmt(maxTotal)}</span>
        </div>
        <div className="flex items-end gap-1.5 h-20 pt-2">
          {recent14.map((r) => {
            const hPct = Math.max(12, Math.round((r.total / maxTotal) * 100));
            return (
              <div key={r.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${r.date}: ${inFmt(r.total)} riders`}>
                <div
                  className="w-full rounded-t-md bg-emerald-500/75 group-hover:bg-emerald-500 transition-all"
                  style={{ height: `${hPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-neutral-900">
        <span>Dataset: BMRCL Daily Ticket Mix & Ridership</span>
        <span>
          Open Archive: <a href="https://github.com/thecont1/namma-metro-ridership-tracker" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">thecont1 (0BSD)</a>
        </span>
      </div>
    </div>
  );
}

