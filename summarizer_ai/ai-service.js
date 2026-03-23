/** Modelo Gemini para generateContent (ver https://ai.google.dev/gemini-api/docs/models). */
const GEMINI_MODEL_ID = 'gemini-3.1-flash-lite-preview';
const GEMINI_GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent`;
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
/** Modelo estable; ver https://docs.anthropic.com/claude/docs/models-overview */
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

/** Límites de contexto enviados al modelo (caracteres aprox.). */
const MAX_MAIN_CONTENT_CHARS = 6000;
const MAX_COMMENTS_CHARS = 2000;

/**
 * Construye el texto de usuario compartido por Gemini y OpenAI.
 * @param {string} analysisLine2 - Instrucción concreta para la sección 2 (varía por proveedor).
 * @param {string} [formatHint] - Píe opcional (p. ej. recordatorio de formato para OpenAI).
 */
/** Mensajes claros para la UI (español). */
function openAiHttpMessage(status, apiMessage) {
    if (status === 429) {
        return 'Cuota o límite de uso de OpenAI alcanzado (429). Revisa facturación en platform.openai.com o prueba Google Gemini en el selector.';
    }
    if (status === 401) {
        return 'API key de OpenAI inválida o sin permiso. Comprueba la clave en platform.openai.com.';
    }
    if (status === 403) {
        return 'OpenAI rechazó la petición (403). Revisa el estado de la cuenta o restricciones del proyecto.';
    }
    if (apiMessage) {
        return `OpenAI: ${apiMessage}`;
    }
    return `Error de OpenAI (HTTP ${status}).`;
}

function anthropicHttpMessage(status, apiMessage) {
    if (status === 429) {
        return 'Cuota o límite de Anthropic alcanzado (429). Revisa facturación en console.anthropic.com.';
    }
    if (status === 401) {
        return 'API key de Anthropic inválida. Crea una clave en console.anthropic.com.';
    }
    if (status === 403) {
        return 'Anthropic rechazó la petición (403). Revisa permisos del proyecto o región.';
    }
    if (apiMessage) {
        return `Claude: ${apiMessage}`;
    }
    return `Error de Anthropic (HTTP ${status}).`;
}

function buildAnalysisPrompt(content, comments, url, analysisLine2, formatHint = '') {
    const main = content.substring(0, MAX_MAIN_CONTENT_CHARS);
    const comm = comments
        ? comments.substring(0, MAX_COMMENTS_CHARS)
        : 'No hay comentarios disponibles';

    return `
            Analiza el siguiente contenido web y proporciona tres secciones en español:
            1. RESUMEN: Un resumen conciso del contenido principal
            2. ANÁLISIS: ${analysisLine2}
            3. COMENTARIOS: Un resumen de los puntos clave de los comentarios (si hay)

            URL: ${url}

            CONTENIDO PRINCIPAL:
            ${main}

            COMENTARIOS:
            ${comm}
            ${formatHint ? `\n${formatHint}` : ''}
        `.trim();
}

// Clase principal para manejar servicios de AI
class AIService {
    constructor(model, apiKey) {
        this.model = model;
        this.apiKey = apiKey;
    }

    async analyze(content, comments, url) {
        // Validar contenido mínimo
        if (!content || content.trim().length < 50) {
            return {
                summary: "No hay suficiente contenido para analizar.",
                analysis: "No se puede realizar un análisis sin contenido suficiente.",
                commentsSummary: comments ? "Hay comentarios pero no hay contenido principal para contextualizar." : "No hay comentarios disponibles."
            };
        }

        if (this.model === 'gemini') {
            return this.analyzeWithGemini(content, comments, url);
        }
        if (this.model === 'claude') {
            return this.analyzeWithAnthropic(content, comments, url);
        }
        return this.analyzeWithOpenAI(content, comments, url);
    }

    async analyzeWithGemini(content, comments, url) {
        const prompt = buildAnalysisPrompt(
            content,
            comments,
            url,
            'Un análisis en busca de sesgos (politicos, sociales, etc), tambien advierte si crees que hay desinformacion, propaganda o informacion controvertida.'
        );

        try {
            const response = await fetch(`${GEMINI_GENERATE_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const msg =
                    data.error?.message ||
                    data.error?.status ||
                    (typeof data.error === 'string' ? data.error : '');
                throw new Error(
                    msg
                        ? `Gemini: ${msg}`
                        : `Gemini rechazó la petición (HTTP ${response.status}).`
                );
            }

            const cand = data.candidates?.[0];
            const text = cand?.content?.parts?.[0]?.text;

            if (data.promptFeedback?.blockReason) {
                throw new Error(
                    `Gemini bloqueó el contenido (${data.promptFeedback.blockReason}). Prueba otra página o acorta el texto.`
                );
            }

            if (!text) {
                const reason = cand?.finishReason || 'sin texto';
                throw new Error(
                    `Gemini no devolvió texto útil (${reason}). Revisa la clave en Google AI Studio o prueba más tarde.`
                );
            }

            return this.parseSections(text);
        } catch (error) {
            console.error('Error en API de Gemini:', error);

            if (error instanceof TypeError) {
                throw new Error(
                    'No se pudo conectar con Gemini. Comprueba red, bloqueadores o que generativelanguage.googleapis.com no esté bloqueado.'
                );
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }

    async analyzeWithOpenAI(content, comments, url) {
        const prompt = buildAnalysisPrompt(
            content,
            comments,
            url,
            'Un análisis del estilo de escritura y posible sesgo',
            'Por favor, asegúrate de mantener el formato exacto con los números y títulos de sección.'
        );

        try {
            const response = await fetch(OPENAI_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'Eres un asistente que analiza contenido web y proporciona resúmenes estructurados claros. Siempre mantienes el formato exacto con números y títulos de sección.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const msg = data.error?.message || '';
                throw new Error(openAiHttpMessage(response.status, msg));
            }

            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Formato de respuesta inválido de OpenAI.');
            }

            return this.parseSections(data.choices[0].message.content);
        } catch (error) {
            console.error('Error completo de OpenAI:', error);

            if (error instanceof TypeError) {
                throw new Error(
                    'No se pudo conectar con OpenAI (red bloqueada o sin conexión). Si en consola aparece ERR_BLOCKED_BY_CLIENT, suele ser un bloqueador (uBlock, Privacy Badger, Brave Shields): permite api.openai.com o desactívalo al probar la extensión.'
                );
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }

    async analyzeWithAnthropic(content, comments, url) {
        const prompt = buildAnalysisPrompt(
            content,
            comments,
            url,
            'Un análisis del estilo de escritura, posible sesgo y tono; señala si detectas desinformación o argumentación muy sesgada.',
            'Mantén el formato exacto con 1. RESUMEN, 2. ANÁLISIS y 3. COMENTARIOS y títulos en mayúsculas.'
        );

        const systemPrompt =
            'Eres un asistente que analiza páginas web y devuelve tres secciones numeradas en español. ' +
            'Usa siempre el formato: 1. RESUMEN:, 2. ANÁLISIS:, 3. COMENTARIOS:.';

        try {
            const response = await fetch(ANTHROPIC_MESSAGES_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': ANTHROPIC_VERSION
                },
                body: JSON.stringify({
                    model: CLAUDE_MODEL,
                    max_tokens: 4096,
                    temperature: 0.7,
                    system: systemPrompt,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const msg =
                    data.error?.message ||
                    (typeof data.error === 'string' ? data.error : '') ||
                    (data.error && data.error.type) ||
                    '';
                throw new Error(anthropicHttpMessage(response.status, msg));
            }

            const blocks = data.content;
            const textBlock = Array.isArray(blocks)
                ? blocks.find((b) => b.type === 'text')
                : null;
            const text = textBlock?.text;

            if (!text) {
                throw new Error(
                    'Claude no devolvió texto. Revisa la clave en console.anthropic.com o el modelo.'
                );
            }

            return this.parseSections(text);
        } catch (error) {
            console.error('Error en API de Anthropic:', error);

            if (error instanceof TypeError) {
                throw new Error(
                    'No se pudo conectar con Anthropic. Comprueba red, bloqueadores o que api.anthropic.com no esté bloqueado.'
                );
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }

    parseSections(response) {
        const sections = {
            summary: '',
            analysis: '',
            commentsSummary: ''
        };
        
        // Eliminar los asteriscos y limpiar el formato
        response = response.replace(/\*\*/g, '');
        
        // Buscar las secciones usando los encabezados numéricos
        const summaryMatch = response.match(/1\.\s*(?:RESUMEN|SUMMARY)[:\s]+([\s\S]+?)(?=2\.|$)/i);
        const analysisMatch = response.match(/2\.\s*(?:ANÁLISIS|ANALYSIS)[:\s]+([\s\S]+?)(?=3\.|$)/i);
        const commentsMatch = response.match(/3\.\s*(?:COMENTARIOS|COMMENTS)[:\s]+([\s\S]+?)$/i);

        if (summaryMatch) {
            sections.summary = summaryMatch[1].trim();
        }
        if (analysisMatch) {
            sections.analysis = analysisMatch[1].trim();
        }
        if (commentsMatch) {
            sections.commentsSummary = commentsMatch[1].trim();
        }

        // Si no se encontró alguna sección, usar mensajes por defecto
        if (!sections.summary) sections.summary = "No se pudo extraer el resumen.";
        if (!sections.analysis) sections.analysis = "No se pudo extraer el análisis.";
        if (!sections.commentsSummary) sections.commentsSummary = "No se encontraron comentarios para analizar.";

        return sections;
    }
}

// Hacer la clase disponible globalmente
window.AIService = AIService;