# BDD Automation Report — Lab 13

## Tool used

* PyTest-BDD
* Language/stack: Python 3.14.3
* Version: PyTest-BDD 8.1.0

## How to run

* Command:

  * `python -m pytest bdd/steps/test_lab13_steps.py -v`

## Execution results

* Date: 2026-05-29
* Scenarios executed: 4
* Passed: 4
* Failed: 0

## Notes

### What worked well

* BDD scenarios were successfully automated using PyTest-BDD.
* All scenarios executed without errors.
* Traceability between requirements and scenarios was maintained.
* GDPR-related validation rules were correctly validated.
* Evidence freshness validation behaved as expected.

### What failed and why (if anything)

* Initial execution failed because the step definitions did not use `target_fixture`, causing fixture resolution errors in PyTest-BDD.
* The issue was corrected by defining explicit fixtures for scenario results.

### Next steps (improvements)

* Add additional BDD scenarios for audit logging (REQ-009).
* Add BDD scenarios for automatic anonymization after retention expiry (REQ-008).
* Automate execution in a CI/CD pipeline.
* Expand coverage with additional alternative and exception flows.
