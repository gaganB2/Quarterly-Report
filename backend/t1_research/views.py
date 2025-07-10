# t1_research/views.py

from django.db.models import Count, F
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import T1_ResearchArticle, Department
from .serializers import T1ResearchArticleSerializer, DepartmentSerializer
from users.models import Profile


class T1ResearchViewSet(viewsets.ModelViewSet):
    serializer_class = T1ResearchArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        queryset = T1_ResearchArticle.objects.all()

        if profile.role == 'Faculty':
            queryset = queryset.filter(user=user)
        elif profile.role == 'HOD':
            queryset = queryset.filter(department=profile.department)

        # Optional filters via query params
        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        department = self.request.query_params.get("department")  # department id

        if year:
            queryset = queryset.filter(year=year)
        if quarter:
            queryset = queryset.filter(quarter=quarter)
        if department:
            queryset = queryset.filter(department__id=department)

        return queryset

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == 'Faculty' and serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own submissions.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == 'Faculty' and instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own submissions.")
        instance.delete()

    @action(detail=False, methods=['get'], url_path='metrics')
    def metrics(self, request):
        qs = self.get_queryset()

        # Submissions per quarter
        by_quarter = (
            qs
            .values('quarter')
            .annotate(count=Count('id'))
            .order_by('quarter')
        )

        # Submissions per department (pull department__name)
        dept_qs = (
            qs
            .values('department__name')
            .annotate(count=Count('id'))
            .order_by('department__name')
        )
        # Rename key to 'department'
        by_department = [
            {'department': item['department__name'], 'count': item['count']}
            for item in dept_qs
        ]

        # Submissions per year
        by_year = (
            qs
            .values('year')
            .annotate(count=Count('id'))
            .order_by('year')
        )

        return Response({
            'by_quarter': list(by_quarter),
            'by_department': by_department,
            'by_year': list(by_year),
        })



class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Simple read-only viewset for departments.
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
