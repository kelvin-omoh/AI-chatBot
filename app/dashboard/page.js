"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

const Page = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [editingFileId, setEditingFileId] = useState(null);
    const [newFileName, setNewFileName] = useState("");

    const fileList = useQuery(api.fileStorage.getUserFiles, {
        userEmail: user?.primaryEmailAddress?.emailAddress,
    });

    const renameFile = useMutation(api.fileStorage.renameFile);
    const deleteFile = useMutation(api.fileStorage.deleteFile); // New mutation for file deletion
    const navigate = useRouter();

    useEffect(() => {
        if (fileList) {
            setFiles(fileList);
            setLoading(false);
        }
    }, [fileList]);

    const formatCreationTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleRename = async () => {
        try {
            await renameFile({ fileId: editingFileId, newFileName });
            setFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.fileId === editingFileId ? { ...file, fileName: newFileName } : file
                )
            );
            setEditingFileId(null);
        } catch (error) {
            console.error("Rename failed:", error);
            alert("Could not rename the file. Please try again.");
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await deleteFile({ fileId });
            setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Could not delete the file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center pt-10 bg-gradient-to-r from-black via-purple-800 to-black shadow-lg min-h-screen">
            <div className="flex justify-between items-center w-full max-w-7xl px-6 mb-8">
                <h1 className="text-4xl text-white tracking-wide font-thin font-serif">
                    Workspace
                </h1>
                {files.length < 3 && (
                    <button className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                        <span className="text-2xl mr-2">+</span>
                        Add File
                    </button>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 rounded-xl shadow-md w-80 h-24 animate-pulse transition-transform transform hover:scale-105"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                    {files.map((file) => (
                        <div onClick={() => navigate.push(`/workspace/${file.fileId}`)}
                            key={file.fileId}
                            className="bg-black cursor-pointer text-white shadow-xl rounded-lg border-[1px] border-gray-700 hover:shadow-2xl hover:scale-105 transform p-4"
                        >
                            <div className="flex items-center space-x-4">
                                <FaFilePdf className="text-4xl text-purple-500 transition-transform transform hover:scale-110" />
                                <div className="flex flex-col">
                                    {editingFileId === file.fileId ? (
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            className="bg-gray-800 text-white p-2 rounded-md focus:outline-none"
                                        />
                                    ) : (
                                        <span className="text-xl font-semibold">{file.fileName}</span>
                                    )}
                                    <span className="text-sm text-gray-400">
                                        {formatCreationTime(file._creationTime)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                {editingFileId === file.fileId ? (
                                    <>
                                        <button
                                            onClick={handleRename}
                                            className="bg-green-600 hover:bg-green-500 text-white py-1 px-4 rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingFileId(null)}
                                            className="bg-red-600 hover:bg-red-500 text-white py-1 px-4 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className=" w-full flex justify-between items-center">
                                        <button
                                            onClick={() => {
                                                setEditingFileId(file.fileId);
                                                setNewFileName(file.fileName);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-1 rounded-lg"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.fileId)}
                                            className="bg-red-600 hover:bg-red-500 text-white py-1 px-1 rounded-lg"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="mt-auto text-center bg-black w-full py-4 border-t border-gray-700">
                <p className="text-sm text-gray-300">Dashboard</p>
                <p className="text-sm text-gray-400 mt-2">Developed by Enaikele © 2024</p>
            </footer>
        </div>
    );
};

export default Page;
