"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Brain, Activity, ArrowRight, ShieldCheck, Zap, HeartPulse, Check, Camera, Upload } from "lucide-react";
import { saveStoredUser, saveStoredHabits, saveStoredFutures, getStoredHabits, UserProfile, Habit } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";
import confetti from "canvas-confetti";

type Question = {
  id: string;
  title: string;
  options: { label: string; pts: number }[];
};

const EMOTIONAL_QUESTIONS: Question[] = [
  {
    id: "mood",
    title: "1. ¿Cómo ha sido tu estado de ánimo esta semana?",
    options: [
      { label: "Muy positivo", pts: 20 },
      { label: "Estable", pts: 15 },
      { label: "Variable", pts: 5 },
      { label: "Bajo", pts: 0 },
    ],
  },
  {
    id: "anxiety",
    title: "2. ¿Con qué frecuencia sientes estrés o ansiedad?",
    options: [
      { label: "Casi nunca", pts: 20 },
      { label: "A veces", pts: 15 },
      { label: "Frecuente", pts: 5 },
      { label: "Casi siempre", pts: 0 },
    ],
  },
  {
    id: "connection",
    title: "3. ¿Qué tan conectado/a te sientes con personas cercanas?",
    options: [
      { label: "Muy conectado", pts: 20 },
      { label: "Conectado", pts: 15 },
      { label: "Algo distante", pts: 5 },
      { label: "Aislado", pts: 0 },
    ],
  },
  {
    id: "mentalEnergy",
    title: "4. ¿Tienes claridad y energía mental para tus tareas diarias?",
    options: [
      { label: "Mucha energía", pts: 20 },
      { label: "Suficiente", pts: 15 },
      { label: "Poca energía", pts: 5 },
      { label: "Casi nada", pts: 0 },
    ],
  },
  {
    id: "satisfaction",
    title: "5. ¿Qué tan satisfecho/a estás con tu vida ahora mismo?",
    options: [
      { label: "Muy satisfecho", pts: 20 },
      { label: "Satisfecho", pts: 15 },
      { label: "Poco satisfecho", pts: 5 },
      { label: "Insatisfecho", pts: 0 },
    ],
  },
  {
    id: "disconnect",
    title: "6. ¿Logras desconectar tu mente al final de la jornada?",
    options: [
      { label: "Fácilmente", pts: 20 },
      { label: "A veces", pts: 15 },
      { label: "Me cuesta bastante", pts: 5 },
      { label: "Imposible", pts: 0 },
    ],
  },
  {
    id: "selfTalk",
    title: "7. ¿Cómo es tu diálogo interno cuando las cosas no salen bien?",
    options: [
      { label: "Comprensivo y amable", pts: 20 },
      { label: "Neutro / Resolutivo", pts: 15 },
      { label: "Crítico", pts: 5 },
      { label: "Muy duro conmigo", pts: 0 },
    ],
  },
];

const PHYSICAL_QUESTIONS: Question[] = [
  {
    id: "physEnergy",
    title: "1. ¿Cómo calificarías tu nivel de energía física diaria?",
    options: [
      { label: "Alta y constante", pts: 20 },
      { label: "Buena", pts: 15 },
      { label: "Baja", pts: 5 },
      { label: "Muy baja / Fatiga", pts: 0 },
    ],
  },
  {
    id: "sleep",
    title: "2. ¿Cómo es la calidad de tu descanso al despertar?",
    options: [
      { label: "Reparador e insuperable", pts: 20 },
      { label: "Aceptable", pts: 15 },
      { label: "Ligeramente fatigado/a", pts: 5 },
      { label: "Exhausto/a", pts: 0 },
    ],
  },
  {
    id: "movement",
    title: "3. ¿Con qué frecuencia realizas actividad física o ejercicio?",
    options: [
      { label: "4 o más veces por semana", pts: 20 },
      { label: "2 a 3 veces por semana", pts: 15 },
      { label: "Rara vez", pts: 5 },
      { label: "Casi nunca / Sedentario", pts: 0 },
    ],
  },
  {
    id: "nutrition",
    title: "4. ¿Sientes que alimentas tu cuerpo con nutrientes de calidad?",
    options: [
      { label: "Siempre conscientemente", pts: 20 },
      { label: "La mayor parte del tiempo", pts: 15 },
      { label: "A veces", pts: 5 },
      { label: "Muy poco", pts: 0 },
    ],
  },
  {
    id: "timeMgmt",
    title: "5. ¿Sientes que el tiempo te rinde adecuadamente?",
    options: [
      { label: "Mucho", pts: 20 },
      { label: "Bien", pts: 15 },
      { label: "Justo", pts: 5 },
      { label: "Siento que pierdo tiempo", pts: 0 },
    ],
  },
  {
    id: "clarity",
    title: "6. ¿Tienes claridad sobre cuál es tu siguiente gran paso?",
    options: [
      { label: "Total claridad", pts: 20 },
      { label: "Bastante claro", pts: 15 },
      { label: "Algo dudoso", pts: 5 },
      { label: "Muy confuso", pts: 0 },
    ],
  },
  {
    id: "fulfillment",
    title: "7. ¿Cómo te sientes al terminar tu jornada de trabajo?",
    options: [
      { label: "Satisfecho/a y realizado/a", pts: 20 },
      { label: "Tranquilo/a", pts: 15 },
      { label: "Neutro", pts: 5 },
      { label: "Frustrado/a", pts: 0 },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  // Onboarding Overall Phase:
  // 1: Perfil General, 2: Foto de Aura, 3: Categoría, 4: Meta, 5: Preguntas Step-by-Step, 6: Reveal
  const [phase, setPhase] = useState<number>(1);

  // Form State: General
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<"18-24" | "25-30" | "31+">("25-30");
  const [gender, setGender] = useState<"male" | "female" | "prefer_not_to_say">("female");
  const [weight, setWeight] = useState<number>(65);

  // Photo State
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Category & Goal
  const [category, setCategory] = useState<"salud_mental" | "salud_fisica">("salud_mental");
  const [goal, setGoal] = useState("");

  // Step-by-Step Question Index & Answers
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Animation State for Reveal Phase
  const [isGenerating, setIsGenerating] = useState(false);
  const [calculatedAura, setCalculatedAura] = useState(50);
  const [aiHabits, setAiHabits] = useState<Habit[]>([]);

  // Select questions array based on category
  const activeQuestions =
    category === "salud_mental" ? EMOTIONAL_QUESTIONS : PHYSICAL_QUESTIONS;

  const currentQuestion = activeQuestions[questionIndex];

  // Canvas image compression for fast Data URL storage
  const handlePhotoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      if (!rawUrl) return;

      const img = new Image();
      img.src = rawUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 360;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        setPhotoUrl(canvas.toDataURL("image/jpeg", 0.85));
      };
    };
  };

  const handleSelectOption = (pts: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: pts };
    setAnswers(updatedAnswers);

    // Auto-advance to next question smoothly
    if (questionIndex < activeQuestions.length - 1) {
      setTimeout(() => {
        setQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      // Finished all 7 questions -> Calculate Aura Score & Go to Reveal Phase 6
      let totalPts = 0;
      Object.values(updatedAnswers).forEach((val) => {
        totalPts += val;
      });

      const maxPossiblePts = activeQuestions.length * 20;
      const score = Math.min(100, Math.max(15, Math.round((totalPts / maxPossiblePts) * 100)));
      setCalculatedAura(score);

      setPhase(6);
      setIsGenerating(true);

      const tempUser: UserProfile = {
        name,
        ageRange,
        gender,
        weight,
        category,
        goal,
        photoUrl,
        auraLevel: score,
        currentStreak: 1,
        longestStreak: 1,
        createdAt: Date.now(),
      };

      // Call Gemini API in background during reveal
      fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: tempUser, habitsCount: 5 }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.darkFuture && data.brightFuture) {
            saveStoredFutures({
              darkFuture: data.darkFuture,
              brightFuture: data.brightFuture,
              date: new Date().toISOString().split("T")[0],
              createdAt: Date.now(),
            });
          }
          if (data.habits && Array.isArray(data.habits) && data.habits.length > 0) {
            const generatedHabits: Habit[] = data.habits.map((h: any, i: number) => ({
              id: `ai_${Date.now()}_${i}`,
              title: h.title || "",
              category,
              isDefault: false,
              difficulty: h.difficulty || "normal",
              auraPoints: h.auraPoints || 8,
              completedToday: false,
            }));
            setAiHabits(generatedHabits);
          }
        })
        .catch((err) => console.error("API call error during onboarding", err));

      setTimeout(() => {
        setIsGenerating(false);
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#7C3AED", "#06B6D4", "#F59E0B"],
          });
        } catch {
          // fallback
        }
      }, 2400);
    }
  };

  const handleFinishOnboarding = () => {
    const userProfile: UserProfile = {
      name,
      ageRange,
      gender,
      weight,
      category,
      goal,
      photoUrl,
      auraLevel: calculatedAura,
      currentStreak: 1,
      longestStreak: 1,
      createdAt: Date.now(),
    };

    saveStoredUser(userProfile);
    const habitsToSave = aiHabits.length > 0 ? aiHabits : getStoredHabits(category);
    saveStoredHabits(habitsToSave);

    router.replace("/home");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative overflow-y-auto">
      {/* Top Header Progress Bar */}
      {phase < 6 && (
        <div className="w-full mb-4 z-10">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo-azul.png"
                alt="Aura Logo"
                className="w-6 h-6 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              />
              <span className="uppercase tracking-widest font-semibold text-purple-400">
                EVALUACIÓN CLÍNICA ADAPTATIVA
              </span>
            </div>
            <span>
              {phase === 5
                ? `Pregunta ${questionIndex + 1} de ${activeQuestions.length}`
                : `Paso ${phase} de 5`}
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 h-full transition-all duration-500"
              style={{
                width:
                  phase === 5
                    ? `${((questionIndex + 1) / activeQuestions.length) * 100}%`
                    : `${(phase / 5) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* PHASE 1: PERFIL GENERAL */}
      {phase === 1 && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              ✦ Tu Perfil General ✦
            </h1>
            <p className="text-xs text-white/60">
              Cuéntanos sobre ti para calibrar tu evaluación inicial.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/70 block mb-1.5 font-medium">
                ¿Cómo te llamas?
              </label>
              <input
                type="text"
                placeholder="Tu nombre..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 glass-input text-sm"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1.5 font-medium">
                  Rango de edad
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["18-24", "25-30", "31+"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAgeRange(r)}
                      className={`py-2 rounded-xl border text-[11px] font-medium transition-all ${
                        ageRange === r
                          ? "glass-card-active text-white"
                          : "glass-card text-white/60 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1.5 font-medium">
                  Peso aprox. (kg)
                </label>
                <input
                  type="number"
                  placeholder="65"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 glass-input text-xs text-center font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1.5 font-medium">
                Género
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "female", label: "Mujer" },
                  { key: "male", label: "Hombre" },
                  { key: "prefer_not_to_say", label: "Otro" },
                ].map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGender(g.key as any)}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      gender === g.key
                        ? "glass-card-active text-white"
                        : "glass-card text-white/60 hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: CAPTURA TU FOTO DE AURA */}
      {phase === 2 && (
        <div className="flex-1 flex flex-col justify-center items-center gap-4 my-auto z-10 text-center animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
              ✦ Tu Foto de Aura ✦
            </h1>
            <p className="text-xs text-white/60 max-w-xs mx-auto">
              Tómate una foto o sube una imagen para iluminar tu esfera de aura.
            </p>
          </div>

          {/* Realtime Interactive Aura Orb Preview with Photo inside */}
          <div className="my-1 scale-105">
            <AuraOrb auraLevel={75} streak={1} photoUrl={photoUrl} size="lg" showDetails={false} />
          </div>

          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoFile(e.target.files?.[0])}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => handlePhotoFile(e.target.files?.[0])}
          />

          {/* Action Buttons */}
          <div className="w-full max-w-xs space-y-2.5 mt-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Tomar Foto con Cámara 📸</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl glass-card text-xs font-semibold text-white/80 hover:text-white border-white/20 flex items-center justify-center gap-2 hover:border-white/40 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>{photoUrl ? "Cambiar Foto de la Galería" : "Subir Foto de Galería"}</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: SELECCIÓN DE CATEGORÍA */}
      {phase === 3 && (
        <div className="flex-1 flex flex-col justify-center gap-5 my-auto z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              ¿Qué quieres elevar hoy?
            </h1>
            <p className="text-xs text-white/60">
              Elige el eje principal de tu evaluación neuropsicológica.
            </p>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setCategory("salud_mental")}
              className={`p-4 cursor-pointer transition-all rounded-2xl border ${
                category === "salud_mental" ? "glass-card-active" : "glass-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">🧠 Salud Emocional</h3>
                  <p className="text-xs text-purple-300/80">Paz interior, claridad y resiliencia</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setCategory("salud_fisica")}
              className={`p-4 cursor-pointer transition-all rounded-2xl border ${
                category === "salud_fisica" ? "glass-card-active" : "glass-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">💪 Salud Física</h3>
                  <p className="text-xs text-cyan-300/80">Vitalidad, energía y resistencia corporal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: TU META EN TUS PALABRAS */}
      {phase === 4 && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Escribe tu meta en tus palabras
            </h1>
            <p className="text-xs text-white/60">
              Mientras más honesta tu meta, más precisa será tu proyección de futuro con la IA.
            </p>
          </div>

          <div>
            <textarea
              rows={4}
              placeholder={
                category === "salud_mental"
                  ? "Ejemplo: Quiero dejar de sentir ansiedad constante por el trabajo y poder dormir en paz..."
                  : "Ejemplo: Quiero tener energía constante durante el día y entrenar 4 veces por semana sin fatiga..."
              }
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-4 glass-input text-sm resize-none leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* PHASE 5: PREGUNTAS STEP-BY-STEP (1 PREGUNTA POR PANTALLA) */}
      {phase === 5 && currentQuestion && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto z-10 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 inline-block">
              {category === "salud_mental" ? "🧠 Salud Emocional" : "💪 Salud Física"}
            </span>
            <h2 className="text-lg font-bold text-white leading-snug px-2">
              {currentQuestion.title}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.pts;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption(opt.pts)}
                  className={`w-full py-4 px-5 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between group ${
                    isSelected
                      ? "glass-card-active border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "glass-card text-white/80 hover:text-white hover:border-white/30"
                  }`}
                >
                  <span>{opt.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-purple-400 bg-purple-500 text-white"
                        : "border-white/20 group-hover:border-white/40"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation controls within step-by-step questions */}
          <div className="flex items-center justify-between text-xs text-white/40 pt-2">
            <button
              type="button"
              onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={questionIndex === 0}
              className="disabled:opacity-20 hover:text-white transition-colors"
            >
              ← Pregunta anterior
            </button>
            <span>Selecciona una opción para avanzar</span>
          </div>
        </div>
      )}

      {/* PHASE 6: REVEAL DE AURA CALCULADA CON FOTO EN EL ORBE */}
      {phase === 6 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 my-auto z-10">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 border-t-purple-400 border-r-cyan-400 animate-spin" />
                <Sparkles className="w-8 h-8 text-amber-300 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Materializando tu Aura...</h2>
                <p className="text-xs text-white/50">Procesando evaluación clínica y narrativa IA.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
              <div className="text-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 mb-2 inline-block">
                  AURA MATERIALIZADA
                </span>
                <h1 className="text-2xl font-bold text-white">Bienvenido, {name}</h1>
              </div>

              {/* Glowing Aura Orb displaying the calculated Aura and User Photo */}
              <AuraOrb auraLevel={calculatedAura} streak={1} photoUrl={photoUrl} size="lg" showDetails={true} />

              <p className="text-xs text-white/70 max-w-xs leading-relaxed my-1">
                Tu evaluación de {category === "salud_mental" ? "Salud Emocional" : "Salud Física"} determinó tu aura inicial en nivel <strong className="text-purple-300 font-bold">{calculatedAura} / 100</strong>. Cada hábito que cumplas elevará tu energía.
              </p>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 rounded-full glow-button text-white font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>Comenzar mi viaje</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Button (Phases 1-4) */}
      {phase < 5 && (
        <button
          type="button"
          onClick={() => setPhase((prev) => prev + 1)}
          disabled={(phase === 1 && !name.trim()) || (phase === 4 && !goal.trim())}
          className="w-full py-3.5 rounded-full glow-button text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3 z-10 cursor-pointer"
        >
          <span>{phase === 2 && !photoUrl ? "Omitir por ahora ✦" : "Continuar ✦"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
