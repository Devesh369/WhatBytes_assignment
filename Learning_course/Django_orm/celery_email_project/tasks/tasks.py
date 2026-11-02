import time

from celery import shared_task


@shared_task(bind=True, name="tasks.test_connection_task")
def test_connection_task(self):
    """Return a small result proving the worker can execute tasks."""
    return {
        "status": "success",
        "message": "Celery worker and Redis connection are working.",
        "task_id": self.request.id,
    }


@shared_task(bind=True, name="tasks.long_running_task")
def long_running_task(self, duration):
    """Sleep for ``duration`` seconds to demonstrate asynchronous execution."""
    if not isinstance(duration, (int, float)) or isinstance(duration, bool):
        raise ValueError("duration must be a number")
    if duration < 0:
        raise ValueError("duration must be non-negative")

    time.sleep(duration)
    return {"status": "completed", "duration": duration}

