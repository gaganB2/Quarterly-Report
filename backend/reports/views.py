# reports/views.py

from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from .filters import *
from users.models import Profile

# --- Base ViewSet for DRY code ---
class BaseReportViewSet(viewsets.ModelViewSet):
    """
    An abstract base viewset that provides common permission, query optimization,
    and ordering logic for all report models.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        """
        This method is now highly optimized. It fetches all necessary related data
        in a single database query, preventing the N+1 problem.
        """
        queryset = self.queryset
        optimized_queryset = queryset.select_related('user', 'department')

        try:
            profile = self.request.user.profile
        except Profile.DoesNotExist:
            return optimized_queryset.none()

        if profile.role == 'Admin':
            return optimized_queryset.order_by('-created_at')
        elif profile.role == 'HOD':
            return optimized_queryset.filter(department=profile.department).order_by('-created_at')
        else: # Faculty
            return optimized_queryset.filter(user=self.request.user).order_by('-created_at')

# --- Dynamic ViewSet Factory (FIXED) ---
def create_report_viewset(model_cls, serializer_cls, filterset_cls):
    """
    A factory function that dynamically creates and returns a ViewSet class
    for a given report model, serializer, and filter. This version is corrected
    to avoid the NameError during class creation.
    """
    class ReportViewSet(BaseReportViewSet):
        # Define the class with a pass statement.
        # We will set its attributes directly on the class object below.
        pass

    # Set the class attributes on the newly created class object.
    # This avoids the scoping issue that caused the NameError.
    ReportViewSet.queryset = model_cls.objects.all()
    ReportViewSet.serializer_class = serializer_cls
    ReportViewSet.filterset_class = filterset_cls
    
    # Set the class name for better API documentation and debugging.
    ReportViewSet.__name__ = f"{model_cls.__name__}ViewSet"
    
    return ReportViewSet

# --- Dynamically Create ViewSets ---
# Teacher Viewsets
T1ResearchViewSet = create_report_viewset(T1_ResearchArticle, T1_ResearchArticleSerializer, T1ResearchArticleFilter)
T1_2ResearchViewSet = create_report_viewset(T1_2ResearchArticle, T1_2ResearchArticleSerializer, T1_2ResearchArticleFilter)
T2_1WorkshopAttendanceViewSet = create_report_viewset(T2_1WorkshopAttendance, T2_1WorkshopAttendanceSerializer, T2_1WorkshopAttendanceFilter)
T2_2WorkshopOrganizedViewSet = create_report_viewset(T2_2WorkshopOrganized, T2_2WorkshopOrganizedSerializer, T2_2WorkshopOrganizedFilter)
T3_1BookPublicationViewSet = create_report_viewset(T3_1BookPublication, T3_1BookPublicationSerializer, T3_1BookPublicationFilter)
T3_2ChapterPublicationViewSet = create_report_viewset(T3_2ChapterPublication, T3_2ChapterPublicationSerializer, T3_2ChapterPublicationFilter)
T4_1EditorialBoardViewSet = create_report_viewset(T4_1EditorialBoard, T4_1EditorialBoardSerializer, T4_1EditorialBoardFilter)
T4_2ReviewerDetailsViewSet = create_report_viewset(T4_2ReviewerDetails, T4_2ReviewerDetailsSerializer, T4_2ReviewerDetailsFilter)
T4_3CommitteeMembershipViewSet = create_report_viewset(T4_3CommitteeMembership, T4_3CommitteeMembershipSerializer, T4_3CommitteeMembershipFilter)
T5_1PatentDetailsViewSet = create_report_viewset(T5_1PatentDetails, T5_1PatentDetailsSerializer, T5_1PatentDetailsFilter)
T5_2SponsoredProjectViewSet = create_report_viewset(T5_2SponsoredProject, T5_2SponsoredProjectSerializer, T5_2SponsoredProjectFilter)
T5_3ConsultancyProjectViewSet = create_report_viewset(T5_3ConsultancyProject, T5_3ConsultancyProjectSerializer, T5_3ConsultancyProjectFilter)
T5_4CourseDevelopmentViewSet = create_report_viewset(T5_4CourseDevelopment, T5_4CourseDevelopmentSerializer, T5_4CourseDevelopmentFilter)
T5_5LabEquipmentDevelopmentViewSet = create_report_viewset(T5_5LabEquipmentDevelopment, T5_5LabEquipmentDevelopmentSerializer, T5_5LabEquipmentDevelopmentFilter)
T5_6ResearchGuidanceViewSet = create_report_viewset(T5_6ResearchGuidance, T5_6ResearchGuidanceSerializer, T5_6ResearchGuidanceFilter)
T6_1CertificationCourseViewSet = create_report_viewset(T6_1CertificationCourse, T6_1CertificationCourseSerializer, T6_1CertificationCourseFilter)
T6_2ProfessionalBodyMembershipViewSet = create_report_viewset(T6_2ProfessionalBodyMembership, T6_2ProfessionalBodyMembershipSerializer, T6_2ProfessionalBodyMembershipFilter)
T6_3AwardViewSet = create_report_viewset(T6_3Award, T6_3AwardSerializer, T6_3AwardFilter)
T6_4ResourcePersonViewSet = create_report_viewset(T6_4ResourcePerson, T6_4ResourcePersonSerializer, T6_4ResourcePersonFilter)
T6_5AICTEInitiativeViewSet = create_report_viewset(T6_5AICTEInitiative, T6_5AICTEInitiativeSerializer, T6_5AICTEInitiativeFilter)
T7_1ProgramOrganizedViewSet = create_report_viewset(T7_1ProgramOrganized, T7_1ProgramOrganizedSerializer, T7_1ProgramOrganizedFilter)

# Student Viewsets
S1_1TheorySubjectDataViewSet = create_report_viewset(S1_1TheorySubjectData, S1_1TheorySubjectDataSerializer, S1_1TheorySubjectDataFilter)
S2_1StudentArticleViewSet = create_report_viewset(S2_1StudentArticle, S2_1StudentArticleSerializer, S2_1StudentArticleFilter)
S2_2StudentConferencePaperViewSet = create_report_viewset(S2_2StudentConferencePaper, S2_2StudentConferencePaperSerializer, S2_2StudentConferencePaperFilter)
S2_3StudentSponsoredProjectViewSet = create_report_viewset(S2_3StudentSponsoredProject, S2_3StudentSponsoredProjectSerializer, S2_3StudentSponsoredProjectFilter)
S3_1CompetitionParticipationViewSet = create_report_viewset(S3_1CompetitionParticipation, S3_1CompetitionParticipationSerializer, S3_1CompetitionParticipationFilter)
S3_2DeptProgramViewSet = create_report_viewset(S3_2DeptProgram, S3_2DeptProgramSerializer, S3_2DeptProgramFilter)
S4_1StudentExamQualificationViewSet = create_report_viewset(S4_1StudentExamQualification, S4_1StudentExamQualificationSerializer, S4_1StudentExamQualificationFilter)
S4_2CampusRecruitmentViewSet = create_report_viewset(S4_2CampusRecruitment, S4_2CampusRecruitmentSerializer, S4_2CampusRecruitmentFilter)
S4_3GovtPSUSelectionViewSet = create_report_viewset(S4_3GovtPSUSelection, S4_3GovtPSUSelectionSerializer, S4_3GovtPSUSelectionFilter)
S4_4PlacementHigherStudiesViewSet = create_report_viewset(S4_4PlacementHigherStudies, S4_4PlacementHigherStudiesSerializer, S4_4PlacementHigherStudiesFilter)
S5_1StudentCertificationCourseViewSet = create_report_viewset(S5_1StudentCertificationCourse, S5_1StudentCertificationCourseSerializer, S5_1StudentCertificationCourseFilter)
S5_2VocationalTrainingViewSet = create_report_viewset(S5_2VocationalTraining, S5_2VocationalTrainingSerializer, S5_2VocationalTrainingFilter)
S5_3SpecialMentionAchievementViewSet = create_report_viewset(S5_3SpecialMentionAchievement, S5_3SpecialMentionAchievementSerializer, S5_3SpecialMentionAchievementFilter)
S5_4StudentEntrepreneurshipViewSet = create_report_viewset(S5_4StudentEntrepreneurship, S5_4StudentEntrepreneurshipSerializer, S5_4StudentEntrepreneurshipFilter)


# Department ViewSet (doesn't need the base class)
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAdminUser]
