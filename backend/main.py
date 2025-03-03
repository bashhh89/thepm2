import os
import pathlib
import json
import dotenv
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.env import setup_cors
from app.routers.blog import router as blog_router

dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user

app = FastAPI()

# Setup CORS
setup_cors(app)

# Include the blog router
app.include_router(blog_router)

def get_router_config() -> dict:
    try:
        cfg = json.loads(open("routers.json").read())
    except:
        return False
    return cfg

def is_auth_disabled(router_config: dict, name: str) -> bool:
    return router_config["routers"][name]["disableAuth"]

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
        print(f"Importing API: {name}")
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
        except Exception as e:
            print(f"Error importing API {name}: {e}")

    return routes

# Include API routes
app.include_router(import_api_routers())

def create_app() -> FastAPI:
    app = FastAPI()

    # Setup CORS
    setup_cors(app)

    app.include_router(import_api_routers())

    return app

app = create_app()
