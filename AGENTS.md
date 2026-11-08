# Proposal Lifecycle Management System

## 1. Project Objective

Implement a clean, reliable proposal lifecycle management system within the application.

The primary objective is to manage proposals through four statuses:
1. Draft
2. Sent
3. Accepted
4. Rejected

The system strictly supports archiving or soft deletion. Permanent deletion (hard delete) is strictly prohibited.

## 2. Core Business Requirements

### Proposal Status Lifecycle
Every proposal must have one of the following statuses:
- `draft`
- `sent`
- `accepted`
- `rejected`

Expected workflow:
- Draft → Sent → Accepted
- Draft → Sent → Rejected

### Status Rules
- New proposals must start with `draft` status.
- Draft proposals can be edited.
- Draft proposals can be sent (transitions to `sent`, recording `sentAt`).
- Sent proposals can be accepted (transitions to `accepted`, recording `acceptedAt`) or rejected (transitions to `rejected`, recording `rejectedAt`).
- Accepted proposals cannot be sent again or edited.
- Rejected proposals cannot be accepted without an explicitly supported revision workflow.
- Invalid status transitions must be prevented with explicit errors.
- Every status change must update the `updatedAt` timestamp.
- Arbitrary status changes are strictly forbidden.

## 3. Proposal Data Model

Each proposal contains the following fields:
- `id`: Unique identifier string
- `title`: Proposal title (string)
- `description`: Detailed proposal summary / scope (string)
- `clientName`: Client full name or company (string)
- `clientEmail`: Client email address (validated email string)
- `amount`: Proposal value (positive number)
- `currency`: Currency code (e.g. `USD`, `EUR`, `GBP`, `CAD`, `AUD`)
- `status`: `'draft'` | `'sent'` | `'accepted'` | `'rejected'`
- `createdAt`: ISO 8601 timestamp string
- `updatedAt`: ISO 8601 timestamp string
- `sentAt`: ISO 8601 timestamp string | null
- `acceptedAt`: ISO 8601 timestamp string | null
- `rejectedAt`: ISO 8601 timestamp string | null
- `archivedAt`: ISO 8601 timestamp string | null
- `isArchived`: Boolean flag indicating soft-delete/archived status

## 4. Archiving and Soft Delete

Permanent database deletion is **strictly prohibited**.

Architecture:
- `isArchived`: Boolean (`false` for active, `true` for archived)
- `archivedAt`: ISO timestamp | null

Rules:
- Users can archive active proposals at any status.
- Archived proposals are excluded from active proposal listings and dashboard active totals.
- Archived proposals remain persisted in the persistent storage layer.
- Users can browse archived proposals in the dedicated Archived Proposals section.
- Restore functionality is fully supported: restoring an archived proposal preserves its original pre-archived status (`draft`, `sent`, `accepted`, or `rejected`) while resetting `isArchived` to `false` and `archivedAt` to `null`.
- Never execute a destructive `delete` or hard wipe.

## 5. Required Features

1. **Proposal Listing**:
   - Filter active proposals by status (`all`, `draft`, `sent`, `accepted`, `rejected`).
   - Real-time search across titles, client names, and client emails.
   - Comprehensive metric cards (Total Active, Draft, Sent, Accepted, Rejected, Pipeline Value, Archived count).
   - Formatted currency, created, and updated timestamps.
2. **Create Proposal**:
   - Modal form validating title, client name, email format, and positive amount.
   - Initial status automatically enforced as `draft`.
3. **Edit Proposal**:
   - Only permitted for proposals in `draft` status.
   - Finalized or sent proposals are locked from editing.
4. **Send Proposal**:
   - Transition: `draft` → `sent`.
   - Records `sentAt` timestamp.
   - Blocks sending if not currently `draft`.
5. **Accept Proposal**:
   - Transition: `sent` → `accepted`.
   - Records `acceptedAt` timestamp.
   - Blocks accepting if not currently `sent`.
6. **Reject Proposal**:
   - Transition: `sent` → `rejected`.
   - Records `rejectedAt` timestamp.
   - Blocks rejecting if not currently `sent`.
7. **Archive Proposal**:
   - Transition: marks `isArchived: true` and sets `archivedAt`.
   - Requires confirmation dialog to prevent accidental clicks.
8. **Restore Proposal**:
   - Restores an archived proposal back to the active list while preserving original status.

## 6. Testing Scenarios

1. Create a proposal.
2. Verify default Draft status.
3. Edit a Draft proposal.
4. Send a Draft proposal.
5. Accept a Sent proposal.
6. Reject a Sent proposal.
7. Prevent invalid transitions.
8. Archive a proposal.
9. Verify archived proposals remain stored.
10. Restore an archived proposal.
11. Verify original status is preserved.
12. Verify unauthorized / invalid actions are blocked.
