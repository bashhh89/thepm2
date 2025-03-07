from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Mock data for development when Supabase is not configured
mock_jobs = []

# Only try to initialize Supabase if we have valid credentials
supabase = None
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if supabase_url and supabase_key and supabase_key != "your_service_key_here":
    try:
        from supabase import create_client, Client
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
else:
    print("Using mock jobs data (Supabase credentials not configured)")

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
    if not supabase:
        return {"jobs": mock_jobs}  # Return mock data if Supabase is not configured
    try:
        response = supabase.table('jobs').select("*").execute()
        return {"jobs": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_job(job: JobCreate):
    if not supabase:
        try:
            job_data = {
                **job.dict(),
                "id": str(len(mock_jobs) + 1),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            mock_jobs.append(job_data)
            return job_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
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
    if not supabase:
        try:
            job = next((job for job in mock_jobs if job["id"] == job_id), None)
            if not job:
                raise HTTPException(status_code=404, detail="Job not found")
            return job
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    try:
        response = supabase.table('jobs').select("*").eq('id', job_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{job_id}")
async def update_job(job_id: str, job: JobUpdate):
    if not supabase:
        try:
            job_idx = next((idx for idx, j in enumerate(mock_jobs) if j["id"] == job_id), None)
            if job_idx is None:
                raise HTTPException(status_code=404, detail="Job not found")
            
            update_data = job.dict(exclude_unset=True)
            mock_jobs[job_idx].update(update_data)
            mock_jobs[job_idx]["updated_at"] = datetime.utcnow().isoformat()
            return mock_jobs[job_idx]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
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
    if not supabase:
        try:
            job_idx = next((idx for idx, j in enumerate(mock_jobs) if j["id"] == job_id), None)
            if job_idx is None:
                raise HTTPException(status_code=404, detail="Job not found")
            
            deleted_job = mock_jobs.pop(job_idx)
            return {"message": "Job deleted successfully", "job": deleted_job}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    try:
        response = supabase.table('jobs').delete().eq('id', job_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))