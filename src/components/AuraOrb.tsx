"use client";

import React, { useMemo } from "react";
import { Sparkles, Flame, Zap } from "lucide-react";

interface AuraOrbProps {
  auraLevel: number; // 0-100
  streak: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export const AuraOrb: React.FC<AuraOrbProps> = ({
  auraLevel,
  streak,
  size = "md",
  showDetails = true,
}) => {
  const tier = useMemo(() => {
    if (auraLevel <= 20) return { title: "APAGADA", color: "#6B7280", gradient: "from-gray-700 via-purple-950 to-black", textCol: "text-gray-400" };
    if (auraLevel <= 40) return { title: "TENUE", color: "#A78BFA", gradient: "from-purple-900 via-indigo-950 to-slate-950", textCol: "text-purple-300" };
    if (auraLevel <= 60) return { title: "ESTABLE", color: "#7C3AED", gradient: "from-purple-600 via-indigo-900 to-slate-950", textCol: "text-purple-400" };
    if (auraLevel <= 80) return { title: "BRILLANTE", color: "#06B6D4", gradient: "from-cyan-500 via-purple-600 to-indigo-950", textCol: "text-cyan-300" };
    return { title: "RADIANTE", color: "#F59E0B", gradient: "from-amber-400 via-purple-600 to-cyan-500", textCol: "text-amber-300" };
  }, [auraLevel]);

  const orbDimensions = {
    sm: "w-24 h-24",
    md: "w-44 h-44",
    lg: "w-60 h-60",
  }[size];

  return (
    <div className="flex flex-col items-center justify-center relative my-4">
      {/* Outer Glowing Rings & Particles */}
      <div className="relative flex items-center justify-center">
        {/* Glow Aura Backdrop */}
        <div
          className={`absolute rounded-full filter blur-2xl opacity-60 transition-all duration-700 ease-out bg-gradient-to-r ${tier.gradient} ${orbDimensions}`}
          style={{ transform: `scale(${1 + auraLevel / 200})` }}
        />

        {/* Floating Particles (Decorative) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-2 h-2 rounded-full bg-amber-300 blur-[1px] animate-[floatParticle_3s_infinite] top-2 left-8 opacity-80" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 blur-[1px] animate-[floatParticle_4s_infinite_1s] bottom-4 right-10 opacity-70" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-300 blur-[1px] animate-[floatParticle_5s_infinite_2s] top-10 right-4 opacity-90" />
        </div>

        {/* Central Core Glowing Orb */}
        <div
          className={`aura-orb-element ${orbDimensions} rounded-full bg-gradient-to-br ${tier.gradient} flex flex-col items-center justify-center border border-white/20 shadow-2xl transition-transform duration-500`}
        >
          <div className="absolute inset-2 rounded-full bg-black/20 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2">
            <Sparkles className={`w-5 h-5 mb-1 ${tier.textCol} animate-pulse`} />
            <span className="font-mono text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
              {auraLevel}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
              AURA
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className={`text-xs font-semibold tracking-wider ${tier.textCol}`}>
              NIVEL: {tier.title}
            </span>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}d racha</span>
            </div>
          </div>

          {/* Sleek Aura Level Progress Bar */}
          <div className="w-48 bg-white/10 h-2 rounded-full overflow-hidden mt-1 p-[1px] backdrop-blur-md border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(124,58,237,0.8)]"
              style={{ width: `${auraLevel}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
