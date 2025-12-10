# courses/permissions.py
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, SAFE_METHODS

User = get_user_model()


class IsStudent(BasePermission):
    """Allow access only to authenticated users with role=STUDENT."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, 'role', None) == User.Roles.STUDENT
        )


class IsTeacher(BasePermission):
    """Allow access only to authenticated users with role=TEACHER."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, 'role', None) == User.Roles.TEACHER
        )


class IsTeacherOrReadOnly(BasePermission):
    """
    - Anyone can perform safe (read-only) methods: GET, HEAD, OPTIONS.
    - Only TEACHER users can create/update/delete.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, 'role', None) == User.Roles.TEACHER
        )
