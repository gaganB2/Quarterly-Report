# src/backend/t1_research/serializers.py

from rest_framework import serializers
from .models import T1_2ResearchArticle
from .models import T1_ResearchArticle, Department
from .models import T2_1WorkshopAttendance
from .models import T2_2WorkshopOrganized
from .models import T3_1BookPublication
from .models import T3_2ChapterPublication
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

class T1ResearchArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = T1_ResearchArticle
        fields = [
            "id",
            "user",
            "faculty_name",
            "title",
            "author_type",
            "internal_authors",
            "external_authors",
            "journal_name",
            "volume",
            "issue",
            "page_no",
            "publication_month_year",
            "issn_number",
            "impact_factor",
            "publisher",
            "indexing_wos",
            "indexing_scopus",
            "indexing_ugc",
            "indexing_other",
            "doi",
            "document_link",
            "google_drive_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class T1_2ResearchArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = T1_2ResearchArticle
        fields = [
            "id",
            "user",
            "faculty_name",
            "title",
            "author_type",
            "internal_authors",
            "external_authors",
            "conference_details",
            "isbn_issn",
            "publisher",
            "page_no",
            "publication_month_year",
            "indexing_scopus",
            "indexing_other",
            "conference_status",
            "conference_mode",
            "registration_fee_reimbursed",
            "special_leave_dates",
            "certificate_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]

class T2_1WorkshopAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = T2_1WorkshopAttendance
        fields = [
            "id",
            "user",
            "faculty_name",
            "program_name",
            "organizer",
            "place",
            "start_date",
            "end_date",
            "num_days",
            "mode",
            "registration_fee_reimbursed",
            "special_leave_dates",
            "certificate_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]


class T2_2WorkshopOrganizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = T2_2WorkshopOrganized
        fields = [
            "id",
            "user",
            "faculty_name",
            "role",
            "activity_type",
            "program_name",
            "organized_by_dept",
            "place",
            "start_date",
            "end_date",
            "num_days",
            "mode",
            "num_participants",
            "collaborator",
            "report_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]

class T3_1BookPublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = T3_1BookPublication
        fields = [
            "id",
            "user",
            "faculty_name",
            "book_title",
            "author_type",
            "publisher_details",
            "isbn_number",
            "indexing",
            "publication_year",
            "print_mode",
            "book_type",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]

class T3_2ChapterPublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = T3_2ChapterPublication
        fields = [
            "id",
            "user",
            "faculty_name",
            "chapter_title",
            "author_type",
            "publisher_details",
            "isbn_number",
            "indexing",
            "publication_year",
            "book_type",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "department", "created_at", "updated_at"]

class T4_1EditorialBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = T4_1EditorialBoard
        fields = [
            "id",
            "user",
            "faculty_name",
            "title",
            "role",
            "publisher",
            "issn_isbn",
            "indexing",
            "year",
            "type",
            "proof_link",
            "department",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T4_2ReviewerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = T4_2ReviewerDetails
        fields = [
            "id",
            "user",
            "faculty_name",
            "publication_type",
            "title",
            "indexing",
            "issn_isbn",
            "publisher",
            "year",
            "type",
            "proof_link",
            "department",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class T4_3CommitteeMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = T4_3CommitteeMembership
        fields = [
            "id",
            "user",
            "faculty_name",
            "body_details",
            "responsibility",
            "level",
            "other_details",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]



class T5_1PatentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_1PatentDetails
        fields = [
            "id",
            "user",
            "faculty_name",
            "title",
            "internal_co_inventors",
            "external_co_inventors",
            "ipr_type",
            "application_number",
            "status",
            "filled_date",
            "published_granted_date",
            "publication_number",
            "technology_transfer",
            "country",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T5_2SponsoredProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_2SponsoredProject
        fields = [
            "id",
            "user",
            "principal_investigator",
            "co_principal_investigator",
            "members",
            "funding_agency",
            "project_title",
            "sanctioned_order_no",
            "sanctioned_date",
            "status",
            "completion_date",
            "sanctioned_amount_lakhs",
            "amount_received_rupees",
            "duration",
            "regionality",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T5_3ConsultancyProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_3ConsultancyProject
        fields = [
            "id",
            "user",
            "internal_faculty",
            "external_faculty",
            "client_name",
            "title",
            "sanctioned_order_no",
            "sanctioned_date",
            "sanctioned_amount_lakhs",
            "amount_received_rupees",
            "status",
            "duration",
            "regionality",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T5_4CourseDevelopmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_4CourseDevelopment
        fields = [
            "id",
            "user",
            "faculty_name",
            "course_module_name",
            "platform",
            "contributory_institute",
            "usage_citation",
            "amount_spent",
            "launch_date",
            "link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T5_5LabEquipmentDevelopmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_5LabEquipmentDevelopment
        fields = [
            "id",
            "user",
            "lab_name",
            "major_equipment",
            "purpose",
            "equipment_cost",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]



class T5_6ResearchGuidanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = T5_6ResearchGuidance
        fields = [
            "id",
            "user",
            "faculty_name",
            "role",
            "candidate_name",
            "enrollment_number",
            "thesis_title",
            "registration_date",
            "viva_voce_date",
            "external_examiner_details",
            "status",
            "research_center",
            "conferring_university",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T6_1CertificationCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_1CertificationCourse
        fields = [
            "id",
            "user",
            "faculty_name",
            "certification_course",
            "course_name",
            "category",
            "duration",
            "credit_points",
            "certification_type",
            "certificate_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class T6_2ProfessionalBodyMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_2ProfessionalBodyMembership
        fields = [
            "id",
            "user",
            "faculty_name",
            "institution_name",
            "membership_grade",
            "membership_number",
            "year_of_election",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

from .models import T6_3Award

class T6_3AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_3Award
        fields = [
            "id",
            "user",
            "faculty_name",
            "award_name",
            "conferred_by",
            "award_date",
            "award_type",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]



class T6_4ResourcePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_4ResourcePerson
        fields = [
            "id",
            "user",
            "faculty_name",
            "invited_by",
            "lecture_title",
            "date",
            "duration_hours",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

from .models import T6_5AICTEInitiative

class T6_5AICTEInitiativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_5AICTEInitiative
        fields = [
            "id",
            "user",
            "faculty_name",
            "initiative_name",
            "date",
            "role",
            "organizing_institute",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class T6_5AICTEInitiativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = T6_5AICTEInitiative
        fields = [
            "id",
            "user",
            "faculty_name",
            "initiative_name",
            "date",
            "role",
            "organizing_institute",
            "proof_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
class T7_1ProgramOrganizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = T7_1ProgramOrganized
        fields = [
            "id",
            "user",
            "organizer_name",
            "event_name",
            "event_type",
            "start_date",
            "end_date",
            "num_days",
            "mode",
            "participants_count",
            "collaborator_details",
            "report_link",
            "department",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]



class S1_1TheorySubjectDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = S1_1TheorySubjectData
        fields = [
            "id",
            "user",
            "department",
            "semester",
            "name_of_subject",
            "subject_code",
            "faculty_name",
            "num_classes",
            "num_students_appeared",
            "num_students_passed",
            "pass_percent",
            "pass_percent_rv",
            "prev_year_pass_percent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S2_1StudentArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = S2_1StudentArticle
        fields = [
            "id",
            "user",
            "department",
            "title",
            "author_type",
            "internal_authors",
            "external_authors",
            "journal_name",
            "volume",
            "issue",
            "page_numbers",
            "month_year",
            "issn_number",
            "impact_factor",
            "publisher",
            "is_wos",
            "is_scopus",
            "is_ugc_care",
            "other_indexing",
            "doi",
            "proof_link",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
class S2_2StudentConferencePaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = S2_2StudentConferencePaper
        fields = [
            "id",
            "user",
            "department",
            "title",
            "author_type",
            "internal_authors",
            "external_authors",
            "conference_details",
            "isbn_issn",
            "publisher",
            "page_numbers",
            "month_year",
            "is_scopus",
            "other_indexing",
            "conference_status",
            "mode",
            "proof_link",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S2_3StudentSponsoredProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = S2_3StudentSponsoredProject
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "semester",
            "project_title",
            "sponsored_by",
            "guide_name",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
class S3_1CompetitionParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = S3_1CompetitionParticipation
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "semester",
            "activity_type",
            "organized_by",
            "date",
            "level",
            "awards",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S3_2DeptProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = S3_2DeptProgram
        fields = [
            "id",
            "user",
            "department",
            "program_name",
            "participants_count",
            "program_type",
            "external_agency",
            "date",
            "level",
            "proof_link",
            "quarter",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
class S4_1StudentExamQualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = S4_1StudentExamQualification
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "batch",
            "exam_name",
            "registration_number",
            "score_detail",
            "pg_programme",
            "admission_year",
            "institution_name",
            "contact_details",
            "email",
            "mobile",
            "social_profile_link",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]


class S4_2CampusRecruitmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = S4_2CampusRecruitment
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "batch",
            "company_name",
            "package_offered",
            "offer_ref_number",
            "contact_details",
            "email",
            "mobile",
            "social_profile_link",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S4_3GovtPSUSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = S4_3GovtPSUSelection
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "batch",
            "exam_name",
            "registration_number",
            "psv_name",
            "package_offered",
            "joining_year",
            "offer_ref_number",
            "contact_details",
            "email",
            "mobile",
            "social_profile_link",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
class S4_4PlacementHigherStudiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = S4_4PlacementHigherStudies
        fields = [
            "id",
            "user",
            "department",
            "student_roll_no",
            "student_name",
            "photo_link",
            "placement_type",
            "organization_name",
            "package_offered",
            "program_name",
            "institution_joined",
            "admission_year",
            "entrepreneurship",
            "email",
            "contact_details",
            "mobile",
            "social_profile_link",
            "offer_ref_number",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S5_1StudentCertificationCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = S5_1StudentCertificationCourse
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "certification_course",
            "category",
            "duration",
            "credit_points",
            "certification_type",
            "certificate_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S5_2VocationalTrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = S5_2VocationalTraining
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "company_name",
            "duration",
            "certificate_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S5_3SpecialMentionAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = S5_3SpecialMentionAchievement
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "award_name",
            "work_title",
            "date_received",
            "awarding_organization",
            "award_amount",
            "award_level",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]

class S5_4StudentEntrepreneurshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = S5_4StudentEntrepreneurship
        fields = [
            "id",
            "user",
            "department",
            "student_name",
            "establishment_year",
            "organization_details",
            "sector",
            "proof_link",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "department",
            "created_at",
            "updated_at",
        ]
