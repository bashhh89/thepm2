"""Usage:

from app.env import Mode, mode, PUTER_API_KEY

if mode == Mode.PROD:
    print("Running in deployed service")
else:
    print("Running in development workspace")
"""

import os
from enum import Enum


class Mode(str, Enum):
    DEV = "development"
    PROD = "production"


mode = Mode.PROD if os.environ.get("DATABUTTON_SERVICE_TYPE") == "prodx" else Mode.DEV

# Puter AI Configuration
PUTER_API_KEY = os.environ.get("PUTER_API_KEY", "")

__all__ = [
    "Mode",
    "mode",
    "PUTER_API_KEY"
]
