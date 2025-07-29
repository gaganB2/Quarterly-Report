# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.permissions import IsAuthenticated

class RegisterUserView(APIView):
    def post(self, request):
        # This view remains the same
        data = request.data
        user = User.objects.create_user(username=data['username'], password=data['password'])
        Profile.objects.create(user=user, department=data['department'], role=data['role'])
        return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)

class GetUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Try to get the profile linked to the logged-in user
            profile = Profile.objects.get(user=request.user)
            
            # Check if the department is None before trying to access its properties
            department_name = profile.department.name if profile.department else None

            return Response({
                'username': request.user.username,
                'department': department_name, # Return the department name or None
                'role': profile.role
            })
        except Profile.DoesNotExist:
            # If no profile exists for this user, return a clear error instead of crashing
            return Response(
                {'error': 'Profile not found for this user. Please contact an admin.'}, 
                status=status.HTTP_404_NOT_FOUND
            )