import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import UnifiedCommandDashboard from './components/UnifiedCommandDashboard';
import CorrelationPanel from './components/CorrelationPanel';
import TriageRemediationPanel from './components/TriageRemediationPanel';
import CloseoutGovernancePanel from './components/CloseoutGovernancePanel';
import './App.css';

type View = 'legacy' | 'unified' | 'correlations' | 'triage' | 'closeout';

function App() {
  const [view, setView] = useState<View>('unified');
  const [tenantAlias, setTenantAlias] = useState('');

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="app-nav">
        <span className="app-nav-brand">SOC Command Center</span>
        <div className="app-nav-links">
          <button className={view === 'unified' ? 'active' : ''} onClick={() => setView('unified')}>
            Unified Dashboard
          </button>
          <button className={view === 'correlations' ? 'active' : ''} onClick={() => setView('correlations')}>
            Correlations
          </button>
          <button className={view === 'triage' ? 'active' : ''} onClick={() => setView('triage')}>
            Triage & Remediation
          </button>
          <button className={view === 'closeout' ? 'active' : ''} onClick={() => setView('closeout')}>
            Closeout Governance
          </button>
          <button className={view === 'legacy' ? 'active' : ''} onClick={() => setView('legacy')}>
            Legacy BP Dashboard
          </button>
        </div>
        <div className="app-nav-tenant">
          <label>Tenant:</label>
          <input
            placeholder="alias (e.g. contoso)"
            value={tenantAlias}
            onChange={(e) => setTenantAlias(e.target.value)}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {!tenantAlias && view !== 'legacy' && (
          <div className="app-prompt">Enter a tenant alias above to begin.</div>
        )}

        {view === 'legacy' && <Dashboard />}
        {view === 'unified' && tenantAlias && <UnifiedCommandDashboard tenantAlias={tenantAlias} />}
        {view === 'correlations' && tenantAlias && <CorrelationPanel tenantAlias={tenantAlias} />}
        {view === 'triage' && tenantAlias && <TriageRemediationPanel tenantAlias={tenantAlias} />}
        {view === 'closeout' && tenantAlias && <CloseoutGovernancePanel tenantAlias={tenantAlias} currentUser="analyst" />}
      </main>
    </div>
  );
}

export default App;
