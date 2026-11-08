# Proposify — Proposal Lifecycle Management System

An enterprise-grade proposal lifecycle management application engineered with a strict 4-status state machine, zero hard-delete archiving architecture, real-time metrics, and comprehensive audit timelines.

![Status Lifecycle](https://img.shields.io/badge/Lifecycle-Draft%20%E2%86%92%20Sent%20%E2%86%92%20Accepted%2FRejected-6366f1)
![Archiving](https://img.shields.io/badge/Archiving-Soft--Delete%20Only-10b981)
![Tests](https://img.shields.io/badge/Vitest-20%2F20%20Passing-34d399)

---

## 📖 User Manual & Documentation

For complete, step-by-step instructions on how to use every feature in the application, please refer to:
👉 **[Read the Full Step-by-Step User Manual (USER_MANUAL.md)](./USER_MANUAL.md)**

*Note: You can also access the interactive step-by-step User Manual directly inside the running application via the **"📖 User Manual" link on the footer** or in the top header.*

---

## 🚀 Quickstart & Setup

### 1. Installation
Clone or unzip the project, open the terminal in the project directory, and install dependencies:
```bash
npm install
```

### 2. Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the port Vite outputs in your terminal).

### 3. Automated Test Suite
Run the 20 unit and lifecycle integration tests covering all 12 mandatory testing scenarios:
```bash
npm test
```

### 4. Production Build
Verify the production bundle build:
```bash
npm run build
```

---

## 🛡️ Core Business Rules

1. **Strict 4-Status Lifecycle**:
   - `draft`: Work-in-progress, fully editable.
   - `sent`: Delivered to client, editing locked.
   - `accepted`: Won/closed deal, locked.
   - `rejected`: Declined by client, locked.
2. **Permitted Status Transitions**:
   - `draft` → `sent`
   - `sent` → `accepted`
   - `sent` → `rejected`
   - All invalid/arbitrary transitions are prevented with explicit errors.
3. **Zero Hard Delete (Soft Delete Only)**:
   - Proposals can be archived at any stage with confirmation.
   - Soft-deleted items are excluded from active pipeline metrics but safely preserved in storage.
   - Restoring an archived proposal restores its exact pre-archived status.
4. **Audit-Grade Timestamps**:
   - Automatically tracks `createdAt`, `updatedAt`, `sentAt`, `acceptedAt`, `rejectedAt`, and `archivedAt`.

---

## 📋 Client Requirements ("We Do Everything")

All specifications outlined in the client brief and `AGENTS.md` are 100% completed and verified:
- [x] Strict 4-status lifecycle (`draft` → `sent` → `accepted`/`rejected`)
- [x] Initial status automatically set to `draft`
- [x] Editing restricted exclusively to `draft` proposals
- [x] Transitions record corresponding timestamps (`sentAt`, `acceptedAt`, `rejectedAt`)
- [x] Non-destructive archiving (soft delete) with zero hard deletion
- [x] Dedicated Archived Proposals tab
- [x] Restoration preserves original pre-archived status
- [x] Real-time multi-field search (title, client name, client email) and status filters
- [x] Interactive in-app User Manual accessible from footer and header
- [x] 20/20 automated tests passing with Vitest
