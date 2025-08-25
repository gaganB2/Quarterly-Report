# users/views.py

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from decouple import config

from rest_framework import status, permissions, generics, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.decorators import action

from .models import Profile
from .serializers import (
    RegistrationSerializer,
    StudentRegistrationSerializer,
    UserProfileSerializer,
    UserDetailSerializer,
    UserManagementSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    frontend_url = config('FRONTEND_BASE_URL', default='http://localhost:5173')
    verification_url = f"{frontend_url}/verify-email/{uid}/{token}/"

    email_subject = "Activate Your Quarterly Report Portal Account"
    email_body = render_to_string('account_verification_email.txt', {
        'user': user,
        'verification_url': verification_url,
    })
    
    send_mail(
        email_subject,
        email_body,
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserProfileSerializer(self.user.profile)
        data['user'] = serializer.data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        send_verification_email(user)

class StudentRegisterView(generics.CreateAPIView):
    serializer_class = StudentRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_verification_email(user)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')

        if not uidb64 or not token:
            return Response({"error": "Missing UID or token."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and not user.is_active and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email verified successfully. You can now log in."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid or expired verification link."}, status=status.HTTP_400_BAD_REQUEST)

class SetInitialPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        new_password = request.data.get("new_password")

        if user.profile.password_changed:
            return Response({"error": "Password has already been set."}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password:
            return Response({"error": "New password not provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.profile.password_changed = True
        user.save()
        user.profile.save()

        return Response({"message": "Password set successfully."}, status=status.HTTP_200_OK)

class GetUserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            raise NotFound("Profile not found for this user.")

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('profile', 'profile__department').order_by('username')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update', 'create']:
            return UserManagementSerializer
        return UserDetailSerializer
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user:
            role = request.data.get('role')
            is_active = request.data.get('is_active')
            if (role and role != Profile.Role.ADMIN) or (is_active is False):
                return Response(
                    {"error": "You cannot remove your own admin role or deactivate your own account."},
                    status=status.HTTP_403_FORBIDDEN
                )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user:
            return Response(
                {"error": "You cannot deactivate your own account."},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
