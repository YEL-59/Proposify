import React from 'react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  FileEdit, 
  Archive, 
  RotateCcw, 
  Eye 
} from 'lucide-react';
import { PROPOSAL_STATUS } from '../../utils/statusTransitions';

export function ProposalActions({
  proposal,
  onView,
  onEdit,
  onSend,
  onAccept,
  onReject,
  onArchive,
  onRestore,
  variant = 'compact', // 'compact' for list/table row, 'prominent' for details view
}) {
  if (!proposal) return null;

  const isArchived = Boolean(proposal.isArchived);
  const status = proposal.status;

  // Compact variant for cards and tables
  if (variant === 'compact') {
    return (
      <div className="proposal-actions compact" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <button
            type="button"
            className="action-btn action-view"
            title="View Details"
            onClick={() => onView(proposal)}
            aria-label="View Details"
          >
            <Eye size={15} />
          </button>
        )}

        {isArchived ? (
          onRestore && (
            <button
              type="button"
              className="action-btn action-restore"
              title="Restore to Active"
              onClick={() => onRestore(proposal)}
              aria-label="Restore"
            >
              <RotateCcw size={15} />
            </button>
          )
        ) : (
          <>
            {status === PROPOSAL_STATUS.DRAFT && (
              <>
                {onEdit && (
                  <button
                    type="button"
                    className="action-btn action-edit"
                    title="Edit Draft"
                    onClick={() => onEdit(proposal)}
                    aria-label="Edit"
                  >
                    <FileEdit size={15} />
                  </button>
                )}
                {onSend && (
                  <button
                    type="button"
                    className="action-btn action-send"
                    title="Send Proposal"
                    onClick={() => onSend(proposal)}
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                )}
              </>
            )}

            {status === PROPOSAL_STATUS.SENT && (
              <>
                {onAccept && (
                  <button
                    type="button"
                    className="action-btn action-accept"
                    title="Accept Proposal"
                    onClick={() => onAccept(proposal)}
                    aria-label="Accept"
                  >
                    <CheckCircle2 size={15} />
                  </button>
                )}
                {onReject && (
                  <button
                    type="button"
                    className="action-btn action-reject"
                    title="Reject Proposal"
                    onClick={() => onReject(proposal)}
                    aria-label="Reject"
                  >
                    <XCircle size={15} />
                  </button>
                )}
              </>
            )}

            {onArchive && (
              <button
                type="button"
                className="action-btn action-archive"
                title="Archive (Soft Delete)"
                onClick={() => onArchive(proposal)}
                aria-label="Archive"
              >
                <Archive size={15} />
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // Prominent variant for ProposalDetails page/modal
  return (
    <div className="proposal-actions prominent">
      {isArchived ? (
        onRestore && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onRestore(proposal)}
          >
            <RotateCcw size={16} />
            Restore Proposal
          </button>
        )
      ) : (
        <>
          {status === PROPOSAL_STATUS.DRAFT && (
            <>
              {onEdit && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onEdit(proposal)}
                >
                  <FileEdit size={16} />
                  Edit Draft
                </button>
              )}
              {onSend && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onSend(proposal)}
                >
                  <Send size={16} />
                  Send to Client
                </button>
              )}
            </>
          )}

          {status === PROPOSAL_STATUS.SENT && (
            <>
              {onReject && (
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={() => onReject(proposal)}
                >
                  <XCircle size={16} />
                  Mark as Rejected
                </button>
              )}
              {onAccept && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => onAccept(proposal)}
                >
                  <CheckCircle2 size={16} />
                  Mark as Accepted
                </button>
              )}
            </>
          )}

          {onArchive && (
            <button
              type="button"
              className="btn btn-archive"
              onClick={() => onArchive(proposal)}
            >
              <Archive size={16} />
              Archive Proposal
            </button>
          )}
        </>
      )}
    </div>
  );
}
