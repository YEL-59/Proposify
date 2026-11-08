import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProposalDetails as ProposalDetailsComponent } from '../components/proposals/ProposalDetails';

export function ProposalDetails({
  proposal,
  onBack,
  onEdit,
  onSend,
  onAccept,
  onReject,
  onArchive,
  onRestore,
}) {
  if (!proposal) {
    return (
      <div className="details-not-found">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Proposals
        </button>
        <p>Proposal not found or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="proposal-details-page">
      <div className="details-nav-bar">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to {proposal.isArchived ? 'Archived Proposals' : 'Active Proposals'}
        </button>
      </div>

      <ProposalDetailsComponent
        proposal={proposal}
        onEdit={onEdit}
        onSend={onSend}
        onAccept={onAccept}
        onReject={onReject}
        onArchive={onArchive}
        onRestore={onRestore}
        onClose={onBack}
      />
    </div>
  );
}
