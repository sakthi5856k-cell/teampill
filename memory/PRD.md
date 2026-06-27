# Team Pillbox (EMS CORE RP — Pill Box) — PRD

## Original problem statement
EMS roleplay community website. Sections: Home (hero, Join EMS, Discord, live status), Staff directory (Executive/HOD/Doctors/Nurses/EMT/Interns + search/filter), Gallery (lightbox), EMS Application form (Discord webhook + admin approve/reject), ID Card Generator (photo, name, rank, employee ID, QR, print/PDF), Certificate Generator (training/promotion/appreciation PDF), Admin Panel (dashboard, staff, applications, gallery, news, certs, settings), Announcements, Responsive.

## Tech
- FastAPI + Motor (MongoDB) + JWT cookies + bcrypt
- React 19 + Tailwind + Shadcn primitives + Sonner + qrcode.react
- Routes: / · /staff · /gallery · /announcements · /apply · /status · /login · /admin · /idcard/:id · /certificate/:id

## What's implemented (2026-06-27)
- Auth: JWT cookie login, seeded admin (admin@teampillbox.com / Pillbox@2026), brute-force lockout
- Staff CRUD (public listing + filter/search, admin CRUD)
- Applications: public submit → auto Discord DM to applicant w/ reference number (PB-AP-XXXXXX), admin approve/reject → DM applicant the decision; webhook fallback for admin channel
- Public Status lookup page (`/status`) by ref number
- Gallery with category filter + lightbox; admin CRUD
- Announcements (3 categories) with admin CRUD
- ID Card Generator: printable card with photo, name, rank, employee ID, badge, QR (qrcode.react), print-to-PDF
- Certificate Generator: training/promotion/appreciation, printable PDF
- Admin Dashboard with stats
- Settings: Discord bot token, admin channel ID, webhook URL fallback, invite, server status label + online toggle
- Dark theme (teal #1FA7B8 + magenta + electric blue accent) matching the EMS CORE RP Pill Box logo
- Apply form redesigned with sectioned dark layout (Personal / Contact / Background)
- Logo replaced with user-provided round badge (`/logo.png`)

## Test credentials
- See `/app/memory/test_credentials.md`

## Backlog / Next
- P0: Provide Discord Bot Token + Admin Channel ID via Admin → Settings (required for DMs to fire)
- P1: Real photo upload for staff (currently URL only) — wire object storage
- P1: Email notifications (Resend/SendGrid) as fallback when no Discord User ID
- P2: Multi-step Apply wizard, application attachments
- P2: Audit log for admin actions
