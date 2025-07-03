from django.contrib import admin
from .models import T1_ResearchArticle, Department

@admin.register(T1_ResearchArticle)
class T1ResearchAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'quarter', 'year', 'created_at']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name']
