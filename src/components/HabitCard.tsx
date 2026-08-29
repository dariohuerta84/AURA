"use client";

import React from "react";
import { Check, Plus } from "lucide-react";
import confetti from "canvas-confetti";

interface HabitCardProps {
  id: string;
  title: string;
  difficulty: "easy" | "normal" | "hard";
  auraPoints: number;
  completed: boolean;
  onToggle: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  id,
  title,
  difficulty,
  auraPoints,
  completed,
  onToggle,
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!completed) {
      // Trigger subtle particle burst
      try {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 25,
          spread: 50,
          origin: { x, y },
          colors: ["#7C3AED", "#06B6D4", "#F59E0B"],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore fallback
      }
    }
    onToggle(id);
  };

  const difficultyLabels = {
    easy: { label: "Fácil", color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
    normal: { label: "Normal", color: "text-purple-400 bg-purple-950/40 border-purple-500/20" },
    hard: { label: "Desafío", color: "text-amber-400 bg-amber-950/40 border-amber-500/20" },
  }[difficulty];

  return (
    <div
      onClick={handleToggle}
      className={`group cursor-pointer transition-all duration-300 p-4 rounded-2xl border flex items-center justify-between gap-3 ${
        completed
          ? "bg-purple-950/20 border-purple-500/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
          : "glass-card hover:border-white/20"
      }`}
    >
      <div className="flex-1 flex flex-col gap-1 pr-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${difficultyLabels.color}`}
          >
            {difficultyLabels.label}
          </span>
          <span className="text-xs font-mono font-medium text-amber-300">
            +{auraPoints} pts
          </span>
        </div>
        <p
          className={`text-sm font-medium transition-all ${
            completed ? "line-through text-white/50" : "text-white/95"
          }`}
        >
          {title}
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
          completed
            ? "bg-gradient-to-r from-purple-600 to-cyan-500 border-white/40 text-white shadow-[0_0_15px_rgba(124,58,237,0.8)] scale-105"
            : "border-white/20 bg-white/5 text-white/30 hover:border-purple-400 hover:text-purple-400"
        }`}
      >
        {completed ? (
          <Check className="w-5 h-5 stroke-[3]" />
        ) : (
          <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
};
