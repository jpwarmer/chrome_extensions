document.addEventListener("DOMContentLoaded", async () => {
    // Elementos del DOM - con verificación de existencia
    const elements = {
        apiKeyInput: document.getElementById('apiKey'),
        modelSelect: document.getElementById('modelSelect'),
        saveKeyButton: document.getElementById('saveKey'),
        summarizeButton: document.getElementById('summarize'),
        changeKeyButton: document.getElementById('changeKey'),
        apiKeyDiv: document.getElementById('apiKeyInput'),
        loader: document.getElementById('loader'),
        languageSelect: document.getElementById('languageSelect'),
        settingsExpandedBody: document.getElementById('settingsExpandedBody'),
        settingsExpandToggle: document.getElementById('settingsExpandToggle'),
        settingsModelSummary: document.getElementById('settingsModelSummary'),
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

    /** Textos del idioma seleccionado en el selector. */
    function t() {
        return window.translations[elements.languageSelect.value];
    }

    /**
     * Escribe en las áreas de resultado sin tocar cabeceras (.section-header).
     * @param {string} [url] - Si se omite, la fila URL no se modifica.
     */
    function fillResultSections(summary, analysis, comments, url) {
        elements.sections.summary.content.textContent = summary;
        elements.sections.analysis.content.textContent = analysis;
        elements.sections.comments.content.textContent = comments;
        if (url !== undefined) {
            elements.sections.url.content.textContent = url;
        }
    }

    function resetResultPlaceholders() {
        const lang = elements.languageSelect.value;
        const tr = window.translations[lang];
        if (!tr) {
            return;
        }
        elements.sections.summary.content.textContent = tr.summaryPlaceholder;
        elements.sections.analysis.content.textContent = tr.analysisPlaceholder;
        elements.sections.comments.content.textContent = tr.commentsPlaceholder;
        elements.sections.url.content.textContent = tr.urlPlaceholder;
    }

    /**
     * Solo persistir resultados válidos: no errores de API ni respuestas sustitutas sin análisis real.
     */
    function shouldPersistAnalysis(analysis) {
        if (!analysis || typeof analysis.summary !== 'string') {
            return false;
        }
        const s = analysis.summary.trim();
        const low = s.toLowerCase();
        if (low.startsWith('error:')) {
            return false;
        }
        const insEs = window.translations.es?.aiInsufficientSummary;
        const insEn = window.translations.en?.aiInsufficientSummary;
        if (insEs && s.includes(insEs)) {
            return false;
        }
        if (insEn && s.includes(insEn)) {
            return false;
        }
        return true;
    }

    /** Si hay análisis guardado para esta pestaña y modelo, lo muestra; si no, placeholders. */
    async function loadCachedResultsForActiveTab() {
        try {
            if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
                return;
            }
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tab = tabs[0];
            if (!tab?.url) {
                return;
            }
            const u = tab.url;
            if (
                u.startsWith('chrome://') ||
                u.startsWith('chrome-extension://') ||
                u.startsWith('edge://') ||
                u.startsWith('about:')
            ) {
                resetResultPlaceholders();
                return;
            }
            const model = elements.modelSelect.value;
            const cached = await window.StorageManager.getPageAnalysisCache(u, model);
            if (cached) {
                fillResultSections(
                    cached.summary,
                    cached.analysis,
                    cached.commentsSummary,
                    cached.url || u
                );
            } else {
                resetResultPlaceholders();
            }
        } catch (e) {
            console.warn('loadCachedResultsForActiveTab', e);
        }
    }

    /** Muestra u oculta bloque de API key y botón «Cambiar modelo» (solo atributo hidden; cumple CSP). */
    function setKeyPanelState(showKeyBlock, showChangeKey) {
        if (elements.apiKeyDiv) {
            elements.apiKeyDiv.hidden = !showKeyBlock;
        }
        if (elements.changeKeyButton) {
            const collapsed = elements.settingsExpandedBody?.hidden;
            elements.changeKeyButton.hidden = collapsed ? true : !showChangeKey;
        }
    }

    function updateCollapsedModelSummary() {
        const sel = elements.modelSelect;
        const sum = elements.settingsModelSummary;
        if (!sel || !sum) {
            return;
        }
        const opt = sel.options[sel.selectedIndex];
        sum.textContent = opt ? ` — ${opt.text}` : '';
    }

    /**
     * @param {boolean} expanded - true = panel de configuración visible
     * @param {{ editKey?: boolean }} [opts] - si editKey, forzar fila de clave (botón «Cambiar modelo»)
     */
    function setSettingsExpanded(expanded, opts = {}) {
        if (elements.settingsExpandedBody) {
            elements.settingsExpandedBody.hidden = !expanded;
        }
        if (elements.settingsExpandToggle) {
            elements.settingsExpandToggle.hidden = expanded;
        }
        updateCollapsedModelSummary();

        if (expanded) {
            if (opts.editKey) {
                setKeyPanelState(true, false);
            } else {
                chrome.storage.local.get(['apiKeys'], (result) => {
                    if (chrome.runtime.lastError) {
                        return;
                    }
                    const apiKeys = result.apiKeys || {};
                    const m = elements.modelSelect.value;
                    if (apiKeys[m]) {
                        elements.apiKeyInput.value = apiKeys[m];
                        setKeyPanelState(false, true);
                    } else {
                        setKeyPanelState(true, false);
                    }
                });
            }
        } else if (elements.changeKeyButton) {
            elements.changeKeyButton.hidden = true;
        }
    }

    function setLoading(isLoading) {
        if (elements.loader) {
            elements.loader.hidden = !isLoading;
            elements.loader.setAttribute('aria-hidden', isLoading ? 'false' : 'true');
        }
        if (elements.summarizeButton) {
            elements.summarizeButton.disabled = isLoading;
            const tr = t();
            elements.summarizeButton.textContent = isLoading ? tr.processingText : tr.summarizeButton;
        }
    }

    // Esperar a que las traducciones estén disponibles
    const waitForTranslations = () =>
        new Promise((resolve) => {
            const poll = () => {
                if (window.translations) {
                    resolve();
                } else {
                    setTimeout(poll, 50);
                }
            };
            poll();
        });

    await waitForTranslations();

    // Cargar idioma guardado
    const savedLanguage = await window.StorageManager.getLanguage();
    elements.languageSelect.value = savedLanguage || 'es';
    updateTranslations(elements.languageSelect.value);

    // Cargar configuración guardada
    chrome.storage.local.get(['apiKeys', 'currentModel'], (result) => {
        if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
            return;
        }
        const apiKeys = result.apiKeys || {};
        const currentModel = result.currentModel || 'gemini';

        elements.modelSelect.value = currentModel;
        if (apiKeys[currentModel]) {
            setKeyPanelState(false, true);
            elements.apiKeyInput.value = apiKeys[currentModel];
        } else {
            setKeyPanelState(true, false);
            elements.apiKeyInput.value = '';
        }
        loadCachedResultsForActiveTab();
    });

    // Event Listeners
    elements.modelSelect.addEventListener('change', (e) => {
        const selectedModel = e.target.value;

        // Persistir el modelo activo para que «Resumir» use el mismo que el desplegable
        chrome.storage.local.set({ currentModel: selectedModel }, () => {
            if (chrome.runtime.lastError) {
                console.warn(chrome.runtime.lastError.message);
                return;
            }
            chrome.storage.local.get(['apiKeys'], (result) => {
                if (chrome.runtime.lastError) {
                    console.warn(chrome.runtime.lastError.message);
                    return;
                }
                const apiKeys = result.apiKeys || {};
                if (apiKeys[selectedModel]) {
                    elements.apiKeyInput.value = apiKeys[selectedModel];
                    setKeyPanelState(false, true);
                } else {
                    elements.apiKeyInput.value = '';
                    setKeyPanelState(true, false);
                }
                updateCollapsedModelSummary();
                loadCachedResultsForActiveTab();
            });
        });
    });

    elements.saveKeyButton.addEventListener('click', () => {
        const apiKey = elements.apiKeyInput.value.trim();
        const model = elements.modelSelect.value;
        
        if (!apiKey) {
            alert(t().errorInvalidKey);
            return;
        }

        chrome.storage.local.get(['apiKeys'], (result) => {
            const apiKeys = result.apiKeys || {};
            apiKeys[model] = apiKey;
            
            chrome.storage.local.set({
                apiKeys: apiKeys,
                currentModel: model
            }, () => {
                if (chrome.runtime.lastError) {
                    alert(chrome.runtime.lastError.message);
                    return;
                }
                setKeyPanelState(false, true);
                alert(t().settingsSaved);
            });
        });
    });

    elements.changeKeyButton.addEventListener('click', () => {
        setSettingsExpanded(true, { editKey: true });
    });

    elements.settingsExpandToggle?.addEventListener('click', () => {
        setSettingsExpanded(true);
    });

    elements.summarizeButton.addEventListener('click', async () => {
        try {
            setLoading(true);

            let tab;
            try {
                if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
                    throw new Error('NO_CHROME_TABS');
                }
                if (!chrome.runtime?.id) {
                    throw new Error('CONTEXT_INVALIDATED');
                }
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                tab = tabs[0];
            } catch (e) {
                setLoading(false);
                const msg =
                    e.message === 'CONTEXT_INVALIDATED' || e.message === 'NO_CHROME_TABS'
                        ? t().errorExtensionContext
                        : e.message || String(e);
                fillResultSections(`${t().errorPrefix} ${msg}`, t().notAvailable, t().notAvailable);
                return;
            }

            if (!tab?.id) {
                setLoading(false);
                fillResultSections(
                    `${t().errorPrefix} ${t().errorNoActiveTab}`,
                    t().notAvailable,
                    t().notAvailable
                );
                return;
            }

            chrome.tabs.sendMessage(
                tab.id,
                { action: 'getPageContent', locale: elements.languageSelect.value },
                async (response) => {
                const na = t().notAvailable;

                if (chrome.runtime.lastError) {
                    setLoading(false);
                    const errMsg = chrome.runtime.lastError.message;
                    const errLower = errMsg.toLowerCase();
                    const invalidated =
                        errLower.includes('extension context invalidated') ||
                        errLower.includes('message port closed') ||
                        errLower.includes('receiving end does not exist');
                    fillResultSections(
                        invalidated ? t().errorExtensionContext : `${t().errorPrefix} ${errMsg}`,
                        na,
                        na
                    );
                    return;
                }

                if (!response) {
                    setLoading(false);
                    fillResultSections(`${t().errorPrefix} ${t().errorNoPageAccess}`, na, na);
                    return;
                }

                if (response.error) {
                    setLoading(false);
                    fillResultSections(response.error, na, na, response.url);
                    return;
                }

                const { content, comments, url } = response;
                elements.sections.url.content.textContent = url;

                chrome.storage.local.get(['apiKeys', 'currentModel'], async (result) => {
                    if (chrome.runtime.lastError) {
                        setLoading(false);
                        fillResultSections(
                            `${t().errorPrefix} ${chrome.runtime.lastError.message}`,
                            na,
                            na
                        );
                        return;
                    }

                    const apiKeys = result.apiKeys || {};
                    const currentModel =
                        elements.modelSelect.value || result.currentModel || 'gemini';
                    const apiKey = apiKeys[currentModel];

                    if (!apiKey) {
                        setLoading(false);
                        alert(t().errorNoKey);
                        return;
                    }

                    setSettingsExpanded(false);

                    try {
                        const aiService = new window.AIService(
                            currentModel,
                            apiKey,
                            elements.languageSelect.value
                        );
                        const analysis = await aiService.analyze(content, comments, url);
                        fillResultSections(
                            analysis.summary,
                            analysis.analysis,
                            analysis.commentsSummary,
                            url
                        );
                        if (shouldPersistAnalysis(analysis)) {
                            await window.StorageManager.setPageAnalysisCache(url, currentModel, {
                                summary: analysis.summary,
                                analysis: analysis.analysis,
                                commentsSummary: analysis.commentsSummary,
                                url
                            });
                        }
                    } catch (error) {
                        const na = t().notAvailable;
                        fillResultSections(`${t().errorPrefix} ${error.message}`, na, na);
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                });
            });
        } catch (error) {
            console.error('Error:', error);
            fillResultSections(`${t().errorPrefix} ${error.message}`, t().notAvailable, t().notAvailable);
            setLoading(false);
        }
    });

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
        if (elements.apiKeyInput) {
            elements.apiKeyInput.placeholder = t.apiKeyPlaceholder;
            elements.apiKeyInput.setAttribute('aria-label', t.apiKeyLabel);
        }
        if (elements.saveKeyButton) elements.saveKeyButton.textContent = t.saveButton;
        if (elements.summarizeButton) elements.summarizeButton.textContent = t.summarizeButton;
        if (elements.changeKeyButton) elements.changeKeyButton.textContent = t.changeKeyButton;

        // Actualizar opciones del modelo
        if (elements.modelSelect?.options) {
            elements.modelSelect.options[0].text = t.modelGemini;
            elements.modelSelect.options[1].text = t.modelOpenAI;
            if (elements.modelSelect.options[2]) {
                elements.modelSelect.options[2].text = t.modelClaude;
            }
        }

        // Actualizar placeholders de resultados
        Object.keys(elements.sections).forEach(section => {
            const sectionElement = elements.sections[section];
            if (sectionElement?.content && isDefaultPlaceholder(sectionElement.content.textContent)) {
                sectionElement.content.textContent = t[`${section}Placeholder`];
            }
        });

        const closeBtn = document.getElementById('closeButton');
        if (closeBtn && t.closeAria) {
            closeBtn.setAttribute('aria-label', t.closeAria);
        }

        if (elements.settingsExpandToggle && t.settingsExpandAria) {
            elements.settingsExpandToggle.setAttribute('aria-label', t.settingsExpandAria);
        }

        const resultsPanel = document.getElementById('results');
        if (resultsPanel && t.resultsRegionAria) {
            resultsPanel.setAttribute('aria-label', t.resultsRegionAria);
        }

        const donateLink = document.getElementById('donateLink');
        if (donateLink && t.donateAria) {
            donateLink.setAttribute('aria-label', t.donateAria);
            donateLink.setAttribute('title', t.donateAria);
        }

        updateCollapsedModelSummary();
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
