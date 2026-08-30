"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserProfile, TwoFuturesData } from "@/lib/store";
import { FutureScene } from "@/components/FutureScene";
import { BottomNav } from "@/components/BottomNav";

export default function TwoFuturesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  
  const convexUser = useQuery(api.users.getById, userId ? { userId: userId as any } : "skip");
  const convexFutures = useQuery(api.twoFutures.getLatest, userId ? { userId: userId as any, date: new Date().toISOString().split("T")[0] } : "skip");
  const convexHabits = useQuery(api.habits.listByUser, userId ? { userId: userId as any } : "skip");
  const saveFutures = useMutation(api.twoFutures.save);
  
  const [futures, setFutures] = useState<TwoFuturesData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("aura_user_id");
    const storedPhoto = localStorage.getItem("aura_user_photo");
    if (storedId) {
      setUserId(storedId);
    } else {
      router.replace("/onboarding");
    }
    if (storedPhoto) setPhotoUrl(storedPhoto);
  }, [router]);

  // Map Convex user to local format
  const user: UserProfile | null = convexUser ? {
    id: convexUser._id,
    name: convexUser.name,
    ageRange: convexUser.ageRange,
    gender: convexUser.gender,
    weight: convexUser.weight,
    category: convexUser.category,
    goal: convexUser.goal,
    stressLevel: convexUser.stressLevel,
    sleepQuality: convexUser.sleepQuality,
    meditationExperience: convexUser.meditationExperience,
    anxietySource: convexUser.anxietySource,
    activityLevel: convexUser.activityLevel,
    exercisePerWeek: convexUser.exercisePerWeek,
    exerciseType: convexUser.exerciseType,
    avgSleepHours: convexUser.avgSleepHours,
    dailyWaterLiters: convexUser.dailyWaterLiters,
    weightGoal: convexUser.weightGoal,
    auraLevel: convexUser.auraLevel,
    currentStreak: convexUser.currentStreak,
    longestStreak: convexUser.longestStreak,
    photoUrl,
    currentAuraImageUrl: convexUser.currentAuraImageUrl,
    createdAt: convexUser.createdAt,
  } : null;

  // Set futures from Convex
  useEffect(() => {
    if (convexFutures) {
      setFutures({
        darkFuture: convexFutures.darkFuture,
        brightFuture: convexFutures.brightFuture,
        date: convexFutures.date,
        createdAt: convexFutures.createdAt,
      });
    }
  }, [convexFutures]);

  const fetchFuturesFromAI = useCallback(async (u: UserProfile) => {
    setIsGenerating(true);
    try {
      const completedCount = convexHabits?.length || 0;
      const res = await fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: u, habitsCount: 5, completedHabitsCount: completedCount }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.darkFuture && data.brightFuture && userId) {
          const today = new Date().toISOString().split("T")[0];
          await saveFutures({
            userId: userId as any,
            date: today,
            darkFuture: data.darkFuture,
            brightFuture: data.brightFuture,
          });
          setFutures({
            darkFuture: data.darkFuture,
            brightFuture: data.brightFuture,
            date: today,
            createdAt: Date.now(),
          });
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.error("Error fetching from AI route", e);
    }

    // Dynamic fallback
    const isMental = u.category === "salud_mental";
    const darkText = isMental
      ? `En tres meses, ${u.name}, la ansiedad causada por ${u.anxietySource === "work" ? "las presiones del trabajo" : u.anxietySource || "el ritmo diario"} se vuelve constante. Tu meta ("${u.goal}") luce lejana.`
      : `En 90 días, ${u.name}, la falta de hábitos físicos te deja con fatiga constante. Tu meta ("${u.goal}") luce lejana.`;
    const brightText = isMental
      ? `Imagina despertar sintiendo paz real, ${u.name}. Conquistas tu meta ("${u.goal}") con claridad.`
      : `Visualiza tu fuerza física en 90 días, ${u.name}. Alcanzas tu meta ("${u.goal}") con vitalidad radiante.`;

    if (userId) {
      const today = new Date().toISOString().split("T")[0];
      await saveFutures({ userId: userId as any, date: today, darkFuture: darkText, brightFuture: brightText });
    }
    setFutures({ darkFuture: darkText, brightFuture: brightText, date: new Date().toISOString().split("T")[0], createdAt: Date.now() });
    setIsGenerating(false);
  }, [userId, convexHabits, saveFutures]);

  useEffect(() => {
    if (user && !convexFutures) {
      fetchFuturesFromAI(user);
    }
  }, [user, convexFutures, fetchFuturesFromAI]);

  const handleRegenerate = () => {
    if (user) {
      setFutures(null);
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
          <span>Dos Futuros (MiMo V2.5)</span>
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
            <h2 className="text-base font-bold text-white">Consultando a MiMo V2.5...</h2>
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
