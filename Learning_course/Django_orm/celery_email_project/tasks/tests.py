from unittest.mock import patch

from django.test import SimpleTestCase

from .tasks import long_running_task, test_connection_task


class CeleryTaskTests(SimpleTestCase):
    def test_connection_task(self):
        result = test_connection_task()
        self.assertEqual(result["status"], "success")

    @patch("tasks.tasks.time.sleep")
    def test_long_running_task(self, sleep):
        result = long_running_task(3)
        sleep.assert_called_once_with(3)
        self.assertEqual(result["status"], "completed")

