import { UserButton, useUser } from '@clerk/nextjs'
import React, { useContext, useState } from 'react'
import { NoteContext } from '../../Provider';
import { useParams } from 'next/navigation';
import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import Link from 'next/link';

const WorkspaceHeader = ({ fileName }) => {
    const { notes: allNotes, setNotes } = useContext(NoteContext); // Renamed 'notes' to 'allNotes'
    const { fileId } = useParams()
    const { user } = useUser()
    const saveNote = useMutation(api.notes.addNotes);

    const [loading, setLoading] = useState(false);

    const saveNoteHandler = async () => {
        try {
            setLoading(true);
            await saveNote({ note: allNotes, fileId, createdBy: user?.primaryEmailAddress?.emailAddress });
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save the note.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-screen flex justify-between items-center p-5 bg-gradient-to-r from-black via-purple-800 to-black shadow-lg'>
            <Link href="/dashboard" className='text-4xl font-bold text-white'>KO-BOT</Link>
            <h1 className='text-2xl font-semibold text-white'>{fileName}</h1>
            <div className='flex items-center space-x-4'>
                <button
                    className='bg-white text-purple-800 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition duration-200'
                    onClick={() => saveNoteHandler()}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <UserButton />
            </div>
        </div>
    )
}

export default WorkspaceHeader