import os
import httpx

from fastapi import APIRouter
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth")

CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI")

@router.get("/discord/login")
async def discord_login():

    url = (
        "https://discord.com/api/oauth2/authorize"
        f"?client_id={CLIENT_ID}"
        "&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=identify%20email"
    )

    return RedirectResponse(url)
