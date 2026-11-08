import React from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Archive, 
  RotateCcw, 
  Layers,
  BookOpen
} from 'lucide-react';

export function Header({
  activeTab,
  onTabChange,
  onOpenCreate,
  onResetSeed,
  onOpenManual,
  archivedCount = 0,
  activeCount = 0,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-group" onClick={() => onTabChange('active')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Layers size={22} className="brand-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Proposify</span>
            <span className="brand-tag">Lifecycle Manager</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => onTabChange('active')}
          >
            <FileSpreadsheet size={16} />
            <span>Active Proposals</span>
            {activeCount > 0 && <span className="tab-pill">{activeCount}</span>}
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => onTabChange('archived')}
          >
            <Archive size={16} />
            <span>Archived</span>
            {archivedCount > 0 && <span className="tab-pill pill-purple">{archivedCount}</span>}
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onOpenManual && onOpenManual('walkthrough')}
            title="Open step-by-step User Manual & Guide"
          >
            <BookOpen size={14} />
            <span className="hide-mobile">User Manual</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetSeed}
            title="Reset to initial sample proposals"
          >
            <RotateCcw size={14} />
            <span className="hide-mobile">Reset Demo Data</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreate}
          >
            <Plus size={16} />
            <span>New Proposal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
