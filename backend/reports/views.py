# reports/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import *
from .serializers import *
from .filters import *
from .utils import generate_excel_report
from users.models import Profile
from .permissions import IsStudent, IsNotStudent

# =============================================================================
# 1. BASE VIEWSET
# =============================================================================

class BaseReportViewSet(viewsets.ModelViewSet):
    """
    A base ViewSet that provides common queryset logic and now includes a
    new action for exporting data to Excel.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        """
        Dynamically filters the queryset based on the user's role.
        """
        queryset = self.queryset.select_related('user__profile', 'department')
        try:
            profile = self.request.user.profile
        except Profile.DoesNotExist:
            return queryset.none()

        if profile.role == Profile.Role.ADMIN:
            return queryset.order_by('-created_at')
        elif profile.role == Profile.Role.HOD:
            return queryset.filter(department=profile.department).order_by('-created_at')
        elif profile.role in [Profile.Role.FACULTY, Profile.Role.STUDENT]:
            return queryset.filter(user=self.request.user).order_by('-created_at')
        
        return queryset.none()

    @action(detail=False, methods=['get'], url_path='export-excel')
    def export_excel(self, request, *args, **kwargs):
        """
        An action to export the filtered queryset data to an Excel file.
        This respects all applied filters (year, quarter, department, etc.).
        """
        filtered_queryset = self.filter_queryset(self.get_queryset())
        return generate_excel_report(filtered_queryset, self.queryset.model)

# =============================================================================
# 2. DYNAMIC VIEWSET FACTORY
# =============================================================================

def create_report_viewset(model_class, ser_class, filt_class, is_student_form=False):
    """
    A factory function that dynamically creates a ViewSet class.
    """
    custom_permissions = [IsStudent] if is_student_form else [IsNotStudent]

    class ReportViewSet(BaseReportViewSet):
        queryset = model_class.objects.all()
        serializer_class = ser_class
        filterset_class = filt_class
        permission_classes = BaseReportViewSet.permission_classes + custom_permissions

    return ReportViewSet

# =============================================================================
# 3. GENERATED VIEWSETS
# =============================================================================

# --- Teacher ViewSets ---
T1ResearchViewSet = create_report_viewset(T1_ResearchArticle, T1ResearchSerializer, T1ResearchArticleFilter)
T1_2ResearchViewSet = create_report_viewset(T1_2ResearchArticle, T1_2ResearchSerializer, T1_2ResearchArticleFilter)
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

# --- Student ViewSets ---
S1_1TheorySubjectDataViewSet = create_report_viewset(S1_1TheorySubjectData, S1_1TheorySubjectDataSerializer, S1_1TheorySubjectDataFilter, is_student_form=True)
S2_1StudentArticleViewSet = create_report_viewset(S2_1StudentArticle, S2_1StudentArticleSerializer, S2_1StudentArticleFilter, is_student_form=True)
S2_2StudentConferencePaperViewSet = create_report_viewset(S2_2StudentConferencePaper, S2_2StudentConferencePaperSerializer, S2_2StudentConferencePaperFilter, is_student_form=True)
S2_3StudentSponsoredProjectViewSet = create_report_viewset(S2_3StudentSponsoredProject, S2_3StudentSponsoredProjectSerializer, S2_3StudentSponsoredProjectFilter, is_student_form=True)
S3_1CompetitionParticipationViewSet = create_report_viewset(S3_1CompetitionParticipation, S3_1CompetitionParticipationSerializer, S3_1CompetitionParticipationFilter, is_student_form=True)
S3_2DeptProgramViewSet = create_report_viewset(S3_2DeptProgram, S3_2DeptProgramSerializer, S3_2DeptProgramFilter, is_student_form=True)
S4_1StudentExamQualificationViewSet = create_report_viewset(S4_1StudentExamQualification, S4_1StudentExamQualificationSerializer, S4_1StudentExamQualificationFilter, is_student_form=True)
S4_2CampusRecruitmentViewSet = create_report_viewset(S4_2CampusRecruitment, S4_2CampusRecruitmentSerializer, S4_2CampusRecruitmentFilter, is_student_form=True)
S4_3GovtPSUSelectionViewSet = create_report_viewset(S4_3GovtPSUSelection, S4_3GovtPSUSelectionSerializer, S4_3GovtPSUSelectionFilter, is_student_form=True)
S4_4PlacementHigherStudiesViewSet = create_report_viewset(S4_4PlacementHigherStudies, S4_4PlacementHigherStudiesSerializer, S4_4PlacementHigherStudiesFilter, is_student_form=True)
S5_1StudentCertificationCourseViewSet = create_report_viewset(S5_1StudentCertificationCourse, S5_1StudentCertificationCourseSerializer, S5_1StudentCertificationCourseFilter, is_student_form=True)
S5_2VocationalTrainingViewSet = create_report_viewset(S5_2VocationalTraining, S5_2VocationalTrainingSerializer, S5_2VocationalTrainingFilter, is_student_form=True)
S5_3SpecialMentionAchievementViewSet = create_report_viewset(S5_3SpecialMentionAchievement, S5_3SpecialMentionAchievementSerializer, S5_3SpecialMentionAchievementFilter, is_student_form=True)
S5_4StudentEntrepreneurshipViewSet = create_report_viewset(S5_4StudentEntrepreneurship, S5_4StudentEntrepreneurshipSerializer, S5_4StudentEntrepreneurshipFilter, is_student_form=True)

# =============================================================================
# 4. OTHER VIEWSETS & API VIEWS
# =============================================================================

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAdminUser]

class PublicDepartmentListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class ReportCountsView(APIView):
    """
    Calculates and returns the number of submissions for each report type,
    respecting the user's role and any applied filters.
    """
    permission_classes = [permissions.IsAuthenticated]

    # Map form codes from the frontend to the backend Django models
    MODEL_MAP = {
        'T1.1': T1_ResearchArticle, 'T1.2': T1_2ResearchArticle,
        'T2.1': T2_1WorkshopAttendance, 'T2.2': T2_2WorkshopOrganized,
        'T3.1': T3_1BookPublication, 'T3.2': T3_2ChapterPublication,
        'T4.1': T4_1EditorialBoard, 'T4.2': T4_2ReviewerDetails, 'T4.3': T4_3CommitteeMembership,
        'T5.1': T5_1PatentDetails, 'T5.2': T5_2SponsoredProject, 'T5.3': T5_3ConsultancyProject,
        'T5.4': T5_4CourseDevelopment, 'T5.5': T5_5LabEquipmentDevelopment, 'T5.6': T5_6ResearchGuidance,
        'T6.1': T6_1CertificationCourse, 'T6.2': T6_2ProfessionalBodyMembership, 'T6.3': T6_3Award,
        'T6.4': T6_4ResourcePerson, 'T6.5': T6_5AICTEInitiative,
        'T7.1': T7_1ProgramOrganized,
        'S1.1': S1_1TheorySubjectData,
        'S2.1': S2_1StudentArticle, 'S2.2': S2_2StudentConferencePaper, 'S2.3': S2_3StudentSponsoredProject,
        'S3.1': S3_1CompetitionParticipation, 'S3.2': S3_2DeptProgram,
        'S4.1': S4_1StudentExamQualification, 'S4.2': S4_2CampusRecruitment, 'S4.3': S4_3GovtPSUSelection, 'S4.4': S4_4PlacementHigherStudies,
        'S5.1': S5_1StudentCertificationCourse, 'S5.2': S5_2VocationalTraining, 'S5.3': S5_3SpecialMentionAchievement, 'S5.4': S5_4StudentEntrepreneurship,
    }

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response({'counts': {}}, status=403)

        # 1. Build a base filter based on user role
        base_filters = {}
        if profile.role == Profile.Role.HOD:
            base_filters['department'] = profile.department
        elif profile.role in [Profile.Role.FACULTY, Profile.Role.STUDENT]:
            base_filters['user'] = user

        # 2. Add query parameter filters from the frontend
        query_params = request.query_params
        if 'year' in query_params and query_params['year']:
            base_filters['year'] = query_params['year']
        if 'session' in query_params and query_params['session']:
            base_filters['quarter'] = query_params['session']
        if 'department' in query_params and query_params['department']:
             base_filters['department_id'] = query_params['department']
        
        # 3. Iterate over the models and get counts
        counts = {}
        for form_code, model_class in self.MODEL_MAP.items():
            # Apply the combined filters to each model and get the count
            count = model_class.objects.filter(**base_filters).count()
            counts[form_code] = count
            
        # 4. Return the data in the format the frontend expects
        return Response({'counts': counts})