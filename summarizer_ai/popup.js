document.addEventListener("DOMContentLoaded", async () => {
    // Elementos del DOM - con verificación de existencia
    const elements = {
        apiKeyInput: document.getElementById('apiKey'),
        modelSelect: document.getElementById('modelSelect'),
        saveKeyButton: document.getElementById('saveKey'),
        summarizeButton: document.getElementById('summarize'),
        changeKeyButton: document.getElementById('changeKey'),
        apiKeyDiv: document.getElementById('apiKeyInput'),
        modelInfo: document.getElementById('modelInfo'),
        summaryDiv: document.getElementById('summary'),
        analysisDiv: document.getElementById('analysis'),
        commentsDiv: document.getElementById('comments'),
        urlDiv: document.getElementById('url'),
        loader: document.getElementById('loader'),
        languageSelect: document.getElementById('languageSelect'),
        sections: {
            summary: {
                content: document.querySelector('#summary .section-content'),
                header: document.querySelector('#summary .section-header')
            },
            analysis: {
                content: document.querySelector('#analysis .section-content'),
                header: document.querySelector('#analysis .section-header')
            },
            comments: {
                content: document.querySelector('#comments .section-content'),
                header: document.querySelector('#comments .section-header')
            },
            url: {
                content: document.querySelector('#url .section-content'),
                header: document.querySelector('#url .section-header')
            }
        }
    };

    // Verificar elementos críticos
    const criticalElements = ['apiKeyInput', 'modelSelect', 'saveKeyButton', 'summarizeButton', 'languageSelect'];
    for (const elementId of criticalElements) {
        if (!elements[elementId]) {
            console.error(`Critical element missing: ${elementId}`);
            return;
        }
    }

    function setLoading(isLoading) {
        if (elements.loader) {
            elements.loader.style.display = isLoading ? "block" : "none";
        }
        if (elements.summarizeButton) {
            elements.summarizeButton.disabled = isLoading;
            const t = window.translations[elements.languageSelect.value];
            elements.summarizeButton.textContent = isLoading ? t.processingText : t.summarizeButton;
        }
    }

    // Esperar a que las traducciones estén disponibles
    const waitForTranslations = () => {
        return new Promise((resolve) => {
            if (window.translations) {
                resolve();
            } else {
                setTimeout(() => waitForTranslations().then(resolve), 50);
            }
        });
    };

    await waitForTranslations();

    // Cargar idioma guardado
    const savedLanguage = await window.StorageManager.getLanguage();
    elements.languageSelect.value = savedLanguage || 'es';
    updateTranslations(elements.languageSelect.value);

    // Cargar configuración guardada
    chrome.storage.local.get(['apiKeys', 'currentModel'], (result) => {
        const apiKeys = result.apiKeys || {};
        const currentModel = result.currentModel || 'gemini';
        
        elements.modelSelect.value = currentModel;
        if (apiKeys[currentModel]) {
            elements.apiKeyDiv.style.display = 'none';
            elements.changeKeyButton.style.display = 'inline-block';
            elements.apiKeyInput.value = apiKeys[currentModel];
            updateModelInfo(currentModel);
        } else {
            elements.apiKeyDiv.style.display = 'block';
            elements.changeKeyButton.style.display = 'none';
            elements.apiKeyInput.value = ''; // Limpiar el input si no hay key para este modelo
        }
    });

    // Event Listeners
    elements.modelSelect.addEventListener('change', (e) => {
        const selectedModel = e.target.value;
        
        // Solo cargar la API key correspondiente, sin actualizar el indicador
        chrome.storage.local.get(['apiKeys'], (result) => {
            const apiKeys = result.apiKeys || {};
            if (apiKeys[selectedModel]) {
                elements.apiKeyInput.value = apiKeys[selectedModel];
                elements.apiKeyDiv.style.display = 'none';
                elements.changeKeyButton.style.display = 'inline-block';
            } else {
                elements.apiKeyInput.value = '';
                elements.apiKeyDiv.style.display = 'block';
                elements.changeKeyButton.style.display = 'none';
            }
        });
    });

    elements.saveKeyButton.addEventListener('click', () => {
        const apiKey = elements.apiKeyInput.value.trim();
        const model = elements.modelSelect.value;
        
        if (!apiKey) {
            alert('Por favor, ingresa una API Key válida');
            return;
        }

        chrome.storage.local.get(['apiKeys'], (result) => {
            const apiKeys = result.apiKeys || {};
            apiKeys[model] = apiKey;
            
            chrome.storage.local.set({
                apiKeys: apiKeys,
                currentModel: model
            }, () => {
                elements.apiKeyDiv.style.display = 'none';
                elements.changeKeyButton.style.display = 'inline-block';
                updateModelInfo(model);
                alert('¡Configuración guardada!');
            });
        });
    });

    elements.changeKeyButton.addEventListener('click', () => {
        elements.apiKeyDiv.style.display = 'block';
        elements.changeKeyButton.style.display = 'none';
    });

    elements.summarizeButton.addEventListener('click', async () => {
        try {
            setLoading(true);
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, async (response) => {
                if (!response) {
                    setLoading(false);
                    elements.summaryDiv.textContent = "Error: No se pudo acceder al contenido de la página.";
                    elements.analysisDiv.textContent = "No disponible";
                    elements.commentsDiv.textContent = "No disponible";
                    return;
                }

                if (response.error) {
                    setLoading(false);
                    elements.summaryDiv.textContent = response.error;
                    elements.analysisDiv.textContent = "No disponible";
                    elements.commentsDiv.textContent = "No disponible";
                    elements.urlDiv.textContent = response.url;
                    return;
                }

                const { content, comments, url } = response;
                elements.urlDiv.textContent = url;

                chrome.storage.local.get(['apiKeys', 'currentModel'], async (result) => {
                    const currentModel = result.currentModel || 'gemini';
                    const apiKeys = result.apiKeys || {};
                    const apiKey = apiKeys[currentModel];

                    if (!apiKey) {
                        setLoading(false);
                        alert('Por favor, ingresa tu API Key.');
                        return;
                    }

                    try {
                        const aiService = new window.AIService(currentModel, apiKey);
                        const analysis = await aiService.analyze(content, comments, url);
                        
                        // Actualizar solo el contenido manteniendo los títulos
                        elements.sections.summary.content.textContent = analysis.summary;
                        elements.sections.analysis.content.textContent = analysis.analysis;
                        elements.sections.comments.content.textContent = analysis.commentsSummary;
                        elements.sections.url.content.textContent = url;
                    } catch (error) {
                        elements.sections.summary.content.textContent = 'Error: ' + error.message;
                        elements.sections.analysis.content.textContent = 'No disponible';
                        elements.sections.comments.content.textContent = 'No disponible';
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                });
            });
        } catch (error) {
            console.error('Error:', error);
            elements.summaryDiv.textContent = 'Error: ' + error.message;
            setLoading(false);
        }
    });

    function updateModelInfo(model) {
        const modelInfoText = {
            'gemini': '🤖 Google Gemini (Gratuito)',
            'openai': '💰 OpenAI GPT-3.5 (Pago)'
        };
        elements.modelInfo.textContent = modelInfoText[model] || '';
    }

    // Event listener para cambio de idioma
    elements.languageSelect.addEventListener('change', async (e) => {
        const newLanguage = e.target.value;
        await window.StorageManager.setLanguage(newLanguage);
        updateTranslations(newLanguage);
    });

    function updateTranslations(language) {
        if (!window.translations || !window.translations[language]) {
            console.error('Translations not available');
            return;
        }

        const t = window.translations[language];
        
        // Actualizar todos los textos traducibles
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });

        // Actualizar placeholders y textos
        if (elements.apiKeyInput) elements.apiKeyInput.placeholder = t.apiKeyPlaceholder;
        if (elements.saveKeyButton) elements.saveKeyButton.textContent = t.saveButton;
        if (elements.summarizeButton) elements.summarizeButton.textContent = t.summarizeButton;
        if (elements.changeKeyButton) elements.changeKeyButton.textContent = t.changeKeyButton;

        // Actualizar opciones del modelo
        if (elements.modelSelect?.options) {
            elements.modelSelect.options[0].text = t.modelGemini;
            elements.modelSelect.options[1].text = t.modelOpenAI;
        }

        // Actualizar placeholders de resultados
        Object.keys(elements.sections).forEach(section => {
            const sectionElement = elements.sections[section];
            if (sectionElement?.content && isDefaultPlaceholder(sectionElement.content.textContent)) {
                sectionElement.content.textContent = t[`${section}Placeholder`];
            }
        });
    }

    function isDefaultPlaceholder(text) {
        if (!text) return true;
        const defaultTexts = [
            window.translations.es?.summaryPlaceholder,
            window.translations.en?.summaryPlaceholder,
            window.translations.es?.analysisPlaceholder,
            window.translations.en?.analysisPlaceholder,
            window.translations.es?.commentsPlaceholder,
            window.translations.en?.commentsPlaceholder,
            window.translations.es?.urlPlaceholder,
            window.translations.en?.urlPlaceholder,
            "El resumen aparecerá aquí...",
            "Summary will appear here...",
            "El análisis aparecerá aquí...",
            "Analysis will appear here...",
            "El resumen de comentarios aparecerá aquí...",
            "Comments summary will appear here...",
            "La URL aparecerá aquí...",
            "URL will appear here..."
        ];
        return defaultTexts.includes(text);
    }

    // Agregar manejador para el botón de cerrar
    document.getElementById('closeButton').addEventListener('click', () => {
        window.parent.postMessage('closeModal', '*');
    });
});
