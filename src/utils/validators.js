/**
 * Validation utilities for Proposal management
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProposalData(data) {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Proposal title is required.';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  }

  if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.trim().length === 0) {
    errors.clientName = 'Client name is required.';
  } else if (data.clientName.trim().length < 2) {
    errors.clientName = 'Client name must be at least 2 characters long.';
  }

  if (!data.clientEmail || typeof data.clientEmail !== 'string' || data.clientEmail.trim().length === 0) {
    errors.clientEmail = 'Client email is required.';
  } else if (!EMAIL_REGEX.test(data.clientEmail.trim())) {
    errors.clientEmail = 'Please provide a valid email address.';
  }

  const numAmount = Number(data.amount);
  if (data.amount === undefined || data.amount === null || data.amount === '' || isNaN(numAmount)) {
    errors.amount = 'Proposal amount is required.';
  } else if (numAmount <= 0) {
    errors.amount = 'Proposal amount must be greater than zero.';
  }

  if (!data.currency || typeof data.currency !== 'string') {
    errors.currency = 'Currency is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
