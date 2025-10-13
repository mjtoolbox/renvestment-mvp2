# **📝 Proof of Concept (PoC) Application Specification**

This document serves as the primary instruction set for rapidly building the Renvestment PoC application using a Next.js (App Router) template. All development must adhere strictly to the technology stack defined in Section 6\.

## **1\. Technology & Environment Constraints**

| Component | Required Technology | Details/Configuration |
| :---- | :---- | :---- |
| **Framework** | Next.js (App Router) | All components must be built using functional React components and modern hooks. |
| **Styling** | Tailwind CSS | **Mandatory:** Use Tailwind CSS for all styling. Ensure responsive design. |
| **Database** | Vercel PostgreSQL (Mocked) | The application must be designed to connect to PostgreSQL. |
| **ORM** | Prisma or Drizzle | Use an ORM (prefer Prisma for schema definition clarity) for all database interactions. |
| **Authentication** | Auth.js (NextAuth.js) | Implement standard Credential Provider for email/password sign-in/sign-up. |
| **Deployment Target** | Vercel | API Routes must be used for all backend logic. |

## **2\. Core Data Model (Prisma Schema Reference)**

The PoC requires three main entities to validate the core flows.

// Simplified Database Schema Reference (Prisma or Drizzle equivalent)

enum UserRole {  
  LANDLORD  
  TENANT  
}

enum ContractStatus {  
  DRAFT      // Created by Landlord, not yet accepted  
  ACTIVE     // Accepted by Tenant  
  ENDED  
}

enum TransactionStatus {  
  PENDING  
  SUCCESS  
  FAILED  
}

model User {  
  id    String @id @default(uuid())  
  email String @unique  
  name  String?  
  role  UserRole @default(TENANT)  
    
  landlordContracts Contract\[\] @relation("LandlordContracts")  
  tenantContract    Contract?  @relation("TenantContract")  
  transactions      Transaction\[\]  
}

model Contract {  
  id            String @id @default(uuid())  
  landlordId    String  
  tenantId      String  
  rentAmount    Decimal  
  status        ContractStatus @default(DRAFT)  
  startDate     DateTime  
    
  landlord User @relation("LandlordContracts", fields: \[landlordId\], references: \[id\])  
  tenant   User @relation("TenantContract", fields: \[tenantId\], references: \[id\])  
  transactions Transaction\[\]  
}

model Transaction {  
  id           String @id @default(uuid())  
  contractId   String  
  amount       Decimal  
  status       TransactionStatus @default(PENDING)  
  description  String  
  mockReferenceId String // Used to track interaction with Mock API  
  createdAt    DateTime @default(now())  
    
  contract Contract @relation(fields: \[contractId\], references: \[id\])  
  user     User     @relation(fields: \[userId\], references: \[id\])  
  userId   String  
}

## **3\. Required Frontend Components & Pages**

The application must implement Role-Based Access Control (RBAC) via middleware/session checks.

### **3.1 Authentication**

| Path | Description |
| :---- | :---- |
| /login | Standard sign-in form using email/password. |
| /register | Sign-up form that includes a radio button to select UserRole (Landlord or Tenant). |
| /middleware | Implement route protection to redirect unauthenticated users to /login and role-specific users to their respective dashboards. |

### **3.2 Landlord Flow (Path: /landlord/\*)**

1. **/landlord/dashboard**: A list of all contracts created by the Landlord.  
2. **/landlord/contracts/new**: A form to create a new Contract. Inputs needed: Tenant Email (to link the tenantId), rentAmount, startDate. The contract must be saved with status: DRAFT.

### **3.3 Tenant Flow (Path: /tenant/\*)**

1. **/tenant/dashboard**:  
   * Show the Tenant's current ACTIVE contract (if any).  
   * Show any pending DRAFT contracts requiring acceptance.  
   * Include a prominent "Make Rent Payment" button that triggers the payment flow (see Section 4.2).  
2. **/tenant/contracts/\[id\]**: Page to view a DRAFT contract. Must include a **"Accept Lease & Activate"** button. Clicking this updates the Contract.status to ACTIVE.

## **4\. Required API Endpoints (Next.js Route Handlers)**

### **4.1 Internal API (Data Management)**

| Path | Method | Purpose |
| :---- | :---- | :---- |
| /api/contracts | POST | Creates a new Contract (used by Landlord form). |
| /api/contracts/\[id\]/accept | POST | Updates Contract.status to ACTIVE. |

### **4.2 External Mock Payment System (Goal: Rent Payment Simulation)**

The following APIs are crucial for the PoC. They must simulate the interaction with an external system (Stripe).

| Path | Method | Purpose | Implementation Logic (Must adhere to this) |
| :---- | :---- | :---- | :---- |
| /api/mock-payment/charge | POST | Simulates a tenant rent payment charge. | 1\. Accepts contractId and amount. 2\. Saves a Transaction with status: PENDING. 3\. Randomly determines success (90%) or failure (10%). 4\. Immediately updates the Transaction status to SUCCESS or FAILED. |
| /api/mock-payment/payout | POST | Simulates a payout to a landlord/tenant. | 1\. Accepts userId and amount. 2\. Follows the same 90%/10% success/failure logic as /charge. 3\. Records a Transaction associated with the Landlord/Tenant User ID. |

