import React from 'react';

export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ minWidth: 250 }}>{sidebar}</aside>
      <main style={{ flex: 1, padding: '2rem', background: 'transparent' }}>
        {header && <div className="dashboard-header" style={{ marginBottom: '2rem' }}>{header}</div>}
        <div>{children}</div>
      </main>
    </div>
  );
}
