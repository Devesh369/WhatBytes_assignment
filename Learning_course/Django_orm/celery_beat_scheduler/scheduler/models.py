from django.db import models


class UserScheduleProfile(models.Model):
    email = models.EmailField(unique=True)
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")
    email_enabled = models.BooleanField(default=True)
    birthday = models.DateField(null=True, blank=True)
    anniversary = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.email


class ScheduledTask(models.Model):
    task_name = models.CharField(max_length=200)
    display_name = models.CharField(max_length=200, unique=True)
    periodic_task = models.OneToOneField(
        "django_celery_beat.PeriodicTask",
        on_delete=models.CASCADE,
        related_name="scheduler_record",
    )
    schedule_type = models.CharField(max_length=20)
    schedule_time = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")
    arguments = models.JSONField(default=dict, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.display_name

