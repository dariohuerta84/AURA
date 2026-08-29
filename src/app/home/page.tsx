"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Plus, Brain, Activity, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStoredUser, getStoredHabits, saveStoredHabits, saveStoredUser, UserProfile, Habit } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";
import { HabitCard } from "@/components/HabitCard";
import { BottomNav } from "@/components/BottomNav";

function HabitSkeletonCard() {
  return (
    <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-14 h-4 rounded-full bg-white/15" />
          <div className="w-10 h-3 rounded-full bg-amber-400/20" />
        </div>
        <div className="w-5/6 h-4 rounded-md bg-white/10" />
      </div>
      <div className="w-9 h-9 rounded-full bg-white/10 shrink-0" />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [isGeneratingAiHabits, setIsGeneratingAiHabits] = useState(false);

  const handleReplaceHabit = async (id: string) => {
    if (!user || replacingId) return;

    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    setReplacingId(id);

    try {
      const existingTitles = habits.map((h) => h.title);
      const res = await fetch("/api/replace-habit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          targetDifficulty: targetHabit.difficulty,
          existingTitles,
          oldHabitTitle: targetHabit.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          const newHabit: Habit = {
            id: `ai_rep_${Date.now()}`,
            title: data.title,
            category: user.category,
            isDefault: false,
            difficulty: data.difficulty || targetHabit.difficulty,
            auraPoints: data.auraPoints || targetHabit.auraPoints,
            completedToday: false,
          };

          const updated = habits.map((h) => (h.id === id ? newHabit : h));
          setHabits(updated);
          saveStoredHabits(updated);
        }
      }
    } catch (e) {
      console.error("Error al reemplazar hábito", e);
    } finally {
      setReplacingId(null);
    }
  };

  useEffect(() => {
    const u = getStoredUser();
    if (u && u.name) {
      setUser(u);
      const currentHabits = getStoredHabits(u.category);
      setHabits(currentHabits);

      // Auto-regenerate with AI if habits are still the default static ones or empty
      const allDefault = currentHabits.length === 0 || currentHabits.every((h) => h.isDefault === true);
      if (allDefault) {
        setIsGeneratingAiHabits(true);
        fetch("/api/generate-futures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: u, habitsCount: 5 }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.habits && Array.isArray(data.habits) && data.habits.length > 0) {
              const aiHabits: Habit[] = data.habits.map((h: any, i: number) => ({
                id: `ai_${Date.now()}_${i}`,
                title: h.title || "",
                category: u.category,
                isDefault: false,
                difficulty: h.difficulty || "normal",
                auraPoints: h.auraPoints || 8,
                completedToday: false,
              }));
              setHabits(aiHabits);
              saveStoredHabits(aiHabits);
            }
          })
          .catch(() => {/* keep defaults on network error */})
          .finally(() => {
            setIsGeneratingAiHabits(false);
          });
      }
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  const handleToggleHabit = (id: string) => {
    if (!user) return;

    const updated = habits.map((h) => {
      if (h.id === id) {
        return { ...h, completedToday: !h.completedToday };
      }
      return h;
    });

    setHabits(updated);
    saveStoredHabits(updated);

    // Calculate updated aura
    const completedCount = updated.filter((h) => h.completedToday).length;
    const totalCount = updated.length || 1;
    const ratio = completedCount / totalCount;
    const streakBonus = Math.min(15, user.currentStreak * 2);

    const newAuraLevel = Math.min(100, Math.max(10, Math.round(30 + ratio * 55 + streakBonus)));

    const updatedUser = { ...user, auraLevel: newAuraLevel };
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white/50 min-h-screen">
        <Sparkles className="w-8 h-8 text-purple-400 mb-3 animate-pulse" />
        <p className="text-sm">Cargando tu energía...</p>
      </div>
    );
  }

  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center relative overflow-hidden">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-[#0A0A1A] rounded-full flex items-center justify-center text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{user.name}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300">
              {user.category === "salud_mental" ? (
                <>
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span>Salud Emocional</span>
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>Salud Física</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>{user.currentStreak}d racha</span>
        </div>
      </div>

      {/* Central Aura Orb Display */}
      <div className="my-2 text-center">
        <AuraOrb auraLevel={user.auraLevel} streak={user.currentStreak} photoUrl={user.photoUrl} size="md" showDetails={true} />
      </div>

      {/* Primary WOW Action Button: Dos Futuros */}
      <div className="my-3">
        <Link
          href="/two-futures"
          className="w-full py-4 px-5 rounded-2xl glow-button text-white font-bold text-sm tracking-wide shadow-2xl flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <div className="text-left">
              <div className="text-sm font-extrabold text-white">Ver mis Dos Futuros ✨</div>
              <div className="text-[11px] font-normal text-white/80">Proyección generada con Inteligencia Artificial</div>
            </div>
          </div>
          <span className="text-xs text-amber-200 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Daily Habits Section */}
      <div className="mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">Hábitos de Hoy</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
              {isGeneratingAiHabits ? "..." : `${completedCount}/${habits.length}`}
            </span>
          </div>
          {completedCount === habits.length && habits.length > 0 && !isGeneratingAiHabits && (
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              ¡Completos!
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {isGeneratingAiHabits ? (
            <div className="space-y-2.5">
              <div className="p-3 text-center rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Generando hábitos personalizados con IA...</span>
              </div>
              <HabitSkeletonCard />
              <HabitSkeletonCard />
              <HabitSkeletonCard />
              <HabitSkeletonCard />
              <HabitSkeletonCard />
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                difficulty={habit.difficulty}
                auraPoints={habit.auraPoints}
                completed={!!habit.completedToday}
                isReplacing={replacingId === habit.id}
                onToggle={handleToggleHabit}
                onReplace={handleReplaceHabit}
              />
            ))
          )}
        </div>
      </div>

      {/* PWA Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
