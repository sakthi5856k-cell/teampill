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
        "user": current_user
    }
