import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getToday = query({
  args: {
    userId: v.optional(v.id("users")),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("checkIns")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId!).eq("date", args.date)
      )
      .collect();
  },
});

export const toggle = mutation({
  args: {
    userId: v.id("users"),
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("checkIns")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .first();

    let isCompletedNow = true;

    if (existing) {
      isCompletedNow = !existing.completed;
      await ctx.db.patch(existing._id, {
        completed: isCompletedNow,
      });
    } else {
      await ctx.db.insert("checkIns", {
        userId: args.userId,
        habitId: args.habitId,
        completed: true,
        date: args.date,
        createdAt: Date.now(),
      });
    }

    // Recalculate Aura Level
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const todayCheckIns = await ctx.db
      .query("checkIns")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .collect();

    const completedTodayCount = todayCheckIns.filter((c) => c.completed).length;
    const totalHabits = habits.length || 1;
    const completionRatio = completedTodayCount / totalHabits;

    const user = await ctx.db.get(args.userId);
    if (!user) return isCompletedNow;

    const streakBonus = Math.min(15, (user.currentStreak || 1) * 2);
    // Base 30 + ratio * 55 + streakBonus -> max 100
    const calculatedAura = Math.round(30 + completionRatio * 55 + streakBonus);
    const auraLevel = Math.min(100, Math.max(10, calculatedAura));

    await ctx.db.patch(args.userId, {
      auraLevel,
    });

    return isCompletedNow;
  },
});
