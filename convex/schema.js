import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userName: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        plan: v.string(), // User's plan (Free, Starter, Pro)
        tokens: v.number(), // Tokens available to the user
    }),

    userTokens: defineTable({
        email: v.string(), // User's email
        tokenCount: v.number(), // Tokens available to the user
    }),

    pdfFiles: defineTable({
        fileId: v.string(),
        fileUrl: v.string(),
        fileName: v.string(),
        storageId: v.string(),
        createdBy: v.string()
    }),


    documents: defineTable({
        embedding: v.array(v.number()),
        text: v.string(),
        metadata: v.any(),
    }).vectorIndex("byEmbedding", {
        vectorField: "embedding",
        dimensions: 768,
    }),




    notes: defineTable({
        fileId: v.string(),
        note: v.string(),
        createdBy: v.any(),
    })
});
