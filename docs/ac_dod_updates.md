# AC & DoD Updates — Lab 10

## Acceptance Criteria improvements

### Item 1 (variant-driven)

- Requirement: REQ-006 — Data Minimization Enforcement

- Before:
  - "Only approved personal data fields are visible."

- After:
  - "The Stakeholder form shall only display the fields 'Corporate Email' and 'System Role'. Fields for First Name, Last Name, Phone Number, or Address must not exist in the UI or database schema."

- Why changed:
  - The original AC was too vague and allowed AI-generated feature drift during Lab 8 prototype generation.

---

### Item 2

- Requirement: REQ-010 — Evidence Freshness Rule

- Before:
  - "Evidence older than 30 days triggers validation error."

- After:
  - "If the evidence issue date is more than 30 calendar days older than the current UTC date, the system shall block evaluation and display the exact filename causing rejection."

- Why changed:
  - Testing revealed ambiguity about timezone handling and user feedback specificity.

---

### Item 3

- Requirement: REQ-009 — Immutable Audit Log

- Before:
  - "Logs are searchable by user and date."

- After:
  - "Audit logs shall support filtering by User ID, UTC date range, and Action Type within a maximum response time of 2 seconds."

- Why changed:
  - The original AC was not measurable and lacked performance expectations.

---

## DoD updates

### 1. Proposed DoD change

- Before:
  - "Acceptance criteria are testable/verifiable."

- After:
  - "Acceptance criteria must include measurable expected outcomes and at least one negative or boundary condition."

- Why:
  - Several AC items were too generic and difficult to automate.

---

### 2. Proposed DoD change

- Before:
  - "Implementation meets all AC."

- After:
  - "Implementation meets all AC and has traceability links to related REQ, TC, and BDD scenarios."

- Why:
  - Traceability gaps were discovered during Lab 10 mapping activities.

---

### 3. Proposed DoD change

- Before:
  - "Tests exist."

- After:
  - "Automated validation tests must exist for all GDPR/privacy-related requirements."

- Why:
  - Privacy-related failures represent critical compliance risks and require repeatable verification.
