// Definir las traducciones como variable global
window.translations = {
    es: {
        title: "TL;DR.ai (Too Long; Didn't Read + AI)",  // Too Long; Didn't Read + AI
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Ingresa tu API key",
        saveButton: "Guardar",
        summarizeButton: "Resumir",
        changeKeyButton: "Cambiar modelo",
        resultsTitle: "Resultados",
        summaryTitle: "Resumen:",
        analysisTitle: "Análisis:",
        commentsTitle: "Comentarios:",
        urlTitle: "URL:",
        summaryPlaceholder: "El resumen aparecerá aquí...",
        analysisPlaceholder: "El análisis aparecerá aquí...",
        commentsPlaceholder: "El resumen de comentarios aparecerá aquí...",
        urlPlaceholder: "La URL aparecerá aquí...",
        modelGemini: "Google Gemini (Gratuito)",
        modelOpenAI: "OpenAI GPT-3.5 (Pago)",
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
        summaryTitle: "Resumen:",
        analysisTitle: "Análisis:",
        commentsTitle: "Comentarios:",
        urlTitle: "URL:"
    },
    en: {
        title: "TL;DR.ai (Too Long; Didn't Read + AI)",  // Funciona igual en ambos idiomas
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Enter your API key",
        saveButton: "Save",
        summarizeButton: "Summarize",
        changeKeyButton: "Change model",
        resultsTitle: "Results",
        summaryTitle: "Summary:",
        analysisTitle: "Analysis:",
        commentsTitle: "Comments:",
        urlTitle: "URL:",
        summaryPlaceholder: "Summary will appear here...",
        analysisPlaceholder: "Analysis will appear here...",
        commentsPlaceholder: "Comments summary will appear here...",
        urlPlaceholder: "URL will appear here...",
        modelGemini: "Google Gemini (Free)",
        modelOpenAI: "OpenAI GPT-3.5 (Paid)",
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
        }
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
    return translations[userLang]?.[key] || translations.en[key];
} 