# reports/serializers.py

from rest_framework import serializers
from .models import *

# =============================================================================
# 1. BASE SERIALIZER (MODIFIED)
# =============================================================================

class BaseReportSerializer(serializers.ModelSerializer):
    """
    A base serializer that provides common, read-only fields and enforces
    data integrity for all report models.
    """
    faculty_name = serializers.CharField(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        abstract = True
        common_read_only = ('id', 'user', 'department', 'created_at', 'updated_at', 'faculty_name', 'department_name')
        
    def create(self, validated_data):
        """
        Overrides the default create method to enforce business logic.
        - Automatically associates the report with the logged-in user.
        - FIX: Forcibly sets the report's department to the user's profile
          department, preventing users from submitting reports for other departments.
        """
        user = self.context['request'].user
        validated_data['user'] = user
        
        # This is the critical fix for the department spoofing flaw.
        # It ignores any department sent in the request and uses the one from the user's profile.
        validated_data['department'] = user.profile.department
        
        return super().create(validated_data)

# =============================================================================
# 2. DYNAMIC SERIALIZER FACTORY
# =============================================================================

def create_report_serializer(model_class):
    """
    A factory function that dynamically creates a ModelSerializer class for any
    given report model, inheriting from our secure BaseReportSerializer.
    """
    class ReportSerializer(BaseReportSerializer):
        class Meta(BaseReportSerializer.Meta):
            model = model_class
            # All fields from the model are included, except the common read-only ones.
            exclude = BaseReportSerializer.Meta.common_read_only

    return ReportSerializer

# =============================================================================
# 3. GENERATED SERIALIZERS
# =============================================================================
# Using the factory to generate all necessary serializers. This keeps the code DRY.

# Teacher Serializers
T1ResearchSerializer = create_report_serializer(T1_ResearchArticle)
T1_2ResearchSerializer = create_report_serializer(T1_2ResearchArticle)
T2_1WorkshopAttendanceSerializer = create_report_serializer(T2_1WorkshopAttendance)
T2_2WorkshopOrganizedSerializer = create_report_serializer(T2_2WorkshopOrganized)
T3_1BookPublicationSerializer = create_report_serializer(T3_1BookPublication)
T3_2ChapterPublicationSerializer = create_report_serializer(T3_2ChapterPublication)
T4_1EditorialBoardSerializer = create_report_serializer(T4_1EditorialBoard)
T4_2ReviewerDetailsSerializer = create_report_serializer(T4_2ReviewerDetails)
T4_3CommitteeMembershipSerializer = create_report_serializer(T4_3CommitteeMembership)
T5_1PatentDetailsSerializer = create_report_serializer(T5_1PatentDetails)
T5_2SponsoredProjectSerializer = create_report_serializer(T5_2SponsoredProject)
T5_3ConsultancyProjectSerializer = create_report_serializer(T5_3ConsultancyProject)
T5_4CourseDevelopmentSerializer = create_report_serializer(T5_4CourseDevelopment)
T5_5LabEquipmentDevelopmentSerializer = create_report_serializer(T5_5LabEquipmentDevelopment)
T5_6ResearchGuidanceSerializer = create_report_serializer(T5_6ResearchGuidance)
T6_1CertificationCourseSerializer = create_report_serializer(T6_1CertificationCourse)
T6_2ProfessionalBodyMembershipSerializer = create_report_serializer(T6_2ProfessionalBodyMembership)
T6_3AwardSerializer = create_report_serializer(T6_3Award)
T6_4ResourcePersonSerializer = create_report_serializer(T6_4ResourcePerson)
T6_5AICTEInitiativeSerializer = create_report_serializer(T6_5AICTEInitiative)
T7_1ProgramOrganizedSerializer = create_report_serializer(T7_1ProgramOrganized)

# Student Serializers
S1_1TheorySubjectDataSerializer = create_report_serializer(S1_1TheorySubjectData)
S2_1StudentArticleSerializer = create_report_serializer(S2_1StudentArticle)
S2_2StudentConferencePaperSerializer = create_report_serializer(S2_2StudentConferencePaper)
S2_3StudentSponsoredProjectSerializer = create_report_serializer(S2_3StudentSponsoredProject)
S3_1CompetitionParticipationSerializer = create_report_serializer(S3_1CompetitionParticipation)
S3_2DeptProgramSerializer = create_report_serializer(S3_2DeptProgram)
S4_1StudentExamQualificationSerializer = create_report_serializer(S4_1StudentExamQualification)
S4_2CampusRecruitmentSerializer = create_report_serializer(S4_2CampusRecruitment)
S4_3GovtPSUSelectionSerializer = create_report_serializer(S4_3GovtPSUSelection)
S4_4PlacementHigherStudiesSerializer = create_report_serializer(S4_4PlacementHigherStudies)
S5_1StudentCertificationCourseSerializer = create_report_serializer(S5_1StudentCertificationCourse)
S5_2VocationalTrainingSerializer = create_report_serializer(S5_2VocationalTraining)
S5_3SpecialMentionAchievementSerializer = create_report_serializer(S5_3SpecialMentionAchievement)
S5_4StudentEntrepreneurshipSerializer = create_report_serializer(S5_4StudentEntrepreneurship)

# =============================================================================
# 4. OTHER SERIALIZERS
# =============================================================================

class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for the Department model."""
    class Meta:
        model = Department
        fields = ['id', 'name']

