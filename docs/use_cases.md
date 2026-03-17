# Use Cases — Lab 5

## UC-01 — Register stakeholder details
- **Primary actor:** Transition Lead
- **Supporting actors:** None
- **Goal:** To add a client stakeholder to the intake session while strictly adhering to GDPR data minimization rules.
- **Preconditions:** The Transition Lead is authenticated and has an active Intake Session open.
- **Trigger:** The Transition Lead clicks the "Add Stakeholder" button on the intake dashboard.
- **Postconditions (success):** A new stakeholder profile is created, storing *only* the corporate email and role, encrypted at rest.
- **Postconditions (failure/cancel):** No stakeholder profile is created; the system database remains unchanged.
- **Related requirements:** REQ-001 (Restrict Data Collection), REQ-006 (AES-256 Encryption).

### Main flow (happy path)
1. Actor clicks "Add Stakeholder".
2. System displays the minimized stakeholder form, requesting only 'Corporate Email' and 'System Role'.
3. Actor inputs the stakeholder's corporate email and selects their role from a dropdown.
4. Actor clicks "Save".
5. System validates that the email format is correct and contains no phone number structures.
6. System encrypts the data and saves it to the database.
7. System displays a "Stakeholder Added Successfully" confirmation message.

### Alternative flows
A1. **Stakeholder already exists** → If the email provided in Step 3 already exists in the system database, the system skips Step 6 and instead links the existing stakeholder profile to the current intake session, notifying the Actor.

### Exceptions / errors
E1. **GDPR Format Violation** → If in Step 5 the system detects a number sequence matching a phone number in any text field, the system halts the save process, clears the input, and displays a GDPR warning: "Error: Collection of personal phone numbers is prohibited."
E2. **Database Timeout** → If the database fails to respond during Step 6, the system displays "Service Unavailable - Try Again" and safely aborts the transaction without storing unencrypted data in cache.

---

## UC-03 — Evaluate intake readiness
- **Primary actor:** Transition Lead
- **Supporting actors:** None
- **Goal:** To automatically evaluate if all submitted intake data and evidence meet the business rules to proceed to the transition phase.
- **Preconditions:** At least one stakeholder is registered, and authorization evidence has been uploaded.
- **Trigger:** The Transition Lead clicks "Submit Intake for Evaluation".
- **Postconditions (success):** The intake session status is permanently updated to "Ready to Proceed".
- **Postconditions (failure/cancel):** The session status is set to "Need More Data" and a Deficit Report is generated.
- **Related requirements:** REQ-004 (Intake Decision Engine), REQ-005 (Deficit Reporting), REQ-007 (Stale Evidence Rejection).

### Main flow (happy path)
1. Actor clicks "Submit Intake for Evaluation".
2. System locks the intake session to prevent further edits during evaluation.
3. System verifies that all mandatory structured data fields are populated.
4. System checks the metadata of uploaded evidence to ensure no file is older than 15 days.
5. System verifies the stakeholder's role matches the required authorization level.
6. System updates the intake session status to "Ready to Proceed".
7. System displays a success dashboard.

### Alternative flows
A1. **Missing Data or Stale Evidence (Deficit Report Trigger)** → If the system detects missing mandatory fields in Step 3, or evidence older than 15 days in Step 4, it immediately branches out (<<extend>>). The system changes the status to "Need More Data", automatically triggers **UC-04 (Generate discovery deficit report)** to list the exact missing/failed items, and unlocks the session for the Actor to fix the errors.

### Exceptions / errors
E1. **Corrupted Evidence File** → If the system cannot read the metadata of an uploaded PDF during Step 4, it flags the file as "Corrupted/Unreadable", treats it as a failed check, and proceeds to Alternative Flow A1 to inform the user.
