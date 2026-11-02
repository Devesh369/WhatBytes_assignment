import json

from celery.result import AsyncResult
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django_celery_beat.models import PeriodicTask
from django_celery_results.models import TaskResult

from .models import ScheduledTask
from .services import create_dynamic_task, create_scheduled_email


def read_json(request):
    try:
        data = json.loads(request.body)
    except (TypeError, json.JSONDecodeError):
        raise ValueError("Request body must be valid JSON")
    if not isinstance(data, dict):
        raise ValueError("Request body must be a JSON object")
    return data


def task_data(item):
    return {
        "id": item.pk,
        "task_name": item.task_name,
        "name": item.display_name,
        "schedule_type": item.schedule_type,
        "schedule_time": item.schedule_time,
        "timezone": item.timezone,
        "arguments": item.arguments,
        "active": item.active,
        "created_at": item.created_at,
    }


@require_POST
def schedule_task(request):
    try:
        data = read_json(request)
        item = create_dynamic_task(
            data["task_name"],
            data.get("schedule_time"),
            data.get("args"),
            data.get("schedule"),
            data.get("timezone", "Asia/Kolkata"),
        )
    except (KeyError, ValueError) as error:
        return JsonResponse({"status": "error", "error": str(error)}, status=400)
    return JsonResponse({"status": "scheduled", "task": task_data(item)}, status=201)


@require_POST
def schedule_email(request):
    try:
        data = read_json(request)
        required = ("recipient", "subject", "message", "schedule_time")
        missing = [field for field in required if not data.get(field)]
        if missing:
            raise ValueError(f"Missing fields: {', '.join(missing)}")
        item = create_scheduled_email(
            {
                "recipient": data["recipient"],
                "subject": data["subject"],
                "message": data["message"],
                "html_message": data.get("html_message"),
            },
            data["schedule_time"],
            data.get("timezone", "Asia/Kolkata"),
        )
    except ValueError as error:
        return JsonResponse({"status": "error", "error": str(error)}, status=400)
    return JsonResponse({"status": "scheduled", "task": task_data(item)}, status=201)


@require_GET
def scheduled_tasks(request):
    return JsonResponse(
        {"tasks": [task_data(item) for item in ScheduledTask.objects.select_related("periodic_task")]},
    )


@require_POST
def cancel_task(request, task_id):
    try:
        item = ScheduledTask.objects.get(pk=task_id)
    except ScheduledTask.DoesNotExist:
        return JsonResponse({"status": "error", "error": "Task not found"}, status=404)
    item.active = False
    item.periodic_task.enabled = False
    item.periodic_task.save(update_fields=["enabled"])
    item.save(update_fields=["active"])
    return JsonResponse({"status": "cancelled", "task_id": item.pk})


@require_POST
def update_task(request, task_id):
    try:
        item = ScheduledTask.objects.select_related("periodic_task").get(pk=task_id)
        data = read_json(request)
    except ScheduledTask.DoesNotExist:
        return JsonResponse({"status": "error", "error": "Task not found"}, status=404)
    except ValueError as error:
        return JsonResponse({"status": "error", "error": str(error)}, status=400)

    periodic_task = item.periodic_task
    if "active" in data:
        if not isinstance(data["active"], bool):
            return JsonResponse({"status": "error", "error": "active must be boolean"}, status=400)
        item.active = data["active"]
        periodic_task.enabled = data["active"]
    if "args" in data:
        if not isinstance(data["args"], dict):
            return JsonResponse({"status": "error", "error": "args must be an object"}, status=400)
        item.arguments = data["args"]
        periodic_task.kwargs = json.dumps(
            {"task_name": item.task_name, "arguments": item.arguments}
        )
    periodic_task.save(update_fields=["enabled", "kwargs", "last_run_at"])
    item.save(update_fields=["active", "arguments"])
    return JsonResponse({"status": "updated", "task": task_data(item)})


@require_GET
def task_history(request):
    results = TaskResult.objects.order_by("-date_done")[:100]
    return JsonResponse(
        {
            "history": [
                {
                    "task_id": result.task_id,
                    "task_name": result.task_name,
                    "status": result.status,
                    "date_done": result.date_done,
                    "result": result.result,
                    "traceback": result.traceback,
                }
                for result in results
            ]
        }
    )


@require_GET
def dashboard(request):
    return JsonResponse(
        {
            "scheduled": ScheduledTask.objects.filter(active=True).count(),
            "disabled": ScheduledTask.objects.filter(active=False).count(),
            "beat_entries": PeriodicTask.objects.count(),
            "completed": TaskResult.objects.filter(status="SUCCESS").count(),
            "failed": TaskResult.objects.filter(status="FAILURE").count(),
        }
    )
