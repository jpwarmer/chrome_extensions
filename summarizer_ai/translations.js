// Definir las traducciones como variable global
window.translations = {
    es: {
        title: "TL;DR.ai (Too Long; Didn't Read + AI)",  // Too Long; Didn't Read + AI
        tagline: "Lectura inteligente en un clic",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Ingresa tu API key",
        saveButton: "Guardar",
        summarizeButton: "Resumir",
        changeKeyButton: "Cambiar modelo",
        settingsExpandCta: "Modelo y clave API",
        settingsExpandAria: "Mostrar configuración de modelo y clave API",
        donateLink: "Donar",
        donateAria: "Apoyar el proyecto (donación) — se abre en una pestaña nueva",
        resultsRegionAria: "Salida del análisis",
        summaryTitle: "Resumen:",
        analysisTitle: "Análisis:",
        commentsTitle: "Comentarios:",
        urlTitle: "URL:",
        summaryPlaceholder: "El resumen aparecerá aquí...",
        analysisPlaceholder: "El análisis aparecerá aquí...",
        commentsPlaceholder: "El resumen de comentarios aparecerá aquí...",
        urlPlaceholder: "La URL aparecerá aquí...",
        modelLabel: "Modelo",
        modelGemini: "Google Gemini 3.1 Flash Lite",
        modelOpenAI: "OpenAI GPT-3.5 (Pago)",
        modelClaude: "Anthropic Claude (API)",
        settingsSaved: "¡Configuración guardada!",
        errorInvalidKey: "Por favor, ingresa una API Key válida",
        errorNoKey: "Por favor, ingresa tu API Key.",
        errorProcessing: "Error al procesar el contenido:",
        languageSelect: "Idioma:",
        processingText: "Procesando...",
        noContentError: "No se encontró suficiente contenido para analizar.",
        languages: {
            es: "Español",
            en: "English"
        },
        notAvailable: "No disponible",
        closeAria: "Cerrar panel",
        errorExtensionContext:
            "La extensión se recargó o actualizó. Recarga esta pestaña (F5) y vuelve a abrir el panel."
    },
    en: {
        title: "TL;DR.ai (Too Long; Didn't Read + AI)",  // Funciona igual en ambos idiomas
        tagline: "Smarter reading in one click",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Enter your API key",
        saveButton: "Save",
        summarizeButton: "Summarize",
        changeKeyButton: "Change model",
        settingsExpandCta: "Model & API key",
        settingsExpandAria: "Show model and API key settings",
        donateLink: "Donate",
        donateAria: "Support the project (donation) — opens in a new tab",
        resultsRegionAria: "Analysis output",
        summaryTitle: "Summary:",
        analysisTitle: "Analysis:",
        commentsTitle: "Comments:",
        urlTitle: "URL:",
        summaryPlaceholder: "Summary will appear here...",
        analysisPlaceholder: "Analysis will appear here...",
        commentsPlaceholder: "Comments summary will appear here...",
        urlPlaceholder: "URL will appear here...",
        modelLabel: "Model",
        modelGemini: "Google Gemini 3.1 Flash Lite",
        modelOpenAI: "OpenAI GPT-3.5 (Paid)",
        modelClaude: "Anthropic Claude (API)",
        settingsSaved: "Settings saved!",
        errorInvalidKey: "Please enter a valid API Key",
        errorNoKey: "Please enter your API Key.",
        errorProcessing: "Error processing content:",
        languageSelect: "Language:",
        processingText: "Processing...",
        noContentError: "Not enough content found to analyze.",
        languages: {
            es: "Spanish",
            en: "English"
        },
        notAvailable: "N/A",
        closeAria: "Close panel",
        errorExtensionContext:
            "The extension was reloaded or updated. Reload this tab (F5) and open the panel again."
    }
};

function getBrowserLanguage() {
    const language = navigator.language.split('-')[0];
    return ['en', 'es'].includes(language) ? language : 'en';
}

function isExtensionContext() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

function getUserLanguage() {
    if (isExtensionContext() && chrome.storage) {
        return new Promise((resolve) => {
            chrome.storage.local.get(['preferredLanguage'], (result) => {
                resolve(result.preferredLanguage || getBrowserLanguage());
            });
        });
    }
    return Promise.resolve(getBrowserLanguage());
}

function setUserLanguage(language) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ preferredLanguage: language }, resolve);
        });
    }
    return Promise.resolve();
}

async function getTranslation(key, language = null) {
    const userLang = language || await getUserLanguage();
    return window.translations[userLang]?.[key] || window.translations.en[key];
} 