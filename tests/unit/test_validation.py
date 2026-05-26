from datetime import datetime

from src.validation import (
    create_audit_log,
    validate_email,
    validate_evidence_date,
)


# =========================================================
# HAPPY PATH TESTS
# =========================================================

def test_valid_email():
    assert validate_email("john.doe@company.com") is True


def test_valid_evidence_date():
    assert validate_evidence_date("2026-05-01") is True


def test_create_audit_log():
    result = create_audit_log("admin", "VIEW")

    assert result["status"] == "logged"


def test_company_email_with_numbers_is_valid():
    assert validate_email("john123@company.com") is True


def test_future_evidence_date_is_valid():
    assert validate_evidence_date("2027-01-01") is True


def test_audit_log_action_saved():
    result = create_audit_log("transition_lead", "DOWNLOAD")

    assert result["action"] == "DOWNLOAD"

def test_uppercase_corporate_email_is_valid():
    assert validate_email("JOHN.DOE@COMPANY.COM") is True

def test_audit_log_contains_action_key():
    result = create_audit_log("privacy_officer", "DELETE")

    assert "action" in result



# =========================================================
# NEGATIVE / ERROR TESTS
# =========================================================

def test_phone_number_inside_email():
    assert validate_email("john912345678@company.com") is False


def test_old_evidence_rejected():
    assert validate_evidence_date("2020-01-01") is False


def test_empty_email_rejected():
    assert validate_email("") is False


# =========================================================
# BOUNDARY TESTS
# =========================================================

def test_boundary_30_days():
    fake_today = datetime(2026, 5, 10)

    assert validate_evidence_date(
        "2026-04-10",
        fake_today
    ) is True

