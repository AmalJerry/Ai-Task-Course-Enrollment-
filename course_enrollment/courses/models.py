from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    max_capacity = models.PositiveIntegerField(default=30)

    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses'
    )

    def __str__(self):
        return f'{self.name} ({self.code})'

    @property
    def enrolled_count(self):
        return self.enrollment_requests.filter(
            status=EnrollmentRequest.Status.ENROLLED
        ).count()


class EnrollmentRequest(models.Model):

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ENROLLED = 'ENROLLED', 'Enrolled'
        REJECTED = 'REJECTED', 'Rejected'

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='enrollment_requests'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollment_requests'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'course')  # one request per course per student

    def __str__(self):
        return f'{self.student} → {self.course} ({self.status})'

    @property
    def is_waitlisted(self):
        if self.status != self.Status.PENDING:
            return False
        return timezone.now() - self.created_at > timedelta(hours=24)
