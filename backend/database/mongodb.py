from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(getenv("MONGO_URI"))

db = client[getenv("DATABASE_NAME")]
