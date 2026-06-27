from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import asyncio
import bcrypt
import jwt
import httpx
import discord
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@teampillbox.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

app = FastAPI(title="Team Pillbox API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)s %(levelname)s %(message)s')
log = logging.getLogger("pillbox")

# ------------- Discord bot (gateway connection so the bot shows ONLINE) -------------
discord_bot = None
discord_bot_task = None
discord_bot_status: dict = {"online": False, "user": None, "error": None}

async def _stop_discord_bot():
    global discord_bot, discord_bot_task
    if discord_bot is not None:
        try: await discord_bot.close()
        except Exception: pass
    if discord_bot_task is not None:
        try: discord_bot_task.cancel()
        except Exception: pass
    discord_bot = None
    discord_bot_task = None
    discord_bot_status.update({"online": False, "user": None})

async def _start_discord_bot(token: str):
    """Launch a Discord gateway client so the bot appears Online."""
    global discord_bot, discord_bot_task
    await _stop_discord_bot()
    token = (token or "").strip()
    if not token:
        discord_bot_status.update({"online": False, "user": None, "error": "no token"})
        return
    intents = discord.Intents.default()
    client = discord.Client(intents=intents)

    @client.event
    async def on_ready():
        discord_bot_status.update({"online": True, "user": str(client.user), "error": None})
        try:
            await client.change_presence(activity=discord.Game(name="Team Pillbox EMS"), status=discord.Status.online)
        except Exception: pass
        log.info(f"Discord bot ONLINE as {client.user}")

    async def _runner():
        try:
            await client.start(token)
        except discord.LoginFailure as e:
            discord_bot_status.update({"online": False, "error": f"login failure: {e}"})
            log.warning(f"Discord login failure: {e}")
        except Exception as e:
            discord_bot_status.update({"online": False, "error": str(e)})
            log.warning(f"Discord bot crashed: {e}")

    discord_bot = client
    discord_bot_task = asyncio.create_task(_runner())


# ------------- Helpers -------------
def utcnow():
    return datetime.now(timezone.utc).isoformat()

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try: return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception: return False

def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "type": "access",
                       "exp": datetime.now(timezone.utc) + timedelta(hours=12)}, JWT_SECRET, algorithm=JWT_ALG)

def create_refresh_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "type": "refresh",
                       "exp": datetime.now(timezone.utc) + timedelta(days=7)}, JWT_SECRET, algorithm=JWT_ALG)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "): token = auth[7:]
    if not token: raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        if payload.get("type") != "access": raise HTTPException(401, "Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user: raise HTTPException(401, "User not found")
        user.pop("_id", None); user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError: raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError: raise HTTPException(401, "Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    return user

# ------------- Discord helpers -------------
async def _get_settings() -> dict:
    return await db.settings.find_one({"id": "global"}) or {}

async def send_discord_dm(user_id: str, content: str = None, embed: dict = None) -> bool:
    """DM a Discord user using the configured bot token. Returns True on success."""
    s = await _get_settings()
    token = (s.get("discord_bot_token") or "").strip()
    if not token or not user_id: return False
    try:
        async with httpx.AsyncClient(timeout=8.0) as cx:
            r = await cx.post("https://discord.com/api/v10/users/@me/channels",
                              headers={"Authorization": f"Bot {token}", "Content-Type": "application/json"},
                              json={"recipient_id": str(user_id)})
            if r.status_code >= 300:
                log.warning(f"Create DM failed {r.status_code}: {r.text}")
                return False
            channel_id = r.json().get("id")
            payload = {}
            if content: payload["content"] = content
            if embed: payload["embeds"] = [embed]
            r2 = await cx.post(f"https://discord.com/api/v10/channels/{channel_id}/messages",
                               headers={"Authorization": f"Bot {token}", "Content-Type": "application/json"},
                               json=payload)
            if r2.status_code >= 300:
                log.warning(f"Send DM failed {r2.status_code}: {r2.text}")
                return False
            return True
    except Exception as e:
        log.warning(f"discord dm error: {e}"); return False

async def post_admin_channel(content: str = None, embed: dict = None) -> bool:
    """Post to admin channel via webhook (if configured) OR via bot (if channel id configured)."""
    s = await _get_settings()
    payload = {}
    if content: payload["content"] = content
    if embed: payload["embeds"] = [embed]
    webhook = (s.get("discord_webhook_url") or "").strip()
    if webhook:
        try:
            async with httpx.AsyncClient(timeout=6.0) as cx:
                await cx.post(webhook, json=payload); return True
        except Exception as e:
            log.warning(f"webhook failed: {e}")
    token = (s.get("discord_bot_token") or "").strip()
    channel = (s.get("discord_admin_channel_id") or "").strip()
    if token and channel:
        try:
            async with httpx.AsyncClient(timeout=6.0) as cx:
                await cx.post(f"https://discord.com/api/v10/channels/{channel}/messages",
                              headers={"Authorization": f"Bot {token}", "Content-Type": "application/json"},
                              json=payload)
                return True
        except Exception as e:
            log.warning(f"bot channel post failed: {e}")
    return False

def gen_ref(prefix: str = "PB-AP") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:6].upper()}"

# ------------- Models -------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class StaffIn(BaseModel):
    name: str
    rank: str
    department: str = "EMS"
    employee_id: Optional[str] = None
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    badge_number: Optional[str] = None
    active: bool = True

class ApplicationIn(BaseModel):
    full_name: str
    in_game_name: Optional[str] = None
    age: int
    timezone_str: str = Field(alias="timezone")
    discord_handle: str
    discord_user_id: Optional[str] = None
    steam_hex: Optional[str] = None
    experience: Optional[str] = ""
    why_join: Optional[str] = ""
    availability: Optional[str] = ""
    desired_role: str = "EMT"
    contact_email: Optional[EmailStr] = None
    model_config = ConfigDict(populate_by_name=True)

class GalleryItemIn(BaseModel):
    title: str; category: str; image_url: str; description: Optional[str] = None

class AnnouncementIn(BaseModel):
    title: str; body: str; category: str = "update"

class CertificateIn(BaseModel):
    recipient_name: str; rank: str; cert_type: str; description: str
    issued_by: str = "Director, Team Pillbox"; issue_date: Optional[str] = None

class SettingsIn(BaseModel):
    discord_webhook_url: Optional[str] = None
    discord_bot_token: Optional[str] = None
    discord_admin_channel_id: Optional[str] = None
    discord_invite: Optional[str] = None
    server_status_label: Optional[str] = None
    server_status_online: Optional[bool] = None

# ------------- Auth -------------
@api.post("/auth/login")
async def login(data: LoginIn, response: Response, request: Request):
    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{data.email.lower()}"
    rec = await db.login_attempts.find_one({"identifier": ident})
    if rec and rec.get("locked_until") and datetime.fromisoformat(rec["locked_until"]) > datetime.now(timezone.utc):
        raise HTTPException(429, "Too many attempts. Try again later.")
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        attempts = (rec.get("attempts", 0) if rec else 0) + 1
        upd = {"attempts": attempts, "updated_at": utcnow()}
        if attempts >= 5:
            upd["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": ident}, {"$set": upd}, upsert=True)
        raise HTTPException(401, "Invalid credentials")
    await db.login_attempts.delete_one({"identifier": ident})
    access = create_access_token(user["id"], user["email"])
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user["role"]}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ------------- Public: Staff -------------
@api.get("/staff")
async def list_staff(rank: Optional[str] = None, q: Optional[str] = None):
    query = {"active": True}
    if rank: query["rank"] = rank
    if q: query["name"] = {"$regex": q, "$options": "i"}
    items = await db.staff.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api.get("/staff/{staff_id}")
async def get_staff(staff_id: str):
    s = await db.staff.find_one({"id": staff_id}, {"_id": 0})
    if not s: raise HTTPException(404, "Staff not found")
    return s

@api.post("/admin/staff")
async def create_staff(data: StaffIn, _: dict = Depends(require_admin)):
    sid = str(uuid.uuid4())
    eid = data.employee_id or f"TPB-{sid[:6].upper()}"
    doc = {**data.model_dump(), "id": sid, "employee_id": eid, "created_at": utcnow()}
    await db.staff.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/admin/staff/{staff_id}")
async def update_staff(staff_id: str, data: StaffIn, _: dict = Depends(require_admin)):
    upd = data.model_dump(); upd["updated_at"] = utcnow()
    res = await db.staff.update_one({"id": staff_id}, {"$set": upd})
    if not res.matched_count: raise HTTPException(404, "Staff not found")
    return await db.staff.find_one({"id": staff_id}, {"_id": 0})

@api.delete("/admin/staff/{staff_id}")
async def delete_staff(staff_id: str, _: dict = Depends(require_admin)):
    await db.staff.delete_one({"id": staff_id}); return {"ok": True}

# ------------- Applications -------------
@api.post("/applications")
async def submit_application(data: ApplicationIn):
    aid = str(uuid.uuid4())
    ref = gen_ref()
    doc = data.model_dump(by_alias=False)
    doc.update({"id": aid, "ref_number": ref, "status": "pending", "created_at": utcnow()})
    await db.applications.insert_one(doc)
    doc.pop("_id", None)

    # Post to admin channel (webhook or bot channel)
    await post_admin_channel(embed={
        "title": "📥 New EMS Application",
        "description": f"**{data.full_name}** ({data.in_game_name or '—'}) applied for **{data.desired_role}**\nRef: `{ref}`",
        "color": 0x1FA7B8,
        "fields": [
            {"name": "Discord", "value": data.discord_handle, "inline": True},
            {"name": "Age", "value": str(data.age), "inline": True},
            {"name": "Timezone", "value": data.timezone_str, "inline": True},
            {"name": "Experience", "value": (data.experience or "—")[:300], "inline": False},
        ],
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    # DM applicant
    if data.discord_user_id:
        await send_discord_dm(data.discord_user_id, embed={
            "title": "Team Pillbox — Application Received",
            "description": f"Hey **{data.full_name.split()[0]}**, we got your application.\n\n"
                           f"**Reference:** `{ref}`\n"
                           f"**Role:** {data.desired_role}\n\n"
                           "You'll get another DM the moment Command makes a decision. "
                           "Check status on the website too.",
            "color": 0x1FA7B8,
            "footer": {"text": "Team Pillbox EMS"}
        })

    return doc

@api.get("/applications/lookup/{ref}")
async def lookup_application(ref: str):
    """Public status check by ref number."""
    a = await db.applications.find_one({"ref_number": ref.upper()}, {"_id": 0})
    if not a: raise HTTPException(404, "No application with that reference")
    return {"ref_number": a["ref_number"], "status": a["status"], "desired_role": a.get("desired_role"),
            "full_name": a.get("full_name"), "created_at": a.get("created_at"),
            "decision_note": a.get("decision_note", ""), "decided_at": a.get("decided_at")}

@api.get("/admin/applications")
async def list_applications(_: dict = Depends(require_admin)):
    items = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api.post("/admin/applications/{app_id}/decision")
async def decide_application(app_id: str, body: dict, _: dict = Depends(require_admin)):
    decision = body.get("decision")
    if decision not in ("approved", "rejected"):
        raise HTTPException(400, "decision must be 'approved' or 'rejected'")
    note = body.get("note", "")
    res = await db.applications.update_one(
        {"id": app_id},
        {"$set": {"status": decision, "decision_note": note, "decided_at": utcnow()}}
    )
    if not res.matched_count: raise HTTPException(404, "Application not found")
    a = await db.applications.find_one({"id": app_id}, {"_id": 0})

    if a.get("discord_user_id"):
        if decision == "approved":
            await send_discord_dm(a["discord_user_id"], embed={
                "title": "✅ Application Approved — Welcome to Team Pillbox",
                "description": f"Congrats **{a.get('full_name','').split()[0]}**!\n\n"
                               f"**Ref:** `{a.get('ref_number')}`\n"
                               f"**Role:** {a.get('desired_role')}\n\n"
                               + (f"_Note from Command:_ {note}\n\n" if note else "")
                               + "Join the Discord and hit up Command for onboarding.",
                "color": 0x2A9D8F
            })
        else:
            await send_discord_dm(a["discord_user_id"], embed={
                "title": "❌ Application Update",
                "description": f"Hey **{a.get('full_name','').split()[0]}**, your application "
                               f"(`{a.get('ref_number')}`) wasn't approved this round.\n\n"
                               + (f"_Note from Command:_ {note}\n\n" if note else "")
                               + "Don't sweat it — you can reapply after 14 days.",
                "color": 0xE63946
            })
    return {"ok": True, "status": decision}

# ------------- Gallery -------------
@api.get("/gallery")
async def list_gallery(category: Optional[str] = None):
    q = {} if not category or category == "all" else {"category": category}
    items = await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api.post("/admin/gallery")
async def add_gallery(data: GalleryItemIn, _: dict = Depends(require_admin)):
    doc = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": utcnow()}
    await db.gallery.insert_one(doc); doc.pop("_id", None); return doc

@api.delete("/admin/gallery/{item_id}")
async def delete_gallery(item_id: str, _: dict = Depends(require_admin)):
    await db.gallery.delete_one({"id": item_id}); return {"ok": True}

# ------------- Announcements -------------
@api.get("/announcements")
async def list_announcements():
    return await db.announcements.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)

@api.post("/admin/announcements")
async def add_announcement(data: AnnouncementIn, _: dict = Depends(require_admin)):
    doc = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": utcnow()}
    await db.announcements.insert_one(doc); doc.pop("_id", None); return doc

@api.delete("/admin/announcements/{a_id}")
async def delete_announcement(a_id: str, _: dict = Depends(require_admin)):
    await db.announcements.delete_one({"id": a_id}); return {"ok": True}

# ------------- Certificates -------------
@api.post("/admin/certificates")
async def create_certificate(data: CertificateIn, _: dict = Depends(require_admin)):
    cid = str(uuid.uuid4())
    doc = {**data.model_dump(), "id": cid, "cert_number": f"TPB-CERT-{cid[:8].upper()}",
           "issue_date": data.issue_date or datetime.now(timezone.utc).strftime("%B %d, %Y"),
           "created_at": utcnow()}
    await db.certificates.insert_one(doc); doc.pop("_id", None); return doc

@api.get("/admin/certificates")
async def list_certificates(_: dict = Depends(require_admin)):
    return await db.certificates.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.get("/certificates/{cert_id}")
async def get_cert(cert_id: str):
    c = await db.certificates.find_one({"id": cert_id}, {"_id": 0})
    if not c: raise HTTPException(404, "Not found")
    return c

# ------------- Settings -------------
@api.get("/settings")
async def get_settings_public():
    s = await db.settings.find_one({"id": "global"}, {"_id": 0}) or {
        "id": "global", "server_status_label": "Server Online", "server_status_online": True,
        "discord_invite": "https://discord.gg/teampillbox"
    }
    for k in ("discord_webhook_url", "discord_bot_token", "discord_admin_channel_id"):
        s.pop(k, None)
    return s

@api.get("/admin/settings")
async def get_settings_admin(_: dict = Depends(require_admin)):
    return await db.settings.find_one({"id": "global"}, {"_id": 0}) or {"id": "global"}

@api.put("/admin/settings")
async def update_settings(data: SettingsIn, _: dict = Depends(require_admin)):
    upd = {k: v for k, v in data.model_dump().items() if v is not None}
    upd["updated_at"] = utcnow()
    prev = await db.settings.find_one({"id": "global"}) or {}
    await db.settings.update_one({"id": "global"}, {"$set": {"id": "global", **upd}}, upsert=True)
    new_doc = await db.settings.find_one({"id": "global"}, {"_id": 0})
    if "discord_bot_token" in upd and upd.get("discord_bot_token") != prev.get("discord_bot_token"):
        asyncio.create_task(_start_discord_bot(upd.get("discord_bot_token", "")))
    return new_doc

@api.get("/admin/bot/status")
async def bot_status(_: dict = Depends(require_admin)):
    return discord_bot_status

@api.post("/admin/bot/restart")
async def bot_restart(_: dict = Depends(require_admin)):
    s = await _get_settings()
    asyncio.create_task(_start_discord_bot(s.get("discord_bot_token", "")))
    return {"ok": True, "message": "Bot restarting"}

@api.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    return {
        "staff_count": await db.staff.count_documents({"active": True}),
        "applications_pending": await db.applications.count_documents({"status": "pending"}),
        "applications_total": await db.applications.count_documents({}),
        "gallery_count": await db.gallery.count_documents({}),
        "announcements_count": await db.announcements.count_documents({}),
        "certificates_count": await db.certificates.count_documents({}),
    }

@api.get("/")
async def root(): return {"name": "Team Pillbox API", "status": "ok"}

# ------------- Startup -------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.staff.create_index("id", unique=True)
    await db.applications.create_index("id", unique=True)
    await db.applications.create_index("ref_number")
    await db.gallery.create_index("id", unique=True)
    await db.announcements.create_index("id", unique=True)
    await db.certificates.create_index("id", unique=True)
    await db.login_attempts.create_index("identifier")

    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": ADMIN_EMAIL.lower(),
                                   "password_hash": hash_password(ADMIN_PASSWORD), "name": "Director",
                                   "role": "admin", "created_at": utcnow()})
        log.info(f"Seeded admin {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one({"email": ADMIN_EMAIL.lower()},
                                  {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})

    if not await db.settings.find_one({"id": "global"}):
        await db.settings.insert_one({"id": "global", "discord_webhook_url": "", "discord_bot_token": "",
                                      "discord_admin_channel_id": "",
                                      "discord_invite": "https://discord.gg/teampillbox",
                                      "server_status_label": "Server Online", "server_status_online": True,
                                      "created_at": utcnow()})

    # Auto-start Discord gateway bot if token configured
    s = await db.settings.find_one({"id": "global"}) or {}
    if (s.get("discord_bot_token") or "").strip():
        asyncio.create_task(_start_discord_bot(s["discord_bot_token"]))

@app.on_event("shutdown")
async def shutdown():
    await _stop_discord_bot()
    client.close()

app.include_router(api)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])
