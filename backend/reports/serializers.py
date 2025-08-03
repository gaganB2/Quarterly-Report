# reports/serializers.py

from rest_framework import serializers
from .models import *

# ==============================================================================
# 1. BASE SERIALIZER (NEW)
# ==============================================================================
# This base class prevents repeating fields in every single serializer.

class BaseReportSerializer(serializers.ModelSerializer):
    """
    A base serializer that provides common, read-only fields for all report models.
    """
    # Uses the `faculty_name` property from our refactored BaseReportModel.
    faculty_name = serializers.CharField(read_only=True)
    # Efficiently gets the department name from the pre-fetched department object.
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        abstract = True
        # Common fields to exclude from the writeable fields list below.
        common_read_only = ('id', 'user', 'department', 'created_at', 'updated_at', 'faculty_name', 'department_name')
        
    def create(self, validated_data):
        # Automatically associate the report with the logged-in user and their department.
        validated_data['user'] = self.context['request'].user
        validated_data['department'] = self.context['request'].user.profile.department
        return super().create(validated_data)

# ==============================================================================
# 2. DYNAMIC SERIALIZER GENERATION
# ==============================================================================
# This function creates serializer classes dynamically, making the code extremely DRY.
# Instead of 40+ class definitions, we now have this single function.

def create_report_serializer(model_class):
    """
    A factory function that dynamically creates a ModelSerializer for any given report model.
    """
    class ReportSerializer(BaseReportSerializer):
        class Meta(BaseReportSerializer.Meta):
            model = model_class
            # Include all fields from the model.
            fields = '__all__'
            # Read-only fields are the common ones plus any specific to the base.
            read_only_fields = BaseReportSerializer.Meta.common_read_only

    return ReportSerializer

# ==============================================================================
# 3. CREATE ALL SERIALIZERS
# ==============================================================================
# We now create all necessary serializer classes with one line of code each.

T1_ResearchArticleSerializer = create_report_serializer(T1_ResearchArticle)
T1_2ResearchArticleSerializer = create_report_serializer(T1_2ResearchArticle)
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

# Department Serializer (doesn't need the base class)
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']
