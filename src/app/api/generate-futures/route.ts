import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, habitsCount = 5, completedHabitsCount = 2 } = body;

    if (!user) {
      return NextResponse.json({ error: "Faltan datos del usuario" }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!googleApiKey) {
      console.warn("GOOGLE_API_KEY no configurada en env. Usando fallback dinámico.");
      return NextResponse.json({
        darkFuture: `En tres meses, ${user.name}, la ansiedad causada por ${
          user.anxietySource || "el trabajo"
        } sigue dictando tus días. La falta de constancia apaga tu energía y tu meta ("${
          user.goal
        }") luce distante.`,
        brightFuture: `Imagina despertar con claridad, ${user.name}. Al sostener tus hábitos diarios, la calma reemplaza la tensión. En 90 días, conquistas tu meta ("${
          user.goal
        }") desde una profunda paz interior.`,
      });
    }

    const prompt = `Eres un narrador empático, visceral e hiper-honesto para la aplicación AURA.
Tu misión es redactar DOS escenas cortas sobre el futuro del usuario (máximo 75 palabras cada una) en segunda persona ("tú").

EVALUACIÓN CLINICA NEUROPSICOLÓGICA (Lic. María Del Pilar Cría):
- Nombre del usuario: ${user.name}
- Meta personal escrita por él: "${user.goal}"
- Categoría: ${user.category === "salud_mental" ? "Salud Emocional" : "Salud Física"}
- Nivel de Aura Inicial Evaluado: ${user.auraLevel || 50}/100

Instrucciones de estilo:
1. No uses clichés motivacionales vacíos. Habla con honestidad profunda pero constructiva.
2. Menciona explícitamente su meta ("${user.goal}") y las consecuencias de su evaluación actual (${user.auraLevel}/100).
3. Responde EXCLUSIVAMENTE con un formato JSON válido:
{
  "darkFuture": "Escena 1: Si sigues postergando tu meta y cediendo a tu patrón...",
  "brightFuture": "Escena 2: Si hoy decides sostener tu disciplina y dar el paso..."
}`;

    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback to gemini-1.5-flash if 2.5/3.6 endpoints vary
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.8,
            },
          }),
        }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Respuesta vacía de Gemini");
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json({
      darkFuture: parsed.darkFuture || "",
      brightFuture: parsed.brightFuture || "",
    });
  } catch (error: any) {
    console.error("Error en /api/generate-futures:", error);
    return NextResponse.json(
      { error: "Error al generar con IA", details: error.message },
      { status: 500 }
    );
  }
}
