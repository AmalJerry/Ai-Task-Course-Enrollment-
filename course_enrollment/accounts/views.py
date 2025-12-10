from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    MyTokenObtainPairSerializer,
)


from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Request body: username, email, role, password, password2, etc.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    """
    GET /api/auth/me/
    Returns the currently authenticated user's info (including role).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Body: { "username": "...", "password": "..." }
    Response: { "refresh", "access", "user": { ... } }
    """
    serializer_class = MyTokenObtainPairSerializer
