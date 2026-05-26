Feature: GDPR intake validation

  # REQ links: REQ-006, REQ-010

  Scenario: Happy path — valid stakeholder registration
    Given the Transition Lead opens the stakeholder form
    When the user enters "john.doe@company.com"
    And selects the role "Director"
    Then the stakeholder should be saved successfully

  Scenario: Negative path — phone number detected
    Given the Transition Lead opens the stakeholder form
    When the user enters "john912345678@company.com"
    Then the system should display a GDPR validation error
    And the submission should be blocked
