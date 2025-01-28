document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('modelSelect');
    const saveKeyButton = document.getElementById('saveKey');
    const summarizeButton = document.getElementById('summarize');
    const changeKeyButton = document.getElementById('changeKey');
    const apiKeyDiv = document.getElementById('apiKeyInput');
    const modelInfo = document.getElementById('modelInfo');
    const summaryDiv = document.getElementById('summary');
    const analysisDiv = document.getElementById('analysis');
    const commentsDiv = document.getElementById('comments');
    const urlDiv = document.getElementById('url');
    const loader = document.getElementById('loader');

    function setLoading(isLoading) {
        loader.style.display = isLoading ? "block" : "none";
        summarizeButton.disabled = isLoading;
        summarizeButton.textContent = isLoading ? "Procesando..." : "Resumir";
    }

    // Cargar configuración guardada
    chrome.storage.local.get(['apiKeys', 'currentModel'], (result) => {
        const apiKeys = result.apiKeys || {};
        const currentModel = result.currentModel || 'gemini';
        
        modelSelect.value = currentModel;
        if (apiKeys[currentModel]) {
            apiKeyDiv.style.display = 'none';
            changeKeyButton.style.display = 'inline-block';
            apiKeyInput.value = apiKeys[currentModel];
            updateModelInfo(currentModel);
        } else {
            apiKeyDiv.style.display = 'block';
            changeKeyButton.style.display = 'none';
            apiKeyInput.value = ''; // Limpiar el input si no hay key para este modelo
        }
    });

    // Event Listeners
    modelSelect.addEventListener('change', (e) => {
        const selectedModel = e.target.value;
        
        // Solo cargar la API key correspondiente, sin actualizar el indicador
        chrome.storage.local.get(['apiKeys'], (result) => {
            const apiKeys = result.apiKeys || {};
            if (apiKeys[selectedModel]) {
                apiKeyInput.value = apiKeys[selectedModel];
                apiKeyDiv.style.display = 'none';
                changeKeyButton.style.display = 'inline-block';
            } else {
                apiKeyInput.value = '';
                apiKeyDiv.style.display = 'block';
                changeKeyButton.style.display = 'none';
            }
        });
    });

    saveKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;
        
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
                apiKeyDiv.style.display = 'none';
                changeKeyButton.style.display = 'inline-block';
                updateModelInfo(model);
                alert('¡Configuración guardada!');
            });
        });
    });

    changeKeyButton.addEventListener('click', () => {
        apiKeyDiv.style.display = 'block';
        changeKeyButton.style.display = 'none';
    });

    summarizeButton.addEventListener('click', async () => {
        try {
            setLoading(true);
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, async (response) => {
                if (!response) {
                    setLoading(false);
                    summaryDiv.textContent = "Error: No se pudo acceder al contenido de la página.";
                    analysisDiv.textContent = "No disponible";
                    commentsDiv.textContent = "No disponible";
                    return;
                }

                if (response.error) {
                    setLoading(false);
                    summaryDiv.textContent = response.error;
                    analysisDiv.textContent = "No disponible";
                    commentsDiv.textContent = "No disponible";
                    urlDiv.textContent = response.url;
                    return;
                }

                const { content, comments, url } = response;
                urlDiv.textContent = url;

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
                        
                        // Validar que las respuestas no estén vacías
                        summaryDiv.textContent = analysis.summary || "No se pudo generar un resumen.";
                        analysisDiv.textContent = analysis.analysis || "No se pudo generar un análisis.";
                        commentsDiv.textContent = analysis.commentsSummary || "No se encontraron comentarios para analizar.";
                    } catch (error) {
                        summaryDiv.textContent = 'Error al procesar el contenido: ' + error.message;
                        analysisDiv.textContent = "Error durante el análisis";
                        commentsDiv.textContent = "Error al procesar comentarios";
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                });
            });
        } catch (error) {
            console.error('Error:', error);
            summaryDiv.textContent = 'Error: ' + error.message;
            setLoading(false);
        }
    });

    function updateModelInfo(model) {
        const modelInfoText = {
            'gemini': '🤖 Google Gemini (Gratuito)',
            'openai': '💰 OpenAI GPT-3.5 (Pago)'
        };
        modelInfo.textContent = modelInfoText[model] || '';
    }
});
