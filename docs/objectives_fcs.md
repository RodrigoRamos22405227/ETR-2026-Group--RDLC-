# Objectives & Critical Success Factors (CSFs) — Lab 4

## Variant
- **Variant number:** 9
- **Persona:** Privacy Officer / Legal Representative
- **Key constraint focus:** GDPR-style data minimization and data retention control.

---

## Objectives (3)

### OBJ-1 — Ensure Strict Data Minimization & Security During Intake
- **Description (why/outcome):** To guarantee compliance with GDPR principles by ensuring the system collects only the absolute minimum personal data necessary and protects it securely at rest.
- **Stakeholders impacted:** Privacy Officer, Transition Lead, Client Stakeholders.
- **Success signal (how we know):** The system actively blocks the submission of non-essential personal information (like phone numbers) and all stored PII is encrypted, resulting in zero compliance breaches during audits.
- **Variant-driven:** Yes

#### Linked CSF & Requirements
- **CSF-1:** The user interface and data layer must actively restrict input fields to essential corporate identifiers and apply AES-256 encryption to all stored personal data.
- **Mapped Requirements:**
  - REQ-001: Restrict Stakeholder Data Collection
  - REQ-006: AES-256 Encryption for Intake PII

### OBJ-2 — Enforce Automated Data Retention & Access Auditing
- **Description:** To mitigate legal risk by ensuring that no sensitive intake data is kept longer than strictly necessary, and that all access to sensitive evidence is strictly tracked.
- **Stakeholders impacted:** Privacy Officer, Legal Representative.
- **Success signal:** Automated background jobs successfully purge 100% of abandoned intake drafts after 30 days of inactivity, and every file access generates an immutable audit log.
- **Variant-driven:** Yes

#### Linked CSF & Requirements
- **CSF-2:** The system must reliably execute hard-deletion protocols without manual intervention and maintain a tamper-proof ledger of all evidence interactions.
- **Mapped Requirements:**
  - REQ-002: Automated 30-Day Purge for Abandoned Intake Sessions
  - REQ-003: Immutable Audit Trail for Sensitive Evidence Access

### OBJ-3 — Streamline Intake Validation for Clear Decision Outcomes
- **Description:** To accelerate the AMS transition phase by providing clear, automated validation of uploaded evidence and data, allowing the team to quickly reach a "Ready to Proceed" or "Need More Data" decision.
- **Stakeholders impacted:** Transition Lead, AMS Engineer.
- **Success signal:** The system automatically processes intake sessions, rejects stale or unauthorized evidence, and generates clear deficit reports when information is missing.
- **Variant-driven:** No

#### Linked CSF & Requirements
- **CSF-3:** The system must accurately parse evidence metadata (e.g., creation dates, authorizations) and cross-reference it with business rules to automate the transition decision engine.
- **Mapped Requirements:**
  - REQ-004: Intake Decision Engine Validation
  - REQ-005: Discovery Deficit Reporting
  - REQ-007: Stale Evidence Rejection Rule
  - REQ-008: Stakeholder Authority Consistency Check
