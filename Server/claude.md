# SnapFix Server — Project Intelligence

## Project Overview

SnapFix is a **civic-tech platform** that connects **Citizens**, **Gig Workers**, and **Government Admins** in a closed-loop issue-resolution ecosystem. Citizens report infrastructure issues (potholes, garbage, broken streetlights, etc.), gig workers bid to fix them, admins approve bids, and citizens verify completed work before payment is released.

**Built for:** Elvion Hackathon 2026  
**Team:** Risk Takers

---

## Architecture

The project is a **monorepo** with four independent services:

| Directory | Stack | Port | Purpose |
|-----------|-------|------|---------|
| `Server/` | Express.js 5 + MongoDB (Mongoose) | `3000` | REST API backend |
| `Client/` | React (Vite) | `5173` | Citizen & Gig Worker frontend |
| `Admin/` | React (Vite) | `5174` | Admin dashboard frontend |
| `Model/` | Python FastAPI + CLIP + SentenceTransformer | `8000` | AI engine (image validation, categorization, duplicate detection) |

### Server Tech Stack

- **Runtime:** Node.js with ES Modules (`"type": "module"`)
- **Framework:** Express.js 5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT (`jsonwebtoken`) with bcrypt password hashing
- **File Uploads:** Multer (disk storage) → Cloudinary (cloud hosting)
- **Dev Tool:** Nodemon

---

## Server Directory Structure

```
Server/
├── server.js                  # Entry point — Express app, routes, DB + Cloudinary init
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (secrets)
├── config/
│   ├── db.js                  # MongoDB connection via CONNECTION_STRING
│   └── cloudinary.js          # Cloudinary v2 config
├── middleware/
│   ├── authMiddleware.js      # JWT verification, role-based user lookup
│   └── multer.js              # Multer disk storage for image uploads
├── models/
│   ├── userModel.js           # Citizen (role: 'citizen')
│   ├── gigWorkerModel.js      # Gig Worker (role: 'gigworker') — GeoJSON location
│   ├── adminModel.js          # Admin (role: 'Local'|'State'|'Central')
│   ├── reportModel.js         # Civic issue report — GeoJSON, upvotes, status
│   ├── bidModel.js            # Worker bid on a report
│   ├── taskAssignmentModel.js # Task assignment after bid approval — proof, verification
│   ├── paymentModel.js        # Payment tracking (not yet wired into controllers)
│   └── notificationModel.js   # Notifications (not yet wired into controllers)
├── controllers/
│   ├── authController.js      # Register/login for citizen, worker, admin
│   ├── ReportController.js    # Create report, upvote, get by ID, get by location
│   ├── adminController.js     # View all reports, view bids, approve bid, release payment
│   ├── bidController.js       # Create bid, get bids on a report
│   ├── taskController.js      # Upload proof, citizen verification, get task detail
│   ├── userController.js      # Get citizen's own reports & upvoted reports
│   └── workerController.js    # Get nearby reports by worker location, worker profile
└── routes/
    ├── authRoute.js
    ├── reportRoute.js
    ├── adminRoute.js
    ├── bidRoute.js
    ├── taskRoute.js
    ├── userRoute.js
    └── workerRoute.js
```

---

## Environment Variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `CONNECTION_STRING` | MongoDB Atlas connection URI |
| `JWT_SECRET` | Secret key for signing/verifying JWTs |
| `ADMIN_EMAIL` | Hardcoded admin email for login |
| `ADMIN_PASSWORD` | Hardcoded admin password for login |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret |
| `CLOUDINARY_URL` | Full Cloudinary connection URL |
| `PORT` | Server port (default: `3000`) |

---

## User Roles & Auth Flow

Three distinct user types, each with a separate Mongoose model and login/register flow:

| Role | Model | Register | Login | JWT Payload |
|------|-------|----------|-------|-------------|
| `citizen` | `User` | `POST /api/auth/register-citizen` | `POST /api/auth/login-citizen` | `{id, role: "citizen"}` |
| `gigworker` | `Worker` | `POST /api/auth/register-worker` | `POST /api/auth/login-worker` | `{id, role: "gigworker"}` |
| `Local`/`State`/`Central` | `Admin` | Auto-created on first login | `POST /api/auth/login-admin` | `{id, email, role: "Local"}` |

- Passwords hashed with **bcrypt** (salt rounds: 8)
- Tokens expire in **1 day** (`expiresIn: "1d"`)
- Auth middleware extracts `Bearer` token, decodes role, fetches user from the correct model

> **Note:** Admin login uses hardcoded env credentials (`ADMIN_EMAIL`/`ADMIN_PASSWORD`). The admin is auto-created in MongoDB on first login if not found. Admin password is stored in plaintext in the DB (not hashed).

---

## API Routes — Complete Reference

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| POST | `/register-citizen` | ✗ | `registerCitizen` |
| POST | `/login-citizen` | ✗ | `loginCitizen` |
| POST | `/register-worker` | ✗ | `registerWorker` |
| POST | `/login-worker` | ✗ | `loginWorker` |
| POST | `/login-admin` | ✗ | `loginAdmin` |

### Reports (`/api/report`)
| Method | Endpoint | Auth | Middleware | Handler |
|--------|----------|------|-----------|---------|
| POST | `/create-report` | ✓ | `multer.single("image")` | `createReport` |
| GET | `/get-report/:id` | ✗ | — | `getParticularReports` |
| POST | `/upvote/:id` | ✓ | — | `upvoteAReport` |
| GET | `/location` | ✓ | — | `getReportsByLocation` |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| GET | `/all-reports` | ✓ | `viewAllReports` |
| GET | `/bids/:id` | ✓ | `viewReportWithBid` |
| PUT | `/approve-bid/:id` | ✓ | `approveBid` |
| POST | `/release-payment/:id` | ✗* | `paymentRelease` |

> *`release-payment` has `authMiddleware` **commented out** — currently unprotected.

### Bids (`/api/bid`)
| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| POST | `/create-bid/:id` | ✓ | `createBid` |
| GET | `/getBid-report/:id` | ✗ | `getBidOnReport` |

### Tasks (`/api/task`)
| Method | Endpoint | Auth | Middleware | Handler |
|--------|----------|------|-----------|---------|
| POST | `/proof-upload/:id` | ✓ | `multer.single("image")` | `uploadProof` |
| POST | `/verify/:id` | ✓ | — | `verifyByCitizen` |
| GET | `/:id` | ✓ | — | `getTaskDetail` |

### User (`/api/user`)
| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| GET | `/my-reports` | ✓ | `myReports` |

### Worker (`/api/worker`)
| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| GET | `/location` | ✓ | `getReportsByLocation` |
| GET | `/profile` | ✓ | `getWorkerProfile` |

---

## Data Models — Schema Summary

### User (Citizen)
`name`, `email` (unique), `password`, `role` (fixed: `"citizen"`), `reports[]` (ref: Report), `upvotedReports[]` (ref: Report). Timestamps enabled.

### Worker (Gig Worker)
`name`, `email`, `password`, `phone`, `skills[]`, `rating` (0–5), `approvedStatus` (`Pending`|`Verified`|`Rejected`), `location` (GeoJSON Point), `completedTasks[]` (ref: Task), `walletBalance`, `role` (fixed: `"gigworker"`). 2dsphere index on location.

### Admin
`email`, `password`, `role` (`Local`|`State`|`Central`). 2dsphere index on jurisdiction (field not in schema — index exists but field unused).

### Report
`title`, `description`, `category`, `imageUrl`, `createdBy` (ref: User), `location` (GeoJSON Point), `upvotes`, `upvotedUsers[]` (ref: User), `status` (`Pending`|`In Progress`|`Resolved`|`Rejected`), `assignedGigWorker` (ref: Worker), `adminApprovalStatus` (`Pending`|`Approved`|`Rejected`), `paymentReleased`. Indexed on `createdBy` and 2dsphere on `location`.

### Bid
`reportId` (ref: Report), `gigWorkerId` (ref: Worker), `bidAmount`, `resourceNote`, `duration`, `status` (`Pending`|`Approved`|`Rejected`).

### TaskAssignment (registered as model name `"Task"`)
`reportId` (ref: Report), `gigWorkerId` (ref: Worker), `assignedBy` (ref: Admin), `status` (`Assigned`|`In Progress`|`Proof Submitted`|`Completed`|`Rejected`), `paymentStatus` (`Pending`|`Released`|`Failed`), `proof` (embedded: `imageUrl`, `location` GeoJSON, `remarks`, `uploadedAt`), `verifiedByCitizen`, `rating` (0–5), `verifiedAt`.

### Payment (not wired to controllers)
`taskId` (ref: Task), `gigWorkerId` (ref: Worker), `amount`, `status` (`Pending`|`Released`|`Failed`), `releasedBy` (ref: Admin), `transactionId`, `releasedAt`.

### Notification (not wired to controllers)
`userId`, `userType` (`User`|`Worker`|`Admin`), `type`, `message`, `isRead`. Indexed on `{userId, isRead}`.

---

## Core Business Logic / Workflow

```
1. CITIZEN registers → reports an issue (photo + geo-location + description)
2. Report uploaded to Cloudinary, stored in MongoDB with GeoJSON location
3. GIG WORKERS see nearby reports within 5km radius (2dsphere query)
4. Worker submits a BID (amount, resources, duration)
5. ADMIN views report + all bids → approves one bid
   → Approved bid creates a TASK assignment
   → Report status → "In Progress", other bids → "Rejected"
6. Worker uploads PROOF (photo + location + remarks via Cloudinary)
   → Task status → "Proof Submitted"
7. CITIZEN verifies the completed work (satisfied or not)
   → If satisfied: Task → "Completed", Report → "Resolved"
   → If not: Task → "Rejected", Report → "Rejected"
8. ADMIN releases PAYMENT → bid amount added to worker's walletBalance
   → Requires task.verifiedByCitizen === true && task.status === "Completed"
```

---

## AI Model Service (`Model/`)

Separate **FastAPI** service (Python) providing:
- **Civic image validation** — CLIP model checks if image matches civic issue prompts (threshold: 0.35)
- **Auto-categorization** — CLIP + SentenceTransformer classify into: Pothole, Garbage Dump, Streetlight Failure, Water Leakage, Illegal Construction, Road Blockage, Broken Drain
- **Duplicate detection** — Haversine distance (10m radius) + category match
- **Priority scoring** — Weighted formula: 40% confidence + 40% severity + 20% upvotes

**Endpoint:** `POST /predict_url` (accepts `image_url`, `latitude`, `longitude`, `description`)

> **Note:** The AI service is not directly called from the Express server. It operates as a standalone service that the client frontends can call separately.

---

## Key Patterns & Conventions

1. **ESM Modules** — All files use `import`/`export` syntax (package.json: `"type": "module"`)
2. **Response format** — Always `{success: boolean, message: string, ...data}`
3. **Error handling** — Try/catch in every controller, errors logged to console, 500 returned with generic message
4. **GeoJSON** — Locations stored as `{type: "Point", coordinates: [longitude, latitude]}` (MongoDB convention: lng first)
5. **File uploads** — Multer saves to disk → Cloudinary upload → local file deleted (setTimeout or unlinkSync)
6. **Role checks** — Done inside controllers via `req.role` (set by authMiddleware), not at route level
7. **Mongoose model registration** — Uses `mongoose.models.X || mongoose.model('X', schema)` pattern to prevent re-registration

---

## Known Issues & Resolutions

1. ~~`release-payment` route is unprotected~~ — ✅ **RESOLVED:** `authMiddleware` re-enabled in `adminRoute.js`
2. ~~Admin password stored in plaintext~~ — ✅ **RESOLVED:** Admin password now hashed with bcrypt (salt rounds: 8) before storing in `loginAdmin`
3. **`paymentModel.js` and `notificationModel.js` are unused** — 📌 **By design:** Placeholder models for future feature development; no action needed
4. ~~`adminModel.js` has a 2dsphere index on `jurisdiction`~~ — ✅ **RESOLVED:** Stale index removed (field never existed in schema)
5. ~~`npm run dev` script was `nodemon run server`~~ — ✅ **RESOLVED:** Fixed to `nodemon server.js`
6. ~~`npm run test` duplicated dev~~ — ✅ **RESOLVED:** Test script now echoes "No tests configured yet"
7. **Report `get-report/:id` and bid `getBid-report/:id` are unauthenticated** — 📌 **By design:** Intentionally public for read-only viewing
8. ~~Typo `sucess` in loginCitizen error response~~ — ✅ **RESOLVED:** Fixed to `success` in `authController.js`
9. ~~PORT hardcoded to 3000~~ — ✅ **RESOLVED:** Now reads `process.env.PORT` with fallback; `PORT=3000` added to `.env`
10. ~~CORS fully open~~ — ✅ **RESOLVED:** Restricted to `localhost:5173` (Client) and `localhost:5174` (Admin) with `credentials: true`
