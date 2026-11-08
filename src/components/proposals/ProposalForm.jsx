import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { validateProposalData } from '../../utils/validators';

const CURRENCIES = [
  { code: 'USD', label: 'USD ($) - US Dollar' },
  { code: 'EUR', label: 'EUR (€) - Euro' },
  { code: 'GBP', label: 'GBP (£) - British Pound' },
  { code: 'CAD', label: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', label: 'AUD ($) - Australian Dollar' },
];

export function ProposalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    amount: '',
    currency: 'USD',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        clientName: initialData.clientName || '',
        clientEmail: initialData.clientEmail || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        currency: initialData.currency || 'USD',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        clientName: '',
        clientEmail: '',
        amount: '',
        currency: 'USD',
        description: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // Validate if field has been touched
    if (touched[name]) {
      const validation = validateProposalData(nextFormData);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateProposalData(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validation.errors[name] || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      title: true,
      clientName: true,
      clientEmail: true,
      amount: true,
      currency: true,
    });

    const validation = validateProposalData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save proposal.',
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Draft Proposal' : 'Create New Proposal'}
      subtitle={
        isEditing
          ? 'Modify proposal details before submitting to client.'
          : 'New proposals are created in Draft status and can be sent to clients when ready.'
      }
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit} className="proposal-form" noValidate>
        {errors.form && (
          <div className="form-alert error" role="alert">
            {errors.form}
          </div>
        )}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="prop-title" className="form-label">
            Proposal Title <span className="required">*</span>
          </label>
          <input
            id="prop-title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Cloud Infrastructure Migration & Security"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            autoFocus
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        {/* Client details grid */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="prop-client-name" className="form-label">
              Client Name / Organization <span className="required">*</span>
            </label>
            <input
              id="prop-client-name"
              name="clientName"
              type="text"
              className={`form-input ${errors.clientName ? 'is-invalid' : ''}`}
              placeholder="e.g. Acme Corporation"
              value={formData.clientName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
            {errors.clientName && <span className="field-error">{errors.clientName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="prop-client-email" className="form-label">
              Client Contact Email <span className="required">*</span>
            </label>
            <input
              id="prop-client-email"
              name="clientEmail"
              type="email"
              className={`form-input ${errors.clientEmail ? 'is-invalid' : ''}`}
              placeholder="e.g. contact@acme.com"
              value={formData.clientEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
            {errors.clientEmail && <span className="field-error">{errors.clientEmail}</span>}
          </div>
        </div>

        {/* Amount & Currency grid */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="prop-amount" className="form-label">
              Proposal Amount <span className="required">*</span>
            </label>
            <input
              id="prop-amount"
              name="amount"
              type="number"
              min="0.01"
              step="any"
              className={`form-input ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="prop-currency" className="form-label">
              Currency
            </label>
            <select
              id="prop-currency"
              name="currency"
              className="form-select"
              value={formData.currency}
              onChange={handleChange}
              disabled={isLoading}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description / Scope */}
        <div className="form-group">
          <label htmlFor="prop-desc" className="form-label">
            Scope & Deliverables Description
          </label>
          <textarea
            id="prop-desc"
            name="description"
            rows="4"
            className="form-textarea"
            placeholder="Outline project deliverables, timeline milestones, and deliverables scope..."
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {/* Status notice */}
        <div className="form-info-callout">
          <span className="info-icon">ℹ</span>
          <span>
            {isEditing
              ? 'Draft changes are saved immediately. Status remains Draft until sent.'
              : 'This proposal will be initialized with Draft status. You can review and edit before sending.'}
          </span>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Proposal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
