# AgroLink Ethiopia — Backend API

The backend for **AgroLink Ethiopia**, an agricultural marketplace connecting
Ethiopian farmers, buyers, agricultural experts, service providers, and
support agents.

> **Scope guardrails (SRS §2.4):** no AI/ML, no automated diagnosis, no
> delivery/logistics tracking. Payments are **record-only** in this release
> (SRS §13.1). All money is stored as integer minor units (santim); `1 ETB = 100 santim`.

---

## Requirements

- Node.js ≥ 18.17 (LTS recommended)
- MongoDB ≥ 6.0 (replica set in production — required for transactions)
- Redis (optional; used only for distributed rate limiting)
- A Cloudinary account (uploads) — optional in dev (uploads disabled if unset)
- An email provider (SMTP/SendGrid/SES) — optional in dev
- An SMS provider (Africa's Talking / Twilio) — optional in dev

---

## Quick start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Copy environment file and fill in the blanks
cp .env.example .env
#    Minimum required for local dev:
#      MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# 3. Seed roles, permissions, crop/input categories, and (optionally) a superadmin
npm run seed

# 4. Start dev server (with hot reload)
npm run dev