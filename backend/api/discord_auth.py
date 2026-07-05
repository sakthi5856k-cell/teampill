import os
import httpx

from fastapi import APIRouter
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth")
