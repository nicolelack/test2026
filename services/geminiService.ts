
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants.tsx";

const getAIClient = () => {
  // Use Vite's process.env shim or look for global process
  const apiKey = (process.env as any).API_KEY;
  if (!apiKey || apiKey === "MISSING_KEY" || apiKey === "") {
    console.warn("API key is not configured. Please set the API_KEY environment variable in Netlify.");
    // We return a client anyway to avoid crashing the whole initialization, 
    // but actual calls will fail gracefully in the try/catch.
    return new GoogleGenAI({ apiKey: "invalid_placeholder" });
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
