# Admissions Portal - System Architecture & Verification Document

This document outlines the system topology, module components, data schemas, security structures, and business rules governing the Vishnu Institute of Technology (VIT) Admissions System.

---

## 1. System Topology Overview

The application utilizes a **three-tier architecture** with client-side guards, a middleware mock backend routing layer, an autonomous relational database scheduler, and external service simulator relays.

```mermaid
graph TD
    subgraph Client-Side (Next.js 15)
        A[Public Applying Wizard /apply]
        B[Counselor Login Portal /counselor]
        C[Counselor Dashboard /dashboard]
    end

    subgraph Backend Routing (Node.js/Express)
        D[JWT Authentication Middleware]
        E[Admissions Controller Routes]
        F[Gemini AI RAG Simulator]
    end

    subgraph Datastore (Hybrid Persistence)
        G[(PostgreSQL Database: vit_admissions)]
        H[(Local File Backup: enrollments.json)]
    end

    subgraph Ext-Relays (External Integrations)
        I[Salesforce CRM Lead Sync]
        J[Twilio WhatsApp Dispatch]
    end

    A -->|Public POST /api/enrollments| E
    B -->|POST /api/counselor/login| D
    C -->|GET /api/enrollments with JWT| E
    C -->|POST /api/enrollments/action with JWT| E
    
    D -->|Issue Token| C

    E -->|Write SQL| G
    E -->|Sync Cache| H

    E -->|Trigger AI Insights| F
    E -->|Trigger CRM Sync| I
    E -->|Trigger Advisor Handoff Notification| J
```

---

## 2. Component Directory Structure

The system is decoupled into two primary folders:

```
AI-Enabled Student Admission System/
├── Backend/mock-server/            # Backend Service Layer
│   ├── data/
│   │   └── enrollments.json        # Filesystem fallback datastore
│   ├── .env                        # Credentials & URL keys
│   ├── package.json                # Dependencies (pg, express)
│   ├── server.js                   # Primary entrypoint & logic routing
│   └── verify-dashboard-endpoints.js # Integration Verification Script
└── Frontend/                       # Frontend Presentation Layer
    ├── app/
    │   ├── apply/                  # Student registration form
    │   └── counselor/              # Counselor views and auth guard
    ├── components/
    │   └── vishnu-landing-page.tsx # Main Landing page layouts
    └── next.config.mjs             # Next.js configurations
```

---

## 3. Detailed Data Persistence Layer (PostgreSQL)

The system operates on a **hybrid storage strategy**. The backend initiates database structures dynamically on startup:

### Relational Schema Design
Stored in the `enrollments` table inside PostgreSQL (`vit_admissions`):
```sql
CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    dob VARCHAR(20),
    gender VARCHAR(20),
    nationality VARCHAR(50),
    category VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(30),
    address TEXT,
    qualifying_exam VARCHAR(10),
    entrance_exam VARCHAR(30),
    roll_number VARCHAR(50),
    rank_score INTEGER DEFAULT 0,
    tenth_marks VARCHAR(10),
    twelfth_marks VARCHAR(10),
    choice_active VARCHAR(50),
    choice_option1 VARCHAR(50),
    choice_option2 VARCHAR(50),
    expected_start_date VARCHAR(20),
    discount_percentage INTEGER DEFAULT 0,
    approval_status VARCHAR(50) DEFAULT 'Pending',
    enrollment_status VARCHAR(50) DEFAULT 'Submitted for Approval',
    ai_priority_score INTEGER DEFAULT 50,
    risk_level VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Self-Healing Initialization Flow
1. **Connection check**: The server queries the database via `DATABASE_URL`.
2. **Missing DB Handler (Error `3D000`)**: If the target database `vit_admissions` does not exist:
   * The server connects to the administrative `postgres` database.
   * Runs `CREATE DATABASE vit_admissions`.
   * Reconnects to the newly created database, inspects schemas, and generates the table `enrollments`.
3. **Local File Fallback**: If the PostgreSQL connection completely fails/times out, the backend auto-reverts to dual-writes inside the local `data/enrollments.json` buffer to ensure high performance and developer availability.

---

## 4. Custom JWT Security Model

Admin endpoints are safeguarded using a **custom cryptographic JWT middleware** implemented using Node's native `crypto` library:

* **Signing Method**: Custom `crypto.createHmac('sha256', secret)` creates the signature.
* **Token Structure**: Standard three-part token (`header.payload.signature`) concatenated with periods `.`.
* **Validity Window**: Tokens are signed to expire exactly 1 hour from generation.
* **Authorization Guard (`checkAuthorized`)**:
  * Extracted from the `Authorization: Bearer <token>` header.
  * Verified for tampering by re-computing the HMAC signature.
  * Extracted JSON expiration metadata checks if the token is still valid.
  * Access is blocked with `401 Unauthorized` if invalid signature or expired.

---

## 5. Admissions Business Logic & Cutoff Checks

The student application form (`/apply`) enforces entrance exam cutoffs and manages scholarship discounts based on specific policies:

### Policy Parameters (AP EAPCET vs. AP ECET)

| Policy Dimension | AP EAPCET (Regular B.Tech) | AP ECET (Lateral Entry) |
| :--- | :--- | :--- |
| **Total Rank Pool** | Large (~150,000+ candidates) | Small (~10,000 candidates) |
| **Normal Cutoff (CSE)** | Rank $\le$ 8,000 | Rank $\le$ 800 |
| **Normal Cutoff (ECE)** | Rank $\le$ 25,000 | Rank $\le$ 2,500 |
| **Normal Cutoff (ME)** | Rank $\le$ 60,000 | Rank $\le$ 6,000 |
| **Scholarship Brackets** | **50%**: Rank $\le$ 5,000<br>**30%**: Rank $\le$ 15,000<br>**15%**: Rank $\le$ 30,000<br>**5%**: Rank $>$ 30,000 | **50%**: Rank $\le$ 200<br>**30%**: Rank $\le$ 500<br>**15%**: Rank $\le$ 1,000<br>**5%**: Rank $>$ 1,000 |

### Other Quota Discounts
* **General / No Scholarship**: flat 0% Discount.
* **Sports Quota**: flat 20% Discount.
* **EWS (Economically Weaker Section)**: flat 30% Discount.
* **Board Topper (95%+ Intermediate)**: flat 50% Discount.

---

## 6. Counselor Verification and AI Analysis

When reviewing registrations, the counselor portal interacts dynamically with external relays:

1. **AI priority Engine (Gemini API)**:
   * Analyzes applicant performance (GPA, branches, discount requested).
   * Generates a safety prioritize/risk assessment on a scale of 0 to 100.
   * Warns of high-risk scenarios (e.g. discount requested without qualifying test score).
2. **Salesforce CRM Integration**:
   * Simulates real-time synchronization. Triggers Lead Creation objects (`Lead.Id` and `Task.Id`) when applicants choose to enroll or submit final fees.
3. **Twilio Notification Relay**:
   * Dispatches advisor seat handoffs via WhatsApp alerts to keep the applicant informed throughout the process.
