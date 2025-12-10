from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import User
from .models import Course, EnrollmentRequest
from .serializers import CourseSerializer, EnrollmentRequestSerializer
from .permissions import IsStudent, IsTeacher, IsTeacherOrReadOnly



class CourseViewSet(viewsets.ModelViewSet):
    """
    - Anyone (even anonymous) can list and view courses.
    - Only TEACHER users can create/update/delete.
    """
    queryset = Course.objects.all().select_related('teacher')
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOrReadOnly]



class EnrollmentRequestViewSet(viewsets.ModelViewSet):
    """
    - STUDENT: can only see their own enrollment requests
    - TEACHER: can see all enrollment requests
    """
    queryset = EnrollmentRequest.objects.all().select_related('course', 'student')
    serializer_class = EnrollmentRequestSerializer

    # if you already have get_permissions, keep it;
    # we’re only adding get_queryset.

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        # not authenticated -> no data
        if not user or not user.is_authenticated:
            return qs.none()

        # student -> only their own requests
        if getattr(user, 'role', None) == User.Roles.STUDENT:
            return qs.filter(student=user)

        # teacher (or other roles) -> all requests
        return qs

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
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