from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict
import PyPDF2
import io
import docx
import tempfile
import os

router = APIRouter(prefix="/extract-text", tags=["extract-text"])

async def extract_text_from_pdf(file: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

async def extract_text_from_docx(file: bytes) -> str:
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
            tmp.write(file)
            tmp_path = tmp.name
        
        doc = docx.Document(tmp_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        # Clean up the temporary file
        os.unlink(tmp_path)
        return text.strip()
    except Exception as e:
        print(f"DOCX extraction error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error extracting text from DOCX: {str(e)}")

@router.post("")
async def extract_text(file: UploadFile) -> JSONResponse:
    try:
        content = await file.read()
        print(f"Processing file: {file.filename}, type: {file.content_type}")
        
        if file.content_type == "application/pdf":
            text = await extract_text_from_pdf(content)
        elif file.content_type in [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]:
            text = await extract_text_from_docx(content)
        elif file.content_type == "text/plain":
            text = content.decode('utf-8').strip()
        else:
            return JSONResponse(
                status_code=400,
                content={
                    "detail": "Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.",
                    "supported_types": [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "text/plain"
                    ]
                }
            )
        
        if not text:
            return JSONResponse(
                status_code=400,
                content={
                    "detail": "No text could be extracted from the document. Please ensure the file contains readable text."
                }
            )
        
        return JSONResponse(content={"text": text})
    except Exception as e:
        print(f"Extraction error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Error processing file: {str(e)}"}
        )