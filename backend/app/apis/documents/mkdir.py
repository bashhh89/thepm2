from fastapi import APIRouter, HTTPException, Depends
from databutton_app.mw.auth_mw import get_authorized_user
import os

router = APIRouter()

@router.post("/mkdir")
async def create_directory(directory_name: str, user: User = Depends(get_authorized_user)):
    try:
        # Logic to create a directory
        os.makedirs(directory_name, exist_ok=True)  # Create the directory
        return {"message": f"Directory '{directory_name}' created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
