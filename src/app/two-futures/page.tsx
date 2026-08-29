"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { getStoredUser, getStoredFutures, saveStoredFutures, getStoredHabits, UserProfile, TwoFuturesData } from "@/lib/store";
import { FutureScene } from "@/components/FutureScene";
import { BottomNav } from "@/components/BottomNav";

export default function TwoFuturesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [futures, setFutures] = useState<TwoFuturesData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchFuturesFromAI = useCallback(async (u: UserProfile) => {
    setIsGenerating(true);
    try {
      const habits = getStoredHabits(u.category);
      const completedHabitsCount = habits.filter((h) => h.completedToday).length;

      const res = await fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: u,
          habitsCount: habits.length,
          completedHabitsCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.darkFuture && data.brightFuture) {
          const newFutures: TwoFuturesData = {
            darkFuture: data.darkFuture,
            brightFuture: data.brightFuture,
            date: new Date().toISOString().split("T")[0],
            createdAt: Date.now(),
          };
          setFutures(newFutures);
          saveStoredFutures(newFutures);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.error("Error fetching from AI route", e);
    }

    // Dynamic fallback if route fails
    const isMental = u.category === "salud_mental";
    const darkText = isMental
      ? `En tres meses, ${u.name}, la ansiedad causada por ${
          u.anxietySource === "work" ? "las presiones del trabajo" : u.anxietySource || "el ritmo diario"
        } se vuelve constante. Decir "mañana medito" ha sido tu hábito diario. Tu meta ("${u.goal}") luce lejana.`
      : `En 90 días, ${u.name}, la falta de hábitos físicos te deja con fatiga constante. La inactividad frena tu avance hacia tu meta ("${u.goal}").`;

    const brightText = isMental
      ? `Imagina despertar sintiendo paz real, ${u.name}. Al sostener tus momentos diarios para tu mente, la calma reemplaza la prisa. Conquistas tu meta ("${u.goal}") con claridad.`
      : `Visualiza tu fuerza física en 90 días, ${u.name}. Cada hábito alimenta tu energía y alcanzas tu meta ("${u.goal}") con vitalidad radiante.`;

    const fallbackFutures: TwoFuturesData = {
      darkFuture: darkText,
      brightFuture: brightText,
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    };
    setFutures(fallbackFutures);
    saveStoredFutures(fallbackFutures);
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    const u = getStoredUser();
    if (u && u.name) {
      setUser(u);
      const f = getStoredFutures();
      if (f) {
        setFutures(f);
      } else {
        fetchFuturesFromAI(u);
      }
    } else {
      router.replace("/onboarding");
    }
  }, [fetchFuturesFromAI, router]);

  const handleRegenerate = () => {
    if (user) {
      fetchFuturesFromAI(user);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white/50">
        Cargando proyecciones de IA...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <Link
          href="/home"
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>

        <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Dos Futuros (Gemini 2.5 Flash)</span>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="p-2 rounded-full glass-card text-white/70 hover:text-white disabled:opacity-40"
          title="Regenerar con IA en vivo"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="my-auto py-4">
        {isGenerating || !futures ? (
          <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 border-t-cyan-400 animate-spin" />
            <h2 className="text-base font-bold text-white">Consultando a Gemini 2.5 Flash...</h2>
            <p className="text-xs text-white/50 max-w-xs">
              Sintonizando tu meta: &quot;{user.goal}&quot;
            </p>
          </div>
        ) : (
          <FutureScene darkFuture={futures.darkFuture} brightFuture={futures.brightFuture} />
        )}
      </div>

      {/* Bottom PWA Nav */}
      <BottomNav />
    </div>
  );
}
