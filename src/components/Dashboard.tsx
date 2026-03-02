import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Inline types
interface Tenant {
  id: string;
  name: string;
  domain: string;
  created: string;
  enableDeliveryEmail: boolean;
}

const TENANTS: Tenant[] = [
  { id: '1', name: '4Refuel', domain: 'https://www.4refuel.com', created: '2025-11-18', enableDeliveryEmail: true },
  { id: '2', name: 'Heliene', domain: 'https://heliene.com', created: '2025-05-08', enableDeliveryEmail: true },
  { id: '3', name: 'NONIN Medical Inc', domain: 'https://www.nonin.com/', created: '2025-11-18', enableDeliveryEmail: true },
  { id: '4', name: 'Quisitive Sandbox', domain: 'https://www.quisitive.com', created: '2025-11-19', enableDeliveryEmail: true },
];

const Dashboard = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️ Blackpoint Tenant Monitor</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>SOC Tenant Monitoring Dashboard</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {TENANTS.map((tenant) => (
            <div
              key={tenant.id}
              className="tenant-card"
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                border: '1px solid #334155',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setExpanded(expanded === tenant.id ? null : tenant.id)}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {tenant.name.substring(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '4px' }}>{tenant.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{tenant.domain}</p>
                </div>
              </div>
              {expanded === tenant.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155', fontSize: '13px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Created:</span>
                    <span style={{ marginLeft: '8px', color: '#cbd5e1' }}>{new Date(tenant.created).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Status:</span>
                    <span style={{ marginLeft: '8px', color: '#22c55e' }}>● Active</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
