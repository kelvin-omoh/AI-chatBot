import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Mutation to add or replace notes
export const addNotes = mutation({
    args: {
        fileId: v.string(),
        note: v.string(),
        createdBy: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("Received args:", args);

        // Query the database for an existing record with the given fileId
        const existingRecords = await ctx.db.query('notes')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();

        if (existingRecords.length === 0) {
            // Insert a new note if no record exists with the given fileId
            await ctx.db.insert('notes', {
                fileId: args.fileId,
                note: args.note,
                createdBy: args.createdBy,
            });
            console.log("Inserted new record for fileId:", args.fileId);
        } else {
            // Replace the existing record with updated data
            const existingRecord = existingRecords[0];
            await ctx.db.replace(existingRecord._id, {
                fileId: args.fileId,
                note: args.note, // Replace the old note with the new one
                createdBy: args.createdBy,
            });
            console.log("Replaced record for fileId:", existingRecord._id);
        }

        return { success: true };
    },
});

// Query to retrieve all notes for a specific fileId
export const GetAllNotes = query({
    args: {
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        // Query the database for notes matching the fileId
        const notes = await ctx.db.query('notes')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();

        console.log("Retrieved notes for fileId:", args.fileId, notes);

        // Return the latest note for the given fileId, or null if none exists
        return notes[0]?.note || null;
    },
});
