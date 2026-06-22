import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'PLACEHOLDER_KEY';
const genAI = new GoogleGenerativeAI(apiKey);

// Module A: AI Symptom Triage & Priority Scoring Engine
export const triageSymptoms = async (symptoms: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            priorityScore: { type: SchemaType.INTEGER, description: 'Integer between 1 and 10' },
            riskLevel: { type: SchemaType.STRING, format: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            aiRationale: { type: SchemaType.STRING }
          },
          required: ['priorityScore', 'riskLevel', 'aiRationale']
        }
      }
    });

    const prompt = `You are an expert clinical triage assistant. Analyze the provided patient complaints: "${symptoms}". Determine an urgency priority score scale integer between 1 and 10 and map risk levels. Return strictly a raw JSON object matching the requested schema.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in triageSymptoms:', error);
    // Fallback values
    return {
      priorityScore: 5,
      riskLevel: 'MEDIUM',
      aiRationale: 'Error analyzing symptoms. Default medium priority assigned.'
    };
  }
};

// Module B: Structured Clinical Health Plan Translator
export const translateHealthPlan = async (doctorNotes: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            medications: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  dosage: { type: SchemaType.STRING },
                  frequency: { type: SchemaType.STRING },
                  instructions: { type: SchemaType.STRING }
                },
                required: ['name', 'dosage', 'frequency']
              }
            },
            lifestyleInstructions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            criticalWarningSigns: { type: SchemaType.STRING }
          },
          required: ['medications', 'lifestyleInstructions', 'criticalWarningSigns']
        }
      }
    });

    const prompt = `Translate the following rapid shorthand prescriptions into beautifully structured, human-readable patient discharge documentation: "${doctorNotes}"`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in translateHealthPlan:', error);
    return null;
  }
};
