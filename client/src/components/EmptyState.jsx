import { createElement } from 'react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state card fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', maxWidth: '600px', backgroundColor: 'var(--color-bg-alt)' }}>
      {icon && (
        <div style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)', opacity: 0.8 }}>
          {createElement(icon, { size: 64, strokeWidth: 1.5 })}
        </div>
      )}
      <h2 className="empty-state__title" style={{ color: 'var(--color-ink)' }}>{title}</h2>
      <p style={{ fontStyle: 'italic', color: 'var(--color-muted)', marginBottom: action ? 'var(--space-6)' : '0' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
