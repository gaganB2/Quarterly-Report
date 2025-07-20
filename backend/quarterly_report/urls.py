# quarterly_report/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from t1_research.views import T2_2WorkshopOrganizedViewSet
from t1_research.views import T3_1BookPublicationViewSet
from t1_research.views import DepartmentViewSet, T1ResearchViewSet,T1_2ResearchViewSet, T2_1WorkshopAttendanceViewSet
from users.views import RegisterUserView, GetUserProfileView
from t1_research.views import T3_2ChapterPublicationViewSet
from t1_research.views import T4_1EditorialBoardViewSet
from t1_research.views import T4_2ReviewerDetailsViewSet
from t1_research.views import T4_3CommitteeMembershipViewSet
from t1_research.views import T5_1PatentDetailsViewSet
from t1_research.views import T5_2SponsoredProjectViewSet
from t1_research.views import T5_3ConsultancyProjectViewSet
from t1_research.views import T5_4CourseDevelopmentViewSet
from t1_research.views import T5_5LabEquipmentDevelopmentViewSet
from t1_research.views import T5_6ResearchGuidanceViewSet
from t1_research.views import T6_1CertificationCourseViewSet
from t1_research.views import T6_2ProfessionalBodyMembershipViewSet


router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r't1research', T1ResearchViewSet, basename='t1research')
router.register(r't1_2research', T1_2ResearchViewSet, basename='t1_2research')
router.register(r't2_1workshops', T2_1WorkshopAttendanceViewSet, basename='t2_1workshops')
router.register(r't2_2organized', T2_2WorkshopOrganizedViewSet, basename='t2_2organized')
router.register(r't3_1books', T3_1BookPublicationViewSet, basename='t3_1books')
router.register(r't3_2chapters', T3_2ChapterPublicationViewSet, basename='t3_2chapters')
router.register(r't4_1editorial', T4_1EditorialBoardViewSet, basename='t4_1editorial')
router.register(r't4_2reviewers', T4_2ReviewerDetailsViewSet, basename='t4_2reviewers')
router.register(r't4_3committees', T4_3CommitteeMembershipViewSet, basename='t4_3committees')
router.register(r't5_1patents',   T5_1PatentDetailsViewSet,   basename='t5_1patents')
router.register(r't5_2sponsored', T5_2SponsoredProjectViewSet, basename='t5_2sponsored')
router.register(r't5_3consultancy', T5_3ConsultancyProjectViewSet, basename='t5_3consultancy')
router.register(r't5_4content',   T5_4CourseDevelopmentViewSet,  basename='t5_4content')
router.register(r't5_5labequipment', T5_5LabEquipmentDevelopmentViewSet, basename='t5_5labequipment')
router.register(r't5_6research',   T5_6ResearchGuidanceViewSet,   basename='t5_6research')
router.register(r't6_1certcourses', T6_1CertificationCourseViewSet,   basename='t6_1certcourses')
router.register(r't6_2professmb',  T6_2ProfessionalBodyMembershipViewSet, basename='t6_2professmb')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Faculty routes with both department and t1research access
    path('api/faculty/', include(router.urls)),

    # Auth & Profile
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api-token-auth/', obtain_auth_token),
]
