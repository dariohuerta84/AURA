import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, targetDifficulty, existingTitles = [], oldHabitTitle } = body;

    if (!user || !targetDifficulty) {
      return NextResponse.json({ error: "Faltan datos requeridos (usuario y dificultad)" }, { status: 400 });
    }

    const auraPoints = targetDifficulty === "easy" ? 5 : targetDifficulty === "normal" ? 8 : 12;
    const openCodeKey = process.env.OPENCODE_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    const prompt = `Eres el coach de hábitos IA de la app AURA (neuropsicología y hábitos atómicos).
El usuario quiere reemplazar uno de sus hábitos por uno totalmente nuevo y fresco.

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal: "${user.goal}"
- Categoría: ${user.category === "salud_mental" ? "Salud Mental" : "Salud Física"}
- Hábito que desea reemplazar: "${oldHabitTitle || ""}"
- Dificultad requerida: "${targetDifficulty}" (no cambies esta dificultad)
- Hábitos actuales en su lista (¡ESTÁ PROHIBIDO REPETIR O NINGUNO SIMILAR A ESTOS!):
${existingTitles.map((t: string) => `  - "${t}"`).join("\n")}

REQUISITOS DEL NUEVO HÁBITO:
1. Debe ser un micro-hábito atómico, concreto y práctico.
2. Debe estar directamente alineado con la meta "${user.goal}".
3. Debe tener exactamente la misma complejidad de dificultad: "${targetDifficulty}".
4. NO PUEDE SER IGUAL NI SIMILAR a los hábitos prohibidos arriba.

Responde EXCLUSIVAMENTE con este formato JSON válido:
{
  "title": "Descripción corta del nuevo hábito (máx 90 caracteres)",
  "difficulty": "${targetDifficulty}",
  "auraPoints": ${auraPoints}
}`;

    // 1. Try OpenCode (MiMo V2.5 Free) if key present
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
          temperature: 0.85,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.title) {
            return NextResponse.json({
              title: parsed.title,
              difficulty: targetDifficulty,
              auraPoints,
            });
          }
        }
      } catch (e) {
        console.error("[Replace Habit OpenCode Error]:", e);
      }
    }

    // 2. Try Gemini SDK if key present (fallback)
    if (googleApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: googleApiKey });
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
          if (parsed.title) {
            return NextResponse.json({
              title: parsed.title,
              difficulty: targetDifficulty,
              auraPoints,
            });
          }
        }
      } catch (e) {
        console.error("[Replace Habit Gemini Error]:", e);
      }
    }

    // Fallback if API keys missing/failing
    const fallbacks: Record<string, string[]> = {
      easy: ["Beber 1 vaso de agua al despertar", "Realizar 3 estiramientos suaves", "Anotar 1 pensamiento positivo"],
      normal: ["Leer 10 páginas de un libro", "Caminata de 15 minutos sin teléfono", "Planificar 3 tareas clave del día"],
      hard: ["Escribir un resumen del día sin pantallas", "Entrenamiento intenso de 20 min", "Ducha de agua fría por 60 seg"],
    };

    const options = fallbacks[targetDifficulty] || fallbacks.normal;
    const unused = options.filter((title) => !existingTitles.includes(title));
    const chosenTitle = unused[0] || `Nuevo hábito de ${targetDifficulty}`;

    return NextResponse.json({
      title: chosenTitle,
      difficulty: targetDifficulty,
      auraPoints,
    });
  } catch (error) {
    console.error("[Replace Habit API Error]:", error);
    return NextResponse.json(
      { error: "Error al generar reemplazo de hábito" },
      { status: 500 }
    );
  }
}
