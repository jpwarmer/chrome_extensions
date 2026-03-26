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

// Clase principal para manejar servicios de AI
class AIService {
    constructor(model, apiKey, locale = 'es') {
        this.model = model;
        this.apiKey = apiKey;
        this.locale = ['en', 'es'].includes(locale) ? locale : 'es';
    }

    tr(key) {
        const bundle = window.translations?.[this.locale] || window.translations?.en;
        const fallback = window.translations?.en;
        if (bundle && bundle[key] !== undefined) {
            return bundle[key];
        }
        if (fallback && fallback[key] !== undefined) {
            return fallback[key];
        }
        return key;
    }

    openAiHttpMessage(status, apiMessage) {
        if (status === 429) {
            return this.tr('aiErrOpenAI429');
        }
        if (status === 401) {
            return this.tr('aiErrOpenAI401');
        }
        if (status === 403) {
            return this.tr('aiErrOpenAI403');
        }
        if (apiMessage) {
            return `${this.tr('aiErrOpenAIPrefix')} ${apiMessage}`;
        }
        return this.tr('aiErrOpenAIHttp').replace('{status}', String(status));
    }

    anthropicHttpMessage(status, apiMessage) {
        if (status === 429) {
            return this.tr('aiErrAnthropic429');
        }
        if (status === 401) {
            return this.tr('aiErrAnthropic401');
        }
        if (status === 403) {
            return this.tr('aiErrAnthropic403');
        }
        if (apiMessage) {
            return `${this.tr('aiErrAnthropicPrefix')} ${apiMessage}`;
        }
        return this.tr('aiErrAnthropicHttp').replace('{status}', String(status));
    }

    /**
     * @param {string} analysisLine2 - Instrucción para la sección 2 (varía por proveedor).
     * @param {string} [formatHint] - Píe opcional (p. ej. recordatorio de formato).
     */
    buildAnalysisPrompt(content, comments, url, analysisLine2, formatHint = '') {
        const main = content.substring(0, MAX_MAIN_CONTENT_CHARS);
        const comm = comments
            ? comments.substring(0, MAX_COMMENTS_CHARS)
            : this.tr('aiNoComments');

        return `
            ${this.tr('aiPromptIntro')}
            ${this.tr('aiLine1')}
            ${this.tr('aiLine2Prefix')} ${analysisLine2}
            ${this.tr('aiLine3')}

            ${this.tr('aiUrlLabel')} ${url}

            ${this.tr('aiMainContentLabel')}
            ${main}

            ${this.tr('aiCommentsLabel')}
            ${comm}
            ${formatHint ? `\n${formatHint}` : ''}
        `.trim();
    }

    async analyze(content, comments, url) {
        if (!content || content.trim().length < 50) {
            return {
                summary: this.tr('aiInsufficientSummary'),
                analysis: this.tr('aiInsufficientAnalysis'),
                commentsSummary: comments
                    ? this.tr('aiInsufficientCommentsWithComments')
                    : this.tr('aiInsufficientCommentsNone')
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
        const prompt = this.buildAnalysisPrompt(
            content,
            comments,
            url,
            this.tr('aiLine2Gemini')
        );

        try {
            const response = await fetch(`${GEMINI_GENERATE_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000
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
                        ? `${this.tr('aiErrGeminiPrefix')} ${msg}`
                        : this.tr('aiErrGeminiReject').replace('{status}', String(response.status))
                );
            }

            const cand = data.candidates?.[0];
            const text = cand?.content?.parts?.[0]?.text;

            if (data.promptFeedback?.blockReason) {
                throw new Error(
                    this.tr('aiErrGeminiBlock').replace(
                        '{reason}',
                        String(data.promptFeedback.blockReason)
                    )
                );
            }

            if (!text) {
                const reason = cand?.finishReason || this.tr('aiErrFinishReasonNoText');
                throw new Error(this.tr('aiErrGeminiNoText').replace('{reason}', String(reason)));
            }

            return this.parseSections(text);
        } catch (error) {
            console.error('Error en API de Gemini:', error);

            if (error instanceof TypeError) {
                throw new Error(this.tr('aiErrGeminiNetwork'));
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }

    async analyzeWithOpenAI(content, comments, url) {
        const prompt = this.buildAnalysisPrompt(
            content,
            comments,
            url,
            this.tr('aiLine2OpenAI'),
            this.tr('aiOpenAIFormatHint')
        );

        try {
            const response = await fetch(OPENAI_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: this.tr('aiOpenAISystem')
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
                throw new Error(this.openAiHttpMessage(response.status, msg));
            }

            if (!data.choices?.[0]?.message?.content) {
                throw new Error(this.tr('aiErrOpenAIInvalidFormat'));
            }

            return this.parseSections(data.choices[0].message.content);
        } catch (error) {
            console.error('Error completo de OpenAI:', error);

            if (error instanceof TypeError) {
                throw new Error(this.tr('aiErrOpenAINetwork'));
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }

    async analyzeWithAnthropic(content, comments, url) {
        const prompt = this.buildAnalysisPrompt(
            content,
            comments,
            url,
            this.tr('aiLine2Claude'),
            this.tr('aiClaudeFormatHint')
        );

        const systemPrompt = this.tr('aiClaudeSystem');

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
                throw new Error(this.anthropicHttpMessage(response.status, msg));
            }

            const blocks = data.content;
            const textBlock = Array.isArray(blocks)
                ? blocks.find((b) => b.type === 'text')
                : null;
            const text = textBlock?.text;

            if (!text) {
                throw new Error(this.tr('aiErrClaudeNoText'));
            }

            return this.parseSections(text);
        } catch (error) {
            console.error('Error en API de Anthropic:', error);

            if (error instanceof TypeError) {
                throw new Error(this.tr('aiErrAnthropicNetwork'));
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

        response = response.replace(/\*\*/g, '');

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

        if (!sections.summary) {
            sections.summary = this.tr('aiParseNoSummary');
        }
        if (!sections.analysis) {
            sections.analysis = this.tr('aiParseNoAnalysis');
        }
        if (!sections.commentsSummary) {
            sections.commentsSummary = this.tr('aiParseNoComments');
        }

        return sections;
    }
}

window.AIService = AIService;
