import { useState, useEffect, useCallback } from 'react';
import { proposalService } from '../services/proposalService';

export function useProposals({ includeArchived = false } = {}) {
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    archived: 0,
    totalActiveValue: 0,
    pipelineValue: 0,
    acceptedValue: 0,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [list, statistics] = await Promise.all([
        proposalService.getAll({
          includeArchived,
          status: statusFilter,
          search: searchQuery,
        }),
        proposalService.getStats(),
      ]);
      setProposals(list);
      setStats(statistics);
    } catch (err) {
      console.error('Failed to load proposals:', err);
      setError(err.message || 'Failed to load proposals.');
    } finally {
      setIsLoading(false);
    }
  }, [includeArchived, statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createProposal = async (data) => {
    const created = await proposalService.create(data);
    await loadData();
    return created;
  };

  const updateProposal = async (id, updates) => {
    const updated = await proposalService.update(id, updates);
    await loadData();
    return updated;
  };

  const sendProposal = async (id) => {
    const sent = await proposalService.send(id);
    await loadData();
    return sent;
  };

  const acceptProposal = async (id) => {
    const accepted = await proposalService.accept(id);
    await loadData();
    return accepted;
  };

  const rejectProposal = async (id) => {
    const rejected = await proposalService.reject(id);
    await loadData();
    return rejected;
  };

  const archiveProposal = async (id) => {
    const archived = await proposalService.archive(id);
    await loadData();
    return archived;
  };

  const restoreProposal = async (id) => {
    const restored = await proposalService.restore(id);
    await loadData();
    return restored;
  };

  const resetDemoData = async () => {
    await proposalService.resetDemoData();
    await loadData();
  };

  return {
    proposals,
    stats,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refresh: loadData,
    createProposal,
    updateProposal,
    sendProposal,
    acceptProposal,
    rejectProposal,
    archiveProposal,
    restoreProposal,
    resetDemoData,
  };
}
