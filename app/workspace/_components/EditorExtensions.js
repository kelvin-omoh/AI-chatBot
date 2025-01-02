import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaHighlighter, FaEraser, FaHandSparkles } from 'react-icons/fa'; // Importing icons
import { useParams } from 'next/navigation';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import chatSession from '../../../configs/AIModel'
import { useToast } from "../../../components/hooks/use-toast"
import { useUser } from '@clerk/nextjs';


const EditorExtensions = ({ editor }) => {

    const { fileId } = useParams()
    const searchAi = useAction(api.myActions.search)
    const saveNote = useMutation(api.notes.addNotes);


    const { toast } = useToast()
    const { user } = useUser()
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    <style>
        {`  
    @keyframes colorChange {
        0% { background: linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}); }
        50% { background: linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}); }
        100% { background: linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}); }
    }

    @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
    }

    @keyframes bubbleEffect {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`}
    </style>

    // Formatting functions
    const toggleBold = () => editor.chain().focus().toggleBold().run();
    const toggleItalic = () => editor.chain().focus().toggleItalic().run();
    const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
    const toggleStrike = () => editor.chain().focus().toggleStrike().run();
    const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();



    const aiClick = async () => {
        toast({ description: "Ai is getting your answer..." })
        toast({
            title: "Ai is getting your answer...",
            description: "please wait",
        })
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ''
        )
        const res = await searchAi({
            query: selectedText,
            fileId: fileId
        })

        const AllUnformatedAnswer = JSON.parse(res)

        let ans = ''
        AllUnformatedAnswer && AllUnformatedAnswer.forEach((item) => {
            ans += item.pageContent
        })


        const prompt = `Using the selected question: ${selectedText} as the title and the provided content as the answer, generate a well-structured HTML response. The HTML should adhere to best practices and maintain proper formatting. The answer content is:

<html>
  <body>
    ${ans}
  </body>
</html>
Ensure the body of the response is coherent and logically structured, avoiding unexpected or irrelevant content.`


        console.log(ans);

        const AiModelResult = await chatSession.sendMessage(prompt);
        console.log(AiModelResult.response.text());
        const finalAns = AiModelResult.response.text().replace('```', ''.replace('html', '').replace('```', '')).replace('html', '').replace('```', '')
        const AllText = editor.getHTML()
        editor.commands.setContent(AllText + '<p> <strong> Answer: </strong>' + finalAns + '</p>')

        saveNote({
            note: editor.getHTML(),
            fileId: fileId,
            createdBy: user?.primaryEmailAddress?.emailAddress
        })

    }


    return (
        <div className="mb-4 w-full ">
            <div className="flex gap-4 pt-4  items-center justify-center  mx-auto w-full">
                <div className="flex space-x-2 mb-2">
                    <button onClick={toggleBold} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaBold className="mr-1" />
                    </button>
                    <button onClick={toggleItalic} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaItalic className="mr-1" />
                    </button>
                    <button onClick={toggleUnderline} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaUnderline className="mr-1" />
                    </button>
                    <button onClick={toggleStrike} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaStrikethrough className="mr-1" />
                    </button>
                    <button onClick={toggleBulletList} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                        <FaListUl className="mr-1" />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 ${editor && editor.isActive('highlight') ? 'bg-yellow-500' : 'bg-yellow-400'} text - white rounded shadow hover: bg - yellow - 600 transition duration - 200 flex items - center`}>
                        <FaHighlighter className="mr-1 " />
                    </button>
                </div>
                <div className="flex space-x-2 mb-2">
                    <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()} className={`p - 2 ${editor && editor.isActive('highlight', { color: '#ffc078' }) ? 'bg-orange-400' : 'bg-orange-300'} text - white rounded shadow hover: bg - orange - 500 transition duration - 200`}>
                        T
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#8ce99a' }).run()} className={`p - 2 ${editor && editor.isActive('highlight', { color: '#8ce99a' }) ? 'bg-green-400' : 'bg-green-300'} text - white rounded shadow hover: bg - green - 500 transition duration - 200`}>
                        T
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run()} className={`p - 2 ${editor && editor.isActive('highlight', { color: '#74c0fc' }) ? 'bg-blue-400' : 'bg-blue-300'} text - white rounded shadow hover: bg - blue - 500 transition duration - 200`}>
                        T
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#b197fc' }).run()} className={`p - 2 ${editor && editor.isActive('highlight', { color: '#b197fc' }) ? 'bg-purple-400' : 'bg-purple-300'} text - white rounded shadow hover: bg - purple - 500 transition duration - 200`}>
                        T
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHighlight({ color: 'red' }).run()} className={`p - 2 ${editor && editor.isActive('highlight', { color: 'red' }) ? 'bg-red-400' : 'bg-red-300'} text - white rounded shadow hover: bg - red - 500 transition duration - 200`}>
                        T
                    </button>
                    <button onClick={() => editor.chain().focus().unsetHighlight().run()} disabled={!editor || !editor.isActive('highlight')} className="p-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 transition duration-200 flex items-center">
                        <FaEraser className="mr-1" />
                    </button>

                    <button
                        onClick={aiClick}
                        className="p-2 text-white rounded-full cursor-pointer shadow-lg transition duration-200 flex items-center transform hover:scale-105"

                        style={{
                            background: `linear-gradient(90deg, ${getRandomColor()}, ${getRandomColor()})`,
                            animation: 'gradientMove 3s linear infinite, bubbleEffect 1s ease-in-out infinite',
                            backgroundSize: '200% 200%'
                        }}
                    >
                        <FaHandSparkles className="mr-1" />
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

export default EditorExtensions;