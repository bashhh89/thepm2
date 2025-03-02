from fastapi import APIRouter, HTTPException, WebSocket, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.auth import AuthorizedUser
from app.services.ai import AIService
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/documents", tags=["documents"])

class DocumentContent(BaseModel):
    type: str  # text, image, chart, data
    content: str
    style: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class DocumentVersion(BaseModel):
    version: int
    content: List[DocumentContent]
    created_at: datetime
    created_by: str
    comment: Optional[str] = None

class Document(BaseModel):
    id: Optional[str] = None
    title: str
    type: str  # presentation, document, webpage
    content: List[DocumentContent]
    template_id: Optional[str] = None
    versions: List[DocumentVersion] = []
    collaborators: List[str] = []
    analytics_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class AIGenerateRequest(BaseModel):
    prompt: str
    type: str
    context: Optional[Dict[str, Any]] = None
    style_preferences: Optional[Dict[str, Any]] = None

class Comment(BaseModel):
    id: Optional[str] = None
    document_id: str
    content: str
    user_id: str
    created_at: datetime
    resolved: bool = False
    replies: List['Comment'] = []

@router.post("/create")
async def create_document(document: Document, user: AuthorizedUser):
    """Create a new document"""
    document.created_by = user.id
    document.created_at = datetime.now()
    document.updated_at = datetime.now()
    # TODO: Implement document storage
    return {"id": "generated_id", "status": "created", "document": document}

@router.post("/generate/context")
async def get_generation_context(request: AIGenerateRequest, user: AuthorizedUser):
    """Get context for client-side AI generation with Puter.js"""
    analytics_service = AnalyticsService()
    
    # Get analytics data if available
    context = {}
    if request.context and 'analytics_id' in request.context:
        analytics_data = await analytics_service.get_data(request.context['analytics_id'])
        context['analytics_data'] = analytics_data

    # Build system context
    system_message = f"You are an expert content creator specialized in creating {request.type}s."
    if request.style_preferences:
        style_str = ", ".join([f"{k}: {v}" for k, v in request.style_preferences.items()])
        system_message += f" Apply the following style preferences: {style_str}"

    # Return context for client to use with Puter.js
    return {
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": request.prompt}
        ],
        "context": context,
        "options": {
            "model": "gpt-4o-mini",  # Default model, can be overridden by client
            "stream": False
        }
    }

@router.get("/templates")
async def list_templates(type: Optional[str] = None, user: AuthorizedUser):
    """List available document templates"""
    # TODO: Implement template retrieval from database
    return [
        {
            "id": "template1",
            "name": "Basic Presentation",
            "type": "presentation",
            "thumbnail": "url_to_thumbnail",
            "style_guide": {
                "colors": ["#primary", "#secondary"],
                "fonts": ["heading", "body"],
                "layouts": ["title", "content", "split"]
            }
        }
    ]

@router.post("/{document_id}/collaborate")
async def add_collaborator(document_id: str, user_id: str, user: AuthorizedUser):
    """Add a collaborator to a document"""
    # TODO: Implement collaboration logic
    return {"status": "added", "document_id": document_id, "user_id": user_id}

@router.post("/{document_id}/comments")
async def add_comment(document_id: str, comment: Comment, user: AuthorizedUser):
    """Add a comment to a document"""
    comment.user_id = user.id
    comment.created_at = datetime.now()
    # TODO: Implement comment storage
    return comment

@router.post("/{document_id}/export")
async def export_document(
    document_id: str, 
    format: str,  # pdf, pptx, docx, html
    user: AuthorizedUser
):
    """Export document to different formats"""
    # TODO: Implement export functionality
    return {"status": "exported", "format": format, "download_url": "url_to_exported_file"}

@router.websocket("/{document_id}/ws")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    """WebSocket endpoint for real-time collaboration"""
    await websocket.accept()
    # TODO: Implement real-time collaboration
    try:
        while True:
            data = await websocket.receive_json()
            # Process and broadcast changes
            await websocket.send_json({"status": "received", "data": data})
    except Exception:
        await websocket.close()