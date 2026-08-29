"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Plus, Brain, Activity, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStoredUser, getStoredHabits, saveStoredHabits, saveStoredUser, UserProfile, Habit } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";
import { HabitCard } from "@/components/HabitCard";
import { BottomNav } from "@/components/BottomNav";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (u && u.name) {
      setUser(u);
      setHabits(getStoredHabits(u.category));
    } else {
      router.replace("/onboarding");
    }
    setIsLoaded(true);
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
      <div className="flex-1 flex items-center justify-center p-6 text-white/50">
        Cargando tu energía...
      </div>
    );
  }

  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A1A] rounded-full flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{user.name}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300">
              {user.category === "salud_mental" ? (
                <>
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span>Salud Mental</span>
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
        <AuraOrb auraLevel={user.auraLevel} streak={user.currentStreak} size="md" showDetails={true} />
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
              {completedCount}/{habits.length}
            </span>
          </div>
          {completedCount === habits.length && habits.length > 0 && (
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              ¡Completos!
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              title={habit.title}
              difficulty={habit.difficulty}
              auraPoints={habit.auraPoints}
              completed={!!habit.completedToday}
              onToggle={handleToggleHabit}
            />
          ))}
        </div>
      </div>

      {/* PWA Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
