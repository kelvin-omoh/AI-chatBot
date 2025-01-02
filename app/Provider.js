"use client";

import React, { createContext, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Create a context for notes
export const NoteContext = createContext();

export function ConvexClientProvider({ children }) {
    // State to hold all notes
    const [notes, setNotes] = useState([]);

    return (
        <ConvexProvider client={convex}>
            <NoteContext.Provider value={{ notes, setNotes }}>
                {children}
            </NoteContext.Provider>
        </ConvexProvider>
    );
}
