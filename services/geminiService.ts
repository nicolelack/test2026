
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants.tsx";

const getAIClient = () => {
  // Safe check for process.env
  const apiKey = (window as any).process?.env?.API_KEY || (process as any).env?.API_KEY;
  if (!apiKey) {
    console.warn("API key is missing. Please ensure process.env.API_KEY is configured.");
    // Return a dummy client or handle as needed - the app will catch errors on call
    return new GoogleGenAI({ apiKey: "MISSING_KEY" });
  }
  return new GoogleGenAI({ apiKey });
};

let chatInstance: Chat | null = null;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const ai = getAIClient();
    
    if (!chatInstance) {
      chatInstance = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }

    const result: GenerateContentResponse = await chatInstance.sendMessage({ message });
    return result.text || "I apologize, I'm having trouble processing that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently resting my circuits. Please try again in a moment or call our clinic directly.";
  }
};

export const resetChat = () => {
  chatInstance = null;
};
