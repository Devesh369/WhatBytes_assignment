from django.contrib import admin
from django.urls import path

from email_sender.views import email_status, send_email

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/send-email/", send_email, name="send-email"),
    path("api/email-status/<str:task_id>/", email_status, name="email-status"),
]

