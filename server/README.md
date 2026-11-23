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
- MySQL ≥ 8.0
- Redis (optional; used only for distributed rate limiting)
- A Cloudinary account (uploads) — optional in dev (uploads disabled if unset)
- An email provider (SMTP/SendGrid/SES) — optional in dev
- An SMS provider (Africa's Talking / Twilio) — optional in dev

---

## Quick start

```powershell
# 1. Install dependencies
cd server
npm install

# 2. Create the local environment file
Copy-Item .env.example .env
#    Set MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE
#    for your MySQL server. Replace the example JWT secrets before using real data.

# 3. Create the configured database in MySQL, then apply its schema
npm run migrate

# 4. Seed roles, permissions, crop/input categories, and (optionally) a superadmin
npm run seed

# 5. Start dev server (with hot reload)
npm run dev