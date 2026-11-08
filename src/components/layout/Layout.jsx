import React, { useState } from 'react';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { UserManualModal } from '../manual/UserManualModal';
import { ShieldCheck, GitBranch, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

export function Layout({
  children,
  activeTab,
  onTabChange,
  onOpenCreate,
  onResetSeed,
  archivedCount,
  activeCount,
  toasts,
  onDismissToast,
}) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualInitialTab, setManualInitialTab] = useState('walkthrough');

  const handleOpenManual = (tab = 'walkthrough') => {
    setManualInitialTab(tab);
    setIsManualOpen(true);
  };

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenCreate={onOpenCreate}
        onResetSeed={onResetSeed}
        onOpenManual={handleOpenManual}
        archivedCount={archivedCount}
        activeCount={activeCount}
      />

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>

      {/* Enhanced Footer with User Manual & Client Verification Links */}
      <footer className="app-footer">
        <div className="footer-container">
          {/* Top Row: Links and Features */}
          <div className="footer-links-row">
            <div className="footer-brand-badge">
              <span className="footer-brand">Proposify Lifecycle Engine</span>
              <span className="footer-badge-pill">v1.0 Production</span>
            </div>

            <div className="footer-quick-links" aria-label="Footer documentation links">
              <button
                type="button"
                className="footer-link-btn primary-link"
                onClick={() => handleOpenManual('walkthrough')}
                title="View step-by-step user instructions"
              >
                <BookOpen size={15} />
                <span>📖 User Manual (Step-by-Step)</span>
              </button>

              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleOpenManual('checklist')}
                title="Verify that all client requirements are complete"
              >
                <CheckCircle2 size={15} className="text-emerald" />
                <span>"We Do Everything" Verification</span>
              </button>

              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleOpenManual('rules')}
                title="View strict business rules and guardrails"
              >
                <ShieldCheck size={15} className="text-indigo" />
                <span>Lifecycle Rules</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: System Architecture & Guardrails */}
          <div className="footer-bottom-row">
            <div className="footer-left">
              <span className="footer-rule">
                <ShieldCheck size={14} className="text-emerald" /> 
                <strong>Soft-Delete Only:</strong> No Hard Deletes Permitted
              </span>
              <span className="footer-separator">•</span>
              <span className="footer-rule">
                <GitBranch size={14} className="text-indigo" /> 
                <strong>Strict 4-Status Machine:</strong> Draft → Sent → Accepted / Rejected
              </span>
            </div>
            <div className="footer-right">
              <span className="footer-audit-note">Enterprise React Architecture • Audit Timestamps Preserved</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive User Manual Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        initialTab={manualInitialTab}
      />

      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}
