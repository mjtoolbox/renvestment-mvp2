# Renvestment Solution Architecture

### 1. System Overview & Non-Functional Requirements

**System Overview:**
Renvestment is a FinTech platform designed to solve financial friction between Canadian landlords and tenants. It facilitates on-time rent payments by offering tenants cashback rewards, which can be automatically invested. The platform aims to reduce late payments and tenant turnover for landlords while helping tenants turn their biggest expense into a tool for long-term financial growth .

**Non-Functional Requirements (NFRs):**
Based on the provided documentation, the following NFRs are critical for the MVP and future scaling:

* **Performance:**
    * The system must maintain a response time of **<500ms** for all critical user interactions.
    * The architecture must be scalable to support an initial target of **1,000 concurrent users** and grow to 10,000+ active users by Year 2.

* **Security:**
    * **Authentication:** All user roles must be authenticated via email/password and phone verification (2FA).
    * **Authorization:** The system must implement Role-Based Access Control (RBAC) to ensure users can only access their designated data and functionality.
    * **Data Protection:** All sensitive data, especially tokenized bank details and personally identifiable information (PII), must be encrypted both in transit (TLS 1.2+) and at rest.
    * **Identity Verification:** The platform must integrate a Know Your Customer (KYC) process for user verification to comply with anti-money laundering (AML) regulations.

* **Compliance:**
    * The platform must be built to comply with **PCI DSS** standards for handling payment information (delegated primarily via Stripe).
    * It must adhere to Canada's **PIPEDA** regulations for data privacy.
    * The business must be prepared to register as a Money Services Business (**MSB**) before launch.

* **Reliability & Availability:**
    * The platform must achieve **99.9% uptime**.
    * Disaster recovery targets are a Recovery Point Objective (**RPO**) of **≤1 hour** and a Recovery Time Objective (**RTO**) of **≤4 hours**.

* **Usability:**
    * The user interface must follow a **mobile-first, responsive design** to ensure a seamless experience on all devices.
    * The platform support multilingual capabilities, starting with **English and French** in the future phase.

---

### 2. Architectural Pattern & Core Tech Stack

**Architectural Pattern:** **Modular Monolith**

*Justification:* For an MVP this pattern balances development speed with future scalability. The PoC has been implemented as a single Next.js application (frontend + serverless route handlers) to validate end-to-end flows quickly. The codebase is organized into loosely-coupled components (UI components, route handlers, and a small DB utility) so pieces can be extracted into standalone services later.

**Implemented Tech Stack (PoC)**

* **Runtime / Platform:** Next.js (App Router) running on Node (Vercel for deployment)
    * The PoC uses Next.js both for the frontend UI (React components) and for backend logic via route handlers under `app/api/*`.
* **Database:** PostgreSQL (Vercel Postgres / Neon compatible). Connection is managed with `pg` and a small `lib/db.ts` utility. The DB pool is lazily initialized and preserved across Next.js hot reloads during development.
    * The DB helper sets `ssl: { rejectUnauthorized: false }` by default to support common hosted Postgres providers. Environment variable names accepted: `DATABASE_URL` or `REVEST_DATABASE_URL`.
* **Data Access:** `node-postgres` (`pg`) is used directly in the PoC for simplicity (no ORM required for the small feature set implemented). We added `@types/pg` for TypeScript support.
* **Frontend / Styling:** Next.js + Tailwind CSS (mobile-first responsive design). Components live under `app/components/*`.
* **UI Patterns:** Headless UI (`@headlessui/react`) for accessible dialogs and transitions. `next/image` is used for images where appropriate.
* **Deployment:** Vercel is used for the PoC. The same Next.js app can be built as a modular monolith and later migrated to Azure/.NET services if the product roadmap requires it.

*Rationale for PoC choices:* Using Next.js for both client and server route handlers accelerated development and allowed rapid iteration. The code is organized so the long-term recommended backend (C#/.NET) can be introduced later; the PoC demonstrates end-to-end flows, database integration, and deployment readiness.

---

### 3. Logical Component Breakdown & Interactions

**Component List:**

1.  **WebApp Frontend (Next.js):** The responsive web client that serves the UI to all user roles (Tenant, Landlord, PM, Admin).
2.  **API Gateway:** A single entry point for all client requests, responsible for routing, authentication, and rate limiting. APIM in Azure or standalong .NET stack Ocelot (reverse proxy).
3.  **User Service (Module):** Manages user registration, login, profiles, roles, and KYC status.
4.  **Contract Service (Module):** Handles the creation, management, and digital signing of rental agreements.
5.  **Payment Service (Module):** Orchestrates all financial transactions. It integrates with **Stripe** for both collecting rent payments and distributing all payouts (to landlord, PM, and tenant cashback via direct deposit/EFT). This service contains the core fund distribution logic 62.
6.  **Notification Service (Module):** Manages and sends all user communications, such as payment reminders and confirmations, via email (e.g., SendGrid) and SMS (e.g., Twilio).
7.  **Primary Database (PostgreSQL):** The relational database storing all core application data.
8.  **External Services:** Third-party APIs, including **Stripe** (Payments, KYC, EFT Payouts) and notification providers.

**Interaction Diagram (Textual):**
> The **User** interacts with the **WebApp Frontend**. The **WebApp Frontend** sends all requests to the **API Gateway** over **REST/HTTPS**. The **API Gateway** authenticates the request and forwards it to the appropriate internal service module within the monolith (e.g., `User Service`, `Payment Service`). The **Payment Service** communicates directly with the **Stripe API** to process rent collection and orchestrate all payouts. The **Notification Service** is triggered by events from other services (e.g., a successful payment) to send emails or SMS messages. All service modules read from and write to the **Primary Database**.

**Sequence Diagram**
sequenceDiagram
    participant U as User
    participant WF as WebApp Frontend
    participant AG as API Gateway
    participant US as User Service
    participant CS as Contract Service
    participant PS as Payment Service
    participant NS as Notification Service
    participant DB as Primary Database
    participant Ext as External Services (Stripe, Twilio, etc.)

    U->>+WF: Interacts with UI
    WF->>AG: REST/HTTPS Request
    AG->>AG: Authenticates Request
    AG-->>-WF: Authentication Failed (if applicable)

    alt User Registration/Login
        AG->>+US: Forwards request (e.g., /users/register)
        US->>DB: Read/Write User data
        US-->>-AG: Response
        AG-->>-WF: Response
        WF-->>-U: Displays UI
    end

    alt Rent Payment Process
        U->>WF: Clicks "Pay Rent"
        WF->>AG: Request to /payments/pay
        AG->>+PS: Forwards request to Payment Service
        PS->>+Ext: Calls Stripe API for payment processing
        Ext-->>-PS: Payment result
        PS->>DB: Updates PaymentTransaction status
        PS->>+NS: Triggers notification event (e.g., successful payment)
        NS->>+Ext: Sends Email/SMS via SendGrid/Twilio
        Ext-->>-NS: Acknowledgment
        NS-->>-PS: Notification sent
        PS-->>-AG: Response
        AG-->>-WF: Response
        WF-->>-U: Displays payment confirmation
    end

    alt Contract Management
        U->>WF: Clicks to view or create contract
        WF->>AG: Request to /contracts
        AG->>+CS: Forwards request to Contract Service
        CS->>DB: Read/Write Contract data
        CS-->>-AG: Response
        AG-->>-WF: Response
        WF-->>-U: Displays contract details
    end

---

### 4. Data Model Outline (Core Entities)

1.  **User**
    * **Attributes:** `UserID` (PK), `Email`, `HashedPassword`, `PhoneNumber`, `Role` (Enum: Landlord, Tenant, PM, Admin), `KYCStatus` (Enum: Pending, Verified, Failed).
    * **Relationships:**
        * A Property Manager `User` HAS MANY managed Landlord `User`s.

2.  **Property**
    * **Attributes:** `PropertyID` (PK), `Address`, `LandlordUserID` (FK to User).
    * **Relationships:**
        * A Landlord `User` HAS MANY `Properties`.

3.  **Contract**
    * **Attributes:** `ContractID` (PK), `PropertyID` (FK to Property), `TenantUserID` (FK to User), `RentAmount`, `CashbackPercentage`, `DueDate`, `Status` (Enum: Active, Ended, Pending).
    * **Relationships:**
        * A `Property` HAS MANY `Contracts`.
        * A Tenant `User` HAS MANY `Contracts`.

4.  **PaymentTransaction**
    * **Attributes:** `TransactionID` (PK), `ContractID` (FK to Contract), `AmountPaid`, `PaymentDate`, `Status` (Enum: Succeeded, Failed, Pending, **Disputed**, **Resolved**), `StripeTransactionID`.
    * **Relationships:**
        * A `Contract` HAS MANY `PaymentTransactions`.

5.  **DistributionLedger**
    * **Attributes:** `LedgerID` (PK), `TransactionID` (FK to PaymentTransaction), `RecipientUserID` (FK to User), `Amount`, `Type` (Enum: Rent, TenantCashback, PMCommission), `Status` (Enum: Paid, Pending).
    * **Relationships:**
        * A `PaymentTransaction` HAS MANY `DistributionLedger` entries.

** ERD diagram **
erDiagram
    direction LR
    %% Entities
    USER {
        int UserID PK
        varchar Email
        varchar HashedPassword
        varchar PhoneNumber
        enum Role "Landlord, Tenant, PM, Admin"
        enum KYCStatus "Pending, Verified, Failed"
    }

    PROPERTY {
        int PropertyID PK
        varchar Address
        int LandlordUserID FK "Landlord User"
    }

    CONTRACT {
        int ContractID PK
        int PropertyID FK
        int TenantUserID FK
        decimal RentAmount
        decimal CashbackPercentage
        date DueDate
        enum Status "Active, Ended, Pending"
    }

    PAYMENT_TRANSACTION {
        int TransactionID PK
        int ContractID FK
        decimal AmountPaid
        datetime PaymentDate
        enum Status "Succeeded, Failed, Pending, Disputed, Resolved"
        varchar StripeTransactionID
    }

    DISTRIBUTION_LEDGER {
        int LedgerID PK
        int TransactionID FK
        int RecipientUserID FK
        decimal Amount
        enum Type "Rent, TenantCashback, PMCommission"
        enum Status "Paid, Pending"
    }

    %% Relationships
    USER ||--o{ PROPERTY : "HAS MANY"
    PROPERTY ||--o{ CONTRACT : "HAS MANY"
    USER ||--o{ CONTRACT : "HAS MANY"
    CONTRACT ||--o{ PAYMENT_TRANSACTION : "HAS MANY"
    PAYMENT_TRANSACTION ||--o{ DISTRIBUTION_LEDGER : "HAS MANY"
    USER ||--o{ DISTRIBUTION_LEDGER : "Recipient"
    USER }|--o{ USER : "Manages"
---

### 5. Key Design Decisions & Rationale

* **Decision:** Adopt a **Modular Monolith** architecture for the MVP.
    * **Rationale:** This approach reduces initial deployment complexity, allowing the team to move faster and focus on core features, while preserving the option to scale into microservices later.
* **Decision:** Utilize a **C#/.NET backend**, **Next.js frontend**, and **PostgreSQL database**, all hosted on **Microsoft Azure**.
    * **Rationale:** This stack was chosen to directly leverage the CTO's deep expertise in the Microsoft and Azure ecosystem, minimizing technical risk and maximizing development efficiency. The specific frameworks were confirmed as the preferred choice.
* **Decision:** Centralize all payment and payout operations through **Stripe**.
    * **Rationale:** To solve the challenge of not having a direct Wealthsimple API, we will use Stripe's infrastructure for both rent collection and direct deposit (EFT) payouts for tenant cashback, landlord rent, and PM commissions. This strategy unifies the payment system within a single, compliant provider.
* **Decision:** Implement a manual, status-based workflow for dispute resolution.
    * **Rationale:** For the MVP, an admin can flag a transaction in the system as "Disputed," which pauses any associated actions. After an offline investigation (e.g., phone calls), the admin will manually update the transaction's final status to "Resolved" or "Failed," ensuring human oversight for complex issues without over-engineering an automated system at this early stage.


### 6. Proof of Concept (PoC) Development & Tech Stack
The PoC will focus on rapid, end-to-end validation of the core user and contract management flows. This initial phase intentionally uses a simplified, unified technology stack for agility before transitioning to the full C#/.NET architecture.

#### 6.1 PoC Goals
The following features must be operational and deployed on Vercel:

1. **Web Layout Look & Feel Confirmation**: Develop the primary landlord and tenant dashboards and forms to confirm the core UI/UX design.

2. **User Registration Flow Complete**: Implement email/password registration and profile setup (Landlord vs. Tenant roles).

3. **Contract Creation & Management**: A Landlord can create a lease contract, and a Tenant can view and "accept" the contract. Database schemas must support this relationship.

4. **Rent Payment Simulation**: The frontend can trigger a payment request that interacts with the backend and successfully processes the payment through the Mock External System.

#### 6.2 PoC Technology Stack
| Component | Technology | Rationale |
| Frontend/API/Deployment | Next.js (App Router) & Vercel | Enables rapid full-stack development and serverless API routes, optimized for quick deployment on the target platform (Vercel). |
| Database | Vercel PostgreSQL | Directly integrates with the Vercel platform, providing a managed, native relational database for the PoC data model. |
| Database ORM/Access | Prisma or Drizzle | Recommended ORM to manage schema migrations and provide type-safe database access within the Next.js environment. |
| Authentication | Auth.js (NextAuth.js) | Provides a robust, full-stack solution for handling user sessions, credentials, and role-based access control required by the registration flow. |

#### 6.3 Mock External System Recommendation (Mock Stripe API)
To simulate the rent payment process (Goal #4) without requiring a real Stripe account or a separate C# service, we will build the mock payment system using the following approach:

- Recommended Stack: Next.js API Routes (Route Handlers) within the PoC application.

- Implementation: Create endpoints such as /api/mock-payment/charge and /api/mock-payment/payout.

- Logic: These endpoints will contain simple, deterministic logic:

    - They accept the transaction amount and user IDs.

    - They simulate a successful Stripe payment_intent.succeeded response 90% of the time and a "failure" response 10% of the time, allowing the main application to test both success and error paths.

    - The mock endpoints will instantly update the local Vercel PostgreSQL database with a final status, simulating the effect of the Stripe webhook.

- Benefit: This co-located solution is the fastest to develop, deploy, and maintain, ensuring the PoC remains a single, coherent application.   