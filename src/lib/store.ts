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

const STORAGE_KEY_USER = "aura_user_profile";
const STORAGE_KEY_HABITS = "aura_user_habits";
const STORAGE_KEY_FUTURES = "aura_two_futures";
const STORAGE_KEY_CHECKINS = "aura_checkins_date";

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
        // Reset daily checkins for new day
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
