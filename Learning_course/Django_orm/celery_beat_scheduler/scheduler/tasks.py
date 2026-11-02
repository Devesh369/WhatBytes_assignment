import logging
from datetime import datetime

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from zoneinfo import ZoneInfo

logger = logging.getLogger(__name__)


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def daily_report_task(self):
    logger.info("Daily report generated at %s", timezone.localtime())
    return {"task": "daily_report", "executed_at": timezone.now().isoformat()}


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def weekly_cleanup_task(self):
    logger.info("Weekly cleanup completed at %s", timezone.localtime())
    return {"task": "weekly_cleanup", "executed_at": timezone.now().isoformat()}


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def hourly_status_check_task(self):
    logger.info("Hourly status check completed at %s", timezone.localtime())
    return {"task": "hourly_status_check", "executed_at": timezone.now().isoformat()}


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def send_scheduled_email_task(self, email_data):
    recipient = email_data["recipient"]
    message = EmailMultiAlternatives(
        email_data["subject"],
        email_data["message"],
        settings.DEFAULT_FROM_EMAIL,
        [recipient],
    )
    if email_data.get("html_message"):
        message.attach_alternative(email_data["html_message"], "text/html")
    sent = message.send(fail_silently=False)
    logger.info("Scheduled email sent to %s", recipient)
    return {"status": "sent", "count": sent, "recipient": recipient}


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def birthday_reminder_task(self, profile_id):
    from .models import UserScheduleProfile

    profile = UserScheduleProfile.objects.get(pk=profile_id)
    if not profile.email_enabled:
        return {"status": "skipped", "reason": "email_disabled"}
    return send_scheduled_email_task.delay(
        {
            "recipient": profile.email,
            "subject": "Happy birthday",
            "message": "Wishing you a wonderful birthday.",
        }
    ).get()


@shared_task(bind=True, autoretry_for=(ConnectionError, OSError), retry_backoff=True, max_retries=3)
def anniversary_reminder_task(self, profile_id):
    from .models import UserScheduleProfile

    profile = UserScheduleProfile.objects.get(pk=profile_id)
    if not profile.email_enabled:
        return {"status": "skipped", "reason": "email_disabled"}
    return send_scheduled_email_task.delay(
        {
            "recipient": profile.email,
            "subject": "Happy anniversary",
            "message": "Congratulations on your anniversary.",
        }
    ).get()


@shared_task(bind=True)
def run_dynamic_task(self, task_name, arguments):
    allowed_tasks = {
        "daily_report_task": daily_report_task,
        "weekly_cleanup_task": weekly_cleanup_task,
        "hourly_status_check_task": hourly_status_check_task,
        "send_scheduled_email_task": send_scheduled_email_task,
    }
    task = allowed_tasks.get(task_name)
    if task is None:
        raise ValueError(f"Unsupported task: {task_name}")
    return task.run(**arguments) if isinstance(arguments, dict) else task.run(*arguments)


def localize_datetime(value, timezone_name):
    if not isinstance(value, datetime):
        raise ValueError("schedule_time must be a datetime")
    target_zone = ZoneInfo(timezone_name)
    if timezone.is_naive(value):
        return timezone.make_aware(value, target_zone)
    return value.astimezone(target_zone)
