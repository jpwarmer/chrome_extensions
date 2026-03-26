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
            "La extensión se recargó o actualizó. Recarga esta pestaña (F5) y vuelve a abrir el panel.",
        errorPrefix: "Error:",
        errorNoActiveTab: "No hay pestaña activa.",
        errorNoPageAccess: "No se pudo acceder al contenido de la página.",
        pageContentErrorTimeout:
            "No se pudo obtener respuesta. Por favor, intente nuevamente más tarde.",
        pageContentErrorShort:
            "No se encontró suficiente contenido para analizar en esta página.",
        pageContentErrorProcess:
            "Error al procesar el contenido. Por favor, intente nuevamente más tarde.",
        aiPromptIntro:
            "Analiza el siguiente contenido web y proporciona tres secciones en español:",
        aiLine1: "1. RESUMEN: Un resumen conciso del contenido principal",
        aiLine2Prefix: "2. ANÁLISIS:",
        aiLine3: "3. COMENTARIOS: Un resumen de los puntos clave de los comentarios (si hay)",
        aiUrlLabel: "URL:",
        aiMainContentLabel: "CONTENIDO PRINCIPAL:",
        aiCommentsLabel: "COMENTARIOS:",
        aiNoComments: "No hay comentarios disponibles",
        aiLine2Gemini:
            "Un análisis en busca de sesgos (políticos, sociales, etc.), también advierte si crees que hay desinformación, propaganda o información controvertida.",
        aiLine2OpenAI: "Un análisis del estilo de escritura y posible sesgo.",
        aiOpenAIFormatHint:
            "Por favor, asegúrate de mantener el formato exacto con los números y títulos de sección.",
        aiLine2Claude:
            "Un análisis del estilo de escritura, posible sesgo y tono; señala si detectas desinformación o argumentación muy sesgada.",
        aiClaudeFormatHint:
            "Mantén el formato exacto con 1. RESUMEN, 2. ANÁLISIS y 3. COMENTARIOS y títulos en mayúsculas.",
        aiOpenAISystem:
            "Eres un asistente que analiza contenido web y proporciona resúmenes estructurados claros. Siempre mantienes el formato exacto con números y títulos de sección.",
        aiClaudeSystem:
            "Eres un asistente que analiza páginas web y devuelve tres secciones numeradas en español. Usa siempre el formato: 1. RESUMEN:, 2. ANÁLISIS:, 3. COMENTARIOS:.",
        aiErrOpenAI429:
            "Cuota o límite de uso de OpenAI alcanzado (429). Revisa facturación en platform.openai.com o prueba Google Gemini en el selector.",
        aiErrOpenAI401:
            "API key de OpenAI inválida o sin permiso. Comprueba la clave en platform.openai.com.",
        aiErrOpenAI403:
            "OpenAI rechazó la petición (403). Revisa el estado de la cuenta o restricciones del proyecto.",
        aiErrOpenAIPrefix: "OpenAI:",
        aiErrOpenAIHttp: "Error de OpenAI (HTTP {status}).",
        aiErrAnthropic429:
            "Cuota o límite de Anthropic alcanzado (429). Revisa facturación en console.anthropic.com.",
        aiErrAnthropic401: "API key de Anthropic inválida. Crea una clave en console.anthropic.com.",
        aiErrAnthropic403:
            "Anthropic rechazó la petición (403). Revisa permisos del proyecto o región.",
        aiErrAnthropicPrefix: "Claude:",
        aiErrAnthropicHttp: "Error de Anthropic (HTTP {status}).",
        aiErrGeminiPrefix: "Gemini:",
        aiErrGeminiReject: "Gemini rechazó la petición (HTTP {status}).",
        aiErrGeminiBlock:
            "Gemini bloqueó el contenido ({reason}). Prueba otra página o acorta el texto.",
        aiErrFinishReasonNoText: "sin texto",
        aiErrGeminiNoText:
            "Gemini no devolvió texto útil ({reason}). Revisa la clave en Google AI Studio o prueba más tarde.",
        aiErrGeminiNetwork:
            "No se pudo conectar con Gemini. Comprueba red, bloqueadores o que generativelanguage.googleapis.com no esté bloqueado.",
        aiErrOpenAIInvalidFormat: "Formato de respuesta inválido de OpenAI.",
        aiErrOpenAINetwork:
            "No se pudo conectar con OpenAI (red bloqueada o sin conexión). Si en consola aparece ERR_BLOCKED_BY_CLIENT, suele ser un bloqueador (uBlock, Privacy Badger, Brave Shields): permite api.openai.com o desactívalo al probar la extensión.",
        aiErrClaudeNoText:
            "Claude no devolvió texto. Revisa la clave en console.anthropic.com o el modelo.",
        aiErrAnthropicNetwork:
            "No se pudo conectar con Anthropic. Comprueba red, bloqueadores o que api.anthropic.com no esté bloqueado.",
        aiParseNoSummary: "No se pudo extraer el resumen.",
        aiParseNoAnalysis: "No se pudo extraer el análisis.",
        aiParseNoComments: "No se encontraron comentarios para analizar.",
        aiInsufficientSummary: "No hay suficiente contenido para analizar.",
        aiInsufficientAnalysis: "No se puede realizar un análisis sin contenido suficiente.",
        aiInsufficientCommentsWithComments:
            "Hay comentarios pero no hay contenido principal para contextualizar.",
        aiInsufficientCommentsNone: "No hay comentarios disponibles."
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
            "The extension was reloaded or updated. Reload this tab (F5) and open the panel again.",
        errorPrefix: "Error:",
        errorNoActiveTab: "No active tab.",
        errorNoPageAccess: "Could not access the page content.",
        pageContentErrorTimeout:
            "Could not get a response. Please try again later.",
        pageContentErrorShort:
            "Not enough content on this page to analyze.",
        pageContentErrorProcess:
            "Error while processing the content. Please try again later.",
        aiPromptIntro:
            "Analyze the following web content and provide three sections in English:",
        aiLine1: "1. SUMMARY: A concise summary of the main content",
        aiLine2Prefix: "2. ANALYSIS:",
        aiLine3: "3. COMMENTS: A summary of key points from the comments (if any)",
        aiUrlLabel: "URL:",
        aiMainContentLabel: "MAIN CONTENT:",
        aiCommentsLabel: "COMMENTS:",
        aiNoComments: "No comments available",
        aiLine2Gemini:
            "An analysis that looks for bias (political, social, etc.) and flags whether you believe there is misinformation, propaganda, or controversial material.",
        aiLine2OpenAI: "An analysis of writing style and possible bias.",
        aiOpenAIFormatHint:
            "Please keep the exact format with numbered sections and headings.",
        aiLine2Claude:
            "An analysis of writing style, possible bias, and tone; flag clear misinformation or heavily biased argumentation.",
        aiClaudeFormatHint:
            "Keep the exact format with 1. SUMMARY, 2. ANALYSIS, and 3. COMMENTS and uppercase titles.",
        aiOpenAISystem:
            "You are an assistant that analyzes web content and provides clear structured summaries. You always keep the exact format with numbers and section titles.",
        aiClaudeSystem:
            "You are an assistant that analyzes web pages and returns three numbered sections in English. Always use the format: 1. SUMMARY:, 2. ANALYSIS:, 3. COMMENTS:.",
        aiErrOpenAI429:
            "OpenAI quota or rate limit reached (429). Check billing at platform.openai.com or try Google Gemini in the selector.",
        aiErrOpenAI401:
            "Invalid or unauthorized OpenAI API key. Check your key at platform.openai.com.",
        aiErrOpenAI403:
            "OpenAI rejected the request (403). Check account status or project restrictions.",
        aiErrOpenAIPrefix: "OpenAI:",
        aiErrOpenAIHttp: "OpenAI error (HTTP {status}).",
        aiErrAnthropic429:
            "Anthropic quota or rate limit reached (429). Check billing at console.anthropic.com.",
        aiErrAnthropic401: "Invalid Anthropic API key. Create a key at console.anthropic.com.",
        aiErrAnthropic403:
            "Anthropic rejected the request (403). Check project permissions or region.",
        aiErrAnthropicPrefix: "Claude:",
        aiErrAnthropicHttp: "Anthropic error (HTTP {status}).",
        aiErrGeminiPrefix: "Gemini:",
        aiErrGeminiReject: "Gemini rejected the request (HTTP {status}).",
        aiErrGeminiBlock:
            "Gemini blocked the content ({reason}). Try another page or shorten the text.",
        aiErrFinishReasonNoText: "no text",
        aiErrGeminiNoText:
            "Gemini did not return useful text ({reason}). Check your key in Google AI Studio or try again later.",
        aiErrGeminiNetwork:
            "Could not connect to Gemini. Check your network, blockers, or that generativelanguage.googleapis.com is not blocked.",
        aiErrOpenAIInvalidFormat: "Invalid response format from OpenAI.",
        aiErrOpenAINetwork:
            "Could not connect to OpenAI (blocked network or offline). If the console shows ERR_BLOCKED_BY_CLIENT, it is often a blocker (uBlock, Privacy Badger, Brave Shields): allow api.openai.com or disable it while testing the extension.",
        aiErrClaudeNoText:
            "Claude returned no text. Check your key at console.anthropic.com or the model.",
        aiErrAnthropicNetwork:
            "Could not connect to Anthropic. Check your network, blockers, or that api.anthropic.com is not blocked.",
        aiParseNoSummary: "Could not extract the summary.",
        aiParseNoAnalysis: "Could not extract the analysis.",
        aiParseNoComments: "No comments were found to analyze.",
        aiInsufficientSummary: "Not enough content to analyze.",
        aiInsufficientAnalysis: "Cannot analyze without enough main content.",
        aiInsufficientCommentsWithComments:
            "There are comments but not enough main content to contextualize them.",
        aiInsufficientCommentsNone: "No comments available."
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