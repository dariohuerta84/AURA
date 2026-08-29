import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const generateTwoFutures = action({
  args: {
    userId: v.id("users"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user) throw new Error("Usuario no encontrado");

    const habits = await ctx.runQuery(api.habits.listByUser, { userId: args.userId });
    const todayCheckIns = await ctx.runQuery(api.checkIns.getToday, {
      userId: args.userId,
      date: args.date,
    });

    const completedHabitsCount = todayCheckIns.filter((c) => c.completed).length;

    const apiKey = process.env.OPENAI_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    let darkFutureText = "";
    let brightFutureText = "";

    // 1. Try Google Gemini API if GOOGLE_API_KEY is provided
    if (googleApiKey && !darkFutureText) {
      try {
        const prompt = `Eres un narrador empático, profundo e hiper-honesto para la app AURA.
Tu misión es generar DOS proyecciones cortas del futuro (máximo 75 palabras cada una) en segunda persona ("tú").

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal: "${user.goal}"
- Categoría: ${user.category}
- Nivel de estrés: ${user.stressLevel || "desconocido"}/5
- Fuente principal de ansiedad: ${user.anxietySource || "general"}
- Calidad de sueño: ${user.sleepQuality || "irregular"}
- Nivel de actividad: ${user.activityLevel || "moderada"}
- Hábitos completados hoy: ${completedHabitsCount} de ${habits.length}
- Racha actual: ${user.currentStreak} días

Responde EXCLUSIVAMENTE con un JSON válido con este formato:
{
  "darkFuture": "Escena 1: Si sigues ignorando tu patrón y postergando...",
  "brightFuture": "Escena 2: Si hoy decides sostener tu aura y dar el paso..."
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            darkFutureText = parsed.darkFuture || "";
            brightFutureText = parsed.brightFuture || "";
          }
        }
      } catch (e) {
        console.error("Google Gemini API call failed", e);
      }
    }

    // 2. Try OpenAI API if OPENAI_API_KEY is provided
    if (apiKey && !darkFutureText) {
      try {
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey });

        const systemPrompt = `Eres un narrador empático, profundo e hiper-honesto para la app AURA.
Tu misión es generar DOS proyecciones cortas del futuro (máximo 75 palabras cada una) en segunda persona ("tú").

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Meta personal: "${user.goal}"
- Categoría: ${user.category}
- Nivel de estrés: ${user.stressLevel || "desconocido"}/5
- Fuente principal de ansiedad: ${user.anxietySource || "general"}
- Calidad de sueño: ${user.sleepQuality || "irregular"}
- Nivel de actividad: ${user.activityLevel || "moderada"}
- Hábitos completados hoy: ${completedHabitsCount} de ${habits.length}
- Racha actual: ${user.currentStreak} días

Instrucciones de estilo:
- Directo, visceral y realista. Nada de frases motivacionales genéricas.
- Usa los datos exactos del usuario (su meta, su fuente de ansiedad o sueño).
- Respuesta obligatoria en formato JSON exacto:
{
  "darkFuture": "Escena 1: Si sigues ignorando tu patrón y postergando...",
  "brightFuture": "Escena 2: Si hoy decides sostener tu aura y dar el paso..."
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }],
          response_format: { type: "json_object" },
          temperature: 0.8,
        });

        const content = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        darkFutureText = parsed.darkFuture || "";
        brightFutureText = parsed.brightFuture || "";
      } catch (e) {
        console.error("OpenAI API call failed, using fallback generator", e);
      }
    }

    // Fallback inteligente personalizado en caso de no tener API key o error
    if (!darkFutureText || !brightFutureText) {
      if (user.category === "salud_mental") {
        darkFutureText = `En tres meses, ${user.name}, la ansiedad provocada por ${user.anxietySource || "las exigencias diarias"} sigue ocupando el primer lugar al despertar. Decir "mañana medito" o "mañana me desconecto" se ha vuelto una rutina automática. Tu meta ("${user.goal}") se aleja mientras tu energía vital se siente apagada y fría.`;
        brightFutureText = `Imagina despertar sintiendo claridad real. Hoy completaste ${completedHabitsCount} hábitos y sostuviste tu racha de ${user.currentStreak} días. En tres meses, la calma reemplaza la urgencia. Tu meta ("${user.goal}") deja de ser un deseo distante y se convierte en tu forma de vivir.`;
      } else {
        darkFutureText = `En 90 días, la inercia gana. Tu meta ("${user.goal}") queda sepultada por la rutina. Las pocas horas de descanso y la falta de movimiento pasan factura: te levantas con pesadez, sin el impulso físico que necesitas para encarar tus proyectos.`;
        brightFutureText = `Visualiza tu cuerpo dentro de 90 días si mantienes la disciplina de hoy. Con cada vaso de agua y cada entrenamiento, tu nivel de aura se eleva. Te mueves con ligereza, tu descanso se profundiza y alcanzas tu meta ("${user.goal}") con fuerza radiante.`;
      }
    }

    // Guardar en la base de datos
    await ctx.runMutation(api.twoFutures.save, {
      userId: args.userId,
      date: args.date,
      darkFuture: darkFutureText,
      brightFuture: brightFutureText,
    });

    return { darkFuture: darkFutureText, brightFuture: brightFutureText };
  },
});

export const generateAuraImage = action({
  args: {
    userId: v.id("users"),
    auraLevel: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user) return null;

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey });

        const auraDesc =
          args.auraLevel > 80
            ? "radiant glowing golden and violet energy sphere surrounded by floating light dust, heavenly cosmic background"
            : args.auraLevel > 50
            ? "balanced ethereal purple and cyan glowing particle orb, dreamy nebula atmosphere"
            : "dim foggy dark violet glowing sphere in misty cold atmosphere, subtle faint light";

        const prompt = `Digital ethereal abstract background for a wellness app. Subject: ${auraDesc}. Style: ultra modern glassmorphism, vertical 9:16 ratio, atmospheric lighting, soft glow. No human faces, no text.`;

        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1792",
        });

        const imageUrl = response.data?.[0]?.url;
        if (imageUrl) {
          await ctx.runMutation(api.users.updateAuraImage, {
            userId: args.userId,
            imageUrl,
          });
          return imageUrl;
        }
      } catch (e) {
        console.error("Failed to generate image via DALL-E", e);
      }
    }

    return null;
  },
});
