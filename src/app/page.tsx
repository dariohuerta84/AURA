"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { getStoredUser } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";

function ClerkSignInWidget() {
  try {
    const { isLoaded, isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    if (isLoaded && isSignedIn) {
      return (
        <Link
          href="/home"
          className="w-full py-3 rounded-full glass-card text-xs font-medium text-cyan-300 border-cyan-500/30 flex items-center justify-center gap-1.5"
        >
          <span>Sesión Activa con Google ✓</span>
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() =>
          openSignIn({
            fallbackRedirectUrl: "/home",
            signUpFallbackRedirectUrl: "/onboarding",
          })
        }
        className="w-full py-3 rounded-full glass-card text-xs font-medium text-white/70 hover:text-white border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Ya tengo una cuenta / Sincronizar con Google</span>
      </button>
    );
  } catch {
    return (
      <Link
        href="/onboarding"
        className="w-full py-3 rounded-full glass-card text-xs font-medium text-white/70 hover:text-white border-white/10 flex items-center justify-center gap-1.5"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Sincronización PWA Activa</span>
      </Link>
    );
  }
}

export default function SplashLandingPage() {
  const router = useRouter();
  const [hasExistingLocalProfile, setHasExistingLocalProfile] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.name) {
      setHasExistingLocalProfile(true);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 min-h-screen relative text-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-amber-500/20 blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="pt-6 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Transformación Personal con IA</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(124,58,237,0.5)]">
          ✦ A U R A ✦
        </h1>
        <p className="text-xs text-white/60 mt-1 font-light tracking-wide">
          Eleva tu energía vital día a día
        </p>
      </div>

      {/* Central Breathtaking Glowing Aura Orb */}
      <div className="my-auto z-10 scale-110 animate-in zoom-in fade-in duration-1000">
        <AuraOrb auraLevel={75} streak={1} size="lg" showDetails={false} />
        <div className="mt-2 text-xs font-semibold text-cyan-300 tracking-widest uppercase">
          ✦ NIVEL AURA: BRILLANTE ✦
        </div>
      </div>

      {/* Bottom CTA Action Buttons */}
      <div className="w-full space-y-3 pb-4 z-10">
        {hasExistingLocalProfile ? (
          <Link
            href="/home"
            className="w-full py-4 rounded-full glow-button text-white font-bold text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2"
          >
            <span>Continuar con mi Aura</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/onboarding"
            className="w-full py-4 rounded-full glow-button text-white font-bold text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2"
          >
            <span>Comenzar mi viaje ✦</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {/* Safe Clerk Account Recovery Widget */}
        <ClerkSignInWidget />

        <p className="text-[10px] text-white/40 pt-1">
          Hackathon Project • Next.js + Convex + Gemini AI + Clerk
        </p>
      </div>
    </div>
  );
}
