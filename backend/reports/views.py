# reports/views.py

from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from .filters import *
from users.models import Profile

# --- Custom Permission Class ---
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Read-only access is allowed for any authenticated user.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'profile') and request.user.profile.role == 'Admin'

# --- Base ViewSet for DRY code ---
class BaseReportViewSet(viewsets.ModelViewSet):
    """
    An abstract base viewset that provides common permission and ordering logic.
    """
    permission_classes = [permissions.IsAuthenticated]
    # --- ADD THIS LINE TO FIX THE WARNING ---
    # This sets the default ordering for all lists to newest-first.
    ordering = ['-created_at']

    def get_queryset(self):
        # The ordering is now handled automatically by DRF before this method is called.
        queryset = self.queryset
        
        try:
            profile = self.request.user.profile
        except Profile.DoesNotExist:
            return queryset.model.objects.none()

        if profile.role == 'Admin':
            return queryset
        elif profile.role == 'HOD':
            return queryset.filter(department=profile.department)
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(user=self.request.user, department=profile.department)

    class Meta:
        abstract = True

# --- ViewSets ---

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

# --- Teacher Form ViewSets (T-Series) ---

class T1ResearchViewSet(BaseReportViewSet):
    queryset = T1_ResearchArticle.objects.all()
    serializer_class = T1ResearchArticleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T1ResearchArticleFilter

class T1_2ResearchViewSet(BaseReportViewSet):
    queryset = T1_2ResearchArticle.objects.all()
    serializer_class = T1_2ResearchArticleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T1_2ResearchArticleFilter

class T2_1WorkshopAttendanceViewSet(BaseReportViewSet):
    queryset = T2_1WorkshopAttendance.objects.all()
    serializer_class = T2_1WorkshopAttendanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T2_1WorkshopAttendanceFilter

class T2_2WorkshopOrganizedViewSet(BaseReportViewSet):
    queryset = T2_2WorkshopOrganized.objects.all()
    serializer_class = T2_2WorkshopOrganizedSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T2_2WorkshopOrganizedFilter

class T3_1BookPublicationViewSet(BaseReportViewSet):
    queryset = T3_1BookPublication.objects.all()
    serializer_class = T3_1BookPublicationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T3_1BookPublicationFilter

class T3_2ChapterPublicationViewSet(BaseReportViewSet):
    queryset = T3_2ChapterPublication.objects.all()
    serializer_class = T3_2ChapterPublicationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T3_2ChapterPublicationFilter

class T4_1EditorialBoardViewSet(BaseReportViewSet):
    queryset = T4_1EditorialBoard.objects.all()
    serializer_class = T4_1EditorialBoardSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T4_1EditorialBoardFilter

class T4_2ReviewerDetailsViewSet(BaseReportViewSet):
    queryset = T4_2ReviewerDetails.objects.all()
    serializer_class = T4_2ReviewerDetailsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T4_2ReviewerDetailsFilter

class T4_3CommitteeMembershipViewSet(BaseReportViewSet):
    queryset = T4_3CommitteeMembership.objects.all()
    serializer_class = T4_3CommitteeMembershipSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T4_3CommitteeMembershipFilter

class T5_1PatentDetailsViewSet(BaseReportViewSet):
    queryset = T5_1PatentDetails.objects.all()
    serializer_class = T5_1PatentDetailsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_1PatentDetailsFilter

class T5_2SponsoredProjectViewSet(BaseReportViewSet):
    queryset = T5_2SponsoredProject.objects.all()
    serializer_class = T5_2SponsoredProjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_2SponsoredProjectFilter

class T5_3ConsultancyProjectViewSet(BaseReportViewSet):
    queryset = T5_3ConsultancyProject.objects.all()
    serializer_class = T5_3ConsultancyProjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_3ConsultancyProjectFilter

class T5_4CourseDevelopmentViewSet(BaseReportViewSet):
    queryset = T5_4CourseDevelopment.objects.all()
    serializer_class = T5_4CourseDevelopmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_4CourseDevelopmentFilter

class T5_5LabEquipmentDevelopmentViewSet(BaseReportViewSet):
    queryset = T5_5LabEquipmentDevelopment.objects.all()
    serializer_class = T5_5LabEquipmentDevelopmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_5LabEquipmentDevelopmentFilter

class T5_6ResearchGuidanceViewSet(BaseReportViewSet):
    queryset = T5_6ResearchGuidance.objects.all()
    serializer_class = T5_6ResearchGuidanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T5_6ResearchGuidanceFilter

class T6_1CertificationCourseViewSet(BaseReportViewSet):
    queryset = T6_1CertificationCourse.objects.all()
    serializer_class = T6_1CertificationCourseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T6_1CertificationCourseFilter

class T6_2ProfessionalBodyMembershipViewSet(BaseReportViewSet):
    queryset = T6_2ProfessionalBodyMembership.objects.all()
    serializer_class = T6_2ProfessionalBodyMembershipSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T6_2ProfessionalBodyMembershipFilter

class T6_3AwardViewSet(BaseReportViewSet):
    queryset = T6_3Award.objects.all()
    serializer_class = T6_3AwardSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T6_3AwardFilter

class T6_4ResourcePersonViewSet(BaseReportViewSet):
    queryset = T6_4ResourcePerson.objects.all()
    serializer_class = T6_4ResourcePersonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T6_4ResourcePersonFilter

class T6_5AICTEInitiativeViewSet(BaseReportViewSet):
    queryset = T6_5AICTEInitiative.objects.all()
    serializer_class = T6_5AICTEInitiativeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T6_5AICTEInitiativeFilter

class T7_1ProgramOrganizedViewSet(BaseReportViewSet):
    queryset = T7_1ProgramOrganized.objects.all()
    serializer_class = T7_1ProgramOrganizedSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = T7_1ProgramOrganizedFilter

# --- Student Form ViewSets (S-Series) ---

class S1_1TheorySubjectDataViewSet(BaseReportViewSet):
    queryset = S1_1TheorySubjectData.objects.all()
    serializer_class = S1_1TheorySubjectDataSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S1_1TheorySubjectDataFilter

class S2_1StudentArticleViewSet(BaseReportViewSet):
    queryset = S2_1StudentArticle.objects.all()
    serializer_class = S2_1StudentArticleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S2_1StudentArticleFilter

class S2_2StudentConferencePaperViewSet(BaseReportViewSet):
    queryset = S2_2StudentConferencePaper.objects.all()
    serializer_class = S2_2StudentConferencePaperSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S2_2StudentConferencePaperFilter

class S2_3StudentSponsoredProjectViewSet(BaseReportViewSet):
    queryset = S2_3StudentSponsoredProject.objects.all()
    serializer_class = S2_3StudentSponsoredProjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S2_3StudentSponsoredProjectFilter

class S3_1CompetitionParticipationViewSet(BaseReportViewSet):
    queryset = S3_1CompetitionParticipation.objects.all()
    serializer_class = S3_1CompetitionParticipationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S3_1CompetitionParticipationFilter

class S3_2DeptProgramViewSet(BaseReportViewSet):
    queryset = S3_2DeptProgram.objects.all()
    serializer_class = S3_2DeptProgramSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S3_2DeptProgramFilter

class S4_1StudentExamQualificationViewSet(BaseReportViewSet):
    queryset = S4_1StudentExamQualification.objects.all()
    serializer_class = S4_1StudentExamQualificationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S4_1StudentExamQualificationFilter

class S4_2CampusRecruitmentViewSet(BaseReportViewSet):
    queryset = S4_2CampusRecruitment.objects.all()
    serializer_class = S4_2CampusRecruitmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S4_2CampusRecruitmentFilter

class S4_3GovtPSUSelectionViewSet(BaseReportViewSet):
    queryset = S4_3GovtPSUSelection.objects.all()
    serializer_class = S4_3GovtPSUSelectionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S4_3GovtPSUSelectionFilter

class S4_4PlacementHigherStudiesViewSet(BaseReportViewSet):
    queryset = S4_4PlacementHigherStudies.objects.all()
    serializer_class = S4_4PlacementHigherStudiesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S4_4PlacementHigherStudiesFilter

class S5_1StudentCertificationCourseViewSet(BaseReportViewSet):
    queryset = S5_1StudentCertificationCourse.objects.all()
    serializer_class = S5_1StudentCertificationCourseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S5_1StudentCertificationCourseFilter

class S5_2VocationalTrainingViewSet(BaseReportViewSet):
    queryset = S5_2VocationalTraining.objects.all()
    serializer_class = S5_2VocationalTrainingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S5_2VocationalTrainingFilter

class S5_3SpecialMentionAchievementViewSet(BaseReportViewSet):
    queryset = S5_3SpecialMentionAchievement.objects.all()
    serializer_class = S5_3SpecialMentionAchievementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S5_3SpecialMentionAchievementFilter

class S5_4StudentEntrepreneurshipViewSet(BaseReportViewSet):
    queryset = S5_4StudentEntrepreneurship.objects.all()
    serializer_class = S5_4StudentEntrepreneurshipSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = S5_4StudentEntrepreneurshipFilter
