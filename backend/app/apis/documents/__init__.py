from fastapi import APIRouter, HTTPException, WebSocket, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.auth import AuthorizedUser
from app.services.ai import AIService
from app.services.analytics import AnalyticsService
from .mkdir import router as mkdir_router

router = APIRouter(prefix="/documents", tags=["documents"])

# Include the mkdir router
router.include_router(mkdir_router)

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
