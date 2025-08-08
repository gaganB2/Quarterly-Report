# users/views.py

from django.contrib.auth.models import User
from rest_framework import status, permissions, generics, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework.decorators import action

from rest_framework import status
# --- V MODIFIED: IMPORT NEW SERIALIZER ---
from .serializers import (
    RegistrationSerializer, 
    UserProfileSerializer, 
    UserDetailSerializer,
    UserManagementSerializer 
)
# --- ^ END MODIFIED ---
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED
        )


class GetUserProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all().select_related('user', 'department')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.get_queryset().get(user=self.request.user)
        except Profile.DoesNotExist:
            raise NotFound(detail="Profile not found for this user.", code=404)


# --- V MODIFIED: UPGRADE TO FULL MODELVIEWSET ---
class UserManagementViewSet(viewsets.ModelViewSet):
    """
    A viewset for listing, retrieving, updating, and deactivating users.
    Provides full CRUD capabilities for the admin dashboard.
    """
    queryset = User.objects.all().select_related('profile', 'profile__department').order_by('username')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        """
        Use a different serializer for read vs. write actions.
        - UserDetailSerializer for listing/retrieving (read-only, optimized).
        - UserManagementSerializer for updating (write-enabled).
        """
        if self.action in ['update', 'partial_update']:
            return UserManagementSerializer
        return UserDetailSerializer
    
    @action(detail=True, methods=['post'], url_path='set-password')
    def set_password(self, request, pk=None):
        """A custom action for an admin to reset a user's password."""
        user = self.get_object()
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password not provided."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Validate the new password against Django's validators
            validate_password(password, user)
        except Exception as e:
            return Response({"error": list(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({"status": "password set successfully"}, status=status.HTTP_200_OK)


    def destroy(self, request, *args, **kwargs):
        """
        Overrides the default delete behavior to implement a "soft delete".
        Instead of deleting the user, it sets their `is_active` flag to False.
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
# --- ^ END MODIFIED ---
