import React from 'react';
import { 
  Building2, 
  Mail, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { ProposalStatusBadge } from './ProposalStatusBadge';
import { ProposalActions } from './ProposalActions';
import { ProposalTimeline } from './ProposalTimeline';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PROPOSAL_STATUS } from '../../utils/statusTransitions';

export function ProposalDetails({
  proposal,
  onEdit,
  onSend,
  onAccept,
  onReject,
  onArchive,
  onRestore,
  onClose,
}) {
  if (!proposal) return null;

  const isDraft = proposal.status === PROPOSAL_STATUS.DRAFT;
  const isFinalized = proposal.status === PROPOSAL_STATUS.ACCEPTED || proposal.status === PROPOSAL_STATUS.REJECTED;

  return (
    <div className="proposal-details-view">
      {/* Top Banner & Header */}
      <div className="details-header-card">
        <div className="details-header-main">
          <div className="details-meta-row">
            <span className="details-id-tag">ID: {proposal.id}</span>
            <ProposalStatusBadge status={proposal.status} isArchived={proposal.isArchived} size="lg" />
          </div>
          <h1 className="details-title">{proposal.title}</h1>
        </div>

        {/* Action Buttons */}
        <div className="details-header-actions">
          <ProposalActions
            proposal={proposal}
            onEdit={onEdit}
            onSend={onSend}
            onAccept={onAccept}
            onReject={onReject}
            onArchive={onArchive}
            onRestore={onRestore}
            variant="prominent"
          />
        </div>
      </div>

      {/* Constraints Notice Banner */}
      {!isDraft && !proposal.isArchived && (
        <div className="status-notice-banner">
          <Info size={18} />
          <div>
            <strong>Proposal is locked from editing.</strong>
            <span>
              {' '}Only proposals in <em>Draft</em> status can be edited. This proposal is currently in{' '}
              <strong>{proposal.status.toUpperCase()}</strong> status.
            </span>
          </div>
        </div>
      )}

      {proposal.isArchived && (
        <div className="status-notice-banner warning">
          <ShieldAlert size={18} />
          <div>
            <strong>This proposal is currently archived.</strong>
            <span>
              {' '}It is soft-deleted and hidden from active listings. Click "Restore Proposal" above to reactivate it.
            </span>
          </div>
        </div>
      )}

      {/* Grid: Client & Financial Info */}
      <div className="details-grid-2">
        {/* Client Card */}
        <div className="details-card">
          <div className="card-header">
            <Building2 size={18} className="card-header-icon" />
            <h3 className="card-title">Client Information</h3>
          </div>
          <div className="card-content-list">
            <div className="info-row">
              <span className="info-label">Client Name:</span>
              <span className="info-val strong">{proposal.clientName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact Email:</span>
              <a href={`mailto:${proposal.clientEmail}`} className="info-val link">
                <Mail size={14} />
                {proposal.clientEmail}
              </a>
            </div>
            <div className="info-row">
              <span className="info-label">Created At:</span>
              <span className="info-val">
                <Calendar size={14} />
                {formatDate(proposal.createdAt)}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-val">
                <Clock size={14} />
                {formatDate(proposal.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Terms Card */}
        <div className="details-card">
          <div className="card-header">
            <DollarSign size={18} className="card-header-icon" />
            <h3 className="card-title">Financial Scope</h3>
          </div>
          <div className="card-financial-highlight">
            <div className="financial-amount">
              {formatCurrency(proposal.amount, proposal.currency)}
            </div>
            <div className="financial-currency">Currency: {proposal.currency}</div>
          </div>
          <div className="financial-lifecycle-meta">
            <div className="financial-row">
              <span>Status:</span>
              <strong className="capitalize">{proposal.status}</strong>
            </div>
            <div className="financial-row">
              <span>Sent At:</span>
              <span>{proposal.sentAt ? formatDate(proposal.sentAt) : 'Not sent yet'}</span>
            </div>
            {proposal.acceptedAt && (
              <div className="financial-row text-success">
                <span>Accepted At:</span>
                <span>{formatDate(proposal.acceptedAt)}</span>
              </div>
            )}
            {proposal.rejectedAt && (
              <div className="financial-row text-danger">
                <span>Rejected At:</span>
                <span>{formatDate(proposal.rejectedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scope / Description Card */}
      <div className="details-card">
        <div className="card-header">
          <FileText size={18} className="card-header-icon" />
          <h3 className="card-title">Proposal Scope & Description</h3>
        </div>
        <div className="card-description-body">
          {proposal.description ? (
            <p className="description-text">{proposal.description}</p>
          ) : (
            <p className="description-empty">No detailed description was provided for this proposal.</p>
          )}
        </div>
      </div>

      {/* Lifecycle Stepper / Timeline */}
      <ProposalTimeline proposal={proposal} />
    </div>
  );
}
