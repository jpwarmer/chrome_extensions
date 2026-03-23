// Funciones de utilidad para el manejo del idioma
function getBrowserLanguage() {
    const language = navigator.language.split('-')[0];
    return ['en', 'es'].includes(language) ? language : 'en';
}

/** Quita #fragmento y unifica la URL para usarla como clave de caché. */
function normalizePageUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    try {
        const u = new URL(url);
        u.hash = '';
        return u.href;
    } catch {
        return url;
    }
}

// Clase StorageManager global
class StorageManager {
    static async getLanguage() {
        if (!chrome?.storage?.local) {
            return getBrowserLanguage();
        }
        
        return new Promise((resolve) => {
            chrome.storage.local.get(['preferredLanguage'], (result) => {
                resolve(result.preferredLanguage || getBrowserLanguage());
            });
        });
    }

    static async setLanguage(language) {
        if (!chrome?.storage?.local) {
            return;
        }
        
        return new Promise((resolve) => {
            chrome.storage.local.set({ preferredLanguage: language }, resolve);
        });
    }

    static async getApiKeys() {
        if (!chrome?.storage?.local) {
            return {};
        }
        
        return new Promise((resolve) => {
            chrome.storage.local.get(['apiKeys'], (result) => {
                resolve(result.apiKeys || {});
            });
        });
    }

    static async getCurrentModel() {
        if (!chrome?.storage?.local) {
            return 'gemini';
        }
        
        return new Promise((resolve) => {
            chrome.storage.local.get(['currentModel'], (result) => {
                resolve(result.currentModel || 'gemini');
            });
        });
    }

    /**
     * Resultados guardados por URL + modelo: evita repetir la llamada a la IA al reabrir el popup.
     * Estructura: pageAnalysisCache[normalizedUrl][model] = { summary, analysis, commentsSummary, url, savedAt }
     */
    static async getPageAnalysisCache(pageUrl, model) {
        if (!chrome?.storage?.local || !pageUrl || !model) {
            return null;
        }
        const key = normalizePageUrl(pageUrl);
        if (!key) {
            return null;
        }
        return new Promise((resolve) => {
            chrome.storage.local.get(['pageAnalysisCache'], (result) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                    return;
                }
                const cache = result.pageAnalysisCache || {};
                const row = cache[key];
                if (!row || typeof row !== 'object') {
                    resolve(null);
                    return;
                }
                const entry = row[model];
                if (!entry || typeof entry.summary !== 'string') {
                    resolve(null);
                    return;
                }
                resolve(entry);
            });
        });
    }

    static async setPageAnalysisCache(pageUrl, model, payload) {
        if (!chrome?.storage?.local || !pageUrl || !model || !payload) {
            return;
        }
        const key = normalizePageUrl(pageUrl);
        if (!key) {
            return;
        }
        return new Promise((resolve) => {
            chrome.storage.local.get(['pageAnalysisCache'], (result) => {
                if (chrome.runtime.lastError) {
                    resolve();
                    return;
                }
                const cache = { ...(result.pageAnalysisCache || {}) };
                if (!cache[key] || typeof cache[key] !== 'object') {
                    cache[key] = {};
                }
                cache[key] = {
                    ...cache[key],
                    [model]: {
                        summary: payload.summary,
                        analysis: payload.analysis,
                        commentsSummary: payload.commentsSummary,
                        url: payload.url || key,
                        savedAt: Date.now()
                    }
                };
                chrome.storage.local.set({ pageAnalysisCache: cache }, resolve);
            });
        });
    }
}

// Hacer StorageManager disponible globalmente
window.StorageManager = StorageManager; 