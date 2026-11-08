import React from 'react';
import { 
  FileEdit, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Archive 
} from 'lucide-react';
import { PROPOSAL_STATUS } from '../../utils/statusTransitions';
import { formatDate } from '../../utils/formatters';

export function ProposalTimeline({ proposal }) {
  if (!proposal) return null;

  const isDraft = proposal.status === PROPOSAL_STATUS.DRAFT;
  const isSent = proposal.status === PROPOSAL_STATUS.SENT;
  const isAccepted = proposal.status === PROPOSAL_STATUS.ACCEPTED;
  const isRejected = proposal.status === PROPOSAL_STATUS.REJECTED;

  return (
    <div className="proposal-timeline-wrap">
      <h4 className="timeline-title">Proposal Lifecycle History</h4>
      <div className="timeline-steps">
        {/* Step 1: Draft */}
        <div className="timeline-step step-completed">
          <div className="step-marker">
            <FileEdit size={16} />
          </div>
          <div className="step-content">
            <div className="step-heading">
              <span className="step-name">Draft Created</span>
              <span className="step-badge done">Completed</span>
            </div>
            <div className="step-date">{formatDate(proposal.createdAt)}</div>
            <div className="step-meta">Initial proposal generated in system</div>
          </div>
        </div>

        {/* Connector */}
        <div className={`timeline-connector ${proposal.sentAt ? 'active' : 'pending'}`} />

        {/* Step 2: Sent */}
        <div className={`timeline-step ${proposal.sentAt ? 'step-completed' : 'step-waiting'}`}>
          <div className="step-marker">
            <Send size={16} />
          </div>
          <div className="step-content">
            <div className="step-heading">
              <span className="step-name">Sent to Client</span>
              {proposal.sentAt ? (
                <span className="step-badge done">Sent</span>
              ) : (
                <span className="step-badge pending">Pending</span>
              )}
            </div>
            <div className="step-date">
              {proposal.sentAt ? formatDate(proposal.sentAt) : 'Awaiting send action'}
            </div>
            <div className="step-meta">
              {proposal.sentAt
                ? `Dispatched to ${proposal.clientEmail}`
                : 'Draft must be sent to unlock client decision'}
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className={`timeline-connector ${isAccepted || isRejected ? 'active' : 'pending'}`} />

        {/* Step 3: Decision */}
        <div
          className={`timeline-step ${
            isAccepted
              ? 'step-accepted'
              : isRejected
              ? 'step-rejected'
              : 'step-waiting'
          }`}
        >
          <div className="step-marker">
            {isAccepted ? (
              <CheckCircle2 size={16} />
            ) : isRejected ? (
              <XCircle size={16} />
            ) : (
              <Clock size={16} />
            )}
          </div>
          <div className="step-content">
            <div className="step-heading">
              <span className="step-name">
                {isAccepted
                  ? 'Proposal Accepted'
                  : isRejected
                  ? 'Proposal Rejected'
                  : 'Client Decision'}
              </span>
              {isAccepted && <span className="step-badge success">Accepted</span>}
              {isRejected && <span className="step-badge danger">Rejected</span>}
              {!isAccepted && !isRejected && (
                <span className="step-badge pending">Awaiting</span>
              )}
            </div>
            <div className="step-date">
              {isAccepted
                ? formatDate(proposal.acceptedAt)
                : isRejected
                ? formatDate(proposal.rejectedAt)
                : isSent
                ? 'Client is reviewing proposal'
                : 'Not yet available'}
            </div>
            <div className="step-meta">
              {isAccepted && 'Deal finalized. Proposal locked from edits.'}
              {isRejected && 'Client declined proposal. Requires revision workflow to reopen.'}
              {!isAccepted && !isRejected && 'Requires proposal to be in Sent state first.'}
            </div>
          </div>
        </div>
      </div>

      {/* Archive Callout if archived */}
      {proposal.isArchived && (
        <div className="timeline-archive-banner">
          <Archive size={18} />
          <div>
            <strong>Archived on {formatDate(proposal.archivedAt)}</strong>
            <p>
              This proposal is soft-deleted. Its lifecycle state ({proposal.status}) is preserved and can be restored anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
