# analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Q

from reports.models import Department
from users.models import Profile
from .utils import ANALYTICS_CATEGORIES

class DepartmentSubmissionsView(APIView):
    """
    A comprehensive API view to get submission counts grouped by department.
    It is now highly flexible, allowing filtering by report category, year, and quarter.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"error": "User profile not found."}, status=status.HTTP_403_FORBIDDEN)

        if profile.role not in [Profile.Role.ADMIN, Profile.Role.HOD]:
            return Response({"error": "You do not have permission to view analytics."}, status=status.HTTP_403_FORBIDDEN)

        # --- 1. Determine which models to query ---
        category_key = request.query_params.get('category')
        models_to_query = []

        if category_key:
            category_info = ANALYTICS_CATEGORIES.get(category_key)
            if not category_info:
                return Response({"error": f"Invalid category '{category_key}'."}, status=status.HTTP_400_BAD_REQUEST)
            models_to_query = category_info["models"]
        else:
            # If no category is specified, aggregate across all models
            for category in ANALYTICS_CATEGORIES.values():
                models_to_query.extend(category["models"])

        # --- 2. Apply Filters (Year & Quarter) ---
        year = request.query_params.get('year')
        quarter = request.query_params.get('quarter')
        
        filter_kwargs = {}
        if year:
            filter_kwargs['year'] = year
        if quarter:
            filter_kwargs['quarter'] = quarter

        # --- 3. Aggregate Counts from all relevant models ---
        department_counts = {}
        for model in models_to_query:
            # The related name from Department to a report is the model's name in lowercase
            related_name = model._meta.model_name
            
            # Apply year/quarter filters directly to the related manager
            filtered_submissions = model.objects.filter(**filter_kwargs)
            
            # Group by department and count
            counts = (
                Department.objects
                .filter(**{f'{related_name}__in': filtered_submissions})
                .annotate(count=Count(related_name))
                .values('name', 'count')
            )
            
            for item in counts:
                department_name = item['name']
                department_counts[department_name] = department_counts.get(department_name, 0) + item['count']

        # --- 4. Format the final response ---
        # Get all departments to ensure even those with zero submissions are included
        all_departments = Department.objects.all()
        if profile.role == Profile.Role.HOD:
             all_departments = all_departments.filter(id=profile.department.id)

        response_data = [
            {
                "department": dept.name,
                "count": department_counts.get(dept.name, 0)
            }
            for dept in all_departments
        ]
        
        # Sort by count descending
        response_data.sort(key=lambda x: x['count'], reverse=True)

        return Response(response_data)


class AnalyticsCategoriesView(APIView):
    """A new view to provide the frontend with a list of available analytics categories."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        categories = [
            {"key": key, "display_name": value["display_name"]}
            for key, value in ANALYTICS_CATEGORIES.items()
        ]
        return Response(categories)

