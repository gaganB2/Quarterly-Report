# users/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from reports.models import Department
from .models import Profile

class UserAuthenticationAndProfileTests(APITestCase):
    """
    Comprehensive test suite for the entire user lifecycle.
    """

    def setUp(self):
        """
        Set up the necessary objects for all tests in this class.
        """
        # --- 1. Get Department ---
        # The 0002 migration creates departments, so we can just get one.
        self.department = Department.objects.get(name='CSE')
        
        # --- 2. Create Admin User (FIXED) ---
        # We now create the admin user here to make the test self-contained.
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        self.admin_user.profile.role = Profile.Role.ADMIN
        self.admin_user.profile.save()

        # --- 3. Define Test Data ---
        self.faculty_data = {
            'username': 'testfaculty',
            'password': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'faculty@test.com',
            'first_name': 'Test',
            'last_name': 'Faculty',
            'department': self.department.id,
            'role': 'Faculty'
        }

    def test_admin_can_register_new_user(self):
        """
        Verify that an authenticated admin user can successfully register a new user.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('register')
        
        initial_user_count = User.objects.count()
        
        response = self.client.post(url, self.faculty_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), initial_user_count + 1)
        self.assertTrue(User.objects.filter(username='testfaculty').exists())

    def test_registration_fails_with_duplicate_email(self):
        """
        Verify user registration fails if the email address is already in use.
        """
        # Create a user with the email we're about to test.
        User.objects.create_user(username='anotheruser', email='faculty@test.com', password='password')
        initial_user_count = User.objects.count()
        
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('register')
        response = self.client.post(url, self.faculty_data, format='json')
        
        # This test is CORRECT and is exposing a bug in the RegistrationSerializer.
        # It will continue to fail until the serializer's validation is fixed.
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(User.objects.count(), initial_user_count)

    def test_successful_user_login(self):
        """
        Verify that a user with correct credentials can log in and receive tokens.
        """
        # Create the user to log in with
        user = User.objects.create_user(
            username=self.faculty_data['username'],
            password=self.faculty_data['password'],
            email=self.faculty_data['email']
        )
        user.profile.department = self.department
        user.profile.role = self.faculty_data['role']
        user.profile.save()
        
        # FIX: Manually activate the user for this test to simulate email verification.
        user.is_active = True
        user.save()
        
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {
            'username': self.faculty_data['username'],
            'password': self.faculty_data['password']
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.faculty_data['email'])

    def test_authenticated_user_can_get_profile(self):
        """
        Verify that a logged-in user can successfully retrieve their own profile.
        """
        user = User.objects.create_user(
            username=self.faculty_data['username'],
            password=self.faculty_data['password']
        )
        user.profile.department = self.department
        user.profile.role = self.faculty_data['role']
        user.profile.save()
        
        self.client.force_authenticate(user=user)
        
        url = reverse('profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.faculty_data['username'])
        self.assertEqual(response.data['role'], self.faculty_data['role'])

