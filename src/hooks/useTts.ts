"use client";

import { useRef, useState, useCallback } from "react";

type TtsState = "idle" | "loading" | "playing" | "error";

/**
 * Hook for AURA TTS — tries Google Cloud TTS first, falls back to Web Speech API.
 */
export function useTts() {
  const [state, setState] = useState<TtsState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    setState("idle");
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!text?.trim()) return;

      // Stop any current playback
      stop();
      setState("loading");

      try {
        // Try Google Cloud TTS via our API
        const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);

        if (res.ok && res.status !== 204) {
          // Google TTS succeeded — play MP3
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onplay = () => setState("playing");
          audio.onended = () => {
            setState("idle");
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => {
            setState("error");
            URL.revokeObjectURL(url);
          };

          await audio.play();
        } else {
          // Fallback to Web Speech API
          throw new Error("Using Web Speech fallback");
        }
      } catch {
        // Web Speech API fallback
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "es-US";
          utterance.rate = 0.95;
          utterance.pitch = 0.9;

          // Pick best available Spanish voice
          const voices = window.speechSynthesis.getVoices();
          const esVoice = voices.find(
            (v) => v.lang.startsWith("es") && !v.name.includes("Google")
          ) || voices.find((v) => v.lang.startsWith("es"));
          if (esVoice) utterance.voice = esVoice;

          utterance.onstart = () => setState("playing");
          utterance.onend = () => setState("idle");
          utterance.onerror = () => setState("error");

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
          setState("playing");
        } else {
          setState("error");
        }
      }
    },
    [stop]
  );

  return { speak, stop, state, isPlaying: state === "playing", isLoading: state === "loading" };
}
