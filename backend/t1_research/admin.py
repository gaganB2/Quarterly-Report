# t1_research/admin.py

from django.contrib import admin
from .models import T1_ResearchArticle, Department
from .models import T1_2ResearchArticle


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
