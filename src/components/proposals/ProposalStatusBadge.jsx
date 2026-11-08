import React from 'react';
import { FileEdit, Send, CheckCircle2, XCircle, Archive } from 'lucide-react';
import { PROPOSAL_STATUS } from '../../utils/statusTransitions';

export function ProposalStatusBadge({ status, isArchived = false, size = 'md' }) {
  const configs = {
    [PROPOSAL_STATUS.DRAFT]: {
      label: 'Draft',
      className: 'badge-draft',
      icon: <FileEdit size={size === 'sm' ? 12 : 14} />,
    },
    [PROPOSAL_STATUS.SENT]: {
      label: 'Sent',
      className: 'badge-sent',
      icon: <Send size={size === 'sm' ? 12 : 14} />,
    },
    [PROPOSAL_STATUS.ACCEPTED]: {
      label: 'Accepted',
      className: 'badge-accepted',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    },
    [PROPOSAL_STATUS.REJECTED]: {
      label: 'Rejected',
      className: 'badge-rejected',
      icon: <XCircle size={size === 'sm' ? 12 : 14} />,
    },
  };

  const config = configs[status] || {
    label: status || 'Unknown',
    className: 'badge-default',
    icon: null,
  };

  return (
    <div className="badge-group">
      <span className={`status-badge ${config.className} badge-${size}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
      {isArchived && (
        <span className={`status-badge badge-archived badge-${size}`} title="Archived (soft-deleted)">
          <Archive size={size === 'sm' ? 12 : 14} />
          <span>Archived</span>
        </span>
      )}
    </div>
  );
}
