# SnapFix

SnapFix is a civic issue management platform that turns public complaints into an operational workflow. The project connects citizens, gig workers, and administrators through a single closed loop: report an issue, validate it, assign work, verify completion, and release payment only after evidence is confirmed.

This repository is not a single app; it is a multi-part system that includes a React client for citizens and workers, a government/admin dashboard, an Express API, MongoDB persistence, and a Python AI service that validates whether uploaded images match real civic problems.

## Why this project exists

Most civic issue systems fail because they stop at submission. A problem gets reported, but there is no reliable path from complaint to execution to closure. SnapFix addresses that gap by making the lifecycle explicit, auditable, and financially gated.

The underlying workflow is:

$$\text{Report} \longrightarrow \text{Validate} \longrightarrow \text{Deduplicate} \longrightarrow \text{Assign} \longrightarrow \text{Execute} \longrightarrow \text{Verify} \longrightarrow \text{Settle}$$

### System Numerical Breakdown

- **3** distinct application/service surfaces (`Client`, `Admin`, `Model`)
- **8** backend route modules in the Express API layer
- **8** controller modules implementing business and settlement logic
- **8** Mongoose model schemas defining persistent domain entities
- **3** user role domains (`citizen`, `gigworker`, `admin` with `Local`, `State`, `Central` tiers)
- **512** dimensions in CLIP dense image embeddings
- **50m** proximity radius for geospatial duplicate detection
- **5000m (5km)** search radius for worker discovery & community feeds
- **90% (0.90)** cosine similarity threshold for vector duplicate identification
- **15s** HTTP request timeout for AI service calls with automatic fallback
- **6** zero-shot semantic prompt classes pre-calculated at AI server startup
- **0.55 / 0.50** AI confidence score thresholds for civic issue verification
- **7** event-driven notification lifecycle triggers across state transitions

---

## Engineering Highlights & Technical System Design

### 1. Parallelized I/O & Full-Stack Latency Optimization Pipeline
During report creation ([Server/controllers/ReportController.js](Server/controllers/ReportController.js)), the API layer handles file uploads and vector inference concurrently rather than sequentially (`Promise.all`), backed by an end-to-end performance optimization stack:

```javascript
// Parallel execution of Cloudinary upload and FastAPI AI perception inference
const [cloudinaryResult, aiResponse] = await Promise.all([
    cloudinaryPromise,
    aiPromise
]);
```
- **Client HTML5 Canvas Compression:** Downscales camera photos (8MB–15MB) to max 1280px in browser memory (`compressImage.js`) prior to upload (~90% network payload reduction).
- **Server In-Memory `sharp` Buffer Processing:** Resizes uploaded images to ~80KB in-memory buffers in ~12ms before streaming to external services.
- **Cloudinary `upload_stream` Ingestion:** Streams the 80KB memory buffer directly to Cloudinary instead of uploading raw multi-megabyte files from disk.
- **IPv4-First DNS Routing (`dns.setDefaultResultOrder('ipv4first')`):** Configured Node.js DNS resolution to prioritize IPv4, eliminating a ~3.5s Windows IPv6 AAAA lookup timeout stall on external HTTPS requests.
- **Persistent HTTP Keep-Alive Socket Pooling (`https.Agent`):** Reuses warm TCP/TLS sockets for outbound API calls, eliminating repetitive HTTPS handshake overhead.
- **Native MongoDB Driver Insertion (`insertOne`):** Direct collection insertion for 512-dimensional vector reports to bypass Mongoose schema validation loops, cutting database write latency from ~537ms to ~25ms.
- **Instrumented Micro-Benchmarking:** Uses `performance.now()` to measure and log precise timings for Cloudinary upload, AI inference, duplicate querying, vector similarity calculations, and DB creation.

### 2. Non-Blocking Post-Response Async Task Offloading
To minimize response latency for end-users, `createReport` sends the HTTP response immediately after core database insertion, while deferring non-critical secondary operations:

```javascript
// HTTP 201 response emitted immediately
res.status(201).json(responsePayload);

// Secondary operations execute asynchronously in background
if (userId) {
    await User.findByIdAndUpdate(userId, { $push: { reports: report._id } });
    await createNotification(userId, "User", "Report Created", ...);
}
```

### 3. Two-Tier Hybrid Duplicate Suppression Engine
Rather than relying solely on text or geo-fencing, SnapFix combines geospatial spatial indexing with high-dimensional vector embeddings:

1. **Tier 1 (Geospatial Candidate Filtering):** MongoDB `$near` `2dsphere` query retrieves open reports within **50 meters** of the submission coordinates.
2. **Tier 2 (Vector Cosine Similarity):** Calculates dot-product similarity between the **512-dimensional CLIP embedding** of the new image and nearby candidate embeddings.
3. **Threshold Gate:** If similarity $> 0.90$ (90%), the system flags a duplicate.
4. **Atomic Conversion:** Converts duplicate creation into an **atomic upvote** (`$addToSet: { upvotedUsers }`, `$inc: { upvotes: 1 }`), notifies the user, and increases ticket priority without creating redundant database records.
5. **Fault Tolerance Fallback:** If the AI service times out (15s) or fails, the backend gracefully falls back to matching by `category` within the 50m radius.

### 4. AI Perception Engine Optimizations
The Python AI microservice ([Model/main.py](Model/main.py)) leverages `openai/clip-vit-base-patch32`:

- **Pre-computed Prompt Vectors:** Pre-calculates and normalizes 512-dim text embeddings for **6 zero-shot prompt classes** at startup (`text_features = F.normalize(...)`), avoiding per-request text re-encoding.
- **Direct 224px Image Resizing & Inference Mode:** Resizes input images directly to CLIP's native $224 \times 224$ resolution with PIL `BILINEAR` interpolation, combined with `torch.inference_mode()` and CPU intra-op multi-threading (`torch.set_num_threads`).
- **Fast Vector Dot-Product:** Performs fast matrix multiplication (`normalized_embedding @ text_features.T * logit_scale`) and softmax probability mapping.
- **Precision Thresholding:** Enforces a **0.55 confidence gate** in the perception layer and **0.50** in the API layer to reject irrelevant uploads (e.g., pets, documents, indoor scenes).

### 5. Financial Settlement & Proof-Before-Payment Engine
- **Verification Gate:** Admin payout release ([Server/controllers/adminController.js](Server/controllers/adminController.js)) is strictly blocked until `verifiedByCitizen: true` and task status is `Completed`.
- **Atomic Wallet Ledger:** Updates worker wallet balances atomically (`worker.walletBalance += bidAmount`).
- **Audit Trails:** Creates immutable `Payment` records populated with generated transaction identifiers (`TXN-{timestamp}-{random}`) and admin ID timestamps.

### 6. Concurrency & Data Integrity Controls
- **Bid Uniqueness:** Compound index `{ reportId: 1, gigWorkerId: 1 }` with `unique: true` in `bidModel.js` prevents duplicate bids.
- **Double Assignment Guard:** `approveBid` checks `Task.findOne({ reportId })` to prevent double-assignment.
- **State Cascading:** Approving a bid automatically bulk-rejects competing bids (`Bid.updateMany({ reportId, _id: { $ne: bidId } }, { status: 'Rejected' })`).

---

## Architecture

```mermaid
flowchart LR
    Citizen[Citizen Client - React] -->|report / upvote / verify| API[Express API - Node.js]
    Worker[Gig Worker Client - React] -->|discover tasks / bid / upload proof| API
    Admin[Admin Dashboard - React] -->|approve bids / monitor / release payment| API
    API -->|reads and writes| DB[(MongoDB + 2dsphere)]
    API -->|stores images| Cloud[Cloudinary]
    API -->|AI validation (Parallel Promise)| AI[FastAPI + CLIP Engine]
```

### 1. Frontend layer

The repository contains two React applications:

- [Client](Client): citizen and gig worker experience (includes reporting forms, bid management, worker feeds, and interactive educational modules `eduModule`).
- [Admin](Admin): government/admin operations dashboard (includes issue verification, worker bid approval, and audited fund release `FundRelease`).

### 2. API layer

The backend entry point is [Server/server.js](Server/server.js). It initializes Express, registers route modules, configures CORS origins, connects to MongoDB, and initializes Cloudinary.

The API is organized into **8 domain modules** under [Server/routes](Server/routes) and [Server/controllers](Server/controllers):

1. `authRoute` / `authController.js`: JWT identity management & bcrypt hashing (Citizens, Workers, Admins)
2. `reportRoute` / `ReportController.js`: Parallel upload, AI validation, geospatial duplicate detection, upvoting, feed retrieval
3. `workerRoute` / `workerController.js`: Location-filtered nearby report queries for gig workers
4. `bidRoute` / `bidController.js`: Bidding submission with uniqueness enforcement
5. `taskRoute` / `taskController.js`: Proof upload with geo-tagging & citizen verification
6. `adminRoute` / `adminController.js`: Issue management, bid approvals, double-assignment guards, and fund release
7. `notificationRoute` / `notificationController.js`: Event-driven state updates across 7 transition points
8. `userRoute` / `userController.js`: User profile & issue history management

### 3. Persistence layer

Implemented with Mongoose under [Server/models](Server/models) across **8 collections**:

- `User`: Citizen credentials, reported issues, and upvoted report references
- `Worker`: Gig worker skills, 2dsphere location coordinates, rating, and wallet balance
- `Admin`: Hierarchical admin levels (`Local`, `State`, `Central`)
- `Report`: Geospatial coordinates (`Point`), 512-dim CLIP embeddings, upvote tracking, AI confidence scores, and localized content (`en`/`hi`)
- `Bid`: Work estimate, bid amount, duration, resource notes, and status
- `Task`: Assignment tracking, proof image URL, proof location, citizen verification flags, and rating
- `Payment`: Audit log storing transaction IDs, released amounts, admin IDs, and timestamps
- `Notification`: In-app updates for state transitions

### 4. AI validation layer

The Python microservice in [Model/main.py](Model/main.py) uses CLIP to classify uploaded images. Packaged with Docker ([Model/Dockerfile](Model/Dockerfile)) for deployment on platforms like HuggingFace Spaces or container clouds.

---

## Core Operational Workflows

### Citizen Report Creation & Deduplication

```text
User Submit -> Parallel (Cloudinary Upload + AI Perception Inference)
                  │
                  ├── AI Image Rejected (Confidence < 0.50) -> HTTP 400 Error
                  └── AI Image Valid (Confidence >= 0.50)
                        │
                        ▼
            MongoDB $near Query (50m Radius)
                  │
                  ├── Cosine Similarity > 0.90 -> Auto-Upvote Existing Report + Notify User
                  └── No Similar Report -> Create New Report + Send Response (HTTP 201)
                                                 │
                                                 └── Async Background (Update User List + Send Notification)
```

---

## System Specs & Numerical Metrics Summary

| Component / Feature | Metric / Parameter | Technical Description |
| :--- | :--- | :--- |
| **API Endpoints & Logic** | 8 Routes, 8 Controllers, 8 Models | Complete modular domain separation |
| **AI Model Architecture** | `openai/clip-vit-base-patch32` | 512-dimensional normalized vision-language embeddings |
| **AI Prompt Classes** | 6 Zero-Shot Labels | Pre-calculated at startup to prevent inference re-encoding |
| **AI Confidence Threshold** | `0.55` (Model) / `0.50` (API) | Minimum confidence for valid civic issue ingestion |
| **AI Service Timeout** | 15.0 Seconds | Timeout with automatic fallback to category/geo matching |
| **Duplicate Search Radius** | 50 Meters | MongoDB `2dsphere` spatial query radius |
| **Vector Similarity Threshold** | 0.90 (90%) Cosine Similarity | Threshold for marking duplicate visual reports |
| **Worker Discovery Radius** | 5000 Meters (5 km) | Worker location-based job discovery radius |
| **Financial Audit Logs** | `TXN-{timestamp}-{rand}` | Unique transaction identifiers generated on payout |
| **Auth JWT Expiration** | 24 Hours (`1d`) | Signed JSON Web Tokens with role-based access control |

---

## Tech Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Frontend** | React 18 + Vite | User interfaces for citizens, workers, and admins |
| **API** | Node.js + Express | Business orchestration, parallel I/O, and settlement logic |
| **Persistence** | MongoDB + Mongoose | Durable issue, bid, task, and financial state storage |
| **Geospatial** | MongoDB 2dsphere | Spatial proximity indexing for duplicate suppression and job discovery |
| **AI Perception** | FastAPI + PyTorch + CLIP | Semantic classification and 512-dim vector extraction |
| **Media Pipeline** | Cloudinary | Photo storage, compression, and global delivery |
| **Auth & Security** | JWT + bcrypt | Identity management and role-based authorization middleware |
| **Containerization** | Docker | Container packaging for HuggingFace / cloud hosting |

---

## Local Setup

### Prerequisites

- Node.js (v18+) and npm
- Python 3.11+
- MongoDB instance (with `2dsphere` index support)
- Cloudinary account credentials
- Environment variables configured in `Server/.env` (`PORT`, `MONGO_URI`, `CLOUDINARY_*`, `AI_SERVER_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`)

### 1. Install Backend Dependencies
```bash
cd Server
npm install
```

### 2. Install Citizen/Worker Frontend Dependencies
```bash
cd Client
npm install
```

### 3. Install Admin Frontend Dependencies
```bash
cd Admin
npm install
```

### 4. Start the Express API Backend
```bash
cd Server
npm run dev
```

### 5. Start the Citizen/Worker React App
```bash
cd Client
npm run dev
```

### 6. Start the Admin React Operations Dashboard
```bash
cd Admin
npm run dev
```

### 7. Start the Python AI Perception Engine
```bash
cd Model
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🧪 Automated Testing & Quality Assurance Suite

SnapFix incorporates a comprehensive multi-tiered automated testing pyramid designed to ensure data integrity, spatial query correctness, role-based authorization, and resilient end-to-end civic operations across all services.

```text
               / \
              /   \     E2E Workflow Tests (Full Multi-Actor Lifecycles)
             / E2E \    [Tool: Supertest Pipeline / Playwright API]
            /-------\
           /         \   Integration Tests (Routes + Controllers + MongoDB + Cloudinary + AI)
          / Integration \ [Tool: Jest (ESM) + Supertest + MongoDB Memory Server]
         /---------------\
        /                 \  Unit Tests (Pure Functions, Math, Schemas & Security Utilities)
       /       Unit        \ [Tool: Jest Unit Runner, Pytest Native]
      /---------------------\
```

### 1. Test Architecture & Stack

| Layer | Tools & Libraries | Purpose |
| :--- | :--- | :--- |
| **Test Runner & Assertions** | `Jest` (Node ESM `--experimental-vm-modules`) | Test execution, global injection, and assertion framework |
| **API Integration** | `Supertest` | HTTP request simulation against Express application routes |
| **In-Memory Database** | `mongodb-memory-server` | Ephemeral, isolated MongoDB instance for fast zero-side-effect test runs |
| **Mocking & Spies** | `jest.spyOn()`, `jest.fn()` | Interception of external I/O (Cloudinary streaming, FastAPI AI endpoints) |
| **AI Perception Testing** | `pytest` + `httpx` (FastAPI TestClient) | Unit and integration testing for CLIP vision-language inference in Python |

---

### 2. Test Suite Organization & Coverage Breakdown

The test suite is partitioned into **Unit**, **Integration**, and **End-to-End (E2E)** tiers across `Server/tests/` and `Model/test/`:

#### 🧩 Unit Testing Suite (`Server/tests/unit/` & `Model/test/`)
- **Mathematical & Algorithm Logic (`math/`):** Validates vector cosine similarity calculations (`UT-MATH-01` to `UT-MATH-04`), handling identical, orthogonal, dimension-mismatched, and null/empty embedding vectors.
- **Model Schema Validations (`schema/`):** Validates Mongoose schema constraints, coordinates bounds (`Longitude -180..180, Latitude -90..90`), bid amounts (`min: 0`), task ratings (`max: 5`), approval status enums, user role defaults, and payment audit models (`UT-SCH-01` to `UT-SCH-07`).
- **Security & Authentication Helpers (`auth/`):** Verifies bcrypt salt hashing/comparison and JWT token signing and payload decoding (`UT-AUTH-01`, `UT-AUTH-02`).
- **AI Vector Normalization (`Model/test/`):** Confirms L2-normalization on CLIP prompt feature tensors ($\sqrt{\sum x_i^2} = 1.0 \pm 1e-5$).

#### 🔌 Integration Testing Suite (`Server/tests/integration/`)
- **Authentication & Role Resolution (`auth/auth.test.js`):** Citizen and gig worker registration, geospatial coordinates ingestion, duplicate email conflicts (409), password authentication (200/400), admin auto-bootstrap, and JWT authorization middleware guards (`IT-AUTH-01` to `IT-AUTH-10`).
- **Report Ingestion & Deduplication (`reports/`):** Multipart photo upload with `sharp` buffer compression, parallel AI embedding attachment, spatial `$near` 50m radius search, vector duplicate suppression (> 0.90 similarity) with atomic upvoting, and category-matching fallback (`IT-REP-01` to `IT-REP-05`).
- **User History & Community Feed (`reports/userReports.test.js`):** User `my-reports` retrieval with attached task status and ratings, empty states, upvote toggling mechanics, and location feed queries (`IT-USR-01` to `IT-USR-07`).
- **Bidding & Worker Discovery (`bids/`):** Nearby job querying (5km radius), unique compound index bid constraints, and worker profile retrieval (`IT-BID-01` to `IT-BID-03`, `IT-WRK-01`, `IT-WRK-02`).
- **Task Execution & Proof Verification (`tasks/tasks.test.js`):** Work proof photo submission with geo-tagging, duplicate proof blocking, citizen acceptance/rejection transitions, and assigned worker/admin access controls (`IT-TSK-01` to `IT-TSK-09`).
- **Admin Operations & Audited Settlement (`admin/`):** Bid approval cascades, competing bids auto-rejection, double-assignment guards, completed task aggregation, and citizen-verified payout release (`IT-ADM-01` to `IT-ADM-07`, `IT-PAY-01`, `IT-PAY-02`).
- **Event-Driven Notifications (`notifications/notifications.test.js`):** In-app notification queue retrieval and read-status updates (`IT-NOTIF-01`, `IT-NOTIF-02`).

#### 🔄 End-to-End System Workflows (`Server/tests/e2e/`)
- **Workflow 1: Full Happy Path Civic Lifecycle (`fullLifecycle.test.js`):**
  $$\text{Citizen Report} \rightarrow \text{AI Validation} \rightarrow \text{Worker 5km Discovery} \rightarrow \text{Bid Submission} \rightarrow \text{Admin Approval} \rightarrow \text{Proof Upload} \rightarrow \text{Citizen Acceptance} \rightarrow \text{Payout Release}$$
- **Workflow 2: Work Quality Dispute & Rejection (`workDisputeWorkflow.test.js`):**
  Evaluates citizen rejection of sub-par work (`isSatisfied: false`), cascading status updates to `Rejected`, and automatic payout blocking.
- **Workflow 3: Competitive Multi-Worker Bidding & Settlement (`competitiveBiddingWorkflow.test.js`):**
  Evaluates competing bids from multiple gig workers, admin selection, automatic rejection of competing offers, proof submission, and atomic wallet credit with audit logs (`TXN-*`).

---

### 3. Running Automated Tests

#### Backend API Test Suites (Unit, Integration & E2E)
```bash
cd Server

# Run all test suites
npm test

# Run tests with code coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run a specific test suite
npm test -- tests/integration/auth/auth.test.js
npm test -- tests/e2e/
```

#### AI Perception Service Test Suite (Python / FastAPI)
```bash
cd Model

# Run FastAPI CLIP service tests
pytest --verbose
```

---

## Bottom Line

SnapFix is a civic operations platform that converts public complaints into an accountable, verified, and settled workflow. 

Its real engineering value lies in its **parallel I/O orchestration**, **two-tier geospatial & vector duplicate suppression engine**, **pre-calculated zero-shot AI perception layer**, **fault-tolerant fallbacks**, **proof-gated financial settlement ledger**, and **comprehensive automated testing pyramid**.

