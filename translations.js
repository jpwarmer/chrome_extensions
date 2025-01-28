import { getBrowserLanguage } from './language-utils.js';

export const translations = {
    es: {
        title: "Resumidor de Contenido",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Ingresa tu API key",
        saveButton: "Guardar",
        summarizeButton: "Resumir",
        changeKeyButton: "Seleccionar Modelo",
        resultsTitle: "Resultados",
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
        languages: {
            es: "Español",
            en: "Inglés"
        },
        processingText: "Procesando..."
    },
    en: {
        title: "Content Summarizer",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Enter your API key",
        saveButton: "Save",
        summarizeButton: "Summarize",
        changeKeyButton: "Select Model",
        resultsTitle: "Results",
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
        languages: {
            es: "Spanish",
            en: "English"
        },
        processingText: "Processing..."
    }
};

export function getTranslation(key, language = getBrowserLanguage()) {
    return translations[language]?.[key] || translations.en[key];
} 