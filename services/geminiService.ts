
import { GoogleGenAI, Type } from "@google/genai";
import { LessonContent } from "../types.ts";

const getApiKey = () => {
  try {
    return (process && process.env && process.env.API_KEY) || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateLessonContent = async (day: number, topic: string): Promise<LessonContent> => {
  const prompt = `Generate an English lesson for a software developer aiming to move from A2 to B1 level. 
  This is Day ${day} of a 30-day plan. The topic is: ${topic}.
  The lesson must include:
  1. A grammar explanation suitable for B1 (Intermediate).
  2. 5-7 technical vocabulary words.
  3. A short reading passage related to programming (Python or HTML context).
  4. A code snippet (Python or HTML) that uses the grammar/vocabulary in comments or logic.
  5. 3 multiple-choice quiz questions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          grammar: { type: Type.STRING },
          vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
          readingPassage: { type: Type.STRING },
          codeSnippet: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              code: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["language", "code", "explanation"]
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["grammar", "vocabulary", "readingPassage", "codeSnippet", "quiz"]
      }
    }
  });

  return JSON.parse(response.text) as LessonContent;
};

export const getConversationFeedback = async (history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: "Evaluate the user's English in this conversation. Provide 3 specific tips for B1 improvement. Keep it encouraging." }, ...history.flatMap(h => h.parts)] },
    config: {
      systemInstruction: "You are a professional ESL coach for developers. Help them transition from A2 to B1 English by focusing on technical communication and clear sentence structures."
    }
  });
  return response.text || "Keep practicing!";
};
