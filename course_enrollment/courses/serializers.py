from rest_framework import serializers
from .models import Course, EnrollmentRequest

class CourseSerializer(serializers.ModelSerializer):
    enrolled_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description',
            'max_capacity', 'teacher', 'enrolled_count'
        ]
        read_only_fields = ['enrolled_count']


class EnrollmentRequestSerializer(serializers.ModelSerializer):
    is_waitlisted = serializers.SerializerMethodField()
    course_detail = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = EnrollmentRequest
        fields = [
            'id', 'student', 'course', 'status',
            'created_at', 'updated_at', 'is_waitlisted',
            'course_detail',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at', 'is_waitlisted']

    def get_is_waitlisted(self, obj):
        return obj.is_waitlisted
