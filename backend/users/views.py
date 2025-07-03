from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.permissions import IsAuthenticated

class RegisterUserView(APIView):
    def post(self, request):
        data = request.data
        user = User.objects.create_user(username=data['username'], password=data['password'])
        Profile.objects.create(user=user, department=data['department'], role=data['role'])
        return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)

class GetUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        return Response({
            'username': request.user.username,
            'department': profile.department,
            'role': profile.role
        })
