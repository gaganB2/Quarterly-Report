# reports/admin.py

from django.contrib import admin
from .models import *

# ==============================================================================
# CORE & ADMIN REGISTRATION
# ==============================================================================

admin.site.register(Department)

# Each ModelAdmin is now self-contained and meticulously matched to the models.py
# to guarantee that all system checks pass.

# ==============================================================================
# TEACHER REPORT ADMINS (T-SERIES)
# ==============================================================================

@admin.register(T1_ResearchArticle)
class T1_ResearchArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'journal_name', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'author_type', 'indexing_scopus', 'indexing_wos')
    search_fields = ('title', 'journal_name', 'user__username', 'user__first_name', 'user__last_name')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T1_2ResearchArticle)
class T1_2ResearchArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'conference_details', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'conference_status', 'conference_mode')
    search_fields = ('title', 'conference_details', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T2_1WorkshopAttendance)
class T2_1WorkshopAttendanceAdmin(admin.ModelAdmin):
    list_display = ('program_name', 'organizer', 'num_days', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'mode')
    search_fields = ('program_name', 'organizer', 'user__username')
    ordering = ('-start_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T2_2WorkshopOrganized)
class T2_2WorkshopOrganizedAdmin(admin.ModelAdmin):
    list_display = ('program_name', 'role', 'activity_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'role', 'mode')
    search_fields = ('program_name', 'activity_type', 'user__username')
    ordering = ('-start_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T3_1BookPublication)
class T3_1BookPublicationAdmin(admin.ModelAdmin):
    list_display = ('book_title', 'publisher_details', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'author_type', 'book_type')
    search_fields = ('book_title', 'publisher_details', 'user__username')
    ordering = ('-publication_year',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T3_2ChapterPublication)
class T3_2ChapterPublicationAdmin(admin.ModelAdmin):
    list_display = ('chapter_title', 'publisher_details', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'author_type', 'book_type')
    search_fields = ('chapter_title', 'publisher_details', 'user__username')
    ordering = ('-publication_year',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T4_1EditorialBoard)
class T4_1EditorialBoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'role', 'publisher', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'role', 'indexing', 'type')
    search_fields = ('title', 'publisher', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T4_2ReviewerDetails)
class T4_2ReviewerDetailsAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_type', 'publisher', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'publication_type', 'indexing', 'type')
    search_fields = ('title', 'publisher', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T4_3CommitteeMembership)
class T4_3CommitteeMembershipAdmin(admin.ModelAdmin):
    list_display = ('body_details', 'responsibility', 'level', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'responsibility', 'level')
    search_fields = ('body_details', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_1PatentDetails)
class T5_1PatentDetailsAdmin(admin.ModelAdmin):
    list_display = ('title', 'application_number', 'status', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'status', 'ipr_type')
    search_fields = ('title', 'application_number', 'user__username')
    ordering = ('-filled_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_2SponsoredProject)
class T5_2SponsoredProjectAdmin(admin.ModelAdmin):
    list_display = ('project_title', 'principal_investigator', 'funding_agency', 'status', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'status', 'regionality')
    search_fields = ('project_title', 'principal_investigator', 'funding_agency', 'user__username')
    ordering = ('-sanctioned_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_3ConsultancyProject)
class T5_3ConsultancyProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_name', 'status', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'status', 'regionality')
    search_fields = ('title', 'client_name', 'user__username')
    ordering = ('-sanctioned_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_4CourseDevelopment)
class T5_4CourseDevelopmentAdmin(admin.ModelAdmin):
    list_display = ('course_module_name', 'platform', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'platform')
    search_fields = ('course_module_name', 'platform', 'user__username')
    ordering = ('-launch_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_5LabEquipmentDevelopment)
class T5_5LabEquipmentDevelopmentAdmin(admin.ModelAdmin):
    list_display = ('lab_name', 'major_equipment', 'equipment_cost', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('lab_name', 'major_equipment', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T5_6ResearchGuidance)
class T5_6ResearchGuidanceAdmin(admin.ModelAdmin):
    list_display = ('thesis_title', 'candidate_name', 'status', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'status', 'role')
    search_fields = ('thesis_title', 'candidate_name', 'user__username')
    ordering = ('-viva_voce_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T6_1CertificationCourse)
class T6_1CertificationCourseAdmin(admin.ModelAdmin):
    list_display = ('certification_course', 'course_name', 'certification_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'certification_type')
    search_fields = ('certification_course', 'course_name', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T6_2ProfessionalBodyMembership)
class T6_2ProfessionalBodyMembershipAdmin(admin.ModelAdmin):
    list_display = ('institution_name', 'membership_grade', 'year_of_election', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('institution_name', 'membership_grade', 'user__username')
    ordering = ('-year_of_election',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T6_3Award)
class T6_3AwardAdmin(admin.ModelAdmin):
    list_display = ('award_name', 'conferred_by', 'award_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'award_type')
    search_fields = ('award_name', 'conferred_by', 'user__username')
    ordering = ('-award_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T6_4ResourcePerson)
class T6_4ResourcePersonAdmin(admin.ModelAdmin):
    list_display = ('lecture_title', 'invited_by', 'date', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('lecture_title', 'invited_by', 'user__username')
    ordering = ('-date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T6_5AICTEInitiative)
class T6_5AICTEInitiativeAdmin(admin.ModelAdmin):
    list_display = ('initiative_name', 'role', 'date', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('initiative_name', 'role', 'user__username')
    ordering = ('-date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(T7_1ProgramOrganized)
class T7_1ProgramOrganizedAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'organizer_name', 'event_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'mode')
    search_fields = ('event_name', 'organizer_name', 'event_type', 'user__username')
    ordering = ('-start_date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

# ==============================================================================
# STUDENT REPORT ADMINS (S-SERIES)
# ==============================================================================

@admin.register(S1_1TheorySubjectData)
class S1_1TheorySubjectDataAdmin(admin.ModelAdmin):
    list_display = ('name_of_subject', 'subject_code', 'pass_percent', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'semester')
    search_fields = ('name_of_subject', 'subject_code', 'faculty_name', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S2_1StudentArticle)
class S2_1StudentArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'journal_name', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'author_type')
    search_fields = ('title', 'journal_name', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S2_2StudentConferencePaper)
class S2_2StudentConferencePaperAdmin(admin.ModelAdmin):
    list_display = ('title', 'conference_details', 'author_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'conference_status', 'mode')
    search_fields = ('title', 'conference_details', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S2_3StudentSponsoredProject)
class S2_3StudentSponsoredProjectAdmin(admin.ModelAdmin):
    list_display = ('project_title', 'student_name', 'sponsored_by', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('project_title', 'student_name', 'sponsored_by', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S3_1CompetitionParticipation)
class S3_1CompetitionParticipationAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'activity_type', 'organized_by', 'level', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'level')
    search_fields = ('student_name', 'activity_type', 'organized_by', 'user__username')
    ordering = ('-date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S3_2DeptProgram)
class S3_2DeptProgramAdmin(admin.ModelAdmin):
    list_display = ('program_name', 'program_type', 'level', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'level')
    search_fields = ('program_name', 'program_type', 'user__username')
    ordering = ('-date',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S4_1StudentExamQualification)
class S4_1StudentExamQualificationAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'exam_name', 'institution_name', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('student_name', 'exam_name', 'institution_name', 'user__username')
    ordering = ('-admission_year',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S4_2CampusRecruitment)
class S4_2CampusRecruitmentAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'company_name', 'package_offered', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('student_name', 'company_name', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S4_3GovtPSUSelection)
class S4_3GovtPSUSelectionAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'psv_name', 'package_offered', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('student_name', 'psv_name', 'user__username')
    ordering = ('-joining_year',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S4_4PlacementHigherStudies)
class S4_4PlacementHigherStudiesAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'placement_type', 'organization_name', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'placement_type')
    search_fields = ('student_name', 'organization_name', 'institution_joined', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S5_1StudentCertificationCourse)
class S5_1StudentCertificationCourseAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'certification_course', 'certification_type', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'certification_type')
    search_fields = ('student_name', 'certification_course', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S5_2VocationalTraining)
class S5_2VocationalTrainingAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'company_name', 'duration', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username')
    search_fields = ('student_name', 'company_name', 'user__username')
    ordering = ('-year', '-quarter', '-created_at')
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S5_3SpecialMentionAchievement)
class S5_3SpecialMentionAchievementAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'award_name', 'award_level', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'award_level')
    search_fields = ('student_name', 'award_name', 'awarding_organization', 'user__username')
    ordering = ('-date_received',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

@admin.register(S5_4StudentEntrepreneurship)
class S5_4StudentEntrepreneurshipAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'organization_details', 'establishment_year', 'faculty_name', 'department', 'year', 'quarter')
    list_filter = ('department', 'year', 'quarter', 'user__username', 'sector')
    search_fields = ('student_name', 'organization_details', 'sector', 'user__username')
    ordering = ('-establishment_year',)
    readonly_fields = ('user', 'department', 'created_at', 'updated_at')
    def faculty_name(self, obj): return obj.faculty_name
    faculty_name.short_description = 'Faculty Name'
    faculty_name.admin_order_field = 'user__username'

