import { NextResponse } from "next/server";
import { generateFuturesWithAI } from "@/lib/aiProvider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;

    if (!user || !user.name) {
      return NextResponse.json({ error: "Faltan datos del usuario" }, { status: 400 });
    }

    // Try AI generation (OpenAI / OpenCode / Gemini)
    const aiResult = await generateFuturesWithAI(user);
    if (aiResult) {
      return NextResponse.json({
        darkFuture: aiResult.darkFuture,
        brightFuture: aiResult.brightFuture,
        habits: aiResult.habits || [],
      });
    }

    // Dynamic fallback matching user goal if API keys missing/failing
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
