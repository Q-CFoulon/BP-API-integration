# Gap Analysis: Blackpoint Coverage vs. Microsoft Defender XDR

**Date:** March 27, 2026  
**Purpose:** Identify coverage gaps where Blackpoint does not provide equivalent capability to Microsoft Defender XDR, based on Blackpoint's own positioning statement and known API/integration limitations.

---

## Executive Summary

Blackpoint positions itself as a **post-compromise, tradecraft-focused MDR** with a 24/7 human SOC. Microsoft Defender XDR is a **full-spectrum prevention + detection + response platform** spanning endpoint, identity, email, cloud apps, and cloud workloads. Blackpoint explicitly states it does not replace preventative controls or mailbox-level scanning, meaning **significant coverage gaps exist** in email security, cloud app security, vulnerability management, attack surface reduction, and automated investigation/remediation.

The table below categorizes gaps by severity. **Critical gaps** represent areas where neither Blackpoint nor a basic M365 license provides coverage — these need Defender XDR licensing or a third-party tool. **Moderate gaps** represent areas where Blackpoint provides partial or indirect coverage. **Covered** areas are where Blackpoint's statement confirms direct or managed capability.

---

## Coverage Matrix

| # | Defender XDR Capability | Blackpoint Coverage | Gap Severity | Notes |
|---|------------------------|---------------------|-------------|-------|
| **ENDPOINT** | | | | |
| 1 | Endpoint Detection & Response (EDR) | ✅ Managed via integrated EDR platforms | **Low** | BP relies on partner EDR (e.g., SentinelOne, CrowdStrike, Defender for Endpoint). Behavioral/ML detections investigated by SOC. |
| 2 | Next-Gen Antivirus / Real-time AV | ✅ Managed via Defender AV | **Low** | Explicitly stated: "Real-time AV, cloud-delivered protection, and file reputation via Microsoft Defender Antivirus, fully monitored." |
| 3 | Attack Surface Reduction (ASR) Rules | ❌ Not covered | **CRITICAL** | Defender XDR provides ASR rules (block Office macros, credential stealing from LSASS, obfuscated scripts, etc.). Blackpoint does not mention ASR management or equivalent. |
| 4 | Threat & Vulnerability Management (TVM) | ❌ Not covered | **CRITICAL** | Defender XDR continuously inventories software, identifies CVEs, prioritizes vulnerabilities, and recommends remediation. Blackpoint has no vulnerability management capability. |
| 5 | Automated Investigation & Remediation (AIR) | ⚠️ Partial — human-led | **Moderate** | Defender XDR auto-investigates alerts and can auto-remediate. Blackpoint does isolate/disable/kill but is human-led, meaning response latency depends on analyst availability. |
| 6 | Device Health & Compliance Posture | ❌ Not covered | **Moderate** | Defender XDR reports device health, onboarding status, sensor health, and compliance posture. BP API has asset data but no health/compliance scoring. |
| 7 | Web Content Filtering / Network Protection | ❌ Not covered | **Moderate** | Defender for Endpoint provides web filtering, network protection, and indicators of compromise (IoC) blocking at the endpoint level. Not mentioned by Blackpoint. |
| **IDENTITY** | | | | |
| 8 | On-Prem AD Threat Detection (Defender for Identity) | ⚠️ Partial | **Moderate** | BP detects PtH/PtT, credential misuse, lateral movement. But Defender for Identity also covers: reconnaissance (LDAP/DNS enumeration), DCSync, Golden Ticket, skeleton key, AD delegation abuse. BP scope unclear on these. |
| 9 | Risky Sign-In Detection (Entra ID Protection) | ✅ Correlated by SOC | **Low** | Statement confirms: "risky sign-ins, password spray attempts, token misuse, and compromised credentials." |
| 10 | Conditional Access Enforcement | ❌ Not covered | **CRITICAL** | Defender XDR + Entra ID enforce Conditional Access policies (block/require MFA based on risk). Blackpoint detects risk but does **not** enforce access policies. |
| 11 | Identity Governance & Privileged Identity Management | ❌ Not covered | **CRITICAL** | Defender XDR integrates with Entra PIM for just-in-time admin access, access reviews, and entitlement management. Blackpoint has no governance capability. |
| **EMAIL** | | | | |
| 12 | Email Threat Protection (Defender for Office 365) | ❌ Not covered | **CRITICAL** | Defender for Office 365 provides: Safe Attachments (sandboxing), Safe Links (URL detonation), anti-phishing (impersonation protection, BEC detection), and anti-spam. **Blackpoint explicitly states it does not do mailbox-level scanning.** |
| 13 | Zero-Hour Auto Purge (ZAP) | ❌ Not covered | **CRITICAL** | Defender retroactively removes malicious emails post-delivery. Blackpoint has no email remediation capability. |
| 14 | Attack Simulation Training | ❌ Not covered | **Moderate** | Defender provides phishing simulation and security awareness training. Not in Blackpoint's scope. |
| 15 | Threat Explorer / Email Investigation | ❌ Not covered | **CRITICAL** | Defender provides deep email investigation (trace delivery, view headers, identify recipients of campaign). Blackpoint has no email telemetry. |
| **CLOUD APPS** | | | | |
| 16 | Cloud App Security / CASB (Defender for Cloud Apps) | ❌ Not covered | **CRITICAL** | Defender for Cloud Apps provides: shadow IT discovery, OAuth app governance, SaaS DLP, session controls, anomaly detection for cloud apps (impossible travel, mass file download, etc.). Blackpoint does not cover SaaS app security. |
| 17 | OAuth App Governance | ❌ Not covered | **CRITICAL** | Defender governs OAuth apps accessing M365 data (consent phishing, overprivileged apps). Not in Blackpoint scope. |
| 18 | Cloud DLP (Data Loss Prevention) | ❌ Not covered | **CRITICAL** | Defender + Purview provides DLP across email, SharePoint, OneDrive, Teams, and endpoints. Blackpoint has no DLP capability. |
| **CLOUD WORKLOADS** | | | | |
| 19 | Cloud Security Posture Management (CSPM) | ❌ Not covered | **CRITICAL** | Defender for Cloud assesses Azure/AWS/GCP misconfigurations (open storage, weak NSGs, missing encryption). Blackpoint has no cloud posture management. |
| 20 | Cloud Workload Protection (CWP) | ❌ Not covered | **CRITICAL** | Defender for Cloud protects VMs, containers, databases, storage, and Key Vault in Azure/AWS/GCP. Not in Blackpoint scope. |
| 21 | Container & Kubernetes Security | ❌ Not covered | **Moderate** | Defender for Containers provides runtime protection, image scanning, and Kubernetes threat detection. |
| **CROSS-DOMAIN** | | | | |
| 22 | Unified Incident Correlation (XDR) | ✅ Covered | **Low** | Blackpoint confirms: "Correlates signals across endpoint, identity, and network activity into a single incident with a unified timeline." However, this does NOT include email or cloud app signals. |
| 23 | Advanced Hunting (KQL) | ❌ Not covered | **CRITICAL** | Defender XDR provides KQL-based threat hunting across all telemetry (endpoint, identity, email, cloud apps). Blackpoint does not expose raw telemetry or hunting tools to partners. |
| 24 | Threat Intelligence (TI) | ⚠️ Partial | **Moderate** | Defender XDR integrates Microsoft Threat Intelligence (nation-state tracking, campaign correlation, IoC feeds). Blackpoint mentions dark-web credential exposure but no broader TI platform. |
| 25 | SOAR / Automated Playbooks | ❌ Not covered | **CRITICAL** | Defender XDR + Sentinel provides Logic Apps / SOAR playbooks for automated triage, enrichment, and response. Blackpoint's response is human-led only. |
| 26 | Custom Detection Rules | ❌ Not covered | **Moderate** | Defender XDR allows custom detection rules via KQL. Blackpoint detection logic is managed internally — partners cannot create custom detections. |
| 27 | Secure Score / Security Posture | ❌ Not covered | **Moderate** | Microsoft Secure Score provides actionable recommendations to improve security posture. Blackpoint does not provide posture management. |

---

## Critical Gaps Requiring Coverage

These are the areas where Blackpoint provides **zero coverage** and the risk is significant:

### 1. Email Security (Defender for Office 365)
**Risk: HIGH — Email is the #1 initial access vector**
- No phishing protection, no safe attachments/links, no BEC detection, no ZAP
- Blackpoint explicitly defers this to "platform-native tools"
- **Action Required:** Deploy Microsoft Defender for Office 365 Plan 2 (or equivalent) for all mailboxes
- **License:** Microsoft 365 E5 Security, or Defender for Office 365 P2 add-on

### 2. Cloud App Security / CASB
**Risk: HIGH — Unmonitored SaaS apps are a major exfiltration & lateral movement vector**
- No shadow IT discovery, no OAuth app control, no session policies, no SaaS anomaly detection
- **Action Required:** Deploy Microsoft Defender for Cloud Apps
- **License:** Microsoft 365 E5 Security, or Defender for Cloud Apps add-on

### 3. Cloud Security Posture Management (CSPM) & Cloud Workload Protection
**Risk: HIGH for organizations with Azure/AWS/GCP workloads**
- No misconfiguration detection, no workload protection, no container security
- **Action Required:** Deploy Microsoft Defender for Cloud (Foundational CSPM is free; Defender plans for workload protection)
- **License:** Azure-native, pay-per-resource for Defender plans

### 4. Attack Surface Reduction (ASR)
**Risk: MEDIUM-HIGH — Preventative controls that block common initial access techniques**
- Blackpoint detects post-compromise behavior but does not harden the attack surface
- ASR rules block: Office macro execution, credential theft from LSASS, script obfuscation, unsigned USB executables
- **Action Required:** Configure ASR rules via Intune/GPO on all endpoints
- **License:** Included with Defender for Endpoint P2 / M365 E5

### 5. Threat & Vulnerability Management
**Risk: MEDIUM-HIGH — Unpatched vulnerabilities enable the initial access BP detects later**
- No CVE tracking, no software inventory risk scoring, no remediation prioritization
- **Action Required:** Enable Defender Vulnerability Management (or Qualys/Tenable/Rapid7)
- **License:** Defender Vulnerability Management add-on or included in M365 E5 Security

### 6. Data Loss Prevention (DLP)
**Risk: MEDIUM-HIGH — No prevention of data exfiltration across email, cloud, or endpoint**
- **Action Required:** Deploy Microsoft Purview DLP policies
- **License:** Microsoft 365 E5 Compliance or Purview add-on

### 7. Conditional Access Enforcement
**Risk: MEDIUM-HIGH — Detection without enforcement means risky sessions continue**
- Blackpoint detects risky sign-ins but cannot enforce Conditional Access policies
- **Action Required:** Configure Entra ID Conditional Access with risk-based policies
- **License:** Entra ID P2 (included in M365 E5)

### 8. Advanced Hunting & Custom Detections
**Risk: MEDIUM — Limits proactive threat hunting capability for internal security teams**
- No partner-accessible query language or raw telemetry
- **Action Required:** If proactive hunting is needed, Defender XDR Advanced Hunting or Microsoft Sentinel
- **License:** M365 E5 Security (Advanced Hunting) or Sentinel (pay-per-GB)

### 9. SOAR / Automated Playbooks
**Risk: MEDIUM — All response is human-dependent, creating scalability constraints**
- **Action Required:** Deploy Sentinel + Logic Apps for automated triage/enrichment if scale requires it
- **License:** Microsoft Sentinel (pay-per-GB)

---

## Blackpoint API-Specific Gaps (Operational Visibility)

Based on our API integration testing (see [API_LIMITATIONS.md](API_LIMITATIONS.md)), additional operational gaps exist:

| Gap | Impact | Status |
|-----|--------|--------|
| `/incidents` endpoint returns 403 | Cannot pull incident data programmatically | Pending role grant from Blackpoint |
| No `/alerts` or `/detections` endpoints | Cannot build automated alerting pipelines | Confirmed 404 — endpoints do not exist |
| No webhook/push notification API | Must poll or use portal manually | Unknown if available |
| No reporting/analytics endpoints | Cannot pull SOC performance metrics via API | Confirmed 404 |
| 90-day data retention on alert-groups | Cannot query historical detections beyond 90 days | API limitation |
| No custom detection rules API | Cannot extend detection coverage programmatically | Not available |

---

## Recommended Licensing Strategy

To close the **critical gaps** identified above, the minimum Microsoft licensing needed:

| License | Covers Gaps | Per-User/Month (approx.) |
|---------|-------------|--------------------------|
| **Microsoft 365 E5 Security** | Defender for Endpoint P2, Defender for Office 365 P2, Defender for Identity, Defender for Cloud Apps, Entra ID P2 | ~$38/user/mo |
| **OR** Individual add-ons: | | |
| Defender for Office 365 P2 | Email security (#1 gap) | ~$5/user/mo |
| Defender for Cloud Apps | CASB, OAuth governance (#2 gap) | ~$3.50/user/mo |
| Entra ID P2 | Conditional Access, PIM (#7 gap) | ~$9/user/mo |
| **Azure-based (consumption):** | | |
| Defender for Cloud (CSPM + CWP) | Cloud posture & workload protection (#3 gap) | Pay-per-resource |
| Microsoft Sentinel | SIEM/SOAR, Advanced Hunting (#8, #9 gaps) | ~$2.46/GB ingested |

> **Note:** If already on M365 E5, most critical gaps (email, cloud apps, identity governance, conditional access) are covered by existing licensing — they just need to be **enabled and configured**.

---

## Summary: What Blackpoint Does Well vs. Where You Need Coverage

### Blackpoint Strengths (Keep)
- ✅ 24/7 human-led SOC with real-time response (device isolation, user disable, process kill)
- ✅ Tradecraft-focused detection (lateral movement, living-off-the-land, ransomware staging)
- ✅ Cross-signal correlation (endpoint + identity + network → unified incident timeline)
- ✅ Managed EDR/AV monitoring (Defender AV fully monitored)
- ✅ Identity threat detection (risky sign-ins, credential compromise, dark web exposure)
- ✅ Fast mean-time-to-respond for active breaches

### Must Supplement (Defender XDR or equivalent)
- ❌ Email security (phishing, BEC, safe attachments/links, ZAP)
- ❌ Cloud app security (CASB, OAuth governance, shadow IT)
- ❌ Cloud posture management (CSPM for Azure/AWS/GCP)
- ❌ Attack surface reduction (ASR rules, endpoint hardening)
- ❌ Vulnerability management (CVE tracking, patch prioritization)
- ❌ Data loss prevention (email, endpoint, cloud DLP)
- ❌ Conditional access enforcement (risk-based access policies)
- ❌ Automated playbooks / SOAR (scalable automated response)
- ❌ Advanced hunting / custom detection rules (proactive threat hunting)
- ❌ Security posture scoring (Microsoft Secure Score equivalent)
