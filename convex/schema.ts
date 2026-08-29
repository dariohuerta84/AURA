import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  avatars: defineTable({
    photoStorageId: v.id("_storage"),
    status: v.union(
      v.literal("pending"),
      v.literal("done"),
      v.literal("error")
    ),
    meshStorageId: v.optional(v.id("_storage")),
    errorMessage: v.optional(v.string()),
  }),
});
