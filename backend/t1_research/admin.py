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