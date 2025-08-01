# reports/filters.py

from django_filters import rest_framework as filters
from django.contrib.auth.models import User
from .models import *

# --- Base Filter for Common Fields ---
class BaseReportFilter(filters.FilterSet):
    """
    A base filter class that includes common filters for most report models.
    """
    # Allows filtering by the faculty member who submitted the record.
    faculty = filters.ModelChoiceFilter(
        field_name='user',
        queryset=User.objects.all()
    )
    # Allows filtering by faculty name (case-insensitive contains search)
    faculty_name = filters.CharFilter(field_name='faculty_name', lookup_expr='icontains')

    class Meta:
        abstract = True # This makes it a base class that won't create a DB table
        fields = ['year', 'quarter', 'department', 'faculty']

# --- Teacher Form Filters (T-Series) ---

class T1ResearchArticleFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    journal_name = filters.CharFilter(field_name='journal_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T1_ResearchArticle

class T1_2ResearchArticleFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    conference_details = filters.CharFilter(field_name='conference_details', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T1_2ResearchArticle

class T2_1WorkshopAttendanceFilter(BaseReportFilter):
    program_name = filters.CharFilter(field_name='program_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T2_1WorkshopAttendance

class T2_2WorkshopOrganizedFilter(BaseReportFilter):
    program_name = filters.CharFilter(field_name='program_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T2_2WorkshopOrganized

class T3_1BookPublicationFilter(BaseReportFilter):
    book_title = filters.CharFilter(field_name='book_title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T3_1BookPublication

class T3_2ChapterPublicationFilter(BaseReportFilter):
    chapter_title = filters.CharFilter(field_name='chapter_title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T3_2ChapterPublication

class T4_1EditorialBoardFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T4_1EditorialBoard

class T4_2ReviewerDetailsFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T4_2ReviewerDetails

class T4_3CommitteeMembershipFilter(BaseReportFilter):
    body_details = filters.CharFilter(field_name='body_details', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T4_3CommitteeMembership

class T5_1PatentDetailsFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_1PatentDetails

class T5_2SponsoredProjectFilter(BaseReportFilter):
    project_title = filters.CharFilter(field_name='project_title', lookup_expr='icontains')
    principal_investigator = filters.CharFilter(field_name='principal_investigator', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_2SponsoredProject

class T5_3ConsultancyProjectFilter(BaseReportFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    client_name = filters.CharFilter(field_name='client_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_3ConsultancyProject

class T5_4CourseDevelopmentFilter(BaseReportFilter):
    course_module_name = filters.CharFilter(field_name='course_module_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_4CourseDevelopment

class T5_5LabEquipmentDevelopmentFilter(BaseReportFilter):
    lab_name = filters.CharFilter(field_name='lab_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_5LabEquipmentDevelopment

class T5_6ResearchGuidanceFilter(BaseReportFilter):
    thesis_title = filters.CharFilter(field_name='thesis_title', lookup_expr='icontains')
    candidate_name = filters.CharFilter(field_name='candidate_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T5_6ResearchGuidance

class T6_1CertificationCourseFilter(BaseReportFilter):
    course_name = filters.CharFilter(field_name='course_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T6_1CertificationCourse

class T6_2ProfessionalBodyMembershipFilter(BaseReportFilter):
    institution_name = filters.CharFilter(field_name='institution_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T6_2ProfessionalBodyMembership

class T6_3AwardFilter(BaseReportFilter):
    award_name = filters.CharFilter(field_name='award_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T6_3Award

class T6_4ResourcePersonFilter(BaseReportFilter):
    lecture_title = filters.CharFilter(field_name='lecture_title', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T6_4ResourcePerson

class T6_5AICTEInitiativeFilter(BaseReportFilter):
    initiative_name = filters.CharFilter(field_name='initiative_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T6_5AICTEInitiative

class T7_1ProgramOrganizedFilter(BaseReportFilter):
    event_name = filters.CharFilter(field_name='event_name', lookup_expr='icontains')
    organizer_name = filters.CharFilter(field_name='organizer_name', lookup_expr='icontains')
    class Meta(BaseReportFilter.Meta):
        model = T7_1ProgramOrganized

# --- Student Form Filters (S-Series) ---
# Note: These have slightly different base fields

class BaseStudentFilter(filters.FilterSet):
    department = filters.ModelChoiceFilter(queryset=Department.objects.all())
    submitted_by = filters.ModelChoiceFilter(
        field_name='user',
        queryset=User.objects.all()
    )
    class Meta:
        abstract = True
        fields = ['department', 'submitted_by']

class S1_1TheorySubjectDataFilter(BaseStudentFilter):
    name_of_subject = filters.CharFilter(field_name='name_of_subject', lookup_expr='icontains')
    faculty_name = filters.CharFilter(field_name='faculty_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S1_1TheorySubjectData

class S2_1StudentArticleFilter(BaseStudentFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    journal_name = filters.CharFilter(field_name='journal_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S2_1StudentArticle
        fields = BaseStudentFilter.Meta.fields + ['year', 'quarter']

class S2_2StudentConferencePaperFilter(BaseStudentFilter):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S2_2StudentConferencePaper
        fields = BaseStudentFilter.Meta.fields + ['year', 'quarter']

class S2_3StudentSponsoredProjectFilter(BaseStudentFilter):
    project_title = filters.CharFilter(field_name='project_title', lookup_expr='icontains')
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S2_3StudentSponsoredProject

class S3_1CompetitionParticipationFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    activity_type = filters.CharFilter(field_name='activity_type', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S3_1CompetitionParticipation

class S3_2DeptProgramFilter(BaseStudentFilter):
    program_name = filters.CharFilter(field_name='program_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S3_2DeptProgram
        fields = BaseStudentFilter.Meta.fields + ['year', 'quarter']

class S4_1StudentExamQualificationFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    exam_name = filters.CharFilter(field_name='exam_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S4_1StudentExamQualification

class S4_2CampusRecruitmentFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    company_name = filters.CharFilter(field_name='company_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S4_2CampusRecruitment

class S4_3GovtPSUSelectionFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    psv_name = filters.CharFilter(field_name='psv_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S4_3GovtPSUSelection

class S4_4PlacementHigherStudiesFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    organization_name = filters.CharFilter(field_name='organization_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S4_4PlacementHigherStudies

class S5_1StudentCertificationCourseFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    course_name = filters.CharFilter(field_name='certification_course', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S5_1StudentCertificationCourse

class S5_2VocationalTrainingFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    company_name = filters.CharFilter(field_name='company_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S5_2VocationalTraining

class S5_3SpecialMentionAchievementFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    award_name = filters.CharFilter(field_name='award_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S5_3SpecialMentionAchievement

class S5_4StudentEntrepreneurshipFilter(BaseStudentFilter):
    student_name = filters.CharFilter(field_name='student_name', lookup_expr='icontains')
    class Meta(BaseStudentFilter.Meta):
        model = S5_4StudentEntrepreneurship
