import React from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Search, 
  X, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { ProposalList } from '../components/proposals/ProposalList';
import { formatCurrency } from '../utils/formatters';
import { PROPOSAL_STATUS } from '../utils/statusTransitions';

export function Proposals({
  proposals,
  stats,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  isLoading,
  onView,
  onEdit,
  onSend,
  onAccept,
  onReject,
  onArchive,
  onCreateNew,
}) {
  const statusFilters = [
    { id: 'all', label: 'All Active', count: stats.totalActive },
    { id: PROPOSAL_STATUS.DRAFT, label: 'Draft', count: stats.draft },
    { id: PROPOSAL_STATUS.SENT, label: 'Sent', count: stats.sent },
    { id: PROPOSAL_STATUS.ACCEPTED, label: 'Accepted', count: stats.accepted },
    { id: PROPOSAL_STATUS.REJECTED, label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div className="proposals-page">
      {/* Page Title & Intro */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Active Proposals</h1>
          <p className="page-subtitle">
            Manage your deal proposals through the 4-stage lifecycle: Draft → Sent → Accepted / Rejected.
          </p>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Active"
          value={stats.totalActive}
          subtext="In active pipeline"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          label="Drafts"
          value={stats.draft}
          subtext="Editable proposals"
          icon={FileText}
          color="slate"
        />
        <StatCard
          label="Sent (Awaiting)"
          value={stats.sent}
          subtext="Under client review"
          icon={Send}
          color="amber"
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          subtext={formatCurrency(stats.acceptedValue)}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          subtext="Total sent value"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Filter and Search Controls */}
      <div className="filter-search-bar">
        {/* Status Filter Tabs */}
        <div className="status-filter-pills" role="tablist">
          {statusFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === f.id}
              className={`filter-pill-btn ${statusFilter === f.id ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(f.id)}
            >
              <span>{f.label}</span>
              <span className="pill-count">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by proposal title, client name or email..."
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

      {/* Proposals List */}
      <ProposalList
        proposals={proposals}
        isLoading={isLoading}
        onView={onView}
        onEdit={onEdit}
        onSend={onSend}
        onAccept={onAccept}
        onReject={onReject}
        onArchive={onArchive}
        onCreateNew={onCreateNew}
        emptyTitle={
          searchQuery
            ? `No proposals matching "${searchQuery}"`
            : statusFilter !== 'all'
            ? `No ${statusFilter} proposals found`
            : 'No active proposals yet'
        }
        emptyDescription={
          searchQuery
            ? 'Try adjusting your search terms or clearing the filter.'
            : statusFilter !== 'all'
            ? `There are currently no proposals in ${statusFilter} status.`
            : 'Create your first proposal to get started with the proposal lifecycle.'
        }
      />
    </div>
  );
}
