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
        } else {
            return this.analyzeWithOpenAI(content, comments, url);
        }
    }

    async analyzeWithGemini(content, comments, url) {
        const prompt = `
            Analiza el siguiente contenido web y proporciona tres secciones en español:
            1. RESUMEN: Un resumen conciso del contenido principal
            2. ANÁLISIS: Un análisis del estilo de escritura y posible sesgo
            3. COMENTARIOS: Un resumen de los puntos clave de los comentarios (si hay)

            URL: ${url}

            CONTENIDO PRINCIPAL:
            ${content.substring(0, 6000)}

            COMENTARIOS:
            ${comments ? comments.substring(0, 2000) : 'No hay comentarios disponibles'}
        `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
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

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                return this.parseSections(responseText);
            } else {
                throw new Error('Respuesta inválida de la API de Gemini');
            }
        } catch (error) {
            console.error('Error en API de Gemini:', error);
            throw error;
        }
    }

    async analyzeWithOpenAI(content, comments, url) {
        const prompt = `
            Analiza el siguiente contenido web y proporciona tres secciones en español:
            1. RESUMEN: Un resumen conciso del contenido principal
            2. ANÁLISIS: Un análisis del estilo de escritura y posible sesgo
            3. COMENTARIOS: Un resumen de los puntos clave de los comentarios (si hay)

            URL: ${url}

            CONTENIDO PRINCIPAL:
            ${content.substring(0, 6000)}

            COMENTARIOS:
            ${comments ? comments.substring(0, 2000) : 'No hay comentarios disponibles'}

            Por favor, asegúrate de mantener el formato exacto con los números y títulos de sección.
        `;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
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

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Error de API: ${data.error?.message || 'Error desconocido'}`);
            }
            
            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Formato de respuesta inválido');
            }

            // Parsear la respuesta usando la misma función que Gemini
            return this.parseSections(data.choices[0].message.content);
            
        } catch (error) {
            console.error('Error completo de OpenAI:', error);
            throw new Error(`Error en API de OpenAI: ${error.message}`);
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