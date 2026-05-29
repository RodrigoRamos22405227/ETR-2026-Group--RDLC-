# BDD Report — Lab 13

## Project

AMS Intake Platform

## Slice Covered

Intake & Discovery (Privacy & Retention Focus)

## Feature Implemented

### Feature: AMS Intake Platform BDD Validation

The feature validates GDPR-oriented stakeholder registration and evidence freshness rules.

## Scenarios

### Scenario 1 — Happy Path

Valid stakeholder registration using a corporate email.

Related requirements:

* REQ-001
* REQ-006

Expected outcome:

* Registration accepted.

---

### Scenario 2 — Negative Path

Registration attempt using a phone-number-like pattern.

Related requirements:

* REQ-001
* REQ-006

Expected outcome:

* Registration blocked.
* GDPR violation message displayed.

---

### Scenario 3 — Alternative Flow

Evidence submitted with a future date.

Related requirements:

* REQ-010

Expected outcome:

* Evidence accepted.

---

### Scenario 4 — Boundary Test

Evidence exactly 30 days old.

Related requirements:

* REQ-010

Expected outcome:

* Evidence accepted because it is within the allowed freshness window.

## Coverage

| Scenario Type      | Covered |
| ------------------ | ------- |
| Happy Path         | Yes     |
| Alternative Flow   | Yes     |
| Negative/Error     | Yes     |
| Boundary Condition | Yes     |

## Conclusion

BDD scenarios successfully demonstrate business behavior defined by project requirements and acceptance criteria. The scenarios provide traceability between requirements, acceptance criteria, and executable specifications.
