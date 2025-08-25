# users/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from reports.models import Department
from .models import Profile
# We need to mock the email sending function to prevent real emails during tests
from unittest.mock import patch

class UserFlowsTests(APITestCase):
    """
    A comprehensive test suite for the entire user lifecycle,
    covering both Staff (Faculty/HOD) and Student registration and login flows.
    """

    @classmethod
    def setUpTestData(cls):
        """Set up non-modified objects used by all test methods."""
        cls.cse_dept = Department.objects.get(name='CSE')
        cls.admin_user = User.objects.create_superuser('admin_user', 'admin@test.com', 'password')
        cls.admin_user.profile.role = Profile.Role.ADMIN
        cls.admin_user.profile.save()

    def setUp(self):
        """Set up data that might be modified by tests."""
        self.faculty_data = {
            'username': 'test_faculty', 'password': 'strongpassword123', 'password2': 'strongpassword123',
            'email': 'faculty@test.com', 'first_name': 'Test', 'last_name': 'Faculty',
            'department': self.cse_dept.id, 'role': 'Faculty'
        }
        self.student_data = {
            'username': '2023CSE001', 'password': 'strongpassword123', 'password2': 'strongpassword123',
            'email': 'student@test.com', 'first_name': 'Test', 'last_name': 'Student',
            'department': self.cse_dept.id
        }

    @patch('users.views.send_verification_email')
    def test_faculty_registration_and_forced_password_change(self, mock_send_email):
        """
        ASSURANCE: Verifies the entire flow for staff (Faculty/HOD).
        1. Admin registers a new faculty member.
        2. Faculty member is created as INACTIVE.
        3. Faculty member CANNOT log in.
        4. After activation, they CAN log in but must change their password.
        """
        # 1. Admin registers a new faculty member
        self.client.force_authenticate(user=self.admin_user)
        register_url = reverse('register')
        response = self.client.post(register_url, self.faculty_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify email function was called
        mock_send_email.assert_called_once()
        
        # 2. Verify the new faculty member exists and is inactive
        faculty_user = User.objects.get(username=self.faculty_data['username'])
        self.assertFalse(faculty_user.is_active)
        self.assertFalse(faculty_user.profile.password_changed)

        # 3. Verify the inactive faculty CANNOT log in
        login_url = reverse('token_obtain_pair')
        response = self.client.post(login_url, {
            'username': self.faculty_data['username'], 'password': self.faculty_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # 4. Manually activate the user (simulating email verification)
        faculty_user.is_active = True
        faculty_user.save()

        # 5. Verify the NOW ACTIVE faculty CAN log in
        response = self.client.post(login_url, {
            'username': self.faculty_data['username'], 'password': self.faculty_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The login response should confirm they need to change their password
        self.assertFalse(response.data['user']['password_changed'])

        # 6. Verify they can use the force-password-change endpoint
        self.client.force_authenticate(user=faculty_user)
        set_password_url = reverse('set-initial-password')
        response = self.client.post(set_password_url, {'new_password': 'a_new_secure_password'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 7. Verify the flag is now updated
        faculty_user.refresh_from_db()
        self.assertTrue(faculty_user.profile.password_changed)

    @patch('users.views.send_verification_email')
    def test_student_registration_and_login_flow(self, mock_send_email):
        """
        ASSURANCE: Verifies the entire flow for Students.
        1. Student self-registers.
        2. Student is created as INACTIVE.
        3. Student CANNOT log in.
        4. After activation, they CAN log in without a forced password change.
        """
        # 1. Student self-registers
        register_url = reverse('student-register')
        response = self.client.post(register_url, self.student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify email function was called
        mock_send_email.assert_called_once()

        # 2. Verify the new student exists and is inactive
        student_user = User.objects.get(username=self.student_data['username'])
        self.assertFalse(student_user.is_active)
        self.assertEqual(student_user.profile.role, Profile.Role.STUDENT)

        # 3. Verify the inactive student CANNOT log in
        login_url = reverse('token_obtain_pair')
        response = self.client.post(login_url, {
            'username': self.student_data['username'], 'password': self.student_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # 4. Manually activate the user (simulating email verification)
        student_user.is_active = True
        student_user.save()

        # 5. Verify the NOW ACTIVE student CAN log in
        response = self.client.post(login_url, {
            'username': self.student_data['username'], 'password': self.student_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['role'], 'Student')

