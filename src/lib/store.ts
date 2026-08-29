export interface UserProfile {
  id?: string;
  name: string;
  ageRange: "18-24" | "25-30" | "31+";
  gender: "male" | "female" | "prefer_not_to_say";
  weight?: number;
  category: "salud_mental" | "salud_fisica";
  goal: string;
  stressLevel?: number;
  sleepQuality?: "bad" | "regular" | "good";
  meditationExperience?: "yes" | "no" | "sometimes";
  anxietySource?: "work" | "relationships" | "finances" | "health";
  activityLevel?: "sedentary" | "somewhat_active" | "active" | "very_active";
  exercisePerWeek?: number;
  exerciseType?: "cardio" | "strength" | "yoga" | "walking" | "other";
  avgSleepHours?: number;
  dailyWaterLiters?: number;
  weightGoal?: "lose" | "gain" | "maintain" | "none";
  auraLevel: number;
  currentStreak: number;
  longestStreak: number;
  currentAuraImageUrl?: string;
  createdAt: number;
}

export interface Habit {
  id: string;
  title: string;
  category: "salud_mental" | "salud_fisica";
  isDefault: boolean;
  difficulty: "easy" | "normal" | "hard";
  auraPoints: number;
  completedToday?: boolean;
}

export interface TwoFuturesData {
  darkFuture: string;
  brightFuture: string;
  date: string;
  createdAt: number;
}

export interface CommunityCandidate {
  id: string;
  nombre: string;
  categoria: string;
  categoryKey: "salud_mental" | "salud_fisica";
  habito: string;
  racha: number;
  auraLevel: number;
  colorFrom: string;
  colorTo: string;
  bio: string;
  createdAt: number;
}

const STORAGE_KEY_USER = "aura_user_profile";
const STORAGE_KEY_HABITS = "aura_user_habits";
const STORAGE_KEY_FUTURES = "aura_two_futures";
const STORAGE_KEY_CHECKINS = "aura_checkins_date";
const STORAGE_KEY_COMMUNITY = "aura_community_candidates";

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  if (!user.id) {
    user.id = "aura_usr_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
  }
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  
  // Guardar también como candidato de la comunidad para que otros lo vean en Aura Match
  const defaultHabits = getStoredHabits(user.category);
  const firstHabitTitle = defaultHabits[0]?.title || user.goal;
  saveCommunityCandidate(user, firstHabitTitle);
}

export function getStoredHabits(category: "salud_mental" | "salud_fisica"): Habit[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_HABITS);
  if (raw) {
    try {
      const parsed: Habit[] = JSON.parse(raw);
      const today = new Date().toISOString().split("T")[0];
      const savedDate = localStorage.getItem(STORAGE_KEY_CHECKINS);
      if (savedDate !== today) {
        return parsed.map((h) => ({ ...h, completedToday: false }));
      }
      return parsed;
    } catch {
      // fallback to default
    }
  }

  // Initial Seed - All habits start unchecked (0/5)
  if (category === "salud_mental") {
    return [
      { id: "m1", title: "Meditar 5 minutos en calma", category: "salud_mental", isDefault: true, difficulty: "easy", auraPoints: 5, completedToday: false },
      { id: "m2", title: "Escribir 3 cosas por las que estás agradecido", category: "salud_mental", isDefault: true, difficulty: "easy", auraPoints: 5, completedToday: false },
      { id: "m3", title: "Leer 15 minutos (sin distracciones)", category: "salud_mental", isDefault: true, difficulty: "normal", auraPoints: 8, completedToday: false },
      { id: "m4", title: "Journaling: expresar cómo te sientes hoy", category: "salud_mental", isDefault: true, difficulty: "normal", auraPoints: 8, completedToday: false },
      { id: "m5", title: "Desconectar pantallas 1 hora antes de dormir", category: "salud_mental", isDefault: true, difficulty: "hard", auraPoints: 12, completedToday: false },
    ];
  } else {
    return [
      { id: "f1", title: "Tomar 2 Litros de agua pura", category: "salud_fisica", isDefault: true, difficulty: "easy", auraPoints: 5, completedToday: false },
      { id: "f2", title: "Caminar 20 minutos al aire libre", category: "salud_fisica", isDefault: true, difficulty: "easy", auraPoints: 5, completedToday: false },
      { id: "f3", title: "Ejercicio activo de 30+ minutos", category: "salud_fisica", isDefault: true, difficulty: "normal", auraPoints: 8, completedToday: false },
      { id: "f4", title: "Comer 1 comida libre de ultraprocesados", category: "salud_fisica", isDefault: true, difficulty: "normal", auraPoints: 8, completedToday: false },
      { id: "f5", title: "Dormir entre 7 y 8 horas continuas", category: "salud_fisica", isDefault: true, difficulty: "hard", auraPoints: 12, completedToday: false },
    ];
  }
}

export function saveStoredHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  localStorage.setItem(STORAGE_KEY_CHECKINS, today);
}

export function getStoredFutures(): TwoFuturesData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY_FUTURES);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredFutures(data: TwoFuturesData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_FUTURES, JSON.stringify(data));
}

// Persistencia Real de Usuarios de la Comunidad para Aura Match
export function getCommunityCandidates(): CommunityCandidate[] {
  if (typeof window === "undefined") return INITIAL_COMMUNITY_SEED;
  const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY);
  if (!raw) return INITIAL_COMMUNITY_SEED;
  try {
    const list: CommunityCandidate[] = JSON.parse(raw);
    return list.length > 0 ? list : INITIAL_COMMUNITY_SEED;
  } catch {
    return INITIAL_COMMUNITY_SEED;
  }
}

export function saveCommunityCandidate(user: UserProfile, habitTitle: string): void {
  if (typeof window === "undefined") return;
  const existing = getCommunityCandidates();

  // Prevenir duplicados del mismo usuario
  const filtered = existing.filter((c) => c.id !== user.id && c.nombre !== user.name);

  const colors = [
    { from: "#f97316", to: "#7c2d12" },
    { from: "#fbbf24", to: "#b45309" },
    { from: "#a78bfa", to: "#4c1d95" },
    { from: "#60a5fa", to: "#1e3a8a" },
    { from: "#34d399", to: "#065f46" },
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newCandidate: CommunityCandidate = {
    id: user.id || "c_" + Date.now(),
    nombre: user.name,
    categoria: user.category === "salud_mental" ? "Salud Emocional" : "Salud Física",
    categoryKey: user.category,
    habito: habitTitle || user.goal,
    racha: user.currentStreak || 1,
    auraLevel: user.auraLevel || 75,
    colorFrom: randomColor.from,
    colorTo: randomColor.to,
    bio: user.goal,
    createdAt: Date.now(),
  };

  const updatedList = [newCandidate, ...filtered];
  localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(updatedList));
}

const INITIAL_COMMUNITY_SEED: CommunityCandidate[] = [
  {
    id: "seed_1",
    nombre: "Camila R.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "10 min de meditación y soltar la ansiedad laboral",
    racha: 6,
    auraLevel: 82,
    colorFrom: "#f97316",
    colorTo: "#7c2d12",
    bio: "Buscando reducir la rumiación mental al final del día.",
    createdAt: Date.now(),
  },
  {
    id: "seed_2",
    nombre: "Diego M.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Dormir antes de las 11:00 PM sin pantallas",
    racha: 4,
    auraLevel: 74,
    colorFrom: "#fbbf24",
    colorTo: "#b45309",
    bio: "Enfocado en higiene de sueño y paz interior.",
    createdAt: Date.now(),
  },
  {
    id: "seed_3",
    nombre: "Valeria K.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Entrenar 4 veces por semana sin excusas",
    racha: 12,
    auraLevel: 91,
    colorFrom: "#a78bfa",
    colorTo: "#4c1d95",
    bio: "Buscando constancia física y mayor fuerza muscular.",
    createdAt: Date.now(),
  },
  {
    id: "seed_4",
    nombre: "Mateo S.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Tomar 2.5 litros de agua y evitar azúcares",
    racha: 5,
    auraLevel: 68,
    colorFrom: "#34d399",
    colorTo: "#065f46",
    bio: "Mejorando energía vital y hábitos de hidratación.",
    createdAt: Date.now(),
  },
  {
    id: "seed_5",
    nombre: "Sofía T.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Escribir en diario de gratitud al despertar",
    racha: 9,
    auraLevel: 88,
    colorFrom: "#f472b6",
    colorTo: "#831843",
    bio: "Reemplazando el scroll matutino por paz mental.",
    createdAt: Date.now(),
  },
];
