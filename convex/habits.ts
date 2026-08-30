import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    category: v.union(v.literal("salud_mental"), v.literal("salud_fisica")),
    difficulty: v.union(v.literal("easy"), v.literal("normal"), v.literal("hard")),
    auraPoints: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("habits", {
      ...args,
      isDefault: false,
    });
  },
});

export const replaceUserHabits = mutation({
  args: {
    userId: v.id("users"),
    habits: v.array(v.object({
      title: v.string(),
      category: v.union(v.literal("salud_mental"), v.literal("salud_fisica")),
      difficulty: v.union(v.literal("easy"), v.literal("normal"), v.literal("hard")),
      auraPoints: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Delete existing habits
    const existing = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const h of existing) {
      await ctx.db.delete(h._id);
    }
    // Insert new habits
    for (const h of args.habits) {
      await ctx.db.insert("habits", {
        userId: args.userId,
        title: h.title,
        category: h.category,
        isDefault: false,
        difficulty: h.difficulty,
        auraPoints: h.auraPoints,
      });
    }
  },
});
