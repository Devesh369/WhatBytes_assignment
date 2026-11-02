from django.contrib import admin
from django.urls import path

from scheduler import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schedule-task/", views.schedule_task, name="schedule-task"),
    path("api/schedule-email/", views.schedule_email, name="schedule-email"),
    path("api/scheduled-tasks/", views.scheduled_tasks, name="scheduled-tasks"),
    path("api/scheduled-tasks/<int:task_id>/", views.update_task, name="update-task"),
    path("api/cancel-task/<int:task_id>/", views.cancel_task, name="cancel-task"),
    path("api/task-history/", views.task_history, name="task-history"),
    path("api/dashboard/", views.dashboard, name="dashboard"),
]
