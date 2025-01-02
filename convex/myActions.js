import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action, mutation } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";


export const ingest = action({
    args: {
        splitText: v.any(), // Should be an array or JSON-compatible structure
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        try {
            // Create the vector store
            await ConvexVectorStore.fromTexts(
                args.splitText,
                args.fileId,
                new GoogleGenerativeAIEmbeddings({
                    apiKey: "AIzaSyDPOWPtCd8j4wYIdjoJphwScEjGxV4K_n4",
                    model: "text-embedding-004",
                    taskType: TaskType.RETRIEVAL_DOCUMENT,
                    title: "Document title",
                }),
                { ctx }
            );

            // Return a simple status or result instead of the vector store
            return { status: "success", fileId: args.fileId };
        } catch (error) {
            console.error("Error during vector store ingestion:", error);
            throw new Error("Failed to process vector store");
        }
    },
});



export const search = action({
    args: {
        query: v.string(),
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
            apiKey: "AIzaSyDPOWPtCd8j4wYIdjoJphwScEjGxV4K_n4",
            model: "text-embedding-004",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "Document title",
        }), { ctx });

        // Perform similarity search with the query and filter by fileId


        const results = await vectorStore.similaritySearch(args.query, 1);

        // Combine all metadata into a single string
        const combinedMetadata = results
            .map(item => Object.values(item.metadata).join('')) // Extract and join metadata values
            .join('');

        console.log("Combined Metadata from similarity search:", combinedMetadata); // Log the combined metadata

        // Filter results by matching the combined metadata to the fileId
        const filteredResults = results.filter(item =>
            Object.values(item.metadata).join('') === args.fileId
        );

        console.log("Filtered Results:", JSON.stringify(filteredResults, null, 2)); // Log the filtered results in a readable format

        // Return the filtered results as a JSON string
        return JSON.stringify(filteredResults);
    },
});
