from fastapi import Depends, HTTPException

from auth.dependencies import get_current_user


async def staff_required(
    current_user=Depends(get_current_user)
):
    if not current_user.get("is_staff", False):
        raise HTTPException(
            status_code=403,
            detail="Staff access required."
        )

    return current_user


async def admin_required(
    current_user=Depends(get_current_user)
):
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Admin access required."
        )

    return current_user
