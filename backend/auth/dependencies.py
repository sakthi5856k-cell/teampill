from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from database.users import users

import os

security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        discord_id = payload["discord_id"]

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = await users.find_one({
        "discord_id": discord_id
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    user.pop("_id", None)

    return user
