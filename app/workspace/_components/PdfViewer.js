import React from 'react'

const PdfViewer = ({ fileUrl }) => {
    return (
        <div>
            <iframe
                src={fileUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
                style={{ width: '100%', height: '90vh', border: 'none' }}
                className=' h-[90vh]'
                title="PDF Viewer"
            />
        </div>
    )
}

export default PdfViewer