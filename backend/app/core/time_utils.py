from datetime import datetime
from zoneinfo import ZoneInfo


APP_TIMEZONE = ZoneInfo("Asia/Kolkata")


def get_current_datetime() -> datetime:
    """
    Return the current application datetime in India Standard Time.
    """
    return datetime.now(APP_TIMEZONE)


def get_current_date():
    """
    Return today's date in the application timezone.
    """
    return get_current_datetime().date()