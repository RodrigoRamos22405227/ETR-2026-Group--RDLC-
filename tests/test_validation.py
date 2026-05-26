from datetime import datetime

from src.validation import (
    validate_email,
    validate_evidence_date,
    create_audit_log
)

# HAPPY PATH TESTS

def test_valid_email():
    assert validate_email("john.doe@company.com") == True


def test_valid_evidence_date():
    assert validate_evidence_date("2026-05-01") == True


def test_create_audit_log():
    result = create_audit_log("admin", "VIEW")

    assert result["status"] == "logged"


# NEGATIVE TESTS

def test_phone_number_inside_email():
    assert validate_email("john912345678@company.com") == False


def test_old_evidence_rejected():
    assert validate_evidence_date("2020-01-01") == False


# BOUNDARY TEST

def test_boundary_30_days():
    fake_today = datetime(2026, 5, 10)

    assert validate_evidence_date(
        "2026-04-10",
        fake_today
    ) == True