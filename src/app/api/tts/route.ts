import { NextRequest, NextResponse } from "next/server";
import { generateTtsAudio } from "@/lib/googleTts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text?.trim()) {
      return NextResponse.json({ error: 'El parámetro "text" es obligatorio' }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json({ error: "Texto demasiado largo (máx 500 caracteres)" }, { status: 400 });
    }

    const audioBuffer = await generateTtsAudio(text);

    // Dev fallback: if no credentials, return 204 so client uses Web Speech API
    if (!audioBuffer) {
      return new NextResponse(null, {
        status: 204,
        headers: { "X-TTS-Fallback": "web-speech" },
      });
    }

    return new Response(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[TTS Route Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error de TTS" },
      { status: 500 }
    );
  }
}
