from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict
import PyPDF2
import io
import docx
import tempfile
import os

router = APIRouter()

async def extract_text_from_pdf(file: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

async def extract_text_from_docx(file: bytes) -> str:
    try:
        # Save the bytes to a temporary file since python-docx needs a file path
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
            tmp.write(file)
            tmp_path = tmp.name
        
        doc = docx.Document(tmp_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        # Clean up the temporary file
        os.unlink(tmp_path)
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from DOCX: {str(e)}")

@router.post("/extract-text")
async def extract_text(file: UploadFile) -> Dict[str, str]:
    content = await file.read()
    
    if file.content_type == "application/pdf":
        text = await extract_text_from_pdf(content)
    elif file.content_type in [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        text = await extract_text_from_docx(content)
    elif file.content_type == "text/plain":
        text = content.decode('utf-8')
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file."
        )
    
    return {"text": text}