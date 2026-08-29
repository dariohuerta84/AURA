import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, habitsCount = 5 } = body;

    if (!user) {
      return NextResponse.json({ error: "Faltan datos del usuario" }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!googleApiKey) {
      console.warn("GOOGLE_API_KEY no configurada en env. Usando fallback dinámico.");
      return NextResponse.json({
        darkFuture: `En tres meses, ${user.name}, la falta de constancia apaga tu energía y tu meta ("${user.goal}") luce distante.`,
        brightFuture: `Imagina despertar con claridad, ${user.name}. Al sostener tus hábitos diarios, la calma reemplaza la tensión. En 90 días, conquistas tu meta ("${user.goal}") desde una profunda paz interior.`,
        habits: [
          { title: "Meditar 5 min al despertar", difficulty: "easy", auraPoints: 5 },
          { title: "Tomar 2 Litros de agua", difficulty: "easy", auraPoints: 5 },
          { title: "Lectura o caminata 20 min", difficulty: "normal", auraPoints: 8 },
          { title: "Avance de 30 min en tu meta principal", difficulty: "normal", auraPoints: 8 },
          { title: "Desconectar pantallas 1h antes de dormir", difficulty: "hard", auraPoints: 12 },
        ],
      });
    }

    const prompt = `Eres el motor de IA de la aplicación AURA (diseñada con neuropsicología).
Tu misión es analizar la meta personal del usuario y su evaluación inicial, y generar:
1. DOS escenas futuristas cortas (máximo 75 palabras cada una) en segunda persona ("tú").
2. CINCO micro-hábitos accionables y ultraconcretos diseñados con inteligencia artificial para ayudarle a alcanzar su meta específica ("${user.goal}").

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal escrita: "${user.goal}"
- Categoría: ${user.category === "salud_mental" ? "Salud Emocional" : "Salud Física"}
- Nivel de Aura Evaluado: ${user.auraLevel || 50}/100

Instrucciones de los hábitos:
- Deben ser atómicos, prácticos y directamente conectados con su meta ("${user.goal}").
- Asigna 2 hábitos 'easy' (5 pts), 2 hábitos 'normal' (8 pts) y 1 hábito 'hard' (12 pts).

Responde EXCLUSIVAMENTE con este formato JSON válido:
{
  "darkFuture": "Escena de futuro si abandona su meta...",
  "brightFuture": "Escena de futuro si sostiene su disciplina...",
  "habits": [
    { "title": "Hábito 1 personalizado", "difficulty": "easy", "auraPoints": 5 },
    { "title": "Hábito 2 personalizado", "difficulty": "easy", "auraPoints": 5 },
    { "title": "Hábito 3 personalizado", "difficulty": "normal", "auraPoints": 8 },
    { "title": "Hábito 4 personalizado", "difficulty": "normal", "auraPoints": 8 },
    { "title": "Hábito 5 personalizado", "difficulty": "hard", "auraPoints": 12 }
  ]
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
      habits: parsed.habits && Array.isArray(parsed.habits) ? parsed.habits : [],
    });
  } catch (error: any) {
    console.error("Error en /api/generate-futures:", error);
    return NextResponse.json(
      { error: "Error al generar con IA", details: error.message },
      { status: 500 }
    );
  }
}
