import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAfmNr2gcEW_v2WFqKeoQpSR0ggsA4RpZw';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateEnglishPractice(word: string) {
  try {
    const prompt = `Generate a short English practice conversation or sentence using the word "${word}". 
    Include pronunciation tips and common usage examples. 
    Format the response as JSON with the following structure:
    {
      "conversation": "The conversation or sentence",
      "pronunciation": "Pronunciation tips",
      "usage": "Common usage examples"
    }`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating practice:', error);
    throw error;
  }
}

export async function generateEnglishExplanation(word: string) {
  try {
    const prompt = `Explain the English word "${word}" in a simple and clear way. 
    Include its meaning, pronunciation, and example sentences.
    Format the response as JSON with the following structure:
    {
      "meaning": "The meaning of the word",
      "pronunciation": "Pronunciation guide",
      "examples": ["Example sentence 1", "Example sentence 2"]
    }`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw error;
  }
} 