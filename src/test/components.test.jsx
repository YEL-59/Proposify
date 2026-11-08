import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProposalStatusBadge } from '../components/proposals/ProposalStatusBadge';
import { ProposalActions } from '../components/proposals/ProposalActions';
import { UserManualModal } from '../components/manual/UserManualModal';
import { Layout } from '../components/layout/Layout';
import { PROPOSAL_STATUS } from '../utils/statusTransitions';

describe('Proposal UI Components Tests', () => {
  it('renders Draft status badge correctly', () => {
    render(<ProposalStatusBadge status={PROPOSAL_STATUS.DRAFT} />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders Sent status badge correctly', () => {
    render(<ProposalStatusBadge status={PROPOSAL_STATUS.SENT} />);
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('renders Accepted status badge correctly', () => {
    render(<ProposalStatusBadge status={PROPOSAL_STATUS.ACCEPTED} />);
    expect(screen.getByText('Accepted')).toBeInTheDocument();
  });

  it('renders Rejected status badge correctly', () => {
    render(<ProposalStatusBadge status={PROPOSAL_STATUS.REJECTED} />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders Archived badge when isArchived is true', () => {
    render(<ProposalStatusBadge status={PROPOSAL_STATUS.SENT} isArchived={true} />);
    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('ProposalActions renders Edit and Send for Draft proposal', () => {
    const proposal = {
      id: 'prop-1',
      status: PROPOSAL_STATUS.DRAFT,
      isArchived: false,
    };
    const onEdit = vi.fn();
    const onSend = vi.fn();

    render(
      <ProposalActions
        proposal={proposal}
        onEdit={onEdit}
        onSend={onSend}
        variant="compact"
      />
    );

    const editBtn = screen.getByTitle('Edit Draft');
    const sendBtn = screen.getByTitle('Send Proposal');
    expect(editBtn).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(proposal);

    fireEvent.click(sendBtn);
    expect(onSend).toHaveBeenCalledWith(proposal);
  });

  it('ProposalActions renders Accept and Reject for Sent proposal', () => {
    const proposal = {
      id: 'prop-2',
      status: PROPOSAL_STATUS.SENT,
      isArchived: false,
    };
    const onAccept = vi.fn();
    const onReject = vi.fn();

    render(
      <ProposalActions
        proposal={proposal}
        onAccept={onAccept}
        onReject={onReject}
        variant="compact"
      />
    );

    const acceptBtn = screen.getByTitle('Accept Proposal');
    const rejectBtn = screen.getByTitle('Reject Proposal');
    expect(acceptBtn).toBeInTheDocument();
    expect(rejectBtn).toBeInTheDocument();

    // Verify Edit is NOT present for Sent
    expect(screen.queryByTitle('Edit Draft')).not.toBeInTheDocument();
  });

  it('ProposalActions renders Restore for Archived proposal', () => {
    const proposal = {
      id: 'prop-3',
      status: PROPOSAL_STATUS.SENT,
      isArchived: true,
    };
    const onRestore = vi.fn();

    render(
      <ProposalActions
        proposal={proposal}
        onRestore={onRestore}
        variant="compact"
      />
    );

    const restoreBtn = screen.getByTitle('Restore to Active');
    expect(restoreBtn).toBeInTheDocument();
    expect(screen.queryByTitle('Accept Proposal')).not.toBeInTheDocument();
  });
});

describe('UserManualModal & Footer Links Tests', () => {
  it('renders UserManualModal when isOpen is true and switches tabs', () => {
    const onClose = vi.fn();
    render(<UserManualModal isOpen={true} onClose={onClose} initialTab="walkthrough" />);

    expect(screen.getByText('Proposify User Manual & Operational Guide')).toBeInTheDocument();
    expect(screen.getByText('How to Create a New Proposal')).toBeInTheDocument();

    // Switch to Checklist tab ("We Do Everything" Verification)
    const checklistTab = screen.getByText('"We Do Everything" Verification');
    fireEvent.click(checklistTab);
    expect(screen.getByText('"We Do Everything" — Requirement Verification Matrix')).toBeInTheDocument();
    expect(screen.getByText('100% Client Specification Compliance')).toBeInTheDocument();

    // Switch to Lifecycle Flow tab
    const flowTab = screen.getByText('Lifecycle Flow');
    fireEvent.click(flowTab);
    expect(screen.getByText('Strict 4-Status Lifecycle State Machine')).toBeInTheDocument();

    // Switch to Rules tab
    const rulesTab = screen.getByText('Rules & Guardrails');
    fireEvent.click(rulesTab);
    expect(screen.getByText('Permitted Operations')).toBeInTheDocument();
    expect(screen.getByText('Strictly Blocked / Forbidden')).toBeInTheDocument();

    // Close button triggers onClose
    const closeBtn = screen.getByLabelText('Close user manual');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('Layout component renders footer with User Manual and Verification links', () => {
    render(
      <Layout
        activeTab="active"
        onTabChange={() => {}}
        onOpenCreate={() => {}}
        onResetSeed={() => {}}
        archivedCount={2}
        activeCount={5}
        toasts={[]}
        onDismissToast={() => {}}
      >
        <div>Content</div>
      </Layout>
    );

    // Verify footer links exist
    const footerManualBtn = screen.getByText('📖 User Manual (Step-by-Step)');
    const footerVerificationBtn = screen.getByText('"We Do Everything" Verification');
    expect(footerManualBtn).toBeInTheDocument();
    expect(footerVerificationBtn).toBeInTheDocument();

    // Clicking the footer manual link opens the UserManualModal
    fireEvent.click(footerManualBtn);
    expect(screen.getByText('Proposify User Manual & Operational Guide')).toBeInTheDocument();
  });
});
