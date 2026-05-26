# Test-First Log — Lab 11

## Selected scope (max 3 requirements)

- REQ-006
  - AC used:
    - Block phone numbers
    - Approved fields only

- REQ-010
  - AC used:
    - Reject evidence older than 30 days

- REQ-009
  - AC used:
    - Audit log generation

## Tests written first (list)

- T-01: Validate corporate email
- T-02: Validate evidence freshness
- T-03: Create audit log
- T-04: Reject phone numbers in email
- T-05: Reject stale evidence
- T-06: Boundary test for 30-day evidence

## Results

- Initial run:
  - Tests failed because validation functions did not exist.

- After implementation:
  - All 6 tests passed.

## Implementation notes

- Created validation.py
- Added GDPR validation logic
- Added evidence freshness validation
- Added audit log simulation

## BDD scenarios

- Feature: lab11.feature

Scenario 1:
- Valid stakeholder registration

Scenario 2:
- GDPR validation failure

## Lessons learned

- GDPR rules must be explicit.
- Boundary testing improved requirement clarity.
- Test-first development reduced ambiguity.