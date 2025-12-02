from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentRequestViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollment-requests', EnrollmentRequestViewSet, basename='enrollment-request')

urlpatterns = [
    path('', include(router.urls)),
]
