Feature: AMS Intake Platform BDD Validation

  Background:
    Given the AMS Intake Platform is available

  Scenario: Happy Path - Valid stakeholder registration
    When the user registers "john.doe@company.com"
    Then the registration is accepted

  Scenario: Negative Path - Phone number detected in email
    When the user registers "john912345678@company.com"
    Then the registration is rejected

  Scenario: Alternative Flow - Future evidence accepted
    When evidence date is "2027-01-01"
    Then evidence is considered valid

  Scenario: Boundary Test - Exactly 30 days old evidence
    When evidence date is "2026-04-10"
    Then evidence is considered valid on boundary