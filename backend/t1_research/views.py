# t1_research/views.py

from django.db.models import Count, F
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import T1_2ResearchArticle
from .serializers import T1_2ResearchArticleSerializer


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
        """
        Returns:
        {
        "by_quarter": [{"quarter":"Q1","count":5}, ...],
        "by_year": [{"year":2025,"count":12}, ...],
        "by_department": [{"department":"CSE","count":8}, ...]
        }
        """
        user = request.user
        profile = Profile.objects.get(user=user)

        qs = T1_ResearchArticle.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # Grouped counts
        by_quarter = list(
            qs.values('quarter')
            .annotate(count=Count('id'))
            .order_by('quarter')
        )
        by_year = list(
            qs.values('year')
            .annotate(count=Count('id'))
            .order_by('year')
        )
        by_department = list(
            qs.values(department=F('department__name'))
            .annotate(count=Count('id'))
            .order_by('department')
        )

        return Response({
            'by_quarter': by_quarter,
            'by_year': by_year,
            'by_department': by_department,
        })


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class T1_2ResearchViewSet(viewsets.ModelViewSet):
    """
    CRUD for T1.2 Conference-paper publications.
    Same role-based access & filters as T1ResearchViewSet.
    """
    serializer_class = T1_2ResearchArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        qs = T1_2ResearchArticle.objects.all()

        if profile.role == 'Faculty':
            qs = qs.filter(user=user)
        elif profile.role == 'HOD':
            qs = qs.filter(department=profile.department)

        # Optional filters
        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        department = self.request.query_params.get("department")

        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        if department:
            qs = qs.filter(department__id=department)

        return qs

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
