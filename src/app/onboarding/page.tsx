"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Brain, Activity, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import { saveStoredUser, saveStoredHabits, saveStoredFutures, getStoredHabits, UserProfile } from "@/lib/store";
import { AuraOrb } from "@/components/AuraOrb";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Form State: General
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<"18-24" | "25-30" | "31+">("25-30");
  const [gender, setGender] = useState<"male" | "female" | "prefer_not_to_say">("female");
  const [weight, setWeight] = useState<number>(65);

  // Form State: Category & Goal
  const [category, setCategory] = useState<"salud_mental" | "salud_fisica">("salud_mental");
  const [goal, setGoal] = useState("");

  // Clinical Questions: Salud Emocional (5 preguntas de Lic. María Del Pilar)
  const [mood, setMood] = useState<number>(15); // 20: Muy positivo, 15: Estable, 5: Variable, 0: Bajo
  const [anxietyFreq, setAnxietyFreq] = useState<number>(15); // 20: Casi nunca, 15: A veces, 5: Frecuente, 0: Casi siempre
  const [connection, setConnection] = useState<number>(15); // 20: Muy conectado, 15: Conectado, 5: Algo distante, 0: Aislado
  const [mentalEnergy, setMentalEnergy] = useState<number>(15); // 20: Mucha, 15: Suficiente, 5: Poca, 0: Casi nada
  const [lifeSatisfaction, setLifeSatisfaction] = useState<number>(15); // 20: Muy satisfecho, 15: Satisfecho, 5: Poco, 0: Insatisfecho

  // Clinical Questions: Salud Física (5 preguntas de Lic. María Del Pilar)
  const [physEnergy, setPhysEnergy] = useState<number>(15); // 20: Alta, 15: Buena, 5: Baja, 0: Muy baja
  const [sleepQuality, setSleepQuality] = useState<number>(15); // 20: Excelente, 15: Bien, 5: Regular, 0: Mal
  const [exerciseFreq, setExerciseFreq] = useState<number>(15); // 20: Casi a diario, 15: Varias veces/sem, 5: Poca, 0: Nada
  const [dietQuality, setDietQuality] = useState<number>(15); // 20: Muy equilibrada, 15: Bastante bien, 5: Irregular, 0: Descuidada
  const [painFreq, setPainFreq] = useState<number>(15); // 20: Casi nunca, 15: A veces, 5: Seguido, 0: Casi siempre

  // Animation State for Step 5 (Reveal)
  const [isGenerating, setIsGenerating] = useState(false);
  const [calculatedAura, setCalculatedAura] = useState(50);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 3 && !goal.trim()) return;

    if (step === 4) {
      // Puntuación estática determinística clínica
      let totalScore = 50;
      if (category === "salud_mental") {
        totalScore = mood + anxietyFreq + connection + mentalEnergy + lifeSatisfaction;
      } else {
        totalScore = physEnergy + sleepQuality + exerciseFreq + dietQuality + painFreq;
      }

      const score = Math.min(100, Math.max(10, Math.round(totalScore)));
      setCalculatedAura(score);

      // Transición al paso 5 (Reveal animado)
      setStep(5);
      setIsGenerating(true);

      const tempUser: UserProfile = {
        name,
        ageRange,
        gender,
        weight,
        category,
        goal,
        auraLevel: score,
        currentStreak: 1,
        longestStreak: 1,
        createdAt: Date.now(),
      };

      // Call Gemini API in background during reveal
      fetch("/api/generate-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: tempUser, habitsCount: 5, completedHabitsCount: 0 }),
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
        })
        .catch((err) => console.error("API call error during onboarding", err));

      setTimeout(() => {
        setIsGenerating(false);
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#7C3AED", "#06B6D4", "#F59E0B"],
          });
        } catch {
          // fallback
        }
      }, 2400);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleFinishOnboarding = () => {
    const userProfile: UserProfile = {
      name,
      ageRange,
      gender,
      weight,
      category,
      goal,
      auraLevel: calculatedAura,
      currentStreak: 1,
      longestStreak: 1,
      createdAt: Date.now(),
    };

    saveStoredUser(userProfile);
    saveStoredHabits(getStoredHabits(category));

    router.replace("/home");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen relative overflow-y-auto">
      {/* Top Header Progress Bar */}
      {step < 5 && (
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span className="uppercase tracking-widest font-semibold text-purple-400">
              AURA EVALUACIÓN CLÍNICA
            </span>
            <span>Paso {step} de 4</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: PERFIL GENERAL */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
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

            <div>
              <label className="text-xs text-white/70 block mb-1.5 font-medium">
                Rango de edad
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["18-24", "25-30", "31+"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAgeRange(r)}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      ageRange === r
                        ? "glass-card-active text-white"
                        : "glass-card text-white/60 hover:text-white"
                    }`}
                  >
                    {r} años
                  </button>
                ))}
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

      {/* STEP 2: SELECCIÓN DE CATEGORÍA */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              ¿Qué quieres elevar?
            </h1>
            <p className="text-xs text-white/60">
              Elige el eje principal de tu transformación personal.
            </p>
          </div>

          <div className="space-y-4">
            <div
              onClick={() => setCategory("salud_mental")}
              className={`p-5 cursor-pointer transition-all ${
                category === "salud_mental" ? "glass-card-active" : "glass-card"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">🧠 Salud Emocional</h3>
                  <p className="text-xs text-purple-300/80">Paz interior, claridad y equilibrio</p>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mt-2">
                Evaluación diseñada por neuropsicología para reducir estrés y cultivar resiliencia mental.
              </p>
            </div>

            <div
              onClick={() => setCategory("salud_fisica")}
              className={`p-5 cursor-pointer transition-all ${
                category === "salud_fisica" ? "glass-card-active" : "glass-card"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">💪 Salud Física</h3>
                  <p className="text-xs text-cyan-300/80">Vitalidad, energía y fuerza corporal</p>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mt-2">
                Evaluación de energía física, calidad de descanso, alimentación y movimiento diario.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: TU META EN TUS PALABRAS */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Escribe tu meta en tus palabras
            </h1>
            <p className="text-xs text-white/60">
              Mientras más honesta tu meta, más precisa será tu proyección de futuro.
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

      {/* STEP 4: EVALUACIÓN CLÍNICA DE LIC. MARÍA DEL PILAR CRÍA */}
      {step === 4 && (
        <div className="flex-1 flex flex-col justify-start gap-4 my-2">
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">
              {category === "salud_mental" ? "🧠 Evaluación de Salud Emocional" : "💪 Evaluación de Salud Física"}
            </h1>
            <p className="text-[11px] text-white/60">Responde con honestidad para calcular tu aura inicial.</p>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {category === "salud_mental" ? (
              <>
                {/* Q1 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    1. ¿Cómo ha sido tu estado de ánimo esta semana?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Muy positivo", pts: 20 },
                      { label: "Estable", pts: 15 },
                      { label: "Variable", pts: 5 },
                      { label: "Bajo", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setMood(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          mood === opt.pts ? "glass-card-active text-amber-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    2. ¿Con qué frecuencia sientes estrés o ansiedad?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Casi nunca", pts: 20 },
                      { label: "A veces", pts: 15 },
                      { label: "Frecuente", pts: 5 },
                      { label: "Casi siempre", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setAnxietyFreq(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          anxietyFreq === opt.pts ? "glass-card-active text-cyan-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    3. ¿Qué tan conectado/a te sientes con las personas cercanas?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Muy conectado", pts: 20 },
                      { label: "Conectado", pts: 15 },
                      { label: "Algo distante", pts: 5 },
                      { label: "Aislado", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setConnection(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          connection === opt.pts ? "glass-card-active text-purple-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    4. ¿Tienes energía mental para tus tareas diarias?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Mucha", pts: 20 },
                      { label: "Suficiente", pts: 15 },
                      { label: "Poca", pts: 5 },
                      { label: "Casi nada", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setMentalEnergy(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          mentalEnergy === opt.pts ? "glass-card-active text-amber-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q5 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    5. ¿Qué tan satisfecho/a estás con tu vida ahora mismo?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Muy satisfecho", pts: 20 },
                      { label: "Satisfecho", pts: 15 },
                      { label: "Poco", pts: 5 },
                      { label: "Insatisfecho", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setLifeSatisfaction(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          lifeSatisfaction === opt.pts ? "glass-card-active text-cyan-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Q1 Física */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    1. ¿Cómo calificarías tu nivel de energía física?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Alta", pts: 20 },
                      { label: "Buena", pts: 15 },
                      { label: "Baja", pts: 5 },
                      { label: "Muy baja", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setPhysEnergy(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          physEnergy === opt.pts ? "glass-card-active text-cyan-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 Física */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    2. ¿Cómo describirías tu sueño últimamente?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Excelente", pts: 20 },
                      { label: "Bien", pts: 15 },
                      { label: "Regular", pts: 5 },
                      { label: "Mal", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSleepQuality(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          sleepQuality === opt.pts ? "glass-card-active text-purple-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3 Física */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    3. ¿Con qué frecuencia haces algo de actividad física?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Casi a diario", pts: 20 },
                      { label: "Varias veces/sem", pts: 15 },
                      { label: "Poca", pts: 5 },
                      { label: "Nada", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setExerciseFreq(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          exerciseFreq === opt.pts ? "glass-card-active text-amber-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4 Física */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    4. ¿Cómo es tu alimentación en general?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Muy equilibrada", pts: 20 },
                      { label: "Bastante bien", pts: 15 },
                      { label: "Irregular", pts: 5 },
                      { label: "Descuidada", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setDietQuality(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          dietQuality === opt.pts ? "glass-card-active text-cyan-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q5 Física */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-medium block">
                    5. ¿Sientes dolores o molestias físicas frecuentes?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Casi nunca", pts: 20 },
                      { label: "A veces", pts: 15 },
                      { label: "Seguido", pts: 5 },
                      { label: "Casi siempre", pts: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setPainFreq(opt.pts)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                          painFreq === opt.pts ? "glass-card-active text-purple-300" : "glass-card text-white/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: REVEAL DE AURA CALCULADA (CALCULAR MI AURA) */}
      {step === 5 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 my-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 border-t-purple-400 border-r-cyan-400 animate-spin" />
                <Sparkles className="w-8 h-8 text-amber-300 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Calculando tu Aura...</h2>
                <p className="text-xs text-white/50">Procesando evaluación clínica neuropsicológica.</p>
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

              <AuraOrb auraLevel={calculatedAura} streak={1} size="lg" showDetails={true} />

              <p className="text-xs text-white/70 max-w-xs leading-relaxed my-2">
                Tu evaluación de {category === "salud_mental" ? "Salud Emocional" : "Salud Física"} determinó tu aura inicial en nivel <strong className="text-purple-300 font-bold">{calculatedAura} / 100</strong>. Cada hábito que cumplas elevará tu energía.
              </p>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 rounded-full glow-button text-white font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                <span>Comenzar mi viaje</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Button (Steps 1-4) */}
      {step < 5 && (
        <button
          type="button"
          onClick={handleNext}
          disabled={(step === 1 && !name.trim()) || (step === 3 && !goal.trim())}
          className="w-full py-3.5 rounded-full glow-button text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
        >
          <span>{step === 4 ? "Calcular mi aura ✨" : "Continuar"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
