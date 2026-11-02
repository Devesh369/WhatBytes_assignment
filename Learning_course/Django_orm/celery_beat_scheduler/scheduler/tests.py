import json
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone

from .models import ScheduledTask
from .services import create_dynamic_task
from .tasks import daily_report_task, run_dynamic_task


class SchedulerTests(TestCase):
    def test_create_one_time_task(self):
        item = create_dynamic_task(
            "daily_report_task",
            (timezone.now() + timedelta(hours=1)).isoformat(),
            {"region": "IN"},
        )
        self.assertEqual(item.schedule_type, "one_time")
        self.assertEqual(ScheduledTask.objects.count(), 1)

    def test_dynamic_task_rejects_unknown_task(self):
        with self.assertRaises(ValueError):
            create_dynamic_task("not_allowed", timezone.now().isoformat())

    @patch("scheduler.tasks.timezone.localtime")
    def test_daily_report_task(self, localtime):
        daily_report_task()
        localtime.assert_called_once()

    def test_schedule_endpoint(self):
        response = self.client.post(
            "/api/schedule-task/",
            data=json.dumps(
                {
                    "task_name": "hourly_status_check_task",
                    "schedule": {"crontab": "0 * * * *"},
                    "args": {"source": "api"},
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)

    def test_cancel_endpoint(self):
        item = create_dynamic_task(
            "daily_report_task",
            (timezone.now() + timedelta(hours=1)).isoformat(),
        )
        response = self.client.post(f"/api/cancel-task/{item.pk}/")
        self.assertEqual(response.status_code, 200)
        item.refresh_from_db()
        self.assertFalse(item.active)
