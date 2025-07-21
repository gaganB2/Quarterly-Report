# t1_research/admin.py

from django.contrib import admin
from .models import T1_ResearchArticle, Department
from .models import T1_2ResearchArticle
from .models import T2_1WorkshopAttendance
from .models import T2_2WorkshopOrganized
from .models import T3_1BookPublication
from .models import T4_1EditorialBoard
from .models import T4_2ReviewerDetails
from .models import T4_3CommitteeMembership
from .models import T5_1PatentDetails
from .models import T5_2SponsoredProject
from .models import T5_3ConsultancyProject
from .models import T5_4CourseDevelopment
from .models import T5_5LabEquipmentDevelopment
from .models import T5_6ResearchGuidance
from .models import T6_1CertificationCourse
from .models import T6_2ProfessionalBodyMembership
from .models import T6_3Award
from .models import T6_4ResourcePerson
from .models import T6_5AICTEInitiative
from .models import T7_1ProgramOrganized
from .models import S1_1TheorySubjectData
from .models import S2_1StudentArticle
from .models import S2_2StudentConferencePaper
from .models import S2_3StudentSponsoredProject
from .models import S3_1CompetitionParticipation
from .models import S3_2DeptProgram
from .models import S4_1StudentExamQualification
from .models import S4_2CampusRecruitment
from .models import S4_3GovtPSUSelection
from .models import S4_4PlacementHigherStudies
from .models import S5_1StudentCertificationCourse
from .models import S5_2VocationalTraining
from .models import S5_3SpecialMentionAchievement
from .models import S5_4StudentEntrepreneurship
@admin.register(T1_ResearchArticle)
class T1ResearchAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'quarter', 'year', 'created_at']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(T1_2ResearchArticle)
class T1_2ResearchAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'user',
        'quarter',
        'year',
        'conference_status',
        'conference_mode',
        'created_at'
    ]

@admin.register(T2_1WorkshopAttendance)
class T2_1WorkshopAttendanceAdmin(admin.ModelAdmin):
    list_display = ["program_name", "faculty_name", "start_date", "end_date", "created_at"]


@admin.register(T2_2WorkshopOrganized)
class T2_2WorkshopOrganizedAdmin(admin.ModelAdmin):
    list_display = [
        "program_name",
        "faculty_name",
        "start_date",
        "end_date",
        "num_participants",
        "created_at",
    ]

@admin.register(T3_1BookPublication)
class T3_1BookPublicationAdmin(admin.ModelAdmin):
    list_display = [
        "book_title",
        "faculty_name",
        "publication_year",
        "print_mode",
        "book_type",
        "created_at",
    ]

from .models import T3_2ChapterPublication

@admin.register(T3_2ChapterPublication)
class T3_2ChapterPublicationAdmin(admin.ModelAdmin):
    list_display = [
        "chapter_title",
        "faculty_name",
        "author_type",
        "publication_year",
        "book_type",
        "department",
        "created_at",
    ]
    list_filter = [
        "publication_year",
        "book_type",
        "author_type",
        "department",
    ]
    search_fields = [
        "chapter_title",
        "faculty_name",
    ]
    ordering = ["-publication_year", "faculty_name"]

@admin.register(T4_1EditorialBoard)
class T4_1EditorialBoardAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "title",
        "role",
        "publisher",
        "year",
        "created_at",
    ]

@admin.register(T4_2ReviewerDetails)
class T4_2ReviewerDetailsAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "publication_type",
        "title",
        "year",
        "created_at",
    ]

@admin.register(T4_3CommitteeMembership)
class T4_3CommitteeMembershipAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "body_details",
        "responsibility",
        "level",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_1PatentDetails)
class T5_1PatentDetailsAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "title",
        "ipr_type",
        "status",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_2SponsoredProject)
class T5_2SponsoredProjectAdmin(admin.ModelAdmin):
    list_display = [
        "project_title",
        "principal_investigator",
        "funding_agency",
        "status",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_3ConsultancyProject)
class T5_3ConsultancyProjectAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "client_name",
        "status",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_4CourseDevelopment)
class T5_4CourseDevelopmentAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "course_module_name",
        "platform",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_5LabEquipmentDevelopment)
class T5_5LabEquipmentDevelopmentAdmin(admin.ModelAdmin):
    list_display = [
        "lab_name",
        "major_equipment",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T5_6ResearchGuidance)
class T5_6ResearchGuidanceAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "candidate_name",
        "role",
        "status",
        "research_center",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T6_1CertificationCourse)
class T6_1CertificationCourseAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "certification_course",
        "certification_type",
        "quarter",
        "year",
        "created_at",
    ]
@admin.register(T6_2ProfessionalBodyMembership)
class T6_2ProfessionalBodyMembershipAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "institution_name",
        "membership_grade",
        "membership_number",
        "year_of_election",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T6_3Award)
class T6_3AwardAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "award_name",
        "award_date",
        "award_type",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T6_4ResourcePerson)
class T6_4ResourcePersonAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "invited_by",
        "lecture_title",
        "date",
        "duration_hours",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T6_5AICTEInitiative)
class T6_5AICTEInitiativeAdmin(admin.ModelAdmin):
    list_display = [
        "faculty_name",
        "initiative_name",
        "date",
        "role",
        "organizing_institute",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(T7_1ProgramOrganized)
class T7_1ProgramOrganizedAdmin(admin.ModelAdmin):
    list_display = [
        "organizer_name",
        "event_name",
        "start_date",
        "end_date",
        "mode",
        "participants_count",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(S1_1TheorySubjectData)
class S1_1TheorySubjectDataAdmin(admin.ModelAdmin):
    list_display = [
        "semester",
        "subject_code",
        "name_of_subject",
        "faculty_name",
        "num_classes",
        "num_students_appeared",
        "num_students_passed",
        "pass_percent",
        "pass_percent_rv",
        "prev_year_pass_percent",
        "created_at",
    ]

@admin.register(S2_1StudentArticle)
class S2_1StudentArticleAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "journal_name",
        "month_year",
        "is_wos",
        "is_scopus",
        "is_ugc_care",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(S2_2StudentConferencePaper)
class S2_2StudentConferencePaperAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "conference_details",
        "month_year",
        "is_scopus",
        "conference_status",
        "mode",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(S2_3StudentSponsoredProject)
class S2_3StudentSponsoredProjectAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "semester",
        "project_title",
        "sponsored_by",
        "guide_name",
        "created_at",
    ]

@admin.register(S3_1CompetitionParticipation)
class S3_1CompetitionParticipationAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "semester",
        "activity_type",
        "organized_by",
        "date",
        "level",
        "awards",
        "created_at",
    ]

@admin.register(S3_2DeptProgram)
class S3_2DeptProgramAdmin(admin.ModelAdmin):
    list_display = [
        "program_name",
        "date",
        "level",
        "participants_count",
        "quarter",
        "year",
        "created_at",
    ]

@admin.register(S4_1StudentExamQualification)
class S4_1StudentExamQualificationAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "batch",
        "exam_name",
        "score_detail",
        "pg_programme",
        "admission_year",
        "institution_name",
        "created_at",
    ]

@admin.register(S4_2CampusRecruitment)
class S4_2CampusRecruitmentAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "batch",
        "company_name",
        "package_offered",
        "offer_ref_number",
        "created_at",
    ]

@admin.register(S4_3GovtPSUSelection)
class S4_3GovtPSUSelectionAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "batch",
        "exam_name",
        "psv_name",
        "package_offered",
        "joining_year",
        "created_at",
    ]
@admin.register(S4_4PlacementHigherStudies)
class S4_4PlacementHigherStudiesAdmin(admin.ModelAdmin):
    list_display = [
        "student_roll_no",
        "student_name",
        "placement_type",
        "organization_name",
        "program_name",
        "institution_joined",
        "entrepreneurship",
        "created_at",
    ]
@admin.register(S5_1StudentCertificationCourse)
class S5_1StudentCertificationCourseAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "certification_course",
        "certification_type",
        "created_at",
    ]

@admin.register(S5_2VocationalTraining)
class S5_2VocationalTrainingAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "company_name",
        "duration",
        "created_at",
    ]

@admin.register(S5_3SpecialMentionAchievement)
class S5_3SpecialMentionAchievementAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "award_name",
        "date_received",
        "award_level",
        "created_at",
    ]

@admin.register(S5_4StudentEntrepreneurship)
class S5_4StudentEntrepreneurshipAdmin(admin.ModelAdmin):
    list_display = [
        "student_name",
        "establishment_year",
        "sector",
        "created_at",
    ]