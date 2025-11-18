// Fix: Add Content to imports for structured conversation history.
import { GoogleGenAI, GenerateContentResponse, Part, Content } from "@google/genai";
import { UserProfile, ChatMessage, Feature } from '../types';
import { MASTER_SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Fix: Refactored function to align with Gemini API best practices.
// It now uses a system instruction and a structured `contents` array for conversation history
// instead of a single large prompt string. This also fixes a bug where the conversation
// history was not correctly formatted, which would lead to API errors.
export const generateResponse = async (
  userInput: string,
  image: File | null,
  userProfile: UserProfile | null,
  chatHistory: ChatMessage[],
  feature: Feature | null
): Promise<string> => {
  let systemInstruction = MASTER_SYSTEM_PROMPT;

  if (userProfile) {
    systemInstruction += "\n\nUSER PROFILE (for personalization):\n";
    systemInstruction += JSON.stringify(userProfile, null, 2);
    systemInstruction += "\nUse this profile to tailor all responses, including meal plans, advice, and analysis.";
  }

  if (feature) {
    systemInstruction += `\n\nCURRENT TASK: ${feature.name}\n${feature.promptPrefix}\n`;
  }
  
  const firstUserIndex = chatHistory.findIndex(msg => msg.role === 'user');
  const validHistory = firstUserIndex === -1 ? [] : chatHistory.slice(firstUserIndex);

  const contents: Content[] = validHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const userParts: Part[] = [{ text: userInput }];

  if (image) {
    const imagePart = await fileToGenerativePart(image);
    // Place image first for better context in multimodal prompts
    userParts.unshift(imagePart);
  }
  
  contents.push({ role: 'user', parts: userParts });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `Error calling AI model: ${error.message}`;
    }
    return "An unexpected error occurred while contacting the AI model.";
  }
};

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
    try {
        const prompt = `Generate a very short, concise title (4-5 words max) for the following user query. The title should be suitable for a chat history list. Do not use quotes or any introductory text. Just provide the title.\n\nQuery: "${firstMessage}"`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                // Lower temperature for more predictable titles
                temperature: 0.2,
            }
        });
        // Clean up potential markdown or quotes from the response
        return response.text.trim().replace(/["*]/g, '');
    } catch (error) {
        console.error("Failed to generate chat title:", error);
        return "New Chat"; // Fallback title
    }
};

export const generateNutritionFact = async (): Promise<string> => {
    try {
        const prompt = "Tell me a short, surprising, and interesting nutrition fact. Keep it to 1-2 sentences.";
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call for nutrition fact failed:", error);
        // Return a fallback fact on error
        return "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.";
    }
};
