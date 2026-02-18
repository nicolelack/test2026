
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants.tsx";

const getAIClient = () => {
  // process.env.API_KEY is injected by Vite during the build process
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "MISSING_KEY") {
    console.warn("API key is not configured in the build environment.");
    return new GoogleGenAI({ apiKey: "invalid_key" });
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
