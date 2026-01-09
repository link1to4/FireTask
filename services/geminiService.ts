import { GoogleGenAI, Type } from "@google/genai";
import { AIGeneratedContent } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // We assume this variable is pre-configured, valid, and accessible.
  // Note: Vite config handles the 'process.env.API_KEY' replacement.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceTaskContent = async (input: string): Promise<AIGeneratedContent | null> => {
  try {
    const ai = getAI();
    
    const prompt = `
      You are an expert productivity assistant.
      The user has provided a rough task idea: "${input}".
      
      Please refine this into a clear, actionable task Title and a more detailed Description (max 2 sentences).
      The description should outline the first step or list key items if it implies a list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    const result = response.text;
    if (!result) return null;
    
    return JSON.parse(result) as AIGeneratedContent;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};