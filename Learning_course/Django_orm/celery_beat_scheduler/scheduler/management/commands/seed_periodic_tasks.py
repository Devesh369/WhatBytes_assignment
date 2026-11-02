from django.core.management.base import BaseCommand
from django_celery_beat.models import CrontabSchedule, PeriodicTask
from zoneinfo import ZoneInfo


class Command(BaseCommand):
    def handle(self, *args, **options):
        timezone_name = "Asia/Kolkata"
        schedules = {
            "daily-report": ("0", "9", "*", "*", "*", "scheduler.tasks.daily_report_task"),
            "weekly-cleanup": ("0", "2", "*", "*", "1", "scheduler.tasks.weekly_cleanup_task"),
            "hourly-status-check": ("0", "*", "*", "*", "*", "scheduler.tasks.hourly_status_check_task"),
            "weekday-1030-status": ("30", "10", "*", "*", "1-5", "scheduler.tasks.hourly_status_check_task"),
        }
        for name, (minute, hour, day, month, weekday, task) in schedules.items():
            schedule, _ = CrontabSchedule.objects.get_or_create(
                minute=minute,
                hour=hour,
                day_of_week=weekday,
                day_of_month=day,
                month_of_year=month,
                timezone=ZoneInfo(timezone_name),
            )
            PeriodicTask.objects.update_or_create(
                name=name,
                defaults={"crontab": schedule, "task": task, "enabled": True},
            )
        self.stdout.write(self.style.SUCCESS("Periodic tasks configured"))
