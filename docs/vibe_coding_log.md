# Vibe Coding Log — Lab 8

## Tool used
- **Codex / Lovable / Other:** ChatGPT (GPT-4o) used as the code generator.
- **Environment/stack:** HTML / CSS / Vanilla JavaScript (Frontend Prototype)

## Iteration 1
**Prompt (summary):**
> "Generate a minimal web prototype for an AMS Intake Platform. The primary actor is the Transition Lead. Create a form to 'Register Stakeholder'. It should only ask for Corporate Email and System Role. Follow GDPR data minimization."

**Generated output (what appeared):**
- A clean HTML form with fields for Email, Role, and a "Submit" button.
- However, the AI hallucinated and added a "Full Name" and "Company Phone" field because it assumed all contact forms need them.

**Kept (accepted):**
- The general UI layout, CSS styling, and the dropdown for System Role.

**Rejected (feature drift / out of scope):**
- Rejected the "Full Name" and "Company Phone" fields. This is a direct violation of REQ-001 (Restrict Stakeholder Data Collection).

**Manual verification:**
- **Happy path:** Failed (captured too much data).
- **Alternative flow:** N/A.
- **Exception/error path:** N/A.

**Changes made after generation (manual edits):**
- Realized the prompt was too weak regarding constraints. Prepared a stricter prompt for Iteration 2.

---

## Iteration 2
**Prompt (summary):**
> "Refine the previous form. STRICT CONSTRAINTS (REQ-001): Remove the Name and Phone fields. The form must ONLY have 'Corporate Email' and 'Role'. Add a JavaScript regex validation: if the user types a sequence of numbers resembling a phone number inside the email field, block the submission and show a red error: 'GDPR Violation: Personal phone numbers are prohibited.' Simulate REQ-006 by base64 encoding the email in the console log before saving."

**Generated output:**
- A strict, minimized form.
- JavaScript logic with a regex `/\d{9,}/` that actively scans the input and blocks submission if it looks like a phone number.
- Simulated "encryption" (Base64) before storing in `localStorage`.

**Kept:**
- All of the above. The AI perfectly respected the constraints this time.

**Rejected:**
- Nothing. Scope was perfectly maintained.

**Manual verification:**
- **Happy path:** Input `john.doe@company.com` and `Director`. Saved successfully to LocalStorage.
- **Alternative flow:** N/A (Keep it simple).
- **Exception/error path:** Input `john912345678@company.com`. Form blocked, red GDPR error message appeared. (Matches UC-01 / E1).

**Changes made after generation:**
- Minor CSS tweaks to make the GDPR error message more visible.

---

## Notes (lessons learned)
- **What requirement ambiguity caused problems?** In Iteration 1, simply saying "Follow GDPR" wasn't enough. The AI relied on its standard training data (which includes phone numbers in forms).
- **What constraints were missing initially?** The explicit rule to use regex to block phone numbers was missing from the first prompt.
- **What would you change in your requirements next?** Ensure that constraints are written as explicit technical rules (like the regex mention) so LLMs don't guess the UI structure.
