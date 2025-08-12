# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import Profile
from reports.models import Department

class RegistrationSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    role = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    prefix = serializers.ChoiceField(
        choices=Profile.Prefix.choices, 
        source='profile.prefix', 
        required=False, 
        allow_blank=True
    )
    middle_name = serializers.CharField(source='profile.middle_name', required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'department', 'role', 'prefix', 'middle_name')
        extra_kwargs = {
            'username': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        valid_roles = [choice[0] for choice in Profile.Role.choices]
        if attrs['role'] not in valid_roles:
            raise serializers.ValidationError({"role": f"Invalid role. Must be one of {valid_roles}."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})

        role = attrs.get('role')
        department = attrs.get('department')
        if role in ['Faculty', 'HOD'] and not department:
            raise serializers.ValidationError({
                'department': 'A Department must be assigned for Faculty and HOD roles.'
            })

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

            profile_data = validated_data.get('profile', {})
            user.profile.role = validated_data['role']
            user.profile.department = validated_data.get('department')
            user.profile.prefix = profile_data.get('prefix', '')
            user.profile.middle_name = profile_data.get('middle_name', '')
            user.profile.save()
            
            if validated_data['role'] == 'Admin':
                user.is_staff = True
                user.save()
            return user


class UserProfileSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        # --- MODIFIED: Added the new 'password_changed' field ---
        fields = ('username', 'full_name', 'email', 'department', 'role', 'password_changed')


class UserDetailSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='profile.department.name', read_only=True, allow_null=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    email = serializers.EmailField(read_only=True)
    prefix = serializers.CharField(source='profile.prefix', read_only=True)
    middle_name = serializers.CharField(source='profile.middle_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'department', 'role', 'is_active', 'prefix', 'middle_name']


class UserManagementSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='profile.department',
        allow_null=True
    )
    role = serializers.ChoiceField(
        choices=Profile.Role.choices,
        source='profile.role'
    )
    prefix = serializers.ChoiceField(
        choices=Profile.Prefix.choices,
        source='profile.prefix',
        required=False, 
        allow_blank=True
    )
    middle_name = serializers.CharField(
        source='profile.middle_name',
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'department', 'role', 'is_active', 'prefix', 'middle_name'
        )
        read_only_fields = ('username',)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()

        if profile_data:
            profile.department = profile_data.get('department', profile.department)
            profile.role = profile_data.get('role', profile.role)
            profile.prefix = profile_data.get('prefix', profile.prefix)
            profile.middle_name = profile_data.get('middle_name', profile.middle_name)
            profile.save()

        return instance