import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, RotateCcw, Archive } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  intent = 'danger', // 'danger' | 'warning' | 'primary' | 'success'
  isLoading = false,
}) {
  const intentIcons = {
    danger: <AlertCircle className="confirm-icon danger" size={24} />,
    warning: <AlertTriangle className="confirm-icon warning" size={24} />,
    success: <CheckCircle2 className="confirm-icon success" size={24} />,
    primary: <Archive className="confirm-icon primary" size={24} />,
    restore: <RotateCcw className="confirm-icon primary" size={24} />,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div className="confirm-content">
        <div className="confirm-icon-wrapper">
          {intentIcons[intent] || intentIcons.warning}
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${intent}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
