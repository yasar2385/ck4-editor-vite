import React, { useState } from "react";
import { uploadDocuments } from "../core/api";
import ChatWSComponent from "./ChatComponent";

const FileUploadComponent = () => {
    const [sessionId] = useState(() => crypto.randomUUID());
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleUpload = async () => {
        if (!files.length) return alert("Please select at least one file!");
        setUploading(true);
        try {
            const res = await uploadDocuments(sessionId, files);
            console.log("✅ Upload complete:", res);
            setUploaded(true);
        } catch (err) {
            alert("Upload failed — check console/logs");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (uploaded) {
        // Once uploaded, show chat
        return <ChatWSComponent key={sessionId} sessionId={sessionId} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-xl font-bold text-cyan-700 mb-2">
                    📄 Upload Documents
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Upload PDFs, TXT, or DOC files for LlamaIndex to process.
                </p>

                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles([...e.target.files])}
                    className="w-full text-sm border border-gray-300 rounded-md p-2"
                />

                <button
                    onClick={handleUpload}
                    disabled={uploading || !files.length}
                    className={`mt-4 w-full py-2 rounded-md text-white ${uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-cyan-600 hover:bg-cyan-700"
                        }`}
                >
                    {uploading ? "Uploading..." : "Start Upload"}
                </button>
            </div>
        </div>
    );
};

export default FileUploadComponent;
