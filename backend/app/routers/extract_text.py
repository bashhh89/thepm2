from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict
import PyPDF2
import io
import docx
import tempfile
import os
import logging

# Set up logger
logger = logging.getLogger(__name__)

router = APIRouter()

async def extract_text_from_pdf(file: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file)
        reader = PyPDF2.PdfReader(pdf_file)
        
        if len(reader.pages) == 0:
            raise ValueError("PDF file contains no pages")
            
        text_parts = []
        for page_num, page in enumerate(reader.pages, 1):
            try:
                page_text = page.extract_text()
                if page_text.strip():
                    text_parts.append(page_text)
                else:
                    logger.warning(f"Page {page_num} appears to be empty or unreadable")
            except Exception as page_error:
                logger.error(f"Error extracting text from page {page_num}: {str(page_error)}")
                continue
        
        if not text_parts:
            raise ValueError("Could not extract any text from the PDF. The file might be scanned or contain only images.")
            
        text = "\n\n".join(text_parts)
        return text
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        error_msg = str(e)
        if "not a PDF file" in error_msg.lower() or "file has not been decrypted" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Invalid or encrypted PDF file")
        elif "memory" in error_msg.lower():
            raise HTTPException(status_code=400, detail="PDF file is too large to process")
        else:
            raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {error_msg}")

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

@router.post("/routes/extract-text")
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
