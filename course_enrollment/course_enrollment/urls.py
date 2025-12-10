"""
URL configuration for course_enrollment project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from accounts.views import (RegisterView, MeView, MyTokenObtainPairView)
from courses.views import (CourseViewSet, EnrollmentRequestViewSet)


router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollment-requests', EnrollmentRequestViewSet, basename='enrollment-request')

urlpatterns = [
    path('api/', include([
        path('', include(router.urls)),

        # Auth:
        path('auth/register/', RegisterView.as_view(), name='auth-register'),
        path('auth/login/', MyTokenObtainPairView.as_view(), name='auth-login'),
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('auth/me/', MeView.as_view(), name='auth-me'),
    ])),
]