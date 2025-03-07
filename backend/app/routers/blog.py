from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/posts", tags=["blog"])

# In-memory storage for development
# TODO: Replace with database
posts_db = []

class Author(BaseModel):
    name: str
    avatar: Optional[str] = None

class BlogPostBase(BaseModel):
    title: str
    content: str
    excerpt: str
    coverImage: Optional[str] = None
    author: Author
    tags: List[str] = []
    categories: List[str] = []
    status: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: str
    publishedAt: str
    updatedAt: str

    class Config:
        from_attributes = True

@router.get("", response_model=List[BlogPost])
async def get_posts():
    return posts_db

@router.post("", response_model=BlogPost, status_code=status.HTTP_201_CREATED)
async def create_post(post: BlogPostCreate):
    new_post = BlogPost(
        **post.model_dump(),
        id=str(uuid4()),
        publishedAt=datetime.utcnow().isoformat(),
        updatedAt=datetime.utcnow().isoformat()
    )
    posts_db.append(new_post.model_dump())
    return new_post

@router.put("/{post_id}", response_model=BlogPost)
async def update_post(post_id: str, post_update: BlogPostBase):
    for i, post in enumerate(posts_db):
        if post["id"] == post_id:
            posts_db[i].update(
                **post_update.model_dump(),
                updatedAt=datetime.utcnow().isoformat()
            )
            return posts_db[i]
    raise HTTPException(status_code=404, detail="Post not found")

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str):
    for i, post in enumerate(posts_db):
        if post["id"] == post_id:
            posts_db.pop(i)
            return
    raise HTTPException(status_code=404, detail="Post not found")
