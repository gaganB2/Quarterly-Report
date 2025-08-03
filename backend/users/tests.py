# users/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from reports.models import Department
from .models import Profile

class UserAuthenticationAndProfileTests(APITestCase):
    """
    Comprehensive test suite for the entire user lifecycle, including:
    - User registration (success and failure cases).
    - User login (success and failure cases).
    - Profile data retrieval (authenticated vs. unauthenticated).
    """

    def setUp(self):
        """
        Set up the necessary objects for all tests in this class.
        """
        # The migrations already create departments, so we can just get one.
        self.department = Department.objects.first()
        
        # --- V MODIFIED: Use the admin user created by migrations ---
        # Instead of creating a new superuser, we fetch the one that our
        # 0002_initial_data.py migration creates. This is more robust and
        # solves the incorrect user count issue in the tests.
        self.admin_user = User.objects.get(username='admin')
        # --- ^ END MODIFIED ---

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
        # At the start of this test, only the 'admin' user from migrations exists.
        self.assertEqual(User.objects.count(), 1)

        self.client.force_authenticate(user=self.admin_user)
        url = reverse('register')
        response = self.client.post(url, self.faculty_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # We now expect 2 users: the initial 'admin' and the new 'testfaculty'.
        self.assertEqual(User.objects.count(), 2)
        self.assertTrue(User.objects.filter(username='testfaculty').exists())
        self.assertTrue(Profile.objects.filter(user__username='testfaculty').exists())

    def test_registration_fails_with_duplicate_email(self):
        """
        Verify that user registration fails if the email address is already in use.
        """
        # Create a user with the email we're about to test.
        # We start with 1 user ('admin'), this makes it 2.
        User.objects.create_user(username='anotheruser', email='faculty@test.com', password='password')
        self.assertEqual(User.objects.count(), 2)
        
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('register')
        response = self.client.post(url, self.faculty_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        # The count should still be 2, as no new user was created.
        self.assertEqual(User.objects.count(), 2)

    def test_successful_user_login(self):
        """
        Verify that a user with correct credentials can log in and receive
        JWT tokens and their profile information.
        """
        # Create the user to log in with
        user = User.objects.create_user(
            username=self.faculty_data['username'],
            password=self.faculty_data['password'],
            email=self.faculty_data['email']
        )
        # --- V FIXED: Create the Profile for the user ---
        # This was the cause of the 'User has no profile' error.
        Profile.objects.create(user=user, department=self.department, role=self.faculty_data['role'])
        # --- ^ END FIXED ---
        
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

    def test_login_fails_with_wrong_password(self):
        """
        Verify that a login attempt with an incorrect password fails.
        """
        User.objects.create_user(
            username=self.faculty_data['username'],
            password=self.faculty_data['password']
        )
        
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {
            'username': self.faculty_data['username'],
            'password': 'wrongpassword'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.data)

    def test_authenticated_user_can_get_profile(self):
        """
        Verify that a logged-in user can successfully retrieve their own profile.
        """
        # Create the user and their profile
        user = User.objects.create_user(
            username=self.faculty_data['username'],
            password=self.faculty_data['password']
        )
        Profile.objects.create(user=user, department=self.department, role=self.faculty_data['role'])
        
        # Authenticate the client as this user
        self.client.force_authenticate(user=user)
        
        url = reverse('profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.faculty_data['username'])
        self.assertEqual(response.data['role'], self.faculty_data['role'])

    def test_unauthenticated_user_cannot_get_profile(self):
        """
        Verify that an unauthenticated request to the profile endpoint is denied.
        """
        url = reverse('profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
