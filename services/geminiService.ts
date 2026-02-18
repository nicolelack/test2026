
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
