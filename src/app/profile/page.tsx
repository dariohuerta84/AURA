"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame, Trophy, Calendar, Sparkles, RefreshCw, Zap, Award, LogOut } from "lucide-react";
import { getStoredUser, getStoredHabits, saveStoredUser, UserProfile, Habit } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { SignInButton, UserButton, useUser, useClerk } from "@clerk/nextjs";

function ClerkAccountSection({ user, handleResetProfile }: { user: UserProfile; handleResetProfile: () => void }) {
  let isSignedIn = false;
  let isLoaded = false;
  let openSignIn: any = null;

  try {
    const clerkUser = useUser();
    const clerk = useClerk();
    isSignedIn = Boolean(clerkUser.isSignedIn);
    isLoaded = Boolean(clerkUser.isLoaded);
    openSignIn = clerk.openSignIn;
  } catch {
    // Clerk not configured
  }

  const handleOpenSignIn = () => {
    if (openSignIn) {
      try {
        openSignIn({ fallbackRedirectUrl: "/profile" });
      } catch (e) {
        console.error("Clerk openSignIn error", e);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isLoaded && isSignedIn ? (
        <UserButton />
      ) : (
        <button
          type="button"
          onClick={handleOpenSignIn}
          className="text-xs px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-medium hover:text-white transition-all cursor-pointer"
        >
          ✦ Sincronizar Cuenta
        </button>
      )}
      <button
        type="button"
        onClick={handleResetProfile}
        className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors pl-1"
        title="Reiniciar perfil"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  let signOut: any = null;
  try {
    signOut = useClerk().signOut;
  } catch {
    // Clerk not configured
  }

  const handleLogout = async () => {
    if (confirm("¿Deseas cerrar sesión y reiniciar la sesión en este dispositivo?")) {
      localStorage.clear();
      try {
        if (signOut) await signOut();
      } catch {
        // fallback
      }
      router.replace("/");
    }
  };

  const [user, setUser] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const u = getStoredUser();
    if (u && u.name) {
      setUser(u);
      setHabits(getStoredHabits(u.category));
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  const handleResetProfile = () => {
    if (confirm("¿Quieres reiniciar tu perfil y volver al onboarding?")) {
      localStorage.clear();
      router.replace("/onboarding");
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white/50">
        Cargando historial...
      </div>
    );
  }

  const completedCount = habits.filter((h) => h.completedToday).length;
  const completionPercentage = Math.round((completedCount / (habits.length || 1)) * 100);

  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Header with Clerk Account Sync */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h1 className="text-base font-bold text-white tracking-wide">Tu Viaje de Aura</h1>
        <ClerkAccountSection user={user} handleResetProfile={handleResetProfile} />
      </div>

      {/* Profile Card & Streak Badge */}
      <div className="my-4 space-y-3">
        <div className="glass-card p-5 flex items-center justify-between border-purple-500/30">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
              CATEGORÍA: {user.category === "salud_mental" ? "SALUD MENTAL" : "SALUD FÍSICA"}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{user.name}</h2>
            <p className="text-xs text-white/60 mt-1 line-clamp-2 font-light">
              &quot;{user.goal}&quot;
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400 mb-1" />
            <span className="text-lg font-black font-mono leading-none">{user.currentStreak}</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300/80">
              DÍAS RACHA
            </span>
          </div>
        </div>

        {/* Weekly Activity Calendar */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-3 font-semibold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Actividad Semanal</span>
            </div>
            <span className="text-purple-300 font-mono">{completionPercentage}% Hoy</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === 5; // Saturday
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white/40 uppercase font-medium">{day}</span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border text-xs font-bold transition-all ${
                      isToday
                        ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_12px_rgba(124,58,237,0.6)]"
                        : idx < 5
                        ? "bg-purple-950/40 border-purple-500/30 text-purple-300"
                        : "bg-white/5 border-white/10 text-white/30"
                    }`}
                  >
                    {isToday ? "◉" : "✓"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Auras Gallery */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-3 font-semibold">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Galería de Auras</span>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[
              { day: "Día 1", level: 50, status: "Estable", col: "from-purple-900 to-indigo-950" },
              { day: "Día 2", level: 58, status: "Brillante", col: "from-purple-600 to-cyan-900" },
              { day: "Hoy", level: user.auraLevel, status: "Radiante", col: "from-cyan-500 to-purple-600", active: true },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-24 p-3 rounded-2xl border text-center flex flex-col items-center justify-between ${
                  item.active
                    ? "bg-gradient-to-br " + item.col + " border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-white/70">{item.day}</span>
                <div className="my-2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-mono font-bold text-xs text-white">
                  {item.level}
                </div>
                <span className="text-[9px] text-amber-300 font-semibold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass-card p-4 flex items-center justify-around text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-0.5">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-base font-extrabold">{user.auraLevel}</span>
            </div>
            <span className="text-[10px] text-white/50 uppercase font-semibold">Nivel Aura</span>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Award className="w-4 h-4" />
              <span className="font-mono text-base font-extrabold">{user.longestStreak}</span>
            </div>
            <span className="text-[10px] text-white/50 uppercase font-semibold">Racha Máx</span>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div>
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
              <Trophy className="w-4 h-4" />
              <span className="font-mono text-base font-extrabold">{completedCount}</span>
            </div>
            <span className="text-[10px] text-white/50 uppercase font-semibold">Logros Hoy</span>
          </div>
        </div>

        {/* Logout / Reset Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 px-4 rounded-2xl glass-card border border-red-500/30 hover:border-red-500/60 text-red-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-red-950/20 mt-2"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Cerrar Sesión / Reiniciar Perfil</span>
        </button>
      </div>

      {/* Bottom PWA Nav */}
      <BottomNav />
    </div>
  );
}
