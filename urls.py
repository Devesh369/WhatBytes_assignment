from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DepartmentViewSet,
    StudentAPIView,
    StudentDetailAPIView,
    student_detail,
    student_list,
)

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")

urlpatterns = [
    path("function/students/", student_list, name="student-list-function"),
    path(
        "function/students/<int:pk>/",
        student_detail,
        name="student-detail-function",
    ),
    path("students/", StudentAPIView.as_view(), name="student-list"),
    path(
        "students/<int:pk>/",
        StudentDetailAPIView.as_view(),
        name="student-detail",
    ),
    path("", include(router.urls)),
]