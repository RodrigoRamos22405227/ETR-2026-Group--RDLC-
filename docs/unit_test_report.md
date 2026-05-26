# Unit Test Report — Lab 12

## Selected scope (max 3 requirements)

### REQ-006 — Data Minimization Enforcement
Automated AC:
- Reject phone number patterns inside stakeholder fields
- Reject invalid or empty stakeholder email inputs
- Allow valid corporate emails only

### REQ-009 — Immutable Audit Log
Automated AC:
- Generate audit log entries successfully
- Store mandatory audit fields
- Validate audit action structure

### REQ-010 — Evidence Freshness Rule
Automated AC:
- Reject stale evidence older than 30 days
- Accept evidence within freshness window
- Validate 30-day boundary condition

---

## Tests implemented (12)

| Test ID | Test Name | REQ | AC Covered | Type | Notes |
|---|---|---|---|---|---|
| UT-01 | test_valid_email | REQ-006 | Valid corporate email | Happy Path | Valid company email accepted |
| UT-02 | test_valid_evidence_date | REQ-010 | Fresh evidence validation | Happy Path | Recent evidence accepted |
| UT-03 | test_create_audit_log | REQ-009 | Audit log generation | Happy Path | Log entry created |
| UT-04 | test_company_email_with_numbers_is_valid | REQ-006 | Email validation | Happy Path | Numbers allowed in corporate email |
| UT-05 | test_future_evidence_date_is_valid | REQ-010 | Future evidence handling | Happy Path | Future date accepted |
| UT-06 | test_audit_log_action_saved | REQ-009 | Audit action logging | Happy Path | Action stored correctly |
| UT-07 | test_uppercase_corporate_email_is_valid | REQ-006 | Email normalization | Happy Path | Uppercase email accepted |
| UT-08 | test_audit_log_contains_action_key | REQ-009 | Audit log structure | Happy Path | Action key exists |
| UT-09 | test_phone_number_inside_email | REQ-006 | GDPR validation | Negative | Phone number blocked |
| UT-10 | test_old_evidence_rejected | REQ-010 | Evidence freshness rule | Negative | Old evidence rejected |
| UT-11 | test_empty_email_rejected | REQ-006 | Empty input validation | Negative | Empty email rejected |
| UT-12 | test_boundary_30_days | REQ-010 | 30-day boundary rule | Boundary | Exactly 30 days accepted |

---

## Coverage checklist

- Happy path tests: 8
- Negative/error tests: 3
- Boundary tests: 1

---

## Execution evidence

- Date:
  - 2026-05-26

- Commands used:
  - `python -m pytest`
  - `python -m pytest tests/unit/test_validation.py`
  - `python -m pytest -k test_valid_email`

- Result summary:
  - Total tests run: 12
  - Passed: 12
  - Failed: 0

- Console evidence:
  - Full suite execution completed successfully
  - Single file execution completed successfully
  - Single isolated test execution completed successfully

- Notes:
  - All unit tests passed successfully.
  - The project supports full test-suite execution and isolated test execution.