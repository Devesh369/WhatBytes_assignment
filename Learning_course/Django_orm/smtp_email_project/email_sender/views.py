import json
import logging

from celery.result import AsyncResult
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from .tasks import send_email_task

logger = logging.getLogger(__name__)


def _required_text(data, field):
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} is required")
    return value.strip()


@require_POST
def send_email(request):
    try:
        data = json.loads(request.body)
        recipient = _required_text(data, "recipient")
        subject = _required_text(data, "subject")
        message = _required_text(data, "message")
        html_message = data.get("html_message")
        if html_message is not None and not isinstance(html_message, str):
            raise ValueError("html_message must be a string")
    except (json.JSONDecodeError, TypeError, ValueError) as error:
        return JsonResponse({"status": "error", "error": str(error)}, status=400)

    task = send_email_task.delay(recipient, subject, message, html_message)
    return JsonResponse(
        {"status": "queued", "task_id": task.id},
        status=202,
    )


@require_GET
def email_status(request, task_id):
    result = AsyncResult(task_id)
    response = {"task_id": task_id, "status": result.status}

    if result.ready():
        if result.successful():
            response["result"] = result.result
        else:
            response["error"] = str(result.result)

    return JsonResponse(response)

