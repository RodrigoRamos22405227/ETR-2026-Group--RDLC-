# Traceability — Use Cases ↔ Requirements (Lab 6)

## Mapping (UC → REQ)

| Use Case | Linked Requirements (REQ-###) | Notes |
|---|---|---|
| **UC-01:** Register stakeholder details | REQ-001, REQ-006 | Implements data minimization and AES-256 encryption. |
| **UC-02:** Upload authorization evidence | REQ-004 | Captures the physical evidence needed for the decision engine. |
| **UC-03:** Evaluate intake readiness | REQ-004, REQ-007, REQ-008 | Core engine that executes the consistency checks and stale evidence rules. |
| **UC-04:** Generate discovery deficit report | REQ-005, REQ-004 | Directly satisfies the deficit reporting requirement. |
| **UC-05:** Access sensitive evidence | REQ-003, REQ-006 | Ensures immutable audit logs are generated upon viewing PII. |
| **UC-06:** Purge abandoned intake sessions | REQ-002, REQ-006 | Implements the 30-day automated hard-delete GDPR rule. |
| **UC-07:** Verify stakeholder authority | REQ-008 | Extracted from UC-03 as an `<<include>>` to enforce authority consistency. |

## Gaps / Observations (optional)
- **Use case without requirements:** None. All Use Cases trace back to approved requirements.
- **Requirement without use cases:** None. All REQs are operationalized by at least one Use Case.
- **Missing requirement candidates revealed by modeling:** - *Candidate 1:* "The system shall automatically notify the Privacy Officer when an unauthorized transition attempt (Authority Check Failure) occurs." (Revealed during the writing of UC-03 / E2).
