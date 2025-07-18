# quarterly_report/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from t1_research.views import T2_2WorkshopOrganizedViewSet

from t1_research.views import DepartmentViewSet, T1ResearchViewSet,T1_2ResearchViewSet, T2_1WorkshopAttendanceViewSet
from users.views import RegisterUserView, GetUserProfileView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r't1research', T1ResearchViewSet, basename='t1research')
router.register(r't1_2research', T1_2ResearchViewSet, basename='t1_2research')
router.register(r't2_1workshops', T2_1WorkshopAttendanceViewSet, basename='t2_1workshops')
router.register(r't2_2organized', T2_2WorkshopOrganizedViewSet, basename='t2_2organized')
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Faculty routes with both department and t1research access
    path('api/faculty/', include(router.urls)),

    # Auth & Profile
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api-token-auth/', obtain_auth_token),
]
