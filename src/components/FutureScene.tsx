"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useTts } from "@/hooks/useTts";

interface FutureSceneProps {
  darkFuture: string;
  brightFuture: string;
  onClose?: () => void;
}

export const FutureScene: React.FC<FutureSceneProps> = ({
  darkFuture,
  brightFuture,
}) => {
  const [activeTab, setActiveTab] = useState<"dark" | "bright">("dark");
  const [displayedText, setDisplayedText] = useState("");
  const { speak, stop, isPlaying, isLoading } = useTts();
  const isSpeaking = isPlaying || isLoading;

  const fullText = activeTab === "dark" ? darkFuture : brightFuture;

  // Typewriter effect using slice to guarantee 100% exact text rendering without word clipping
  useEffect(() => {
    setDisplayedText("");
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength++;
      if (currentLength <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentLength));
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [fullText]);



  // Google Cloud TTS (with Web Speech fallback via useTts hook)
  const toggleSpeech = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    speak(fullText);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Toggle Switch */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            stop();
            setActiveTab("dark");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "dark"
              ? "bg-red-950/60 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Si sigues así...</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stop();
            setActiveTab("bright");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "bright"
              ? "bg-purple-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Si retomas hoy...</span>
        </button>
      </div>

      {/* Main Scene Display Card */}
      <div
        className={`relative p-6 rounded-3xl border transition-all duration-500 min-h-[340px] flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
          activeTab === "dark"
            ? "bg-gradient-to-b from-red-950/40 via-stone-950/80 to-black border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            : "bg-gradient-to-b from-purple-950/40 via-cyan-950/60 to-black border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        }`}
      >
        {/* Background Ambient Glow */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 ${
            activeTab === "dark" ? "bg-red-600" : "bg-cyan-400"
          }`}
        />

        {/* Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full border ${
                activeTab === "dark"
                  ? "text-red-400 border-red-500/30 bg-red-950/50"
                  : "text-cyan-300 border-cyan-500/30 bg-cyan-950/50"
              }`}
            >
              {activeTab === "dark" ? "FUTURO DESFUTURO" : "FUTURO RADIANTE"}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSpeech}
            className={`p-2 rounded-full border transition-all ${
              isSpeaking
                ? "bg-purple-600 border-purple-400 text-white animate-pulse"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30"
            }`}
            title="Escuchar narración en voz"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Narrative Typewriter Body */}
        <div className="my-6 z-10">
          <p className="text-base leading-relaxed font-light text-white/95 tracking-wide min-h-[160px]">
            {displayedText}
            <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse" />
          </p>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 z-10">
          <span className="text-[11px] text-white/40 tracking-wider">
            VOZ: Google Cloud TTS Neural
          </span>

          <button
            type="button"
            onClick={() => {
              stop();
              setActiveTab((prev) => (prev === "dark" ? "bright" : "dark"));
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Ver el otro camino</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
