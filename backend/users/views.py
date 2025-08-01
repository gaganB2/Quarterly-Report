# users/views.py

# --- Consolidated Imports ---
from django.contrib.auth.models import User
from rest_framework import status, permissions, generics, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Profile
from .serializers import RegistrationSerializer, UserProfileSerializer, UserDetailSerializer


class RegisterUserView(generics.CreateAPIView):
    """
    Creates a new user and their associated profile.
    Restricted to Admin users only.
    """
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
    """
    Retrieves the profile for the currently authenticated user.
    """
    # --- ADDED (Performance): Pre-fetch related data to prevent extra DB queries ---
    queryset = Profile.objects.all().select_related('user', 'department')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            # The queryset is now automatically used to fetch the object
            return self.get_queryset().get(user=self.request.user)
        except Profile.DoesNotExist:
            raise NotFound(detail="Profile not found for this user.", code=404)


class UserManagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for listing users in the admin dashboard.
    """
    queryset = User.objects.all().select_related('profile', 'profile__department').order_by('username')
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]
