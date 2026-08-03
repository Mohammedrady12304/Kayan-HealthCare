# Kayan Healthcare App

A healthcare visit management system with three user roles: Patient, Doctor, and Finance.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT Auth
- **Frontend:** React, TypeScript, React Router, React Query, Axios

## Architecture
Layered architecture (Controller → Service → Repository → Database) organized by feature modules
(auth, doctors, visits, finance). Business rules are enforced in the service layer.

## Features
- **Patient:** register/login, view doctors, book a visit, view own visits
- **Doctor:** login, view assigned visits, start a visit (only one active visit at a time),
  add treatments (auto-calculated total), complete a visit with medical notes
- **Finance:** review all visits, search by doctor name / patient name / visit ID
  (combinable filters), dashboard with revenue and visit statistics

## Setup

### Backend
\`\`\`bash
cd kayan-backend
npm install
cp .env.example .env 
npx prisma migrate dev
npx prisma db seed
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd kayan-frontend
npm install
npm run dev
\`\`\`

## Environment Variables (.env.example)
\`\`\`
DATABASE_URL="postgresql://user:password@localhost:5432/kayan_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3000
\`\`\`

## API Overview

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | /api/auth/register | - | Register a new user |
| POST | /api/auth/login | - | Login |
| GET | /api/doctors | Any | List doctors |
| POST | /api/visits | Patient | Book a visit |
| GET | /api/visits/my-visits | Patient | List own visits |
| GET | /api/visits/doctor-visits | Doctor | List doctor's visits |
| PATCH | /api/visits/:id/start | Doctor | Start a visit |
| POST | /api/visits/:id/treatments | Doctor | Add a treatment |
| PATCH | /api/visits/:id/complete | Doctor | Complete a visit |
| GET | /api/finance/visits | Finance | Search visits (filters combinable) |
| GET | /api/finance/dashboard | Finance | Dashboard statistics |

## Key Design Decisions
- One active (`IN_PROGRESS`) visit per doctor is enforced in the service layer.
- Treatment addition and total recalculation run inside a single database transaction
  to guarantee consistency.
- Finance search builds a dynamic Prisma `where` clause so any combination of filters
  works without duplicated query logic.