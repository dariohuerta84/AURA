import { TextToSpeechClient } from "@google-cloud/text-to-speech";

let client: TextToSpeechClient | null = null;

function getTtsClient(): TextToSpeechClient | null {
  if (client) return client;

  let credentialsJson: string | undefined;

  // Production: base64-encoded JSON (safe for env vars)
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_B64;
  if (b64) {
    credentialsJson = Buffer.from(b64, "base64").toString("utf-8");
  } else {
    credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  }

  if (!credentialsJson) {
    console.warn("[AURA TTS] No credentials found. Set GOOGLE_APPLICATION_CREDENTIALS_B64.");
    return null;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    client = new TextToSpeechClient({ credentials });
    return client;
  } catch (err) {
    console.error("[AURA TTS] Failed to init TTS client:", err);
    return null;
  }
}

/**
 * Generates MP3 audio buffer from text using Google Cloud TTS.
 * Returns null if credentials are missing (dev fallback handled at route level).
 */
export async function generateTtsAudio(text: string): Promise<Buffer | null> {
  if (!text?.trim()) throw new Error("Text cannot be empty");

  const ttsClient = getTtsClient();
  if (!ttsClient) return null;

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: "es-US",
      name: "es-US-Neural2-C", // Spanish neural voice (female, warm)
      ssmlGender: "FEMALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 0.95,
      pitch: -1.0, // Slightly deeper, more "aura" feeling
    },
  });

  const audioContent = response.audioContent;
  if (!audioContent) throw new Error("No audio content received from Google TTS");

  return Buffer.from(audioContent as Uint8Array);
}
