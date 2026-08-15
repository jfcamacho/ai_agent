import { GoogleGenAI } from '@google/genai';

export class GeminiProvider {
  private aiClient: GoogleGenAI | null = null;
  private apiKey: string | undefined;

  private getClient(): GoogleGenAI | null {
    if (!this.aiClient) {
      this.apiKey = process.env.GEMINI_API_KEY;
      if (this.apiKey) {
        try {
          this.aiClient = new GoogleGenAI({ apiKey: this.apiKey });
        } catch (err) {
          console.warn('Gemini client initialization failed, fallback to structured cognitive engine', err);
        }
      }
    }
    return this.aiClient;
  }

  public isLiveAiAvailable(): boolean {
    return !!(this.getClient() || process.env.GEMINI_API_KEY);
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string | null> {
    const client = this.getClient();
    const apiKey = this.apiKey || process.env.GEMINI_API_KEY;

    if (!client && !apiKey) {
      return null;
    }

    try {
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
      if (client) {
        const response = await client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || 'Eres un analista senior de desarrollo de negocios B2B2C e insurtech para Inter.mx.',
            temperature: 0.2
          }
        });

        if (response.text) {
          return response.text;
        }
      }
    } catch (error: any) {
      // Continue to REST fallback
    }

    // Direct REST fallback with active API key
    if (apiKey) {
      try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` }] }],
            generationConfig: { temperature: 0.2 }
          })
        });
        const data: any = await resp.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text.trim();
        }
      } catch (restErr) {
        console.warn('REST fallback failed:', restErr);
      }
    }

    return null;
  }
}

export const geminiProvider = new GeminiProvider();
