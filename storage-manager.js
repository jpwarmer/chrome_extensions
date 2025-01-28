import { getBrowserLanguage } from './language-utils.js';

export class StorageManager {
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
} 