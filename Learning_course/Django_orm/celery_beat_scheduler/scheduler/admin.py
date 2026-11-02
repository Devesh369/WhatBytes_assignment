from django.contrib import admin

from .models import ScheduledTask, UserScheduleProfile


@admin.register(ScheduledTask)
class ScheduledTaskAdmin(admin.ModelAdmin):
    list_display = ("display_name", "task_name", "schedule_type", "active", "created_at")
    list_filter = ("schedule_type", "active", "timezone")
    search_fields = ("display_name", "task_name")


@admin.register(UserScheduleProfile)
class UserScheduleProfileAdmin(admin.ModelAdmin):
    list_display = ("email", "timezone", "email_enabled", "birthday", "anniversary")
    list_filter = ("email_enabled", "timezone")
    search_fields = ("email",)
