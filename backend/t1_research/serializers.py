# src/backend/t1_research/serializers.py

from rest_framework import serializers
from .models import T1_2ResearchArticle
from .models import T1_ResearchArticle, Department

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
