from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "message": "Authentication API Ready"
    }
