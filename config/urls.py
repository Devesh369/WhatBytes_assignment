from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("students.urls")),
    path("api/auth/token/", obtain_auth_token),
    path("api/auth/jwt/", TokenObtainPairView.as_view()),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view()),
]