# analytics/urls.py

from django.urls import path
from .views import DepartmentSubmissionsView, AnalyticsCategoriesView

urlpatterns = [
    path(
        'department-submissions/', 
        DepartmentSubmissionsView.as_view(), 
        name='department-submissions'
    ),
    path(
        'categories/',
        AnalyticsCategoriesView.as_view(),
        name='analytics-categories'
    ),
]

