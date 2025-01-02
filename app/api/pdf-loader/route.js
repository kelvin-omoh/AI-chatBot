import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export async function GET(req) {
    const reqUrl = req.url
    const { searchParams } = new URL(reqUrl)

    // 1. load the pdf file
    const pdfUrl = searchParams.get('pdfUrl');
    if (!pdfUrl) {
        return NextResponse.json({ message: 'No pdfUrl provided' }, { status: 400 })
    }

    const pdfData = await fetch(pdfUrl);
    const data = await pdfData.blob()
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = ''
    docs.forEach((doc => {
        pdfTextContent += doc.pageContent
    }))


    // 2. split the text into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([pdfTextContent]);

    let splitterList = []
    chunks.forEach((chunk) => {
        splitterList.push(chunk.pageContent)
    })


    return NextResponse.json({ result: splitterList });
}