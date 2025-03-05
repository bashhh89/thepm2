"""Usage:

from app.env import Mode, mode, PUTER_API_KEY, logger

if mode == Mode.PROD:
    print("Running in deployed service")
else:
    print("Running in development workspace")
"""

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

import os
from enum import Enum
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


class Mode(str, Enum):
    DEV = "development"
    PROD = "production"


mode = Mode.PROD if os.environ.get("DATABUTTON_SERVICE_TYPE") == "prodx" else Mode.DEV

# Puter AI Configuration
PUTER_API_KEY = os.environ.get("PUTER_API_KEY", "")

def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5174", "http://localhost:5177"],  # Add your frontend URLs
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

__all__ = [
    "Mode",
    "mode",
    "PUTER_API_KEY",
    "logger"
]
