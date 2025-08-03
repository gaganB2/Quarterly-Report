# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import Profile
from reports.models import Department

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles validation and creation of a new user and their profile.
    """
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        write_only=True
    )
    role = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")
    
    # --- V NEW: Add fields for complete user identity ---
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    # --- ^ END NEW ---

    class Meta:
        model = User
        # --- V MODIFIED: Include the new fields in the serializer ---
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'department', 'role')
        # --- ^ END MODIFIED ---
        extra_kwargs = {
            'username': {'required': True}
        }

    def validate(self, attrs):
        """
        Custom validation to check that passwords match and the role is a valid choice.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        valid_roles = [choice[0] for choice in Profile.Role.choices] # Use new Role choices
        if attrs['role'] not in valid_roles:
            raise serializers.ValidationError({"role": f"Invalid role. Must be one of {valid_roles}."})
        
        # --- V NEW: Add validation for unique email ---
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        # --- ^ END NEW ---

        return attrs

    def create(self, validated_data):
        """
        Create and return a new user and their profile within a single, safe database transaction.
        """
        try:
            with transaction.atomic():
                # --- V MODIFIED: Pass all identity fields to create_user ---
                user = User.objects.create_user(
                    username=validated_data['username'],
                    password=validated_data['password'],
                    email=validated_data['email'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name']
                )
                # --- ^ END MODIFIED ---

                Profile.objects.create(
                    user=user,
                    department=validated_data['department'],
                    role=validated_data['role']
                )
                return user
        except Exception as e:
            raise serializers.ValidationError(str(e))


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying the user's profile details.
    It correctly fetches the department name instead of just its ID.
    """
    department = serializers.CharField(source='department.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    # --- V NEW: Add user's full name and email to the profile view ---
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    # --- ^ END NEW ---

    class Meta:
        model = Profile
        # --- V MODIFIED: Add new fields to the output ---
        fields = ('username', 'full_name', 'email', 'department', 'role')
        # --- ^ END MODIFIED ---


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users in the admin management panel.
    """
    department = serializers.CharField(source='profile.department.name', read_only=True, allow_null=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    # --- V NEW: Add user's full name and email to the admin list view ---
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    email = serializers.EmailField(read_only=True)
    # --- ^ END NEW ---

    class Meta:
        model = User
        # --- V MODIFIED: Add new fields to the output ---
        fields = ['id', 'username', 'full_name', 'email', 'department', 'role']
        # --- ^ END MODIFIED ---