import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    ageRange: v.union(v.literal("18-24"), v.literal("25-30"), v.literal("31+")),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("prefer_not_to_say")),
    weight: v.optional(v.number()),
    category: v.union(v.literal("salud_mental"), v.literal("salud_fisica")),
    goal: v.string(),
    stressLevel: v.optional(v.number()),
    sleepQuality: v.optional(v.union(v.literal("bad"), v.literal("regular"), v.literal("good"))),
    meditationExperience: v.optional(v.union(v.literal("yes"), v.literal("no"), v.literal("sometimes"))),
    anxietySource: v.optional(v.union(v.literal("work"), v.literal("relationships"), v.literal("finances"), v.literal("health"))),
    activityLevel: v.optional(v.union(v.literal("sedentary"), v.literal("somewhat_active"), v.literal("active"), v.literal("very_active"))),
    exercisePerWeek: v.optional(v.number()),
    exerciseType: v.optional(v.union(v.literal("cardio"), v.literal("strength"), v.literal("yoga"), v.literal("walking"), v.literal("other"))),
    avgSleepHours: v.optional(v.number()),
    dailyWaterLiters: v.optional(v.number()),
    weightGoal: v.optional(v.union(v.literal("lose"), v.literal("gain"), v.literal("maintain"), v.literal("none"))),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      auraLevel: 50,
      currentStreak: 1,
      longestStreak: 1,
      createdAt: Date.now(),
    });

    // Seed default habits according to selected category
    const defaultMental = [
      { title: "Meditar 5 minutos", difficulty: "easy" as const, auraPoints: 5 },
      { title: "Escribir 3 cosas por las que estoy agradecido", difficulty: "easy" as const, auraPoints: 5 },
      { title: "Leer 15 minutos (sin pantallas)", difficulty: "normal" as const, auraPoints: 8 },
      { title: "Journaling: expresar lo que siento hoy", difficulty: "normal" as const, auraPoints: 8 },
      { title: "Desconectar pantallas 1 hora antes de dormir", difficulty: "hard" as const, auraPoints: 12 },
    ];

    const defaultFisica = [
      { title: "Tomar 2 Litros de agua", difficulty: "easy" as const, auraPoints: 5 },
      { title: "Caminar 20 minutos al aire libre", difficulty: "easy" as const, auraPoints: 5 },
      { title: "Ejercicio activo de 30+ minutos", difficulty: "normal" as const, auraPoints: 8 },
      { title: "Comer sin alimentos ultraprocesados", difficulty: "normal" as const, auraPoints: 8 },
      { title: "Dormir entre 7 y 8 horas completas", difficulty: "hard" as const, auraPoints: 12 },
    ];

    const habitList = args.category === "salud_mental" ? defaultMental : defaultFisica;

    for (const h of habitList) {
      await ctx.db.insert("habits", {
        userId,
        title: h.title,
        category: args.category,
        isDefault: true,
        difficulty: h.difficulty,
        auraPoints: h.auraPoints,
      });
    }

    return userId;
  },
});

export const getById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    return await ctx.db.get(args.userId);
  },
});

export const updateAura = mutation({
  args: {
    userId: v.id("users"),
    newAuraLevel: v.number(),
    streakChange: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    const currentStreak = Math.max(1, (user.currentStreak || 1) + (args.streakChange || 0));
    const longestStreak = Math.max(user.longestStreak || 1, currentStreak);

    await ctx.db.patch(args.userId, {
      auraLevel: Math.min(100, Math.max(0, args.newAuraLevel)),
      currentStreak,
      longestStreak,
    });
  },
});

export const updateAuraImage = mutation({
  args: {
    userId: v.id("users"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      currentAuraImageUrl: args.imageUrl,
    });
  },
});
