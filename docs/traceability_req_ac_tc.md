# Traceability — REQ → AC → Test Cases / BDD (Lab 10)

| Requirement (REQ-###) | Acceptance Criteria | Test Cases (TC-###) | BDD Scenario |
|---|---|---|---|
| REQ-001 — Structured Intake Form | Mandatory sections exist; Submission blocked if incomplete | TC-001, TC-002 | Feature: Intake / Scenario: Incomplete intake blocked |
| REQ-002 — Mandatory Field Validation | Missing fields highlighted; Submission disabled | TC-003 | Feature: Intake / Scenario: Missing required fields |
| REQ-003 — DR Evidence Verification | DR evidence required; Transition blocked without evidence | TC-004, TC-005 | Feature: Evidence / Scenario: Missing DR document |
| REQ-005 — Evidence Reference Storage | Evidence link stored; Timestamp recorded | TC-006 | Feature: Evidence / Scenario: Evidence upload stored |
| REQ-006 — Data Minimization Enforcement (Variant) | Only approved fields visible; Justification logged | TC-007, TC-008 | Feature: GDPR / Scenario: Phone number blocked |
| REQ-007 — Configurable Retention Period (Variant/NFR) | Retention configurable; Changes logged | TC-009 | Feature: Governance / Scenario: Retention policy updated |
| REQ-008 — Automatic Anonymization (Variant) | Old data anonymized; Audit entry created | TC-010 | Feature: GDPR / Scenario: Automatic anonymization |
| REQ-009 — Immutable Audit Log (Variant) | Log immutable; Searchable by date/user | TC-011, TC-012 | Feature: Governance / Scenario: Audit log creation |
| REQ-010 — Evidence Freshness Rule | Evidence older than 30 days rejected | TC-013 | Feature: Evaluation / Scenario: Stale evidence rejected |
| NFR-003 — Encryption at Rest | AES-256 encrypted values verified | TC-014 |  |
| NFR-005 — Retention Enforcement Timing | Data anonymized within 48h | TC-015 |  |
