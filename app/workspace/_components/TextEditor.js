'use client'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import EditorExtensions from '../_components/EditorExtensions'
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { NoteContext } from '../../Provider';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import Underline from '@tiptap/extension-underline'
const TextEditor = () => {
    const { fileId } = useParams()
    console.log(fileId);
    const { setNotes } = useContext(NoteContext);
    const { user } = useUser()
    const saveNote = useMutation(api.notes.addNotes);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start Taking your note"
            }),
            Underline,
            Document,
            Paragraph,
            Text,
            Highlight.configure({ multicolor: true })
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        }
    })

    const notes = useQuery(api.notes.GetAllNotes, {
        fileId: fileId
    })

    useEffect(() => {
        if (editor && notes) {
            editor.commands.setContent(notes);
        }
    }, [notes, editor]);

    useEffect(() => {
        if (editor) {
            editor.on('blur', async () => {
                console.log('The editor isn’t focused anymore.');
                const content = editor.getHTML();
                setNotes(content);

                const createdBy = user?.primaryEmailAddress?.emailAddress;

                if (!createdBy) {

                    return; // Prevent saving if createdBy is not available
                }

                try {
                    await saveNote({ note: content, fileId, createdBy });
                } catch (error) {
                    console.error("Error saving note:", error);
                    alert("Failed to save the note.");
                }
            });
        }
    }, [editor, user]);

    return (
        <div className=' overflow-y-auto h-[80vh] '>
            {/* Control Group for Text Formatting */}
            <div className="mb-4 flex space-x-2">
                <EditorExtensions editor={editor} />
            </div>
            <div className=' overflow-y-auto h-[80vh] '>
                <EditorContent editor={editor} />

            </div>
        </div>
    )
}

export default TextEditor