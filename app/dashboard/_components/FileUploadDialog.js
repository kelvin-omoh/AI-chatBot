'use client'
import React, { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import axios from 'axios'

const FileUploadDialog = ({ isOpen, onClose, children }) => {

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const send = useMutation(api.fileStorage.addFileToDb);
    const embeddedDocument = useAction(api.myActions.ingest)
    const { user } = useUser()
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState('');
    const [userTokens, setUserTokens] = useState(0);


    // Fetch user details including plan and tokens from the backend
    const userQuery = useQuery(api.User.getUserDetails, { email: user?.primaryEmailAddress?.emailAddress });


    const useToken = useMutation(api.User.useTokens);


    useEffect(() => {
        if (userQuery) {
            setSelectedPlan(userQuery[0]?.plan);
            setUserTokens(userQuery[0]?.tokens);
        }
    }, [userQuery]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleUpload = async () => {
        // Check if file and file name are provided
        if (!file || !fileName) {
            alert("Please select a file and provide a file name.");
            return; // Exit the function if validation fails
        }

        setIsLoading(true);
        console.log('Uploading:', fileName, file);
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });

        const { storageId } = await result.json();
        console.log(storageId);

        // get file url 
        const fileUrl = await getFileUrl({ storageId })
        console.log(fileUrl);


        // Step 3: Save the newly allocated storage id to the database
        const fileId = uuidv4();

        await useToken({ email: user?.primaryEmailAddress?.emailAddress, tokenCount: userTokens - 1 });

        await send({
            fileId,
            fileUrl,
            storageId,
            fileName: fileName.length > 1 ? fileName : "Untitled",
            createdBy: user?.primaryEmailAddress?.emailAddress
        });

        // API CALL TO FETCH PDF PROCESS DATA
        const apiResponse = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl)
        console.log({
            splitText: apiResponse.data.result,
            fileId: fileId
        });

        const embeddedResult = await embeddedDocument(
            {
                splitText: apiResponse.data.result,
                fileId: fileId
            }
        )
        console.log(embeddedResult);





        // Reset the state
        setFile(null);
        setFileName('');
        onClose(); // Close the dialog after upload
        setIsLoading(false);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {children}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Please choose a file and provide a name for it.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <input type="file" onChange={handleFileChange} />
                    <div>
                        <Label htmlFor="file-name">File Name</Label>
                        <Input
                            id="file-name"
                            placeholder="Enter file name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">

                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    {/* let the loader be here with a laoing spinner */}
                    <Button onClick={handleUpload} disabled={isLoading || !file || !fileName}>
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploadDialog; 