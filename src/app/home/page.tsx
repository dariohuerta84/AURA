"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Plus, Brain, Activity, CheckCircle2, Loader2, Target, X, PlusCircle, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserProfile, Habit, saveStoredFutures } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";
import { HabitCard } from "@/components/HabitCard";
import { BottomNav } from "@/components/BottomNav";
import confetti from "canvas-confetti";

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
  
  // Get userId from localStorage (set during onboarding)
  const [userId, setUserId] = useState<string | null>(null);
  
  // Convex queries
  const convexUser = useQuery(api.users.getById, userId ? { userId: userId as any } : "skip");
  const convexHabits = useQuery(api.habits.listByUser, userId ? { userId: userId as any } : "skip");
  const todayCheckIns = useQuery(api.checkIns.getToday, userId ? { userId: userId as any, date: new Date().toISOString().split("T")[0] } : "skip");
  
  // Convex mutations
  const toggleCheckIn = useMutation(api.checkIns.toggle);
  const replaceUserHabits = useMutation(api.habits.replaceUserHabits);
  const createHabit = useMutation(api.habits.create);
  const updateAura = useMutation(api.users.updateAura);

  // Local state for UI
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [isGeneratingAiHabits, setIsGeneratingAiHabits] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState("");
  const [isGeneratingGoalHabits, setIsGeneratingGoalHabits] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [customHabitTitle, setCustomHabitTitle] = useState("");
  const [habitDifficulty, setHabitDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [isGeneratingSingleHabit, setIsGeneratingSingleHabit] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Load userId and photo from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("aura_user_id");
    const storedPhoto = localStorage.getItem("aura_user_photo");
    if (storedId) {
      setUserId(storedId);
    } else {
      router.replace("/onboarding");
    }
    if (storedPhoto) {
      setPhotoUrl(storedPhoto);
    }
  }, [router]);

  // Map Convex data to local format
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

  // Map habits with check-in status
  const habits: Habit[] = (convexHabits || []).map((h) => ({
    id: h._id,
    title: h.title,
    category: h.category,
    isDefault: h.isDefault,
    difficulty: h.difficulty,
    auraPoints: h.auraPoints,
    completedToday: todayCheckIns?.some((c) => c.habitId === h._id && c.completed) || false,
  }));

  const handleToggleHabit = async (id: string) => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      await toggleCheckIn({ userId: userId as any, habitId: id as any, date: today });
    } catch (e) {
      console.error("Error toggling habit:", e);
    }
  };

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
        if (data.title && userId) {
          // Replace all habits (keep this one, replace the target)
          const newHabits = habits.map((h) => {
            if (h.id === id) {
              return { title: data.title, category: user.category, difficulty: data.difficulty || targetHabit.difficulty, auraPoints: data.auraPoints || targetHabit.auraPoints };
            }
            return { title: h.title, category: h.category, difficulty: h.difficulty, auraPoints: h.auraPoints };
          });
          await replaceUserHabits({ userId: userId as any, habits: newHabits });
        }
      }
    } catch (e) {
      console.error("Error replacing habit", e);
    } finally {
      setReplacingId(null);
    }
  };

  // Auto-regenerate AI habits if they're still defaults
  useEffect(() => {
    if (!userId || !user || !convexHabits || convexHabits.length === 0) return;

    const staticSeedKeywords = [
      "meditar 5 minutos", "escribir 3 cosas", "leer 15 minutos",
      "journaling", "desconectar pantallas", "tomar 2 litros",
      "caminar 20 minutos", "ejercicio activo", "comer 1 comida",
      "dormir entre 7 y 8", "comer sin alimentos",
    ];

    const isStaticDefault = convexHabits.every((h) => h.isDefault) ||
      convexHabits.some((h) => staticSeedKeywords.some((k) => h.title.toLowerCase().includes(k)));

    if (isStaticDefault) {
      setIsGeneratingAiHabits(true);
      fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, habitsCount: 5 }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.habits && Array.isArray(data.habits) && data.habits.length > 0) {
            await replaceUserHabits({
              userId: userId as any,
              habits: data.habits.map((h: any) => ({
                title: h.title || "",
                category: user.category,
                difficulty: h.difficulty || "normal",
                auraPoints: h.auraPoints || 8,
              })),
            });
          }
        })
        .catch(() => {})
        .finally(() => setIsGeneratingAiHabits(false));
    }
  }, [userId, user, convexHabits]);

  const handleSaveNewGoalAndHabits = async () => {
    if (!newGoalInput.trim() || !user || !userId) return;
    setIsGeneratingGoalHabits(true);

    try {
      const updatedUser = { ...user, goal: newGoalInput.trim() };
      const res = await fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: updatedUser, habitsCount: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.habits && Array.isArray(data.habits) && data.habits.length > 0) {
          await replaceUserHabits({
            userId: userId as any,
            habits: data.habits.map((h: any) => ({
              title: h.title || "",
              category: user.category,
              difficulty: h.difficulty || "normal",
              auraPoints: h.auraPoints || 8,
            })),
          });
        }
        if (data.darkFuture && data.brightFuture) {
          saveStoredFutures({
            darkFuture: data.darkFuture,
            brightFuture: data.brightFuture,
            date: new Date().toISOString().split("T")[0],
            createdAt: Date.now(),
          });
        }
      }
    } catch (e) {
      console.error("Error updating goal with AI", e);
    } finally {
      setIsGeneratingGoalHabits(false);
      setShowGoalModal(false);
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors: ["#7C3AED", "#06B6D4", "#F59E0B"] });
      } catch {}
    }
  };

  const handleGenerateSingleHabitWithAI = async () => {
    if (!user || !userId) return;
    setIsGeneratingSingleHabit(true);

    try {
      const existingTitles = habits.map((h) => h.title);
      const res = await fetch("/api/replace-habit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, targetDifficulty: habitDifficulty, existingTitles, oldHabitTitle: user.goal }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          const auraPoints = habitDifficulty === "easy" ? 5 : habitDifficulty === "normal" ? 8 : 12;
          await createHabit({
            userId: userId as any,
            title: data.title,
            category: user.category,
            difficulty: habitDifficulty,
            auraPoints,
          });
        }
      }
    } catch (e) {
      console.error("Error generating single habit", e);
    } finally {
      setIsGeneratingSingleHabit(false);
      setShowAddHabitModal(false);
    }
  };

  const handleAddManualHabit = async () => {
    if (!customHabitTitle.trim() || !user || !userId) return;
    const auraPoints = habitDifficulty === "easy" ? 5 : habitDifficulty === "normal" ? 8 : 12;
    
    await createHabit({
      userId: userId as any,
      title: customHabitTitle.trim(),
      category: user.category,
      difficulty: habitDifficulty,
      auraPoints,
    });

    setCustomHabitTitle("");
    setShowAddHabitModal(false);
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

      {/* Primary Action Button: Dos Futuros */}
      <div className="my-2">
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

      {/* Current Active Goal Card Banner */}
      <div className="my-2 glass-card p-3.5 rounded-2xl border border-purple-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex-1 pr-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-purple-400">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>Meta Personal Actual</span>
          </div>
          <p className="text-xs font-semibold text-white mt-1 line-clamp-2">
            &quot;{user.goal}&quot;
          </p>
        </div>
        {/* BUTTON 1: NUEVA META */}
        <button
          type="button"
          onClick={() => {
            setNewGoalInput(user.goal);
            setShowGoalModal(true);
          }}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/50 text-white text-xs font-bold shadow-md flex items-center gap-1 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Target className="w-3.5 h-3.5" />
          <span>+ Nueva Meta</span>
        </button>
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

          {/* BUTTON 2: NUEVO HÁBITO */}
          <button
            type="button"
            onClick={() => setShowAddHabitModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer hover:scale-105 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Nuevo Hábito</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {isGeneratingAiHabits ? (
            <div className="space-y-2.5">
              <div className="p-3 text-center rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Generando hábitos personalizados con IA para tu meta...</span>
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

      {/* MODAL 1: NUEVA META PERSONAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-purple-500/40 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Cambiar Meta Personal</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="p-1 rounded-full glass-card text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/70 font-medium block">
                Escribe tu nueva meta en tus palabras:
              </label>
              <textarea
                rows={3}
                placeholder="Ejemplo: Quiero reducir el estrés laboral y terminar mis tareas antes de las 6pm..."
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                className="w-full p-3 glass-input text-xs leading-relaxed resize-none text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveNewGoalAndHabits}
              disabled={!newGoalInput.trim() || isGeneratingGoalHabits}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-lg disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isGeneratingGoalHabits ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando 5 Hábitos con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Generar 5 Hábitos para esta Meta ✨</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: NUEVO HÁBITO INDIVIDUAL */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-cyan-500/40 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Agregar Nuevo Hábito</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHabitModal(false)}
                className="p-1 rounded-full glass-card text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-white/70 font-semibold block uppercase tracking-wider">
                Dificultad y Puntos de Aura:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "easy", label: "Fácil", pts: "+5 pts", col: "border-cyan-500/40 text-cyan-300" },
                  { key: "normal", label: "Normal", pts: "+8 pts", col: "border-purple-500/40 text-purple-300" },
                  { key: "hard", label: "Desafío", pts: "+12 pts", col: "border-amber-500/40 text-amber-300" },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setHabitDifficulty(d.key as any)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      habitDifficulty === d.key
                        ? "glass-card-active text-white border-cyan-400"
                        : "glass-card text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className={`text-[10px] font-mono ${d.col}`}>{d.pts}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Option A: AI Single Habit Generator */}
            <button
              type="button"
              onClick={handleGenerateSingleHabitWithAI}
              disabled={isGeneratingSingleHabit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-xs tracking-wide shadow-lg disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isGeneratingSingleHabit ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Generando hábito con IA...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                  <span>✨ Generar 1 Hábito con IA</span>
                </>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-2 text-[10px] text-white/40 uppercase tracking-widest font-semibold">o ingresar manual</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Option B: Custom Manual Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nombre del hábito..."
                value={customHabitTitle}
                onChange={(e) => setCustomHabitTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddManualHabit()}
                className="flex-1 px-3 py-2.5 glass-input text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddManualHabit}
                disabled={!customHabitTitle.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs disabled:opacity-40 hover:bg-white/20 transition-all shrink-0 cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
