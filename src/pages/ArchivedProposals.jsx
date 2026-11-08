import React from 'react';
import { Archive, Search, X, ShieldCheck, RotateCcw } from 'lucide-react';
import { ProposalList } from '../components/proposals/ProposalList';

export function ArchivedProposals({
  proposals,
  searchQuery,
  onSearchChange,
  isLoading,
  onView,
  onRestore,
}) {
  return (
    <div className="archived-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Archived Proposals</h1>
          <p className="page-subtitle">
            Proposals stored in soft-deleted state. Permanent database deletion is strictly prohibited.
          </p>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="archive-policy-callout">
        <div className="policy-icon-wrap">
          <ShieldCheck size={22} />
        </div>
        <div className="policy-text">
          <h4 className="policy-title">Soft-Delete & Integrity Guarantee</h4>
          <p className="policy-desc">
            Archived records remain permanently safely stored in the database. When you click <strong>Restore</strong>,
            the proposal is reactivated into the active pipeline while strictly preserving its original lifecycle
            status (<em>Draft</em>, <em>Sent</em>, <em>Accepted</em>, or <em>Rejected</em>).
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-search-bar single-search">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search archived proposals by title, client name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Proposal List */}
      <ProposalList
        proposals={proposals}
        isLoading={isLoading}
        onView={onView}
        onRestore={onRestore}
        emptyTitle={
          searchQuery
            ? `No archived proposals matching "${searchQuery}"`
            : 'Archive is currently empty'
        }
        emptyDescription={
          searchQuery
            ? 'Try adjusting your search terms.'
            : 'When you archive proposals from the active dashboard, they will appear here safely preserved.'
        }
      />
    </div>
  );
}
