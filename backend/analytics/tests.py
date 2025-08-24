# analytics/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from reports.models import Department, T1_ResearchArticle, S2_1StudentArticle
from users.models import Profile

class AnalyticsEndpointTests(APITestCase):
    """
    A comprehensive test suite for the analytics endpoints to ensure
    data accuracy, permission scoping, and filtering work correctly.
    """

    @classmethod
    def setUpTestData(cls):
        """Set up data for the entire test class."""
        # --- 1. Get Departments (FIXED) ---
        # The 0002 migration already creates departments. We get them instead of creating.
        cls.cse_dept = Department.objects.get(name='CSE')
        cls.mech_dept = Department.objects.get(name='MECH')

        # --- 2. Create Users with Different Roles ---
        cls.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        cls.admin_user.profile.role = Profile.Role.ADMIN
        cls.admin_user.profile.save()

        cls.hod_cse = User.objects.create_user('hod_cse', 'hod_cse@test.com', 'password')
        cls.hod_cse.profile.role = Profile.Role.HOD
        cls.hod_cse.profile.department = cls.cse_dept
        cls.hod_cse.profile.save()

        cls.faculty_cse = User.objects.create_user('faculty_cse', 'faculty_cse@test.com', 'password')
        cls.faculty_cse.profile.role = Profile.Role.FACULTY
        cls.faculty_cse.profile.department = cls.cse_dept
        cls.faculty_cse.profile.save()

        cls.faculty_mech = User.objects.create_user('faculty_mech', 'faculty_mech@test.com', 'password')
        cls.faculty_mech.profile.role = Profile.Role.FACULTY
        cls.faculty_mech.profile.department = cls.mech_dept
        cls.faculty_mech.profile.save()

        # --- 3. Create Sample Report Data ---
        # T1 - Faculty Research (CSE: 2, MECH: 1)
        T1_ResearchArticle.objects.create(user=cls.faculty_cse, department=cls.cse_dept, year=2023, quarter='Q1', title='CSE Report 1')
        T1_ResearchArticle.objects.create(user=cls.faculty_cse, department=cls.cse_dept, year=2023, quarter='Q2', title='CSE Report 2')
        T1_ResearchArticle.objects.create(user=cls.faculty_mech, department=cls.mech_dept, year=2023, quarter='Q1', title='MECH Report 1')

        # S2 - Student Research (CSE: 1)
        S2_1StudentArticle.objects.create(user=cls.faculty_cse, department=cls.cse_dept, year=2024, quarter='Q3', title='Student Report 1')

    def test_admin_can_view_all_department_submissions(self):
        """
        Verify that an Admin user can see unfiltered submission counts for all departments.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('department-submissions')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Total submissions: 3 T1 + 1 S2 = 4
        # Expected order: CSE (3), MECH (1). We check all departments are present.
        self.assertTrue(len(response.data) >= 2) # Should contain at least CSE and MECH
        
        cse_data = next((item for item in response.data if item["department"] == "CSE"), None)
        mech_data = next((item for item in response.data if item["department"] == "MECH"), None)

        self.assertIsNotNone(cse_data)
        self.assertIsNotNone(mech_data)
        self.assertEqual(cse_data['count'], 3)
        self.assertEqual(mech_data['count'], 1)


    def test_hod_can_only_view_their_department_submissions(self):
        """
        Verify that an HOD user sees submission counts ONLY for their own department.
        """
        self.client.force_authenticate(user=self.hod_cse)
        url = reverse('department-submissions')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # HOD of CSE should only see CSE's 3 submissions.
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['department'], 'CSE')
        self.assertEqual(response.data[0]['count'], 3)

    def test_analytics_filter_by_year(self):
        """
        Verify that the analytics endpoint can be correctly filtered by year.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('department-submissions') + '?year=2023'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # In 2023, there were 3 T1 submissions.
        cse_data = next((item for item in response.data if item["department"] == "CSE"), None)
        mech_data = next((item for item in response.data if item["department"] == "MECH"), None)

        self.assertIsNotNone(cse_data)
        self.assertIsNotNone(mech_data)
        self.assertEqual(cse_data['count'], 2)
        self.assertEqual(mech_data['count'], 1)

    def test_analytics_filter_by_category(self):
        """
        Verify that the analytics endpoint can be correctly filtered by category.
        """
        self.client.force_authenticate(user=self.admin_user)
        # Filter for the "student_research_and_projects" category
        url = reverse('department-submissions') + '?category=student_research_and_projects'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only 1 student submission exists, in CSE.
        cse_data = next((item for item in response.data if item["department"] == "CSE"), None)
        mech_data = next((item for item in response.data if item["department"] == "MECH"), None)

        self.assertIsNotNone(cse_data)
        self.assertIsNotNone(mech_data)
        self.assertEqual(cse_data['count'], 1)
        self.assertEqual(mech_data['count'], 0)
        
    def test_get_analytics_categories(self):
        """
        Verify that the categories endpoint returns the list of defined categories.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('analytics-categories')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertTrue(len(response.data) > 0)
        # Check if a known category is present
        self.assertTrue(any(d['key'] == 'faculty_research_and_publications' for d in response.data))

