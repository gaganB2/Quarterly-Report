# src/backend/t1_research/serializers.py

from rest_framework import serializers
from .models import T1_2ResearchArticle
from .models import T1_ResearchArticle, Department
from .models import T2_1WorkshopAttendance
from .models import T2_2WorkshopOrganized
from .models import T3_1BookPublication
from .models import T3_2ChapterPublication
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
