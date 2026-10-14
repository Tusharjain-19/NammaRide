/**
 * NammaRide — Intelligent Storage & Cache Manager
 * Separates permanent user data from disposable cache with TTL eviction.
 */

const PERMANENT_KEYS = new Set([
    'nammaride_fav_routes',
    'nammaride_fav_stations',
    'nammaride_theme',
    'nammaride_lang',
    'nammaride_app_theme',
    'appTheme'
]);

const CACHE_PREFIX = 'nammaride_cache_';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const StorageManager = {
    /**
     * Retrieve a value from storage safely.
     * Automatically handles JSON decoding and expiration checks.
     */
    getItem(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultValue;

            // Check if stored with metadata wrapper
            let parsed;
            try {
                parsed = JSON.parse(raw);
            } catch (e) {
                return raw; // Return raw string if not JSON
            }

            if (parsed && typeof parsed === 'object' && parsed.__nammaride_wrapped) {
                if (parsed.expiry && Date.now() > parsed.expiry) {
                    localStorage.removeItem(key);
                    return defaultValue;
                }
                return parsed.data !== undefined ? parsed.data : defaultValue;
            }

            return parsed !== undefined ? parsed : defaultValue;
        } catch (err) {
            console.warn('[StorageManager] getItem error for key:', key, err);
            return defaultValue;
        }
    },

    /**
     * Store a value safely with optional TTL (time-to-live in ms).
     */
    setItem(key, value, ttlMs = null) {
        try {
            let payload;
            if (ttlMs !== null && typeof ttlMs === 'number') {
                payload = JSON.stringify({
                    __nammaride_wrapped: true,
                    data: value,
                    expiry: Date.now() + ttlMs,
                    savedAt: Date.now()
                });
            } else {
                payload = typeof value === 'string' ? value : JSON.stringify(value);
            }

            localStorage.setItem(key, payload);
            return true;
        } catch (err) {
            // Handle QuotaExceededError by evicting disposable cache
            if (err.name === 'QuotaExceededError' || err.code === 22) {
                console.warn('[StorageManager] Quota exceeded. Evicting temporary cache...');
                StorageManager.clearTemporaryCache();
                try {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    return true;
                } catch (retryErr) {
                    console.error('[StorageManager] Failed to store even after eviction:', retryErr);
                }
            }
            return false;
        }
    },

    /**
     * Remove a specific key safely.
     */
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {}
    },

    /**
     * Remove all expired entries across localStorage.
     */
    cleanExpiredEntries() {
        try {
            const now = Date.now();
            const keysToRemove = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                if (PERMANENT_KEYS.has(key)) continue;

                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) continue;
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.__nammaride_wrapped && parsed.expiry && now > parsed.expiry) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    // Not a wrapped JSON object, leave intact
                }
            }

            keysToRemove.forEach(k => localStorage.removeItem(k));
            if (keysToRemove.length > 0) {
                console.log(`[StorageManager] Cleaned ${keysToRemove.length} expired entries.`);
            }
        } catch (e) {
            console.warn('[StorageManager] cleanExpiredEntries error:', e);
        }
    },

    /**
     * Flushes temporary cache without ever touching user favourites or preferences.
     */
    clearTemporaryCache() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                // Protect permanent user data
                if (PERMANENT_KEYS.has(key)) continue;

                // Remove temporary caches, recent unpinned history, or wrapped cache objects
                if (key.startsWith(CACHE_PREFIX) || key === 'nammaride_recent_routes') {
                    keysToRemove.push(key);
                } else {
                    try {
                        const raw = localStorage.getItem(key);
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.__nammaride_wrapped) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {}
                }
            }

            keysToRemove.forEach(k => localStorage.removeItem(k));
            sessionStorage.clear();
            console.log(`[StorageManager] Cleared ${keysToRemove.length} temporary cache items.`);
            return true;
        } catch (e) {
            console.warn('[StorageManager] clearTemporaryCache error:', e);
            return false;
        }
    },

    /**
     * Calculates storage consumption in KB.
     */
    getStorageUsage() {
        try {
            let totalBytes = 0;
            let permBytes = 0;
            let tempBytes = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;
                const val = localStorage.getItem(key) || '';
                const size = (key.length + val.length) * 2; // UTF-16 bytes
                totalBytes += size;

                if (PERMANENT_KEYS.has(key)) {
                    permBytes += size;
                } else {
                    tempBytes += size;
                }
            }

            return {
                totalKB: (totalBytes / 1024).toFixed(2),
                permanentKB: (permBytes / 1024).toFixed(2),
                temporaryKB: (tempBytes / 1024).toFixed(2),
                itemCount: localStorage.length
            };
        } catch (e) {
            return { totalKB: '0', permanentKB: '0', temporaryKB: '0', itemCount: 0 };
        }
    },

    /**
     * Safe Favourite Routes Management (Permanent, Deduplicated & Validated)
     */
    getFavoriteRoutes() {
        const raw = StorageManager.getItem('nammaride_fav_routes', []);
        if (!Array.isArray(raw)) return [];

        // Validate and deduplicate entries
        const seen = new Set();
        const valid = [];

        for (const item of raw) {
            if (!item || !item.startId || !item.endId) continue;
            const normKey = [item.startId, item.endId].sort().join('__');
            if (seen.has(normKey)) continue;
            seen.add(normKey);
            valid.push({
                startId: String(item.startId),
                endId: String(item.endId),
                startName: item.startName || item.startId,
                endName: item.endName || item.endId,
                timestamp: item.timestamp || Date.now()
            });
        }
        return valid;
    },

    saveFavoriteRoutes(favs) {
        if (!Array.isArray(favs)) return false;
        // Keep maximum 12 favourites to prevent runaway storage
        const trimmed = favs.slice(0, 12);
        return StorageManager.setItem('nammaride_fav_routes', trimmed);
    },

    isRouteFavorite(startId, endId) {
        if (!startId || !endId) return false;
        const favs = StorageManager.getFavoriteRoutes();
        return favs.some(f => 
            (f.startId === startId && f.endId === endId) || 
            (f.startId === endId && f.endId === startId)
        );
    },

    toggleFavoriteRoute(startId, endId, startName, endName) {
        if (!startId || !endId) return false;
        let favs = StorageManager.getFavoriteRoutes();
        const existingIdx = favs.findIndex(f => 
            (f.startId === startId && f.endId === endId) || 
            (f.startId === endId && f.endId === startId)
        );

        let isAdded = false;
        if (existingIdx >= 0) {
            favs.splice(existingIdx, 1);
            isAdded = false;
        } else {
            favs.unshift({
                startId,
                endId,
                startName: startName || startId,
                endName: endName || endId,
                timestamp: Date.now()
            });
            isAdded = true;
        }

        StorageManager.saveFavoriteRoutes(favs);
        return isAdded;
    },

    /**
     * Migrate older storage schemas seamlessly on startup.
     */
    migrateExistingData() {
        try {
            // Clean any expired entries automatically
            StorageManager.cleanExpiredEntries();

            // Validate and resave favorites to ensure normalized schema
            const favs = StorageManager.getFavoriteRoutes();
            StorageManager.saveFavoriteRoutes(favs);
        } catch (e) {
            console.warn('[StorageManager] Migration check error:', e);
        }
    }
};

// Global attachment for non-module script interop
if (typeof window !== 'undefined') {
    window.NammaStorage = StorageManager;
}
