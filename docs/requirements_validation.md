# Requirements Validation — Lab 7

## Participants / roles
- **Client/Stakeholders:** Privacy Officer (Team A Simulation)
- **DevTeam:** AMS DevTeam (Team B Simulation)
- **Facilitator:** Deyve Silva
- **Scribe:** Cristiano Sandu
- **Reviewer:** Luís Almoster
- **Tester:** Rodrigo Ramos

## Selected requirements (6)
- **REQ-001** - Restrict Stakeholder Data Collection (FR) | **Variant impact:** Yes
- **REQ-002** - Automated 30-Day Purge for Abandoned Sessions (NFR) | **Variant impact:** Yes
- **REQ-003** - Immutable Audit Trail for Sensitive Evidence (FR) | **Variant impact:** Yes
- **REQ-004** - Intake Decision Engine Validation (FR) | **Variant impact:** No
- **REQ-005** - Discovery Deficit Reporting (FR) | **Variant impact:** No
- **REQ-006** - AES-256 Encryption for Intake PII (NFR) | **Variant impact:** Yes

## Variant-driven validation questions (min. 3)
1. **[Privacy]** "What happens to the 30-day purge rule if a client formally requests an extension due to legal delays?"
2. **[Data Minimization]** "If we restrict data to just email and role, how does the transition team contact the client in case of an urgent server outage?"
3. **[Audit]** "Who is allowed to read the 'Immutable Audit Trail'? If the Privacy Officer leaves the company, how is access transferred?"

## Validation results

### REQ-001 — Restrict Stakeholder Data Collection
- **Status:** Needs rewrite
- **Issues found:** The requirement says "reject phone numbers", but doesn't specify what happens if an email contains numbers (e.g., `joao123@gmail.com`).
- **Proposed fix (clarify):** Update AC to specify that regex should only block standard phone number *formats*, not all numerical characters.
- **Expected evidence (how to verify):** Demo / Automated UI Test

### REQ-002 — Automated 30-Day Purge for Abandoned Sessions
- **Status:** Valid
- **Issues found:** Missing explicit definition of what constitutes "activity" to reset the 30-day timer.
- **Proposed fix (split/clarify):** Define "activity" as any form save or document upload. Page views do not reset the timer.
- **Expected evidence (how to verify):** Automated Integration Test (Time-travel simulation)

### REQ-003 — Immutable Audit Trail for Sensitive Evidence
- **Status:** Valid
- **Issues found:** The log captures the UTC timestamp, but doesn't mention capturing the IP address, which Legal requested during the roleplay.
- **Proposed fix (rewrite):** Add "User IP Address" to the required fields in the audit log payload.
- **Expected evidence (how to verify):** Inspection of database tables / Demo.

### REQ-004 — Intake Decision Engine Validation
- **Status:** Valid
- **Issues found:** "Need More Data" status could be permanent if the client abandons it. (Conflict with REQ-002 discovered).
- **Proposed fix (clarify):** Ensure REQ-004 acknowledges that "Need More Data" sessions are subject to the 30-day purge rule.
- **Expected evidence (how to verify):** Unit Testing (Decision Logic)

### REQ-005 — Discovery Deficit Reporting
- **Status:** Needs rewrite
- **Issues found:** "Display a diagnostic report" is vague. The client wants to be able to download it as a PDF.
- **Proposed fix (clarify):** Add an acceptance criterion requiring the report to be exportable in PDF format.
- **Expected evidence (how to verify):** Demo.

### REQ-006 — AES-256 Encryption for Intake PII
- **Status:** Valid
- **Issues found:** The DevTeam asked how the encryption keys are rotated. This was not defined.
- **Proposed fix (split):** Keep REQ-006 for the encryption itself, but create a new technical requirement for "Automated Key Rotation".
- **Expected evidence (how to verify):** Architecture Review.
