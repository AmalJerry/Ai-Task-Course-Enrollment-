from django.contrib import admin

# Register your models here.
from .models import Course, EnrollmentRequest

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'teacher', 'max_capacity', 'enrolled_count')
    search_fields = ('name', 'code', 'teacher__username')

@admin.register(EnrollmentRequest)
class EnrollmentRequestAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('student__username', 'course__name', 'course__code')

