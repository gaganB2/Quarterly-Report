from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from t1_research.views import T1ResearchViewSet, DepartmentViewSet
from users.views import RegisterUserView, GetUserProfileView
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r't1_1', T1ResearchViewSet, basename='t1_1')
router.register(r'departments', DepartmentViewSet, basename='departments')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/faculty/', include(router.urls)),
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api-token-auth/', obtain_auth_token),
]
