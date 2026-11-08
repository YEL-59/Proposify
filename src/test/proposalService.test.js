import { describe, it, expect, beforeEach } from 'vitest';
import { proposalService } from '../services/proposalService';
import { storageService } from '../services/storageService';
import { PROPOSAL_STATUS, validateStatusTransition } from '../utils/statusTransitions';

describe('Proposal Lifecycle & Service Tests (12 Required Scenarios)', () => {
  beforeEach(() => {
    storageService.clearAllForTesting();
  });

  const sampleData = {
    title: 'Enterprise AI Strategy Consulting',
    description: 'Roadmap and architecture definition for internal LLM deployment.',
    clientName: 'Acme Corporation',
    clientEmail: 'billing@acme.com',
    amount: 25000,
    currency: 'USD',
  };

  // Scenario 1: Create a proposal
  it('Scenario 1: Creates a new proposal successfully with all required fields', async () => {
    const proposal = await proposalService.create(sampleData);

    expect(proposal).toBeDefined();
    expect(proposal.id).toBeDefined();
    expect(proposal.title).toBe(sampleData.title);
    expect(proposal.clientName).toBe(sampleData.clientName);
    expect(proposal.clientEmail).toBe(sampleData.clientEmail);
    expect(proposal.amount).toBe(25000);
    expect(proposal.currency).toBe('USD');
    expect(proposal.isArchived).toBe(false);
    expect(proposal.createdAt).toBeDefined();
    expect(proposal.updatedAt).toBeDefined();
  });

  // Scenario 2: Verify default Draft status
  it('Scenario 2: Verifies default status is strictly "draft"', async () => {
    const proposal = await proposalService.create(sampleData);

    expect(proposal.status).toBe(PROPOSAL_STATUS.DRAFT);
    expect(proposal.sentAt).toBeNull();
    expect(proposal.acceptedAt).toBeNull();
    expect(proposal.rejectedAt).toBeNull();
    expect(proposal.archivedAt).toBeNull();
  });

  // Scenario 3: Edit a Draft proposal
  it('Scenario 3: Successfully edits a Draft proposal and updates timestamps', async () => {
    const created = await proposalService.create(sampleData);
    const originalUpdatedAt = created.updatedAt;

    // Small delay to ensure timestamp progression
    await new Promise((r) => setTimeout(r, 10));

    const updated = await proposalService.update(created.id, {
      title: 'Enterprise AI Strategy Consulting - Revised',
      amount: 30000,
      description: 'Expanded scope to include fine-tuning evaluation.',
    });

    expect(updated.title).toBe('Enterprise AI Strategy Consulting - Revised');
    expect(updated.amount).toBe(30000);
    expect(updated.status).toBe(PROPOSAL_STATUS.DRAFT);
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(originalUpdatedAt).getTime());
  });

  // Scenario 4: Send a Draft proposal
  it('Scenario 4: Transitions Draft -> Sent and records sentAt timestamp', async () => {
    const created = await proposalService.create(sampleData);
    expect(created.status).toBe(PROPOSAL_STATUS.DRAFT);
    expect(created.sentAt).toBeNull();

    const sent = await proposalService.send(created.id);

    expect(sent.status).toBe(PROPOSAL_STATUS.SENT);
    expect(sent.sentAt).toBeDefined();
    expect(typeof sent.sentAt).toBe('string');
  });

  // Scenario 5: Accept a Sent proposal
  it('Scenario 5: Transitions Sent -> Accepted and records acceptedAt timestamp', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.send(created.id);

    const accepted = await proposalService.accept(created.id);

    expect(accepted.status).toBe(PROPOSAL_STATUS.ACCEPTED);
    expect(accepted.acceptedAt).toBeDefined();
    expect(typeof accepted.acceptedAt).toBe('string');
  });

  // Scenario 6: Reject a Sent proposal
  it('Scenario 6: Transitions Sent -> Rejected and records rejectedAt timestamp', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.send(created.id);

    const rejected = await proposalService.reject(created.id);

    expect(rejected.status).toBe(PROPOSAL_STATUS.REJECTED);
    expect(rejected.rejectedAt).toBeDefined();
    expect(typeof rejected.rejectedAt).toBe('string');
  });

  // Scenario 7: Prevent invalid transitions
  it('Scenario 7: Strictly prevents invalid lifecycle transitions', async () => {
    const created = await proposalService.create(sampleData);

    // 7a: Cannot accept directly from Draft (must be Sent first)
    await expect(proposalService.accept(created.id)).rejects.toThrow(
      'A draft proposal must be sent before it can be accepted or rejected.'
    );

    // 7b: Cannot reject directly from Draft
    await expect(proposalService.reject(created.id)).rejects.toThrow(
      'A draft proposal must be sent before it can be accepted or rejected.'
    );

    // Send the proposal
    await proposalService.send(created.id);

    // 7c: Cannot send an already sent proposal
    await expect(proposalService.send(created.id)).rejects.toThrow(
      'Proposal is already in "sent" status.'
    );

    // Accept the proposal
    await proposalService.accept(created.id);

    // 7d: Accepted proposal cannot be sent again or rejected
    await expect(proposalService.send(created.id)).rejects.toThrow(
      'Accepted proposals are finalized and cannot be modified or re-sent.'
    );
    await expect(proposalService.reject(created.id)).rejects.toThrow(
      'Accepted proposals are finalized and cannot be modified or re-sent.'
    );
  });

  // Scenario 8: Archive a proposal (soft delete)
  it('Scenario 8: Archives a proposal with soft-delete without removing data', async () => {
    const created = await proposalService.create(sampleData);
    const archived = await proposalService.archive(created.id);

    expect(archived.isArchived).toBe(true);
    expect(archived.archivedAt).toBeDefined();
    expect(archived.status).toBe(PROPOSAL_STATUS.DRAFT);

    // Should NOT appear in active listing
    const activeList = await proposalService.getAll({ includeArchived: false });
    expect(activeList.some((p) => p.id === created.id)).toBe(false);

    // Should appear in archive listing
    const archivedList = await proposalService.getAll({ includeArchived: true });
    expect(archivedList.some((p) => p.id === created.id)).toBe(true);
  });

  // Scenario 9: Verify archived proposals remain stored in database
  it('Scenario 9: Verifies archived proposals remain stored and persist in storage', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.archive(created.id);

    // Inspect underlying raw storage
    const rawStorage = storageService.load();
    const storedItem = rawStorage.find((p) => p.id === created.id);

    expect(storedItem).toBeDefined();
    expect(storedItem.id).toBe(created.id);
    expect(storedItem.isArchived).toBe(true);
    expect(storedItem.title).toBe(sampleData.title);
  });

  // Scenario 10: Restore an archived proposal
  it('Scenario 10: Successfully restores an archived proposal to active list', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.archive(created.id);

    const restored = await proposalService.restore(created.id);

    expect(restored.isArchived).toBe(false);
    expect(restored.archivedAt).toBeNull();

    // Verify it reappears in active list
    const activeList = await proposalService.getAll({ includeArchived: false });
    expect(activeList.some((p) => p.id === created.id)).toBe(true);
  });

  // Scenario 11: Verify original status is preserved on restore
  it('Scenario 11: Verifies original status (e.g. "sent") is preserved when restored', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.send(created.id); // Status is 'sent'

    // Archive it while 'sent'
    const archived = await proposalService.archive(created.id);
    expect(archived.status).toBe(PROPOSAL_STATUS.SENT);

    // Restore it
    const restored = await proposalService.restore(created.id);

    // Status MUST remain 'sent'
    expect(restored.status).toBe(PROPOSAL_STATUS.SENT);
    expect(restored.isArchived).toBe(false);

    // Now it should still be allowed to transition to Accepted!
    const accepted = await proposalService.accept(restored.id);
    expect(accepted.status).toBe(PROPOSAL_STATUS.ACCEPTED);
  });

  // Scenario 12: Verify unauthorized / invalid actions are blocked
  it('Scenario 12: Blocks editing finalized proposals and invalid operations', async () => {
    const created = await proposalService.create(sampleData);
    await proposalService.send(created.id);

    // 12a: Cannot edit a Sent proposal (only Draft can be edited)
    await expect(
      proposalService.update(created.id, { title: 'Unauthorized Modification' })
    ).rejects.toThrow('Proposals with status "sent" cannot be edited. Only Draft proposals are editable.');

    // Accept it
    await proposalService.accept(created.id);

    // 12b: Cannot edit an Accepted proposal
    await expect(
      proposalService.update(created.id, { title: 'Post-Accept Modification' })
    ).rejects.toThrow('Proposals with status "accepted" cannot be edited. Only Draft proposals are editable.');

    // Archive it
    await proposalService.archive(created.id);

    // 12c: Cannot edit an archived proposal
    await expect(
      proposalService.update(created.id, { title: 'Archived Edit' })
    ).rejects.toThrow('Archived proposals cannot be edited. Restore the proposal first.');

    // 12d: Cannot send an archived proposal
    await expect(proposalService.send(created.id)).rejects.toThrow(
      'Archived proposals cannot be sent. Restore the proposal first.'
    );
  });
});
