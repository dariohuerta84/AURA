import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLatest = query({
  args: {
    userId: v.optional(v.id("users")),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    
    if (args.date) {
      const result = await ctx.db
        .query("twoFutures")
        .withIndex("by_user_date", (q) =>
          q.eq("userId", args.userId!).eq("date", args.date!)
        )
        .first();
      if (result) return result;
    }

    // Fallback to most recent entry for user
    const list = await ctx.db
      .query("twoFutures")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .first();

    return list;
  },
});

export const save = mutation({
  args: {
    userId: v.id("users"),
    date: v.string(),
    darkFuture: v.string(),
    brightFuture: v.string(),
    darkImageUrl: v.optional(v.string()),
    brightImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("twoFutures")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        darkFuture: args.darkFuture,
        brightFuture: args.brightFuture,
        darkImageUrl: args.darkImageUrl,
        brightImageUrl: args.brightImageUrl,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("twoFutures", {
        userId: args.userId,
        date: args.date,
        darkFuture: args.darkFuture,
        brightFuture: args.brightFuture,
        darkImageUrl: args.darkImageUrl,
        brightImageUrl: args.brightImageUrl,
        createdAt: Date.now(),
      });
    }
  },
});
