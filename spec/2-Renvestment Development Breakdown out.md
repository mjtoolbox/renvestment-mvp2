# Development Breakdown: Renvestment

## 1. Feature: User Onboarding `(MVP)`
**Description:** Enables landlords, tenants, and property managers to register, verify identities (KYC), and access their dedicated dashboards.

### User Stories:
* [ ] **US-1.1:** As a landlord, I want to create an account and verify my identity, so that I can securely receive rent payments.
    *   [ ] `Create` user registration and login endpoints (email/password/phone).
    *   [ ] `Implement` KYC verification workflow (government ID upload and validation).
    *   [ ] `Design` onboarding UI with guided setup steps.
    *   [ ] `Test` registration flow for different roles (tenant, landlord, PM).

* [ ] **US-1.2:** As a tenant, I want to sign up and link my landlord’s account, so that I can pay rent through Renvestment.
    *   [ ] `Create` tenant registration endpoint and role association logic.
    *   [ ] `Implement` tenant-landlord invitation/connection system.
    *   [ ] `Design` invitation email templates.
    *   [ ] `Validate` tenant-bank setup completion.

---

## 2. Feature: Rent Contract Management `(MVP)`
**Description:** Allows landlords and tenants to create, store, and manage rent agreements digitally, including rent amount, term, cashback %, and due dates.

### User Stories:
* [ ] **US-2.1:** As a landlord, I want to create digital rent contracts, so that both parties agree on rent amount and cashback rate.
    *   [ ] `Create` database schema for contracts (amount, dates, cashback %).
    *   [ ] `Develop` contract creation API endpoint.
    *   [ ] `Implement` digital signature or approval flow.
    *   [ ] `Integrate` contract storage with secure file system.

* [ ] **US-2.2:** As a tenant, I want to view my rent contract and terms, so that I can understand rent details and cashback eligibility.
    *   [ ] `Implement` contract retrieval endpoint.
    *   [ ] `Design` tenant contract UI component.
    *   [ ] `Test` data display for accuracy and completeness.

---

## 3. Feature: Rent Payment Processing `(MVP)`
**Description:** Core payment engine that processes rent, splits funds between landlord, tenant cashback, and Renvestment’s 1% platform fee.

### User Stories:
* [ ] **US-3.1:** As a tenant, I want to pay rent securely, so that I can complete my monthly payment through Renvestment.
    *   [ ] `Integrate` Stripe for payment processing.
    *   [ ] `Create` payment initiation and success/failure callbacks.
    *   [ ] `Implement` pre-authorized debit and e-transfer options.
    *   [ ] `Validate` payment completion and transaction storage.

* [ ] **US-3.2:** As a landlord, I want to receive automated rent deposits, so that payments are made on time.
    *   [ ] `Implement` automated payout system using Stripe Connect.
    *   [ ] `Create` payout scheduling logic.
    *   [ ] `Generate` receipts and notifications after each payout.

* [ ] **US-3.3:** As a tenant, I want to receive 1% cashback when I pay on time, so that I am motivated to pay consistently.
    *   [ ] `Implement` rent due date tracking and status validation.
    *   [ ] `Calculate` cashback eligibility and distribution logic.
    *   [ ] `Connect` Wealthsimple API for cashback deposits.
    *   [ ] `Test` fund split (Landlord 99%, Tenant 1%, Platform 1%).

---

## 4. Feature: Cashback & Investment System `(MVP)`
**Description:** Enables tenants to receive and invest cashback rewards through bank accounts or Wealthsimple integration.

### User Stories:
* [ ] **US-4.1:** As a tenant, I want to connect my Wealthsimple chequing account, so that my cashback can be invested automatically.
    *   [ ] `Integrate` Wealthsimple API for account linking.
    *   [ ] `Configure` OAuth flow for authentication.
    *   [ ] `Implement` recurring transfer functionality.

* [ ] **US-4.2:** As a tenant, I want to view my cashback history, so that I can track my savings over time.
    *   [ ] `Create` cashback transaction log schema.
    *   [ ] `Develop` cashback summary and reporting endpoint.
    *   [ ] `Design` tenant cashback dashboard component.

---

## 5. Feature: Landlord Dashboard `(MVP)`
**Description:** Provides landlords a view of rental income, tenant performance, and payout history.

### User Stories:
* [ ] **US-5.1:** As a landlord, I want to view all rent payments and cashback transactions, so that I can track rental performance.
    *   [ ] `Design` dashboard layout and data cards.
    *   [ ] `Implement` API endpoint for aggregated rent and cashback data.
    *   [ ] `Add` export/download receipt functionality.

* [ ] **US-5.2:** As a landlord, I want to monitor tenant on-time payment behavior, so that I can identify reliable tenants.
    *   [ ] `Create` tenant payment history analytics endpoint.
    *   [ ] `Implement` late payment flag system.
    *   [ ] `Display` performance metrics and trends.

---

## 6. Feature: Tenant Dashboard `(MVP)`
**Description:** Displays payment status, cashback progress, and investment tracking for tenants.

### User Stories:
* [ ] **US-6.1:** As a tenant, I want to view my rent payment history and status, so that I can ensure everything is up to date.
    *   [ ] `Develop` API to fetch all tenant payment records.
    *   [ ] `Design` payment history and status UI component.

* [ ] **US-6.2:** As a tenant, I want to download rent receipts, so that I can use them for records or tax purposes.
    *   [ ] `Create` PDF receipt generator.
    *   [ ] `Implement` download/export button on UI.

---

## 7. Feature: Property Manager Portal `(MVP)`
**Description:** Allows property managers to manage multiple landlord and tenant accounts, and automate commission distribution.

### User Stories:
* [ ] **US-7.1:** As a property manager, I want to manage multiple properties, so that I can track all transactions under my portfolio.
    *   [ ] `Design` multi-property management dashboard.
    *   [ ] `Implement` data aggregation for landlords and tenants.

* [ ] **US-7.2:** As a property manager, I want my 40% share of the 1% Renvestment fee to be automatically distributed, so that my revenue is transparent.
    *   [ ] `Develop` commission calculation engine.
    *   [ ] `Integrate` payout automation workflow.

---

## 8. Feature: Admin Panel `(MVP)`
**Description:** Allows internal Renvestment staff to manage accounts, disputes, analytics, and partnerships.

### User Stories:
* [ ] **US-8.1:** As an admin, I want to approve landlord accounts, so that only verified users can receive rent.
    *   [ ] `Create` admin approval queue.
    *   [ ] `Implement` role-based access control.

* [ ] **US-8.2:** As an admin, I want to view platform-wide analytics, so that I can monitor growth and user activity.
    *   [ ] `Implement` data aggregation for transactions and users.
    *   [ ] `Design` analytics dashboard.

---

## 9. Feature: Notifications & Communication `(MVP)`
**Description:** Keeps users informed of payment confirmations, rent due reminders, and cashback notifications via email and SMS.

### User Stories:
* [ ] **US-9.1:** As a tenant, I want to receive rent due reminders, so that I never miss a payment.
    *   [ ] `Integrate` SMS and email providers (Twilio, SendGrid).
    *   [ ] `Create` automated scheduling for rent reminders.

* [ ] **US-9.2:** As a landlord, I want to receive payment notifications, so that I know when rent has been processed.
    *   [ ] `Implement` event-driven notifications.
    *   [ ] `Configure` notification templates and triggers.

---

## 10. Feature: Security & Compliance `(MVP)`
**Description:** Ensures secure handling of user data, payment information, and compliance with financial regulations.

### User Stories:
* [ ] **US-10.1:** As a platform, I want to perform KYC verification, so that I comply with MSB and AML regulations.
    *   [ ] `Integrate` KYC provider (e.g., Stripe Identity or Trulioo).
    *   [ ] `Store` encrypted user verification results.

* [ ] **US-10.2:** As an admin, I want to manage compliance reports, so that Renvestment meets legal requirements.
    *   [ ] `Generate` compliance reports automatically.
    *   [ ] `Schedule` recurring audits and backups.

---

**End of Development Breakdown**

