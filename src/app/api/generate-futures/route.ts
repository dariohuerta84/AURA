import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, habitsCount = 5 } = body;

    if (!user || !user.name) {
      return NextResponse.json({ error: "Faltan datos del usuario" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Eres el motor de Inteligencia Artificial de la aplicación AURA (basada en psicología del comportamiento).
Tu objetivo es analizar la meta personal del usuario y su evaluación actual, y generar:
1. DOS proyecciones narrativas futuristas cortas (máximo 65 palabras cada una) en segunda persona ("tú").
2. CINCO micro-hábitos atómicos y súper concretos diseñados para alcanzar su meta específica: "${user.goal}".

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal escrita: "${user.goal}"
- Categoría: ${user.category === "salud_mental" ? "Salud Emocional" : "Salud Física"}
- Nivel de Aura Actual: ${user.auraLevel || 50}/100

INSTRUCCIONES DE LOS HÁBITOS:
- Deben ser prácticos, diarios y directamente alineados con su meta ("${user.goal}").
- Incluye 2 hábitos 'easy' (5 pts), 2 hábitos 'normal' (8 pts) y 1 hábito 'hard' (12 pts).

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
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

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const rawText = response.text?.trim();

        if (rawText) {
          // Clean JSON markdown if wrapped in ```json
          const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);

          if (parsed.darkFuture && parsed.brightFuture) {
            return NextResponse.json({
              darkFuture: parsed.darkFuture,
              brightFuture: parsed.brightFuture,
              habits: parsed.habits && Array.isArray(parsed.habits) ? parsed.habits : [],
            });
          }
        }
      } catch (sdkError) {
        console.error("Error consultando la API de Gemini vía SDK", sdkError);
      }
    }

    // Dynamic tailored fallback if API experiences temporary high demand (503)
    const isMental = user.category === "salud_mental";
    const darkText = isMental
      ? `En noventa días, ${user.name}, la constante postergación de tus momentos de pausa hace que la tensión del día se acumule. La meta de "${user.goal}" se percibe cada vez más distante si no estableces tus límites hoy.`
      : `En noventa días, ${user.name}, el desbalance en tus rutinas físicas reduce tu vitalidad diaria. La meta de "${user.goal}" requiere recuperar tu energía paso a paso.`;

    const brightText = isMental
      ? `Visualiza tu vida en noventa días, ${user.name}. Al sostener tus pequeños rituales diarios, la serenidad transforma tu descanso y alcanzas tu meta de "${user.goal}" con plena claridad.`
      : `Siente la energía en tu cuerpo en noventa días, ${user.name}. Cada hábito cumplido te fortalece y conquistas tu meta de "${user.goal}" con vitalidad radiante.`;

    return NextResponse.json({
      darkFuture: darkText,
      brightFuture: brightText,
      habits: [
        { title: `Ritual diario para ${user.goal}`, difficulty: "easy", auraPoints: 5 },
        { title: "Pausa consciente de 5 minutos", difficulty: "easy", auraPoints: 5 },
        { title: "Lectura o enfoque sin distracciones", difficulty: "normal", auraPoints: 8 },
        { title: "Avance concreto de 20 min en tu meta", difficulty: "normal", auraPoints: 8 },
        { title: "Desconexión total de pantallas antes de dormir", difficulty: "hard", auraPoints: 12 },
      ],
    });
  } catch (error: any) {
    console.error("Error en /api/generate-futures:", error);
    return NextResponse.json(
      { error: "Error al generar con IA", details: error.message },
      { status: 500 }
    );
  }
}
