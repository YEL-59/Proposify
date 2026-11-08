import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Proposals } from './pages/Proposals';
import { ArchivedProposals } from './pages/ArchivedProposals';
import { ProposalDetails } from './pages/ProposalDetails';
import { ProposalForm } from './components/proposals/ProposalForm';
import { ConfirmationDialog } from './components/common/ConfirmationDialog';
import { useProposals } from './hooks/useProposals';
import { useToast } from './hooks/useToast';
import { PROPOSAL_STATUS, canEditProposal } from './utils/statusTransitions';

export default function App() {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived'
  const [selectedProposal, setSelectedProposal] = useState(null); // when viewing details

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    intent: 'danger',
    onConfirm: () => {},
  });

  const { toasts, success, error, info, warning, removeToast } = useToast();

  // Active proposals hook
  const activeProposalsState = useProposals({ includeArchived: false });
  // Archived proposals hook
  const archivedProposalsState = useProposals({ includeArchived: true });

  // Determine current active hook
  const currentProposalsState = activeTab === 'active' ? activeProposalsState : archivedProposalsState;

  // Refresh both when state changes
  const refreshAll = async () => {
    await Promise.all([activeProposalsState.refresh(), archivedProposalsState.refresh()]);
  };

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingProposal(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proposal) => {
    const editCheck = canEditProposal(proposal);
    if (!editCheck.allowed) {
      warning(editCheck.reason);
      return;
    }
    setEditingProposal(proposal);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProposal) {
        const updated = await activeProposalsState.updateProposal(editingProposal.id, formData);
        success(`Proposal "${updated.title}" updated successfully.`);
        if (selectedProposal && selectedProposal.id === updated.id) {
          setSelectedProposal(updated);
        }
      } else {
        const created = await activeProposalsState.createProposal(formData);
        success(`Draft proposal "${created.title}" created successfully.`);
        // Switch to active tab if on archived tab
        setActiveTab('active');
      }
      await refreshAll();
    } catch (err) {
      error(err.message || 'Operation failed.');
      throw err;
    }
  };

  const handleSend = (proposal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Send Proposal to Client',
      message: `Are you sure you want to send "${proposal.title}" to ${proposal.clientName} (${proposal.clientEmail})? This will transition the status from Draft to Sent.`,
      confirmText: 'Send Proposal',
      intent: 'primary',
      onConfirm: async () => {
        try {
          const sent = await activeProposalsState.sendProposal(proposal.id);
          success(`Proposal "${sent.title}" was marked as Sent.`);
          if (selectedProposal && selectedProposal.id === sent.id) {
            setSelectedProposal(sent);
          }
          await refreshAll();
        } catch (err) {
          error(err.message || 'Failed to send proposal.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleAccept = (proposal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Accept Proposal',
      message: `Mark "${proposal.title}" as Accepted? This will finalize the proposal into winning status and lock it from further modifications.`,
      confirmText: 'Accept Proposal',
      intent: 'success',
      onConfirm: async () => {
        try {
          const accepted = await activeProposalsState.acceptProposal(proposal.id);
          success(`Proposal "${accepted.title}" has been successfully Accepted! 🎉`);
          if (selectedProposal && selectedProposal.id === accepted.id) {
            setSelectedProposal(accepted);
          }
          await refreshAll();
        } catch (err) {
          error(err.message || 'Failed to accept proposal.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleReject = (proposal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Proposal',
      message: `Mark "${proposal.title}" as Rejected by client? This indicates the client has declined the proposal.`,
      confirmText: 'Mark as Rejected',
      intent: 'danger',
      onConfirm: async () => {
        try {
          const rejected = await activeProposalsState.rejectProposal(proposal.id);
          info(`Proposal "${rejected.title}" marked as Rejected.`);
          if (selectedProposal && selectedProposal.id === rejected.id) {
            setSelectedProposal(rejected);
          }
          await refreshAll();
        } catch (err) {
          error(err.message || 'Failed to reject proposal.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleArchive = (proposal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Archive Proposal',
      message: `Archive "${proposal.title}"? The proposal will be soft-deleted and removed from active pipeline views, but securely retained in the archive and restorable at any time with its original status intact.`,
      confirmText: 'Archive Proposal',
      intent: 'primary',
      onConfirm: async () => {
        try {
          const archived = await activeProposalsState.archiveProposal(proposal.id);
          success(`Proposal "${archived.title}" was archived.`);
          if (selectedProposal && selectedProposal.id === archived.id) {
            setSelectedProposal(archived);
          }
          await refreshAll();
        } catch (err) {
          error(err.message || 'Failed to archive proposal.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRestore = (proposal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restore Proposal',
      message: `Restore "${proposal.title}" back to the active proposals pipeline? Its original status (${proposal.status.toUpperCase()}) will be preserved.`,
      confirmText: 'Restore to Active',
      intent: 'restore',
      onConfirm: async () => {
        try {
          const restored = await archivedProposalsState.restoreProposal(proposal.id);
          success(`Proposal "${restored.title}" restored to active proposals in "${restored.status}" status.`);
          if (selectedProposal && selectedProposal.id === restored.id) {
            setSelectedProposal(restored);
          }
          await refreshAll();
        } catch (err) {
          error(err.message || 'Failed to restore proposal.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleResetDemoSeed = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Demo Data',
      message: 'This will reset your proposals to the standard set of realistic demo proposals across all lifecycle statuses (Draft, Sent, Accepted, Rejected, and Archived). Continue?',
      confirmText: 'Reset Demo Data',
      intent: 'danger',
      onConfirm: async () => {
        try {
          await activeProposalsState.resetDemoData();
          await refreshAll();
          setSelectedProposal(null);
          success('Demo proposals restored successfully.');
        } catch (err) {
          error(err.message || 'Failed to reset demo data.');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleBackFromDetails = () => {
    setSelectedProposal(null);
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setSelectedProposal(null);
      }}
      onOpenCreate={handleOpenCreate}
      onResetSeed={handleResetDemoSeed}
      activeCount={activeProposalsState.stats.totalActive}
      archivedCount={activeProposalsState.stats.archived}
      toasts={toasts}
      onDismissToast={removeToast}
    >
      {selectedProposal ? (
        <ProposalDetails
          proposal={selectedProposal}
          onBack={handleBackFromDetails}
          onEdit={handleOpenEdit}
          onSend={handleSend}
          onAccept={handleAccept}
          onReject={handleReject}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      ) : activeTab === 'active' ? (
        <Proposals
          proposals={activeProposalsState.proposals}
          stats={activeProposalsState.stats}
          statusFilter={activeProposalsState.statusFilter}
          onStatusFilterChange={activeProposalsState.setStatusFilter}
          searchQuery={activeProposalsState.searchQuery}
          onSearchChange={activeProposalsState.setSearchQuery}
          isLoading={activeProposalsState.isLoading}
          onView={handleViewDetails}
          onEdit={handleOpenEdit}
          onSend={handleSend}
          onAccept={handleAccept}
          onReject={handleReject}
          onArchive={handleArchive}
          onCreateNew={handleOpenCreate}
        />
      ) : (
        <ArchivedProposals
          proposals={archivedProposalsState.proposals}
          searchQuery={archivedProposalsState.searchQuery}
          onSearchChange={archivedProposalsState.setSearchQuery}
          isLoading={archivedProposalsState.isLoading}
          onView={handleViewDetails}
          onRestore={handleRestore}
        />
      )}

      {/* Create / Edit Modal Form */}
      <ProposalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProposal(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProposal}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        intent={confirmDialog.intent}
      />
    </Layout>
  );
}
