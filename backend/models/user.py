from pydantic import BaseModel

class User(BaseModel):
    discord_id: str
    username: str
    avatar: str
    rank: str
    website_role: str
    active: bool = True
