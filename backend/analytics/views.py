# analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from reports.models import Department, T1_ResearchArticle
from django.db.models import Count
from users.models import Profile

class SubmissionsByDepartmentView(APIView):
    """
    An API view that returns the count of T1 Research Article submissions
    grouped by department.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Ensure the user has a profile to check their role
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"error": "User profile not found."}, status=403)

        # Only Admins and HODs should access analytics
        if profile.role not in ['Admin', 'HOD']:
            return Response({"error": "You do not have permission to view analytics."}, status=403)

        # Query to get all departments and annotate with the count of submissions
        # We use 't1_researcharticle' which is the lowercase model name Django uses for the relation
        queryset = Department.objects.annotate(
            submission_count=Count('t1_researcharticle')
        ).values('name', 'submission_count').order_by('-submission_count')

        # Format the data for the charting library
        data = [
            {
                "department": item['name'],
                "count": item['submission_count']
            }
            for item in queryset
        ]
        
        return Response(data)