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
