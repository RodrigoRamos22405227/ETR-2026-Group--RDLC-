# Test Retrocompatibility — Lab 14

## What changes can break our tests?

### Requirement changes

* Changes to GDPR validation rules may invalidate existing unit tests and BDD scenarios.
* Changes to evidence freshness thresholds may require updates to validation tests.

### UI changes

* Changes to field names such as "Corporate Email" or "System Role" could invalidate manual test cases and BDD scenario descriptions.

### Refactoring

* Renaming functions such as `validate_email()` or `validate_evidence_date()` could break automated unit tests.

### Environment/dependencies

* Changes in PyTest or PyTest-BDD versions could affect test execution.
* Python version upgrades may introduce compatibility issues.

### Test data

* Hard-coded dates used in evidence validation tests may become invalid over time.
* Hard-coded email examples may no longer reflect updated business rules.

## Fragile points (min. 3) + improvements

### 1. Fragile point

* Why fragile:

  * Evidence validation tests use fixed dates (e.g., "2026-04-10").
* Improvement action:

  * Use dynamically generated dates relative to the current execution date.

### 2. Fragile point

* Why fragile:

  * BDD scenarios contain hard-coded email examples.
* Improvement action:

  * Use parameterized examples and reusable test data.

### 3. Fragile point

* Why fragile:

  * Multiple tests depend directly on function names in `validation.py`.
* Improvement action:

  * Introduce abstraction layers and shared fixtures to reduce coupling.

### 4. Fragile point

* Why fragile:

  * Audit log tests depend on specific field names in returned dictionaries.
* Improvement action:

  * Validate behavior and required keys instead of exact internal implementation details.

### 5. Fragile point

* Why fragile:

  * Similar GDPR validation logic is referenced across unit tests, test cases, and BDD scenarios.
* Improvement action:

  * Centralize validation rules and maintain a single source of truth for expected behavior.
