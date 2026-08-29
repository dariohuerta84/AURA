"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, X, Sparkles, Flame, MessageCircle, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { getStoredUser, getStoredHabits, UserProfile, Habit } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import confetti from "canvas-confetti";

export type MatchCandidate = {
  id: number;
  nombre: string;
  categoria: string;
  categoryKey: "salud_mental" | "salud_fisica";
  habito: string;
  racha: number;
  auraLevel: number;
  colorFrom: string;
  colorTo: string;
  bio: string;
};

// Generador de Candidatos Reales por Categoría
const COMMUNITY_CANDIDATES: MatchCandidate[] = [
  {
    id: 1,
    nombre: "Camila R.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "10 min de meditación y soltar la ansiedad laboral",
    racha: 6,
    auraLevel: 82,
    colorFrom: "#a78bfa",
    colorTo: "#4c1d95",
    bio: "Buscando reducir la rumiación mental al final del día.",
  },
  {
    id: 2,
    nombre: "Diego M.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Dormir antes de las 11:00 PM sin pantallas",
    racha: 4,
    auraLevel: 74,
    colorFrom: "#60a5fa",
    colorTo: "#1e3a8a",
    bio: "Enfocado en higiene de sueño y paz interior.",
  },
  {
    id: 3,
    nombre: "Valeria K.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Entrenar 4 veces por semana sin excusas",
    racha: 12,
    auraLevel: 91,
    colorFrom: "#f0abfc",
    colorTo: "#701a75",
    bio: "Buscando constancia física y mayor fuerza muscular.",
  },
  {
    id: 4,
    nombre: "Mateo S.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Tomar 2.5 litros de agua y evitar azúcares",
    racha: 5,
    auraLevel: 68,
    colorFrom: "#34d399",
    colorTo: "#065f46",
    bio: "Mejorando energía vital y hábitos de hidratación.",
  },
  {
    id: 5,
    nombre: "Sofía T.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Escribir en diario de gratitud al despertar",
    racha: 9,
    auraLevel: 88,
    colorFrom: "#f472b6",
    colorTo: "#831843",
    bio: "Reemplazando el scroll matutino por paz mental.",
  },
  {
    id: 6,
    nombre: "Lucas A.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Caminata de 30 min bajo la luz del sol",
    racha: 7,
    auraLevel: 79,
    colorFrom: "#fbbf24",
    colorTo: "#78350f",
    bio: "Recuperando ritmo circadiano y vitalidad corporal.",
  },
];

function EsferaAura({ nombre, colorFrom, colorTo, size = 96 }: { nombre: string; colorFrom: string; colorTo: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-extrabold text-white shrink-0 shadow-2xl transition-transform duration-500 hover:scale-105"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, ${colorFrom}, ${colorTo} 75%)`,
        boxShadow: `0 0 ${size * 0.4}px ${size * 0.1}px ${colorFrom}88`,
        fontSize: size * 0.35,
      }}
    >
      {nombre[0]}
    </div>
  );
}

export default function HabitMatchPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [matchedCandidate, setMatchedCandidate] = useState<MatchCandidate | null>(null);
  const [sentMessage, setSentMessage] = useState<string>("");
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.name) {
      setCurrentUser(user);
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white/50">
        Cargando candidatos de tu comunidad...
      </div>
    );
  }

  // Ordenar los candidatos priorizando la misma categoría del usuario
  const filteredCandidates = COMMUNITY_CANDIDATES.filter(
    (c) => c.categoryKey === currentUser.category
  ).concat(COMMUNITY_CANDIDATES.filter((c) => c.categoryKey !== currentUser.category));

  const actualCandidate = filteredCandidates[index % filteredCandidates.length];

  const siguiente = () => {
    setIndex((i) => i + 1);
  };

  const darLike = () => {
    setMatchedCandidate(actualCandidate);
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#EC4899", "#8B5CF6", "#3B82F6"],
      });
    } catch {
      // fallback
    }
  };

  const pasar = () => {
    siguiente();
  };

  const cerrarMatch = () => {
    setMatchedCandidate(null);
    setMessageSentSuccess(false);
    setSentMessage("");
    siguiente();
  };

  const handleSendMessage = () => {
    if (!sentMessage.trim()) return;
    setMessageSentSuccess(true);
    setTimeout(() => {
      cerrarMatch();
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-pink-400">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400 animate-pulse" />
            <span>Aura Habit Match</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-wide">Comunidad de Hábitos</h1>
        </div>
        <div className="px-3 py-1 rounded-full glass-card text-xs font-semibold text-purple-300 border border-purple-500/30">
          {currentUser.category === "salud_mental" ? "🧠 Salud Emocional" : "💪 Salud Física"}
        </div>
      </div>

      {/* MATCH MODAL vs CARD SWIPER */}
      {!matchedCandidate ? (
        <div className="my-auto flex flex-col items-center justify-center z-10 w-full animate-in fade-in zoom-in duration-300">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-4 font-medium">
            Personas elevando su aura en tu categoría
          </p>

          {/* Candidate Card */}
          <div className="w-full glass-card p-6 rounded-3xl border border-white/15 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            {/* Top Match Tag */}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold tracking-wider">
              ✦ {actualCandidate.auraLevel}% AURA
            </div>

            {/* Glowing Aura Orb Avatar */}
            <div className="my-2">
              <EsferaAura
                nombre={actualCandidate.nombre}
                colorFrom={actualCandidate.colorFrom}
                colorTo={actualCandidate.colorTo}
                size={90}
              />
            </div>

            <h2 className="text-xl font-bold text-white mt-3">{actualCandidate.nombre}</h2>

            <span className="mt-1 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              {actualCandidate.categoria}
            </span>

            <p className="text-xs text-white/50 mt-4">También está construyendo el hábito:</p>
            <p className="text-sm text-white font-semibold mt-1 px-2 italic">
              "{actualCandidate.habito}"
            </p>

            <p className="text-xs text-white/60 mt-3 font-light max-w-xs">
              "{actualCandidate.bio}"
            </p>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{actualCandidate.racha} días de racha activa</span>
            </div>
          </div>

          {/* Swipe Buttons (X & Heart) */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <button
              onClick={pasar}
              className="w-14 h-14 rounded-full glass-card border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all shadow-lg active:scale-95 cursor-pointer"
              aria-label="Pasar"
              title="Pasar"
            >
              <X className="w-6 h-6 text-white/50 hover:text-white" />
            </button>

            <button
              onClick={darLike}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400"
              aria-label="Conectar Match"
              title="Hacer Match"
            >
              <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
            </button>
          </div>
        </div>
      ) : (
        /* MATCH REVEAL SCREEN */
        <div className="my-auto flex flex-col items-center justify-center text-center z-10 w-full animate-in zoom-in fade-in duration-500">
          <div className="p-3 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 mb-3 animate-bounce">
            <Sparkles className="w-8 h-8 text-pink-400" />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">
            ¡Es un Match de Aura!
          </h2>

          <div className="my-5 flex items-center justify-center gap-4">
            {/* Current User initials orb */}
            <EsferaAura
              nombre={currentUser.name || "Tú"}
              colorFrom="#8b5cf6"
              colorTo="#3b82f6"
              size={76}
            />
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
            {/* Candidate Orb */}
            <EsferaAura
              nombre={matchedCandidate.nombre}
              colorFrom={matchedCandidate.colorFrom}
              colorTo={matchedCandidate.colorTo}
              size={76}
            />
          </div>

          <p className="text-xs text-white/80 max-w-xs leading-relaxed font-medium">
            Tú y <strong className="text-pink-300">{matchedCandidate.nombre}</strong> están persiguiendo el mismo compromiso de transformación. ¡Ahora no lo enfrentas solo/a!
          </p>

          {/* Interactive Message Send */}
          {messageSentSuccess ? (
            <div className="mt-5 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>¡Mensaje de aliento enviado a {matchedCandidate.nombre}! ✦</span>
            </div>
          ) : (
            <div className="w-full max-w-xs mt-5 space-y-2.5">
              <input
                type="text"
                placeholder={`Envía un mensaje a ${matchedCandidate.nombre}...`}
                value={sentMessage}
                onChange={(e) => setSentMessage(e.target.value)}
                className="w-full px-4 py-3 glass-input text-xs text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!sentMessage.trim()}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-bold text-xs tracking-wide shadow-lg disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar aliento y continuar</span>
              </button>
            </div>
          )}

          <button
            onClick={cerrarMatch}
            className="mt-4 text-xs text-white/50 hover:text-white transition-colors underline"
          >
            Explorar más compañeros
          </button>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <BottomNav />
    </div>
  );
}
