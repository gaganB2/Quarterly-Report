# users/views.py

from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Profile
from .serializers import RegistrationSerializer, UserProfileSerializer

class RegisterUserView(generics.CreateAPIView):
    """
    Creates a new user and their associated profile.
    This endpoint is now secure and restricted to Admin users only.
    """
    serializer_class = RegistrationSerializer
    # SECURITY FIX: Only authenticated users who are also admins can create new users.
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        # The serializer now handles all validation. If data is invalid, it raises an exception.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # The .save() method on the serializer will call our custom .create() method
        # which includes the atomic transaction for data safety.
        self.perform_create(serializer)

        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED
        )


class GetUserProfileView(generics.RetrieveAPIView):
    """
    Retrieves the profile for the currently authenticated user.
    This view is now robust and will not crash if a profile is missing.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Using self.request.user.profile is the standard, safe way to get the related profile.
        # If the profile does not exist, DRF will automatically and correctly return a 404 Not Found error.
        try:
            # The 'profile' is the related_name from the OneToOneField in the Profile model.
            return self.request.user.profile
        except Profile.DoesNotExist:
            # This handles the edge case where a user might exist without a profile.
            raise NotFound(detail="Profile not found for this user.", code=404)
