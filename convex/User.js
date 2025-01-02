import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
    args: {
        email: v.string(),
        userName: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        // if user alredy exist
        const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).collect();

        // if not insert new user entry
        if (user.length == 0) {
            await ctx.db.insert("users", {
                email: args.email,
                userName: args.userName,
                imageUrl: args.imageUrl,
                plan: "Free",
                tokens: 5, // Default free trial tokens
            })

            // Create the userTokens record with 5 tokens
            await ctx.db.insert("userTokens", {
                email: args.email,
                tokenCount: 5,
            });

            return 'User Created with 5 Free Tokens';
        }

        return 'User Already Exists'
    },
});


export const upgradeUserPlan = mutation({
    args: {
        email: v.string(),
        plan: v.string(), // New plan (Starter, Pro)
    },
    handler: async (ctx, args) => {
        // Get the user data based on the email using a predicate function
        const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).first();

        if (!user) {
            throw new Error("User not found");
        }

        // Determine token count based on plan
        let tokenCount = 5;
        if (args.plan === "Starter") {
            tokenCount = 15;
        } else if (args.plan === "Pro") {
            tokenCount = 30;
        }

        // Update the user's plan and token count in the "users" table
        await ctx.db.patch(user._id, {
            plan: args.plan,
            tokens: tokenCount,
        });

        // Update the userTokens record with the new token count
        const existingUserTokens = await ctx.db.query("userTokens")
            .filter(q => q.eq(q.field("email"), args.email))
            .first();

        if (existingUserTokens) {
            // Replace the existing userTokens record
            await ctx.db.patch(existingUserTokens._id, {
                email: args.email,
                tokenCount: tokenCount,
            });
        } else {
            // If no existing record, insert a new one
            await ctx.db.insert("userTokens", {
                email: args.email,
                tokenCount: tokenCount,
            });
        }

        return `User upgraded to ${args.plan} plan with ${tokenCount} tokens.`;
    },
});








export const deductTokens = mutation({
    args: {
        email: v.string(),     // User's email  
        tokenCount: v.number(), // Number of tokens to deduct  
    },
    handler: async (ctx, args) => {
        // Find the user's record by email  
        const user = await ctx.db.query('users').filter(q => q.eq(q.field('email'), args.email)).first();

        // Check if the user record exists  
        if (!user) {
            throw new Error("User not found.");
        }

        // Check if there are enough tokens available for deduction  
        if (user.tokens < args.tokenCount) {
            throw new Error(`Insufficient tokens. Available: ${user.tokens}, Requested: ${args.tokenCount}.`);
        }

        // Calculate the updated token count  
        const updatedTokenCount = user.tokens - args.tokenCount;

        // Update the user's token count in the database  
        await ctx.db.patch(user._id, {
            tokens: updatedTokenCount,
        });

        // Return a success message  
        return `Successfully used ${args.tokenCount} tokens. Remaining tokens: ${updatedTokenCount}.`;
    },
});







export const getUserDetails = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        // Fetch user details based on the email
        const user = await ctx.db.query('users').filter(q => q.eq(q.field('email'), args.email)).collect();

        if (!user) {
            throw new Error('User not found');
        }

        return user;  // Return the user data with plan and tokens
    },
});