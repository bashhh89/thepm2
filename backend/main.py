import os
import pathlib
import json
import dotenv
import logging
from fastapi import FastAPI, APIRouter, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware  # Updated import path
from app.env import setup_cors
from app.routers.blog import router as blog_router
from app.routers.extract_text import router as extract_text_router

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self' js.puter.com api.puter.com; "
            "img-src 'self' data: blob:; "
            "style-src 'self' 'unsafe-inline'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.puter.com; "
            "connect-src 'self' js.puter.com api.puter.com localhost:* 127.0.0.1:*; "
            "frame-src 'self' js.puter.com;"
        )
        return response

def get_router_config() -> dict:
    try:
        with open("routers.json") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading router config: {e}")
        return {"routers": {}}

def is_auth_disabled(router_config: dict, name: str) -> bool:
    try:
        return router_config.get("routers", {}).get(name, {}).get("disableAuth", False)
    except Exception:
        return False

def import_api_routers() -> APIRouter:
    routes = APIRouter(prefix="/routes")
    router_config = get_router_config()
    src_path = pathlib.Path(__file__).parent
    apis_path = src_path / "app" / "apis"

    api_names = [
        p.relative_to(apis_path).parent.as_posix()
        for p in apis_path.glob("*/__init__.py")
    ]

    api_module_prefix = "app.apis."

    for name in api_names:
        logger.info(f"Importing API: {name}")
        try:
            api_module = __import__(api_module_prefix + name, fromlist=[name])
            api_router = getattr(api_module, "router", None)
            if isinstance(api_router, APIRouter):
                routes.include_router(
                    api_router,
                    dependencies=(
                        []
                        if is_auth_disabled(router_config, name)
                        else [Depends(get_authorized_user)]
                    ),
                )
                logger.info(f"Successfully imported API: {name}")
        except Exception as e:
            logger.error(f"Error importing API {name}: {e}")

    return routes

async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Request failed: {request.url}")
        logger.exception(e)
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

def create_app() -> FastAPI:
    app = FastAPI(title="QandU API")
    
    # Add error handling middleware
    app.middleware("http")(catch_exceptions_middleware)
    
    # Add security headers
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Configure CORS with multipart support
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:8080"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600
    )
    
    # Include routers
    app.include_router(blog_router)
    app.include_router(extract_text_router)
    
    # Include API routes
    app.include_router(import_api_routers())
    
    @app.get("/healthcheck")
    async def healthcheck():
        return {"status": "ok"}
    
    return app

# Create the single app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
