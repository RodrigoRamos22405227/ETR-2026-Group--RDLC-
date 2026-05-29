# Traceability — Requirements ↔ BDD Scenarios (Lab 13)

| Requirement                                    | BDD Feature                        | Scenario                                       | Coverage Type    |
| ---------------------------------------------- | ---------------------------------- | ---------------------------------------------- | ---------------- |
| REQ-001 — Restrict Stakeholder Data Collection | AMS Intake Platform BDD Validation | Happy Path - Valid stakeholder registration    | Happy Path       |
| REQ-001 — Restrict Stakeholder Data Collection | AMS Intake Platform BDD Validation | Negative Path - Phone number detected in email | Negative         |
| REQ-006 — Data Minimization Enforcement        | AMS Intake Platform BDD Validation | Happy Path - Valid stakeholder registration    | Happy Path       |
| REQ-006 — Data Minimization Enforcement        | AMS Intake Platform BDD Validation | Negative Path - Phone number detected in email | Negative         |
| REQ-010 — Evidence Freshness Rule              | AMS Intake Platform BDD Validation | Alternative Flow - Future evidence accepted    | Alternative Flow |
| REQ-010 — Evidence Freshness Rule              | AMS Intake Platform BDD Validation | Boundary Test - Exactly 30 days old evidence   | Boundary         |

## Coverage Summary

### Happy Path

* Valid stakeholder registration

### Alternative Flow

* Future evidence accepted

### Negative Path

* Phone number detected in email

### Boundary Test

* Evidence exactly 30 days old

## Observations

All BDD scenarios are directly traceable to requirements defined in `requirements_v1.md`.

The feature file provides executable specifications that validate:

* GDPR data minimization rules
* Stakeholder registration validation
* Evidence freshness validation
* Boundary conditions for evidence acceptance

This traceability ensures alignment between requirements, acceptance criteria, and executable BDD scenarios.
