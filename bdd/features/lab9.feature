Feature: AMS Intake Privacy and Readiness Validation
  The goal of this feature is to ensure strict GDPR data minimization during stakeholder registration
  and to accurately validate intake readiness based on business rules and evidence freshness.
  
  # REQ links: REQ-001, REQ-004, REQ-005, REQ-006, REQ-007

  Scenario: Happy path — Valid stakeholder registration
    Given the Transition Lead is logged into the Intake Form
    And the input fields are empty
    When the user enters a valid corporate email and selects a role
    And clicks the Save Stakeholder button
    Then the system encrypts the email address
    And the stakeholder is successfully registered
    And a success message is displayed

  Scenario: Negative path — Submission blocked due to phone number format (GDPR)
    Given the Transition Lead is logged into the Intake Form
    When the user enters a string of 9 numbers in the email field
    And clicks the Save Stakeholder button
    Then the system blocks the submission
    And displays the validation error "GDPR Violation: Personal phone numbers are prohibited"
    And clears the input to prevent PII exposure

  Scenario: Alternative flow — Deficit report generation for missing data
    Given an Intake Session is ready for evaluation
    And the mandatory SLA Matrix evidence is missing
    When the Transition Lead submits the intake for evaluation
    Then the system changes the session status to "Need More Data"
    And automatically generates a PDF Discovery Deficit Report
    And the report explicitly lists "SLA Matrix" as the missing item
