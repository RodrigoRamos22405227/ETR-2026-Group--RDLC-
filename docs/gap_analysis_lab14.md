# Gap Analysis — Lab 14

## REQs with no test coverage

* REQ-002 — Mandatory Field Validation

  * Action: Link existing validation tests and create future BDD scenario for missing mandatory fields.

* REQ-005 — Evidence Reference Storage

  * Action: Covered by TC-006 but no automated test exists yet. Future integration test recommended.

## Tests/scenarios with no REQ link

* No orphan test cases identified.
* No orphan BDD scenarios identified.

All current test assets have traceability links to at least one requirement.

## AC items not covered by tests

* REQ-007 — Retention configuration changes are logged.

  * Action: Add future integration test validating audit logging of retention changes.

* REQ-008 — Audit log entry is created upon anonymization.

  * Action: Add future system test validating anonymization audit records.

* NFR-005 — Personal data anonymized within 48 hours after retention expiry.

  * Action: Create automated retention-job simulation test.

## Actions completed in this lab

1. Consolidated traceability into a single master matrix.
2. Reviewed all requirements against available test assets.
3. Verified BDD scenario traceability.
4. Identified uncovered acceptance criteria.
5. Recorded improvement actions for future testing cycles.
    