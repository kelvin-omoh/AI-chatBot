'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import TextEditor from '../_components/TextEditor';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const Page = () => {
    const { fileId } = useParams();
    const queryResult = useQuery(api.fileStorage.getFileRecord, { fileId });

    // Fallback for destructuring
    const fileRecord = queryResult?.[0]; // Access the first item in the array

    const isLoading = !fileRecord; // Determine loading state based on fileRecord

    const renderLoading = () => (
        <div className="flex items-center mt-[30vh] justify-center h-full">
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full border-8 border-t-8 border-gray-300 border-t-blue-500 w-16 h-16" />
                <div className="mt-2 text-blue-500">Loading...</div>
            </div>
        </div>
    );



    const renderContent = () => (
        <>
            <div className='  '>
                <TextEditor />
            </div>
            <div className=' '>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full border-8 border-gray-300 border-t-blue-500 w-16 h-16" />
                        <div className="mt-2 text-blue-500">Loading PDF...</div>
                    </div>
                ) : fileRecord?.fileUrl ? (
                    <PdfViewer fileUrl={fileRecord?.fileUrl} />
                ) : (
                    "Can't Preview this file"
                )}
            </div>
        </>
    );

    return (
        <div>
            <WorkspaceHeader fileName={fileRecord?.fileName} />
            <div className={`grid ${isLoading ? 'grid-cols-1' : 'grid-cols-2'} gap-5 `}>
                {isLoading ? renderLoading() : renderContent()}
            </div>
        </div>
    );
}

export default Page;