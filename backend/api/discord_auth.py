import os
import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from database.users import users

router = APIRouter(prefix="/auth", tags=["Discord Auth"])

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

        # Get Access Token
        token_response = await client.post(
            token_url,
            data=data,
            headers=headers
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Discord token request failed."
            )

        token_json = token_response.json()
        access_token = token_json["access_token"]

        # Get Discord User
        user_response = await client.get(
            "https://discord.com/api/users/@me",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        if user_response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Unable to fetch Discord user."
            )

        user = user_response.json()

    discord_id = user["id"]

    existing = await users.find_one({
        "discord_id": discord_id
    })

    if existing is None:

        new_user = {

            "discord_id": user["id"],

            "username": user["username"],

            "avatar": user.get("avatar"),

            "email": user.get("email"),

            "staff_id": None,

            "rank": None,

            "department": None,

            "is_staff": False,

            "is_admin": False,

            "activity": 0,

            "awards": [],

            "rewards": [],

            "created_at": datetime.utcnow()

        }

        await users.insert_one(new_user)

        existing = await users.find_one({
            "discord_id": discord_id
        })

    if existing["is_staff"] is False:

        return {
            "success": False,
            "message": "You are not EMS Staff.",
            "user": {
                "username": existing["username"],
                "discord_id": existing["discord_id"]
            }
        }

    return {
        "success": True,
        "message": "Login Successful",
        "user": {
            "discord_id": existing["discord_id"],
            "username": existing["username"],
            "staff_id": existing["staff_id"],
            "rank": existing["rank"],
            "department": existing["department"],
            "activity": existing["activity"],
            "awards": existing["awards"],
            "rewards": existing["rewards"],
            "is_admin": existing["is_admin"]
        }
    }
