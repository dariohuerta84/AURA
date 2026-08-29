import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    ageRange: v.union(
      v.literal("18-24"),
      v.literal("25-30"),
      v.literal("31+")
    ),
    gender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("prefer_not_to_say")
    ),
    weight: v.optional(v.number()),
    category: v.union(
      v.literal("salud_mental"),
      v.literal("salud_fisica")
    ),
    goal: v.string(),

    // --- Datos específicos: Salud Mental ---
    stressLevel: v.optional(v.number()),
    sleepQuality: v.optional(v.union(
      v.literal("bad"),
      v.literal("regular"),
      v.literal("good")
    )),
    meditationExperience: v.optional(v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("sometimes")
    )),
    anxietySource: v.optional(v.union(
      v.literal("work"),
      v.literal("relationships"),
      v.literal("finances"),
      v.literal("health")
    )),

    // --- Datos específicos: Salud Física ---
    activityLevel: v.optional(v.union(
      v.literal("sedentary"),
      v.literal("somewhat_active"),
      v.literal("active"),
      v.literal("very_active")
    )),
    exercisePerWeek: v.optional(v.number()),
    exerciseType: v.optional(v.union(
      v.literal("cardio"),
      v.literal("strength"),
      v.literal("yoga"),
      v.literal("walking"),
      v.literal("other")
    )),
    avgSleepHours: v.optional(v.number()),
    dailyWaterLiters: v.optional(v.number()),
    weightGoal: v.optional(v.union(
      v.literal("lose"),
      v.literal("gain"),
      v.literal("maintain"),
      v.literal("none")
    )),

    // --- Estado de aura ---
    auraLevel: v.number(), // 0-100
    currentStreak: v.number(),
    longestStreak: v.number(),
    currentAuraImageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),

  habits: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.union(
      v.literal("salud_mental"),
      v.literal("salud_fisica")
    ),
    isDefault: v.boolean(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("normal"),
      v.literal("hard")
    ),
    auraPoints: v.number(),
  }).index("by_user", ["userId"]),

  checkIns: defineTable({
    userId: v.id("users"),
    habitId: v.id("habits"),
    completed: v.boolean(),
    date: v.string(), // "YYYY-MM-DD"
    createdAt: v.number(),
  }).index("by_user_date", ["userId", "date"])
    .index("by_habit", ["habitId"]),

  auraSnapshots: defineTable({
    userId: v.id("users"),
    date: v.string(),
    auraLevel: v.number(),
    imageUrl: v.optional(v.string()),
    habitsCompleted: v.number(),
    habitsTotal: v.number(),
    narrative: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_date", ["userId", "date"]),

  twoFutures: defineTable({
    userId: v.id("users"),
    date: v.string(),
    darkFuture: v.string(),
    brightFuture: v.string(),
    darkImageUrl: v.optional(v.string()),
    brightImageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_date", ["userId", "date"]),
});
