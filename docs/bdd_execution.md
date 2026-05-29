# BDD Execution Report — Lab 13

## Environment

* Language: Python 3.14.3
* Framework: PyTest-BDD 8.1.0
* Operating System: Windows 11

## Feature File Executed

* `bdd/features/lab13.feature`

## Step Definitions

* `bdd/steps/test_lab13_steps.py`

## Execution Command

Run all BDD scenarios:

```bash
python -m pytest bdd/steps/test_lab13_steps.py -v
```

## Execution Results

| Scenario                                       | Result |
| ---------------------------------------------- | ------ |
| Happy Path - Valid stakeholder registration    | PASSED |
| Negative Path - Phone number detected in email | PASSED |
| Alternative Flow - Future evidence accepted    | PASSED |
| Boundary Test - Exactly 30 days old evidence   | PASSED |

## Summary

* Total scenarios executed: 4
* Passed: 4
* Failed: 0
* Success rate: 100%

## Requirements Covered

* REQ-001 — Restrict Stakeholder Data Collection
* REQ-006 — Data Minimization Enforcement
* REQ-010 — Evidence Freshness Rule

## Evidence

BDD scenarios executed successfully using PyTest-BDD and validated expected behavior against acceptance criteria and business rules.
