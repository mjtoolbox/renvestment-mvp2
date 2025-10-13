# Product Requirement Document (PRD)

**Product:** Renvestment
**Version:** MVP 1
**Prepared by:** Luke Lee
**Date:** October 2025

---

## A. Vision & Goals

**Core Problem:**

- Canadian tenants face high rent costs and low savings rates.
- Landlords struggle with late rent payments, high tenant turnover, and finding reliable tenants.

**Primary Goal:**

- Onboard 50–100 landlords in the first launch period, with measurable reductions in late payments and turnover.
- Collect feedback and reviews showing improved payment consistency.

**Success Metrics:**

- 1,000 landlords onboarded within one year.
- ≥95% on-time payment rate.
- $23,000+ in monthly platform revenue from rent processing (based on $2,300 average rent and 1% fee).

**Core Value Proposition:**

Renvestment helps landlords receive on-time rent payments and attract quality tenants by offering cashback and investment rewards that motivate tenants to pay consistently.

**Long-Term Vision:**

Enable renters and landlords worldwide to build wealth and reliability through automated, rewarding rent payments.

---

## B. User Roles & Personas

| Role | Description | Technical Proficiency | Platform Usage |
|---|---|---|---|
| **Landlord** | Owns property; receives rent and sets cashback terms. | Moderate (age 40+) | Mostly mobile, some desktop. |
| **Tenant** | Rents property; pays rent, earns cashback, invests savings. | Moderate | Primarily mobile-first. |
| **Property Manager (PM)** | Manages multiple units and oversees payment automation and commission distribution. | High | Desktop and mobile dashboards. |
| **Admin** | Renvestment operations; monitors compliance, disputes, partnerships. | High | Full web platform access. |

**Onboarding Model:**

- Landlords sign up, add property, and invite tenants.
- Tenants connect bank details or Wealthsimple account.
- Property managers onboard landlords and tenants on behalf of their clients.

---

## C. Epics & User Stories

**Epics:**

1. User Onboarding
2. Rent Contract Management
3. Rent Payment Processing
4. Cashback & Investment System
5. Landlord Dashboard
6. Tenant Dashboard
7. Property Manager Portal
8. Admin Panel
9. Partnership Portal

**Key User Stories:**

- As a tenant, I want to connect my bank account or Wealthsimple chequing so I can invest my cashback.
- As a tenant, I want to view payment history and receipts so I can track rent and rewards.
- As a landlord, I want to automate deposits so I receive payments on time.
- As a landlord, I want to view rent collected, tenant cashback, and Renvestment commission for transparency.
- As a PM, I want to automate wire transfers and track commissions for each managed property.
- As an admin, I want to approve landlord accounts, manage disputes, and monitor platform analytics.

**Critical User Flows:**

1. Landlord onboarding → add property → invite tenant → rent contract → payment processing → automated deposits.
2. Tenant pays rent → Renvestment splits funds → landlord 99%, tenant cashback 1% → tenant invests via Wealthsimple.

**MVP Priority Features:**

- Rent payment processor.
- Cashback/investment setup for tenants.
- Automated deposits for landlords, tenants, and property managers.
- Stripe + Wealthsimple integration.

**Integrations:**

- Stripe for payment processing.
- **Wealthsimple for investments.**
- **Bank Integrations for lower transaction fees.**
- **SMS/Email for payment notifications.**
- **Rent Reporting API (future).**

---

## D. Functional Requirements

**User Actions:**

- **Tenant**: view history, download receipts, connect accounts, pay rent, invest cashback.
- **Landlord**: see receipts, view on-time payments, total collected, commissions, invite tenants.
- **PM**: manage properties, automate deposits, handle commission distribution.
- **Admin**: approve accounts, resolve disputes, view analytics, update partner configurations.

**Stored Data:**

- Rent contracts (terms, amounts, cashback %, period).
- Tenant, landlord, and PM profiles.
- Bank details (tokenized/encrypted).
- All transactions and receipts.
- Identity verification records (KYC).

**Business Rules:**

- Cashback applies only when rent is paid in full and on time.
- Property managers receive 40% of Renvestment’s 1% fee and their standard 5% commission.
- Each new account creates a unique user record and contract association.

**Inputs & Outputs:**

- **Inputs**: bank info, rent details, contract terms.
- **Outputs**: receipts, confirmation emails, investment summaries, performance analytics.

---

## E. Non-Functional Requirements

| Category | Specification |
|---|---|
| **Performance** | Target ≤ 500ms response time; scalable to 1,000 concurrent users. |
| **Security** | Email/password + phone verification; government ID for KYC; full Stripe compliance. |
| **Compliance** | Register as MSB before launch; adopt PCI & PIPEDA standards post-incorporation. |
| **Usability** | Mobile-first design with desktop parity; multilingual support (EN/FR first). |
| **Reliability** | 99.9% uptime; RPO ≤ 1 hour; RTO ≤ 4 hours. |
| **Analytics** | Track payment success rate, churn, onboarding funnel, system errors (Datadog / GA4). |

---

## F. Out of Scope (for MVP 1)

| Feature / Area | Status | Notes |
|---|---|---|
| Credit Reporting | ◎Maybe in v2+ | Possible later via Equifax/TransUnion integration once regulatory approvals are secured. |
| Cross-Border Payments | ◎Future scope | Canada-only for MVP 1; expansion after compliance and currency support are validated. |
| Advanced Investment Platform | ◎Future scope | Tenants will invest through Wealthsimple initially; Renvestment’s own investment engine may be added later. |
| In-App Messaging / Chat | ◎Future scope | Useful for communication between tenants and landlords but excluded from MVP 1. |
| Mobile-App-Store Launch | ◎Future scope | MVP 1 is responsive web; native iOS/Android apps planned post-traction. |
| Crypto / Alternative Payments | ◎Future scope, pending legality | Only traditional banking and Stripe integrations for now. Will research legal frameworks before expansion. |
| Complex Partnership Dashboards for PMs | ◎Manual setup for MVP 1 | Full self-serve management portals will follow after initial partner pilots. |
| Tenant Background Checks / Credit Screening | ◎Future scope | Planned for later phase once user data & integrations mature. |

---

## G. Open Risks & Differentiators

**Inspirations:**

- Platforms like PayProp, RentMoola, Bilt Rewards, and RentRedi inspired the model but rely on credit cards and promote debt accumulation.
- Renvestment differentiates by focusing on wealth building, savings, and debt-free investing through rent automation.

**Risks:**

1. Legal and compliance uncertainty (MSB licensing, KYC regulations).
2. Technical complexity with multi-party payment distribution.
3. Partner acquisition (property managers, banks, and Wealthsimple API).

**Mitigation Strategies:**

- Begin with Stripe’s regulated infrastructure and manual verification.
- Pilot with a small, trusted landlord group before public rollout.
- Seek early legal consultation for MSB registration and compliance.
- Build credibility through transparent reporting and user testimonials.

---

**End of Document**