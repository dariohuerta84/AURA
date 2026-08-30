import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export interface ChatMessageServer {
  id: string;
  matchId: string;
  sender: "user" | "partner";
  senderName: string;
  text: string;
  timestamp: number;
}

// In-memory store for chat messages grouped by matchId
const chatStore: Record<string, ChatMessageServer[]> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId requerido" }, { status: 400 });
  }

  const messages = chatStore[matchId] || [];
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { matchId, text, user, candidate } = body;

    if (!matchId || !text) {
      return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
    }

    if (!chatStore[matchId]) {
      chatStore[matchId] = [];
    }

    // Save user's message
    const userMessage: ChatMessageServer = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      matchId,
      sender: "user",
      senderName: user?.name || "Tú",
      text,
      timestamp: Date.now(),
    };

    chatStore[matchId].push(userMessage);

    // Generate AI Partner Response if candidate is provided
    let partnerMessage: ChatMessageServer | null = null;
    const openCodeKey = process.env.OPENCODE_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;

    if (candidate) {
      const partnerName = candidate.nombre || "Compañero/a de Aura";
      const partnerHabit = candidate.habito || "Construir hábitos diarios";
      const partnerCategory = candidate.categoria || "Salud Emocional";

      const prompt = `Eres ${partnerName}, un usuario real de la app AURA enfocado en ${partnerCategory}.
Tu hábito actual es: "${partnerHabit}". Tu racha es de ${candidate.racha || 5} días y tu nivel de Aura es ${candidate.auraLevel || 80}/100.
El usuario ${user?.name || "tu compañero"} te acaba de enviar este mensaje en el chat de AURA Match:
"${text}"

Responde en español de forma empática, cercana, motivadora y conversacional (máximo 2 a 3 oraciones cortas). Anímalo a seguir con sus hábitos del día. No uses emojis exagerados.`;

      let replyText = `¡Hola ${user?.name || ""}! Qué genial conectar contigo. ¡Vamos a darle duro a nuestros hábitos hoy! ✨`;

      // 1. Try OpenCode first
      if (openCodeKey) {
        try {
          const openai = new OpenAI({
            apiKey: openCodeKey,
            baseURL: process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1",
          });

          const completion = await openai.chat.completions.create({
            model: process.env.OPENCODE_MODEL || "mimo-v2.5-free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 150,
          });

          const content = completion.choices[0]?.message?.content;
          if (content) {
            replyText = content.trim();
          }
        } catch (e) {
          console.error("[Chat OpenCode Error]:", e);
        }
      }

      // 2. Try Gemini as fallback
      if (openCodeKey && replyText.includes("¡Hola") && googleKey) {
        try {
          const ai = new GoogleGenAI({ apiKey: googleKey });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
          const geminiText = response.text?.trim();
          if (geminiText) {
            replyText = geminiText;
          }
        } catch (e) {
          console.error("[Chat Gemini Error]:", e);
        }
      }

      partnerMessage = {
        id: `msg_${Date.now() + 10}_${Math.random().toString(36).substring(2, 6)}`,
        matchId,
        sender: "partner",
        senderName: partnerName,
        text: replyText,
        timestamp: Date.now() + 1200,
      };

      chatStore[matchId].push(partnerMessage);
    }

    return NextResponse.json({
      success: true,
      messages: chatStore[matchId],
      partnerMessage,
    });
  } catch (error) {
    console.error("Error en API /api/chat", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
