# quarterly_report/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from t1_research.views import DepartmentViewSet, T1ResearchViewSet,T1_2ResearchViewSet
from users.views import RegisterUserView, GetUserProfileView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r't1research', T1ResearchViewSet, basename='t1research')
router.register(r't1_2research', T1_2ResearchViewSet, basename='t1_2research')


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Faculty routes with both department and t1research access
    path('api/faculty/', include(router.urls)),

    # Auth & Profile
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api-token-auth/', obtain_auth_token),
]
