import json
import uuid
from datetime import datetime, timezone as datetime_timezone

from django_celery_beat.models import ClockedSchedule, CrontabSchedule, IntervalSchedule, PeriodicTask
from django.utils import timezone
from zoneinfo import ZoneInfo
from zoneinfo import ZoneInfoNotFoundError

from .models import ScheduledTask


TASK_NAMES = {
    "daily_report_task": "scheduler.tasks.daily_report_task",
    "weekly_cleanup_task": "scheduler.tasks.weekly_cleanup_task",
    "hourly_status_check_task": "scheduler.tasks.hourly_status_check_task",
    "send_scheduled_email_task": "scheduler.tasks.send_scheduled_email_task",
}


def parse_schedule_time(value, timezone_name):
    if not isinstance(value, str):
        raise ValueError("schedule_time is required")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if timezone.is_naive(parsed):
            parsed = timezone.make_aware(parsed, ZoneInfo(timezone_name))
        return parsed.astimezone(datetime_timezone.utc)
    except (TypeError, ValueError, ZoneInfoNotFoundError):
        raise ValueError("schedule_time must be a valid ISO-8601 datetime")


def make_name(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def create_dynamic_task(task_name, schedule_time=None, args=None, schedule=None, timezone_name="Asia/Kolkata"):
    if task_name not in TASK_NAMES:
        raise ValueError("Unsupported task name")

    args = args or {}
    task_kwargs = {
        "name": make_name(task_name),
        "task": "scheduler.tasks.run_dynamic_task",
        "args": json.dumps([]),
    }

    if schedule_time:
        clocked, _ = ClockedSchedule.objects.get_or_create(
            clocked_time=parse_schedule_time(schedule_time, timezone_name)
        )
        task_kwargs["clocked"] = clocked
        task_kwargs["one_off"] = True
        schedule_type = "one_time"
    elif schedule:
        expression = schedule.get("crontab")
        if expression:
            parts = expression.split()
            if len(parts) != 5:
                raise ValueError("crontab must contain five fields")
            crontab, _ = CrontabSchedule.objects.get_or_create(
                minute=parts[0],
                hour=parts[1],
                day_of_week=parts[4],
                day_of_month=parts[3],
                month_of_year=parts[2],
                timezone=ZoneInfo(timezone_name),
            )
            task_kwargs["crontab"] = crontab
            schedule_type = "crontab"
        elif schedule.get("every") and schedule.get("period"):
            interval, _ = IntervalSchedule.objects.get_or_create(
                every=schedule["every"],
                period=schedule["period"],
            )
            task_kwargs["interval"] = interval
            schedule_type = "interval"
        else:
            raise ValueError("schedule requires crontab or every and period")
    else:
        raise ValueError("schedule_time or schedule is required")

    task_kwargs["kwargs"] = json.dumps({"task_name": task_name, "arguments": args})
    periodic_task = PeriodicTask.objects.create(**task_kwargs)
    return ScheduledTask.objects.create(
        task_name=task_name,
        display_name=periodic_task.name,
        periodic_task=periodic_task,
        schedule_type=schedule_type,
        schedule_time=task_kwargs.get("clocked").clocked_time
        if task_kwargs.get("clocked")
        else None,
        timezone=timezone_name,
        arguments=args,
    )


def create_scheduled_email(email_data, schedule_time, timezone_name="Asia/Kolkata"):
    return create_dynamic_task(
        "send_scheduled_email_task",
        schedule_time=schedule_time,
        args={"email_data": email_data},
        timezone_name=timezone_name,
    )
