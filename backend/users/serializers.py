# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import Profile
from reports.models import Department

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for registering new staff members (Faculty, HOD, Admin).
    """
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), write_only=True, required=False, allow_null=True
    )
    role = serializers.ChoiceField(choices=Profile.Role.choices, write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")
    prefix = serializers.ChoiceField(
        choices=Profile.Prefix.choices, source='profile.prefix', required=False, allow_blank=True
    )
    middle_name = serializers.CharField(source='profile.middle_name', required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = (
            'username', 'password', 'password2', 'email', 'first_name', 'last_name', 
            'department', 'role', 'prefix', 'middle_name'
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        role = attrs.get('role')
        department = attrs.get('department')
        if role in [Profile.Role.FACULTY, Profile.Role.HOD] and not department:
            raise serializers.ValidationError({'department': 'A department must be assigned for Faculty and HOD roles.'})
        if role == Profile.Role.ADMIN and department:
            raise serializers.ValidationError({'department': 'An Admin cannot be assigned to a specific department.'})
        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
            
            profile = user.profile
            profile.role = validated_data['role']
            profile.department = validated_data.get('department')
            
            profile_data = validated_data.get('profile', {})
            profile.prefix = profile_data.get('prefix', '')
            profile.middle_name = profile_data.get('middle_name', '')
            profile.save()
            
            if validated_data['role'] == Profile.Role.ADMIN:
                user.is_staff = True
                user.is_superuser = True
                user.save(update_fields=['is_staff', 'is_superuser'])
            return user


class StudentRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for public student registration.
    FIX: This now correctly uses username for Admission/Roll No.
    """
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), write_only=True, required=True
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'department')
        extra_kwargs = {
            'username': {'label': 'Admission/Roll No.'},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this Admission/Roll No. already exists."})

        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
            profile = user.profile
            profile.role = Profile.Role.STUDENT
            profile.department = validated_data.get('department')
            profile.save()
            
            return user


class UserProfileSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ('username', 'full_name', 'email', 'department', 'role', 'password_changed')


class UserDetailSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='profile.department.name', read_only=True, allow_null=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email', 'department', 'role', 'is_active')


class UserManagementSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='profile.department', allow_null=True, required=False
    )
    role = serializers.ChoiceField(choices=Profile.Role.choices, source='profile.role')
    prefix = serializers.ChoiceField(
        choices=Profile.Prefix.choices, source='profile.prefix', required=False, allow_blank=True
    )
    middle_name = serializers.CharField(source='profile.middle_name', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 
            'department', 'role', 'is_active', 'prefix', 'middle_name'
        )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        
        profile.department = profile_data.get('department', profile.department)
        profile.role = profile_data.get('role', profile.role)
        profile.prefix = profile_data.get('prefix', profile.prefix)
        profile.middle_name = profile_data.get('middle_name', profile.middle_name)
        
        if profile.role == Profile.Role.ADMIN:
            instance.is_staff = True
            instance.is_superuser = True
            profile.department = None
        else:
            instance.is_staff = False
            instance.is_superuser = False

        with transaction.atomic():
            instance.save()
            profile.save()

        return instance
