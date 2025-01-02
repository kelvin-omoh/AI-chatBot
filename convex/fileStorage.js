import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { action } from "./_generated/server.js"; // Import action or query properly


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const addFileToDb = mutation({
    args: {
        fileId: v.string(),
        fileUrl: v.string(),
        storageId: v.string(),
        createdBy: v.string(),
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        console.log(args);

        const res = await ctx.db.insert("pdfFiles", {
            fileId: args.fileId,
            storageId: args.storageId,
            fileUrl: args.fileUrl,
            fileName: args.fileName,
            createdBy: args.createdBy,

        });
        return res;
    },
});


export const getFileUrl = mutation({
    args: {
        storageId: v.string(),
    },
    handler: async (ctx, args) => {
        const url = ctx.storage.getUrl(args.storageId);
        return url;
    },
})


export const getFileRecord = query({
    args: {
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        const res = await ctx.db.query('pdfFiles')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();
        return res;
    },
});



export const getUserFiles = query({
    args: {
        userEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const res = await ctx.db.query('pdfFiles')
            .filter((q) => q.eq(q.field('createdBy'), args.userEmail))
            .collect();
        return res;
    },
});




export const renameFile = mutation({
    args: {
        fileId: v.string(),
        newFileName: v.string(),
    },
    handler: async (ctx, args) => {
        const { fileId, newFileName } = args;

        // Find the file record by fileId
        const fileRecord = await ctx.db.query('pdfFiles')
            .filter((q) => q.eq(q.field('fileId'), fileId))
            .first();

        if (!fileRecord) {
            throw new Error(`File with ID ${fileId} not found.`);
        }

        // Update the file name
        await ctx.db.patch(fileRecord._id, { fileName: newFileName });

        console.log(`File ${fileId} renamed to ${newFileName}`);
        return { success: true };
    },
});


export const deleteFile = mutation({
    args: {
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        const { fileId } = args;

        // Find the file record by fileId
        const fileRecord = await ctx.db.query('pdfFiles')
            .filter((q) => q.eq(q.field('fileId'), fileId))
            .first();

        if (!fileRecord) {
            throw new Error(`File with ID ${fileId} not found.`);
        }

        // Delete the file record
        await ctx.db.delete(fileRecord._id);

        console.log(`File ${fileId} deleted successfully.`);
        return { success: true };
    },
});