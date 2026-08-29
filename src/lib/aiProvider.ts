import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export interface GenerateFuturesResult {
  darkFuture: string;
  brightFuture: string;
  habits: { title: string; difficulty: "easy" | "normal" | "hard"; auraPoints: number }[];
}

export async function generateFuturesWithAI(user: any): Promise<GenerateFuturesResult | null> {
  const openCodeKey = process.env.OPENCODE_API_KEY;
  const googleKey = process.env.GOOGLE_API_KEY;

  const prompt = `Eres el motor de Inteligencia Artificial de la aplicación AURA (diseñada con neuropsicología y comportamiento).
Tu objetivo es analizar la meta personal del usuario y su evaluación actual, y generar:
1. DOS proyecciones narrativas futuristas cortas (máximo 65 palabras cada una) en segunda persona ("tú").
2. CINCO micro-hábitos atómicos y ultraconcretos diseñados para ayudarle a alcanzar su meta específica: "${user.goal}".

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal escrita: "${user.goal}"
- Categoría: ${user.category === "salud_mental" ? "Salud Emocional" : "Salud Física"}
- Nivel de Aura Actual: ${user.auraLevel || 50}/100

INSTRUCCIONES DE LOS HÁBITOS:
- Deben ser prácticos, diarios y directamente alineados con su meta ("${user.goal}").
- Incluye 2 hábitos 'easy' (5 pts), 2 hábitos 'normal' (8 pts) y 1 hábito 'hard' (12 pts).

Responde EXCLUSIVAMENTE con este formato JSON válido:
{
  "darkFuture": "Escena en 90 días si posterga su meta...",
  "brightFuture": "Escena en 90 días si sostiene su disciplina...",
  "habits": [
    { "title": "Hábito 1 alineado", "difficulty": "easy", "auraPoints": 5 },
    { "title": "Hábito 2 alineado", "difficulty": "easy", "auraPoints": 5 },
    { "title": "Hábito 3 alineado", "difficulty": "normal", "auraPoints": 8 },
    { "title": "Hábito 4 alineado", "difficulty": "normal", "auraPoints": 8 },
    { "title": "Hábito 5 alineado", "difficulty": "hard", "auraPoints": 12 }
  ]
}`;

  // 1. Try OpenCode (MiMo V2.5 Free) if API key is present
  if (openCodeKey) {
    try {
      const openai = new OpenAI({
        apiKey: openCodeKey,
        baseURL: process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1",
      });

      const completion = await openai.chat.completions.create({
        model: process.env.OPENCODE_MODEL || "mimo-v2.5-free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.darkFuture && parsed.brightFuture) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("[AI Provider - OpenCode Error]:", e);
    }
  }

  // 2. Try Google Gemini SDK if API key is present (fallback)
  if (googleKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: googleKey });
      let rawText = "";

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });
        rawText = response.text?.trim() || "";
      } catch {
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
        });
        rawText = fallbackRes.text?.trim() || "";
      }

      if (rawText) {
        const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.darkFuture && parsed.brightFuture) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("[AI Provider - Gemini Error]:", e);
    }
  }

  return null;
}
