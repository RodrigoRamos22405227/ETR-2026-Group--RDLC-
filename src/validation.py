import re
from datetime import datetime


def validate_email(email):
    pattern = r"\d{9,}"

    if re.search(pattern, email):
        return False

    if "@gmail.com" in email:
        return False

    return True


def validate_evidence_date(date_string, current_date=None):
    evidence_date = datetime.strptime(date_string, "%Y-%m-%d")

    if current_date is None:
        current_date = datetime.today()

    difference = (current_date - evidence_date).days

    if difference > 30:
        return False

    return True


def create_audit_log(user, action):
    return {
        "user": user,
        "action": action,
        "status": "logged"
    }