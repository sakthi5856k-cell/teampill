from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
import httpx
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ------------- Setup -------------
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

# ------------- Helpers -------------
def utcnow():
    return datetime.now(timezone.utc).isoformat()

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user

# ------------- Models -------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class StaffIn(BaseModel):
    name: str
    rank: str  # Executive Management | HOD | Doctor | Nurse | EMT | Intern
    department: str = "EMS"
    employee_id: Optional[str] = None
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    badge_number: Optional[str] = None
    active: bool = True

class ApplicationIn(BaseModel):
    full_name: str
    discord_id: str
    age: int
    timezone_str: str = Field(alias="timezone")
    experience: str
    why_join: str
    desired_role: str
    contact_email: Optional[EmailStr] = None
    model_config = ConfigDict(populate_by_name=True)

class GalleryItemIn(BaseModel):
    title: str
    category: str  # hospital | event | training
    image_url: str
    description: Optional[str] = None

class AnnouncementIn(BaseModel):
    title: str
    body: str
    category: str = "update"  # update | event | recruitment

class CertificateIn(BaseModel):
    recipient_name: str
    rank: str
    cert_type: str  # training | promotion | appreciation
    description: str
    issued_by: str = "Director, Team Pillbox"
    issue_date: Optional[str] = None

class SettingsIn(BaseModel):
    discord_webhook_url: Optional[str] = None
    server_status_label: Optional[str] = None
    server_status_online: Optional[bool] = None

# ------------- Auth endpoints -------------
@api.post("/auth/login")
async def login(data: LoginIn, response: Response, request: Request):
    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{data.email.lower()}"
    rec = await db.login_attempts.find_one({"identifier": ident})
    if rec and rec.get("locked_until") and datetime.fromisoformat(rec["locked_until"]) > datetime.now(timezone.utc):
        raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        attempts = (rec.get("attempts", 0) if rec else 0) + 1
        upd = {"attempts": attempts, "updated_at": utcnow()}
        if attempts >= 5:
            upd["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": ident}, {"$set": upd}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid credentials")
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
    if rank:
        query["rank"] = rank
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    items = await db.staff.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api.get("/staff/{staff_id}")
async def get_staff(staff_id: str):
    s = await db.staff.find_one({"id": staff_id}, {"_id": 0})
    if not s:
        raise HTTPException(404, "Staff not found")
    return s

# Admin: Staff CRUD
@api.post("/admin/staff")
async def create_staff(data: StaffIn, _: dict = Depends(require_admin)):
    sid = str(uuid.uuid4())
    eid = data.employee_id or f"TPB-{sid[:6].upper()}"
    doc = {**data.model_dump(), "id": sid, "employee_id": eid, "created_at": utcnow()}
    await db.staff.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.put("/admin/staff/{staff_id}")
async def update_staff(staff_id: str, data: StaffIn, _: dict = Depends(require_admin)):
    upd = data.model_dump()
    upd["updated_at"] = utcnow()
    res = await db.staff.update_one({"id": staff_id}, {"$set": upd})
    if not res.matched_count:
        raise HTTPException(404, "Staff not found")
    return await db.staff.find_one({"id": staff_id}, {"_id": 0})

@api.delete("/admin/staff/{staff_id}")
async def delete_staff(staff_id: str, _: dict = Depends(require_admin)):
    await db.staff.delete_one({"id": staff_id})
    return {"ok": True}

# ------------- Public: Applications -------------
@api.post("/applications")
async def submit_application(data: ApplicationIn):
    aid = str(uuid.uuid4())
    doc = data.model_dump(by_alias=False)
    doc.update({"id": aid, "status": "pending", "created_at": utcnow()})
    await db.applications.insert_one(doc)

    # Discord webhook (best-effort)
    s = await db.settings.find_one({"id": "global"}) or {}
    webhook = s.get("discord_webhook_url")
    if webhook:
        try:
            async with httpx.AsyncClient(timeout=5.0) as cx:
                await cx.post(webhook, json={
                    "embeds": [{
                        "title": "New EMS Application",
                        "description": f"**{data.full_name}** applied for **{data.desired_role}**",
                        "color": 15094842,
                        "fields": [
                            {"name": "Discord ID", "value": data.discord_id, "inline": True},
                            {"name": "Age", "value": str(data.age), "inline": True},
                            {"name": "Experience", "value": data.experience[:200], "inline": False},
                        ],
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }]
                })
        except Exception as e:
            log.warning(f"discord webhook failed: {e}")

    doc.pop("_id", None)
    return doc

@api.get("/admin/applications")
async def list_applications(_: dict = Depends(require_admin)):
    items = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api.post("/admin/applications/{app_id}/decision")
async def decide_application(app_id: str, body: dict, _: dict = Depends(require_admin)):
    decision = body.get("decision")
    if decision not in ("approved", "rejected"):
        raise HTTPException(400, "decision must be 'approved' or 'rejected'")
    res = await db.applications.update_one(
        {"id": app_id},
        {"$set": {"status": decision, "decision_note": body.get("note", ""), "decided_at": utcnow()}}
    )
    if not res.matched_count:
        raise HTTPException(404, "Application not found")
    return {"ok": True, "status": decision}

# ------------- Public: Gallery -------------
@api.get("/gallery")
async def list_gallery(category: Optional[str] = None):
    q = {}
    if category and category != "all":
        q["category"] = category
    items = await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api.post("/admin/gallery")
async def add_gallery(data: GalleryItemIn, _: dict = Depends(require_admin)):
    doc = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": utcnow()}
    await db.gallery.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.delete("/admin/gallery/{item_id}")
async def delete_gallery(item_id: str, _: dict = Depends(require_admin)):
    await db.gallery.delete_one({"id": item_id})
    return {"ok": True}

# ------------- Public: Announcements -------------
@api.get("/announcements")
async def list_announcements():
    items = await db.announcements.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

@api.post("/admin/announcements")
async def add_announcement(data: AnnouncementIn, _: dict = Depends(require_admin)):
    doc = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": utcnow()}
    await db.announcements.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.delete("/admin/announcements/{a_id}")
async def delete_announcement(a_id: str, _: dict = Depends(require_admin)):
    await db.announcements.delete_one({"id": a_id})
    return {"ok": True}

# ------------- Certificates -------------
@api.post("/admin/certificates")
async def create_certificate(data: CertificateIn, _: dict = Depends(require_admin)):
    cid = str(uuid.uuid4())
    doc = {**data.model_dump(), "id": cid, "cert_number": f"TPB-CERT-{cid[:8].upper()}",
           "issue_date": data.issue_date or datetime.now(timezone.utc).strftime("%B %d, %Y"),
           "created_at": utcnow()}
    await db.certificates.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/admin/certificates")
async def list_certificates(_: dict = Depends(require_admin)):
    items = await db.certificates.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api.get("/certificates/{cert_id}")
async def get_cert(cert_id: str):
    c = await db.certificates.find_one({"id": cert_id}, {"_id": 0})
    if not c:
        raise HTTPException(404, "Not found")
    return c

# ------------- Settings -------------
@api.get("/settings")
async def get_settings_public():
    s = await db.settings.find_one({"id": "global"}, {"_id": 0}) or {
        "id": "global", "server_status_label": "Server Online",
        "server_status_online": True, "discord_invite": "https://discord.gg/teampillbox"
    }
    s.pop("discord_webhook_url", None)
    return s

@api.get("/admin/settings")
async def get_settings_admin(_: dict = Depends(require_admin)):
    s = await db.settings.find_one({"id": "global"}, {"_id": 0}) or {"id": "global"}
    return s

@api.put("/admin/settings")
async def update_settings(data: SettingsIn, _: dict = Depends(require_admin)):
    upd = {k: v for k, v in data.model_dump().items() if v is not None}
    upd["updated_at"] = utcnow()
    await db.settings.update_one({"id": "global"}, {"$set": {"id": "global", **upd}}, upsert=True)
    return await db.settings.find_one({"id": "global"}, {"_id": 0})

# ------------- Dashboard stats -------------
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
async def root():
    return {"name": "Team Pillbox API", "status": "ok"}

# ------------- Startup -------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.staff.create_index("id", unique=True)
    await db.applications.create_index("id", unique=True)
    await db.gallery.create_index("id", unique=True)
    await db.announcements.create_index("id", unique=True)
    await db.certificates.create_index("id", unique=True)
    await db.login_attempts.create_index("identifier")

    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Director",
            "role": "admin",
            "created_at": utcnow(),
        })
        log.info(f"Seeded admin {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one({"email": ADMIN_EMAIL.lower()},
                                  {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
        log.info("Admin password updated from env")

    # Seed default settings
    if not await db.settings.find_one({"id": "global"}):
        await db.settings.insert_one({
            "id": "global",
            "discord_webhook_url": "",
            "discord_invite": "https://discord.gg/teampillbox",
            "server_status_label": "Server Online",
            "server_status_online": True,
            "created_at": utcnow(),
        })

    # Seed demo content (only if collections empty)
    if await db.staff.count_documents({}) == 0:
        demo_staff = [
            {"name": "Dr. Evelyn Rhodes", "rank": "Executive Management", "department": "EMS", "bio": "Director of EMS Operations. 12 years on the line.", "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"},
            {"name": "Dr. Marcus Hale", "rank": "HOD", "department": "Trauma", "bio": "Head of Trauma. Cool head, fast hands.", "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"},
            {"name": "Dr. Aisha Khan", "rank": "Doctor", "department": "ER", "bio": "ER attending. Loves a good code blue story.", "photo_url": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"},
            {"name": "Nina Caldwell", "rank": "Nurse", "department": "ICU", "bio": "ICU charge nurse. Ten cups of coffee deep.", "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400"},
            {"name": "Jake Morrison", "rank": "EMT", "department": "Field", "bio": "Lead EMT. First on scene, last to leave.", "photo_url": "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400"},
            {"name": "Sam Patel", "rank": "Intern", "department": "Rotation", "bio": "Med intern. Bring snacks.", "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400"},
        ]
        for s in demo_staff:
            sid = str(uuid.uuid4())
            await db.staff.insert_one({**s, "id": sid, "active": True, "employee_id": f"TPB-{sid[:6].upper()}", "badge_number": f"#{1000 + len(s['name'])}", "created_at": utcnow()})

    if await db.gallery.count_documents({}) == 0:
        seeds = [
            ("Main Hospital Wing", "hospital", "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
            ("Ambulance Bay", "hospital", "https://images.unsplash.com/photo-1612574935301-af13ccce9258?w=1200"),
            ("Annual Training Day", "training", "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200"),
            ("Field Drill", "training", "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200"),
            ("Awards Night 2025", "event", "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1200"),
            ("Community Health Camp", "event", "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200"),
        ]
        for title, cat, url in seeds:
            await db.gallery.insert_one({"id": str(uuid.uuid4()), "title": title, "category": cat, "image_url": url, "created_at": utcnow()})

    if await db.announcements.count_documents({}) == 0:
        seeds = [
            ("Recruitment Open", "We are accepting new EMS applications through the end of the month. Apply via the EMS Application page.", "recruitment"),
            ("Quarterly Training Drill", "Mandatory live drill scheduled for Saturday 19:00. Briefing in the bay 30 min prior.", "event"),
            ("Hospital Renovation Update", "The east wing reopens this Friday with two new trauma bays.", "update"),
        ]
        for t, b, c in seeds:
            await db.announcements.insert_one({"id": str(uuid.uuid4()), "title": t, "body": b, "category": c, "created_at": utcnow()})

@app.on_event("shutdown")
async def shutdown():
    client.close()

# ------------- Mount -------------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
