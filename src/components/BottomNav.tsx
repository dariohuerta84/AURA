"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/two-futures", label: "Dos Futuros", icon: Sparkles, highlight: true },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-auto">
      <div className="glass-card flex items-center justify-around py-2.5 px-3 border border-white/15 bg-black/60 backdrop-blur-xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all duration-300 ${
                  isActive ? "scale-110 ring-2 ring-white/60" : "hover:scale-105"
                }`}
              >
                <Icon className="w-5 h-5 animate-pulse" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
                isActive ? "text-purple-400 font-semibold" : "text-white/50 hover:text-white/80"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-purple-400" : "text-white/50"}`} />
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
