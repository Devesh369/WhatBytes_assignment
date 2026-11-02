import json
from unittest.mock import patch

from django.test import SimpleTestCase

from .tasks import send_bulk_email_task, send_email_task


class EmailTaskTests(SimpleTestCase):
    @patch("email_sender.tasks.EmailMultiAlternatives.send", return_value=1)
    def test_send_email_task(self, send):
        result = send_email_task("person@example.com", "Hello", "Message")
        send.assert_called_once_with(fail_silently=False)
        self.assertEqual(result["status"], "sent")

    def test_invalid_recipient(self):
        with self.assertRaises(ValueError):
            send_email_task("not-an-email", "Hello", "Message")

    @patch("email_sender.tasks.EmailMultiAlternatives.send", return_value=1)
    def test_bulk_email_task(self, send):
        result = send_bulk_email_task(
            ["one@example.com", "two@example.com"],
            "Hello",
            "Message",
        )
        self.assertEqual(result["recipients"], 2)


class EmailEndpointTests(SimpleTestCase):
    @patch("email_sender.views.send_email_task.delay")
    def test_send_email_endpoint(self, delay):
        delay.return_value.id = "task-123"
        response = self.client.post(
            "/api/send-email/",
            data=json.dumps(
                {
                    "recipient": "person@example.com",
                    "subject": "Hello",
                    "message": "Message",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()["task_id"], "task-123")

