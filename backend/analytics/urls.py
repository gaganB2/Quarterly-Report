# analytics/urls.py

from django.urls import path
from .views import SubmissionsByDepartmentView

urlpatterns = [
    path(
        'submissions-by-department/', 
        SubmissionsByDepartmentView.as_view(), 
        name='submissions-by-department'
    ),
]