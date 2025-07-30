# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import Profile
from t1_research.models import Department

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles validation and creation of a new user and their profile.
    """
    # The department is a write-only field that accepts an integer (the department's primary key).
    # This ensures the client sends a valid department ID that exists in the database.
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        write_only=True
    )
    role = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'department', 'role')
        extra_kwargs = {
            'username': {'required': True}
        }

    def validate(self, attrs):
        """
        Custom validation to check that passwords match and the role is a valid choice.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Validate that the provided role is one of the available choices in the Profile model.
        valid_roles = [choice[0] for choice in Profile.ROLE_CHOICES]
        if attrs['role'] not in valid_roles:
            raise serializers.ValidationError({"role": f"Invalid role. Must be one of {valid_roles}."})

        return attrs

    def create(self, validated_data):
        """
        Create and return a new user and their profile within a single, safe database transaction.
        """
        try:
            # An atomic transaction ensures that if any step fails, the entire operation is rolled back.
            # This prevents creating a user without a profile, ensuring data integrity.
            with transaction.atomic():
                user = User.objects.create_user(
                    username=validated_data['username'],
                    password=validated_data['password']
                )

                Profile.objects.create(
                    user=user,
                    department=validated_data['department'],
                    role=validated_data['role']
                )
                return user
        except Exception as e:
            # If any unexpected error occurs, report it as a validation error.
            raise serializers.ValidationError(str(e))


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying the user's profile details.
    It correctly fetches the department name instead of just its ID.
    """
    # Use source='department.name' to get the department's name string for display.
    department = serializers.CharField(source='department.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ('username', 'department', 'role')
