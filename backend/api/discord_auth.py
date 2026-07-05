import os
import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from database.users import users
from auth.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Discord Authentication"]
)

# Discord OAuth
CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI")

# Discord Server
GUILD_ID = os.getenv("DISCORD_GUILD_ID")
BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

# Role IDs
EMS_ROLE_ID = os.getenv("EMS_ROLE_ID")
ADMIN_ROLE_ID = os.getenv("ADMIN_ROLE_ID")


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

        # Exchange code for access token
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

        # Fetch Discord user
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

            # Check Discord Server Membership
        guild_response = await client.get(
            f"https://discord.com/api/v10/guilds/{GUILD_ID}/members/{user['id']}",
            headers={
                "Authorization": f"Bot {BOT_TOKEN}"
            }
        )

        if guild_response.status_code != 200:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of the EMS Discord Server."
            )

        member = guild_response.json()

    # -----------------------------
    # Discord Role Verification
    # -----------------------------

    roles = member.get("roles", [])

    is_staff = EMS_ROLE_ID in roles
    is_admin = ADMIN_ROLE_ID in roles

    discord_id = user["id"]

    # Find User
    existing = await users.find_one({
        "discord_id": discord_id
    })

    # Create User if not exists
    if existing is None:

        new_user = {
            "discord_id": user["id"],
            "username": user["username"],
            "avatar": user.get("avatar"),
            "email": user.get("email"),
            "staff_id": None,
            "rank": None,
            "department": None,
            "is_staff": is_staff,
            "is_admin": is_admin,
            "activity": 0,
            "awards": [],
            "rewards": [],
            "created_at": datetime.utcnow()
        }

        await users.insert_one(new_user)

    else:

        await users.update_one(
            {
                "discord_id": discord_id
            },
            {
                "$set": {
                    "username": user["username"],
                    "avatar": user.get("avatar"),
                    "email": user.get("email"),
                    "is_staff": is_staff,
                    "is_admin": is_admin
                }
            }
        )

    existing = await users.find_one({
        "discord_id": discord_id
    })

        # Staff Role Check
    if not existing["is_staff"]:
        return {
            "success": False,
            "message": "You are not EMS Staff.",
            "user": {
                "discord_id": existing["discord_id"],
                "username": existing["username"]
            }
        }

    # Create JWT Token
    token = create_access_token(
        {
            "discord_id": existing["discord_id"],
            "staff_id": existing["staff_id"],
            "is_admin": existing["is_admin"]
        }
    )

    # Success Response
    return {
        "success": True,
        "access_token": token,
        "token_type": "Bearer",
        "user": {
            "discord_id": existing["discord_id"],
            "username": existing["username"],
            "email": existing.get("email"),
            "avatar": existing.get("avatar"),
            "staff_id": existing.get("staff_id"),
            "rank": existing.get("rank"),
            "department": existing.get("department"),
            "activity": existing.get("activity", 0),
            "awards": existing.get("awards", []),
            "rewards": existing.get("rewards", []),
            "is_admin": existing.get("is_admin", False)
        }
    }
