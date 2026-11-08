import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Clock, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { ProposalStatusBadge } from './ProposalStatusBadge';
import { ProposalActions } from './ProposalActions';
import { formatCurrency, formatRelativeTime, formatDate } from '../../utils/formatters';
import { EmptyState } from '../common/EmptyState';

export function ProposalList({
  proposals = [],
  isLoading = false,
  onView,
  onEdit,
  onSend,
  onAccept,
  onReject,
  onArchive,
  onRestore,
  onCreateNew,
  emptyTitle,
  emptyDescription,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  if (isLoading) {
    return (
      <div className="proposal-list-loading">
        <div className="loading-spinner" />
        <p>Loading proposals...</p>
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No proposals found'}
        description={emptyDescription || 'There are no proposals matching your criteria.'}
        actionText={onCreateNew ? 'Create New Proposal' : undefined}
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="proposal-list-wrapper">
      {/* View Mode Toggle Bar */}
      <div className="list-toolbar">
        <div className="list-count-badge">
          Showing <strong>{proposals.length}</strong> {proposals.length === 1 ? 'proposal' : 'proposals'}
        </div>
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
            aria-label="Table View"
          >
            <TableIcon size={16} />
            <span>Table</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Grid Cards View"
            aria-label="Grid Cards View"
          >
            <LayoutGrid size={16} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Table View */
        <div className="table-responsive">
          <table className="proposal-table">
            <thead>
              <tr>
                <th>Proposal Title</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr
                  key={proposal.id}
                  className="table-row-clickable"
                  onClick={() => onView && onView(proposal)}
                >
                  <td className="cell-title">
                    <div className="prop-title-text">{proposal.title}</div>
                    <div className="prop-id-sub">ID: {proposal.id}</div>
                  </td>
                  <td className="cell-client">
                    <div className="client-name">{proposal.clientName}</div>
                    <div className="client-email">{proposal.clientEmail}</div>
                  </td>
                  <td className="cell-amount">
                    <span className="amount-value">
                      {formatCurrency(proposal.amount, proposal.currency)}
                    </span>
                  </td>
                  <td className="cell-status">
                    <ProposalStatusBadge
                      status={proposal.status}
                      isArchived={proposal.isArchived}
                      size="sm"
                    />
                  </td>
                  <td className="cell-date">
                    <div className="date-relative" title={formatDate(proposal.updatedAt)}>
                      {formatRelativeTime(proposal.updatedAt)}
                    </div>
                  </td>
                  <td className="cell-actions text-right" onClick={(e) => e.stopPropagation()}>
                    <ProposalActions
                      proposal={proposal}
                      onView={onView}
                      onEdit={onEdit}
                      onSend={onSend}
                      onAccept={onAccept}
                      onReject={onReject}
                      onArchive={onArchive}
                      onRestore={onRestore}
                      variant="compact"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="proposal-cards-grid">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="proposal-card"
              onClick={() => onView && onView(proposal)}
            >
              <div className="card-top">
                <ProposalStatusBadge
                  status={proposal.status}
                  isArchived={proposal.isArchived}
                  size="sm"
                />
                <span className="card-amount">
                  {formatCurrency(proposal.amount, proposal.currency)}
                </span>
              </div>

              <h3 className="card-proposal-title">{proposal.title}</h3>

              <div className="card-client-info">
                <div className="client-row">
                  <Building2 size={14} />
                  <span>{proposal.clientName}</span>
                </div>
                <div className="client-row">
                  <Mail size={14} />
                  <span>{proposal.clientEmail}</span>
                </div>
              </div>

              {proposal.description && (
                <p className="card-description-preview">{proposal.description}</p>
              )}

              <div className="card-footer">
                <div className="card-date-meta" title={formatDate(proposal.updatedAt)}>
                  <Clock size={12} />
                  <span>{formatRelativeTime(proposal.updatedAt)}</span>
                </div>
                <div className="card-actions-wrap" onClick={(e) => e.stopPropagation()}>
                  <ProposalActions
                    proposal={proposal}
                    onView={onView}
                    onEdit={onEdit}
                    onSend={onSend}
                    onAccept={onAccept}
                    onReject={onReject}
                    onArchive={onArchive}
                    onRestore={onRestore}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
