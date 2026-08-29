"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Sparkles, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "Inicio", icon: Home },
    { href: "/match", label: "Aura Match", icon: Flame, highlight: true },
    { href: "/two-futures", label: "Dos Futuros", icon: Sparkles },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-auto">
      <div className="glass-card flex items-center justify-around py-2.5 px-3 border border-white/15 bg-black/70 backdrop-blur-xl rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-center p-3.5 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.7)] transition-all duration-300 ${
                  isActive ? "scale-110 ring-2 ring-white/80" : "hover:scale-105"
                }`}
              >
                <Icon className="w-5 h-5 text-white fill-white" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive ? "text-purple-400 font-semibold" : "text-white/50 hover:text-white/80"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-purple-400" : "text-white/50"}`} />
              <span className="text-[10px] tracking-wide font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
