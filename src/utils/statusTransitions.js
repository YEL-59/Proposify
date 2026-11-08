/**
 * Status Lifecycle Engine
 * Supported statuses: draft, sent, accepted, rejected
 * 
 * Rules:
 * - New proposals start as 'draft'
 * - Draft can transition to 'sent'
 * - Sent can transition to 'accepted' or 'rejected'
 * - Accepted and Rejected are terminal states (no arbitrary transitions)
 * - Editing is ONLY allowed for 'draft' proposals
 */

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  [PROPOSAL_STATUS.DRAFT]: 'Draft',
  [PROPOSAL_STATUS.SENT]: 'Sent',
  [PROPOSAL_STATUS.ACCEPTED]: 'Accepted',
  [PROPOSAL_STATUS.REJECTED]: 'Rejected',
};

export const ALLOWED_TRANSITIONS = {
  [PROPOSAL_STATUS.DRAFT]: [PROPOSAL_STATUS.SENT],
  [PROPOSAL_STATUS.SENT]: [PROPOSAL_STATUS.ACCEPTED, PROPOSAL_STATUS.REJECTED],
  [PROPOSAL_STATUS.ACCEPTED]: [],
  [PROPOSAL_STATUS.REJECTED]: [],
};

/**
 * Validates if moving from currentStatus to nextStatus is permissible.
 * @param {string} currentStatus 
 * @param {string} nextStatus 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateStatusTransition(currentStatus, nextStatus) {
  if (!currentStatus || !nextStatus) {
    return { valid: false, error: 'Current status and target status are required.' };
  }

  if (currentStatus === nextStatus) {
    return { valid: false, error: `Proposal is already in "${currentStatus}" status.` };
  }

  const validTargets = ALLOWED_TRANSITIONS[currentStatus];
  if (!validTargets) {
    return { valid: false, error: `Unknown status "${currentStatus}".` };
  }

  if (!validTargets.includes(nextStatus)) {
    if (currentStatus === PROPOSAL_STATUS.ACCEPTED) {
      return { valid: false, error: 'Accepted proposals are finalized and cannot be modified or re-sent.' };
    }
    if (currentStatus === PROPOSAL_STATUS.REJECTED) {
      return { valid: false, error: 'Rejected proposals cannot be transitioned without an explicit revision workflow.' };
    }
    if (currentStatus === PROPOSAL_STATUS.DRAFT && (nextStatus === PROPOSAL_STATUS.ACCEPTED || nextStatus === PROPOSAL_STATUS.REJECTED)) {
      return { valid: false, error: 'A draft proposal must be sent before it can be accepted or rejected.' };
    }
    return { valid: false, error: `Invalid transition from "${currentStatus}" to "${nextStatus}".` };
  }

  return { valid: true };
}

/**
 * Checks if a proposal can be edited based on its status and archive state.
 * @param {Object} proposal 
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function canEditProposal(proposal) {
  if (!proposal) return { allowed: false, reason: 'Proposal not found.' };
  if (proposal.isArchived) {
    return { allowed: false, reason: 'Archived proposals cannot be edited. Restore the proposal first.' };
  }
  if (proposal.status !== PROPOSAL_STATUS.DRAFT) {
    return { 
      allowed: false, 
      reason: `Proposals with status "${proposal.status}" cannot be edited. Only Draft proposals are editable.` 
    };
  }
  return { allowed: true };
}

/**
 * Returns available next status actions for a proposal.
 * @param {Object} proposal 
 * @returns {Array<string>}
 */
export function getAvailableActions(proposal) {
  if (!proposal || proposal.isArchived) return [];
  return ALLOWED_TRANSITIONS[proposal.status] || [];
}
