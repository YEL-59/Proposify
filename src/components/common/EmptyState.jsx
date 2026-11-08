import React from 'react';
import { FileText, PlusCircle, RotateCcw } from 'lucide-react';

export function EmptyState({
  title = 'No proposals found',
  description = 'Get started by creating a new proposal or adjust your search filters.',
  actionText,
  onAction,
  icon: Icon = FileText,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={36} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <PlusCircle size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
}
