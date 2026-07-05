import os
import httpx

from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth")

CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
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


@router.get("/discord/callback")
async def discord_callback(code: str):

    token_url = "https://discord.com/api/oauth2/token"

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    async with httpx.AsyncClient() as client:

        token_response = await client.post(
            token_url,
            data=data,
            headers=headers
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Discord token failed"
            )

        token_json = token_response.json()
        access_token = token_json["access_token"]

        user_response = await client.get(
            "https://discord.com/api/users/@me",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        user = user_response.json()

        return user
