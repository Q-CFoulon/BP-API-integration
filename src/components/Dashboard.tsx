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

interface UserInfo {
  username: string;
  displayName: string;
  email: string;
  department: string;
  role: string;
  lastLogin: string;
}

interface MachineInfo {
  hostname: string;
  ipAddress: string;
  macAddress: string;
  os: string;
  osVersion: string;
  lastSeen: string;
  location: string;
  assetTag: string;
}

interface TimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
  details: string;
}

interface ActionTaken {
  timestamp: string;
  action: string;
  performedBy: string;
  result: string;
  notes: string;
}

interface RelatedActivity {
  timestamp: string;
  type: string;
  description: string;
  correlation: string;
}

interface MockAlert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  tenantId: string;
  description: string;
  riskScore: number;
  affectedSystems: string[];
  detectionMethod: string;
  recommendedAction: string;
  source: string;
  category: string;
  // Enhanced details
  user: UserInfo;
  machine: MachineInfo;
  timeline: TimelineEvent[];
  actionsTaken: ActionTaken[];
  relatedActivities: RelatedActivity[];
  iocIndicators: string[];
  mitreAttackTechnique: string;
}

const TENANTS: Tenant[] = [
  { id: '1', name: '4Refuel', domain: 'https://www.4refuel.com', created: '2025-11-18', enableDeliveryEmail: true },
  { id: '2', name: 'Heliene', domain: 'https://heliene.com', created: '2025-05-08', enableDeliveryEmail: true },
  { id: '3', name: 'NONIN Medical Inc', domain: 'https://www.nonin.com/', created: '2025-11-18', enableDeliveryEmail: true },
  { id: '4', name: 'Quisitive Sandbox', domain: 'https://www.quisitive.com', created: '2025-11-19', enableDeliveryEmail: true },
];

// Mock alerts for demonstration with full details
const MOCK_ALERTS: MockAlert[] = [
  { 
    id: 'a1', 
    title: 'Suspicious Login Attempt', 
    severity: 'high', 
    status: 'open', 
    createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(), 
    tenantId: '1', 
    description: 'Multiple failed login attempts from unusual IP address detected on domain controller',
    riskScore: 82,
    affectedSystems: ['DC-01', 'DC-02', 'FileServer-03'],
    detectionMethod: 'Behavioral Analysis + SIEM',
    recommendedAction: 'Enable MFA on flagged accounts, review login logs, consider blocking source IP',
    source: 'Active Directory Logs',
    category: 'Access Control',
    user: {
      username: 'jsmith',
      displayName: 'John Smith',
      email: 'jsmith@4refuel.com',
      department: 'Operations',
      role: 'Fleet Manager',
      lastLogin: new Date(Date.now() - 3*60*60*1000).toISOString()
    },
    machine: {
      hostname: 'DC-01',
      ipAddress: '192.168.1.10',
      macAddress: '00:1A:2B:3C:4D:5E',
      os: 'Windows Server',
      osVersion: '2022 Datacenter',
      lastSeen: new Date(Date.now() - 5*60*1000).toISOString(),
      location: 'Toronto Data Center - Rack 12',
      assetTag: 'SVR-2024-0142'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 2*60*60*1000 - 15*60*1000).toISOString(), event: 'First failed login attempt', actor: 'jsmith', details: 'Failed password from IP 185.220.101.45' },
      { timestamp: new Date(Date.now() - 2*60*60*1000 - 10*60*1000).toISOString(), event: '5 consecutive failed attempts', actor: 'jsmith', details: 'Account lockout threshold approaching' },
      { timestamp: new Date(Date.now() - 2*60*60*1000 - 5*60*1000).toISOString(), event: 'GeoIP anomaly detected', actor: 'System', details: 'Login attempt from Russia (unusual location)' },
      { timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), event: 'Alert generated', actor: 'SIEM', details: 'High severity alert created' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 1*60*60*1000).toISOString(), action: 'Account temporarily locked', performedBy: 'Automated Response', result: 'Success', notes: 'Preventive lockout for 30 minutes' },
      { timestamp: new Date(Date.now() - 45*60*1000).toISOString(), action: 'IP added to watchlist', performedBy: 'SOC Analyst - M. Chen', result: 'Success', notes: 'IP 185.220.101.45 flagged for monitoring' }
    ],
    relatedActivities: [
      { timestamp: new Date(Date.now() - 2*60*60*1000 - 30*60*1000).toISOString(), type: 'Port Scan', description: 'Port scan detected from same source IP', correlation: 'Same source IP' },
      { timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), type: 'Phishing Email', description: 'User received phishing email yesterday', correlation: 'Same target user' }
    ],
    iocIndicators: ['IP: 185.220.101.45', 'User-Agent: Mozilla/5.0 (compatible; MSIE 10.0)', 'GeoLocation: Moscow, RU'],
    mitreAttackTechnique: 'T1110 - Brute Force'
  },
  { 
    id: 'a2', 
    title: 'Data Exfiltration Risk', 
    severity: 'critical', 
    status: 'investigating', 
    createdAt: new Date(Date.now() - 4*60*60*1000).toISOString(), 
    tenantId: '2', 
    description: 'Large data transfer detected to external network (2.3GB in 15 minutes). Unusual for this user profile.',
    riskScore: 95,
    affectedSystems: ['WORKSTATION-12', 'FILE-SHARE-02'],
    detectionMethod: 'DLP + Network Analytics',
    recommendedAction: 'Immediately isolate affected system, conduct forensic analysis, review user permissions',
    source: 'Data Loss Prevention System',
    category: 'Data Exfiltration',
    user: {
      username: 'agarcia',
      displayName: 'Ana Garcia',
      email: 'agarcia@heliene.com',
      department: 'Engineering',
      role: 'Senior Engineer',
      lastLogin: new Date(Date.now() - 4*60*60*1000 - 30*60*1000).toISOString()
    },
    machine: {
      hostname: 'WORKSTATION-12',
      ipAddress: '10.20.30.112',
      macAddress: '00:1B:44:11:3A:B7',
      os: 'Windows',
      osVersion: '11 Enterprise 23H2',
      lastSeen: new Date(Date.now() - 10*60*1000).toISOString(),
      location: 'Heliene HQ - Floor 3, Desk 42',
      assetTag: 'WKS-2023-0847'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 4*60*60*1000 - 20*60*1000).toISOString(), event: 'User logged in', actor: 'agarcia', details: 'Normal login from office location' },
      { timestamp: new Date(Date.now() - 4*60*60*1000 - 15*60*1000).toISOString(), event: 'File share access', actor: 'agarcia', details: 'Accessed \\\\FILE-SHARE-02\\Engineering\\Confidential' },
      { timestamp: new Date(Date.now() - 4*60*60*1000 - 10*60*1000).toISOString(), event: 'Large file copy initiated', actor: 'agarcia', details: '847 files selected (2.3GB total)' },
      { timestamp: new Date(Date.now() - 4*60*60*1000).toISOString(), event: 'External transfer detected', actor: 'DLP System', details: 'Data sent to cloud storage (Dropbox)' },
      { timestamp: new Date(Date.now() - 4*60*60*1000 + 5*60*1000).toISOString(), event: 'Alert generated', actor: 'DLP', details: 'Critical severity - potential data breach' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 3*60*60*1000).toISOString(), action: 'Network traffic captured', performedBy: 'SOC Analyst - R. Patel', result: 'Success', notes: 'PCAP saved for forensic analysis' },
      { timestamp: new Date(Date.now() - 2*60*60*1000 - 30*60*1000).toISOString(), action: 'User contacted', performedBy: 'SOC Lead - T. Williams', result: 'Pending', notes: 'User claims legitimate work transfer - verifying' },
      { timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), action: 'Manager notified', performedBy: 'SOC Lead - T. Williams', result: 'Success', notes: 'Engineering Director informed of incident' }
    ],
    relatedActivities: [
      { timestamp: new Date(Date.now() - 5*60*60*1000).toISOString(), type: 'USB Device', description: 'USB drive connected earlier today', correlation: 'Same user/machine' },
      { timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), type: 'VPN Access', description: 'User accessed VPN from home network', correlation: 'Same user' }
    ],
    iocIndicators: ['Destination: dropbox.com', 'File Types: .dwg, .pdf, .xlsx', 'Transfer Size: 2.3GB', 'Transfer Duration: 15 min'],
    mitreAttackTechnique: 'T1567 - Exfiltration Over Web Service'
  },
  { 
    id: 'a3', 
    title: 'Malware Detected', 
    severity: 'critical', 
    status: 'open', 
    createdAt: new Date(Date.now() - 1*60*60*1000).toISOString(), 
    tenantId: '3', 
    description: 'Potential malware signature identified on endpoint. File: Win32.Trojan.Gen detected in temp folder.',
    riskScore: 98,
    affectedSystems: ['ENDPOINT-45', 'ENDPOINT-46'],
    detectionMethod: 'Antivirus Signature + Heuristic Detection',
    recommendedAction: 'Immediately quarantine affected systems, run full system scan, backup critical data',
    source: 'Endpoint Protection',
    category: 'Malware',
    user: {
      username: 'mwilson',
      displayName: 'Michael Wilson',
      email: 'mwilson@nonin.com',
      department: 'Sales',
      role: 'Regional Sales Manager',
      lastLogin: new Date(Date.now() - 1*60*60*1000 - 45*60*1000).toISOString()
    },
    machine: {
      hostname: 'ENDPOINT-45',
      ipAddress: '172.16.50.45',
      macAddress: '00:25:64:8B:2C:91',
      os: 'Windows',
      osVersion: '10 Enterprise 22H2',
      lastSeen: new Date(Date.now() - 2*60*1000).toISOString(),
      location: 'NONIN Plymouth Office - Sales Floor',
      assetTag: 'LPT-2024-0312'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 30*60*1000).toISOString(), event: 'Email received', actor: 'mwilson', details: 'Email with attachment from unknown sender' },
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 25*60*1000).toISOString(), event: 'Attachment opened', actor: 'mwilson', details: 'User opened Invoice_Q1_2026.pdf.exe' },
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 24*60*1000).toISOString(), event: 'Process spawned', actor: 'System', details: 'Suspicious child process from PDF reader' },
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 20*60*1000).toISOString(), event: 'File written to temp', actor: 'Malware', details: 'C:\\Users\\mwilson\\AppData\\Local\\Temp\\svchost32.exe' },
      { timestamp: new Date(Date.now() - 1*60*60*1000).toISOString(), event: 'Malware detected', actor: 'Endpoint Protection', details: 'Win32.Trojan.Gen signature match' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 55*60*1000).toISOString(), action: 'File quarantined', performedBy: 'Automated Response', result: 'Success', notes: 'Malicious file moved to quarantine vault' },
      { timestamp: new Date(Date.now() - 50*60*1000).toISOString(), action: 'Network isolated', performedBy: 'Automated Response', result: 'Success', notes: 'Endpoint removed from network via NAC' },
      { timestamp: new Date(Date.now() - 40*60*1000).toISOString(), action: 'Full scan initiated', performedBy: 'SOC Analyst - K. Johnson', result: 'In Progress', notes: 'Deep scan running - 45% complete' }
    ],
    relatedActivities: [
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 30*60*1000).toISOString(), type: 'Phishing Email', description: 'Same email sent to 5 other users', correlation: 'Same email campaign' },
      { timestamp: new Date(Date.now() - 1*60*60*1000 - 15*60*1000).toISOString(), type: 'C2 Callback', description: 'Attempted connection to known C2 server', correlation: 'Same malware family' }
    ],
    iocIndicators: ['File Hash: 5d41402abc4b2a76b9719d911017c592', 'C2 Server: 45.33.32.156:443', 'Registry Key: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\svchost32', 'Email Sender: invoice@acme-billing.com'],
    mitreAttackTechnique: 'T1566.001 - Phishing: Spearphishing Attachment'
  },
  { 
    id: 'a4', 
    title: 'Policy Violation', 
    severity: 'medium', 
    status: 'resolved', 
    createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), 
    tenantId: '4', 
    description: 'Unauthorized application installation detected (PuTTY SSH Client). Violates endpoint hardening policy.',
    riskScore: 65,
    affectedSystems: ['WORKSTATION-78'],
    detectionMethod: 'Software Inventory Management',
    recommendedAction: 'Remove unauthorized application, enforce application whitelist policy',
    source: 'Application Control',
    category: 'Policy Violation',
    user: {
      username: 'dlee',
      displayName: 'David Lee',
      email: 'dlee@quisitive.com',
      department: 'IT',
      role: 'Junior Developer',
      lastLogin: new Date(Date.now() - 24*60*60*1000 - 2*60*60*1000).toISOString()
    },
    machine: {
      hostname: 'WORKSTATION-78',
      ipAddress: '10.100.20.78',
      macAddress: '00:1C:42:9F:DD:E3',
      os: 'Windows',
      osVersion: '11 Enterprise 23H2',
      lastSeen: new Date(Date.now() - 15*60*1000).toISOString(),
      location: 'Quisitive Toronto - Dev Floor 2',
      assetTag: 'DEV-2024-0078'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 24*60*60*1000 - 15*60*1000).toISOString(), event: 'Download initiated', actor: 'dlee', details: 'Downloaded putty-64bit-0.80-installer.msi from putty.org' },
      { timestamp: new Date(Date.now() - 24*60*60*1000 - 10*60*1000).toISOString(), event: 'Installation attempted', actor: 'dlee', details: 'MSI installer execution detected' },
      { timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(), event: 'Policy violation detected', actor: 'Application Control', details: 'Unauthorized software installation blocked' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 23*60*60*1000).toISOString(), action: 'Installation blocked', performedBy: 'Automated Response', result: 'Success', notes: 'AppLocker prevented installation' },
      { timestamp: new Date(Date.now() - 22*60*60*1000).toISOString(), action: 'User notified', performedBy: 'IT Service Desk', result: 'Success', notes: 'Email sent explaining policy' },
      { timestamp: new Date(Date.now() - 20*60*60*1000).toISOString(), action: 'Exception request submitted', performedBy: 'dlee', result: 'Approved', notes: 'Manager approved SSH client for dev work' },
      { timestamp: new Date(Date.now() - 18*60*60*1000).toISOString(), action: 'Alert closed', performedBy: 'IT Manager - S. Brown', result: 'Success', notes: 'Legitimate business need confirmed' }
    ],
    relatedActivities: [
      { timestamp: new Date(Date.now() - 25*60*60*1000).toISOString(), type: 'Help Desk Ticket', description: 'User requested SSH access earlier', correlation: 'Same user' }
    ],
    iocIndicators: ['Software: PuTTY 0.80', 'Download Source: putty.org', 'Installer Hash: a1b2c3d4e5f6...'],
    mitreAttackTechnique: 'N/A - Policy Violation (Not Attack)'
  },
  { 
    id: 'a5', 
    title: 'Privilege Escalation', 
    severity: 'high', 
    status: 'investigating', 
    createdAt: new Date(Date.now() - 30*60*1000).toISOString(), 
    tenantId: '1', 
    description: 'Unusual privilege elevation activity detected. Non-admin user executed privileged command.',
    riskScore: 88,
    affectedSystems: ['SERVER-21'],
    detectionMethod: 'Process Monitoring + Privilege Auditing',
    recommendedAction: 'Review User Access Control Policy, verify legitimacy, audit command execution',
    source: 'Process Auditing',
    category: 'Privilege Management',
    user: {
      username: 'rbrown',
      displayName: 'Rachel Brown',
      email: 'rbrown@4refuel.com',
      department: 'Finance',
      role: 'Accounts Payable Specialist',
      lastLogin: new Date(Date.now() - 45*60*1000).toISOString()
    },
    machine: {
      hostname: 'SERVER-21',
      ipAddress: '192.168.5.21',
      macAddress: '00:50:56:AB:CD:21',
      os: 'Windows Server',
      osVersion: '2019 Standard',
      lastSeen: new Date(Date.now() - 1*60*1000).toISOString(),
      location: 'Toronto Data Center - Rack 8',
      assetTag: 'SVR-2021-0089'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 35*60*1000).toISOString(), event: 'RDP connection', actor: 'rbrown', details: 'Connected to SERVER-21 via RDP' },
      { timestamp: new Date(Date.now() - 32*60*1000).toISOString(), event: 'PowerShell launched', actor: 'rbrown', details: 'PowerShell.exe started with -ExecutionPolicy Bypass' },
      { timestamp: new Date(Date.now() - 30*60*1000).toISOString(), event: 'Privilege escalation', actor: 'rbrown', details: 'net localgroup administrators rbrown /add executed' },
      { timestamp: new Date(Date.now() - 30*60*1000).toISOString(), event: 'Alert generated', actor: 'Process Auditing', details: 'Unauthorized privilege elevation detected' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 25*60*1000).toISOString(), action: 'Session monitored', performedBy: 'SOC Analyst - J. Martinez', result: 'In Progress', notes: 'Live session monitoring initiated' },
      { timestamp: new Date(Date.now() - 20*60*1000).toISOString(), action: 'User contacted', performedBy: 'SOC Analyst - J. Martinez', result: 'Pending', notes: 'Phone call attempted - voicemail left' },
      { timestamp: new Date(Date.now() - 15*60*1000).toISOString(), action: 'Manager escalation', performedBy: 'SOC Lead', result: 'Success', notes: 'Finance Director notified' }
    ],
    relatedActivities: [
      { timestamp: new Date(Date.now() - 40*60*1000).toISOString(), type: 'Failed Login', description: 'Failed admin login attempts on same server', correlation: 'Same target server' },
      { timestamp: new Date(Date.now() - 35*60*1000).toISOString(), type: 'Credential Access', description: 'Mimikatz-like behavior detected', correlation: 'Same user session' }
    ],
    iocIndicators: ['Command: net localgroup administrators rbrown /add', 'PowerShell Flags: -ExecutionPolicy Bypass', 'Session ID: 0x3E7', 'Parent Process: explorer.exe'],
    mitreAttackTechnique: 'T1078.003 - Valid Accounts: Local Accounts'
  },
  { 
    id: 'a6', 
    title: 'SSL Certificate Warning', 
    severity: 'low', 
    status: 'resolved', 
    createdAt: new Date(Date.now() - 72*60*60*1000).toISOString(), 
    tenantId: '2', 
    description: 'Certificate expiration warning. Current certificate will expire in 30 days.',
    riskScore: 35,
    affectedSystems: ['API-SERVER-01', 'WEB-SERVER-02'],
    detectionMethod: 'Certificate Monitoring',
    recommendedAction: 'Renew SSL certificate before expiration date to prevent service disruption',
    source: 'Certificate Management',
    category: 'Infrastructure',
    user: {
      username: 'system',
      displayName: 'System Monitor',
      email: 'alerts@heliene.com',
      department: 'IT Infrastructure',
      role: 'Automated Monitoring',
      lastLogin: new Date(Date.now() - 72*60*60*1000).toISOString()
    },
    machine: {
      hostname: 'API-SERVER-01',
      ipAddress: '10.50.100.15',
      macAddress: '00:0C:29:5A:3B:2D',
      os: 'Ubuntu Server',
      osVersion: '22.04 LTS',
      lastSeen: new Date(Date.now() - 30*60*1000).toISOString(),
      location: 'Heliene Cloud - AWS us-east-1',
      assetTag: 'AWS-2023-0015'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 72*60*60*1000).toISOString(), event: 'Certificate check', actor: 'Certificate Monitor', details: 'Routine daily certificate expiration scan' },
      { timestamp: new Date(Date.now() - 72*60*60*1000).toISOString(), event: 'Warning generated', actor: 'System', details: 'Certificate expires April 1, 2026 (30 days)' }
    ],
    actionsTaken: [
      { timestamp: new Date(Date.now() - 70*60*60*1000).toISOString(), action: 'Ticket created', performedBy: 'Automated Response', result: 'Success', notes: 'JIRA ticket INFRA-2847 created' },
      { timestamp: new Date(Date.now() - 68*60*60*1000).toISOString(), action: 'Certificate ordered', performedBy: 'IT Admin - L. Park', result: 'Success', notes: 'New wildcard cert ordered from DigiCert' },
      { timestamp: new Date(Date.now() - 48*60*60*1000).toISOString(), action: 'Certificate installed', performedBy: 'IT Admin - L. Park', result: 'Success', notes: 'New cert deployed to all servers' },
      { timestamp: new Date(Date.now() - 48*60*60*1000).toISOString(), action: 'Alert resolved', performedBy: 'IT Admin - L. Park', result: 'Success', notes: 'Verified new cert valid until 2027' }
    ],
    relatedActivities: [],
    iocIndicators: ['Certificate CN: *.heliene.com', 'Issuer: DigiCert', 'Expiry: April 1, 2026', 'Key Size: 2048-bit RSA'],
    mitreAttackTechnique: 'N/A - Infrastructure Maintenance'
  },
];

const TenantDetailPage: React.FC<{ tenantId: string; onBack: () => void }> = ({ tenantId, onBack }) => {
  const tenant = TENANTS.find(t => t.id === tenantId);
  const alerts = MOCK_ALERTS.filter(a => a.tenantId === tenantId);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const highAlerts = alerts.filter(a => a.severity === 'high');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  if (!tenant) return <div className="error-message">Tenant not found</div>;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'investigating': return '#f59e0b';
      case 'resolved': return '#22c55e';
      default: return '#64748b';
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <button onClick={onBack} className="btn-primary btn-back">
          ← Back to Dashboard
        </button>

        {/* Tenant Header */}
        <div className="detail-header-card">
          <div className="card-header">
            <div className="tenant-avatar large">
              {tenant.name.substring(0, 2)}
            </div>
            <div>
              <h1 className="detail-title">{tenant.name}</h1>
              <p className="detail-subtitle">{tenant.domain}</p>
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Tenant ID</span>
                  <div className="meta-value mono">{tenant.id}</div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created</span>
                  <div className="meta-value">{new Date(tenant.created).toLocaleDateString()}</div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Email Delivery</span>
                  <div className={`meta-value ${tenant.enableDeliveryEmail ? 'green' : 'red'}`}>
                    {tenant.enableDeliveryEmail ? '✓ Enabled' : '✗ Disabled'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value red">{alerts.length}</div>
              <div className="metric-label">Total Alerts</div>
            </div>
            <div className="metric-item">
              <div className="metric-value critical">{criticalAlerts.length}</div>
              <div className="metric-label">Critical</div>
            </div>
            <div className="metric-item">
              <div className="metric-value orange">{highAlerts.length}</div>
              <div className="metric-label">High Priority</div>
            </div>
            <div className="metric-item">
              <div className="metric-value green">{alerts.filter(a => a.status === 'resolved').length}</div>
              <div className="metric-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div>
          <h2 className="section-title large">Security Alerts ({alerts.length})</h2>
          {alerts.length > 0 ? (
            <div className="alerts-list">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  className="alert-card"
                  data-severity={alert.severity}
                >
                  <div className="alert-card-header">
                    <div className="alert-card-content">
                      <div className="alert-title-row" data-severity={alert.severity} data-status={alert.status}>
                        <div className="severity-dot"></div>
                        <span className="alert-title">{alert.title}</span>
                        <span className="status-badge">
                          {alert.status.toUpperCase()}
                        </span>
                        <span className="risk-badge">
                          Risk: {alert.riskScore}/100
                        </span>
                      </div>
                      <div className="alert-meta">
                        {new Date(alert.createdAt).toLocaleString()} • {alert.category} • {alert.source}
                      </div>
                      
                      {expandedAlert === alert.id && (
                        <div className="alert-expanded" onClick={e => e.stopPropagation()}>
                          
                          {/* Description */}
                          <div className="alert-section">
                            <div className="alert-section-title">DESCRIPTION</div>
                            <div className="alert-description">{alert.description}</div>
                            <div className="alert-detail-row">
                              <strong>Detection Method:</strong> {alert.detectionMethod}
                            </div>
                            <div className="alert-detail-row warning">
                              <strong>Recommended Action:</strong> {alert.recommendedAction}
                            </div>
                            {alert.mitreAttackTechnique !== 'N/A - Policy Violation (Not Attack)' && alert.mitreAttackTechnique !== 'N/A - Infrastructure Maintenance' && (
                              <div className="mitre-badge">
                                MITRE ATT&CK: {alert.mitreAttackTechnique}
                              </div>
                            )}
                          </div>

                          {/* User & Machine Info Grid */}
                          <div className="detail-grid">
                            {/* User Details */}
                            <div className="alert-section">
                              <div className="alert-section-title">
                                <span className="section-icon">👤</span> USER DETAILS
                              </div>
                              <div className="detail-list">
                                <div><span className="label">Username:</span> <span className="value-mono blue">{alert.user.username}</span></div>
                                <div><span className="label">Name:</span> {alert.user.displayName}</div>
                                <div><span className="label">Email:</span> <span className="value-cyan">{alert.user.email}</span></div>
                                <div><span className="label">Department:</span> {alert.user.department}</div>
                                <div><span className="label">Role:</span> {alert.user.role}</div>
                                <div><span className="label">Last Login:</span> {new Date(alert.user.lastLogin).toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Machine Details */}
                            <div className="alert-section">
                              <div className="alert-section-title">
                                <span className="section-icon">🖥️</span> MACHINE DETAILS
                              </div>
                              <div className="detail-list">
                                <div><span className="label">Hostname:</span> <span className="value-mono orange">{alert.machine.hostname}</span></div>
                                <div><span className="label">IP Address:</span> <span className="value-mono">{alert.machine.ipAddress}</span></div>
                                <div><span className="label">MAC:</span> <span className="value-mono small">{alert.machine.macAddress}</span></div>
                                <div><span className="label">OS:</span> {alert.machine.os} {alert.machine.osVersion}</div>
                                <div><span className="label">Location:</span> {alert.machine.location}</div>
                                <div><span className="label">Asset Tag:</span> <span className="value-mono">{alert.machine.assetTag}</span></div>
                                <div><span className="label">Last Seen:</span> {new Date(alert.machine.lastSeen).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="alert-section">
                            <div className="alert-section-title">
                              <span className="section-icon">📅</span> EVENT TIMELINE
                            </div>
                            <div className="timeline">
                              {alert.timeline.map((event, idx) => (
                                <div key={idx} className="timeline-item">
                                  <div className="timeline-dot"></div>
                                  <div className="timeline-time">{new Date(event.timestamp).toLocaleString()}</div>
                                  <div className="timeline-event">{event.event}</div>
                                  <div className="timeline-details">
                                    <span className="actor">{event.actor}</span> • {event.details}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions Taken */}
                          <div className="alert-section">
                            <div className="alert-section-title">
                              <span className="section-icon">⚡</span> ACTIONS TAKEN ({alert.actionsTaken.length})
                            </div>
                            <div className="actions-list">
                              {alert.actionsTaken.map((action, idx) => (
                                <div key={idx} className={`action-item ${action.result === 'Success' ? 'success' : action.result === 'In Progress' ? 'progress' : ''}`}>
                                  <div className="action-header">
                                    <span className="action-name">{action.action}</span>
                                    <span className={`result-badge ${action.result === 'Success' ? 'success' : action.result === 'In Progress' ? 'progress' : ''}`}>
                                      {action.result}
                                    </span>
                                  </div>
                                  <div className="action-time">{new Date(action.timestamp).toLocaleString()}</div>
                                  <div className="action-by">
                                    <strong>By:</strong> {action.performedBy}
                                  </div>
                                  <div className="action-notes">{action.notes}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Related Activities & IOC Indicators Grid */}
                          <div className="detail-grid">
                            {/* Related Activities */}
                            <div className="alert-section">
                              <div className="alert-section-title">
                                <span className="section-icon">🔗</span> RELATED ACTIVITIES
                              </div>
                              {alert.relatedActivities.length > 0 ? (
                                <div className="activities-list">
                                  {alert.relatedActivities.map((activity, idx) => (
                                    <div key={idx} className="activity-item">
                                      <div className="activity-header">
                                        <span className="activity-type">{activity.type}</span>
                                        <span className="activity-date">{new Date(activity.timestamp).toLocaleDateString()}</span>
                                      </div>
                                      <div className="activity-desc">{activity.description}</div>
                                      <div className="activity-correlation">Correlation: {activity.correlation}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="empty-activities">No related activities detected</div>
                              )}
                            </div>

                            {/* IOC Indicators */}
                            <div className="alert-section">
                              <div className="alert-section-title">
                                <span className="section-icon">🎯</span> IOC INDICATORS
                              </div>
                              <div className="ioc-tags">
                                {alert.iocIndicators.map((ioc, idx) => (
                                  <span key={idx} className="ioc-tag">
                                    {ioc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Affected Systems */}
                          <div className="alert-section">
                            <div className="alert-section-title">AFFECTED SYSTEMS</div>
                            <div className="systems-list">
                              {alert.affectedSystems.map((system, idx) => (
                                <span key={idx} className="system-tag">
                                  {system}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="alert-expand-icon">{expandedAlert === alert.id ? '▼' : '▶'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No alerts for this tenant
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  // Helper function to calculate age of an alert
  const getAlertAge = (createdAt: string): { hours: number; text: string; color: string; ageCategory: string } => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    let text: string;
    let color: string;
    let ageCategory: string;
    
    if (days > 0) {
      text = `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      text = `${hours}h`;
    } else {
      const minutes = Math.floor(diffMs / (1000 * 60));
      text = `${minutes}m`;
    }
    
    // Color based on age - older = more urgent
    if (hours >= 72) {
      color = '#dc2626'; // Red - critical aging
      ageCategory = 'overdue';
    } else if (hours >= 24) {
      color = '#f97316'; // Orange - needs attention
      ageCategory = 'delayed';
    } else if (hours >= 4) {
      color = '#eab308'; // Yellow - aging
      ageCategory = 'warning';
    } else {
      color = '#22c55e'; // Green - fresh
      ageCategory = 'good';
    }
    
    return { hours, text, color, ageCategory };
  };

  // Get oldest unresolved alert for a tenant
  const getOldestUnresolvedAlert = (tenantId: string): MockAlert | null => {
    const unresolvedAlerts = MOCK_ALERTS.filter(a => a.tenantId === tenantId && a.status !== 'resolved');
    if (unresolvedAlerts.length === 0) return null;
    return unresolvedAlerts.reduce((oldest, current) => 
      new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest
    );
  };

  // Get priority score (higher = more urgent)
  const getTenantPriorityScore = (tenantId: string): number => {
    const unresolvedAlerts = MOCK_ALERTS.filter(a => a.tenantId === tenantId && a.status !== 'resolved');
    if (unresolvedAlerts.length === 0) return 0;
    
    let score = 0;
    unresolvedAlerts.forEach(alert => {
      const age = getAlertAge(alert.createdAt);
      const severityMultiplier = alert.severity === 'critical' ? 4 : alert.severity === 'high' ? 3 : alert.severity === 'medium' ? 2 : 1;
      score += (age.hours + 1) * severityMultiplier;
    });
    return score;
  };

  // Sort tenants by priority (highest first)
  const sortedTenants = [...TENANTS].sort((a, b) => getTenantPriorityScore(b.id) - getTenantPriorityScore(a.id));

  if (selectedTenant) {
    return <TenantDetailPage tenantId={selectedTenant} onBack={() => setSelectedTenant(null)} />;
  }

  const totalAlerts = MOCK_ALERTS.length;
  const criticalCount = MOCK_ALERTS.filter(a => a.severity === 'critical').length;
  const openCount = MOCK_ALERTS.filter(a => a.status === 'open').length;
  
  // Find oldest unresolved alert across all tenants
  const oldestUnresolved = MOCK_ALERTS
    .filter(a => a.status !== 'resolved')
    .reduce((oldest, current) => 
      !oldest || new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest
    , null as MockAlert | null);
  const oldestAge = oldestUnresolved ? getAlertAge(oldestUnresolved.createdAt) : null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">🛡️ Blackpoint Tenant Monitor</h1>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Total Alerts</div>
              <div className="kpi-value blue">{totalAlerts}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Critical</div>
              <div className="kpi-value red">{criticalCount}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Open Issues</div>
              <div className="kpi-value orange">{openCount}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Monitored Tenants</div>
              <div className="kpi-value green">{TENANTS.length}</div>
            </div>
            <div className={`kpi-card ${oldestAge && oldestAge.hours >= 24 ? 'highlight' : ''}`}>
              <div className="kpi-label">Oldest Open Alert</div>
              <div className="kpi-value" data-age={oldestAge?.ageCategory || 'good'}>
                {oldestAge ? oldestAge.text : '—'}
              </div>
              {oldestUnresolved && (
                <div className="kpi-subtitle">
                  {TENANTS.find(t => t.id === oldestUnresolved.tenantId)?.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Priority Ranking Table */}
        <div className="priority-section">
          <h2 className="section-title">
            🚨 Remediation Priority Queue
            <span className="section-subtitle">(sorted by urgency)</span>
          </h2>
          <div className="table-container">
            <table className="priority-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">PRIORITY</th>
                  <th className="table-header">CLIENT</th>
                  <th className="table-header">OLDEST TICKET AGE</th>
                  <th className="table-header">SEVERITY</th>
                  <th className="table-header">OPEN ALERTS</th>
                  <th className="table-header">PRIORITY SCORE</th>
                  <th className="table-header text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {sortedTenants.map((tenant, index) => {
                  const oldestAlert = getOldestUnresolvedAlert(tenant.id);
                  const unresolvedCount = MOCK_ALERTS.filter(a => a.tenantId === tenant.id && a.status !== 'resolved').length;
                  const criticalCount = MOCK_ALERTS.filter(a => a.tenantId === tenant.id && a.severity === 'critical' && a.status !== 'resolved').length;
                  const priorityScore = getTenantPriorityScore(tenant.id);
                  const age = oldestAlert ? getAlertAge(oldestAlert.createdAt) : null;
                  
                  if (unresolvedCount === 0) return null; // Skip tenants with no open alerts
                  
                  return (
                    <tr 
                      key={tenant.id} 
                      className={`table-row ${index === 0 ? 'top-priority' : ''}`}
                      onClick={() => setSelectedTenant(tenant.id)}
                    >
                      <td className="table-cell">
                        <div className={`priority-badge ${index === 0 ? 'first' : index === 1 ? 'second' : 'default'}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="client-name">{tenant.name}</div>
                        <div className="client-domain">{tenant.domain}</div>
                      </td>
                      <td className="table-cell" data-age={age?.ageCategory}>
                        {age && (
                          <div className="age-display">
                            <span className="age-value">
                              {age.text}
                            </span>
                            {age.hours >= 24 && (
                              <span className="overdue-badge">OVERDUE</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        {oldestAlert && (
                          <span className={`severity-badge ${oldestAlert.severity}`}>
                            {oldestAlert.severity}
                          </span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="alerts-count">
                          <span className="count-value">{unresolvedCount}</span>
                          {criticalCount > 0 && (
                            <span className="critical-note">({criticalCount} critical)</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="score-display">
                          <div className="score-bar">
                            <div 
                              className={`score-fill ${priorityScore > 300 ? 'critical' : priorityScore > 150 ? 'high' : 'medium'} w-${Math.round(Math.min(100, priorityScore / 5) / 10) * 10}`}
                            ></div>
                          </div>
                          <span className="score-value">{priorityScore}</span>
                        </div>
                      </td>
                      <td className="table-cell text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTenant(tenant.id);
                          }}
                          className="btn-primary"
                        >
                          Investigate →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="section-title large">Monitored Tenants</h2>
        <div className="tenant-grid">
          {TENANTS.map(tenant => {
            const tenantAlerts = MOCK_ALERTS.filter(a => a.tenantId === tenant.id);
            const criticalAlerts = tenantAlerts.filter(a => a.severity === 'critical');
            const hasAlerts = tenantAlerts.length > 0;
            const oldestAlert = getOldestUnresolvedAlert(tenant.id);
            const oldestAlertAge = oldestAlert ? getAlertAge(oldestAlert.createdAt) : null;
            const unresolvedCount = MOCK_ALERTS.filter(a => a.tenantId === tenant.id && a.status !== 'resolved').length;

            return (
              <div
                key={tenant.id}
                onClick={() => setSelectedTenant(tenant.id)}
                className={`tenant-card ${criticalAlerts.length > 0 ? 'critical' : hasAlerts ? 'warning' : ''}`}
              >
                {/* Alert Badge */}
                {hasAlerts && (
                  <div className={`card-alert-badge ${criticalAlerts.length > 0 ? 'critical' : 'warning'}`}>
                    {tenantAlerts.length}
                  </div>
                )}

                <div className="card-header">
                  <div className="tenant-avatar">
                    {tenant.name.substring(0, 2)}
                  </div>
                  <div className="tenant-info">
                    <h3 className="tenant-name">{tenant.name}</h3>
                    <p className="tenant-domain">{tenant.domain}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="card-stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">Status</div>
                    <div className="stat-value green">● Active</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Open</div>
                    <div className={`stat-value bold ${unresolvedCount > 0 ? 'orange' : 'green'}`}>{unresolvedCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Total</div>
                    <div className="stat-value bold blue">{tenantAlerts.length}</div>
                  </div>
                </div>

                {/* Oldest Ticket Age */}
                {oldestAlertAge && (
                  <div className={`oldest-ticket-box ${oldestAlertAge.hours >= 24 ? 'overdue' : ''}`} data-age={oldestAlertAge.ageCategory}>
                    <div className="oldest-ticket-label">OLDEST OPEN TICKET</div>
                    <div className="oldest-ticket-content">
                      <div>
                        <span className="oldest-ticket-age">
                          {oldestAlertAge.text}
                        </span>
                        {oldestAlertAge.hours >= 24 && (
                          <span className="overdue-badge small">OVERDUE</span>
                        )}
                      </div>
                      <span className={`severity-badge-small ${oldestAlert?.severity}`}>
                        {oldestAlert?.severity}
                      </span>
                    </div>
                    <div className="oldest-ticket-title">
                      {oldestAlert?.title}
                    </div>
                  </div>
                )}

                {!oldestAlertAge && (
                  <div className="oldest-ticket-box clear">
                    <span className="clear-text">✓ No open tickets</span>
                  </div>
                )}

                <div className="card-footer">
                  Created: {new Date(tenant.created).toLocaleDateString()}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTenant(tenant.id);
                  }}
                  className="btn-primary full-width"
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
