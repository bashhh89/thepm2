from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Initialize Supabase client
supabase: Client = create_client(
    supabase_url="https://vzqythwfrmjakhvmopyf.supabase.co",
    supabase_key=os.getenv("SUPABASE_SERVICE_KEY")
)

class JobCreate(BaseModel):
    title: str
    department: str
    location: str
    type: str
    experience: str
    description: str
    requirements: List[str]
    benefits: List[str]

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    experience: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None

@router.get("")
async def get_jobs():
    try:
        response = supabase.table('jobs').select("*").execute()
        return {"jobs": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_job(job: JobCreate):
    try:
        response = supabase.table('jobs').insert({
            **job.dict(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{job_id}")
async def get_job(job_id: str):
    try:
        response = supabase.table('jobs').select("*").eq('id', job_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{job_id}")
async def update_job(job_id: str, job: JobUpdate):
    try:
        response = supabase.table('jobs').update({
            **job.dict(exclude_unset=True),
            "updated_at": datetime.utcnow().isoformat()
        }).eq('id', job_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{job_id}")
async def delete_job(job_id: str):
    try:
        response = supabase.table('jobs').delete().eq('id', job_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))