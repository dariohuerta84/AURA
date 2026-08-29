import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, targetDifficulty, existingTitles = [], oldHabitTitle } = body;

    if (!user || !targetDifficulty) {
      return NextResponse.json({ error: "Faltan datos requeridos (usuario y dificultad)" }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;
    const auraPoints = targetDifficulty === "easy" ? 5 : targetDifficulty === "normal" ? 8 : 12;

    if (!googleApiKey) {
      // Fallback if API key missing
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
    }

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

    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback model if primary endpoint hiccups
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.85,
              responseMimeType: "application/json",
            },
          }),
        }
      );
    }

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed.title) {
          return NextResponse.json({
            title: parsed.title,
            difficulty: targetDifficulty,
            auraPoints,
          });
        }
      }
    }

    // Fallback response if AI parse fails
    return NextResponse.json({
      title: `Practicar 5 min de enfoque hacia "${user.goal}"`,
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
