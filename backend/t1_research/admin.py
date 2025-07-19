# t1_research/admin.py

from django.contrib import admin
from .models import T1_ResearchArticle, Department
from .models import T1_2ResearchArticle
from .models import T2_1WorkshopAttendance
from .models import T2_2WorkshopOrganized
from .models import T3_1BookPublication
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
