/**
 * Proposal Business Service
 * Encapsulates all domain logic, lifecycle transitions, validations, and storage operations.
 */

import { 
  PROPOSAL_STATUS, 
  validateStatusTransition, 
  canEditProposal 
} from '../utils/statusTransitions';
import { validateProposalData } from '../utils/validators';
import { storageService } from './storageService';

function generateId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `prop-${timestamp}-${randomStr}`;
}

export const proposalService = {
  /**
   * Retrieves all proposals, filtered by active/archived state, status, and search query.
   */
  async getAll({ includeArchived = false, status = 'all', search = '' } = {}) {
    // Simulated micro-delay for realistic async behavior
    await new Promise((resolve) => setTimeout(resolve, 50));

    const proposals = storageService.load();

    return proposals
      .filter((p) => {
        // Filter active vs archived
        if (includeArchived) {
          if (!p.isArchived) return false;
        } else {
          if (p.isArchived) return false;
        }

        // Filter by status
        if (status && status !== 'all') {
          if (p.status !== status) return false;
        }

        // Filter by search query
        if (search && search.trim()) {
          const query = search.trim().toLowerCase();
          const matchTitle = (p.title || '').toLowerCase().includes(query);
          const matchClient = (p.clientName || '').toLowerCase().includes(query);
          const matchEmail = (p.clientEmail || '').toLowerCase().includes(query);
          if (!matchTitle && !matchClient && !matchEmail) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  /**
   * Fetch a single proposal by ID
   */
  async getById(id) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const proposals = storageService.load();
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }
    return { ...proposal };
  },

  /**
   * Create a new proposal.
   * Enforces default status: 'draft'.
   */
  async create(data) {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const validation = validateProposalData(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError || 'Invalid proposal data provided.');
    }

    const now = new Date().toISOString();
    const newProposal = {
      id: generateId(),
      title: data.title.trim(),
      description: (data.description || '').trim(),
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim(),
      amount: Number(data.amount),
      currency: (data.currency || 'USD').toUpperCase(),
      status: PROPOSAL_STATUS.DRAFT, // Enforce default Draft
      createdAt: now,
      updatedAt: now,
      sentAt: null,
      acceptedAt: null,
      rejectedAt: null,
      archivedAt: null,
      isArchived: false,
    };

    const proposals = storageService.load();
    proposals.unshift(newProposal);
    storageService.save(proposals);

    return { ...newProposal };
  },

  /**
   * Edit an existing proposal.
   * Only allowed for proposals in 'draft' status.
   */
  async update(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const existing = proposals[index];

    // Verify edit permissions
    const editCheck = canEditProposal(existing);
    if (!editCheck.allowed) {
      throw new Error(editCheck.reason);
    }

    // Validate payload
    const mergedData = {
      title: updates.title !== undefined ? updates.title : existing.title,
      description: updates.description !== undefined ? updates.description : existing.description,
      clientName: updates.clientName !== undefined ? updates.clientName : existing.clientName,
      clientEmail: updates.clientEmail !== undefined ? updates.clientEmail : existing.clientEmail,
      amount: updates.amount !== undefined ? updates.amount : existing.amount,
      currency: updates.currency !== undefined ? updates.currency : existing.currency,
    };

    const validation = validateProposalData(mergedData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError || 'Invalid proposal data provided.');
    }

    const updatedProposal = {
      ...existing,
      title: mergedData.title.trim(),
      description: mergedData.description.trim(),
      clientName: mergedData.clientName.trim(),
      clientEmail: mergedData.clientEmail.trim(),
      amount: Number(mergedData.amount),
      currency: mergedData.currency.toUpperCase(),
      updatedAt: new Date().toISOString(),
    };

    proposals[index] = updatedProposal;
    storageService.save(proposals);

    return { ...updatedProposal };
  },

  /**
   * Transition proposal status from 'draft' -> 'sent'
   */
  async send(id) {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const proposal = proposals[index];
    if (proposal.isArchived) {
      throw new Error('Archived proposals cannot be sent. Restore the proposal first.');
    }

    const check = validateStatusTransition(proposal.status, PROPOSAL_STATUS.SENT);
    if (!check.valid) {
      throw new Error(check.error);
    }

    const now = new Date().toISOString();
    const updated = {
      ...proposal,
      status: PROPOSAL_STATUS.SENT,
      sentAt: now,
      updatedAt: now,
    };

    proposals[index] = updated;
    storageService.save(proposals);

    return { ...updated };
  },

  /**
   * Transition proposal status from 'sent' -> 'accepted'
   */
  async accept(id) {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const proposal = proposals[index];
    if (proposal.isArchived) {
      throw new Error('Archived proposals cannot be accepted. Restore the proposal first.');
    }

    const check = validateStatusTransition(proposal.status, PROPOSAL_STATUS.ACCEPTED);
    if (!check.valid) {
      throw new Error(check.error);
    }

    const now = new Date().toISOString();
    const updated = {
      ...proposal,
      status: PROPOSAL_STATUS.ACCEPTED,
      acceptedAt: now,
      updatedAt: now,
    };

    proposals[index] = updated;
    storageService.save(proposals);

    return { ...updated };
  },

  /**
   * Transition proposal status from 'sent' -> 'rejected'
   */
  async reject(id) {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const proposal = proposals[index];
    if (proposal.isArchived) {
      throw new Error('Archived proposals cannot be rejected. Restore the proposal first.');
    }

    const check = validateStatusTransition(proposal.status, PROPOSAL_STATUS.REJECTED);
    if (!check.valid) {
      throw new Error(check.error);
    }

    const now = new Date().toISOString();
    const updated = {
      ...proposal,
      status: PROPOSAL_STATUS.REJECTED,
      rejectedAt: now,
      updatedAt: now,
    };

    proposals[index] = updated;
    storageService.save(proposals);

    return { ...updated };
  },

  /**
   * Archive proposal (soft delete).
   * Permanent deletion is strictly prohibited!
   * Preserves existing status and records archivedAt.
   */
  async archive(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const proposal = proposals[index];
    if (proposal.isArchived) {
      throw new Error('Proposal is already archived.');
    }

    const now = new Date().toISOString();
    const updated = {
      ...proposal,
      isArchived: true,
      archivedAt: now,
      updatedAt: now,
    };

    proposals[index] = updated;
    storageService.save(proposals);

    return { ...updated };
  },

  /**
   * Restore an archived proposal back to active status.
   * Preserves the original proposal status prior to archiving.
   */
  async restore(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const proposals = storageService.load();
    const index = proposals.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proposal with ID "${id}" was not found.`);
    }

    const proposal = proposals[index];
    if (!proposal.isArchived) {
      throw new Error('Proposal is already active.');
    }

    const now = new Date().toISOString();
    const updated = {
      ...proposal,
      isArchived: false,
      archivedAt: null,
      updatedAt: now,
      // Original status (draft/sent/accepted/rejected) is preserved!
    };

    proposals[index] = updated;
    storageService.save(proposals);

    return { ...updated };
  },

  /**
   * Dashboard statistics
   */
  async getStats() {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const proposals = storageService.load();

    const active = proposals.filter((p) => !p.isArchived);
    const archived = proposals.filter((p) => p.isArchived);

    const draft = active.filter((p) => p.status === PROPOSAL_STATUS.DRAFT).length;
    const sent = active.filter((p) => p.status === PROPOSAL_STATUS.SENT).length;
    const accepted = active.filter((p) => p.status === PROPOSAL_STATUS.ACCEPTED).length;
    const rejected = active.filter((p) => p.status === PROPOSAL_STATUS.REJECTED).length;

    const totalActiveValue = active.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const pipelineValue = active
      .filter((p) => p.status === PROPOSAL_STATUS.SENT)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const acceptedValue = active
      .filter((p) => p.status === PROPOSAL_STATUS.ACCEPTED)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalActive: active.length,
      draft,
      sent,
      accepted,
      rejected,
      archived: archived.length,
      totalActiveValue,
      pipelineValue,
      acceptedValue,
    };
  },

  /**
   * Reset store to initial seed data for demo/testing convenience
   */
  async resetDemoData() {
    await new Promise((resolve) => setTimeout(resolve, 60));
    storageService.reset();
    return this.getAll();
  }
};
