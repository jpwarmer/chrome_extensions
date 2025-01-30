export class AIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async analyze(content, comments, url) {
        const prompt = `
Please analyze the following webpage content and provide three sections:
1. SUMMARY: A concise summary of the main content
2. ANALYSIS: An analysis of the writing style and potential bias
3. COMMENTS SUMMARY: A summary of key points from the comments (if any)

URL: ${url}

MAIN CONTENT:
${content.substring(0, 6000)}

COMMENTS:
${comments ? comments.substring(0, 2000) : 'No comments available'}
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
                const sections = this.parseSections(responseText);
                
                return {
                    summary: sections.SUMMARY || "No summary available.",
                    analysis: sections.ANALYSIS || "No analysis available.",
                    commentsSummary: sections["COMMENTS SUMMARY"] || "No comments analysis available."
                };
            } else {
                throw new Error('Invalid response from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    parseSections(response) {
        const sections = {};
        const sectionRegex = /(\d\. )?([A-Z\s]+):\s*([\s\S]*?)(?=(?:\d\. )?[A-Z\s]+:|$)/g;
        
        let match;
        while ((match = sectionRegex.exec(response)) !== null) {
            const sectionName = match[2].trim();
            const sectionContent = match[3].trim();
            sections[sectionName] = sectionContent;
        }
        
        return sections;
    }
}