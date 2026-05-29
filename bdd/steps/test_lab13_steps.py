from datetime import datetime

from pytest_bdd import scenarios, given, when, then, parsers

from src.validation import (
    validate_email,
    validate_evidence_date
)

scenarios("../features/lab13.feature")


@given("the AMS Intake Platform is available")
def platform_available():
    pass


@when(
    parsers.parse('the user registers "{email}"'),
    target_fixture="registration_result"
)
def register_email(email):
    return validate_email(email)


@then("the registration is accepted")
def registration_accepted(registration_result):
    assert registration_result is True


@then("the registration is rejected")
def registration_rejected(registration_result):
    assert registration_result is False


@when(
    parsers.parse('evidence date is "{date}"'),
    target_fixture="evidence_result"
)
def evidence_date(date):
    fake_today = datetime(2026, 5, 10)

    return validate_evidence_date(
        date,
        fake_today
    )


@then("evidence is considered valid")
def evidence_valid(evidence_result):
    assert evidence_result is True


@then("evidence is considered valid on boundary")
def evidence_boundary(evidence_result):
    assert evidence_result is True