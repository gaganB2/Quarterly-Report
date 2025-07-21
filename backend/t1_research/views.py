# t1_research/views.py

from django.db.models import Count, F
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import T1_ResearchArticle, Department
from .serializers import T1ResearchArticleSerializer, DepartmentSerializer
from .models import T1_2ResearchArticle
from .serializers import T1_2ResearchArticleSerializer
from .models import T2_1WorkshopAttendance
from .serializers import T2_1WorkshopAttendanceSerializer
from .models import T2_2WorkshopOrganized
from .serializers import T2_2WorkshopOrganizedSerializer
from .models import T3_1BookPublication
from .serializers import T3_1BookPublicationSerializer
from .models import T3_2ChapterPublication
from .serializers import T3_2ChapterPublicationSerializer
from .models import T4_1EditorialBoard
from .serializers import T4_1EditorialBoardSerializer
from .models import T4_2ReviewerDetails
from .serializers import T4_2ReviewerDetailsSerializer
from .models import T4_3CommitteeMembership
from .serializers import T4_3CommitteeMembershipSerializer
from .models import T5_1PatentDetails
from .serializers import T5_1PatentDetailsSerializer
from .models import T5_2SponsoredProject
from .serializers import T5_2SponsoredProjectSerializer
from .models import T5_3ConsultancyProject
from .serializers import T5_3ConsultancyProjectSerializer
from .models import T5_4CourseDevelopment
from .serializers import T5_4CourseDevelopmentSerializer
from .models import T5_5LabEquipmentDevelopment
from .serializers import T5_5LabEquipmentDevelopmentSerializer
from .models import T5_6ResearchGuidance
from .serializers import T5_6ResearchGuidanceSerializer
from .models import T6_1CertificationCourse
from .serializers import T6_1CertificationCourseSerializer
from .models import T6_2ProfessionalBodyMembership
from .serializers import T6_2ProfessionalBodyMembershipSerializer
from .models import T6_4ResourcePerson
from .serializers import T6_4ResourcePersonSerializer
from .models import T6_5AICTEInitiative
from .serializers import T6_5AICTEInitiativeSerializer
from .models import T7_1ProgramOrganized
from .serializers import T7_1ProgramOrganizedSerializer

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


class T2_1WorkshopAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = T2_1WorkshopAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T2_1WorkshopAttendance.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter/year if provided
        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T2_2WorkshopOrganizedViewSet(viewsets.ModelViewSet):
    serializer_class = T2_2WorkshopOrganizedSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T2_2WorkshopOrganized.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own records.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own records.")
        instance.delete()


class T3_1BookPublicationViewSet(viewsets.ModelViewSet):
    serializer_class = T3_1BookPublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T3_1BookPublication.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own entries.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own entries.")
        instance.delete()


class T3_2ChapterPublicationViewSet(viewsets.ModelViewSet):
    serializer_class = T3_2ChapterPublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T3_2ChapterPublication.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        year = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own entries.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == "Faculty" and instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own entries.")
        instance.delete()


class T4_1EditorialBoardViewSet(viewsets.ModelViewSet):
    serializer_class = T4_1EditorialBoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T4_1EditorialBoard.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by year if provided
        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year=year)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T4_2ReviewerDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = T4_2ReviewerDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T4_2ReviewerDetails.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by year if provided
        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year=year)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T4_3CommitteeMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = T4_3CommitteeMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T4_3CommitteeMembership.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter/year if provided
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T5_1PatentDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = T5_1PatentDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_1PatentDetails.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter/year if provided
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T5_2SponsoredProjectViewSet(viewsets.ModelViewSet):
    serializer_class = T5_2SponsoredProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_2SponsoredProject.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter/year if provided
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T5_3ConsultancyProjectViewSet(viewsets.ModelViewSet):
    serializer_class = T5_3ConsultancyProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_3ConsultancyProject.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter/year if provided
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T5_4CourseDevelopmentViewSet(viewsets.ModelViewSet):
    serializer_class = T5_4CourseDevelopmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_4CourseDevelopment.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T5_5LabEquipmentDevelopmentViewSet(viewsets.ModelViewSet):
    serializer_class = T5_5LabEquipmentDevelopmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_5LabEquipmentDevelopment.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T5_6ResearchGuidanceViewSet(viewsets.ModelViewSet):
    serializer_class = T5_6ResearchGuidanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T5_6ResearchGuidance.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)



class T6_1CertificationCourseViewSet(viewsets.ModelViewSet):
    serializer_class = T6_1CertificationCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T6_1CertificationCourse.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T6_2ProfessionalBodyMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = T6_2ProfessionalBodyMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T6_2ProfessionalBodyMembership.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

from .models import T6_3Award
from .serializers import T6_3AwardSerializer

class T6_3AwardViewSet(viewsets.ModelViewSet):
    serializer_class = T6_3AwardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T6_3Award.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)



class T6_4ResourcePersonViewSet(viewsets.ModelViewSet):
    serializer_class   = T6_4ResourcePersonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T6_4ResourcePerson.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

class T6_5AICTEInitiativeViewSet(viewsets.ModelViewSet):
    serializer_class   = T6_5AICTEInitiativeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T6_5AICTEInitiative.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)


class T7_1ProgramOrganizedViewSet(viewsets.ModelViewSet):
    serializer_class   = T7_1ProgramOrganizedSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = Profile.objects.get(user=self.request.user)
        qs = T7_1ProgramOrganized.objects.all()
        if profile.role == "Faculty":
            qs = qs.filter(user=self.request.user)
        elif profile.role == "HOD":
            qs = qs.filter(department=profile.department)

        # filter by quarter & year
        year    = self.request.query_params.get("year")
        quarter = self.request.query_params.get("quarter")
        if year:
            qs = qs.filter(year=year)
        if quarter:
            qs = qs.filter(quarter=quarter)
        return qs

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)
