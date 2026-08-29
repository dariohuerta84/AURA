"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Flame, X, Sparkles, MessageCircle, ShieldCheck, Send, ArrowLeft, Loader2 } from "lucide-react";
import { getStoredUser, getCommunityCandidates, CommunityCandidate, UserProfile } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import confetti from "canvas-confetti";

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

      // Register current user into the shared community API
      const habitsList = user.goal || "Elevar mi nivel de Aura";
      fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, habitTitle: habitsList }),
      }).catch((e) => console.error("Error publishing user to community API", e));

      // Fetch candidates from community API (or fallback to local candidates)
      fetch("/api/community")
        .then((res) => res.json())
        .then((data) => {
          if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
            const apiCandidates: CommunityCandidate[] = data.candidates;
            const others = apiCandidates.filter((c) => c.nombre !== user.name && c.id !== user.id);
            const sameCat = others.filter((c) => c.categoryKey === user.category);
            const diffCat = others.filter((c) => c.categoryKey !== user.category);
            const combined = [...sameCat, ...diffCat];
            setCandidates(combined.length > 0 ? combined : getCommunityCandidates());
          } else {
            setCandidates(getCommunityCandidates());
          }
        })
        .catch(() => {
          setCandidates(getCommunityCandidates());
        });
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  // Load persistent chat history when a candidate is matched
  useEffect(() => {
    if (matchedCandidate) {
      // First load local cache
      const storageKey = `aura_chat_msg_${matchedCandidate.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setChatMessages(JSON.parse(saved));
        } catch {
          setChatMessages([]);
        }
      }

      // Fetch live messages from /api/chat
      fetch(`/api/chat?matchId=${matchedCandidate.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
            const serverMsgs: ChatMessage[] = data.messages.map((m: any) => ({
              id: m.id,
              sender: m.sender === "user" ? "user" : "companion",
              text: m.text,
              timestamp: m.timestamp,
            }));
            setChatMessages(serverMsgs);
            localStorage.setItem(storageKey, JSON.stringify(serverMsgs));
          } else if (!saved) {
            // Initial greeting message
            const initialMsg: ChatMessage = {
              id: `msg_init_${Date.now()}`,
              sender: "companion",
              text: `¡Hola ${currentUser?.name || "compañero"}! 🌟 Me alegra hacer match contigo. Mi hábito principal es "${matchedCandidate.habito}". ¿Cómo va tu día?`,
              timestamp: Date.now(),
            };
            setChatMessages([initialMsg]);
            localStorage.setItem(storageKey, JSON.stringify([initialMsg]));
          }
        })
        .catch(() => {/* fallback to local */});
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
        <p className="text-sm">Cargando comunidad de hábitos...</p>
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: matchedCandidate.id,
          text: userText,
          user: currentUser,
          candidate: matchedCandidate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.partnerMessage) {
          const partnerReply: ChatMessage = {
            id: data.partnerMessage.id,
            sender: "companion",
            text: data.partnerMessage.text,
            timestamp: data.partnerMessage.timestamp,
          };
          const withReply = [...updated, partnerReply];
          setChatMessages(withReply);
          localStorage.setItem(`aura_chat_msg_${matchedCandidate.id}`, JSON.stringify(withReply));
        }
      }
    } catch (e) {
      console.error("Error al enviar mensaje a la API de chat", e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative pb-28">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-amber-400" /> AURA HABIT MATCH
          </span>
          <h1 className="text-base font-extrabold text-white">Comunidad de Hábitos</h1>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-medium">
          {currentUser.category === "salud_mental" ? "🧠 Salud Emocional" : "💪 Salud Física"}
        </div>
      </div>

      {/* Main Tinder Card Section */}
      <div className="my-auto py-4 flex flex-col items-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-3">
          PERSONAS ELEVANDO SU AURA EN TU CATEGORÍA
        </p>

        {/* Dynamic User Card */}
        <div className="w-full max-w-sm glass-card p-6 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
          <div className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
            ✦ {actualCandidate.auraLevel}% AURA
          </div>

          <div className="my-3">
            <EsferaAura
              nombre={actualCandidate.nombre}
              colorFrom={actualCandidate.colorFrom}
              colorTo={actualCandidate.colorTo}
              photoUrl={actualCandidate.photoUrl}
              size={110}
            />
          </div>

          <h2 className="text-xl font-bold text-white mb-0.5">{actualCandidate.nombre}</h2>
          <span className="text-xs font-medium text-cyan-300/90 mb-3 px-3 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20">
            {actualCandidate.categoria}
          </span>

          <div className="w-full bg-white/5 p-3 rounded-2xl border border-white/10 my-2 text-xs">
            <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider mb-1">
              También está construyendo el hábito:
            </span>
            <p className="font-semibold text-amber-300 italic">&quot;{actualCandidate.habito}&quot;</p>
          </div>

          <p className="text-xs text-white/70 italic max-w-xs mb-3 font-light">&quot;{actualCandidate.bio}&quot;</p>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{actualCandidate.racha} días de racha activa</span>
          </div>
        </div>

        {/* Swipe Action Buttons */}
        <div className="flex items-center gap-6 mt-6">
          <button
            type="button"
            onClick={pasar}
            className="w-14 h-14 rounded-full glass-card border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-red-500/50 hover:bg-red-950/20 transition-all shadow-lg active:scale-95 cursor-pointer"
            title="Pasar"
          >
            <X className="w-6 h-6 text-red-400" />
          </button>

          <button
            type="button"
            onClick={darLike}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95 transition-all cursor-pointer group"
            title="Conectar"
          >
            <div className="w-full h-full rounded-full bg-[#0A0A1A] group-hover:bg-gradient-to-tr group-hover:from-purple-600 group-hover:to-cyan-400 flex items-center justify-center transition-all p-2">
              <img
                src="/logo-azul.png"
                alt="Match Aura"
                className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            </div>
          </button>
        </div>
      </div>

      {/* MATCH POPUP MODAL */}
      {matchedCandidate && !showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-300">
          <div className="w-full max-w-sm glass-card p-6 rounded-3xl border border-purple-500/40 text-center relative shadow-2xl flex flex-col items-center space-y-4">
            <div className="relative my-2">
              <Sparkles className="w-8 h-8 text-amber-300 absolute -top-4 -right-4 animate-bounce" />
              <img
                src="/logo-naranja.png"
                alt="Match Exitoso"
                className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.9)] animate-pulse"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">¡AURA MATCH! ✦</h2>
              <p className="text-xs text-purple-200 mt-1">
                Tú y <strong className="text-white">{matchedCandidate.nombre}</strong> están construyendo hábitos similares para transformar su vida.
              </p>
            </div>

            {/* Side-by-side User Photos/Orbs */}
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="flex flex-col items-center">
                <EsferaAura
                  nombre={currentUser.name}
                  colorFrom="#8B5CF6"
                  colorTo="#06B6D4"
                  photoUrl={currentUser.photoUrl}
                  size={64}
                />
                <span className="text-[10px] font-bold text-white mt-1">{currentUser.name}</span>
              </div>

              <span className="text-amber-400 font-extrabold text-sm">⚡</span>

              <div className="flex flex-col items-center">
                <EsferaAura
                  nombre={matchedCandidate.nombre}
                  colorFrom={matchedCandidate.colorFrom}
                  colorTo={matchedCandidate.colorTo}
                  photoUrl={matchedCandidate.photoUrl}
                  size={64}
                />
                <span className="text-[10px] font-bold text-white mt-1">{matchedCandidate.nombre}</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Abrir Chat de Aura</span>
              </button>

              <button
                type="button"
                onClick={cerrarMatch}
                className="w-full py-2.5 text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Continuar buscando personas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL CHAT MODAL */}
      {matchedCandidate && showChatModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A1A] flex flex-col justify-between animate-in slide-in-from-bottom duration-300">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-[#0D0D24] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <EsferaAura
                nombre={matchedCandidate.nombre}
                colorFrom={matchedCandidate.colorFrom}
                colorTo={matchedCandidate.colorTo}
                photoUrl={matchedCandidate.photoUrl}
                size={40}
              />

              <div>
                <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{matchedCandidate.nombre}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <span className="text-[11px] text-amber-300/90 font-medium">
                  {matchedCandidate.categoria} • {matchedCandidate.racha}d racha
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={cerrarMatch}
              className="p-1.5 rounded-full text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => {
              const isMe = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                      isMe
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                        : "glass-card text-white/90 border-purple-500/30 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] mt-1 block font-mono ${isMe ? "text-white/60 text-right" : "text-white/40 text-left"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-purple-300/80 animate-pulse py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>{matchedCandidate.nombre} está escribiendo...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-white/10 bg-[#0D0D24] flex items-center gap-2">
            <input
              type="text"
              placeholder={`Escribe a ${matchedCandidate.nombre}...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 px-4 py-3 glass-input text-xs text-white"
            />
            <button
              type="button"
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PWA Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
