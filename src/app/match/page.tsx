"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Flame, X, Sparkles, MessageCircle, ShieldCheck, Send, ArrowLeft, Loader2 } from "lucide-react";
import { getStoredUser, getCommunityCandidates, CommunityCandidate, UserProfile } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import confetti from "canvas-confetti";

export type MatchCandidate = {
  id: number;
  nombre: string;
  categoria: string;
  categoryKey: "salud_mental" | "salud_fisica";
  habito: string;
  racha: number;
  auraLevel: number;
  colorFrom: string;
  colorTo: string;
  bio: string;
};

export interface ChatMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: number;
}

function EsferaAura({
  nombre,
  colorFrom,
  colorTo,
  photoUrl,
  size = 96,
}: {
  nombre: string;
  colorFrom: string;
  colorTo: string;
  photoUrl?: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-extrabold text-white shrink-0 shadow-2xl transition-transform duration-500 hover:scale-105 relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, ${colorFrom}, ${colorTo} 75%)`,
        boxShadow: `0 0 ${size * 0.4}px ${size * 0.1}px ${colorFrom}88`,
        fontSize: size * 0.35,
      }}
    >
      {photoUrl ? (
        <>
          <img
            src={photoUrl}
            alt={nombre}
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay scale-110"
          />
          <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{nombre[0]}</span>
        </>
      ) : (
        nombre[0]
      )}
    </div>
  );
}

export default function HabitMatchPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<CommunityCandidate[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [matchedCandidate, setMatchedCandidate] = useState<CommunityCandidate | null>(null);

  // Chat State
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.name) {
      setCurrentUser(user);
      const all = getCommunityCandidates();
      const others = all.filter((c) => c.nombre !== user.name && c.id !== user.id);
      const sameCat = others.filter((c) => c.categoryKey === user.category);
      const diffCat = others.filter((c) => c.categoryKey !== user.category);
      setCandidates([...sameCat, ...diffCat]);
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  // Load persistent chat history when a candidate is matched
  useEffect(() => {
    if (matchedCandidate) {
      const storageKey = `aura_chat_msg_${matchedCandidate.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setChatMessages(JSON.parse(saved));
        } catch {
          setChatMessages([]);
        }
      } else {
        // Initial greeting message from candidate
        const initialMsg: ChatMessage = {
          id: `msg_init_${Date.now()}`,
          sender: "companion",
          text: `¡Hola ${currentUser?.name || "compañero"}! 🌟 Me alegra hacer match. Yo estoy enfocado/a en "${matchedCandidate.habito}". ¿Cómo va tu día?`,
          timestamp: Date.now(),
        };
        setChatMessages([initialMsg]);
        localStorage.setItem(storageKey, JSON.stringify([initialMsg]));
      }
    }
  }, [matchedCandidate, currentUser]);

  useEffect(() => {
    if (showChatModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChatModal, isTyping]);

  if (!currentUser || candidates.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white/50 min-h-screen">
        <Sparkles className="w-8 h-8 text-purple-400 mb-3 animate-pulse" />
        <p className="text-sm">Cargando tu comunidad de hábitos...</p>
      </div>
    );
  }

  const actualCandidate = candidates[index % candidates.length];

  const siguiente = () => {
    setIndex((i) => i + 1);
  };

  const darLike = () => {
    setMatchedCandidate(actualCandidate);
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#f97316", "#8B5CF6", "#fbbf24"],
      });
    } catch {
      // fallback
    }
  };

  const pasar = () => {
    siguiente();
  };

  const cerrarMatch = () => {
    setMatchedCandidate(null);
    setShowChatModal(false);
    setChatInput("");
    siguiente();
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !matchedCandidate) return;

    const userText = chatInput.trim();
    setChatInput("");

    const newMsg: ChatMessage = {
      id: `msg_usr_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    localStorage.setItem(`aura_chat_msg_${matchedCandidate.id}`, JSON.stringify(updated));

    setIsTyping(true);

    // Simulate real-time companion reply
    setTimeout(() => {
      const responses = [
        `¡Muchas gracias por tu aliento, ${currentUser.name}! 💜 Mi meta de ${matchedCandidate.categoria.toLowerCase()} me tiene súper motivado/a. ¡Sigamos constantes hoy! 🔥`,
        `¡Totalmente de acuerdo! Sostener el hábito de "${matchedCandidate.habito}" ha sido un cambio enorme para mí. ¡Tú también lograrás tu meta! ✨`,
        `¡Gracias por la vibra positiva, ${currentUser.name}! Vamos a darle con todo hoy. ¡Tu aura se siente radiante! ⚡`,
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const companionReply: ChatMessage = {
        id: `msg_cmp_${Date.now()}`,
        sender: "companion",
        text: randomReply,
        timestamp: Date.now(),
      };

      const finalMsgs = [...updated, companionReply];
      setChatMessages(finalMsgs);
      localStorage.setItem(`aura_chat_msg_${matchedCandidate.id}`, JSON.stringify(finalMsgs));
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-pink-400">
            <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
            <span>Aura Habit Match</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-wide">Comunidad de Hábitos</h1>
        </div>
        <div className="px-3 py-1 rounded-full glass-card text-xs font-semibold text-purple-300 border border-purple-500/30">
          {currentUser.category === "salud_mental" ? "🧠 Salud Emocional" : "💪 Salud Física"}
        </div>
      </div>

      {/* MATCH MODAL vs CARD SWIPER */}
      {!matchedCandidate ? (
        <div className="my-auto flex flex-col items-center justify-center z-10 w-full animate-in fade-in zoom-in duration-300">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-4 font-medium">
            Personas elevando su aura en tu categoría
          </p>

          {/* Candidate Card */}
          <div className="w-full glass-card p-6 rounded-3xl border border-white/15 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            {/* Top Match Tag */}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold tracking-wider">
              ✦ {actualCandidate.auraLevel}% AURA
            </div>

            {/* Glowing Aura Orb Avatar */}
            <div className="my-2">
              <EsferaAura
                nombre={actualCandidate.nombre}
                colorFrom={actualCandidate.colorFrom}
                colorTo={actualCandidate.colorTo}
                size={90}
              />
            </div>

            <h2 className="text-xl font-bold text-white mt-3">{actualCandidate.nombre}</h2>

            <span className="mt-1 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              {actualCandidate.categoria}
            </span>

            <p className="text-xs text-white/50 mt-4">También está construyendo el hábito:</p>
            <p className="text-sm text-white font-semibold mt-1 px-2 italic">
              "{actualCandidate.habito}"
            </p>

            <p className="text-xs text-white/60 mt-3 font-light max-w-xs">
              "{actualCandidate.bio}"
            </p>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{actualCandidate.racha} días de racha activa</span>
            </div>
          </div>

          {/* Swipe Buttons (X & Match Logo) */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <button
              onClick={pasar}
              className="w-14 h-14 rounded-full glass-card border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all shadow-lg active:scale-95 cursor-pointer"
              aria-label="Pasar"
              title="Pasar"
            >
              <X className="w-6 h-6 text-white/50 hover:text-white" />
            </button>

            <button
              onClick={darLike}
              className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Conectar Match"
              title="Hacer Match"
            >
              <img
                src="/logo-azul.png"
                alt="Match Aura"
                className="w-full h-full object-cover scale-110"
              />
            </button>
          </div>
        </div>
      ) : !showChatModal ? (
        /* MATCH REVEAL SCREEN */
        <div className="my-auto flex flex-col items-center justify-center text-center z-10 w-full animate-in zoom-in fade-in duration-500">
          <div className="relative mb-2">
            <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl animate-pulse" />
            <img
              src="/logo-naranja.png"
              alt="Match Logrado"
              className="w-20 h-20 object-contain relative z-10 animate-bounce drop-shadow-[0_0_35px_rgba(249,115,22,0.9)]"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">
            ¡Conexión de Aura! 🔥
          </h2>

          <div className="my-5 flex items-center justify-center gap-4">
            {/* Current User initials/photo orb */}
            <EsferaAura
              nombre={currentUser.name || "Tú"}
              colorFrom="#8b5cf6"
              colorTo="#3b82f6"
              photoUrl={currentUser.photoUrl}
              size={76}
            />
            <img
              src="/logo-naranja.png"
              alt="Aura Flame Match"
              className="w-8 h-8 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]"
            />
            {/* Candidate Orb */}
            <EsferaAura
              nombre={matchedCandidate.nombre}
              colorFrom={matchedCandidate.colorFrom}
              colorTo={matchedCandidate.colorTo}
              size={76}
            />
          </div>

          <p className="text-xs text-white/80 max-w-xs leading-relaxed font-medium">
            Tú y <strong className="text-pink-300">{matchedCandidate.nombre}</strong> están persiguiendo el mismo compromiso de transformación. ¡Ahora no lo enfrentas solo/a!
          </p>

          <div className="w-full max-w-xs mt-6 space-y-2.5">
            <button
              onClick={() => setShowChatModal(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-cyan-500 text-white font-bold text-xs tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-amber-200" />
              <span>Abrir Chat con {matchedCandidate.nombre}</span>
            </button>

            <button
              onClick={cerrarMatch}
              className="w-full py-2.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              Explorar más compañeros
            </button>
          </div>
        </div>
      ) : (
        /* INTERACTIVE LIVE CHAT OVERLAY */
        <div className="my-auto flex flex-col justify-between z-10 w-full glass-card p-4 rounded-3xl border border-white/20 shadow-2xl min-h-[440px] max-h-[520px] animate-in slide-in-from-bottom duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              onClick={() => setShowChatModal(false)}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>

            <div className="flex items-center gap-2">
              <EsferaAura
                nombre={matchedCandidate.nombre}
                colorFrom={matchedCandidate.colorFrom}
                colorTo={matchedCandidate.colorTo}
                size={32}
              />
              <div className="text-left">
                <h3 className="text-xs font-bold text-white leading-tight">{matchedCandidate.nombre}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  En línea
                </span>
              </div>
            </div>

            <button
              onClick={cerrarMatch}
              className="p-1.5 rounded-full glass-card text-white/50 hover:text-white"
              title="Cerrar conversación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
            {chatMessages.map((msg) => {
              const isMe = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMe
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-br-none shadow-md"
                        : "glass-card text-white/90 border-white/20 rounded-bl-none shadow-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="glass-card px-3 py-2 rounded-2xl text-xs text-purple-300/80 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>{matchedCandidate.nombre} está escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Escribe a ${matchedCandidate.nombre}...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 px-4 py-2.5 glass-input text-xs text-white"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <BottomNav />
    </div>
  );
}
