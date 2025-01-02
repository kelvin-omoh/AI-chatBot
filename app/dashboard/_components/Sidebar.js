'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Layout, ArrowUpCircle, Shield } from 'lucide-react'
import { Progress } from '../../../components/ui/progress'
import FileUploadDialog from './FileUploadDialog'
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api'
import { usePathname, useRouter } from 'next/navigation'

const Sidebar = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const path = usePathname()
    const router = useRouter();
  
    // Fetch user files
    const fileList = useQuery(api.fileStorage.getUserFiles, {
        userEmail: user?.primaryEmailAddress?.emailAddress,
    });

    useEffect(() => {
        if (fileList) {
            setFiles(fileList);
            setLoading(false);
        }
    }, [fileList]);

    const handleUploadClick = () => {
        if (files.length < 5) {
            setIsDialogOpen(true);
        } else {
            alert("You have reached the maximum limit of 5 PDFs. Please upgrade to upload more.");
        }
    };

    const handleUpgradeClick = () => {
        router.push('/dashboard/upgrade');
    };

    const handleWorkspaceClick = () => {
        router.push('/dashboard');
    };

    return (
        <div className='bg-gradient-to-b from-purple-800 to-black relative text-white shadow-lg h-screen p-5'>
            {/* logo */}
            <h1 className='text-3xl font-bold mb-6 text-center'>KO-BOT</h1>
            {/* menu */}
            <div className='mt-10'>
                <FileUploadDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <Button className='w-full bg-purple-600 hover:bg-purple-700 transition duration-300 mb-4' onClick={handleUploadClick}>
                        + Upload PDF
                    </Button>
                </FileUploadDialog>

                {/* Upgrade Section */}
                <div className='mt-6'>
                    <h2 className='text-lg font-semibold mb-2 flex items-center'>
                        <Shield className='mr-2' /> Upgrade
                    </h2>
                    <Button className={`flex items-center w-full bg-purple-600 hover:bg-purple-700 transition duration-300 mb-4 ${path === '/dashboard/upgrade' ? 'pointer-events-none opacity-50' : ''}`} onClick={handleUpgradeClick}>
                        <span className='flex-grow'>Upgrade Now</span>
                    </Button>

                    {/* Workspace Section */}
                    <h2 className={`text-lg font-semibold mb-2 flex items-center ${path === '/dashboard' ? 'pointer-events-none opacity-50' : ''}`}>
                        <ArrowUpCircle className='mr-2' /> Workspace
                    </h2>
                    <Button className={`flex items-center w-full bg-purple-600 hover:bg-purple-700 transition duration-300 mb-4 ${path === '/dashboard/workspace' ? 'pointer-events-none opacity-50' : ''}`} onClick={handleWorkspaceClick}>
                        <span className='flex-grow'>Go to Workspace</span>
                    </Button>
                </div>
            </div>

            {/* Progress bar */}
            <div className='mt-4 absolute bottom-10 w-[90%] bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-4 shadow-lg transition duration-300'>
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    </div>
                ) : (
                    <>
                        <Progress value={(files.length / 5) * 100} className='h-4 rounded-full bg-gradient-to-r from-purple-300/95 to-purple-600' />
                        <p className='text-sm mt-2 font-medium text-white'>{files.length} out of 5 PDFs Uploaded</p>
                        <p className='text-xs text-gray-200 mt-1'>Upgrade to Upload more PDFs</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Sidebar