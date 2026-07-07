from fastapi import APIRouter, Depends

from auth.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user)
):

    return {
        "success": True,
        "user": {
            "discord_id": current_user["discord_id"],
            "username": current_user["username"],
            "email": current_user.get("email"),
            "avatar": current_user.get("avatar"),
            "staff_id": current_user.get("staff_id"),
            "rank": current_user.get("rank"),
            "department": current_user.get("department"),
            "activity": current_user.get("activity"),
            "awards": current_user.get("awards"),
            "rewards": current_user.get("rewards"),
            "is_staff": current_user.get("is_staff"),
            "is_admin": current_user.get("is_admin")
        }
    }
