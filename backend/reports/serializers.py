# reports/serializers.py

from rest_framework import serializers
from .models import *

# =============================================================================
# 1. BASE SERIALIZERS (REFACTORED)
# =============================================================================

class BaseReportSerializer(serializers.ModelSerializer):
    """A minimal base class that handles universal logic for all reports."""
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        abstract = True
        # This now ONLY contains fields from the actual database model.
        common_read_only = ('id', 'user', 'department', 'created_at', 'updated_at')
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['department'] = user.profile.department
        return super().create(validated_data)

class BaseFacultyReportSerializer(BaseReportSerializer):
    """Base serializer specifically for Teacher (T-series) reports."""
    # This field is now correctly handled as a read-only declared field.
    faculty_name = serializers.CharField(read_only=True)
    
    class Meta(BaseReportSerializer.Meta):
        abstract = True

class BaseStudentReportSerializer(BaseReportSerializer):
    """Base serializer specifically for Student (S-series) reports."""
    # This field is now correctly handled as a read-only declared field.
    student_name = serializers.CharField(source='user.profile.full_name', read_only=True)

    class Meta(BaseReportSerializer.Meta):
        abstract = True

# =============================================================================
# 2. DYNAMIC SERIALIZER FACTORY
# =============================================================================

def create_report_serializer(model_class, base_class):
    """
    A factory function that dynamically creates a ModelSerializer class,
    inheriting from the appropriate base class (Faculty or Student).
    """
    class ReportSerializer(base_class):
        class Meta(base_class.Meta):
            model = model_class
            # The 'exclude' list now only contains the base model fields,
            # which resolves the conflict permanently.
            exclude = base_class.Meta.common_read_only

    return ReportSerializer

# =============================================================================
# 3. GENERATED SERIALIZERS
# =============================================================================

# --- Teacher Serializers (Now using the correct base class) ---
T1ResearchSerializer = create_report_serializer(T1_ResearchArticle, BaseFacultyReportSerializer)
T1_2ResearchSerializer = create_report_serializer(T1_2ResearchArticle, BaseFacultyReportSerializer)
T2_1WorkshopAttendanceSerializer = create_report_serializer(T2_1WorkshopAttendance, BaseFacultyReportSerializer)
T2_2WorkshopOrganizedSerializer = create_report_serializer(T2_2WorkshopOrganized, BaseFacultyReportSerializer)
T3_1BookPublicationSerializer = create_report_serializer(T3_1BookPublication, BaseFacultyReportSerializer)
T3_2ChapterPublicationSerializer = create_report_serializer(T3_2ChapterPublication, BaseFacultyReportSerializer)
T4_1EditorialBoardSerializer = create_report_serializer(T4_1EditorialBoard, BaseFacultyReportSerializer)
T4_2ReviewerDetailsSerializer = create_report_serializer(T4_2ReviewerDetails, BaseFacultyReportSerializer)
T4_3CommitteeMembershipSerializer = create_report_serializer(T4_3CommitteeMembership, BaseFacultyReportSerializer)
T5_1PatentDetailsSerializer = create_report_serializer(T5_1PatentDetails, BaseFacultyReportSerializer)
T5_2SponsoredProjectSerializer = create_report_serializer(T5_2SponsoredProject, BaseFacultyReportSerializer)
T5_3ConsultancyProjectSerializer = create_report_serializer(T5_3ConsultancyProject, BaseFacultyReportSerializer)
T5_4CourseDevelopmentSerializer = create_report_serializer(T5_4CourseDevelopment, BaseFacultyReportSerializer)
T5_5LabEquipmentDevelopmentSerializer = create_report_serializer(T5_5LabEquipmentDevelopment, BaseFacultyReportSerializer)
T5_6ResearchGuidanceSerializer = create_report_serializer(T5_6ResearchGuidance, BaseFacultyReportSerializer)
T6_1CertificationCourseSerializer = create_report_serializer(T6_1CertificationCourse, BaseFacultyReportSerializer)
T6_2ProfessionalBodyMembershipSerializer = create_report_serializer(T6_2ProfessionalBodyMembership, BaseFacultyReportSerializer)
T6_3AwardSerializer = create_report_serializer(T6_3Award, BaseFacultyReportSerializer)
T6_4ResourcePersonSerializer = create_report_serializer(T6_4ResourcePerson, BaseFacultyReportSerializer)
T6_5AICTEInitiativeSerializer = create_report_serializer(T6_5AICTEInitiative, BaseFacultyReportSerializer)
T7_1ProgramOrganizedSerializer = create_report_serializer(T7_1ProgramOrganized, BaseFacultyReportSerializer)

# --- Student Serializers (Now using the correct base class) ---
S1_1TheorySubjectDataSerializer = create_report_serializer(S1_1TheorySubjectData, BaseStudentReportSerializer)
S2_1StudentArticleSerializer = create_report_serializer(S2_1StudentArticle, BaseStudentReportSerializer)
S2_2StudentConferencePaperSerializer = create_report_serializer(S2_2StudentConferencePaper, BaseStudentReportSerializer)
S2_3StudentSponsoredProjectSerializer = create_report_serializer(S2_3StudentSponsoredProject, BaseStudentReportSerializer)
S3_1CompetitionParticipationSerializer = create_report_serializer(S3_1CompetitionParticipation, BaseStudentReportSerializer)
S3_2DeptProgramSerializer = create_report_serializer(S3_2DeptProgram, BaseStudentReportSerializer)
S4_1StudentExamQualificationSerializer = create_report_serializer(S4_1StudentExamQualification, BaseStudentReportSerializer)
S4_2CampusRecruitmentSerializer = create_report_serializer(S4_2CampusRecruitment, BaseStudentReportSerializer)
S4_3GovtPSUSelectionSerializer = create_report_serializer(S4_3GovtPSUSelection, BaseStudentReportSerializer)
S4_4PlacementHigherStudiesSerializer = create_report_serializer(S4_4PlacementHigherStudies, BaseStudentReportSerializer)
S5_1StudentCertificationCourseSerializer = create_report_serializer(S5_1StudentCertificationCourse, BaseStudentReportSerializer)
S5_2VocationalTrainingSerializer = create_report_serializer(S5_2VocationalTraining, BaseStudentReportSerializer)
S5_3SpecialMentionAchievementSerializer = create_report_serializer(S5_3SpecialMentionAchievement, BaseStudentReportSerializer)
S5_4StudentEntrepreneurshipSerializer = create_report_serializer(S5_4StudentEntrepreneurship, BaseStudentReportSerializer)

# --- Other Serializers ---
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']
