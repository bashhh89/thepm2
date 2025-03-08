from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import os

router = APIRouter(prefix="/leads", tags=["leads"])

supabase = None
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if supabase_url and supabase_key and supabase_key != "your_service_key_here":
    try:
        from supabase import create_client, Client
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully for leads")
    except Exception as e:
        print(f"Failed to initialize Supabase client for leads: {e}")
else:
    print("Using mock leads data (Supabase credentials not configured)")

class LeadCreate(BaseModel):
    name: str
    email: str
    source: str
    timestamp: datetime
    metadata: Optional[dict] = None

@router.post("")
async def create_lead(lead: LeadCreate):
    try:
        if not supabase:
            # Mock response for development
            return {
                "id": "mock_lead_id",
                **lead.dict(),
                "created_at": datetime.utcnow().isoformat()
            }
        
        # Create lead in Supabase
        response = supabase.table('leads').insert({
            **lead.dict(),
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create lead")
            
        return response.data[0]
    except Exception as e:
        print(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_leads():
    try:
        if not supabase:
            # Mock response for development
            return {"leads": []}
            
        response = supabase.table('leads').select("*").execute()
        return {"leads": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{lead_id}")
async def get_lead(lead_id: str):
    try:
        if not supabase:
            raise HTTPException(status_code=404, detail="Lead not found")
            
        response = supabase.table('leads').select("*").eq('id', lead_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Lead not found")
            
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))