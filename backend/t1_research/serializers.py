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
