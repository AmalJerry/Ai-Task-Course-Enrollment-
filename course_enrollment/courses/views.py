from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course, EnrollmentRequest
from .serializers import CourseSerializer, EnrollmentRequestSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().select_related('teacher')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class EnrollmentRequestViewSet(viewsets.ModelViewSet):
    """
    Completely open: anyone can create and list enrollment requests.
    Frontend sends 'student' and 'course' in the body.
    """
    queryset = EnrollmentRequest.objects.all().select_related('course', 'student')
    serializer_class = EnrollmentRequestSerializer
    permission_classes = [AllowAny]

    # No get_queryset override
    # No perform_create using request.user → just use POST body data

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """
        Enroll this request if it's pending and capacity allows.
        No teacher checks – kept simple.
        """
        enrollment = self.get_object()
        course = enrollment.course

        if enrollment.status != EnrollmentRequest.Status.PENDING:
            return Response(
                {'detail': 'Only pending requests can be enrolled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if course.enrolled_count >= course.max_capacity:
            return Response(
                {'detail': 'Course is already at max capacity.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment.status = EnrollmentRequest.Status.ENROLLED
        enrollment.save(update_fields=['status', 'updated_at'])
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data)
