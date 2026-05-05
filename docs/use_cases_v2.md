## UC-01 — Register stakeholder details
- **Primary actor:** Transition Lead
- **Goal:** To add a client stakeholder to the intake session while strictly adhering to GDPR data minimization rules.
- **Preconditions:** The Transition Lead is authenticated and has an active Intake Session open.
- **Trigger:** The Transition Lead clicks the "Add Stakeholder" button.
- **Postconditions (success):** A new stakeholder profile is created containing only the corporate email and role, stored with AES-256 encryption.
- **Postconditions (failure/cancel):** No profile is created; the system discards all input data.
- **Related requirements:** REQ-001, REQ-006

### Main flow (happy path)
1. Actor clicks "Add Stakeholder".
2. System displays the minimized form, requesting only 'Corporate Email' and 'System Role'.
3. Actor inputs the corporate email and selects a role from the dropdown.
4. Actor clicks "Save".
5. System validates the email format and ensures no phone numbers are present.
6. System encrypts the data at rest.
7. System displays a "Stakeholder Added Successfully" confirmation message.

### Alternative flows (min. 2)
A1. **Stakeholder already exists** → If the email provided in Step 3 already exists in the secure database, the system skips creation (Step 6), links the existing stakeholder to the current session, and notifies the Actor.
A2. **Role not specified** → If the Actor leaves the 'System Role' blank in Step 3, the system automatically assigns the lowest privilege role ("Contributor") to enforce the principle of least privilege, and proceeds to Step 4.

### Exceptions / errors (min. 2)
E1. **[Variant Focus] GDPR Format Violation** → If in Step 5 the system detects a number sequence matching a phone number format, it halts the save process, clears the input entirely to prevent memory leaks of PII, and displays a GDPR warning: "Error: Collection of personal phone numbers is prohibited."
E2. **Invalid Email Domain** → If the email entered is from a public provider (e.g., @gmail.com), the system blocks the submission and requests a valid Corporate Email Domain.

---

## UC-02 — Evaluate intake readiness
- **Primary actor:** Transition Lead
- **Goal:** To evaluate if all submitted data and evidence meet the transition criteria without manual bottlenecks.
- **Preconditions:** At least one stakeholder is registered, and authorization evidence has been uploaded.
- **Trigger:** The Transition Lead clicks "Submit Intake for Evaluation".
- **Postconditions (success):** The intake session is permanently locked and status updated to "Ready to Proceed".
- **Postconditions (failure/cancel):** The session status is set to "Need More Data" and a Deficit Report is available.
- **Related requirements:** REQ-004, REQ-007, REQ-008

### Main flow (happy path)
1. Actor clicks "Submit Intake for Evaluation".
2. System locks the intake session to prevent further edits.
3. System verifies that all mandatory structured data fields are populated.
4. System executes UC-07 (Verify stakeholder authority) via `<<include>>` to ensure the submitting user has legal clearance.
5. System checks the metadata of uploaded evidence to ensure documents are fresh.
6. System updates the intake session status to "Ready to Proceed".
7. System displays the transition success dashboard.

### Alternative flows (min. 2)
A1. **Deficit Detected (Trigger Report)** → If the system detects missing mandatory fields in Step 3, it executes an `<<extend>>` relationship: updates status to "Need More Data", automatically triggers UC-04 (Generate discovery deficit report), and unlocks the session.
A2. **[Variant Focus] Approaching Retention Limit** → If the system detects during Step 2 that the intake draft has been inactive for 25 days, it displays a high-priority banner warning the Actor that if the session is not finalized within 5 days, all associated PII and files will be permanently purged per GDPR rules.

### Exceptions / errors (min. 2)
E1. **Stale Evidence Error** → If in Step 5 the system parses a document creation date older than 15 days, it halts the evaluation, flags the specific file as "Stale", and proceeds to A1 to inform the user.
E2. **Authority Verification Failed** → If UC-07 returns a failure (e.g., the user's role does not match the required authorization level), the system immediately aborts the evaluation and logs an unauthorized transition attempt.

## Variant-driven notes (required)
- **Where did the variant influence a flow or exception?**
  - In **UC-01 (E1)**, the system actively acts as a privacy shield, blocking users from inputting PII that violates data minimization rules.
  - In **UC-03 (A2)**, the system enforces the 30-day retention rule by warning the user that their data lifecycle is about to expire, reflecting the automated purge mandate.
