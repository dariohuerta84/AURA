import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
  internalAction,
} from "./_generated/server";
import { internal } from "./_generated/api";

// 1. El frontend pide una URL para subir la foto directo a Convex storage.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// 2. Con la foto ya subida, se crea el registro y se agenda la generación.
export const createAvatarJob = mutation({
  args: { photoStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const avatarId = await ctx.db.insert("avatars", {
      photoStorageId: args.photoStorageId,
      status: "pending",
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.avatars.generateAvatar, {
      avatarId,
    });
    return avatarId;
  },
});

// 3. El frontend consulta este estado (reactivo, se actualiza solo).
export const getAvatar = query({
  args: { avatarId: v.id("avatars") },
  handler: async (ctx, args) => {
    const avatar = await ctx.db.get(args.avatarId);
    if (!avatar) return null;
    return {
      status: avatar.status,
      errorMessage: avatar.errorMessage,
      meshUrl: avatar.meshStorageId
        ? await ctx.storage.getUrl(avatar.meshStorageId)
        : null,
    };
  },
});

export const getLatestAvatar = query({
  args: {},
  handler: async (ctx) => {
    const avatar = await ctx.db.query("avatars").order("desc").first();
    if (!avatar) return null;
    return {
      _id: avatar._id,
      status: avatar.status,
      errorMessage: avatar.errorMessage,
      meshUrl: avatar.meshStorageId
        ? await ctx.storage.getUrl(avatar.meshStorageId)
        : null,
    };
  },
});

// --- Internas (no se llaman desde el frontend) ---

export const getAvatarInternal = internalQuery({
  args: { avatarId: v.id("avatars") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.avatarId);
  },
});

export const setAvatarResult = internalMutation({
  args: {
    avatarId: v.id("avatars"),
    status: v.union(v.literal("completed"), v.literal("failed")),
    meshStorageId: v.optional(v.id("_storage")),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.avatarId, {
      status: args.status,
      meshStorageId: args.meshStorageId,
      errorMessage: args.errorMessage,
      completedAt: Date.now(),
    });
  },
});

export const generateAvatar = internalAction({
  args: { avatarId: v.id("avatars") },
  handler: async (ctx, args) => {
    const gpuServiceUrl = process.env.AVATAR_GPU_SERVICE_URL;
    if (!gpuServiceUrl) {
      await ctx.runMutation(internal.avatars.setAvatarResult, {
        avatarId: args.avatarId,
        status: "failed",
        errorMessage:
          "Falta AVATAR_GPU_SERVICE_URL. Configúrala con: npx convex env set AVATAR_GPU_SERVICE_URL <url-de-ngrok>",
      });
      return;
    }

    const avatar = await ctx.runQuery(internal.avatars.getAvatarInternal, {
      avatarId: args.avatarId,
    });
    if (!avatar) return;

    const photoUrl = await ctx.storage.getUrl(avatar.photoStorageId);
    if (!photoUrl) {
      await ctx.runMutation(internal.avatars.setAvatarResult, {
        avatarId: args.avatarId,
        status: "failed",
        errorMessage: "No se pudo obtener la URL de la foto subida.",
      });
      return;
    }

    try {
      const response = await fetch(`${gpuServiceUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "bypass-tunnel-reminder": "true",
          "User-Agent": "AuraConvex/1.0",
        },
        body: JSON.stringify({ image_url: photoUrl }),
      });

      if (!response.ok) {
        throw new Error(`El servicio GPU respondió ${response.status}`);
      }

      const meshBlob = await response.blob();
      const meshStorageId = await ctx.storage.store(meshBlob);

      await ctx.runMutation(internal.avatars.setAvatarResult, {
        avatarId: args.avatarId,
        status: "completed",
        meshStorageId,
      });
    } catch (err) {
      await ctx.runMutation(internal.avatars.setAvatarResult, {
        avatarId: args.avatarId,
        status: "failed",
        errorMessage: String(err),
      });
    }
  },
});
