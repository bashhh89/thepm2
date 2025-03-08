from fastapi import APIRouter, UploadFile, HTTPException, File
from fastapi.responses import JSONResponse
import PyPDF2
import io
import docx
import logging
import os
import tempfile
import traceback

# Set up logging with more detailed format
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/extract-text", tags=["extract-text"])

async def cleanup_temp_file(file_path: str):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up temporary file {file_path}: {e}")

async def extract_text_from_pdf(file: bytes) -> str:
    temp_file = None
    try:
        logger.debug("Starting PDF text extraction")
        # Save to temp file to handle large PDFs better
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(file)
            temp_file = tmp.name
            logger.debug(f"Saved PDF to temporary file: {temp_file}")

        with open(temp_file, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            total_pages = len(pdf_reader.pages)
            logger.debug(f"Processing PDF with {total_pages} pages")
            
            for i, page in enumerate(pdf_reader.pages):
                logger.debug(f"Extracting text from page {i+1}/{total_pages}")
                text += page.extract_text() + "\n"
        
        text = text.strip()
        if not text:
            logger.warning("No text extracted from PDF")
            raise HTTPException(
                status_code=400, 
                detail="No text could be extracted from the PDF. The file might be scanned or contain only images."
            )
        
        logger.debug(f"Successfully extracted {len(text)} characters of text")
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error extracting text from PDF: {str(e)}"
        )
    finally:
        if temp_file:
            await cleanup_temp_file(temp_file)

async def extract_text_from_docx(file: bytes) -> str:
    temp_file = None
    try:
        # Save to temp file to handle large DOC files better
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
            tmp.write(file)
            temp_file = tmp.name

        doc = docx.Document(temp_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        if not text.strip():
            logger.warning("No text extracted from DOCX")
            raise HTTPException(status_code=400, detail="No text could be extracted from the document. The file might be empty or corrupted.")
        
        return text.strip()
    except Exception as e:
        logger.error(f"DOCX extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error extracting text from DOCX: {str(e)}")
    finally:
        if temp_file:
            await cleanup_temp_file(temp_file)

@router.post("")
async def extract_text(file: UploadFile = File(...)) -> JSONResponse:
    temp_file = None
    try:
        logger.info(f"Starting file processing: {file.filename} ({file.content_type})")
        logger.debug(f"Headers: {file.headers}")
        
        if not file.content_type:
            logger.warning("No content type specified")
            return JSONResponse(
                status_code=400,
                content={
                    "detail": "Content type not specified",
                    "supported_types": [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "text/plain"
                    ]
                }
            )
        
        content = await file.read()
        content_size = len(content)
        logger.info(f"Read {content_size} bytes from file")
        
        if content_size == 0:
            logger.error("Empty file received")
            return JSONResponse(
                status_code=400,
                content={"detail": "Empty file received"}
            )
        
        if content_size > 10 * 1024 * 1024:  # 10MB limit
            logger.error(f"File too large: {content_size} bytes")
            return JSONResponse(
                status_code=400,
                content={"detail": "File size must be less than 10MB"}
            )
        
        # Save uploaded file to temp location for processing
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(content)
            temp_file = tmp.name
            logger.debug(f"Saved to temp file: {temp_file}")
        
        try:
            if file.content_type == "application/pdf":
                logger.info("Processing PDF file")
                text = await extract_text_from_pdf(content)
            elif file.content_type in [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ]:
                logger.info("Processing Word document")
                text = await extract_text_from_docx(content)
            elif file.content_type == "text/plain":
                logger.info("Processing text file")
                text = content.decode('utf-8').strip()
                if not text:
                    logger.warning("Empty text file received")
                    return JSONResponse(
                        status_code=400,
                        content={"detail": "The text file is empty"}
                    )
            else:
                logger.warning(f"Unsupported file type: {file.content_type}")
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
            
            text_length = len(text)
            logger.info(f"Successfully extracted {text_length} characters from {file.filename}")
            
            if text_length < 50:  # Suspiciously short text
                logger.warning(f"Very short text extracted ({text_length} chars). File might be corrupt or empty.")
            
            return JSONResponse(content={
                "text": text,
                "filename": file.filename,
                "content_type": file.content_type,
                "chars_extracted": text_length
            })
            
        except Exception as e:
            logger.error(f"Text extraction error for {file.filename}: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Error extracting text: {str(e)}"}
            )
            
    except Exception as e:
        logger.error(f"Unexpected error during file processing: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Error processing file: {str(e)}"}
        )
    finally:
        if temp_file:
            await cleanup_temp_file(temp_file)
        await file.close()