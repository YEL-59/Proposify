import React from 'react';

export function StatCard({ label, value, subtext, icon: Icon, color = 'indigo' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <div className="stat-value">{value}</div>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      {Icon && (
        <div className="stat-icon-wrap">
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
